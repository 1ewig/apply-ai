'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export interface MissingInfoItem {
  field: string;
  description: string;
  severity: 'critical' | 'warning';
}

export interface MissingInfoCardProps {
  items: MissingInfoItem[];
  onSubmitInfo: (providedValues: Record<string, string>) => void;
  onSkipInfo: () => void;
}

export default function MissingInfoCard({ items, onSubmitInfo, onSkipInfo }: MissingInfoCardProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDone(true);
    onSubmitInfo(formValues);
  };

  const handleSkip = () => {
    setIsDone(true);
    onSkipInfo();
  };

  if (isDone) {
    return (
      <div className="p-3 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border)] text-xs text-[var(--text-muted)] italic">
        Response submitted.
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] space-y-3 max-w-md text-left">
      <div className="flex items-center gap-2 text-[var(--accent-yellow)] text-xs font-semibold">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>Missing Resume Details Detected</span>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-medium text-[var(--text-heading)]">
              <span>{item.field}</span>
              {item.severity === 'critical' && (
                <span className="text-[10px] text-red-400 font-bold uppercase">Required</span>
              )}
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">{item.description}</p>
            <input
              type="text"
              placeholder={`Enter your ${item.field.toLowerCase()}...`}
              className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-body)] focus:outline-none focus:border-[var(--accent)] transition"
              value={formValues[item.field] || ''}
              onChange={(e) => setFormValues({ ...formValues, [item.field]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
        <Button
          size="sm"
          className="bg-[var(--accent)] hover:bg-[var(--accent-cyan)] font-semibold text-xs rounded-lg select-none"
          onClick={handleSubmit}
        >
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
          Save & Proceed
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-[var(--text-muted)] hover:text-white rounded-lg select-none"
          onClick={handleSkip}
        >
          Skip for Now
        </Button>
      </div>
    </div>
  );
}
