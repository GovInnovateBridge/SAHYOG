import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full flex flex-col z-50 absolute top-0 left-0">
      {/* Top Bar */}
      <div className="bg-[#122643] text-white py-1 px-4 md:px-8 flex justify-between text-xs items-center h-8">
        <div className="font-semibold tracking-wider">GOVERNMENT OF INDIA</div>
        <div className="hidden md:flex gap-4">
          <a href="#main-content" className="hover:text-gray-300">Skip to Main Content</a>
          <a href="#help" className="hover:text-gray-300">Help & Support</a>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-sm py-3 px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center">
            {/* Approximating Sahyog S Logo */}
            <div className="flex">
              <div className="w-5 h-6 bg-orange-500 rounded-l-md transform -skew-x-12 relative left-1"></div>
              <div className="w-5 h-6 bg-teal-500 rounded-r-md transform -skew-x-12 relative right-1"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-xl leading-none text-gray-900">SAHYOG</h1>
            <span className="text-[10px] text-green-700 font-semibold tracking-wide uppercase">INNOVATION TO PROCUREMENT BRIDGE</span>
          </div>
        </div>

        {/* Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#vision" className="hover:text-[#1a365d] transition-colors">Vision</a>
          <a href="#sandbox" className="hover:text-[#1a365d] transition-colors">Sandbox</a>
          <a href="#features" className="hover:text-[#1a365d] transition-colors">Features</a>
          <Link to="/active-challenges" className="hover:text-[#1a365d] transition-colors">Active Challenges</Link>
          <Link to="/guidelines" className="hover:text-[#1a365d] transition-colors">GFR Guidelines</Link>
        </div>

        {/* Action Button */}
        <div>
          <Link 
            to="/login"
            className="bg-[#1a365d] hover:bg-[#122643] text-white px-5 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"
          >
            <LogIn size={16} />
            Portal Login
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
