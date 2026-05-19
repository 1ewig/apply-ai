import { CheckCircle2, AlertTriangle, FileSpreadsheet } from 'lucide-react';

interface KeywordCoverageProps {
  matchedKeywords: string[];
  missingKeywords: string[];
}

export default function KeywordCoverage({ matchedKeywords, missingKeywords }: KeywordCoverageProps) {
  return (
    <div className="bg-white rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-display font-extrabold text-sm text-[var(--text-heading)] mb-4 flex items-center gap-2">
        <FileSpreadsheet className="w-4.5 h-4.5 text-[var(--accent-cyan)]" />
        Keyword Coverage
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
            Matched Keywords ({matchedKeywords.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {matchedKeywords.map((kw) => (
              <span key={kw} className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                {kw}
              </span>
            ))}
            {matchedKeywords.length === 0 && (
              <span className="text-xs text-[var(--text-muted)] italic">No matches detected.</span>
            )}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
            Missing Keywords ({missingKeywords.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.map((kw) => (
              <span key={kw} className="text-[10px] px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-100 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
                {kw}
              </span>
            ))}
            {missingKeywords.length === 0 && (
              <span className="text-xs text-[var(--text-muted)] italic">No missing keywords! Excellent coverage.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
