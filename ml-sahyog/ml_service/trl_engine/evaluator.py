"""
Sahyog TRL Engine â€” Zero-Trust TRL Evaluator
LangChain + Gemini implementation for Question Generation & Verification.

Architecture:
  - LLM is used ONLY for: (1) generating smart questions, (2) evaluating answer quality.
  - LLM is NEVER used for: deciding TRL scores or interpreting backend proofs.
  - Downgrade logic is pure deterministic Python (see rules.py).
"""

import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser

from .schemas import TRLQuestions, TRLVerificationResult, BackendProofs
from .rules import get_tier_for_trl, compute_verified_trl, SOFTWARE_TRL_TIERS


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# LLM Initialization (loaded ONCE at import)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
_llm = None


def _get_llm() -> ChatGoogleGenerativeAI:
    """Lazy-load the Gemini LLM. Loaded once, reused across all calls."""
    global _llm
    if _llm is None:
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
            raise EnvironmentError(
                "GOOGLE_API_KEY environment variable is not set. "
                "Get one from https://aistudio.google.com/app/apikey"
            )
        _llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=api_key,
            temperature=0.3,       # Low temp for deterministic, focused output
            max_output_tokens=8192,
        )
    return _llm


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# TASK 1: Rule-Based Question Generator
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

# The prompt is designed so the LLM generates questions that target
# the SPECIFIC verification focus of the claimed tier â€” not generic
# startup questions. The predefined rules are injected as context.

_QUESTION_GEN_PROMPT = ChatPromptTemplate.from_messages([
    ("human", """You are a senior government technology auditor for India's GovTech procurement platform.
Your job is to generate EXACTLY 3 highly technical verification questions for a startup.

CRITICAL RULES:
- The startup claims TRL {claimed_trl}, which falls in the "{tier_name}" tier ({trl_range}).
- You must generate questions that SPECIFICALLY verify capabilities at THIS tier level.
- Questions must be deeply technical - they should be impossible to answer convincingly
  without actually having built the technology at the claimed level.
- Do NOT ask generic startup questions (e.g., "What problem do you solve?").
- Do NOT ask questions below the claimed tier (e.g., if they claim TRL 6, don't ask about basic coding).
- Questions should probe: {verification_focus}

The startup's pitch/description:
"{startup_pitch}"

{format_instructions}"""),
])


def generate_trl_questions(startup_pitch: str, claimed_trl: int) -> TRLQuestions:
    """
    TASK 1: Generate 3 technical verification questions for a startup's claimed TRL.

    The questions are tailored to the specific tier the startup claims.
    A TRL 6 claim gets production-architecture questions, not idea-stage questions.

    Args:
        startup_pitch: The startup's description of their solution.
        claimed_trl: The TRL level they claim (1-9).

    Returns:
        TRLQuestions with exactly 3 targeted technical questions.
    """
    tier = get_tier_for_trl(claimed_trl)
    parser = PydanticOutputParser(pydantic_object=TRLQuestions)

    chain = _QUESTION_GEN_PROMPT | _get_llm() | parser

    result = chain.invoke({
        "claimed_trl": claimed_trl,
        "tier_name": tier.name,
        "trl_range": f"TRL {tier.trl_range[0]}-{tier.trl_range[1]}",
        "verification_focus": tier.verification_focus,
        "startup_pitch": startup_pitch,
        "format_instructions": parser.get_format_instructions(),
    })

    return result


# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
# TASK 2: Zero-Trust Verifier & Downgrade Engine
# â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

# This prompt asks the LLM ONLY to evaluate the technical quality of
# the answers. The actual TRL scoring is done by deterministic Python.

