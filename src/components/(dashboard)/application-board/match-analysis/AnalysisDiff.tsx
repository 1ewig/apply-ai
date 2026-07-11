import { ArrowUp, ArrowDown, Minus, GitCompare } from 'lucide-react';
import type { ComparisonResult } from '@/types';

interface AnalysisDiffProps {
  previous: ComparisonResult;
  current: ComparisonResult;
}

function DiffBadge({ value }: { value: number }) {
  if (value > 0) return <span className="flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-600"><ArrowUp className="w-3 h-3" />+{value}%</span>;
  if (value < 0) return <span className="flex items-center gap-0.5 text-[10px] font-extrabold text-rose-600"><ArrowDown className="w-3 h-3" />{value}%</span>;
  return <span className="flex items-center gap-0.5 text-[10px] text-[var(--text-muted)]"><Minus className="w-3 h-3" />0</span>;
}

function findNewItems(prev: string[], curr: string[]): string[] {
  return curr.filter(item => !prev.includes(item));
}

function countMatchedKeywords(kws: any[]): string[] {
  return kws.map(k => typeof k === 'string' ? k : k.keyword);
}

export default function AnalysisDiff({ previous, current }: AnalysisDiffProps) {
  const scoreDiff = current.score - previous.score;
  const prevMatched = countMatchedKeywords(previous.matchedKeywords);
  const currMatched = countMatchedKeywords(current.matchedKeywords);
  const newMatched = findNewItems(prevMatched, currMatched);

  const prevStrengths = previous.strengths || [];
  const currStrengths = current.strengths || [];
  const newStrengths = findNewItems(prevStrengths, currStrengths);

  const prevGaps = previous.gaps || [];
  const currGaps = current.gaps || [];
  const resolvedGaps = findNewItems(currGaps, prevGaps);

  const hasChanges = scoreDiff !== 0 || newMatched.length > 0 || newStrengths.length > 0 || resolvedGaps.length > 0;

  if (!hasChanges) return null;

  return (
    <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)] border-l-4 border-l-amber-400">
      <h3 className="font-display font-extrabold text-sm text-[var(--text-heading)] mb-3 flex items-center gap-2">
        <GitCompare className="w-4.5 h-4.5 text-amber-500" />
        Changes Since Last Analysis
      </h3>

      <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--text-muted)]">Score:</span>
          <span className="text-sm font-extrabold text-[var(--text-heading)]">{previous.score}%</span>
          <DiffBadge value={scoreDiff} />
          <span className="text-sm font-extrabold text-[var(--text-heading)]">{current.score}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {newMatched.length > 0 && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider block mb-1">New Matched Keywords</span>
            <div className="flex flex-wrap gap-1">
              {newMatched.map(kw => (
                <span key={kw} className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 font-semibold">{kw}</span>
              ))}
            </div>
          </div>
        )}

        {newStrengths.length > 0 && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider block mb-1">New Strengths</span>
            <ul className="space-y-0.5">
              {newStrengths.map((s, i) => (
                <li key={i} className="text-[9px] text-emerald-600 flex items-start gap-1">
                  <span className="mt-0.5">+</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {resolvedGaps.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider block mb-1">Resolved Gaps</span>
            <ul className="space-y-0.5">
              {resolvedGaps.map((g, i) => (
                <li key={i} className="text-[9px] text-amber-600 flex items-start gap-1">
                  <span className="mt-0.5 line-through">-</span> {g}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
