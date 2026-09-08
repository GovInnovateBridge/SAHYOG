import api from './api';
import type { Escrow } from '../types/Escrow';
import type { MilestoneCode } from '../types/Milestone';

/**
 * GET /api/escrow
 * Backend returns a BARE ARRAY, not { data: [...] } — do not unwrap a "data" key.
 */
export const fetchEscrows = async (): Promise<Escrow[]> => {
  const { data } = await api.get<Escrow[]>('/escrow');
  return data || [];
};

/**
 * Convenience lookup — finds the escrow tied to a given challenge.
 * (Escrow has no dedicated "by challenge" endpoint, so we filter client-side.)
 */
export const fetchEscrow = async (challengeId: string): Promise<Escrow | null> => {
  const escrows = await fetchEscrows();
  return escrows.find((e) => e.challenge === challengeId) || null;
};

/**
 * Convenience lookup — finds the escrow tied to a given proposal.
 */
export const fetchEscrowByProposal = async (proposalId: string): Promise<Escrow | null> => {
  const escrows = await fetchEscrows();
  return escrows.find((e) => e.proposal === proposalId) || null;
};

/**
 * POST /api/escrow/claim-milestone — Startup action.
 * Backend expects "milestoneCode" (M1/M2/M3) — not a milestone _id, milestones don't have one.
 */
export const claimMilestone = async (escrowId: string, milestoneCode: MilestoneCode) => {
  const { data } = await api.post('/escrow/claim-milestone', { escrowId, milestoneCode });
  return data;
};

/**
 * POST /api/escrow/approve — Nodal Officer action. Releases the milestone payment.
 */
export const releaseMilestone = async (escrowId: string, milestoneCode: MilestoneCode) => {
  const { data } = await api.post('/escrow/approve', { escrowId, milestoneCode });
  return data;
};

/**
 * POST /api/escrow/reject — Nodal Officer action.
 * Pays out at most 50% of the milestone and evicts the startup from the sandbox.
 */
export const rejectMilestone = async (
  escrowId: string,
  milestoneCode: MilestoneCode,
  partialAmount: number
) => {
  const { data } = await api.post('/escrow/reject', { escrowId, milestoneCode, partialAmount });
  return data;
};

/**
 * GET /api/escrow/:escrowId/milestone/:milestoneCode/report
 */
export const getMilestoneReport = async (escrowId: string, milestoneCode: MilestoneCode) => {
  try {
    const { data } = await api.get(`/escrow/${escrowId}/milestone/${milestoneCode}/report`);
    return data;
  } catch (error) {
    return null; // Return null if no report exists yet
  }
};

/**
 * POST /api/escrow/:escrowId/milestone/:milestoneCode/report
 */
export const submitMilestoneReport = async (
  escrowId: string,
  milestoneCode: MilestoneCode,
  workDetails: string
) => {
  const { data } = await api.post(`/escrow/${escrowId}/milestone/${milestoneCode}/report`, {
    workDetails,
  });
  return data;
};

/**
 * PUT /api/escrow/:escrowId/milestone/:milestoneCode/analyze
 */
export const submitOfficerAnalysis = async (
  escrowId: string,
  milestoneCode: MilestoneCode,
  officerAnalysis: string
) => {
  const { data } = await api.put(`/escrow/${escrowId}/milestone/${milestoneCode}/analyze`, {
    officerAnalysis,
  });
  return data;
};