import React, { useState, useEffect } from 'react';
import Navbar from '../../components/shared/Navbar';
import Sidebar from '../../components/shared/Sidebar';
import MatchScoreCircle from '../../components/govt/MatchScoreCircle';
import Badge from '../../components/ui/Badge';
import TRLBadge from '../../components/startup/TRLBadge';
import { useFetchMatches } from '../../hooks/useFetchMatches';
import { useFetchChallenges } from '../../hooks/useFetchChallenges';
import { Loader2, Users } from 'lucide-react';

export default function ViewMatches() {
  const { challenges, loading: challengesLoading } = useFetchChallenges();
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const { matches, loading: matchesLoading } = useFetchMatches(selectedChallengeId);

  // Auto-select first challenge when loaded
  useEffect(() => {
    if (challenges.length > 0 && !selectedChallengeId) {
      setSelectedChallengeId(challenges[0]._id);
    }
  }, [challenges, selectedChallengeId]);

  const statusVariants: Record<string, 'blue' | 'green' | 'orange' | 'gray'> = {
    INVITED: 'blue', APPLIED: 'green', PENDING: 'orange', REJECTED: 'gray',
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Startup Matches</h2>
            <p className="text-sm text-gray-500 mt-1">
              AI-matched startups ranked by Cosine Similarity. Only TRL 7+ startups with &gt;80% match are shown.
            </p>
          </div>

          {/* Challenge Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Challenge</label>
            {challengesLoading ? (
              <div className="flex items-center text-gray-500 text-sm"><Loader2 size={16} className="animate-spin mr-2" /> Loading challenges...</div>
            ) : (
              <select
                value={selectedChallengeId || ''}
                onChange={(e) => setSelectedChallengeId(e.target.value)}
                className="w-full max-w-lg px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              >
                {challenges.map((ch) => (
                  <option key={ch._id} value={ch._id}>{ch.title} — ({ch.status})</option>
                ))}
              </select>
            )}
          </div>

          {/* Matches Table */}
          {matchesLoading ? (
            <div className="flex items-center justify-center py-20 text-gray-500">
              <Loader2 size={24} className="animate-spin mr-3" /> Running Semantic Matching Engine...
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Users size={40} className="mx-auto mb-3" />
              <p className="font-semibold">No matches found</p>
              <p className="text-sm">Select a challenge to view AI-matched startups.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Match Score</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Startup</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">TRL Level</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match, index) => (
                    <tr key={match._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-bold text-gray-400">#{index + 1}</td>
                      <td className="px-5 py-4">
                        <MatchScoreCircle score={match.score} size={56} />
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-900">{match.startupName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">ID: {match.startupId}</p>
                      </td>
                      <td className="px-5 py-4">
                        <TRLBadge level={match.trlLevel} verified />
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={statusVariants[match.status] || 'gray'} dot>
                          {match.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
