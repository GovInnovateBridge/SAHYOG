import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LogIn } from 'lucide-react';

const bgStyle = {
  backgroundImage: `url('/new.png')`,
  backgroundSize: 'cover',
  backgroundPosition: 'top center',
  backgroundRepeat: 'no-repeat'
};

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 md:pt-48 pb-12 px-4" id="main-content">
      {/* Background */}
      <div className="absolute inset-0 z-0 saturate-[1.2] contrast-[1.05]" style={bgStyle}>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto w-full pl-4 md:pl-32 lg:pl-48">
        
        {/* Badge */}
        <div className="bg-white/90 shadow-sm border border-gray-100 rounded-full px-6 py-1.5 mb-8">
          <span className="text-xs font-bold text-[#1a365d] tracking-wider uppercase">
            EMPOWERING DIGITAL INDIA • SMART INNOVATION PLATFORM
          </span>
        </div>

        {/* Small Logo Above Title */}
        <div className="flex flex-col items-center justify-center gap-1 mb-6 relative z-50">
          <div className="relative flex items-center justify-center mb-2">
            <img src="/logo2.png" alt="Sahyog Logo" className="h-14 md:h-20 lg:h-24 w-auto object-contain mix-blend-multiply opacity-90" />
          </div>
          <div className="text-sm font-bold text-gray-800 tracking-wide z-50">
            SCALE <span className="text-[#1a365d]">WITH</span> <span className="text-green-700">SAHYOG</span>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl font-black text-[#1a365d] tracking-tight mb-2 drop-shadow-sm">
          SAHYOG
        </h1>
        
        {/* Underline decorative element */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-1.5 bg-orange-500 rounded-full"></div>
          <div className="w-12 h-1.5 bg-[#1a365d] rounded-full"></div>
          <div className="w-12 h-1.5 bg-green-600 rounded-full"></div>
        </div>

        {/* Subtitle */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 leading-tight mb-12">
          Bridging the Gap Between <span className="text-[#1a365d] font-bold">Government Needs</span> & <br className="hidden md:block" />
          <span className="text-orange-500 font-bold">Startup Innovation</span>
        </h2>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
          <Link 
            to="/active-challenges"
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
          >
            Explore Challenges
            <ArrowRight size={20} />
          </Link>
          <Link 
            to="/login"
            className="flex items-center justify-center gap-2 bg-[#1a365d] hover:bg-[#122643] text-white px-8 py-3.5 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
          >
            <LogIn size={20} />
            Portal Login
          </Link>
        </div>

        {/* Quote Card */}
        <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 max-w-3xl mt-auto">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-white border-2 border-orange-100 shadow-inner">
            <img src="/modi ji.png" alt="Narendra Modi" className="w-full h-full object-cover" />
          </div>
          <div className="text-left">
            <p className="text-sm md:text-base text-gray-800 font-medium italic mb-2">
              "FOR STARTUPS, TECHNOLOGY AND INNOVATION ARE NOT JUST WORDS; THEY ARE INSTRUMENTS FOR INDIA's TRANSFORMATION."
            </p>
            <p className="text-xs font-bold text-[#1a365d] tracking-wide uppercase">
              — NARENDRA MODI
            </p>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default HeroSection;
