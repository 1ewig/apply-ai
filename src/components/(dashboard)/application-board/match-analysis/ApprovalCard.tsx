'use client';

import { useState } from 'react';
import { Check, RotateCcw, HelpCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export interface ApprovalCardProps {
  onApprove: () => void;
  onReParse: () => void;
}

export default function ApprovalCard({ onApprove, onReParse }: ApprovalCardProps) {
  const [responded, setResponded] = useState(false);

  const handleConfirm = () => {
    setResponded(true);
    onApprove();
  };

  const handleRetry = () => {
    setResponded(true);
    onReParse();
  };

  if (responded) {
    return (
      <div className="p-3 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border)] text-xs text-[var(--text-muted)] italic text-left">
        Response submitted.
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] space-y-3 max-w-md text-left">
      <div className="flex items-center gap-2 text-[var(--text-heading)] text-xs font-semibold">
        <HelpCircle className="w-4 h-4 text-[var(--accent)] shrink-0" />
        <span>Resume Structural Accuracy Approval</span>
      </div>
      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
        Please review the **Resume** tab on the right reference panel. Are all sections and details correctly structured?
      </p>
      <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
        <Button
          size="sm"
          className="bg-[var(--accent)] hover:bg-[var(--accent-cyan)] font-semibold text-xs rounded-lg select-none"
          onClick={handleConfirm}
        >
          <Check className="w-3.5 h-3.5 mr-1" />
          Looks Accurate! Proceed
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-[var(--border)] text-[var(--text-body)] hover:text-white rounded-lg select-none"
          onClick={handleRetry}
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Re-parse Resume
        </Button>
      </div>
    </div>
  );
}
