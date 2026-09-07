import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import GovtEmblem from '../../components/shared/GovtEmblem';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar';
import Badge from '../../components/ui/Badge';
import {
  LogOut, Building2, FileText, Users, Landmark, ShieldCheck,
  ArrowRight, Sparkles, ClipboardList, Rocket,
  TrendingUp, CheckCircle2, Clock, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchChallenges } from '../../services/challengeService';
import type { Challenge } from '../../types/Challenge';

// ── Mock Data (visual only — fallback if backend is empty) ───────────────────

const RECENT_CHALLENGES: any[] = [
  { id: 'ch_004', title: 'AI Pothole Detection via Drone Feed', dept: 'PWD Maharashtra', status: 'SANDBOX_ACTIVE', matches: 3, posted: '2 days ago' },
  { id: 'ch_003', title: 'Rural Water Quality IoT Network', dept: 'Jal Jeevan Mission', status: 'EVALUATING', matches: 8, posted: '5 days ago' },
  { id: 'ch_002', title: 'Smart Traffic Signal Optimization', dept: 'Urban Dev. Dept.', status: 'PUBLISHED', matches: 12, posted: '1 week ago' },
  { id: 'ch_001', title: 'Crop Disease Detection Mobile App', dept: 'Agriculture Dept.', status: 'DRAFT', matches: 0, posted: '2 weeks ago' },
];

const STATUS_STYLE: Record<string, { variant: 'blue' | 'green' | 'orange' | 'gray' | 'cyan'; label: string }> = {
  DRAFT: { variant: 'gray', label: 'Draft' },
  PUBLISHED: { variant: 'blue', label: 'Published' },
  EVALUATING: { variant: 'orange', label: 'Evaluating' },
  SANDBOX_ACTIVE: { variant: 'cyan', label: 'Sandbox Active' },
  AWARDED: { variant: 'green', label: 'Verified' },
};

const ACTIVITY_FEED = [
  { icon: <Sparkles size={14} />, color: 'text-blue-600 bg-blue-50', text: 'AeroDrone Vision matched to Challenge #4 — Score 91%', time: '12 min ago' },
  { icon: <Landmark size={14} />, color: 'text-green-600 bg-green-50', text: '₹4L trial budget released for M1 — RoadSense AI', time: '1 hr ago' },
  { icon: <ShieldCheck size={14} />, color: 'text-red-500 bg-red-50', text: 'Anti-bias filter blocked a draft — 2 exclusionary clauses found', time: '3 hrs ago' },
  { icon: <CheckCircle2 size={14} />, color: 'text-green-600 bg-green-50', text: 'SkyNet Analytics completed all 3 milestones — Sahyog Verified', time: 'Yesterday' },
  { icon: <Clock size={14} />, color: 'text-orange-500 bg-orange-50', text: '7-day deemed approval triggered for M2 — Challenge #2', time: 'Yesterday' },
];

const PIPELINE = [
  { label: 'Posted', count: 12, color: 'bg-blue-500' },
  { label: 'Matched', count: 8, color: 'bg-purple-500' },
  { label: 'In Trial', count: 3, color: 'bg-orange-500' },
  { label: 'Verified', count: 4, color: 'bg-[var(--color-india-green)]' },
];

const TRL_DISTRIBUTION = [
  { level: 'TRL 4', count: 6 },
  { level: 'TRL 5', count: 14 },
  { level: 'TRL 6', count: 22 },
  { level: 'TRL 7', count: 28 },
  { level: 'TRL 8', count: 14 },
];
const MAX_TRL_COUNT = Math.max(...TRL_DISTRIBUTION.map((t) => t.count));

// ── Component ─────────────────────────────────────────────────────────────────

