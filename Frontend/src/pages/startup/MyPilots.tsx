import React, { useState, useEffect } from 'react';
import Navbar from '../../components/shared/Navbar';
import Sidebar from '../../components/shared/Sidebar';
import EscrowTracker from '../../components/startup/EscrowTracker';
import Progress from '../../components/ui/Progress';
import Badge from '../../components/ui/Badge';
import type { Escrow } from '../../types/Escrow';
import { fetchEscrow } from '../../services/escrowService';
import { Loader2, CalendarDays, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

// ── Mock Data Fallback ────────────────────────────────────────────────────────
// Matches the real backend Escrow/Milestone shape (code/amount/status),
// used only if the API call fails or returns nothing, so the page never renders empty.

const DEMO_ESCROW: Escrow = {
  _id: 'esc_mock_001',
  proposal: 'prop_mock_001',
  challenge: 'ch_001',
  milestones: [
    { code: 'M1', amount: 450000, status: 'RELEASED', releasedAt: '2026-08-15T10:00:00Z' },
    { code: 'M2', amount: 600000, status: 'CLAIMED' },
    { code: 'M3', amount: 450000, status: 'PENDING' },
  ],
  createdAt: '2026-08-01T10:00:00Z',
  updatedAt: '2026-08-15T10:00:00Z',
};

export default function MyPilots() {
  const [escrow, setEscrow] = useState<Escrow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchEscrow('ch_001');
        setEscrow(data || DEMO_ESCROW);
      } catch {
        toast.error('Could not fetch Escrow from API. Showing mock data.');
        setEscrow(DEMO_ESCROW);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Simulated pilot progress: Day 32 of 90
  const currentDay = 32;
  const totalDays = 90;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">My Active Pilots</h2>
                  <p className="text-sm text-gray-500 mt-1">90-day parallel sandbox area with escrow tracking and milestone management.</p>
                </div>
                <Badge variant="green" dot>Sandbox Active</Badge>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20 text-gray-500">
                <Loader2 size={24} className="animate-spin mr-3" /> Loading pilot data...
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column — Pilot Info */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Active Pilot Card */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900">AI-Driven Traffic Anomaly Detection</h3>
                        <p className="text-xs text-gray-500 mt-1">Challenge ID: ch_001 · Dept: Transport Ministry</p>
                      </div>
                      <Badge variant="cyan">Parallel Pilot</Badge>
                    </div>

                    {/* Timeline Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span className="flex items-center gap-1"><CalendarDays size={12} /> Day {currentDay} of {totalDays}</span>
                        <span className="font-bold text-[var(--color-primary)]">Month 2: District Test</span>
                      </div>
                      <Progress value={currentDay} max={totalDays} showPercentage={false} color="blue" size="md" />
                      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>Setup</span>
                        <span>District Test</span>
                        <span>Stress Test</span>
                      </div>
                    </div>

                    {/* Phase Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
                        <p className="text-[10px] text-green-600 font-bold uppercase">Month 1</p>
                        <p className="text-sm font-bold text-green-800 mt-1">Complete</p>
                      </div>
                      <div className="bg-blue-50 border-2 border-blue-300 rounded p-3 text-center">
                        <p className="text-[10px] text-blue-600 font-bold uppercase">Month 2</p>
                        <p className="text-sm font-bold text-blue-800 mt-1">In Progress</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Month 3</p>
                        <p className="text-sm font-bold text-gray-400 mt-1">Upcoming</p>
                      </div>
                    </div>
                  </div>

                  {/* Competition Status */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Parallel Sandbox Competitors</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Your Startup (AeroDrone Vision)', rank: 1, status: 'On Track', color: 'green' },
                        { name: 'RoadSense AI Technologies', rank: 2, status: 'On Track', color: 'blue' },
                        { name: 'SkyNet Analytics', rank: 3, status: 'Delayed', color: 'orange' },
                      ].map((c, i) => (
                        <div key={i} className={`flex items-center justify-between p-3 rounded border ${i === 0 ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-[var(--color-india-green)]' : 'bg-gray-400'}`}>
                              {c.rank}
                            </span>
                            <div>
                              <p className={`text-sm font-semibold ${i === 0 ? 'text-green-800' : 'text-gray-700'}`}>{c.name}</p>
                              {i === 0 && <p className="text-[10px] text-green-600">This is you</p>}
                            </div>
                          </div>
                          <Badge variant={c.color as 'green' | 'blue' | 'orange'} dot>{c.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column — Escrow Tracker */}
                <div className="lg:col-span-2">
                  {escrow && <EscrowTracker escrow={escrow} />}

                  {/* Security Note */}
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield size={16} className="text-[var(--color-saffron)] flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-orange-800">
                        <strong>3-Day Deemed Approval:</strong> If the reviewing officer does not raise a valid objection within 3 days of milestone clearance, payment auto-releases via PFMS.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}