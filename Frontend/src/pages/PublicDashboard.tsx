import React from 'react';
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import VisionSection from '../components/landing/VisionSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import Footer from '../components/landing/Footer';

const PublicDashboard = () => {
  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <VisionSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default PublicDashboard;