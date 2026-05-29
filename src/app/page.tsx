import type { Metadata } from "next";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import SolutionsSection from "../components/landing/SolutionsSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import IntegrationsSection from "../components/landing/IntegrationsSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import PricingSection from "../components/landing/PricingSection";
import CtaSection from "../components/landing/CtaSection";
import Footer from "../components/landing/Footer";

export const metadata: Metadata = {
  title: "ApplyAI | Production-Grade AI Job Application Tracker & Resume Tailoring",
  description: "Organize your job hunt pipeline in real-time, manage multi-resume templates, and leverage Groq Llama-3.3 LLM analysis to tailor your CV in seconds.",
};

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
