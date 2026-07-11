import { CheckCircle2, AlertTriangle, Info, ListChecks } from 'lucide-react';
import type { ActionItem } from '@/types';

interface ActionItemsProps {
  items: ActionItem[];
}

function getPriorityIcon(priority: string) {
  switch (priority) {
    case 'critical': return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
    case 'recommended': return <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />;
    case 'optional': return <Info className="w-3.5 h-3.5 text-[var(--accent)]" />;
    default: return <Info className="w-3.5 h-3.5 text-[var(--text-muted)]" />;
  }
}

function getEffortColor(effort: string) {
  switch (effort) {
    case 'low': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'high': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    default: return 'bg-[var(--bg-page)] text-[var(--text-body)] border-[var(--border)]';
  }
}

export default function ActionItems({ items }: ActionItemsProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-display font-extrabold text-sm text-[var(--text-heading)] mb-1 flex items-center gap-2">
        <ListChecks className="w-4.5 h-4.5 text-[var(--accent)]" />
        Actionable Next Steps
      </h3>
      <p className="text-[10px] text-[var(--text-muted)] mb-4">
        Prioritized checklist of concrete actions to improve your application.
      </p>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border)]">
            <div className="mt-0.5 shrink-0">
              {getPriorityIcon(item.priority)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="text-[10px] font-bold text-[var(--text-heading)]">{item.action}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full border font-semibold ${getEffortColor(item.effort)}`}>
                  {item.effort} effort
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">{item.impact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
