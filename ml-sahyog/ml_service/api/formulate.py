"""
Sahyog ML Engine - Challenge Formulator and Anti-Bias Engine
"""
import os
import spacy
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser

router = APIRouter(prefix="/api/ml", tags=["Formulator"])

# ──────────────────────────────────────────────
# Load Models globally (avoid per-request latency)
# ──────────────────────────────────────────────
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # If not downloaded yet
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

_llm = None
def get_llm():
    global _llm
    if _llm is None:
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GOOGLE_API_KEY is missing.")
        _llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=api_key,
            temperature=0.2, # Low temp for structured JSON
        )
    return _llm


# ──────────────────────────────────────────────
# Pydantic Schemas
# ──────────────────────────────────────────────
class RawChallengeRequest(BaseModel):
    raw_text: str = Field(..., description="The raw description of the problem from the government officer.")

class StructuredChallenge(BaseModel):
    title: str = Field(description="A concise, professional title for the challenge")
    problem_statement: str = Field(description="A clear description of the core problem")
    kpis: list[str] = Field(description="List of 3-5 measurable Key Performance Indicators for success")
    timeline_months: int = Field(description="Estimated timeline in months to solve the challenge")
    budget_range: str = Field(description="Estimated budget classification (e.g., 'Low', 'Medium', 'High')")

class FormulateResponse(BaseModel):
    success: bool
    data: Optional[StructuredChallenge] = None
    bias_detected: bool = False
    bias_reason: Optional[str] = None


# ──────────────────────────────────────────────
# Anti-Bias Logic
# ──────────────────────────────────────────────
def run_anti_bias_check(text: str) -> tuple[bool, str]:
    """
    Checks for human bias in the challenge description.
    Returns (has_bias: bool, reason: str)
    """
    # 1. Regex check for financial exclusion (e.g. demanding high turnover)
    turnover_pattern = re.compile(r"turnover of (rs\.?|inr)?\s*\d+\s*(cr|crore|lakh)", re.IGNORECASE)
    if turnover_pattern.search(text):
        return True, "Financial exclusion bias detected: Challenge specifies minimum turnover requirements, which excludes early-stage startups."
    
    # 2. NER check for brand bias (favoring specific companies/vendors)
    doc = nlp(text)
    orgs = [ent.text for ent in doc.ents if ent.label_ == "ORG"]
    
    # List of common tech giants that shouldn't be hard-mandated
    forbidden_brands = ["ibm", "aws", "amazon", "microsoft", "azure", "google", "oracle", "sap", "tcs", "infosys"]
    
    for org in orgs:
        if org.lower() in forbidden_brands:
            return True, f"Vendor bias detected: Challenge explicitly mentions a specific corporate brand or vendor ('{org}'). Government challenges must be vendor-neutral."

    # Passed local deterministic checks
    return False, ""


# ──────────────────────────────────────────────
# Endpoints
# ──────────────────────────────────────────────
@router.post("/formulate", response_model=FormulateResponse)
def formulate_challenge(req: RawChallengeRequest):
    """
    USE CASE 1 & 3: Anti-Bias Filter + Formulator
    Takes a raw, unstructured problem description from an officer and converts it into a structured JSON challenge.
    Automatically rejects the request if bias (vendor preference, turnover requirements) is detected.
    """
    # Step 1: Anti-Bias Filter
    has_bias, reason = run_anti_bias_check(req.raw_text)
    if has_bias:
        # Instead of failing with 406 immediately, we return a 200 with the bias flag set
        # so the frontend can gracefully tell the officer to fix it.
        return FormulateResponse(
            success=False,
            bias_detected=True,
            bias_reason=reason
        )

    # Step 2: LLM Structuring
    parser = PydanticOutputParser(pydantic_object=StructuredChallenge)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Government Procurement Officer. Your job is to take raw, messy problem descriptions and convert them into structured, professional challenge briefs for startups to solve."),
        ("human", "Raw Description:\n{raw_text}\n\n{format_instructions}")
    ])
    
    chain = prompt | get_llm() | parser
    
    try:
        structured_data = chain.invoke({
            "raw_text": req.raw_text,
            "format_instructions": parser.get_format_instructions()
        })
        
        return FormulateResponse(
            success=True,
            data=structured_data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM Formulation failed: {str(e)}")
