import api from './api';
import type { Proposal, SubmitProposalPayload } from '../types/Proposal';

export interface SubmitProposalResponse {
  message: string;
  proposalRef: string;
  proposalId: string;
  verifiedTrl: {
    verified_trl: number;
    technical_confidence: number;
    is_fraud: boolean;
  };
}

// POST /api/proposals/submit — Startup only
// Retained FormData and multipart header from HEAD to support Multer file uploads
export const submitProposal = async (
  formData: FormData
): Promise<SubmitProposalResponse> => {
  const { data } = await api.post<SubmitProposalResponse>('/proposals/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

// GET /api/proposals/challenge/:challengeId — Jury or Nodal Officer
export const getProposalsForChallenge = async (challengeId: string) => {
  const { data } = await api.get<{
    message: string;
    envelopeBUnlocked: boolean;
    count: number;
    proposals: Proposal[];
  }>(`/proposals/challenge/${challengeId}`);
  // Fallback extraction to ensure UI doesn't break if backend response varies
  return data.proposals || data;
};

// PATCH /api/proposals/:id/evaluate — Jury only (score out of 70 + M1/M2/M3 timeline in days)
export const evaluateProposal = async (
  proposalId: string,
  evaluationData: {
    innovation: number;
    feasibility: number;
    scalability: number;
    m1Days: number;
    m2Days: number;
    m3Days: number;
  }
) => {
  const { data } = await api.patch(`/proposals/${proposalId}/evaluate`, evaluationData);
  return data;
};

// PATCH /api/proposals/:id/officer/evaluate — Nodal Officer only (score out of 30)
export const officerEvaluateProposal = async (
  proposalId: string,
  evaluationData: { budgetViability: number; implementationTimeline: number }
) => {
  const { data } = await api.patch(`/proposals/${proposalId}/officer/evaluate`, evaluationData);
  return data;
};

// POST /api/proposals/:id/run-sandbox — Startup only
export const runSandbox = async (proposalId: string) => {
  const { data } = await api.post(`/proposals/${proposalId}/run-sandbox`);
  return data;
};

// GET /api/proposals/:id/sandbox-status — any authenticated user
export const getSandboxStatus = async (proposalId: string) => {
  const { data } = await api.get(`/proposals/${proposalId}/sandbox-status`);
  return data;
};

// PATCH /api/proposals/:id/award — Nodal Officer only
export const awardGrant = async (proposalId: string, grantAmount?: number) => {
  const { data } = await api.patch(`/proposals/${proposalId}/award`, { grantAmount });
  return data;
};

// POST /api/proposals/:id/agreement/generate — Nodal Officer only
export const generateAgreement = async (proposalId: string) => {
  const { data } = await api.post(`/proposals/${proposalId}/agreement/generate`);
  return data;
};

// PATCH /api/proposals/:id/agreement/sign — Startup only
export const signAgreement = async (proposalId: string, signatureData?: Record<string, unknown>) => {
  const { data } = await api.patch(`/proposals/${proposalId}/agreement/sign`, signatureData);
  return data;
};

// PATCH /api/proposals/:id/jury/accept — Jury only
export const acceptJuryAssignment = async (proposalId: string) => {
  const { data } = await api.patch(`/proposals/${proposalId}/jury/accept`);
  return data;
};

// PATCH /api/proposals/:id/jury/decline — Jury only
export const declineJuryAssignment = async (proposalId: string) => {
  const { data } = await api.patch(`/proposals/${proposalId}/jury/decline`);
  return data;
};