_VERIFICATION_PROMPT = ChatPromptTemplate.from_messages([
    ("human", """You are a senior government technology auditor performing a Zero-Trust TRL verification.

CONTEXT:
- The startup claims TRL {claimed_trl} ("{tier_name}" tier).
- They were asked 3 technical verification questions and provided answers.
- Our backend has independently verified their digital proofs (results below).

YOUR TASK (Technical Evaluation ONLY):
Evaluate the QUALITY of their text answers. Score each answer:
- Are the answers technically specific, or vague hand-waving?
- Do the answers demonstrate genuine engineering knowledge at the claimed level?
- Do the answers sound AI-generated or templated (red flag for fraud)?
- Rate your overall technical confidence from 0.0 (zero confidence) to 1.0 (fully convincing).

IMPORTANT - YOU DO NOT DECIDE THE FINAL TRL SCORE.
The final TRL is computed by our deterministic rule engine based on backend proofs.
You provide ONLY the technical_confidence score and evaluation_report.

QUESTIONS AND ANSWERS:
{qa_pairs}

BACKEND PROOF RESULTS (from our Node.js automated checks):
{proof_summary}

RULE ENGINE DECISION (pre-computed, non-negotiable):
- Claimed TRL: {claimed_trl}
- Verified TRL (by rule engine): {verified_trl}
- Fraud Detected: {is_fraud}
- Downgrade Reason: {downgrade_reason}

Based on the above, write your evaluation_report. Include:
1. Technical assessment of each answer.
2. Whether the answers are consistent with the verified TRL level.
3. Final recommendation summary.

{format_instructions}"""),
])


def verify_and_score_trl(
    questions: list[str],
    user_answers: list[str],
    claimed_trl: int,
    backend_proofs: dict,
) -> TRLVerificationResult:
    """
    TASK 2: Zero-Trust Verification & Downgrade Engine.

    This function enforces a strict separation of concerns:
      1. DETERMINISTIC (Python): The downgrade algorithm runs first using
         backend_proofs. This is NON-NEGOTIABLE â€” no LLM can override it.
      2. LLM (Gemini): Evaluates the technical quality of the text answers
         and produces a confidence score + evaluation report.

    The final output merges both: the rule engine's TRL decision + the LLM's
    qualitative assessment.

    Args:
        questions: The 3 verification questions that were asked.
        user_answers: The startup's answers to those questions.
        claimed_trl: The TRL level the startup claims (1-9).
        backend_proofs: Dict from Node.js backend with verification results.
            Expected keys: github_verified, live_url_verified,
                          dns_verified, security_cert_verified

    Returns:
        TRLVerificationResult with fraud detection, verified TRL, confidence,
        and detailed evaluation report.
    """
    # â”€â”€ STEP 1: Deterministic Rule Engine (NO LLM) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    verified_trl, is_fraud, downgrade_reason = compute_verified_trl(
        claimed_trl=claimed_trl,
        backend_proofs=backend_proofs,
    )

    tier = get_tier_for_trl(claimed_trl)

    # â”€â”€ STEP 2: Format Q&A pairs for the LLM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    qa_pairs = ""
    for i, (q, a) in enumerate(zip(questions, user_answers), start=1):
        qa_pairs += f"Q{i}: {q}\nA{i}: {a}\n\n"

    # Format backend proof summary for context
    proof_summary = "\n".join(
        f"  - {key}: {'PASSED' if val else 'FAILED'}"
        for key, val in backend_proofs.items()
    )

    # â”€â”€ STEP 3: LLM Technical Evaluation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    parser = PydanticOutputParser(pydantic_object=TRLVerificationResult)

    chain = _VERIFICATION_PROMPT | _get_llm() | parser

    try:
        result = chain.invoke({
            "claimed_trl": claimed_trl,
            "tier_name": tier.name,
            "qa_pairs": qa_pairs,
            "proof_summary": proof_summary,
            "verified_trl": verified_trl,
            "is_fraud": is_fraud,
            "downgrade_reason": downgrade_reason or "None - all proofs passed.",
            "format_instructions": parser.get_format_instructions(),
        })
    except Exception as e:
        # Fallback: if LLM output is truncated or unparseable,
        # construct the result manually with rule engine values.
        result = TRLVerificationResult(
            is_fraud_detected=is_fraud,
            claimed_trl=claimed_trl,
            final_verified_trl=verified_trl,
            technical_confidence=0.0,
            downgrade_reason=downgrade_reason,
            evaluation_report=(
                f"LLM evaluation failed ({type(e).__name__}). "
                f"Rule engine decision stands: Claimed TRL {claimed_trl}, "
                f"Verified TRL {verified_trl}. Fraud: {is_fraud}. "
                f"Reason: {downgrade_reason or 'N/A'}"
            ),
        )

    # â”€â”€ STEP 4: OVERRIDE â€” Rule engine always wins â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    # The LLM might hallucinate different values. We forcefully
    # overwrite the critical fields with the deterministic results.
    result.claimed_trl = claimed_trl
    result.final_verified_trl = verified_trl
    result.is_fraud_detected = is_fraud
    result.downgrade_reason = downgrade_reason

    return result

