import { CheckCircle2, AlertTriangle, FileSpreadsheet, Plus } from 'lucide-react';
import type { EnhancedKeyword } from '@/types';

interface KeywordCoverageProps {
  matchedKeywords: EnhancedKeyword[];
  missingKeywords: EnhancedKeyword[];
  addedKeywords: Set<string>;
  onAddKeyword: (keyword: string) => void;
}

function getCategoryColor(cat: string) {
  switch (cat) {
    case 'language': return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
    case 'framework': return 'bg-violet-500/10 border-violet-500/20 text-violet-500';
    case 'tool': return 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500';
    case 'domain': return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
    case 'soft_skill': return 'bg-pink-500/10 border-pink-500/20 text-pink-500';
    case 'education': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
    case 'certification': return 'bg-orange-500/10 border-orange-500/20 text-orange-500';
    default: return 'bg-[var(--bg-page)] border-[var(--border)] text-[var(--text-body)]';
  }
}

function KeywordTag({ kw, showCategory, isAdded }: { kw: EnhancedKeyword; showCategory?: boolean; isAdded?: boolean }) {
  return (
    <span className="group relative inline-flex flex-col">
      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1 ${getCategoryColor(kw.category)} ${isAdded ? 'border-emerald-500 text-emerald-600 bg-emerald-500/10' : ''}`}>
        {isAdded ? (
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        ) : (
          kw.importance === 'required' && <span className="w-1 h-1 rounded-full bg-current" />
        )}
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

export default function KeywordCoverage({ matchedKeywords, missingKeywords, addedKeywords, onAddKeyword }: KeywordCoverageProps) {
  // Separate missing keywords into actually missing vs added in this session
  const dynamicMissing = missingKeywords.filter((kw) => !addedKeywords.has(kw.keyword));
  const sessionAddedMatched = missingKeywords.filter((kw) => addedKeywords.has(kw.keyword));

  return (
    <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-display font-extrabold text-sm text-[var(--text-heading)] mb-4 flex items-center gap-2">
        <FileSpreadsheet className="w-4.5 h-4.5 text-[var(--accent-cyan)]" />
        Keyword Coverage
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
            Matched Keywords ({matchedKeywords.length + sessionAddedMatched.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {matchedKeywords.map((kw) => (
              <KeywordTag key={kw.keyword} kw={kw} showCategory />
            ))}
            {sessionAddedMatched.map((kw) => (
              <KeywordTag key={kw.keyword} kw={kw} showCategory isAdded />
            ))}
            {matchedKeywords.length === 0 && sessionAddedMatched.length === 0 && (
              <span className="text-xs text-[var(--text-muted)] italic">No matches detected.</span>
            )}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
            Missing Keywords ({dynamicMissing.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {dynamicMissing.map((kw) => (
              <span key={kw.keyword} className="group relative inline-flex flex-col">
                <button
                  onClick={() => onAddKeyword(kw.keyword)}
                  title="Add to resume draft"
                  className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95 ${getCategoryColor(kw.category)} hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/5`}
                >
                  <AlertTriangle className="w-3 h-3 text-rose-600 group-hover:hidden" />
                  <Plus className="w-3 h-3 text-emerald-600 hidden group-hover:inline" />
                  {kw.keyword}
                </button>
                <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5 px-1">{kw.category}</span>
                {kw.whyImportant && (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded-lg bg-[var(--tooltip-bg)] text-white text-[9px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {kw.whyImportant}
                  </span>
                )}
              </span>
            ))}
            {dynamicMissing.length === 0 && (
              <span className="text-xs text-[var(--text-muted)] italic">No missing keywords! Excellent coverage.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

