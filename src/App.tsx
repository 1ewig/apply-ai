import Navbar from './components/layout/Navbar';
import HeroSection from './components/sections/HeroSection';
import SolutionsSection from './components/sections/SolutionsSection';
import FeaturesSection from './components/sections/FeaturesSection';
import IntegrationsSection from './components/sections/IntegrationsSection';
import TestimonialsSection from './components/sections/TestimonialsSection';
import PricingSection from './components/sections/PricingSection';
import CtaSection from './components/sections/CtaSection';
import Footer from './components/layout/Footer';

export default function App() {
  return (
    <main className="bg-[var(--bg-page)] min-h-screen" style={{ fontFamily: '"DM Sans", sans-serif' }}>
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
