import React from 'react';
import { ArrowLeft, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const bgStyle = {
  backgroundImage: `url('/new.png')`, 
  backgroundSize: 'cover',
  backgroundPosition: 'top center',
  backgroundRepeat: 'no-repeat'
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-orange-50">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 saturate-[1.2] contrast-[1.05]" style={bgStyle}>
      </div>

      <nav className="w-full bg-[#1a365d] text-white flex items-center justify-between px-6 py-4 shadow-md z-10 relative">
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-gray-300 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center font-bold text-[#1a365d]">
              S
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-lg leading-tight tracking-wide">SAHYOG</h1>
              <span className="text-xs text-orange-400 font-semibold tracking-wider">PORTAL AUTHENTICATION</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center pt-12 md:pt-20 pb-36 md:pb-48 px-4 relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          {/* Main Logo Container */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="relative flex items-center justify-center">
              {/* Approximating the Sahyog S Logo */}
              <div className="flex">
                <div className="w-6 h-8 bg-orange-500 rounded-l-md transform -skew-x-12 relative left-1"></div>
                <div className="w-6 h-8 bg-teal-500 rounded-r-md transform -skew-x-12 relative right-1"></div>
              </div>
              <div className="w-3 h-3 bg-blue-900 rounded-full absolute -top-4"></div>
            </div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-wide">
            SCALE <span className="text-[#1a365d]">WITH</span> <span className="text-green-700">SAHYOG</span>
          </h2>
          
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a365d] mt-6 mb-2">
            Portal Authentication
          </h1>
          <p className="text-gray-600 text-sm md:text-base font-medium">
            Authorized personnel and registered startups only
          </p>
        </div>

        {/* Dynamic Content (Login/Forgot Password forms) */}
        {children}

      </main>

      {/* Bottom Tricolor Wave Graphic Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full preserve-3d" preserveAspectRatio="none">
          <path fill="#f97316" fillOpacity="0.8" d="M0,256L48,250.7C96,245,192,235,288,234.7C384,235,480,245,576,234.7C672,224,768,192,864,181.3C960,171,1056,181,1152,197.3C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fill="#ffffff" fillOpacity="0.9" d="M0,288L48,277.3C96,267,192,245,288,245.3C384,245,480,267,576,272C672,277,768,267,864,250.7C960,235,1056,213,1152,208C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fill="#22c55e" fillOpacity="0.8" d="M0,320L48,314.7C96,309,192,299,288,293.3C384,288,480,288,576,288C672,288,768,288,864,288C960,288,1056,288,1152,288C1248,288,1344,288,1392,288L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default AuthLayout;
