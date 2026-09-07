// ── Matches the REAL backend response of GET /api/challenges/:id/matches ───────
// Backend returns: [{ proposalId, founderName, matchScore }]
// UI-computed fields (_id, startupName, score, trlLevel, status) are added as
// optional here for compatibility with mock data and ViewMatches display logic.
export interface Match {
  // ── Real backend fields ──
  proposalId: string;
  founderName: string;
  matchScore: number; // 0–1 cosine similarity, e.g. 0.91

  // ── UI aliases / mock data fields (optional) ──
  // These are mapped from the real fields in hooks/useFetchMatches.ts
  _id?: string;          // alias for proposalId
  startupId?: string;    // from DPIIT registration number (mock only)
  startupName?: string;  // alias for founderName
  score?: number;        // alias for matchScore
  trlLevel?: number;     // from startup profile (not in ML response; mock default = 7)
  status?: 'INVITED' | 'APPLIED' | 'PENDING' | 'REJECTED';
  challengeId?: string;  // filled in by the hook
  createdAt?: string;
}