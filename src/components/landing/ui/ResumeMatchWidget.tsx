import { Check, X } from 'lucide-react';

export default function ResumeMatchWidget({ compact = false }: { compact?: boolean }) {
  const keywords = ['React', 'TypeScript', 'Node.js', 'AWS', 'CI/CD'];

  if (compact) {
    return (
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative w-10 h-10">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" strokeWidth="3" style={{ stroke: 'var(--progress-track)' }} />
              <circle
                cx="18" cy="18" r="14" fill="none" strokeWidth="3"
                style={{ stroke: 'var(--accent)' }}
                strokeDasharray="76.4" strokeDashoffset="9.9"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[var(--text-heading)]">
              87%
            </span>
          </div>
          <div>
            <div className="text-[9px] font-medium text-[var(--text-heading)]">Match Score</div>
            <div className="text-[8px] text-[var(--text-muted)]">vs Stripe PM</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {keywords.slice(0, 3).map((kw) => (
            <span key={kw} className="text-[7px] px-1.5 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-medium flex items-center gap-0.5">
              <Check className="w-2 h-2 text-[var(--accent)] stroke-[3]" />
              {kw}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
      <div className="p-5 w-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" strokeWidth="2.5" style={{ stroke: 'var(--progress-track)' }} />
            <circle
              cx="18" cy="18" r="15" fill="none" strokeWidth="2.5"
              style={{ stroke: 'var(--accent)' }}
              strokeDasharray="94.2" strokeDashoffset="12.3"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-[var(--text-heading)] font-display">
            87%
          </span>
        </div>
        <div>
          <div className="text-sm font-bold text-[var(--text-heading)] font-display">Match Score</div>
          <div className="text-xs text-[var(--text-muted)]">Resume vs. Stripe PM Role</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-xs font-medium text-[var(--text-heading)]">Matched Keywords</div>
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((kw) => (
            <span key={kw} className="text-[10px] px-2.5 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-medium flex items-center gap-1">
              <Check className="w-3 h-3 text-[var(--accent)] stroke-[3] shrink-0" />
              {kw}
            </span>
          ))}
        </div>
        <div className="text-xs font-medium text-[var(--text-heading)] mt-3">Missing</div>
        <div className="flex flex-wrap gap-1.5">
          {['GraphQL', 'Kafka'].map((kw) => (
            <span key={kw} className="text-[10px] px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 font-medium flex items-center gap-1">
              <X className="w-3 h-3 text-[#EF4444] stroke-[3] shrink-0" />
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
