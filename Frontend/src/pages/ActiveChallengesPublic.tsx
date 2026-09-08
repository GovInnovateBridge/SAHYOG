import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Building2,
  IndianRupee,
  Clock,
  Cpu,
  Shield,
  Zap,
  Radar,
  HeartPulse,
  Droplets,
  Flame,
  Eye,
} from 'lucide-react';
import GovtEmblem from '../components/shared/GovtEmblem';

/* ─── Reveal wrapper ─────────────────────────────────────────────────────── */
function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Challenge Card ─────────────────────────────────────────────────────── */
interface Challenge {
  id: number;
  department: string;
  state: string;
  title: string;
  description: string;
  budget: string;
  trl: string;
  deadline: string;
  icon: React.ElementType;
  color: string;
  tags: string[];
}

function ChallengeCard({ challenge, index }: { challenge: Challenge; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const colorMap: Record<string, { gradient: string; glow: string; badge: string; border: string }> = {
    orange: {
      gradient: 'from-orange-500 to-amber-500',
      glow: 'group-hover:shadow-orange-500/15',
      badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      border: 'group-hover:border-orange-500/30',
    },
    blue: {
      gradient: 'from-sky-500 to-blue-500',
      glow: 'group-hover:shadow-sky-500/15',
      badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      border: 'group-hover:border-sky-500/30',
    },
    green: {
      gradient: 'from-emerald-500 to-green-500',
      glow: 'group-hover:shadow-emerald-500/15',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      border: 'group-hover:border-emerald-500/30',
    },
    purple: {
      gradient: 'from-violet-500 to-purple-500',
      glow: 'group-hover:shadow-violet-500/15',
      badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      border: 'group-hover:border-violet-500/30',
    },
    red: {
      gradient: 'from-rose-500 to-red-500',
      glow: 'group-hover:shadow-rose-500/15',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      border: 'group-hover:border-rose-500/30',
    },
    cyan: {
      gradient: 'from-cyan-500 to-teal-500',
      glow: 'group-hover:shadow-cyan-500/15',
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      border: 'group-hover:border-cyan-500/30',
    },
  };
  const colors = colorMap[challenge.color] || colorMap.blue;
  const Icon = challenge.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`group relative bg-white rounded-2xl border border-slate-200 ${colors.border} overflow-hidden shadow-sm hover:shadow-xl ${colors.glow} transition-all duration-400 cursor-default`}
    >
      {/* Top gradient bar */}
      <div className={`h-1.5 bg-gradient-to-r ${colors.gradient}`} />

      <div className="p-6">
        {/* Header: Department + State */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-md`}>
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{challenge.department}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={10} className="text-slate-500" />
                <span className="text-[10px] text-slate-500">{challenge.state}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
            <Clock size={10} />
            {challenge.deadline}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-slate-800 group-hover:to-slate-500 transition-all duration-300">
          {challenge.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-5 line-clamp-2">
          {challenge.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {challenge.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[10px] font-semibold px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer: Budget + TRL + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-4">
            {/* Budget */}
            <div className="flex items-center gap-1.5">
              <IndianRupee size={14} className="text-emerald-500" />
              <span className="text-sm font-bold text-emerald-600">{challenge.budget}</span>
            </div>
            {/* TRL Badge */}
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${colors.badge}`}>
              {challenge.trl}
            </span>
          </div>

          <Link
            to={`/challenge/${challenge.id}`}
            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-gradient-to-r ${colors.gradient} text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
          >
            View Details
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
export default function ActiveChallengesPublic() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState('all');
  const [filterDept, setFilterDept] = useState('all');

  const challenges: Challenge[] = [
    {
      id: 1,
      department: 'Maharashtra Police',
      state: 'Maharashtra',
      title: 'AI Drone Traffic Monitor',
      description: 'Develop an AI-powered drone surveillance system for real-time traffic monitoring and violation detection across major highways and urban intersections.',
      budget: '₹15 Lakhs Escrow',
      trl: 'TRL 4+ Required',
      deadline: '12 days left',
      icon: Radar,
      color: 'blue',
      tags: ['Computer Vision', 'Drones', 'AI/ML'],
    },
    {
      id: 2,
      department: 'Ministry of Agriculture',
      state: 'Madhya Pradesh',
      title: 'Smart Crop Disease Detection',
      description: 'Build a mobile-first solution using satellite imagery and on-ground sensors to detect crop diseases early and alert farmers with actionable remediation steps.',
      budget: '₹20 Lakhs Escrow',
      trl: 'TRL 5+ Required',
      deadline: '8 days left',
      icon: Cpu,
      color: 'green',
      tags: ['IoT', 'Satellite', 'AgriTech'],
    },
    {
      id: 3,
      department: 'Delhi Jal Board',
      state: 'Delhi',
      title: 'Real-Time Water Quality IoT',
      description: 'Deploy a network of IoT sensors across the water distribution pipeline for continuous monitoring of quality parameters — pH, TDS, turbidity, and contaminants.',
      budget: '₹12 Lakhs Escrow',
      trl: 'TRL 4+ Required',
      deadline: '18 days left',
      icon: Droplets,
      color: 'cyan',
      tags: ['IoT', 'Water Tech', 'Sensors'],
    },
    {
      id: 4,
      department: 'AIIMS Nagpur',
      state: 'Maharashtra',
      title: 'AI Radiology Assist Platform',
      description: 'Create an AI-assisted diagnostic tool that helps radiologists detect abnormalities in X-ray and CT scans with higher accuracy and speed in tier-2 hospitals.',
      budget: '₹25 Lakhs Escrow',
      trl: 'TRL 6+ Required',
      deadline: '5 days left',
      icon: HeartPulse,
      color: 'red',
      tags: ['HealthTech', 'AI/ML', 'Diagnostics'],
    },
    {
      id: 5,
      department: 'Ministry of Defence',
      state: 'Pan India',
      title: 'Cybersecurity Threat Intel Engine',
      description: 'Develop a real-time cybersecurity threat intelligence platform that monitors, detects, and responds to advanced persistent threats across critical government infrastructure.',
      budget: '₹30 Lakhs Escrow',
      trl: 'TRL 5+ Required',
      deadline: '22 days left',
      icon: Shield,
      color: 'purple',
      tags: ['CyberSec', 'AI/ML', 'Defence'],
    },
    {
      id: 6,
      department: 'NDMA',
      state: 'Uttarakhand',
      title: 'Forest Fire Early Warning System',
      description: 'Build a satellite + ground sensor fusion system for early forest fire detection in Himalayan forests with real-time alert propagation to local disaster response teams.',
      budget: '₹18 Lakhs Escrow',
      trl: 'TRL 4+ Required',
      deadline: '15 days left',
      icon: Flame,
      color: 'orange',
      tags: ['Disaster Mgmt', 'IoT', 'Satellite'],
    },
  ];

  const states = ['all', ...new Set(challenges.map((c) => c.state))];
  const departments = ['all', ...new Set(challenges.map((c) => c.department))];

  const filteredChallenges = challenges.filter((c) => {
    const matchSearch =
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchState = filterState === 'all' || c.state === filterState;
    const matchDept = filterDept === 'all' || c.department === filterDept;
    return matchSearch && matchState && matchDept;
  });

  return (
    <div className="relative min-h-screen bg-transparent text-slate-900 overflow-x-hidden font-[Inter,system-ui,sans-serif]">
      {/* ── Tricolor stripe ─────────────────────────────────────────────── */}
      <div className="h-[3px] flex z-[60] relative">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <ArrowLeft size={18} className="text-slate-500 group-hover:text-orange-500 transition-colors" />
            <div className="pr-3 border-r border-slate-200">
              <GovtEmblem width={32} height={40} />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900">SAHYOG</span>
              <span className="block text-[9px] font-semibold tracking-[0.15em] uppercase text-orange-600">
                Active Challenges
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">About</Link>
            <Link to="/guidelines" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Guidelines</Link>
            <Link to="/login" className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md shadow-orange-500/20 hover:-translate-y-0.5">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <section className="relative py-16 lg:py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-[5%] right-[5%] w-[500px] h-[400px] rounded-full bg-sky-500/[0.05] blur-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-slate-200 bg-white shadow-sm">
                <Zap size={14} className="text-orange-500" />
                <span className="text-xs font-bold tracking-wider uppercase text-slate-600">
                  Opportunity Board
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-slate-900">
                Active{' '}
                <span className="bg-gradient-to-r from-orange-500 to-sky-500 bg-clip-text text-transparent">
                  Challenges
                </span>
              </h1>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                These aren't boring tenders. They're real government problems waiting for your deep-tech solution.
              </p>
            </div>
          </Reveal>

          {/* ── Search + Filters ─────────────────────────────────────────── */}
          <Reveal delay={0.1}>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6 mb-10 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search challenges by name, department, or tech..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  />
                </div>
                {/* Filter by State */}
                <div className="relative min-w-[180px]">
                  <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={filterState}
                    onChange={(e) => setFilterState(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 appearance-none focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="all" className="bg-white">All States</option>
                    {states.filter((s) => s !== 'all').map((state) => (
                      <option key={state} value={state} className="bg-white">{state}</option>
                    ))}
                  </select>
                </div>
                {/* Filter by Department */}
                <div className="relative min-w-[200px]">
                  <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 appearance-none focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="all" className="bg-white">All Departments</option>
                    {departments.filter((d) => d !== 'all').map((dept) => (
                      <option key={dept} value={dept} className="bg-white">{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results count */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Showing <span className="text-slate-900 font-semibold">{filteredChallenges.length}</span> of {challenges.length} challenges
                </span>
                {(searchQuery || filterState !== 'all' || filterDept !== 'all') && (
                  <button
                    onClick={() => { setSearchQuery(''); setFilterState('all'); setFilterDept('all'); }}
                    className="text-xs text-sky-600 hover:text-sky-700 font-medium transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Challenge Cards Grid ────────────────────────────────────────── */}
      <section className="px-6 pb-28">
        <div className="max-w-6xl mx-auto">
          {filteredChallenges.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge, i) => (
                <ChallengeCard key={challenge.id} challenge={challenge} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Eye size={48} className="text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400 mb-2">No challenges found</h3>
              <p className="text-slate-600 text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <GovtEmblem width={28} height={35} />
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-900">SAHYOG</span>
              <span className="block text-[9px] text-slate-500 tracking-wider uppercase">
                Government of India Initiative
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-600">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-slate-900 transition-colors">About</Link>
            <Link to="/guidelines" className="hover:text-slate-900 transition-colors">Guidelines</Link>
            <Link to="/login" className="hover:text-slate-900 transition-colors">Login</Link>
          </div>
          <div className="text-xs text-slate-500 text-center md:text-right">
            <p>© 2026 Government of Maharashtra. All rights reserved.</p>
            <p className="mt-1">Built for Smart India Hackathon 2026 (PS-26136)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
