import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface StrengthsAndGapsProps {
  strengths: string[];
  gaps: string[];
}

export default function StrengthsAndGaps({ strengths, gaps }: StrengthsAndGapsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
        <h3 className="font-display font-extrabold text-sm text-emerald-600 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4.5 h-4.5" />
          Key Strengths
        </h3>
        <ul className="space-y-2">
          {strengths.map((str, idx) => (
            <li key={idx} className="text-xs text-[var(--text-body)] flex items-start gap-2 leading-relaxed">
              <div className="w-1 h-1 rounded-full bg-emerald-600 mt-2 shrink-0"></div>
              <span>{str}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
        <h3 className="font-display font-extrabold text-sm text-rose-600 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4.5 h-4.5" />
          Major Gaps
        </h3>
        <ul className="space-y-2">
          {gaps.map((gap, idx) => (
            <li key={idx} className="text-xs text-[var(--text-body)] flex items-start gap-2 leading-relaxed">
              <div className="w-1 h-1 rounded-full bg-rose-600 mt-2 shrink-0"></div>
              <span>{gap}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
