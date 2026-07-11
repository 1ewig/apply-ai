import { GraduationCap, BookOpen } from 'lucide-react';
import type { SkillRecommendation } from '@/types';

interface SkillRoadmapProps {
  recommendations: SkillRecommendation[];
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'bg-rose-500/10 border-rose-500/20 text-rose-500';
    case 'medium': return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
    case 'low': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
    default: return 'bg-[var(--bg-page)] border-[var(--border)] text-[var(--text-body)]';
  }
}

export default function SkillRoadmap({ recommendations }: SkillRoadmapProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-display font-extrabold text-sm text-[var(--text-heading)] mb-1 flex items-center gap-2">
        <GraduationCap className="w-4.5 h-4.5 text-[var(--accent)]" />
        Skills Development Roadmap
      </h3>
      <p className="text-[10px] text-[var(--text-muted)] mb-4">
        Prioritize learning these skills to increase your match score.
      </p>
      <div className="space-y-3">
        {recommendations.map((r, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-[var(--bg-page)] border border-[var(--border)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold text-[var(--text-heading)]">{r.skill}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-semibold ${getPriorityColor(r.priority)}`}>
                  {r.priority}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] mb-2">{r.reason}</p>
            <div className="flex items-start gap-1.5 text-[10px] text-[var(--accent)] font-semibold">
              <BookOpen className="w-3 h-3 mt-0.5 shrink-0" />
              <span>{r.learningSuggestion}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
