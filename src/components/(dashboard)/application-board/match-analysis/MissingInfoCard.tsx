'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export interface MissingInfoItem {
  field: string;
  description: string;
  severity: 'critical' | 'warning';
}

export interface MissingInfoCardProps {
  status?: 'pending' | 'submitted' | 'skipped';
  items: MissingInfoItem[];
  onSubmitInfo: (providedValues: Record<string, string>) => void;
  onSkipInfo: () => void;
}

export default function MissingInfoCard({ status = 'pending', items, onSubmitInfo, onSkipInfo }: MissingInfoCardProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const hasResponded = status !== 'pending';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitInfo(formValues);
  };

  const handleSkip = () => {
    onSkipInfo();
  };

  return (
    <motion.div 
      initial={status === 'pending' ? { opacity: 0, y: 15 } : undefined}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md space-y-4 max-w-md text-left shadow-[0_8px_32px_rgba(0,0,0,0.08)] select-none"
    >
      <div className="flex items-center gap-2 text-[var(--accent-yellow)] text-xs font-black tracking-wider uppercase font-mono">
        <AlertTriangle className="w-4 h-4 text-[var(--accent-yellow)] shrink-0" />
        <span>Resume gaps detected</span>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-bold text-[var(--text-heading)]">
              <span className="uppercase tracking-wide font-mono text-[10px]">{item.field}</span>
              {item.severity === 'critical' && !hasResponded && (
                <span className="text-[8px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-extrabold uppercase tracking-widest">Required</span>
              )}
            </div>
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">{item.description}</p>
            <input
              type="text"
              placeholder={hasResponded ? 'Not provided' : `Provide ${item.field.toLowerCase()}...`}
              disabled={hasResponded}
              className="w-full bg-[var(--bg-main)]/50 border border-[var(--border)] focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)]/20 rounded-xl px-3.5 py-2 text-xs text-[var(--text-body)] placeholder:text-[var(--text-muted)] focus:outline-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              value={formValues[item.field] || ''}
              onChange={(e) => setFormValues({ ...formValues, [item.field]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="pt-3.5 border-t border-[var(--border)] text-xs font-mono">
        {hasResponded ? (
          <div>
            {status === 'submitted' ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Gaps Resolved (Details Added)
              </span>
            ) : (
              <span className="text-[var(--text-muted)] font-bold flex items-center gap-1.5">
                ⏭ Gaps Skipped
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              className="bg-[var(--accent)] hover:bg-[var(--accent-cyan)] font-extrabold text-xs rounded-xl select-none px-4 py-2 hover:scale-[1.02] transition-transform cursor-pointer shadow-sm text-white"
              onClick={handleSubmit}
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Save & Optimize
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[var(--text-muted)] hover:text-white font-bold rounded-xl select-none cursor-pointer"
              onClick={handleSkip}
            >
              Skip gaps
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
