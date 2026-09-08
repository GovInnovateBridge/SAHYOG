import React from 'react';

const VisionSection = () => {
  return (
    <section id="vision" className="bg-white py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side: The Pipeline Card */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 w-full max-w-md relative overflow-hidden flex flex-col items-center text-center">
            {/* Background circles for decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full mix-blend-multiply filter blur-2xl opacity-70 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-50 rounded-full mix-blend-multiply filter blur-2xl opacity-70 -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10 w-full">
              <div className="flex justify-center mb-6">
                <div className="relative flex items-center justify-center scale-75">
                  <div className="flex">
                    <div className="w-6 h-8 bg-orange-500 rounded-l-md transform -skew-x-12 relative left-1"></div>
                    <div className="w-6 h-8 bg-teal-500 rounded-r-md transform -skew-x-12 relative right-1"></div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 mb-2">SAHYOG</h3>
              <p className="text-[10px] font-bold text-green-700 tracking-widest uppercase mb-8">
                INNOVATION PROCUREMENT PIPELINE
              </p>
              
              <div className="w-12 h-0.5 bg-gray-200 mx-auto mb-8"></div>
              
              <p className="text-sm text-gray-600 mb-12">
                Connecting government challenges with deep-tech startup
                solutions through secure, compliant procurement.
              </p>
              
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">ACTIVE SANDBOX ENVIRONMENT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Text Content */}
        <div className="w-full lg:w-1/2">
          <div className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            OUR PURPOSE
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The <span className="text-orange-500">Vision</span>
          </h2>
          
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p>
              Traditional public procurement processes were designed for standardized goods, 
              creating insurmountable barriers—like high Earnest Money Deposits (EMD) and 
              stringent turnover requirements—for emerging startups with novel technologies.
            </p>
            <p>
              <strong className="text-gray-900">Sahyog is built to change this.</strong> We are an end-to-end Innovation Procurement 
              Pipeline designed to seamlessly connect government departments facing complex 
              operational challenges with deep-tech startups ready to solve them.
            </p>
          </div>
        </div>

      </div>

      {/* Sandbox Stats Section (Beyond a Marketplace) */}
      <div id="sandbox" className="max-w-5xl mx-auto mt-32 bg-gray-50 rounded-[2rem] p-10 md:p-16 border border-gray-100 relative overflow-hidden">
        {/* Top green accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-green-500"></div>

        <div className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
          THE PRE-GEM SANDBOX
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Beyond a <span className="text-green-600">Marketplace</span>
        </h2>
        
        <div className="space-y-4 text-gray-600 mb-12 max-w-3xl">
          <p>
            While ecosystem portals provide startup recognition, and marketplaces like GeM facilitate the purchase 
            of finalized products, a critical gap remains: <strong className="text-gray-900">How does a government officer safely test an unverified 
            technology before buying it?</strong>
          </p>
          <p>
            Sahyog acts as the dedicated execution engine that fills this gap. By providing a secure, risk-free <strong className="text-green-600">Sandbox Environment</strong>, 
            startups can run 3-month live pilots with government departments and 
            seamlessly transition to GeM for nationwide procurement under <strong className="text-gray-900">GFR Rule 194</strong>.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-blue-200 hover:shadow-xl hover:border-blue-100 cursor-default">
            <div className="text-4xl font-black text-orange-500 mb-2">3</div>
            <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">MONTH PILOT CYCLES</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-blue-200 hover:shadow-xl hover:border-blue-100 cursor-default">
            <div className="text-4xl font-black text-[#1a365d] mb-2">194</div>
            <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">GFR RULE COMPLIANCE</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-blue-200 hover:shadow-xl hover:border-blue-100 cursor-default">
            <div className="text-4xl font-black text-green-600 mb-2">100%</div>
            <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">RISK-FREE TESTING</div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default VisionSection;
