"""
Sahyog TRL Engine - FastAPI Server
Run this to get a live Swagger UI for testing the TRL Engine in your browser.

Usage:
    $env:GOOGLE_API_KEY = "your-key"
    python ml_service/app.py

Then open: http://localhost:8000/docs
"""

import os
import sys
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

# Set the API key from .env if not already set
from pathlib import Path
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    for line in env_path.read_text().strip().splitlines():
        if "=" in line and not line.startswith("#"):
            key, val = line.split("=", 1)
            os.environ.setdefault(key.strip(), val.strip())

from trl_engine.evaluator import generate_trl_questions, verify_and_score_trl
from trl_engine.rules import compute_verified_trl, get_tier_for_trl, SOFTWARE_TRL_TIERS
from trl_engine.schemas import TRLVerificationResult, TRLQuestions
from trl_engine.hardware_verifier import router as hardware_router
from api.matchmaking import router as matchmaking_router
from api.sandbox import router as sandbox_router
from api.redaction import router as redaction_router
from api.formulate import router as formulate_router

# ── FastAPI App ──────────────────────────────
app = FastAPI(
    title="Sahyog TRL Engine",
    description=(
        "Zero-Trust Technology Readiness Level Evaluator for GovTech.\n\n"
        "**Test the API:**\n"
        "1. Use `/generate-questions` to get 3 technical questions for a startup\n"
        "2. Use `/verify-trl` to run the full Zero-Trust verification\n"
        "3. Use `/quick-downgrade` to test the deterministic rule engine alone (no LLM)"
    ),
    version="1.0.0",
)

app.include_router(hardware_router)
app.include_router(matchmaking_router, tags=["S1 Semantic Triage"])
app.include_router(sandbox_router, tags=["S2 API Sandbox"])
app.include_router(redaction_router, tags=["S3 Double-Blind QCBS"])
app.include_router(formulate_router, tags=["Challenge Formulator"])

# ── Request/Response Models ──────────────────

class QuestionRequest(BaseModel):
    startup_pitch: str = Field(
        ...,
        example="We built a drone-based pothole detection system using computer vision. Our API is live on AWS EC2.",
        description="The startup's description of their solution"
    )
    claimed_trl: int = Field(
        ..., ge=1, le=9,
        example=5,
        description="The TRL level the startup claims (1-9)"
    )
    domain: str = Field(
        default="SOFTWARE",
        example="SOFTWARE",
        description="Domain of the startup, either 'SOFTWARE' or 'HARDWARE'"
    )


class VerifyRequest(BaseModel):
    questions: list[str] = Field(
        ...,
        example=[
            "Describe your cloud deployment architecture.",
            "How do you handle API authentication?",
            "What is your error handling strategy?"
        ],
        description="The 3 verification questions that were asked"
    )
    user_answers: list[str] = Field(
        ...,
        example=[
            "Deployed on EC2 behind Nginx with PostgreSQL RDS.",
            "JWT tokens with 24hr expiry and rate limiting.",
            "Structured JSON errors with proper HTTP status codes."
        ],
        description="The startup's answers to the questions"
    )
    claimed_trl: int = Field(
        ..., ge=1, le=9,
        example=5,
        description="The TRL level the startup claims (1-9)"
    )
    backend_proofs: dict = Field(
        ...,
        example={
            "github_verified": True,
            "live_url_verified": True,
            "dns_verified": False,
            "security_cert_verified": False,
        },
        description="Proof signals from the Node.js backend"
    )


class DowngradeRequest(BaseModel):
    claimed_trl: int = Field(..., ge=1, le=9, example=7)
    backend_proofs: dict = Field(
        ...,
        example={
            "github_verified": True,
            "live_url_verified": False,
            "dns_verified": False,
            "security_cert_verified": False,
        },
    )


class DowngradeResponse(BaseModel):
    claimed_trl: int
    verified_trl: int
    is_fraud: bool
    downgrade_reason: str | None


class HardwareVisionRequest(BaseModel):
    expected_security_code: str = Field(
        ..., 
        example="SAHYOG-99X",
        description="The secret code the founder was asked to write on paper"
    )
    base64_image: str = Field(
        ...,
        description="Base64 encoded JPEG/PNG image string from the video frame"
    )


# ── Endpoints ────────────────────────────────

@app.get("/", tags=["Health"])
def health():
    """Health check - confirms the server is running."""
    return {"status": "ok", "service": "Sahyog TRL Engine", "version": "1.0.0"}


@app.get("/trl-tiers", tags=["Reference"])
def list_trl_tiers():
    """List all predefined TRL tiers and their required proofs."""
    return [
        {
            "name": t.name,
            "trl_range": f"TRL {t.trl_range[0]}-{t.trl_range[1]}",
            "required_proof": t.required_proof_key,
            "description": t.description,
        }
        for t in SOFTWARE_TRL_TIERS
    ]


@app.post("/generate-questions", response_model=TRLQuestions, tags=["TRL Engine"])
def api_generate_questions(req: QuestionRequest):
    """
    TASK 1: Generate 3 technical verification questions for a startup.

    Enter the startup's pitch and their claimed TRL level.
    The AI will generate 3 deeply technical questions targeting that specific tier.
    """
    try:
        return generate_trl_questions(req.startup_pitch, req.claimed_trl, req.domain)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/evaluate-software-trl", response_model=TRLVerificationResult, tags=["TRL Engine"])
def api_verify_trl(req: VerifyRequest):
    """
    TASK 2: Zero-Trust Verification & Downgrade Engine.

    Provide the questions, answers, claimed TRL, and backend proofs.
    The system will:
    1. Run the deterministic downgrade algorithm
    2. Use LLM to evaluate answer quality
    3. Return the final verified TRL with fraud detection
    """
    if len(req.questions) != len(req.user_answers):
        raise HTTPException(400, "questions and user_answers must have the same length")
    try:
        return verify_and_score_trl(
            questions=req.questions,
            user_answers=req.user_answers,
            claimed_trl=req.claimed_trl,
            backend_proofs=req.backend_proofs,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/quick-downgrade", response_model=DowngradeResponse, tags=["Rule Engine"])
def api_quick_downgrade(req: DowngradeRequest):
    """
    Test the deterministic downgrade algorithm WITHOUT calling the LLM.

    This is instant and free - use it to understand how the rule engine works.
    Try different combinations of claimed_trl and backend_proofs to see the downgrade logic.
    """
    verified, fraud, reason = compute_verified_trl(req.claimed_trl, req.backend_proofs)
    return DowngradeResponse(
        claimed_trl=req.claimed_trl,
        verified_trl=verified,
        is_fraud=fraud,
        downgrade_reason=reason,
    )


# ── Run Server ───────────────────────────────
if __name__ == "__main__":
    print("\n  Sahyog TRL Engine starting...")
    print("  Open your browser: http://localhost:8000/docs\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
