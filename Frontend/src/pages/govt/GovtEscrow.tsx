import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../../components/shared/Navbar';
import Sidebar from '../../components/shared/Sidebar';
import Progress from '../../components/ui/Progress';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import type { Escrow } from '../../types/Escrow';
import type { MilestoneCode } from '../../types/Milestone';
import { fetchEscrow, releaseMilestone, getMilestoneReport, submitOfficerAnalysis } from '../../services/escrowService';
import { Loader2, Landmark, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Human-readable labels for each milestone code (backend only stores M1/M2/M3).
const MILESTONE_LABELS: Record<MilestoneCode, string> = {
  M1: 'Month 1: Initial Deployment & Setup',
  M2: 'Month 2: Field Trial & Uptime Verification',
  M3: 'Month 3: Final UAT & Performance Sign-off',
};

// ── Mock Data Fallback ────────────────────────────────────────────────────────
// Matches the real backend Escrow/Milestone shape (code/amount/status).

const DEMO_ESCROW: Escrow = {
  _id: 'esc_mock_001',
  proposal: 'prop_mock_001',
  challenge: 'ch_001',
  milestones: [
    { code: 'M1', amount: 225000, status: 'RELEASED', releasedAt: '2026-08-15T10:00:00Z' },
    { code: 'M2', amount: 525000, status: 'CLAIMED' },
    { code: 'M3', amount: 750000, status: 'PENDING' },
  ],
  createdAt: '2026-08-01T10:00:00Z',
  updatedAt: '2026-08-15T10:00:00Z',
};

export default function GovtEscrow() {
  const [escrow, setEscrow] = useState<Escrow | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal State
  const [selectedMilestoneForReport, setSelectedMilestoneForReport] = useState<MilestoneCode | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [officerAnalysis, setOfficerAnalysis] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [analysisSaving, setAnalysisSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // We fetch escrows, and just grab the first one since it's a demo
        const data = await fetchEscrow('ch_001');
        setEscrow(data || DEMO_ESCROW); // Fallback to mock data to prevent empty page
      } catch (err) {
        toast.error('Could not fetch Escrow from API. Showing mock data.');
        setEscrow(DEMO_ESCROW);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleApprove = async (milestoneCode: MilestoneCode) => {
    if (!escrow) return;
    setActionLoading(milestoneCode);
    try {
      await releaseMilestone(escrow._id, milestoneCode);
      // Optimistic update
      setEscrow((prev) => {
        if (!prev) return prev;
        const newMilestones = prev.milestones.map((m) =>
          m.code === milestoneCode ? { ...m, status: 'RELEASED' as const, releasedAt: new Date().toISOString() } : m
        );
        return {
          ...prev,
          milestones: newMilestones,
        };
      });
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const openReportModal = async (milestoneCode: MilestoneCode) => {
    if (!escrow) return;
    setSelectedMilestoneForReport(milestoneCode);
    setReportLoading(true);
    setOfficerAnalysis('');
    
    try {
      const data = await getMilestoneReport(escrow._id, milestoneCode);
      setReportData(data);
      if (data && data.officerAnalysis) {
        setOfficerAnalysis(data.officerAnalysis);
      }
    } catch (e) {
      toast.error("Failed to load report");
    } finally {
      setReportLoading(false);
    }
  };

  const saveAnalysis = async () => {
    if (!escrow || !selectedMilestoneForReport) return;
    setAnalysisSaving(true);
    try {
      await submitOfficerAnalysis(escrow._id, selectedMilestoneForReport, officerAnalysis);
      toast.success("Analysis saved successfully");
      setSelectedMilestoneForReport(null);
    } catch (e) {
      toast.error("Failed to save analysis");
    } finally {
      setAnalysisSaving(false);
    }
  };

  const formatINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const { totalAmount, disbursedAmount, pendingAmount, lockedAmount } = useMemo(() => {
    if (!escrow) return { totalAmount: 0, disbursedAmount: 0, pendingAmount: 0, lockedAmount: 0 };
    let total = 0;
    let disbursed = 0;
    let pending = 0;
    let locked = 0;

    escrow.milestones.forEach((m) => {
      total += m.amount;
      if (m.status === 'RELEASED') disbursed += m.amount;
      else if (m.status === 'CLAIMED' || m.status === 'APPROVED' || m.status === 'DEEMED_APPROVED') pending += m.amount;
      else if (m.status === 'PENDING') locked += m.amount;
    });

    return { totalAmount: total, disbursedAmount: disbursed, pendingAmount: pending, lockedAmount: locked };
  }, [escrow]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col relative">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto relative">
          
          {/* REPORT MODAL */}
          {selectedMilestoneForReport && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">
                    Milestone Report: {MILESTONE_LABELS[selectedMilestoneForReport]}
                  </h3>
                  <button onClick={() => setSelectedMilestoneForReport(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1">
                  {reportLoading ? (
                    <div className="flex justify-center items-center py-10 text-gray-500">
                      <Loader2 className="animate-spin mr-2" /> Loading report...
                    </div>
                  ) : reportData ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Work Details Provided by Startup</h4>
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm text-gray-800 whitespace-pre-wrap">
                          {reportData.workDetails}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Government Officer Analysis</h4>
                        <textarea
                          className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={6}
                          placeholder="Write your evaluation analysis here before approving..."
                          value={officerAnalysis}
                          onChange={(e) => setOfficerAnalysis(e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      No report has been submitted by the startup yet.
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                  <Button variant="outline" onClick={() => setSelectedMilestoneForReport(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={saveAnalysis} disabled={!reportData} loading={analysisSaving}>
                    Save Analysis
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            <div className="mb-6 border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-900">Smart Escrow Vault</h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage milestone-based fund disbursements strictly for active 3-Month Sandbox Pilots. Linked directly via PFMS.
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20 text-gray-500">
                <Loader2 size={24} className="animate-spin mr-3" /> Fetching escrow details...
              </div>
            ) : !escrow ? (
              <div className="text-center py-20 text-gray-400">
                <Landmark size={40} className="mx-auto mb-3" />
                <p className="font-semibold">No active escrow found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overview Card */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">AI Traffic Anomaly Pilot (AeroDrone Vision)</h3>
                      <p className="text-sm text-gray-500">Escrow ID: {escrow._id} | Connected via PFMS</p>
                    </div>
                    <Badge variant="blue">PFMS Active</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Total Budget</p>
                      <p className="text-lg font-bold text-gray-900">{formatINR(totalAmount)}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded border border-green-200">
                      <p className="text-xs text-green-700 uppercase font-semibold">Disbursed</p>
                      <p className="text-lg font-bold text-green-900">{formatINR(disbursedAmount)}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded border border-orange-200">
                      <p className="text-xs text-orange-700 uppercase font-semibold">Pending Review</p>
                      <p className="text-lg font-bold text-orange-900">{formatINR(pendingAmount)}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded border border-blue-200">
                      <p className="text-xs text-blue-700 uppercase font-semibold">Locked</p>
                      <p className="text-lg font-bold text-blue-900">{formatINR(lockedAmount)}</p>
                    </div>
                  </div>

                  <Progress value={disbursedAmount} max={totalAmount} color="green" size="md" />
                </div>

                {/* Milestone Approval List */}
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mt-8">Milestone Approvals</h3>

                <div className="space-y-4">
                  {escrow.milestones.map((m) => {
                    const percentage = totalAmount > 0 ? Math.round((m.amount / totalAmount) * 100) : 0;
                    return (
                      <div key={m.code} className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{MILESTONE_LABELS[m.code]}</h4>
                          <p className="text-sm text-gray-500">Amount: <span className="font-semibold text-gray-800">{formatINR(m.amount)}</span> ({percentage}%)</p>
                        </div>

                        <div className="flex items-center gap-4">
                          {m.status === 'RELEASED' && (
                            <span className="flex items-center text-sm font-bold text-green-600">
                              <CheckCircle size={16} className="mr-1" /> Disbursed{m.releasedAt ? ` on ${new Date(m.releasedAt).toLocaleDateString()}` : ''}
                            </span>
                          )}
                          {m.status === 'PENDING' && (
                            <Badge variant="gray">Locked</Badge>
                          )}
                          {m.status === 'DISPUTED' && (
                            <Badge variant="gray">Disputed</Badge>
                          )}
                          {(m.status === 'CLAIMED' || m.status === 'APPROVED' || m.status === 'DEEMED_APPROVED') && (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => openReportModal(m.code)}>View Report</Button>
                              <Button
                                variant="primary"
                                size="sm"
                                loading={actionLoading === m.code}
                                onClick={() => handleApprove(m.code)}
                              >
                                Approve & Release
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}