"use client";

import { useReveal } from '@/utils/useReveal';
import SectionHeader from './SectionHeader';
import Card from '../ui/Card';
import { Calendar, Bot, BarChart3, Mail, FileText, Sparkles } from 'lucide-react';

const roadmapItems = [
  {
    icon: FileText,
    color: '#06B6D4',
    title: 'Resume PDF Parser',
    status: 'In Development',
    progress: 75,
    description: 'Drag-and-drop your existing PDF resume to automatically extract text structures and populate your template variables instantly.',
  },
  {
    icon: BarChart3,
    color: '#2563EB',
    title: 'Visual Pipeline Analytics',
    status: 'In Development',
    progress: 60,
    description: 'Get deep analytics charts tracking your application flow, callback ratios, and target-industry hiring metrics over time.',
  },
  {
    icon: Mail,
    color: '#8B5CF6',
    title: 'Gmail Auto-Sync Integration',
    status: 'Planned',
    progress: 10,
    description: 'Secure, OAuth-connected Gmail sync. Our AI scans incoming company replies, parsing updates to automatically advance your board cards.',
  },
  {
    icon: Bot,
    color: '#10B981',
    title: 'Interactive Mock Interview Coach',
    status: 'Planned',
    progress: 5,
    description: 'Speak your answers directly to AI-coached prep questions. Receive real-time vocal pace, structural, and filler-word feedback.',
  },
];

export default function RoadmapSection() {
  const ref = useReveal();

  return (
    <section id="roadmap" className="section-gap bg-gradient-to-b from-white to-slate-50 border-t border-slate-100">
      <div ref={ref} className="section-container reveal">
        <SectionHeader
          badge="Product Roadmap"
          title="The Future of AI Job Hunting"
          subtitle="Explore the upcoming upgrades designed to supercharge your career search pipeline."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
          {roadmapItems.map((item, i) => {
            const Icon = item.icon;
            const isInDevelopment = item.status === 'In Development';
            return (
              <Card key={i} hover className="p-6 flex flex-col justify-between border border-black/5 hover:border-[var(--accent)] transition-all bg-white">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: item.color + '12', color: item.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                      isInDevelopment 
                        ? 'bg-blue-50 text-blue-700 border-blue-100' 
                        : 'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      {isInDevelopment && <Sparkles className="w-3 h-3 text-blue-600 animate-pulse" />}
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-base text-[var(--text-heading)] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--text-body)] leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-black/5">
                  <div className="flex justify-between text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    <span>Alpha Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${item.progress}%`,
                        background: `linear-gradient(90deg, ${item.color} 0%, var(--accent-cyan) 100%)`
                      }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
