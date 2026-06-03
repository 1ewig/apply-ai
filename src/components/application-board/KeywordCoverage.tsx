import { CheckCircle2, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import type { EnhancedKeyword } from '@/hooks/types';

interface KeywordCoverageProps {
  matchedKeywords: EnhancedKeyword[];
  missingKeywords: EnhancedKeyword[];
}

function getCategoryColor(cat: string) {
  switch (cat) {
    case 'language': return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'framework': return 'bg-violet-50 border-violet-200 text-violet-700';
    case 'tool': return 'bg-cyan-50 border-cyan-200 text-cyan-700';
    case 'domain': return 'bg-amber-50 border-amber-200 text-amber-700';
    case 'soft_skill': return 'bg-pink-50 border-pink-200 text-pink-700';
    case 'education': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    case 'certification': return 'bg-orange-50 border-orange-200 text-orange-700';
    default: return 'bg-slate-50 border-slate-200 text-slate-600';
  }
}

function KeywordTag({ kw, showCategory }: { kw: EnhancedKeyword; showCategory?: boolean }) {
  return (
    <span className="group relative inline-flex flex-col">
      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1 ${getCategoryColor(kw.category)}`}>
        {kw.importance === 'required' && <span className="w-1 h-1 rounded-full bg-current" />}
        {kw.keyword}
      </span>
      {showCategory && (
        <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5 px-1">{kw.category}</span>
      )}
      {kw.matchContext && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded-lg bg-[var(--tooltip-bg)] text-white text-[9px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          {kw.matchContext}
        </span>
      )}
    </span>
  );
}

export default function KeywordCoverage({ matchedKeywords, missingKeywords }: KeywordCoverageProps) {
  return (
    <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-display font-extrabold text-sm text-[var(--text-heading)] mb-4 flex items-center gap-2">
        <FileSpreadsheet className="w-4.5 h-4.5 text-[var(--accent-cyan)]" />
        Keyword Coverage
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
            Matched Keywords ({matchedKeywords.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {matchedKeywords.map((kw) => (
              <KeywordTag key={kw.keyword} kw={kw} showCategory />
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
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((kw) => (
              <span key={kw.keyword} className="group relative inline-flex flex-col">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1 ${getCategoryColor(kw.category)}`}>
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  {kw.keyword}
                </span>
                <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5 px-1">{kw.category}</span>
                {kw.whyImportant && (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded-lg bg-[var(--tooltip-bg)] text-white text-[9px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {kw.whyImportant}
                  </span>
                )}
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
