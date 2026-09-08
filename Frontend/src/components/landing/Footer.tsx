import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#122643] text-white py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-sm flex items-center justify-center">
            {/* Minimal Logo approximation for footer */}
            <div className="flex scale-75">
              <div className="w-3 h-4 bg-orange-500 rounded-l-sm transform -skew-x-12 relative left-0.5"></div>
              <div className="w-3 h-4 bg-teal-500 rounded-r-sm transform -skew-x-12 relative right-0.5"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold text-lg leading-none tracking-wide text-white">SAHYOG</h2>
            <span className="text-[8px] text-gray-400 font-semibold tracking-wider uppercase">GOVERNMENT OF INDIA INITIATIVE</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-gray-300 font-medium">
          <a href="#vision" className="hover:text-white transition-colors">About</a>
          <Link to="/active-challenges" className="hover:text-white transition-colors">Challenges</Link>
          <Link to="/guidelines" className="hover:text-white transition-colors">GFR Guidelines</Link>
          <Link to="/login" className="hover:text-white transition-colors">Login</Link>
        </div>

        {/* Copyright */}
        <div className="text-right flex flex-col items-center md:items-end text-xs text-gray-400">
          <p>© 2024 Government of Maharashtra. All rights reserved.</p>
          <p className="mt-1 opacity-75">Built for Smart India Hackathon 2024 (PS 20120)</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
