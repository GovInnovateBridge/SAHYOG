"""
Sahyog TRL Engine — Predefined Rules (Deterministic, Non-Negotiable)
These rules are NEVER sent to the LLM for interpretation.
The downgrade algorithm is pure Python logic — zero LLM involvement.
"""

from dataclasses import dataclass


# ──────────────────────────────────────────────
# TRL Tier Definitions
# ──────────────────────────────────────────────
@dataclass(frozen=True)
class TRLTier:
    """Immutable definition of a TRL verification tier."""
    name: str
    trl_range: tuple[int, int]       # inclusive (min, max)
    required_proof_key: str          # key in BackendProofs that MUST be True
    description: str                 # what this tier represents
    verification_focus: str          # what the LLM questions should target


# The four predefined tiers for SOFTWARE startups — order matters (highest first)
SOFTWARE_TRL_TIERS: list[TRLTier] = [
    TRLTier(
        name="Commercial Scale",
        trl_range=(8, 9),
        required_proof_key="security_cert_verified",
        description="Product is commercially deployed with paying customers at scale",
        verification_focus=(
            "Production security hardening, CERT-In compliance, VAPT audit results, "
            "incident response procedures, horizontal scaling architecture, SLA commitments, "
            "and enterprise-grade monitoring/observability"
        ),
    ),
    TRLTier(
        name="Live Environment",
        trl_range=(6, 7),
        required_proof_key="dns_verified",
        description="Product is deployed on a production domain with real users",
        verification_focus=(
            "Production server architecture (load balancers, CDN, reverse proxy), "
            "DNS configuration, SSL/TLS setup, CI/CD deployment pipelines, "
            "database replication strategy, and zero-downtime deployment procedures"
        ),
    ),
    TRLTier(
        name="Cloud Prototype",
        trl_range=(4, 5),
        required_proof_key="live_url_verified",
        description="Working prototype deployed on cloud with accessible API endpoints",
        verification_focus=(
            "Cloud deployment architecture (AWS/GCP/Azure), REST API design, "
            "authentication mechanisms, database schema design, error handling strategy, "
            "and API documentation (Swagger/OpenAPI)"
        ),
    ),
    TRLTier(
        name="Local Code",
        trl_range=(1, 3),
        required_proof_key="github_verified",
        description="Idea validated with local codebase and research",
        verification_focus=(
            "Core algorithm design, technology choices and justification, "
            "local development environment, version control practices, "
            "proof-of-concept results, and research methodology"
        ),
    ),
]


def get_tier_for_trl(claimed_trl: int) -> TRLTier:
    """Return the TRL tier definition for a given claimed TRL level."""
    if not 1 <= claimed_trl <= 9:
        raise ValueError(f"TRL must be between 1 and 9, got {claimed_trl}")

    for tier in SOFTWARE_TRL_TIERS:
        if tier.trl_range[0] <= claimed_trl <= tier.trl_range[1]:
            return tier

    # Should never happen given the ranges cover 1-9
    raise ValueError(f"No tier found for TRL {claimed_trl}")


# ──────────────────────────────────────────────
# Zero-Trust Downgrade Algorithm (Pure Python)
# ──────────────────────────────────────────────
def compute_verified_trl(claimed_trl: int, backend_proofs: dict) -> tuple[int, bool, str | None]:
    """
    The FRAUD ALGORITHM — deterministic, no LLM involved.

    Walk DOWN from the claimed tier. The final verified TRL is the HIGHEST
    tier whose required proof passes. If the startup claims TRL 6 but
    `live_url_verified` is False, they cannot hold TRL 4-5 either (which
    also requires live_url_verified), so they fall to TRL 3 (github only).

    Returns:
        (final_verified_trl, is_fraud_detected, downgrade_reason)
    """
    claimed_tier = get_tier_for_trl(claimed_trl)

    # Collect all tiers at or below the claimed tier (highest first)
    candidate_tiers = [
        t for t in SOFTWARE_TRL_TIERS
        if t.trl_range[1] <= claimed_tier.trl_range[1]
    ]

    # Walk down from highest to lowest — first tier that passes wins
    for tier in candidate_tiers:
        proof_key = tier.required_proof_key
        proof_value = backend_proofs.get(proof_key, False)

        if proof_value is True:
            verified_trl = tier.trl_range[1]  # award the top of that tier
            is_fraud = verified_trl < claimed_trl

            if is_fraud:
                reason = (
                    f"Claimed TRL {claimed_trl} ({claimed_tier.name}) but "
                    f"'{claimed_tier.required_proof_key}' is False. "
                    f"Downgraded to TRL {verified_trl} ({tier.name}) — "
                    f"the highest tier with passing backend proof."
                )
            else:
                reason = None

            return verified_trl, is_fraud, reason

    # Nothing passed — absolute floor
    return 0, True, (
        f"Claimed TRL {claimed_trl} but ALL backend proofs failed. "
        f"No verifiable technology evidence found. TRL set to 0."
    )
