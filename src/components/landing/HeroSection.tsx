import { motion } from 'framer-motion';
import Link from 'next/link';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import DotGridBackground from './DotGridBackground';
import KanbanPreview from './KanbanPreview';
import ResumeMatchWidget from './ResumeMatchWidget';
import AnalyticsWidget from './AnalyticsWidget';
import { Pin, Sparkles, ArrowRight } from 'lucide-react';
import {
  staggerContainer,
  fadeInUpGentle,
  zoomInEntrance,
  getFloatingTransition,
} from '../../utils/animations';

export default function HeroSection({ onStartDashboard }: { onStartDashboard?: () => void }) {
  return (
    <section className="relative min-h-[82vh] flex items-center overflow-hidden">
      <DotGridBackground />

      {/* Floating Widgets — hidden on mobile */}
      {/* Sticky note — top left */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={zoomInEntrance(0.6, 80, 15)}
        whileHover={{ scale: 1.05, rotate: -1 }}
        className="hidden lg:block absolute top-20 left-6 xl:left-12 z-10 cursor-grab active:cursor-grabbing"
        aria-hidden="true"
      >
        <motion.div
          animate={getFloatingTransition(-6, 6, 0)}
          className="bg-[#FEF9C3] rounded-xl shadow-[var(--shadow-float)] p-4 max-w-[190px] border border-[#FEF08A]"
        >
          <div className="flex items-start gap-1.5 text-[11px] font-medium text-[#92400E] italic leading-snug">
            <Pin className="w-3.5 h-3.5 rotate-45 shrink-0 fill-[#92400E] text-[#92400E]" />
            <span>Follow up with Stripe by Friday</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Resume Match — top right */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={zoomInEntrance(0.8, 80, 18)}
        whileHover={{ scale: 1.03 }}
        className="hidden lg:block absolute top-12 right-6 xl:right-12 z-10 cursor-pointer"
        aria-hidden="true"
      >
        <motion.div
          animate={getFloatingTransition(-8, 7, 0.5)}
          className="bg-white rounded-2xl shadow-[var(--shadow-float)] max-w-[200px]"
        >
          <ResumeMatchWidget compact />
        </motion.div>
      </motion.div>

      {/* Kanban — bottom left */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={zoomInEntrance(0.7, 80, 18)}
        whileHover={{ scale: 1.02 }}
        className="hidden lg:block absolute bottom-16 left-6 xl:left-10 z-10 cursor-pointer"
        aria-hidden="true"
      >
        <motion.div
          animate={getFloatingTransition(-7, 6.5, 0.2)}
          className="bg-white rounded-2xl shadow-[var(--shadow-float)] max-w-[260px]"
        >
          <KanbanPreview compact />
        </motion.div>
      </motion.div>

      {/* Analytics — bottom right */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={zoomInEntrance(0.9, 80, 18)}
        whileHover={{ scale: 1.03 }}
        className="hidden lg:block absolute bottom-12 right-6 xl:right-10 z-10 cursor-pointer"
        aria-hidden="true"
      >
        <motion.div
          animate={getFloatingTransition(-6, 5.8, 0.4)}
          className="bg-white rounded-2xl shadow-[var(--shadow-float)] max-w-[180px]"
        >
          <AnalyticsWidget compact />
        </motion.div>
      </motion.div>

      {/* Hero content */}
      <div className="section-container relative z-20 py-12 md:py-20 text-center">
        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={fadeInUpGentle} className="flex justify-center">
            <Badge className="flex items-center gap-1.5 px-4 py-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-cyan)] fill-[var(--accent-cyan)]/20 animate-pulse" />
              Introducing ApplyAI
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUpGentle}
            className="font-display font-extrabold text-[var(--text-heading)] mt-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)', lineHeight: 1.05 }}
          >
            Land your dream job,
            <br />
            <span className="text-[var(--accent-cyan)]">faster.</span>
          </motion.h1>

          <motion.p
            variants={fadeInUpGentle}
            className="font-display font-extrabold text-[var(--accent-cyan)] mt-1.5"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', lineHeight: 1.3 }}
          >
            AI-powered tracking & matching
          </motion.p>

          <motion.p
            variants={fadeInUpGentle}
            className="mt-4 text-base md:text-lg text-[var(--text-body)] max-w-xl mx-auto leading-relaxed"
          >
            Organize every application. Match your resume to any job.
            <br className="hidden sm:block" />
            Get AI-driven insights — all in one place.
          </motion.p>

          <motion.div
            variants={fadeInUpGentle}
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
          >
            <Link href="/dashboard">
              <Button
                variant="primary"
                size="lg"
                onClick={onStartDashboard}
                className="group shadow-md hover:shadow-lg transition-all duration-200"
              >
                Open Dashboard
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group shadow-sm hover:shadow-md transition-all duration-200"
            >
              Explore Features
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div variants={fadeInUpGentle} className="mt-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="flex -space-x-2">
                {['#2563EB', '#06B6D4', '#FACC15', '#22C55E', '#8B5CF6'].map((color, i) => {
                  const isLightBg = color === '#06B6D4' || color === '#FACC15' || color === '#22C55E';
                  return (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold"
                      style={{ 
                        background: color, 
                        color: isLightBg ? '#0F172A' : '#FFFFFF' 
                      }}
                    >
                      {['MT', 'PK', 'JL', 'AR', 'DF'][i]}
                    </div>
                  );
                })}
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
