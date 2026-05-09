import Badge from '../ui/Badge';
import Button from '../ui/Button';
import DotGridBackground from '../graphics/DotGridBackground';
import KanbanPreview from '../graphics/KanbanPreview';
import ResumeMatchWidget from '../graphics/ResumeMatchWidget';
import AnalyticsWidget from '../graphics/AnalyticsWidget';
import { Pin, Sparkles, ArrowRight, Play } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <DotGridBackground />

      {/* Floating Widgets — hidden on mobile */}
      {/* Sticky note — top left */}
      <div
        className="hidden lg:block absolute top-24 left-8 xl:left-16 animate-float delay-100 z-10"
        aria-hidden="true"
      >
        <div className="bg-[#FEF9C3] rounded-xl shadow-[var(--shadow-float)] p-4 max-w-[190px] rotate-[-3deg] border border-[#FEF08A]">
          <div className="flex items-start gap-1.5 text-[11px] font-medium text-[#92400E] italic leading-snug">
            <Pin className="w-3.5 h-3.5 rotate-45 shrink-0 fill-[#92400E] text-[#92400E]" />
            <span>Follow up with Stripe by Friday</span>
          </div>
        </div>
      </div>

      {/* Resume Match — top right */}
      <div
        className="hidden lg:block absolute top-16 right-8 xl:right-16 animate-float delay-300 z-10"
        aria-hidden="true"
      >
        <div className="bg-white rounded-2xl shadow-[var(--shadow-float)] max-w-[200px]">
          <ResumeMatchWidget compact />
        </div>
      </div>

      {/* Kanban — bottom left */}
      <div
        className="hidden lg:block absolute bottom-20 left-8 xl:left-12 animate-float delay-200 z-10"
        aria-hidden="true"
      >
        <div className="bg-white rounded-2xl shadow-[var(--shadow-float)] max-w-[260px]">
          <KanbanPreview compact />
        </div>
      </div>

      {/* Analytics — bottom right */}
      <div
        className="hidden lg:block absolute bottom-16 right-8 xl:right-12 animate-float delay-400 z-10"
        aria-hidden="true"
      >
        <div className="bg-white rounded-2xl shadow-[var(--shadow-float)] max-w-[180px]">
          <AnalyticsWidget compact />
        </div>
      </div>

      {/* Hero content */}
      <div className="section-container relative z-20 py-20 md:py-32 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="animate-fade-up flex justify-center">
            <Badge className="flex items-center gap-1.5 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-cyan)] fill-[var(--accent-cyan)]/20 animate-pulse" />
              Introducing JobTrack AI
            </Badge>
          </div>

          <h1
            className="font-display font-extrabold text-[var(--text-heading)] mt-8 animate-fade-up delay-100"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.05 }}
          >
            Land your dream job,
            <br />
            <span className="text-[var(--accent-cyan)]">faster.</span>
          </h1>

          <p
            className="font-display font-extrabold text-[var(--accent-cyan)] mt-2 animate-fade-up delay-100"
            style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', lineHeight: 1.3 }}
          >
            AI-powered tracking & matching
          </p>

          <p className="mt-6 text-lg md:text-xl text-[var(--text-body)] max-w-xl mx-auto leading-relaxed animate-fade-up delay-200">
            Organize every application. Match your resume to any job.
            <br className="hidden sm:block" />
            Get AI-driven insights — all in one place.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-10 animate-fade-up delay-300">
            <Button variant="primary" size="lg" className="group">
              Get free demo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" className="group">
              <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
              Watch demo
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-14 animate-fade-up delay-400">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="flex -space-x-2">
                {['#2563EB', '#06B6D4', '#FACC15', '#22C55E', '#8B5CF6'].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: color }}
                  >
                    {['MT', 'PK', 'JL', 'AR', 'DF'][i]}
                  </div>
                ))}
              </div>
              <div className="flex gap-0.5 ml-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[var(--accent-yellow)]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Trusted by <span className="font-medium text-[var(--text-heading)]">2,400+</span> job seekers worldwide
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
