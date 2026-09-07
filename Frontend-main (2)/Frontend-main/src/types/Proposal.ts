// Matches the backend's Proposal model exactly (models/Proposal.js).

export type ProposalStatus =
    | 'SUBMITTED'
    | 'JURY_EVALUATED'
    | 'OFFICER_EVALUATED'
    | 'SHORTLISTED'
    | 'SANDBOX_TESTED'
    | 'REJECTED'
    | 'AWARDED'
    | 'EVICTED_FROM_SANDBOX';

export type AgreementStatus = 'NOT_GENERATED' | 'PENDING_SIGNATURE' | 'SIGNED';
export type ProposalEscrowStatus = 'NOT_INITIATED' | 'FROZEN' | 'RELEASED';
export type JuryReviewStatus = 'PENDING_ACCEPTANCE' | 'ACCEPTED' | 'DECLINED' | 'REVIEW_COMPLETED';

export interface EnvelopeATechnical {
    domain?: 'SOFTWARE' | 'HARDWARE';
    claimed_trl?: number;
    startup_pitch?: string;
    github_url?: string;
    live_url?: string;
    applicant_display_name?: string;
    kpiVector?: number[];
    kpiMatchVector?: { overallMatchScore?: number;[key: string]: unknown };
    piiRedactedText?: string;
    piiReviewPending?: boolean;
    [key: string]: unknown;
}

// Absent entirely from the response when the blind-evaluation vault is locked
// (Jury never receives this; Nodal Officer only during EVALUATING/SANDBOX_ACTIVE).
export interface EnvelopeBFinancial {
    pilot_execution_bid?: {
        amount_inr: number;
        breakdown?: string;
    };
    payment_terms?: string;
    [key: string]: unknown;
}

export interface ScoreCard {
    criteria: Record<string, number>;
    totalScore: number;
    hash: string;
    evaluatedAt: string;
}

export interface JuryTimeline {
    m1Days: number;
    m2Days: number;
    m3Days: number;
}

export interface SandboxMetrics {
    latencyMs?: number;
    uptimePercent?: number;
    accuracyScore?: number;
    memoryUsageMb?: number;
    lastRunAt?: string;
}

export interface Proposal {
    _id: string;
    challenge: string;
    submittedBy: string | { _id: string; name: string };
    submissionRefNumber?: string;
    proposal_metadata?: Record<string, unknown>;
    pre_requisite_clearance?: Record<string, unknown>;
    assigned_evaluator_pool?: string;
    envelope_a_technical?: EnvelopeATechnical;
    envelope_b_financial?: EnvelopeBFinancial;
    vaultLocked: boolean;
    verified_trl_score: number;
    technical_confidence: number;
    is_fraud_flagged: boolean;
    sandboxMetrics?: SandboxMetrics;
    agreementStatus: AgreementStatus;
    escrowStatus: ProposalEscrowStatus;
    agreementHash?: string;
    agreementData?: Record<string, unknown>;
    assignedJury?: string;
    assignedAt?: string;
    juryReviewStatus: JuryReviewStatus;
    juryTimeline?: JuryTimeline;
    juryScoreCard?: ScoreCard;
    officerScoreCard?: ScoreCard;
    finalWeightedScore?: number;
    status: ProposalStatus;
    createdAt: string;
    updatedAt: string;
}

// Payload for POST /api/proposals/submit
export interface SubmitProposalPayload {
    challengeId: string;
    proposal_metadata?: Record<string, unknown>;
    pre_requisite_clearance?: Record<string, unknown>;
    assigned_evaluator_pool?: string;
    internal_db_meta?: Record<string, unknown>;
    envelope_a_technical: EnvelopeATechnical;
    envelope_b_financial: EnvelopeBFinancial;
    // Required only when envelope_a_technical.domain === 'HARDWARE' and the
    // uploaded file is a video (proves live physical operation).
    hardware_otp?: string;
}