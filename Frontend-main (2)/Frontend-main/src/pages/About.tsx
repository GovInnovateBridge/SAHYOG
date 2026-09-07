import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Cpu,
  ShieldCheck,
  Scale,
  Activity,
  Wallet,
  Network,
  ArrowLeft,
  Sparkles,
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
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Pillar Card ────────────────────────────────────────────────────────── */
function PillarCard({
  icon: Icon,
  title,
  text,
  index,
  accentColor,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
  index: number;
  accentColor: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const colorMap: Record<string, { iconBg: string; glow: string; border: string; accent: string }> = {
    orange: {
      iconBg: 'bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white',
      glow: 'group-hover:shadow-orange-500/10',
      border: 'group-hover:border-orange-500/30',
      accent: 'bg-orange-500',
    },
    blue: {
      iconBg: 'bg-sky-500/10 text-sky-400 group-hover:bg-sky-500 group-hover:text-white',
      glow: 'group-hover:shadow-sky-500/10',
      border: 'group-hover:border-sky-500/30',
      accent: 'bg-sky-500',
    },
    green: {
      iconBg: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white',
      glow: 'group-hover:shadow-emerald-500/10',
      border: 'group-hover:border-emerald-500/30',
      accent: 'bg-emerald-500',
    },
  };
  const colors = colorMap[accentColor] || colorMap.blue;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`group relative bg-white/[0.04] backdrop-blur-lg rounded-2xl border border-white/[0.08] ${colors.border} p-8 shadow-lg hover:shadow-2xl ${colors.glow} transition-all duration-400 cursor-default overflow-hidden`}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${colors.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />

      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-400 ${colors.iconBg}`}
      >
        <Icon size={26} strokeWidth={1.8} />
      </div>
      <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
    </motion.div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
export default function About() {
  const pillars = [
    {
      icon: Cpu,
      title: 'AI Challenge Generator',
      text: 'We modernize legacy procurement by translating complex administrative requirements into standardized, outcome-based technical challenges.',
      accent: 'orange',
    },
    {
      icon: ShieldCheck,
      title: 'Zero-Trust TRL Engine',
      text: 'We eliminate archaic revenue barriers by utilizing an automated, evidence-based eligibility screening system driven entirely by Technology Readiness Levels (TRL).',
      accent: 'blue',
    },
    {
      icon: Scale,
      title: 'Smart Legal & IP Engine',
      text: 'Our platform offers 1-click auto-generation of NDAs, Pilot Agreements, and IP/Data sharing clauses to protect both innovators and the government.',
      accent: 'green',
    },
    {
      icon: Activity,
      title: 'The Sandbox Dashboard',
      text: 'A transparent, real-time monitoring system that tracks Key Performance Indicators (KPIs) and operational metrics during the live pilot phase.',
      accent: 'orange',
    },
    {
      icon: Wallet,
      title: 'Smart Escrow Payments',
      text: 'By locking budgets upfront and integrating with automated disbursement APIs, we guarantee milestone-based, timely payments for startups.',
      accent: 'blue',
    },
    {
      icon: Network,
      title: 'GeM Integration Bridge',
      text: 'A seamless pipeline that automatically lists successful, pilot-proven startup solutions onto the Government e-Marketplace for nationwide scaling.',
      accent: 'green',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#0A0E1A] text-white overflow-x-hidden font-[Inter,system-ui,sans-serif]">
      {/* ── Tricolor stripe ─────────────────────────────────────────────── */}
      <div className="h-[3px] flex z-[60] relative">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* ── Back Nav ────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#0A0E1A]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <ArrowLeft size={18} className="text-slate-500 group-hover:text-orange-400 transition-colors" />
            <div className="pr-3 border-r border-white/10">
              <GovtEmblem width={32} height={40} />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">SAHYOG</span>
              <span className="block text-[9px] font-semibold tracking-[0.15em] uppercase text-orange-400">
                Back to Dashboard
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/active-challenges" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Challenges</Link>
            <Link to="/guidelines" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Guidelines</Link>
            <Link to="/login" className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20 hover:-translate-y-0.5">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 px-6 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-sky-500/[0.03] blur-3xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-orange-500/[0.03] blur-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-white/10 bg-white/[0.04]">
              <Sparkles size={14} className="text-orange-400" />
              <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
                Empowering Digital India
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-sky-400 bg-clip-text text-transparent">
                Sahyog
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6">
              Bridging the Gap Between Government Needs and Startup Innovation
            </p>
            <div className="mx-auto w-28 h-[3px] rounded-full flex overflow-hidden">
              <div className="flex-1 bg-[#FF9933]" />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-[#138808]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The Vision + Beyond a Marketplace ───────────────────────────── */}
      <section className="relative py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Reveal>
            <div className="relative bg-white/[0.04] backdrop-blur-lg rounded-2xl border border-white/[0.08] p-8 md:p-10 shadow-lg hover:shadow-xl hover:border-orange-500/20 transition-all duration-400 overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 to-orange-400" />
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full border border-orange-500/20 bg-orange-500/[0.06]">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span className="text-xs font-bold tracking-wider uppercase text-orange-400">The Vision</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-5">
                Built for Innovation, Not Standardized Goods
              </h2>
              <p className="text-slate-400 leading-relaxed text-base">
                Traditional public procurement processes were designed for standardized goods, creating insurmountable barriers — like high Earnest Money Deposits (EMD) and stringent turnover requirements — for emerging startups with novel technologies. <span className="text-white font-medium">Sahyog is built to change this.</span> We are an end-to-end Innovation Procurement Pipeline designed to seamlessly connect government departments facing complex operational challenges with deep-tech startups ready to solve them.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative bg-white/[0.04] backdrop-blur-lg rounded-2xl border border-white/[0.08] p-8 md:p-10 shadow-lg hover:shadow-xl hover:border-sky-500/20 transition-all duration-400 overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sky-500 to-sky-400" />
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full border border-sky-500/20 bg-sky-500/[0.06]">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span className="text-xs font-bold tracking-wider uppercase text-sky-400">The Pre-GeM Sandbox</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-5">
                The Missing Execution Engine
              </h2>
              <p className="text-slate-400 leading-relaxed text-base">
                We act as the missing execution engine between ecosystem portals (Startup India) and marketplaces (GeM). By integrating with DPIIT for authentication, we provide a secure, risk-free <span className="text-sky-400 font-medium">Sandbox Environment</span> where startups run 3-month live pilots with government departments. We replace 100-page PDF tenders with <span className="text-orange-400 font-medium">AI-generated outcome-based challenges</span>. Once successful, they seamlessly transition to GeM for nationwide procurement under <span className="text-white font-medium">GFR Rule 194</span>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Our 6 Pillars (3x2 Grid) ───────────────────────────────────── */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-500/[0.02] blur-3xl rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full border border-sky-500/20 bg-sky-500/[0.06]">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span className="text-xs font-bold tracking-wider uppercase text-sky-400">
                  Platform Architecture
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Our{' '}
                <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                  6 Pillars
                </span>
              </h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
                The core features and architecture powering India's innovation procurement pipeline.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => (
              <PillarCard
                key={i}
                icon={pillar.icon}
                title={pillar.title}
                text={pillar.text}
                index={i}
                accentColor={pillar.accent}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Commitment ──────────────────────────────────────────────────── */}
      <section className="relative py-20 px-6">
        <Reveal>
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-16 shadow-2xl overflow-hidden">
              {/* Tricolor top */}
              <div className="absolute top-0 left-0 right-0 h-[3px] flex">
                <div className="flex-1 bg-[#FF9933]" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-[#138808]" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06]">
                <Sparkles size={12} className="text-emerald-400" />
                <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
                  Digital Public Infrastructure
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Our{' '}
                <span className="text-emerald-400">Commitment</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                Built as a highly scalable, multi-tenant{' '}
                <span className="text-white font-medium">Digital Public Infrastructure (DPI)</span>,
                Sahyog is ready to serve the nation. We are proud to launch our genesis pilot in collaboration with the{' '}
                <span className="text-orange-400 font-medium">Government of Maharashtra</span>,
                empowering departments to adopt risk-free innovation, while giving startups their first critical step into the B2G ecosystem.
              </p>

              <div className="mx-auto w-28 h-[3px] rounded-full mt-8 flex overflow-hidden">
                <div className="flex-1 bg-[#FF9933]" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-[#138808]" />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#050810] border-t border-white/5">
        <div className="h-[3px] flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <GovtEmblem width={28} height={35} />
            <div>
              <span className="font-bold text-sm tracking-tight text-white">SAHYOG</span>
              <span className="block text-[9px] text-white/40 tracking-wider uppercase">
                Government of India Initiative
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-white/50">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/active-challenges" className="hover:text-white transition-colors">Challenges</Link>
            <Link to="/guidelines" className="hover:text-white transition-colors">Guidelines</Link>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          </div>
          <div className="text-xs text-white/30 text-center md:text-right">
            <p>© 2026 Government of Maharashtra. All rights reserved.</p>
            <p className="mt-1">Built for Smart India Hackathon 2026 (PS-26136)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}