export default function GovtDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [challenges, setChallenges] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchChallenges();
      
      // If backend returns data, map it, else fallback to mock data (per user request)
      if (data && data.length > 0) {
        const mapped = data.map((c: any) => ({
          id: c._id,
          title: c.title,
          dept: c.departmentName || user?.organization || 'Govt Dept',
          status: c.status || 'PUBLISHED',
          matches: c.matchCount || Math.floor(Math.random() * 10),
          posted: new Date(c.publishedAt || c.createdAt).toLocaleDateString()
        }));
        setChallenges(mapped);
      } else {
        setChallenges(RECENT_CHALLENGES);
      }
    } catch (err) {
      toast.error('Failed to load live challenges. Showing cached data.');
      setChallenges(RECENT_CHALLENGES);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Top Navbar */}
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
              <Building2 size={16} className="text-[var(--color-saffron)]" />
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

          {/* Title + Compliance Badge */}
          <div className="mb-6 border-b border-gray-200 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Department Dashboard</h2>
              <p className="text-sm text-gray-500 mt-1">Overview of active problem statements and procurement pilots.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-3 py-2 rounded-lg">
              <ShieldCheck size={16} />
              GFR Compliance: 100% · All tenders passed anti-bias filter
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-[var(--color-primary)]" size={48} />
              <span className="ml-3 text-gray-500 font-medium">Loading department stats...</span>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                <StatCard label="Active Challenges" value={challenges.length.toString()} accent="border-t-blue-500" icon={<FileText size={16} className="text-blue-500" />} />
                <StatCard label="Startups Verified" value="84" accent="border-t-[var(--color-india-green)]" icon={<Users size={16} className="text-[var(--color-india-green)]" />} />
                <StatCard label="Escrow Locked (INR)" value="₹1.2 Cr" accent="border-t-[var(--color-saffron)]" icon={<Landmark size={16} className="text-[var(--color-saffron)]" />} />
                <StatCard label="Avg. Trial Success Rate" value="67%" accent="border-t-purple-500" icon={<TrendingUp size={16} className="text-purple-500" />} />
              </div>

          {/* Challenge Pipeline */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-5">Challenge Pipeline</h3>
            <div className="flex items-center">
              {PIPELINE.map((stage, i) => (
                <div key={stage.label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-14 h-14 rounded-full ${stage.color} text-white flex items-center justify-center font-bold text-lg shadow-sm`}>
                      {stage.count}
                    </div>
                    <span className="text-xs font-semibold text-gray-600 mt-2">{stage.label}</span>
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <div className="flex-1 h-0.5 bg-gray-200 mx-2 relative top-[-14px]">
                      <ArrowRight size={14} className="text-gray-300 absolute -right-1 -top-[7px]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Challenges + Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            {/* Recent Challenges Table */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Recent Challenges</h3>
                <button onClick={() => navigate('/govt/matches')} className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1">
                  View All <ArrowRight size={12} />
                </button>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-5 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Challenge</th>
                    <th className="px-5 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Matches</th>
                    <th className="px-5 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Posted</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_CHALLENGES.map((c) => {
                    const style = STATUS_STYLE[c.status] ?? { variant: 'gray' as const, label: c.status };
                    return (
                      <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate('/govt/matches')}>
                        <td className="px-5 py-3">
                          <p className="text-sm font-semibold text-gray-900">{c.title}</p>
                          <p className="text-xs text-gray-500">{c.dept}</p>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={style.variant} dot>{style.label}</Badge>
                        </td>
                        <td className="px-5 py-3 text-sm font-bold text-gray-700">{c.matches}</td>
                        <td className="px-5 py-3 text-xs text-gray-500">{c.posted}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Live Activity Feed */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live Activity
              </h3>
              <div className="space-y-4">
                {ACTIVITY_FEED.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-700 leading-snug">{item.text}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions + TRL Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Quick Action Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ActionCard
                icon={<FileText size={20} />}
                title="Post New Challenge"
                desc="Draft a new problem statement with AI-assisted KPI generation."
                onClick={() => navigate('/govt/post-challenge')}
                color="bg-blue-50 text-blue-600"
              />
              <ActionCard
                icon={<Rocket size={20} />}
                title="View AI Matches"
                desc="Review startups ranked by semantic match score."
                onClick={() => navigate('/govt/matches')}
                color="bg-purple-50 text-purple-600"
              />
              <ActionCard
                icon={<ClipboardList size={20} />}
                title="Blind Evaluations"
                desc="Run identity-masked QCBS evaluation on proposals."
                onClick={() => navigate('/govt/blind-eval')}
                color="bg-orange-50 text-orange-600"
              />
            </div>

            {/* TRL Distribution Mini Chart */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Startup TRL Distribution</h3>
              <div className="space-y-2.5">
                {TRL_DISTRIBUTION.map((t) => (
                  <div key={t.level} className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 w-12">{t.level}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                        style={{ width: `${(t.count / MAX_TRL_COUNT) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-6 text-right">{t.count}</span>
                  </div>
                ))}
              </div>
            </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, accent, icon }: { label: string; value: string; accent: string; icon: React.ReactNode }) {
  return (
    <div className={`bg-white p-5 rounded border border-gray-200 shadow-sm border-t-2 ${accent}`}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ActionCard({ icon, title, desc, onClick, color }: {
  icon: React.ReactNode; title: string; desc: string; onClick: () => void; color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md hover:border-[var(--color-primary)]/40 transition-all group"
    >
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h4 className="font-bold text-gray-900 text-sm mb-1 flex items-center justify-between">
        {title}
        <ArrowRight size={14} className="text-gray-300 group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all" />
      </h4>
      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </button>
  );
}