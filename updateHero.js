const fs = require('fs');

let content = fs.readFileSync('Frontend/src/pages/PublicDashboard.tsx', 'utf8');

const startIndex = content.indexOf('SECTION 1: HERO');
const endIndex = content.indexOf('SECTION 2: THE VISION');

if (startIndex === -1 || endIndex === -1) {
  console.log('Could not find section boundaries');
  process.exit(1);
}

// Find the beginning of the comment block for section 1
let actualStartIndex = content.lastIndexOf('{/*', startIndex);
let actualEndIndex = content.lastIndexOf('{/*', endIndex);

const newHero = `
      {/* SECTION 1: HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 overflow-hidden bg-[url('https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-fixed"
      >
        {/* Overlay to ensure text readability while preserving the background's beauty */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-[#138808]/20 backdrop-blur-[2px]"></div>

        {/* Beautiful wavy bottom divider to transition into the next section */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20">
          <svg className="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.42,122.9,190.5,109.52Z" fill="url(#hero-gradient)"></path>
            <defs>
              <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#138808" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="100%" stopColor="#FF9933" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="h-4 bg-white w-full -mt-1"></div>
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center mt-8"
        >
          {/* Pill label */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-6 py-2.5 mb-8 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-white/50"
          >
            <Sparkles size={14} className="text-[#003366]" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#003366]">
              Empowering Digital India - Smart Innovation Platform
            </span>
          </motion.div>

          {/* 3D Headline */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 1200 }}
          >
            <div className="flex justify-center mb-4 drop-shadow-xl">
              <GovtEmblem width={64} height={80} />
            </div>
            <h1 className="text-7xl md:text-[6.5rem] font-black tracking-tighter text-[#003366] leading-[0.9] drop-shadow-lg">
              SAHYOG
            </h1>
          </motion.div>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="text-xl md:text-[22px] text-gray-800 max-w-3xl mx-auto mt-8 mb-12 leading-relaxed font-medium drop-shadow-md"
          >
            Bridging the Gap Between{' '}
            <span className="text-[#003366] font-extrabold drop-shadow-sm">Government Needs</span>{' '}
            &{' '}
            <span className="text-[#FF9933] font-extrabold drop-shadow-sm">Startup Innovation</span>
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
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FF9933] text-white rounded-lg font-bold overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#FF9933]/30"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Globe size={18} className="relative z-10" />
              <span className="relative z-10">Explore Challenges</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#003366] text-white rounded-lg font-bold transition-all hover:bg-[#002244] hover:shadow-lg hover:shadow-[#003366]/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn size={18} />
              <span>Portal Login</span>
              <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </motion.div>
          
          {/* PM Modi Quote Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="flex items-center gap-4 bg-white/90 backdrop-blur-md rounded-full p-2 pr-8 shadow-xl border border-white/50 max-w-3xl mt-16 mx-auto"
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png/400px-Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png" 
              alt="Narendra Modi"
              className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm flex-shrink-0"
            />
            <div className="text-left py-1">
              <p className="text-[10px] sm:text-xs font-semibold text-[#003366] italic leading-snug mb-1">
                "I SEE STARTUPS, TECHNOLOGY AND INNOVATION AS EXCITING AND EFFECTIVE INSTRUMENTS FOR INDIA'S TRANSFORMATION."
              </p>
              <p className="text-[9px] uppercase font-bold text-gray-500 not-italic tracking-widest">
                — NARENDRA MODI
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

`;

const newContent = content.substring(0, actualStartIndex) + newHero + content.substring(actualEndIndex);
fs.writeFileSync('Frontend/src/pages/PublicDashboard.tsx', newContent, 'utf8');
console.log('Successfully updated Hero section');
