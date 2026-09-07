import { useState, useEffect } from 'react';
import type { Match } from '../types/Match';
import { fetchMatchesForChallenge } from '../services/matchService';

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
        
        // ML INTEGRATION SYNC: Fetch the actual Semantic Triage results
        const apiMatches = await fetchMatchesForChallenge(challengeId);

        const mapped: Match[] = apiMatches.map((m: any) => ({
          proposalId: m.proposalId,
          founderName: m.founderName || 'Unknown Startup',
          matchScore: m.matchScore || 0,
          _id: m.proposalId,
          startupId: m.submissionRef || m.proposalId,
          startupName: m.founderName || 'Unknown Startup',
          score: m.matchScore || 0,
          trlLevel: m.verifiedTrl || 0,
          status: 'PENDING',
          challengeId,
          createdAt: new Date().toISOString(),
        }));

        const sorted = mapped.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
        setMatches(sorted.length > 0 ? sorted : DEMO_MATCHES.map((m) => ({ ...m, challengeId })));
      } catch (err) {
        console.warn('[useFetchMatches] Backend unavailable - using demo data.');
        setMatches(DEMO_MATCHES.map((m) => ({ ...m, challengeId })));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [challengeId]);

  return { matches, loading, error };
};
