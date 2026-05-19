import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface PrepItem {
  question: string;
  strategy: string;
}

interface InterviewPrepListProps {
  items: PrepItem[];
  expandedIndex: number | null;
  onToggle: (index: number) => void;
}

export default function InterviewPrepList({ items, expandedIndex, onToggle }: InterviewPrepListProps) {
  return (
    <div className="bg-white rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-display font-extrabold text-sm text-[var(--text-heading)] mb-1 flex items-center gap-2">
        <HelpCircle className="w-4.5 h-4.5 text-[var(--accent)]" />
        Targeted Interview Prep
      </h3>
      <p className="text-[10px] text-[var(--text-muted)] mb-4">
        Anticipate and prepare for questions recruiters might ask based on your resume gaps.
      </p>
      <div className="space-y-2">
        {items.map((prep, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div key={idx} className="border border-[var(--border)] rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => onToggle(idx)}
                className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-xs text-[var(--text-heading)] hover:bg-[var(--bg-page)] transition-colors cursor-pointer"
              >
                <span>{prep.question}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[var(--text-muted)]" /> : <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />}
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-[var(--border)] bg-slate-50"
                  >
                    <div className="p-4 text-[11px] text-[var(--text-body)] leading-relaxed">
                      <span className="font-bold text-[var(--text-heading)] block mb-1 text-[9px] uppercase tracking-wider">
                        Suggested Response Strategy
                      </span>
                      {prep.strategy}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
