"""
Sahyog TRL Engine — Pydantic Schemas
Strict JSON contracts for every input and output of the TRL evaluator.
"""

from pydantic import BaseModel, Field
from typing import Optional


# ──────────────────────────────────────────────
# Output: Question Generator
# ──────────────────────────────────────────────
class TRLQuestions(BaseModel):
    """Output schema for the Rule-Based Question Generator."""
    claimed_trl: int = Field(description="The TRL level the startup claims (1-9)")
    trl_tier: str = Field(description="Human-readable tier name, e.g. 'Cloud Prototype (TRL 4-5)'")
    questions: list[str] = Field(
        description="Exactly 3 highly technical verification questions targeting the claimed tier"
    )


# ──────────────────────────────────────────────
# Input: Backend Proof Dictionary
# ──────────────────────────────────────────────
class BackendProofs(BaseModel):
    """
    Proof signals sent by the Node.js backend after automated checks.
    Each field is True only if the backend has programmatically verified it.
    """
    github_verified: bool = Field(
        default=False,
        description="True if GitHub/GitLab OAuth succeeded AND repo has genuine commit history"
    )
    live_url_verified: bool = Field(
        default=False,
        description="True if the submitted URL returned HTTP 200 and Swagger/API docs were parseable"
    )
    dns_verified: bool = Field(
        default=False,
        description="True if DNS TXT record containing the Sahyog verification token was found"
    )
    security_cert_verified: bool = Field(
        default=False,
        description="True if CERT-In / VAPT certificate QR code was validated against govt database"
    )


# ──────────────────────────────────────────────
# Output: Zero-Trust Verification Result
# ──────────────────────────────────────────────
class TRLVerificationResult(BaseModel):
    """Final output of the Zero-Trust TRL Verifier & Downgrade Engine."""
    is_fraud_detected: bool = Field(
        description="True if the startup's claimed TRL does not match backend proofs"
    )
    claimed_trl: int = Field(
        description="The TRL level the startup originally claimed"
    )
    final_verified_trl: int = Field(
        description="The TRL level awarded after rule enforcement and downgrade logic"
    )
    technical_confidence: float = Field(
        description="0.0 to 1.0 — LLM's confidence in the technical quality of the startup's answers"
    )
    downgrade_reason: Optional[str] = Field(
        default=None,
        description="If downgraded, the specific rule that triggered the downgrade"
    )
    evaluation_report: str = Field(
        description="Detailed explanation of the technical evaluation, proof checks, and final decision"
    )
