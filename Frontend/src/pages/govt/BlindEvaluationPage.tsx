import { useState, useEffect } from 'react';
import Sidebar from '../../components/shared/Sidebar';
import GovtEmblem from '../../components/shared/GovtEmblem';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, Building2, Loader2 } from 'lucide-react';
import BlindEvalPanel from '../../components/govt/BlindEvalPanel';
import { useFetchChallenges } from '../../hooks/useFetchChallenges';

export default function BlindEvaluationPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { challenges, loading } = useFetchChallenges();
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);

  useEffect(() => {
    // Only pre-select published challenges
    const published = challenges.filter(c => c.status === 'PUBLISHED');
    if (published.length > 0 && !selectedChallengeId) {
      setSelectedChallengeId(published[0]._id);
    }
  }, [challenges, selectedChallengeId]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <header className="bg-[var(--color-primary)] text-white shadow-md z-10">
        <div className="px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <GovtEmblem width={32} height={40} className="opacity-90" />
             <div>
               <h1 className="text-lg font-bold tracking-wide">SAHYOG</h1>
               <p className="text-[10px] text-[var(--color-saffron)] font-semibold uppercase tracking-wider">Govt Officer Portal</p>
             </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
             <div className="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded">
               <Building2 size={16} className="text-[var(--color-saffron)]"/>
               <span className="font-medium text-white/90">{user?.email}</span>
             </div>
             <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-red-300 transition-colors">
               <LogOut size={16} />
               <span>Logout</span>
             </button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto bg-[var(--color-bg)]">
          <div className="mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">QCBS Evaluation Studio</h2>
            <p className="text-sm text-gray-500 mt-1">Run automated, identity-masked evaluations of technical proposals.</p>
          </div>
          
          <div className="max-w-2xl">
            {/* Challenge Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select a Published Challenge to Evaluate</label>
              {loading ? (
                <div className="flex items-center text-gray-500 text-sm"><Loader2 size={16} className="animate-spin mr-2" /> Loading challenges...</div>
              ) : (
                <select
                  value={selectedChallengeId || ''}
                  onChange={(e) => setSelectedChallengeId(e.target.value)}
                  className="w-full max-w-lg px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                >
                  <option value="" disabled>Select a challenge</option>
                  {challenges.map((ch) => (
                    <option key={ch._id} value={ch._id}>{ch.title} — ({ch.status})</option>
                  ))}
                </select>
              )}
            </div>

            {selectedChallengeId ? (
              <BlindEvalPanel challengeId={selectedChallengeId} />
            ) : (
              <div className="p-6 bg-gray-50 border border-gray-200 rounded text-gray-500 text-center">
                Please select a challenge above to begin evaluation.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
