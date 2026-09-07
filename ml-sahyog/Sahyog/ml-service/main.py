import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import PydanticOutputParser
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


# .env file se Gemini key load karega
load_dotenv(dotenv_path=Path(__file__).with_name(".env"))

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
# Verify this against https://ai.google.dev/gemini-api/docs/models before demo day —
# Gemini model version strings change often and a stale one fails as a 404, not a code bug.
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

# Cosine similarity score (0 to 1) at or above which a startup counts as a
# genuine match for a challenge. NOTE: MiniLM's cosine scores run lower than
# people expect — a clearly-correct match (e.g. "drone road detection" vs
# "aerial computer vision for roads") scored ~0.56, not ~0.85+. The deck's
# 80% figure is unrealistic for this specific model; 0.55 reflects what we
# actually observed testing real match/no-match pairs. Retune this if your
# own test pairs suggest a different natural cutoff.
MATCH_THRESHOLD = float(os.getenv("MATCH_THRESHOLD", "0.55"))


# Browser/API se aane wala input
class ChallengeRequest(BaseModel):
    user_input: str = Field(
        min_length=10,
        description="Government officer ki raw problem statement"
    )


# Gemini se expected structured output
class ChallengeSchema(BaseModel):
    title: str = Field(
        description="Suggested concise formal title for the challenge"
    )
    problem_statement: str = Field(
        description="Clear restatement of the officer's problem"
    )
    target_users: str = Field(
        description="Suggested main users"
    )
    suggested_solution: str = Field(
        description="Suggested solution direction, not a confirmed requirement"
    )
    suggested_kpis: list[str] = Field(
        description="3 to 5 suggested measurable KPIs for officer review"
    )
    estimated_budget_inr: int | None = Field(
        default=None,
        description=(
            "Budget in INR only when explicitly stated by the officer; "
            "otherwise null"
        )
    )
    assumptions: list[str] = Field(
        description="Assumptions made while creating this draft"
    )
    missing_information: list[str] = Field(
        description="Important details the officer must provide before approval"
    )
    review_status: str = Field(
        default="draft",
        description="Always draft until an officer approves it"
    )


# --- Matchmaking request/response shapes ---

class StartupProfile(BaseModel):
    id: str = Field(description="Startup's unique ID, as sent by Node.js")
    profile_text: str = Field(
        min_length=5,
        description="What the startup does, in plain text"
    )


class MatchRequest(BaseModel):
    challenge_text: str = Field(
        min_length=5,
        description="The challenge's title + KPIs + description, combined into one text block"
    )
    startups: list[StartupProfile] = Field(
        min_length=1,
        description="Candidate startups to score against this challenge"
    )


class MatchResult(BaseModel):
    id: str
    similarity_score: float = Field(description="Raw cosine similarity, 0 to 1")
    match_percentage: float = Field(description="similarity_score expressed as 0 to 100")
    is_match: bool = Field(description=f"True if similarity_score >= {MATCH_THRESHOLD}")


# --- Anti-bias screening request/response shapes ---

class BiasScreenRequest(BaseModel):
    challenge_text: str = Field(
        min_length=10,
        description="Draft challenge text to screen — title + problem statement + KPIs combined"
    )


class BiasFlag(BaseModel):
    phrase: str = Field(description="The exact restrictive or biased phrase found in the text")
    category: str = Field(
        description=(
            "One of: brand_name (names a specific vendor/product), "
            "disproportionate_eligibility (turnover, experience, or scale "
            "requirement that isn't justified by the actual outcome needed), "
            "non_outcome_based (prescribes a specific technology/method "
            "instead of a measurable result)"
        )
    )
    reason: str = Field(description="Why this phrase restricts fair competition")
    suggested_rewrite: str = Field(description="An outcome-based replacement for this phrase")


class BiasScreenSchema(BaseModel):
    is_clean: bool = Field(description="True only if no flags were raised")
    flags: list[BiasFlag] = Field(description="All restrictive/biased phrases found, empty if none")
    overall_assessment: str = Field(
        description="One or two sentences summarizing how outcome-based and fair this draft is"
    )


llm = ChatGoogleGenerativeAI(
    model=GEMINI_MODEL,
    google_api_key=GOOGLE_API_KEY
)

parser = PydanticOutputParser(
    pydantic_object=ChallengeSchema
)

bias_parser = PydanticOutputParser(
    pydantic_object=BiasScreenSchema
)

# Loaded ONCE here at module level, not inside the route — loading it per
# request would add ~10 seconds to every call. First run downloads the
# model (~90MB) from Hugging Face, so it needs internet the first time.
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

app = FastAPI(
    title="Project Sahyog — Challenge Formulator"
)

