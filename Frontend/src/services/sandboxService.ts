import api from './api';

/**
 * Sandbox Service — triggers API stress testing via the Node.js Backend.
 * Backend generates synthetic data via ML, then fires at the startup's endpoint.
 */

export interface SandboxMetrics {
  status: string;
  latencyMs: number;
  uptimePercent: number;
  accuracyScore: number;
  memoryUsageMb: number;
  lastRunAt: string;
}

/**
 * Queue a sandbox test for a proposal.
 * POST /api/proposals/:id/run-sandbox
 */
export async function runSandboxTest(
  proposalId: string,
  endpointUrl: string,
  authHeader?: string
) {
  const res = await api.post(`/proposals/${proposalId}/run-sandbox`, {
    endpointUrl,
    authHeader,
  });
  return res.data;
}

/**
 * Poll sandbox test results.
 * GET /api/proposals/:id/sandbox-status
 */
export async function getSandboxStatus(proposalId: string): Promise<SandboxMetrics> {
  const res = await api.get(`/proposals/${proposalId}/sandbox-status`);
  return res.data;
}
