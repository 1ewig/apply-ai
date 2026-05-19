import { motion } from 'framer-motion';
import { useReveal } from '@/hooks/useReveal';
import SectionHeader from './ui/SectionHeader';
import FeatureCard from './ui/FeatureCard';
import KanbanPreview from './graphics/KanbanPreview';
import ResumeMatchWidget from './graphics/ResumeMatchWidget';
import AnalyticsWidget from './graphics/AnalyticsWidget';
import { AlertTriangle, Bot, User, Sparkles, Send } from 'lucide-react';
import { staggerContainer, fadeInUp } from '../../utils/animations';

function FollowUpPreview() {
  const jobs = [
    { name: 'Stripe — Product Manager', daysAgo: 8, urgent: true },
    { name: 'Figma — UX Designer', daysAgo: 5, urgent: true },
    { name: 'Vercel — Developer Advocate', daysAgo: 2, urgent: false },
  ];

  return (
    <div className="w-full p-4 space-y-2">
      {jobs.map((job, i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-white rounded-lg px-3 py-2.5 border border-[var(--border)] shadow-sm"
        >
          <div>
            <div className="text-xs font-medium text-[var(--text-heading)]">{job.name}</div>
            <div className="text-[10px] text-[var(--text-muted)]">Applied {job.daysAgo} days ago</div>
          </div>
          {job.urgent && (
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] font-semibold whitespace-nowrap flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
              {job.daysAgo} days no update
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function InterviewPrepPreview() {
  return (
    <div className="w-full p-4 space-y-3">
      {/* AI Interviewer bubble */}
      <div className="flex gap-2 items-start">
        <div className="w-6 h-6 rounded-lg bg-[var(--accent-cyan)]/15 flex items-center justify-center shrink-0">
          <Bot className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
        </div>
        <div className="bg-white rounded-r-xl rounded-bl-xl p-2.5 border border-[var(--border)] max-w-[85%] shadow-sm">
          <p className="text-[9px] font-bold text-[var(--text-heading)]">AI Coach</p>
          <p className="text-[10px] text-[var(--text-body)] mt-0.5 leading-snug">
            "Tell me about a time you handled a tight deadline."
          </p>
        </div>
      </div>
      {/* User Response bubble */}
      <div className="flex gap-2 items-start justify-end">
        <div className="bg-[var(--accent)]/5 rounded-l-xl rounded-br-xl p-2.5 border border-[var(--accent)]/10 max-w-[85%] text-right shadow-sm">
          <p className="text-[9px] font-bold text-[var(--accent)]">You</p>
          <p className="text-[10px] text-[var(--text-body)] mt-0.5 leading-snug">
            "I reprioritized the backlog and shipped MVP..."
          </p>
        </div>
        <div className="w-6 h-6 rounded-lg bg-[var(--accent)]/15 flex items-center justify-center shrink-0">
          <User className="w-3.5 h-3.5 text-[var(--accent)]" />
        </div>
      </div>
      {/* AI Feedback */}
      <div className="bg-[#ECFDF5] rounded-lg p-2.5 border border-[#A7F3D0] text-[9px] text-[#065F46] flex gap-1.5 items-center">
        <Sparkles className="w-3.5 h-3.5 text-[#10B981] shrink-0 animate-pulse" />
        <span><strong>Score: 92%</strong> — Excellent focus on outcomes, but mention metrics.</span>
      </div>
    </div>
  );
}

function OutreachPreview() {
  return (
    <div className="w-full p-4 space-y-3">
      <div className="bg-white rounded-lg border border-[var(--border)] overflow-hidden shadow-sm">
        {/* Email header bar */}
        <div className="bg-slate-50 px-3 py-1.5 border-b border-[var(--border)] flex items-center gap-1.5 text-[9px] text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-heading)]">To:</span> recruiter@figma.com
        </div>
        <div className="bg-slate-50 px-3 py-1.5 border-b border-[var(--border)] flex items-center gap-1.5 text-[9px] text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-heading)]">Subject:</span> PM Application — Jordan Lee
        </div>
        {/* Email body */}
        <div className="p-3 text-[9px] space-y-1 text-[var(--text-body)] font-mono leading-relaxed bg-slate-50/50">
          <div>Hi Sarah,</div>
          <div>
            Loved Figma's recent launch! I built a design-to-code tool matching your specs...
          </div>
          <div className="h-4 w-2/3 bg-slate-200 animate-pulse rounded" />
        </div>
      </div>
      {/* Action buttons */}
      <div className="flex gap-2 justify-end">
        <span className="text-[9px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium cursor-default">
          Draft Cover Letter
        </span>
        <span className="text-[9px] px-2.5 py-1 rounded-full bg-[var(--accent)] text-white font-semibold flex items-center gap-1 shadow-sm cursor-default hover:bg-[var(--accent)]/95">
          <Send className="w-2.5 h-2.5" /> Send Outreach
        </span>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  const ref = useReveal();

  return (
    <section id="features" className="section-gap bg-white">
      <div ref={ref} className="section-container reveal">
        <SectionHeader
          badge="Features"
          title="Everything you need. Nothing you don't."
          subtitle="Forget juggling spreadsheets and sticky notes."
        />

        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}
        >
          <motion.div variants={fadeInUp}>
            <FeatureCard
              title="Kanban Job Board"
              caption="Drag-and-drop job cards across stages at a glance."
            >
              <KanbanPreview compact />
            </FeatureCard>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <FeatureCard
              title="AI Resume Matcher"
              caption="Upload your PDF. Get an instant match score and rewrite suggestions."
            >
              <ResumeMatchWidget compact />
            </FeatureCard>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <FeatureCard
              title="Analytics Dashboard"
              caption="Know your numbers. Spot trends before they become problems."
            >
              <AnalyticsWidget compact />
            </FeatureCard>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <FeatureCard
              title="Follow-up Reminders"
              caption="Auto-highlights stale applications so no opportunity slips away."
            >
              <FollowUpPreview />
            </FeatureCard>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <FeatureCard
              title="AI Interview Practice"
              caption="Practice specific mock interview questions customized for the target role with instant AI feedback."
            >
              <InterviewPrepPreview />
            </FeatureCard>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <FeatureCard
              title="Smart Outreach Co-Pilot"
              caption="Draft hyper-personalized networking cover letters and messages directed at recruiters in seconds."
            >
              <OutreachPreview />
            </FeatureCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
