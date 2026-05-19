import { motion } from 'framer-motion';
import { useReveal } from '@/hooks/useReveal';
import SectionHeader from './SectionHeader';
import FeatureCard from './FeatureCard';
import KanbanPreview from './KanbanPreview';
import ResumeMatchWidget from './ResumeMatchWidget';
import AnalyticsWidget from './AnalyticsWidget';
import FollowUpPreview from './FollowUpPreview';
import InterviewPrepPreview from './InterviewPrepPreview';
import OutreachPreview from './OutreachPreview';
import { staggerContainer, fadeInUp } from '../../utils/animations';

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
