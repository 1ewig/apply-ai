import { motion } from 'framer-motion';
import { scoreReveal } from '@/utils/animations';
import type { ScoreBreakdown as ScoreBreakdownType } from '@/hooks/types';
import { BarChart3 } from 'lucide-react';

interface ScoreBreakdownProps {
  overallScore: number;
  fitLevel: string;
  breakdown?: ScoreBreakdownType;
}

const AXIS_ITEMS: { key: keyof ScoreBreakdownType; label: string; color: string }[] = [
  { key: 'technicalSkills', label: 'Technical Skills', color: '#2563EB' },
  { key: 'experience', label: 'Experience Level', color: '#7C3AED' },
  { key: 'keywordMatch', label: 'Keyword Match', color: '#059669' },
  { key: 'seniorityFit', label: 'Seniority Fit', color: '#D97706' },
];

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const stroke = score >= 85 ? '#22C55E' : score >= 70 ? '#2563EB' : score >= 50 ? '#FACC15' : '#EF4444';
  const radius = size * 0.45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox="0 0 36 36" className="-rotate-90 shrink-0">
      <circle cx="18" cy="18" r="15" fill="none" stroke="#F1F5F9" strokeWidth="2.5" />
      <motion.circle
        cx="18" cy="18" r="15" fill="none"
        stroke={stroke}
        strokeWidth="2.5" strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </svg>
  );
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-semibold text-[var(--text-muted)] w-28 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[11px] font-extrabold text-[var(--text-heading)] w-8 text-right">{score}%</span>
    </div>
  );
}

export default function ScoreBreakdown({ overallScore, fitLevel, breakdown }: ScoreBreakdownProps) {
  return (
    <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-display font-extrabold text-sm text-[var(--text-heading)] mb-4 flex items-center gap-2">
        <BarChart3 className="w-4.5 h-4.5 text-[var(--accent)]" />
        Score Overview
      </h3>

      <div className="flex items-center gap-6 mb-5">
        <div className="relative flex flex-col items-center">
          <ScoreRing score={overallScore} size={80} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-0.5">
            <span className="text-lg font-display font-extrabold text-[var(--text-heading)]">{overallScore}%</span>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-50 text-[var(--accent)] font-bold mt-1">
            {fitLevel}
          </span>
        </div>

        <div className="flex-1 space-y-2">
          {AXIS_ITEMS.map((item) => (
            <ScoreBar
              key={item.key}
              label={item.label}
              score={breakdown?.[item.key] ?? overallScore}
              color={item.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