# Node.js backend calls this service server-to-server, so CORS isn't strictly
# required — but enabled here so the service can also be hit directly from a
# browser during local testing/demo without extra setup.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def formulate_challenge(user_input: str) -> ChallengeSchema:
    prompt = f"""
You are an AI challenge formulation assistant for a
government startup challenge platform called Project Sahyog.

Convert the government officer's raw problem statement into a
clear, practical, and measurable technical challenge.

Rules:
1. Create a concise formal title.
2. Clearly restate the officer's core problem.
3. Identify likely target users.
4. Provide a suggested solution direction, not a confirmed requirement.
5. Generate 3 to 5 suggested measurable KPIs for officer review.
6. Never invent or estimate a budget.
7. Extract a budget in INR only if the officer explicitly states one.
8. If no exact budget is stated, return null for estimated_budget_inr.
9. List assumptions you made.
10. List missing information required before the challenge can be approved.
11. Set review_status to "draft".
12. Return only the requested format.

Raw problem statement:
{user_input}

{parser.get_format_instructions()}
"""

    response = llm.invoke(prompt)
    response_content = response.content

    if isinstance(response_content, list):
        response_text = "".join(
            block.get("text", "")
            for block in response_content
            if isinstance(block, dict) and block.get("type") == "text"
        )
    else:
        response_text = response_content

    return parser.parse(response_text)


def screen_bias(challenge_text: str) -> BiasScreenSchema:
    prompt = f"""
You are an anti-bias reviewer for Project Sahyog, a government
startup-challenge platform. Government procurement rules require
challenge statements to be outcome-based and open to fair
competition — not written to favor one vendor or exclude
early-stage startups.

Read the draft challenge text below and flag anything that would
restrict fair competition:

1. Brand or vendor names (e.g. "HP servers", "AWS-based", "built
   on Salesforce") — the requirement should describe the outcome
   needed, not name a specific product.
2. Disproportionate eligibility conditions (e.g. "₹50 Crore annual
   turnover", "10 years of experience", "500 employees") that
   exclude legitimate early-stage startups without being justified
   by the actual scale of the problem.
3. Non-outcome-based specs — text that prescribes a specific
   technology or implementation method instead of a measurable
   result (e.g. "must use blockchain" instead of "must provide a
   tamper-evident audit log").

For each issue found, quote the exact phrase, categorize it,
explain why it restricts competition, and suggest an outcome-based
rewrite.

If the text is already outcome-based and fair, return is_clean =
true and an empty flags list — do not invent issues that aren't
there.

Draft challenge text:
{challenge_text}

{bias_parser.get_format_instructions()}
"""

    response = llm.invoke(prompt)
    response_content = response.content

    if isinstance(response_content, list):
        response_text = "".join(
            block.get("text", "")
            for block in response_content
            if isinstance(block, dict) and block.get("type") == "text"
        )
    else:
        response_text = response_content

    return bias_parser.parse(response_text)


@app.get("/")
def home():
    return FileResponse(
        Path(__file__).parent / "templates" / "index.html"
    )


@app.get("/match")
def match_ui():
    return FileResponse(
        Path(__file__).parent / "templates" / "match.html"
    )


@app.get("/bias")
def bias_ui():
    return FileResponse(
        Path(__file__).parent / "templates" / "bias.html"
    )


@app.get("/health")
def health():
    # Lets the Node.js backend (or you, during setup) check the service is
    # up and the API key is actually loaded, before trying a real request.
    return {
        "status": "ok",
        "gemini_key_loaded": bool(GOOGLE_API_KEY),
        "model": GEMINI_MODEL,
    }


@app.post("/formulate-challenge")
def create_challenge(request: ChallengeRequest):
    try:
        challenge = formulate_challenge(request.user_input)
        return challenge.model_dump()

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@app.post("/screen-bias")
def screen_bias_endpoint(request: BiasScreenRequest):
    try:
        result = screen_bias(request.challenge_text)

        # Deck's design: bias detected -> 406 Not Acceptable blocks the
        # officer from publishing. Body still carries the full breakdown
        # either way, so the caller can show exactly what was flagged.
        status_code = 200 if result.is_clean else 406
        return JSONResponse(status_code=status_code, content=result.model_dump())

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@app.post("/match-startups")
def match_startups(request: MatchRequest):
    try:
        challenge_vector = embedding_model.encode([request.challenge_text])
        startup_texts = [s.profile_text for s in request.startups]
        startup_vectors = embedding_model.encode(startup_texts)

        scores = cosine_similarity(challenge_vector, startup_vectors)[0]

        results = [
            MatchResult(
                id=startup.id,
                similarity_score=round(float(score), 4),
                match_percentage=round(float(score) * 100, 2),
                is_match=bool(score >= MATCH_THRESHOLD),
            )
            for startup, score in zip(request.startups, scores)
        ]

        # Best matches first
        results.sort(key=lambda r: r.similarity_score, reverse=True)

        return {"results": [r.model_dump() for r in results]}

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
