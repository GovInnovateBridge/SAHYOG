import { useState, useEffect } from 'react';
import Navbar from '../../components/shared/Navbar';
import Sidebar from '../../components/shared/Sidebar';
import { ShieldAlert, Server, Activity, Database, Loader2, PlayCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { runSandboxTest, getSandboxStatus, type SandboxMetrics } from '../../services/sandboxService';
import { useFetchChallenges } from '../../hooks/useFetchChallenges';
import { getProposalsForChallenge } from '../../services/proposalService';

export default function SandboxTestPage() {
  const { challenges, loading: challengesLoading } = useFetchChallenges();
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const [endpointUrl, setEndpointUrl] = useState('');
  
  const [metrics, setMetrics] = useState<SandboxMetrics | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (challenges.length > 0 && !selectedChallengeId) {
      setSelectedChallengeId(challenges[0]._id);
    }
  }, [challenges, selectedChallengeId]);

  useEffect(() => {
    if (!selectedChallengeId) return;
    const fetchProps = async () => {
      setLoadingProposals(true);
      try {
        const data = await getProposalsForChallenge(selectedChallengeId);
        const list = Array.isArray(data) ? data : (data as any).proposals || [];
        setProposals(list);
      } catch (err) {
        toast.error('Failed to load proposals');
      } finally {
        setLoadingProposals(false);
      }
    };
    fetchProps();
  }, [selectedChallengeId]);

  const handleRunSandbox = async () => {
    if (!selectedProposalId || !endpointUrl) {
      toast.error('Please select a proposal and provide an endpoint URL');
      return;
    }
    
    setTesting(true);
    try {
      await runSandboxTest(selectedProposalId, endpointUrl);
      toast.success('Sandbox test initiated. ML engine is firing requests.');
      pollStatus();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to start sandbox test');
      setTesting(false);
    }
  };

  const pollStatus = async () => {
    if (!selectedProposalId) return;
    
    try {
      const data = await getSandboxStatus(selectedProposalId);
      setMetrics(data);
      if (data.status === 'Running') {
        setTimeout(pollStatus, 3000);
      } else {
        setTesting(false);
        toast.success('Sandbox testing complete!');
      }
    } catch (err) {
      setTesting(false);
      toast.error('Failed to fetch sandbox status');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Server className="text-[var(--color-primary)]" /> API Stress Testing Sandbox
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Verify startup software endpoints using AI-generated synthetic data.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Setup */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Test Configuration</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Select Challenge</label>
                    <select
                      value={selectedChallengeId || ''}
                      onChange={(e) => setSelectedChallengeId(e.target.value)}
                      className="w-full text-sm border-gray-300 rounded-md p-2 border focus:ring-[var(--color-primary)]"
                    >
                      {challenges.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Select Proposal (Startup)</label>
                    {loadingProposals ? (
                      <div className="text-xs text-gray-500"><Loader2 size={12} className="animate-spin inline" /> Loading...</div>
                    ) : (
                      <select
                        value={selectedProposalId || ''}
                        onChange={(e) => setSelectedProposalId(e.target.value)}
                        className="w-full text-sm border-gray-300 rounded-md p-2 border focus:ring-[var(--color-primary)]"
                      >
                        <option value="">-- Choose Startup --</option>
                        {proposals.map(p => (
                          <option key={p._id} value={p._id}>{p.submissionRefNumber} (TRL-{p.verified_trl_score || '?'})</option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Target Endpoint URL</label>
                    <input 
                      type="url"
                      value={endpointUrl}
                      onChange={(e) => setEndpointUrl(e.target.value)}
                      placeholder="https://api.startup.com/v1/test"
                      className="w-full text-sm border-gray-300 rounded-md p-2 border focus:ring-[var(--color-primary)]"
                    />
                  </div>

                  <button
                    onClick={handleRunSandbox}
                    disabled={testing || !selectedProposalId || !endpointUrl}
                    className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold py-2.5 rounded-md text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {testing ? <RefreshCw className="animate-spin" size={16} /> : <PlayCircle size={16} />}
                    {testing ? 'Firing Synthetic Data...' : 'Run Stress Test'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Col: Dashboard */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Live Telemetry</h3>
                  {metrics?.status && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${metrics.status === 'Running' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {metrics.status}
                    </span>
                  )}
                </div>

                {!metrics ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <Activity size={48} className="mb-4 opacity-50" />
                    <p>No telemetry data available.</p>
                    <p className="text-xs mt-1">Configure and start a test to see live metrics.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex items-center gap-4">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Activity size={24} /></div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Avg Latency</p>
                        <p className="text-2xl font-black text-gray-900">{metrics.latencyMs} <span className="text-sm font-medium text-gray-500">ms</span></p>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex items-center gap-4">
                      <div className="p-3 bg-green-100 text-green-600 rounded-full"><ShieldAlert size={24} /></div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Uptime</p>
                        <p className="text-2xl font-black text-gray-900">{metrics.uptimePercent}<span className="text-sm font-medium text-gray-500">%</span></p>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex items-center gap-4">
                      <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><Activity size={24} /></div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Data Accuracy</p>
                        <p className="text-2xl font-black text-gray-900">{metrics.accuracyScore}<span className="text-sm font-medium text-gray-500">%</span></p>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex items-center gap-4">
                      <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><Database size={24} /></div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Memory Footprint</p>
                        <p className="text-2xl font-black text-gray-900">{metrics.memoryUsageMb} <span className="text-sm font-medium text-gray-500">MB</span></p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

