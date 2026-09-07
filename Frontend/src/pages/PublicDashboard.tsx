import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
  LogIn,
  Cpu,
  ShieldCheck,
  Scale,
  Activity,
  Wallet,
  Network,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Globe,
  ExternalLink,
} from 'lucide-react';
import GovtEmblem from '../components/shared/GovtEmblem';

/* ─── Reusable scroll-reveal wrapper ─────────────────────────────────────── */
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
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── 3D Floating Card ───────────────────────────────────────────────────── */
function FloatingCard({
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

  const colorMap: Record<string, { bg: string; iconBg: string; border: string; glow: string }> = {
    saffron: {
      bg: 'group-hover:border-[#FF9933]/40',
      iconBg: 'bg-[#FFF3E0] text-[#FF9933] group-hover:bg-[#FF9933] group-hover:text-white',
      border: 'border-t-[#FF9933]',
      glow: 'group-hover:shadow-[#FF9933]/10',
    },
    navy: {
      bg: 'group-hover:border-[#003366]/40',
      iconBg: 'bg-[#E8EEF5] text-[#003366] group-hover:bg-[#003366] group-hover:text-white',
      border: 'border-t-[#003366]',
      glow: 'group-hover:shadow-[#003366]/10',
    },
    green: {
      bg: 'group-hover:border-[#138808]/40',
      iconBg: 'bg-[#E8F5E9] text-[#138808] group-hover:bg-[#138808] group-hover:text-white',
      border: 'border-t-[#138808]',
      glow: 'group-hover:shadow-[#138808]/10',
    },
  };

  const colors = colorMap[accentColor] || colorMap.navy;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: 8 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.25 },
      }}
      style={{ perspective: 1000 }}
      className={`group relative bg-white rounded-xl border border-gray-200 border-t-4 ${colors.border} p-7 shadow-sm hover:shadow-xl ${colors.glow} ${colors.bg} transition-all duration-400 cursor-default`}
    >
      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-400 ${colors.iconBg}`}
      >
        <Icon size={26} strokeWidth={1.8} />
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        {text}
      </p>
    </motion.div>
  );
}

/* ─── Parallax floating shapes ───────────────────────────────────────────── */
function FloatingShape({
  className,
  duration = 20,
  delay = 0,
  xRange = 30,
  yRange = 25,
}: {
  className: string;
  duration?: number;
  delay?: number;
  xRange?: number;
  yRange?: number;
}) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      animate={{
        x: [0, xRange, -xRange * 0.6, xRange * 0.4, 0],
        y: [0, -yRange, yRange * 0.7, -yRange * 0.3, 0],
        rotate: [0, 8, -5, 3, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

function ParallaxLayer({
  children,
  speed = 0.5,
  className = '',
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);

  return (
    <motion.div ref={ref} style={{ y }} className={`absolute inset-0 pointer-events-none ${className}`}>
      {children}
    </motion.div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
export default function PublicDashboard() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const features = [
    {
      icon: Cpu,
      title: 'AI Challenge Generator',
      text: 'We modernize legacy procurement by translating complex administrative requirements into standardized, outcome-based technical challenges.',
      accent: 'saffron',
    },
    {
      icon: ShieldCheck,
      title: 'Zero-Trust TRL Engine',
      text: 'We eliminate archaic revenue barriers using an automated, evidence-based eligibility screening system driven entirely by Technology Readiness Levels (TRL).',
      accent: 'navy',
    },
    {
      icon: Scale,
      title: 'Smart Legal & IP Engine',
      text: '1-click auto-generation of NDAs, Pilot Agreements, and IP/Data sharing clauses to protect both innovators and government.',
      accent: 'green',
    },
    {
      icon: Activity,
      title: 'The Sandbox Dashboard',
      text: 'A transparent, real-time monitoring system tracking KPIs and operational metrics during the live pilot phase.',
      accent: 'saffron',
    },
    {
      icon: Wallet,
      title: 'Smart Escrow Payments',
      text: 'Locking budgets upfront and integrating with automated disbursement APIs for milestone-based, timely payments.',
      accent: 'navy',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#FAFBFD] text-gray-900 overflow-x-hidden font-[Inter,system-ui,sans-serif]">

      {/* ── TOP GOVT UTILITY BAR ────────────────────────────────────────── */}
      <div className="bg-[#003366] text-white text-[11px] py-1.5 px-6 flex justify-between items-center z-[60] relative">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-wider">GOVERNMENT OF INDIA</span>
          <span className="text-white/40">|</span>
          <span className="text-white/70">Department of Administrative Reforms & Public Grievances</span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-white/70">
          <button className="hover:text-white transition-colors">Skip to Main Content</button>
          <span className="text-white/30">|</span>
          <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
            india.gov.in <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {/* ── TRICOLOR STRIPE ─────────────────────────────────────────────── */}
      <div className="h-[3px] flex z-[60] relative">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* ── STICKY NAV ──────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="pr-3 border-r border-gray-300">
              <GovtEmblem width={36} height={45} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-[#003366]">
                SAHYOG
              </span>
              <span className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[#138808]">
                Innovation to Procurement Sandbox
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            <a href="#vision" className="text-sm font-medium text-gray-600 hover:text-[#003366] transition-colors">
              Vision
            </a>
            <a href="#sandbox" className="text-sm font-medium text-gray-600 hover:text-[#003366] transition-colors">
              Sandbox
            </a>
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-[#003366] transition-colors">
              Features
            </a>
            <Link to="/active-challenges" className="text-sm font-medium text-gray-600 hover:text-[#003366] transition-colors">
              Active Challenges
            </Link>
            <Link to="/guidelines" className="text-sm font-medium text-gray-600 hover:text-[#003366] transition-colors">
              GFR Guidelines
            </Link>
          </div>

          <Link
            to="/login"
            className="flex items-center gap-2 bg-[#003366] hover:bg-[#002244] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md shadow-[#003366]/20 hover:shadow-lg"
          >
            <LogIn size={16} />
            Portal Login
          </Link>
        </div>
      </nav>

      {/* ── SECTION 1: HERO ─────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 overflow-hidden"
      >
        {/* Animated parallax background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
            <defs>
              <pattern id="heroGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#003366" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#heroGrid)" />
          </svg>

          {/* Slow-moving parallax layer 1 (far back) */}
          <ParallaxLayer speed={-0.15}>
            <FloatingShape
              className="top-[8%] right-[12%] w-64 h-64 rounded-full border-2 border-[#FF9933]/[0.08]"
              duration={25}
              xRange={40}
              yRange={30}
            />
            <FloatingShape
              className="bottom-[15%] left-[8%] w-48 h-48 rounded-full bg-[#003366]/[0.03] blur-2xl"
              duration={30}
              delay={2}
              xRange={50}
              yRange={35}
            />
            <FloatingShape
              className="top-[35%] left-[60%] w-20 h-20 rounded-lg border border-[#138808]/[0.1] rotate-12"
              duration={18}
              delay={5}
              xRange={25}
              yRange={20}
            />
          </ParallaxLayer>

          {/* Parallax layer 2 (mid) */}
          <ParallaxLayer speed={-0.08}>
            <FloatingShape
              className="top-[20%] left-[15%] w-32 h-32 rounded-full border border-[#003366]/[0.06]"
              duration={22}
              delay={1}
              xRange={35}
              yRange={28}
            />
            <FloatingShape
              className="bottom-[25%] right-[18%] w-24 h-24 rounded-xl bg-[#FF9933]/[0.03] blur-xl"
              duration={20}
              delay={3}
              xRange={30}
              yRange={22}
            />
            <FloatingShape
              className="top-[55%] left-[40%] w-16 h-16 rounded-full border border-[#FF9933]/[0.08]"
              duration={16}
              delay={4}
              xRange={20}
              yRange={15}
            />
          </ParallaxLayer>

          {/* Parallax layer 3 (foreground accents) */}
          <ParallaxLayer speed={-0.03}>
            <FloatingShape
              className="top-[12%] left-[45%] w-3 h-3 rounded-full bg-[#FF9933]/[0.2]"
              duration={12}
              xRange={15}
              yRange={12}
            />
            <FloatingShape
              className="top-[30%] right-[25%] w-2 h-2 rounded-full bg-[#003366]/[0.2]"
              duration={14}
              delay={2}
              xRange={12}
              yRange={10}
            />
            <FloatingShape
              className="bottom-[30%] left-[25%] w-2.5 h-2.5 rounded-full bg-[#138808]/[0.2]"
              duration={10}
              delay={1}
              xRange={18}
              yRange={14}
            />
            <FloatingShape
              className="top-[65%] right-[35%] w-2 h-2 rounded-full bg-[#FF9933]/[0.15]"
              duration={15}
              delay={6}
              xRange={10}
              yRange={8}
            />
          </ParallaxLayer>

          {/* Soft gradient glows */}
          <motion.div
            className="absolute top-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-[#FF9933]/[0.04] blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.06, 0.04] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-[#003366]/[0.04] blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.07, 0.04] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
          <motion.div
            className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#138808]/[0.03] blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.05, 0.03] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="text-center max-w-5xl mx-auto relative z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-[#003366]/15 bg-[#003366]/[0.04]"
          >
            <Sparkles size={14} className="text-[#FF9933]" />
            <span className="text-xs font-bold tracking-wider uppercase text-[#003366]">
              Empowering Digital India · Smart Innovation Platform
            </span>
          </motion.div>

          {/* 3D Headline */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 1200 }}
          >
            <div className="flex justify-center mb-4">
              <GovtEmblem width={56} height={70} />
            </div>
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-[#003366] leading-[0.9]">
              SAHYOG
            </h1>
          </motion.div>

          {/* Tricolor accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mx-auto w-52 h-1 rounded-full my-6 flex overflow-hidden"
          >
            <div className="flex-1 bg-[#FF9933]" />
            <div className="flex-1 bg-[#003366]" />
            <div className="flex-1 bg-[#138808]" />
          </motion.div>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Bridging the Gap Between{' '}
            <span className="text-[#003366] font-semibold">Government Needs</span>{' '}
            &{' '}
            <span className="text-[#FF9933] font-semibold">Startup Innovation</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/active-challenges"
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#FF9933] hover:bg-[#e68a2e] text-white font-bold text-base shadow-lg shadow-[#FF9933]/20 hover:shadow-xl hover:shadow-[#FF9933]/30 hover:scale-[1.02] transition-all duration-300"
            >
              <Globe size={18} />
              Explore Challenges
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#003366] hover:bg-[#002244] text-white font-bold text-base shadow-lg shadow-[#003366]/20 hover:shadow-xl hover:shadow-[#003366]/30 hover:scale-[1.02] transition-all duration-300"
            >
              <LogIn size={18} />
              Portal Login
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-400 tracking-widest uppercase">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={20} className="text-[#FF9933]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── SECTION 2: THE VISION ───────────────────────────────────────── */}
      <section id="vision" className="relative py-28 px-6 bg-white overflow-hidden">
        {/* Subtle top border accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px] flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        {/* Floating parallax shapes */}
        <FloatingShape
          className="top-[10%] right-[5%] w-40 h-40 rounded-full border border-[#FF9933]/[0.07]"
          duration={22}
          delay={1}
          xRange={30}
          yRange={20}
        />
        <FloatingShape
          className="bottom-[8%] left-[3%] w-28 h-28 rounded-full bg-[#003366]/[0.02] blur-xl"
          duration={18}
          delay={3}
          xRange={25}
          yRange={18}
        />
        <FloatingShape
          className="top-[45%] right-[20%] w-3 h-3 rounded-full bg-[#138808]/[0.15]"
          duration={14}
          xRange={12}
          yRange={10}
        />
        <FloatingShape
          className="top-[25%] left-[8%] w-2 h-2 rounded-full bg-[#FF9933]/[0.2]"
          duration={11}
          delay={2}
          xRange={10}
          yRange={8}
        />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: decorative card */}
          <Reveal>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#F8F9FC] to-[#EEF2F7] border border-gray-200 rounded-2xl p-10 shadow-sm">
                {/* Decorative elements */}
                <div className="absolute top-6 right-6 w-16 h-16 rounded-full border-2 border-[#FF9933]/15" />
                <div className="absolute bottom-8 left-8 w-10 h-10 rounded-lg border-2 border-[#138808]/15 rotate-12" />

                <div className="relative flex flex-col items-center gap-5 py-6">
                  <GovtEmblem width={72} height={90} />
                  <div className="text-center">
                    <div className="text-2xl font-black tracking-tight text-[#003366] mb-1">
                      SAHYOG
                    </div>
                    <div className="text-[10px] tracking-[0.25em] uppercase text-[#138808] font-semibold">
                      Innovation Procurement Pipeline
                    </div>
                  </div>
                  {/* Tricolor line */}
                  <div className="w-20 h-[3px] rounded-full flex overflow-hidden">
                    <div className="flex-1 bg-[#FF9933]" />
                    <div className="flex-1 bg-[#003366]" />
                    <div className="flex-1 bg-[#138808]" />
                  </div>
                  <p className="text-xs text-gray-500 text-center max-w-[240px] leading-relaxed">
                    Connecting government challenges with deep-tech startup solutions through secure, compliant procurement.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right: text content */}
          <Reveal delay={0.15}>
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FF9933]/20 bg-[#FFF3E0]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF9933]" />
                <span className="text-xs font-bold tracking-wider uppercase text-[#FF9933]">
                  Our Purpose
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                The{' '}
                <span className="text-[#FF9933]">Vision</span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                Traditional public procurement processes were designed for
                standardized goods, creating insurmountable barriers—like high
                Earnest Money Deposits (EMD) and stringent turnover
                requirements—for emerging startups with novel technologies.
              </p>

              <p className="text-lg text-gray-600 leading-relaxed">
                <span className="text-[#003366] font-semibold">
                  Sahyog is built to change this.
                </span>{' '}
                We are an end-to-end Innovation Procurement Pipeline designed to
                seamlessly connect government departments facing complex
                operational challenges with deep-tech startups ready to solve
                them.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 3: BEYOND A MARKETPLACE (Full-width banner) ─────────── */}
      <section id="sandbox" className="relative py-24 px-6 bg-[#FAFBFD]">
        <Reveal>
          <div className="relative max-w-6xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-[#003366] via-[#0284c7] to-[#003366]" />

            <div className="p-10 md:p-16">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-[#138808]/20 bg-[#E8F5E9]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
                  <span className="text-xs font-bold tracking-wider uppercase text-[#138808]">
                    The Pre-GeM Sandbox
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-8">
                  Beyond a{' '}
                  <span className="text-[#138808]">Marketplace</span>
                </h2>

                <p className="text-lg text-gray-600 leading-relaxed mb-5">
                  While ecosystem portals provide startup recognition, and
                  marketplaces like GeM facilitate the purchase of finalized
                  products, a critical gap remains:{' '}
                  <span className="text-[#003366] font-semibold italic">
                    How does a government officer safely test an unverified
                    technology before buying it?
                  </span>
                </p>

                <p className="text-lg text-gray-600 leading-relaxed">
                  Sahyog acts as the dedicated execution engine that fills this
                  gap. By providing a secure, risk-free{' '}
                  <span className="text-[#138808] font-semibold">
                    Sandbox Environment
                  </span>
                  , startups can run 3-month live pilots with government
                  departments and seamlessly transition to GeM for nationwide
                  procurement under{' '}
                  <span className="text-[#003366] font-semibold">
                    GFR Rule 194
                  </span>
                  .
                </p>

                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-100">
                  {[
                    { num: '3', label: 'Month Pilot Cycles', color: 'text-[#FF9933]' },
                    { num: '194', label: 'GFR Rule Compliance', color: 'text-[#003366]' },
                    { num: '100%', label: 'Risk-Free Testing', color: 'text-[#138808]' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className={`text-3xl md:text-4xl font-black mb-1 ${stat.color}`}>
                        {stat.num}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── SECTION 4: CORE FEATURES (3x2 grid of floating cards) ────────── */}
      <section id="features" className="relative py-28 px-6 bg-white overflow-hidden">
        {/* Floating parallax shapes */}
        <FloatingShape
          className="top-[5%] left-[6%] w-52 h-52 rounded-full border border-[#003366]/[0.06]"
          duration={24}
          xRange={35}
          yRange={25}
        />
        <FloatingShape
          className="bottom-[10%] right-[8%] w-36 h-36 rounded-full bg-[#FF9933]/[0.02] blur-xl"
          duration={20}
          delay={2}
          xRange={28}
          yRange={20}
        />
        <FloatingShape
          className="top-[40%] right-[12%] w-2.5 h-2.5 rounded-full bg-[#003366]/[0.15]"
          duration={13}
          delay={4}
          xRange={15}
          yRange={12}
        />
        <FloatingShape
          className="bottom-[30%] left-[15%] w-2 h-2 rounded-full bg-[#138808]/[0.18]"
          duration={16}
          delay={1}
          xRange={12}
          yRange={9}
        />
        <FloatingShape
          className="top-[15%] right-[40%] w-16 h-16 rounded-lg border border-[#FF9933]/[0.06] rotate-45"
          duration={28}
          delay={3}
          xRange={20}
          yRange={15}
        />
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full border border-[#003366]/15 bg-[#E8EEF5]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#003366]" />
                <span className="text-xs font-bold tracking-wider uppercase text-[#003366]">
                  Platform Architecture
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                Our Core{' '}
                <span className="text-[#003366]">Features</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FloatingCard
                key={i}
                icon={feature.icon}
                title={feature.title}
                text={feature.text}
                index={i}
                accentColor={feature.accent}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: COMMITMENT ───────────────────────────────────────── */}
      <section className="relative py-24 px-6 bg-[#FAFBFD]">
        <Reveal>
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
              {/* Top tricolor */}
              <div className="h-1.5 flex">
                <div className="flex-1 bg-[#FF9933]" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-[#138808]" />
              </div>

              <div className="p-10 md:p-14">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-[#FF9933]/20 bg-[#FFF3E0]">
                  <Sparkles size={12} className="text-[#FF9933]" />
                  <span className="text-xs font-bold tracking-wider uppercase text-[#FF9933]">
                    Digital Public Infrastructure
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-6">
                  Our{' '}
                  <span className="text-[#003366]">Commitment</span>
                </h2>

                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Built as a scalable{' '}
                  <span className="text-[#003366] font-semibold">
                    Digital Public Infrastructure (DPI)
                  </span>
                  . Launching our genesis pilot in collaboration with the{' '}
                  <span className="text-[#FF9933] font-semibold">
                    Government of Maharashtra
                  </span>
                  .
                </p>

                {/* Tricolor line */}
                <div className="mx-auto w-28 h-[3px] rounded-full mt-8 flex overflow-hidden">
                  <div className="flex-1 bg-[#FF9933]" />
                  <div className="flex-1 bg-[#003366]" />
                  <div className="flex-1 bg-[#138808]" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#003366] text-white">
        {/* Top tricolor */}
        <div className="h-[3px] flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <GovtEmblem width={28} height={35} />
            <div>
              <span className="font-bold text-sm tracking-tight">SAHYOG</span>
              <span className="block text-[9px] text-white/60 tracking-wider uppercase">
                Government of India Initiative
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-white/70">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/active-challenges" className="hover:text-white transition-colors">Challenges</Link>
            <Link to="/guidelines" className="hover:text-white transition-colors">GFR Guidelines</Link>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          </div>

          <div className="text-xs text-white/50 text-center md:text-right">
            <p>© 2026 Government of Maharashtra. All rights reserved.</p>
            <p className="mt-1">Built for Smart India Hackathon 2026 (PS-26136)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}