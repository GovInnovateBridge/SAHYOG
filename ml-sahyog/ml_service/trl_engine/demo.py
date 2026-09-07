"""
Sahyog TRL Engine - Demo & Test Script
Run this to see the full Zero-Trust TRL evaluation pipeline in action.

Usage:
    1. Set your Gemini API key:
       $env:GOOGLE_API_KEY = "your-key-here"    (PowerShell)
       
    2. Install dependencies:
       pip install -r requirements.txt

    3. Run the demo:
       python -m ml_service.trl_engine.demo
"""

import os
import sys
import json

# Fix Windows console encoding for Unicode
sys.stdout.reconfigure(encoding='utf-8')

# Load .env file automatically
from pathlib import Path
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
if env_path.exists():
    for line in env_path.read_text().strip().splitlines():
        if "=" in line and not line.startswith("#"):
            key, val = line.split("=", 1)
            os.environ.setdefault(key.strip(), val.strip())

def run_demo():
    """Run a complete TRL evaluation demo with two scenarios."""
    from .evaluator import generate_trl_questions, verify_and_score_trl
    from .rules import compute_verified_trl

    print("=" * 70)
    print("  SAHYOG - Zero-Trust TRL Evaluator Demo")
    print("=" * 70)

    # ------------------------------------------
    # SCENARIO 1: Honest Startup (TRL 4, proofs pass)
    # ------------------------------------------
    print("\n" + "-" * 70)
    print("  SCENARIO 1: Honest Startup - Claims TRL 5, has valid proofs")
    print("-" * 70)

    startup_pitch_1 = (
        "We built a computer vision system for detecting potholes on Indian roads "
        "using drone imagery. Our REST API is deployed on AWS EC2 and accepts "
        "aerial images, returning pothole coordinates with severity scores. "
        "We have Swagger docs and the API handles 100 requests/minute."
    )

    print("\n[PITCH] Startup Pitch:", startup_pitch_1)
    print("\n[GENERATING] TRL verification questions for claimed TRL 5...\n")

    questions_1 = generate_trl_questions(startup_pitch_1, claimed_trl=5)
    print(f"  Tier: {questions_1.trl_tier}")
    for i, q in enumerate(questions_1.questions, 1):
        print(f"  Q{i}: {q}")

    # Simulate startup answers
    fake_answers_1 = [
        "Our API is deployed on a t3.medium EC2 instance behind an Nginx reverse proxy. "
        "We use a PostgreSQL RDS instance for storing detection results. The endpoint "
        "POST /api/v1/detect accepts multipart image uploads and returns JSON with "
        "coordinates, confidence scores, and severity classification.",

        "Authentication is handled via JWT tokens with 24-hour expiry. We use rate "
        "limiting at 100 req/min per API key via express-rate-limit. Our Swagger docs "
        "are auto-generated from our OpenAPI 3.0 spec file.",

        "We handle errors with structured JSON responses including error codes. "
        "The model inference runs on CPU and takes ~2.3 seconds per image. For large "
        "batches, we queue jobs via Bull/Redis and return a job ID for polling.",
    ]

    # Backend proofs - this startup is legitimate
    proofs_1 = {
        "github_verified": True,
        "live_url_verified": True,   # URL responds 200 OK
        "dns_verified": False,       # Not claimed, doesn't matter
        "security_cert_verified": False,
    }

    print("\n[PROOFS] Backend Proofs:", json.dumps(proofs_1, indent=2))
    print("\n[VERIFYING] Running Zero-Trust Verification...\n")

    result_1 = verify_and_score_trl(
        questions=questions_1.questions,
        user_answers=fake_answers_1,
        claimed_trl=5,
        backend_proofs=proofs_1,
    )

    print(f"  [RESULT] Claimed TRL:          {result_1.claimed_trl}")
    print(f"  [RESULT] Verified TRL:         {result_1.final_verified_trl}")
    print(f"  [RESULT] Fraud Detected:       {result_1.is_fraud_detected}")
    print(f"  [RESULT] Technical Confidence: {result_1.technical_confidence}")
    print(f"  [RESULT] Downgrade Reason:     {result_1.downgrade_reason or 'None'}")
    print(f"\n  [REPORT] Evaluation Report:\n  {result_1.evaluation_report}")

    # ------------------------------------------
    # SCENARIO 2: Fraudulent Startup (Claims TRL 7, proofs FAIL)
    # ------------------------------------------
    print("\n" + "-" * 70)
    print("  SCENARIO 2: Fraudulent Startup - Claims TRL 7, but proofs FAIL")
    print("-" * 70)

    startup_pitch_2 = (
        "We have an AI-powered traffic management system deployed across 3 cities. "
        "Our platform uses deep learning to optimize traffic signal timing in real-time. "
        "We serve 50,000 daily active users and have a production-grade deployment."
    )

    print("\n[PITCH] Startup Pitch:", startup_pitch_2)
    print("\n[GENERATING] TRL verification questions for claimed TRL 7...\n")

    questions_2 = generate_trl_questions(startup_pitch_2, claimed_trl=7)
    print(f"  Tier: {questions_2.trl_tier}")
    for i, q in enumerate(questions_2.questions, 1):
        print(f"  Q{i}: {q}")

    # Simulate vague/AI-generated answers
    fake_answers_2 = [
        "We use industry-standard best practices for our deployment architecture "
        "with cloud-native technologies and microservices.",

        "Our system is highly scalable and uses advanced algorithms to ensure "
        "optimal performance under various load conditions.",

        "We follow DevOps best practices with automated testing and deployment "
        "pipelines for continuous delivery.",
    ]

    # Backend proofs - THIS IS THE FRAUD CASE
    proofs_2 = {
        "github_verified": True,     # They have code at least
        "live_url_verified": False,   # URL returned 404!
        "dns_verified": False,        # No DNS ownership!
        "security_cert_verified": False,
    }

    print("\n[PROOFS] Backend Proofs:", json.dumps(proofs_2, indent=2))

    # Show the deterministic downgrade BEFORE LLM runs
    verified, fraud, reason = compute_verified_trl(7, proofs_2)
    print(f"\n  [RULE ENGINE] (pre-LLM):")
    print(f"     Downgraded from TRL 7 -> TRL {verified}")
    print(f"     Reason: {reason}")

    print("\n[VERIFYING] Running Zero-Trust Verification...\n")

    result_2 = verify_and_score_trl(
        questions=questions_2.questions,
        user_answers=fake_answers_2,
        claimed_trl=7,
        backend_proofs=proofs_2,
    )

    print(f"  [RESULT] Claimed TRL:          {result_2.claimed_trl}")
    print(f"  [RESULT] Verified TRL:         {result_2.final_verified_trl}")
    print(f"  [RESULT] Fraud Detected:       {result_2.is_fraud_detected}")
    print(f"  [RESULT] Technical Confidence: {result_2.technical_confidence}")
    print(f"  [RESULT] Downgrade Reason:     {result_2.downgrade_reason}")
    print(f"\n  [REPORT] Evaluation Report:\n  {result_2.evaluation_report}")

    print("\n" + "=" * 70)
    print("  Demo Complete.")
    print("=" * 70)


if __name__ == "__main__":
    run_demo()
