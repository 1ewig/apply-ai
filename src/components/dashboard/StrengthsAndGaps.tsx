import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface StrengthsAndGapsProps {
  strengths: string[];
  gaps: string[];
}

export default function StrengthsAndGaps({ strengths, gaps }: StrengthsAndGapsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
        <h3 className="font-display font-extrabold text-sm text-[#16A34A] mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4.5 h-4.5" />
          Key Strengths
        </h3>
        <ul className="space-y-2">
          {strengths.map((str, idx) => (
            <li key={idx} className="text-xs text-[var(--text-body)] flex items-start gap-2 leading-relaxed">
              <div className="w-1 h-1 rounded-full bg-[#16A34A] mt-2 shrink-0"></div>
              <span>{str}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
        <h3 className="font-display font-extrabold text-sm text-[#EF4444] mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4.5 h-4.5" />
          Major Gaps
        </h3>
        <ul className="space-y-2">
          {gaps.map((gap, idx) => (
            <li key={idx} className="text-xs text-[var(--text-body)] flex items-start gap-2 leading-relaxed">
              <div className="w-1 h-1 rounded-full bg-[#EF4444] mt-2 shrink-0"></div>
              <span>{gap}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
