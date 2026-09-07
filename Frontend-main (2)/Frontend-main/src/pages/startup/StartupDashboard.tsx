import { useAuthStore } from '../../store/useAuthStore';
import { useTRLStore } from '../../store/useTRLStore';
import GovtEmblem from '../../components/shared/GovtEmblem';
import { useNavigate } from 'react-router-dom';
import { LogOut, Rocket, Target, BadgeCheck, ShieldCheck, AlertTriangle, HelpCircle, BrainCircuit } from 'lucide-react';
import Sidebar from '../../components/shared/Sidebar';
import TRLBadge from '../../components/startup/TRLBadge';

export default function StartupDashboard() {
  const { user, logout } = useAuthStore();
  const { status, verifiedTrl, technicalConfidence, isFraudDetected, claimedTrl, evaluationReport } = useTRLStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const trlAssessed = status === 'complete' && verifiedTrl !== null;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Top Navbar */}
      <header className="bg-[var(--color-primary)] text-white shadow-md z-10">
        <div className="px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <GovtEmblem width={32} height={40} className="opacity-90" />
            <div>
              <h1 className="text-lg font-bold tracking-wide">SAHYOG</h1>
              <p className="text-[10px] text-[var(--color-saffron)] font-semibold uppercase tracking-wider">Startup Partner Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded">
              <BadgeCheck size={16} className="text-[var(--color-india-green)]" />
              <span className="font-medium text-white/90">{user?.email}</span>
            </div>
            {/* Dynamic TRL Badge in header */}
            {trlAssessed ? (
              <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-bold ${
                isFraudDetected
                  ? 'bg-red-700/30 border border-red-500/30 text-red-300'
                  : 'bg-green-700/30 border border-green-500/30 text-green-300'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isFraudDetected ? 'bg-red-400' : 'bg-green-400 animate-pulse'
                } mr-1`}></span>
                {isFraudDetected ? 'FRAUD FLAGGED' : `TRL ${verifiedTrl} Verified`}
              </div>
            ) : (
              <div className="flex items-center space-x-1 px-2 py-1 rounded bg-amber-700/30 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <HelpCircle size={12} className="mr-1" />
                TRL Not Assessed
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:text-red-300 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-[var(--color-bg)]">
          <div className="mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Startup Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">Your matched opportunities, active pilots, and escrow disbursements.</p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* TRL Status Card */}
            <div className={`bg-white p-5 rounded border shadow-sm ${
              trlAssessed
                ? isFraudDetected
                  ? 'border-red-300 border-t-2 border-t-red-500'
                  : 'border-gray-200 border-t-2 border-t-green-500'
                : 'border-gray-200 border-t-2 border-t-amber-500'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">TRL Status</h3>
                {trlAssessed ? (
                  <ShieldCheck size={18} className={isFraudDetected ? 'text-red-500' : 'text-green-500'} />
                ) : (
                  <BrainCircuit size={18} className="text-amber-500" />
                )}
              </div>
              {trlAssessed ? (
                <>
                  <TRLBadge
                    level={verifiedTrl!}
                    verified={!isFraudDetected}
                    confidence={technicalConfidence}
                    fraudDetected={isFraudDetected}
                  />
                  {isFraudDetected && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                      <AlertTriangle size={12} />
                      <span>Claimed TRL {claimedTrl} → Verified TRL {verifiedTrl}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-1">
                  <p className="text-lg font-bold text-amber-600 mb-2">Not Assessed</p>
                  <button
                    onClick={() => navigate('/startup/trl-quiz')}
                    className="text-xs px-3 py-1.5 bg-[var(--color-primary)] text-white rounded font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                  >
                    Take Assessment →
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm border-t-2 border-t-[var(--color-india-green)]">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Active Sandboxes</h3>
              <p className="text-3xl font-bold text-gray-900">1</p>
            </div>
            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm border-t-2 border-t-[var(--color-saffron)]">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Escrow Disbursed</h3>
              <p className="text-3xl font-bold text-gray-900">₹3.0 L</p>
            </div>
          </div>

          {/* TRL Evaluation Summary (if complete) */}
          {trlAssessed && evaluationReport && (
            <div className="bg-white p-6 rounded border border-gray-200 shadow-sm mb-8">
              <div className="flex items-center gap-2 mb-3">
                <BrainCircuit size={18} className="text-[var(--color-primary)]" />
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Last TRL Evaluation Summary</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Claimed</p>
                  <p className="text-xl font-black text-gray-500">TRL {claimedTrl}</p>
                </div>
                <div className={`rounded-lg p-3 text-center ${isFraudDetected ? 'bg-red-50' : 'bg-green-50'}`}>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Verified</p>
                  <p className={`text-xl font-black ${isFraudDetected ? 'text-red-600' : 'text-green-600'}`}>TRL {verifiedTrl}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Confidence</p>
                  <p className="text-xl font-black text-[var(--color-primary)]">{Math.round(technicalConfidence * 100)}%</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 line-clamp-3">{evaluationReport}</p>
            </div>
          )}

          <div className="bg-white p-8 rounded border border-gray-200 min-h-[300px] flex items-center justify-center flex-col shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
              <Target size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No challenge selected</h3>
            <p className="text-gray-500 text-sm text-center max-w-md">
              Browse your AI-matched challenges to view technical KPIs and submit a formal proposal for the QCBS evaluation stage.
            </p>
            <button
              onClick={() => navigate('/startup/challenges')}
              className="mt-6 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-medium rounded transition-colors shadow-sm"
            >
              Browse Matched Challenges
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
