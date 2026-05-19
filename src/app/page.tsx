"use client";

import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import SolutionsSection from "../components/landing/SolutionsSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import IntegrationsSection from "../components/landing/IntegrationsSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import PricingSection from "../components/landing/PricingSection";
import CtaSection from "../components/landing/CtaSection";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <main 
      className="bg-[var(--bg-page)] min-h-screen animate-fade-up" 
      style={{ fontFamily: '"DM Sans", sans-serif' }}
    >
      <Navbar />
      <HeroSection />
      <SolutionsSection />
      <FeaturesSection />
      <IntegrationsSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
