import { useReveal } from '@/hooks/useReveal';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import KanbanPreview from '../graphics/KanbanPreview';
import { Kanban, Bot, BarChart3 } from 'lucide-react';

const solutions = [
  {
    icon: Kanban,
    color: '#2563EB',
    headline: 'Never lose track of an application',
    body: 'Centralize every job, status, note, and deadline in one organized board.',
  },
  {
    icon: Bot,
    color: '#06B6D4',
    headline: 'Know your resume\'s true fit',
    body: 'Our AI scores your resume against the job description and highlights missing keywords instantly.',
  },
  {
    icon: BarChart3,
    color: '#FACC15',
    headline: 'Understand your pipeline',
    body: 'Visual analytics show where you\'re losing opportunities — and how to fix it.',
  },
];

export default function SolutionsSection() {
  const ref = useReveal();

  return (
    <section id="solutions" className="section-gap">
      <div ref={ref} className="section-container reveal">
        <SectionHeader
          badge="Solutions"
          title="Solve your biggest job search challenges"
        />

        <div className="feature-grid mb-14">
          {solutions.map((sol, i) => {
            const Icon = sol.icon;
            return (
              <Card key={i} hover className="p-7 flex flex-col items-start">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: sol.color + '15', color: sol.color }}
                >
                  <Icon className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="font-display font-bold text-lg text-[var(--text-heading)] mb-2">
                  {sol.headline}
                </h3>
                <p className="text-sm text-[var(--text-body)] leading-relaxed">
                  {sol.body}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Large app preview */}
        <div className="bg-[var(--accent)] rounded-[20px] p-4 md:p-6 shadow-[var(--shadow-float)]">
          <div className="bg-white rounded-[16px] overflow-hidden">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <div className="w-3 h-3 rounded-full bg-[var(--accent-yellow)]" />
                <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-[var(--bg-page)] rounded-full px-4 py-1 text-[10px] text-[var(--text-muted)]">
                  app.jobtrack.ai/board
                </div>
              </div>
            </div>
            <KanbanPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
