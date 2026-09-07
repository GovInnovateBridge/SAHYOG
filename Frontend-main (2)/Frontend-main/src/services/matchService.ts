import api from './api';
import type { Match } from '../types/Match';
import type { Proposal } from '../types/Proposal';

/**
 * GET /api/challenges/:id/matches
 * Backend returns: { matches: [{ proposalId, founderName, matchScore }] }
 * Maps to our Match type exactly.
 */
export const getChallengeMatches = async (challengeId: string): Promise<Match[]> => {
  const { data } = await api.get<{ matches: Match[] }>(`/challenges/${challengeId}/matches`);
  return data.matches || [];
};

/**
 * Alias for getChallengeMatches — used by useFetchMatches hook.
 * Both names refer to the same backend endpoint.
 */
export const fetchMatchesForChallenge = getChallengeMatches;

/**
 * GET /api/proposals/challenge/:challengeId
 * Full proposal documents for a challenge, sorted by match score.
 * Envelope B financial data is stripped by backend unless envelopeBUnlocked is true.
 */
export const fetchProposalsForChallenge = async (
  challengeId: string
): Promise<{ proposals: Proposal[]; envelopeBUnlocked: boolean; count: number }> => {
  const { data } = await api.get<{
    message: string;
    envelopeBUnlocked: boolean;
    count: number;
    proposals: Proposal[];
  }>(`/proposals/challenge/${challengeId}`);
  return {
    proposals: data.proposals || [],
    envelopeBUnlocked: data.envelopeBUnlocked || false,
    count: data.count || 0,
  };
};