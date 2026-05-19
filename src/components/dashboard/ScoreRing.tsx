import { motion } from 'framer-motion';

function getScoreStroke(score: number) {
  if (score >= 85) return '#22C55E';
  if (score >= 70) return '#2563EB';
  if (score >= 50) return '#FACC15';
  return '#EF4444';
}

interface ScoreRingProps {
  score: number;
  fitLevel: string;
}

export default function ScoreRing({ score, fitLevel }: ScoreRingProps) {
  return (
    <div className="bg-white rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)] flex flex-col items-center justify-center text-center">
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15" fill="none" stroke="#F1F5F9" strokeWidth="2.5" />
          <motion.circle
            cx="18" cy="18" r="15" fill="none"
            stroke={getScoreStroke(score)}
            strokeWidth="2.5" strokeLinecap="round"
            initial={{ strokeDasharray: '0, 100' }}
            animate={{ strokeDasharray: `${score * 0.942}, 100` }}
            transition={{ duration: 1.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-display font-extrabold text-[var(--text-heading)]">{score}%</span>
          <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Match Score</span>
        </div>
      </div>
      <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[10px] font-bold text-[var(--accent)]">
        {fitLevel}
      </div>
    </div>
  );
}
