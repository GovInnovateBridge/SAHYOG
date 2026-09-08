import React from 'react';
import { Bot, ShieldCheck, Scale, LayoutDashboard, Wallet, ArrowRightLeft } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: <Bot size={24} className="text-orange-500" />,
      title: "AI Challenge Generator",
      description: "We modernize legacy procurement by translating complex administrative requirements into standardized, outcome-based technical challenges.",
      color: "border-orange-500",
      bgColor: "bg-orange-50",
      hoverShadow: "hover:shadow-orange-500/30"
    },
    {
      id: 2,
      icon: <ShieldCheck size={24} className="text-[#1a365d]" />,
      title: "Zero-Trust TRL Engine",
      description: "We eliminate entire revenue barriers using an automated, evidence-based eligibility screening system driven entirely by Technology Readiness Levels (TRL).",
      color: "border-[#1a365d]",
      bgColor: "bg-blue-50",
      hoverShadow: "hover:shadow-[#1a365d]/30"
    },
    {
      id: 3,
      icon: <Scale size={24} className="text-green-600" />,
      title: "Smart Legal & IP Engine",
      description: "1-click auto-generation of NDAs, IP sharing agreements, and data sharing clauses to protect both innovators and government.",
      color: "border-green-600",
      bgColor: "bg-green-50",
      hoverShadow: "hover:shadow-green-600/30"
    },
    {
      id: 4,
      icon: <LayoutDashboard size={24} className="text-orange-500" />,
      title: "The Sandbox Dashboard",
      description: "A transparent, real-time monitoring system tracking KPIs and operational metrics during the live pilot phase.",
      color: "border-orange-500",
      bgColor: "bg-orange-50",
      hoverShadow: "hover:shadow-orange-500/30"
    },
    {
      id: 5,
      icon: <Wallet size={24} className="text-[#1a365d]" />,
      title: "Smart Escrow Payments",
      description: "Locking budgets upfront and integrating with automated disbursement APIs for milestone-based, timely payments.",
      color: "border-[#1a365d]",
      bgColor: "bg-blue-50",
      hoverShadow: "hover:shadow-[#1a365d]/30"
    },
    {
      id: 6,
      icon: <ArrowRightLeft size={24} className="text-green-600" />,
      title: "GeM Integration Bridge",
      description: "Automatically listing successful, pilot-proven startup solutions onto the Government e-Marketplace for nationwide scaling.",
      color: "border-green-600",
      bgColor: "bg-green-50",
      hoverShadow: "hover:shadow-green-600/30"
    }
  ];

  return (
    <section id="features" className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-[#1a365d] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            PLATFORM ARCHITECTURE
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a365d]">
            Our Core <span className="text-[#1a365d]">Features</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className={`bg-white rounded-xl p-8 border-t-4 shadow-sm border-gray-100 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl ${feature.color} ${feature.hoverShadow}`}
              style={{ borderTopColor: feature.color === 'border-[#1a365d]' ? '#1a365d' : feature.color.split('-')[1] }}
            >
              <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Our Commitment Section */}
        <div className="bg-white rounded-[2rem] p-10 md:p-16 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center max-w-4xl mx-auto relative overflow-hidden">
          {/* Top accent gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-white to-green-500"></div>

          <div className="inline-block bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
            DIGITAL PUBLIC INFRASTRUCTURE
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a365d] mb-6">
            Our Commitment
          </h2>
          
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8">
            Built as a scalable <strong className="text-gray-900">Digital Public Infrastructure (DPI)</strong>. Launching our genesis pilot 
            in collaboration with the <strong className="text-orange-500">Government of Maharashtra</strong>.
          </p>

          <div className="flex justify-center items-center gap-2">
            <div className="w-8 h-1 bg-orange-500 rounded-full"></div>
            <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-8 h-1 bg-green-500 rounded-full"></div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
