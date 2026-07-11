import { ArrowUpDown, Plus, Trash2, Maximize2, Minimize2, Hash, RefreshCw, AlertTriangle } from 'lucide-react';
import type { StructureSuggestion } from '@/types';

interface StructureSuggestionsProps {
  suggestions: StructureSuggestion[];
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'reorder': return <ArrowUpDown className="w-3.5 h-3.5" />;
    case 'add_section': return <Plus className="w-3.5 h-3.5" />;
    case 'remove_section': return <Trash2 className="w-3.5 h-3.5" />;
    case 'expand': return <Maximize2 className="w-3.5 h-3.5" />;
    case 'condense': return <Minimize2 className="w-3.5 h-3.5" />;
    case 'quantify': return <Hash className="w-3.5 h-3.5" />;
    case 'reformat': return <RefreshCw className="w-3.5 h-3.5" />;
    default: return <AlertTriangle className="w-3.5 h-3.5" />;
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'bg-rose-500/10 border-rose-500/20 text-rose-500';
    case 'medium': return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
    case 'low': return 'bg-[var(--bg-page)] border-[var(--border)] text-[var(--text-body)]';
    default: return 'bg-[var(--bg-page)] border-[var(--border)] text-[var(--text-body)]';
  }
}

const TYPE_LABELS: Record<string, string> = {
  reorder: 'Reorder', add_section: 'Add Section', remove_section: 'Remove Section',
  expand: 'Expand', condense: 'Condense', quantify: 'Add Quantification', reformat: 'Reformat',
};

export default function StructureSuggestions({ suggestions }: StructureSuggestionsProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-display font-extrabold text-sm text-[var(--text-heading)] mb-1 flex items-center gap-2">
        <RefreshCw className="w-4.5 h-4.5 text-[var(--accent-cyan)]" />
        Structural Resume Advice
      </h3>
      <p className="text-[10px] text-[var(--text-muted)] mb-4">
        Section-level improvements to make your resume more impactful.
      </p>
      <div className="space-y-3">
        {suggestions.map((s, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-[var(--bg-page)] border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="flex items-center gap-1 text-[9px] font-bold text-[var(--accent)] uppercase tracking-wider">
                {getTypeIcon(s.type)} {TYPE_LABELS[s.type] || s.type}
              </span>
              <span className="text-[9px] text-[var(--text-muted)]">&middot;</span>
              <span className="text-[9px] font-semibold text-[var(--text-muted)]">{s.section}</span>
              <span className={`ml-auto text-[9px] px-2 py-0.5 rounded-full border font-semibold ${getPriorityColor(s.priority)}`}>
                {s.priority}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-body)] mb-1">{s.suggestion}</p>
            <p className="text-[10px] text-[var(--text-muted)] italic">Why: {s.rationale}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
