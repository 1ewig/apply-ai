import { useReveal } from '@/hooks/useReveal';
import Button from '../ui/Button';
import { Calendar, Clock, CheckCircle2, BarChart3, Sparkles, Target, ArrowRight } from 'lucide-react';

const floatingIcons = [
  { icon: Calendar, color: '#3B82F6', pos: 'top-8 left-[10%]', delay: 'delay-100' },
  { icon: Clock, color: '#EF4444', pos: 'top-12 right-[12%]', delay: 'delay-300' },
  { icon: CheckCircle2, color: '#10B981', pos: 'bottom-12 left-[15%]', delay: 'delay-200' },
  { icon: BarChart3, color: '#8B5CF6', pos: 'bottom-8 right-[10%]', delay: 'delay-400' },
  { icon: Sparkles, color: '#06B6D4', pos: 'top-1/2 left-[5%]', delay: 'delay-500' },
  { icon: Target, color: '#FACC15', pos: 'top-1/2 right-[5%]', delay: 'delay-100' },
];

export default function CtaSection() {
  const ref = useReveal();

  return (
    <section className="relative overflow-hidden bg-[#0F172A]" style={{ paddingBlock: 'clamp(5rem, 10vw, 8rem)' }}>
      {/* Floating icons — hidden on mobile */}
      {floatingIcons.map((fi, i) => {
        const Icon = fi.icon;
        return (
          <div
            key={i}
            className={`hidden lg:flex absolute ${fi.pos} animate-float ${fi.delay} w-12 h-12 bg-white/[0.08] backdrop-blur border border-white/[0.05] rounded-xl items-center justify-center`}
            aria-hidden="true"
          >
            <Icon className="w-5 h-5" style={{ color: fi.color }} />
          </div>
        );
      })}

      {/* Gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(37, 99, 235, 0.15)' }} aria-hidden="true" />

      <div ref={ref} className="section-container relative z-10 text-center reveal">
        <h2
          className="font-display font-bold text-white"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.15 }}
        >
          Ready to take control of your job search?
        </h2>
        <p className="mt-5 text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
          Join thousands of job seekers who track smarter, match better, and land faster.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <Button
            variant="primary"
            size="lg"
            className="bg-white text-[var(--accent)] hover:bg-white/90 group"
          >
            Get started free
            <ArrowRight className="w-4 h-4 text-[var(--accent)] transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="white-outline" size="lg">
            See how it works
          </Button>
        </div>
      </div>
    </section>
  );
}
