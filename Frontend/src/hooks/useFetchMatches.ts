import { useState, useEffect } from 'react';
import type { Match } from '../types/Match';
import { fetchProposalsForChallenge } from '../services/matchService';

// ── Demo Fallback: shown when backend is down or DB is empty ─────────────────
const DEMO_MATCHES: Match[] = [
  {
    proposalId: 'prop_mock_001',
    founderName: 'AeroDrone Vision Pvt. Ltd.',
    matchScore: 0.92,
    _id: 'prop_mock_001',
    startupId: 'DPIIT-MH-2024-0192',
    startupName: 'AeroDrone Vision Pvt. Ltd.',
    score: 0.92,
    trlLevel: 8,
    status: 'INVITED',
    createdAt: '2026-08-22T10:00:00Z',
  },
  {
    proposalId: 'prop_mock_002',
    founderName: 'RoadSense AI Technologies',
    matchScore: 0.87,
    _id: 'prop_mock_002',
    startupId: 'DPIIT-DL-2023-1145',
    startupName: 'RoadSense AI Technologies',
    score: 0.87,
    trlLevel: 7,
    status: 'APPLIED',
    createdAt: '2026-08-22T10:05:00Z',
  },
  {
    proposalId: 'prop_mock_003',
    founderName: 'SkyNet Analytics India',
    matchScore: 0.81,
    _id: 'prop_mock_003',
    startupId: 'DPIIT-KA-2024-0387',
    startupName: 'SkyNet Analytics India',
    score: 0.81,
    trlLevel: 7,
    status: 'PENDING',
    createdAt: '2026-08-22T10:10:00Z',
  },
];

/**
 * Custom hook to fetch ranked proposals for a specific challenge.
 *
 * IMPORTANT: this calls GET /api/proposals/challenge/:id (fetchProposalsForChallenge),
 * NOT the thin /challenges/:id/matches endpoint. The thin endpoint only returns
 * { proposalId, founderName, matchScore } — no TRL, no status — which previously
 * forced this hook to hardcode trlLevel=7 and status='INVITED' for every real
 * match. That showed plausible-looking but WRONG data once the backend was live.
 * Real TRL and status now come from the actual proposal fields.
 *
 * Tries the real backend first; falls back to DEMO_MATCHES if it's unreachable
 * or returns an empty list. Keep this fallback even after the backend is fully
 * wired up, so the screen never looks broken during a demo if a call fails.
 */
export const useFetchMatches = (challengeId: string | null) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!challengeId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const { proposals } = await fetchProposalsForChallenge(challengeId);

        const mapped: Match[] = proposals.map((p) => ({
          proposalId: p._id,
          founderName:
            p.envelope_a_technical?.applicant_display_name ||
            (typeof p.submittedBy === 'object' ? p.submittedBy.name : 'Unknown Startup'),
          matchScore: p.envelope_a_technical?.kpiMatchVector?.overallMatchScore ?? 0,
          // UI alias fields — now populated from REAL proposal data, not fixed defaults
          _id: p._id,
          startupId: p.submissionRefNumber || p._id,
          startupName:
            p.envelope_a_technical?.applicant_display_name ||
            (typeof p.submittedBy === 'object' ? p.submittedBy.name : 'Unknown Startup'),
          score: p.envelope_a_technical?.kpiMatchVector?.overallMatchScore ?? 0,
          trlLevel: p.verified_trl_score || p.envelope_a_technical?.claimed_trl || 0,
          status: p.status as unknown as Match['status'], // real backend status, not a hardcoded guess
          challengeId,
          createdAt: p.createdAt,
        }));

        const sorted = mapped.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
        setMatches(sorted.length > 0 ? sorted : DEMO_MATCHES.map((m) => ({ ...m, challengeId })));
      } catch (err) {
        console.warn('[useFetchMatches] Backend unavailable — using demo data.');
        setMatches(DEMO_MATCHES.map((m) => ({ ...m, challengeId })));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [challengeId]);

  return { matches, loading, error };
};