'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
      <div className="p-4 rounded-2xl bg-[var(--bg-card)]/40 border border-[var(--border)] text-xs text-[var(--text-muted)] italic text-left backdrop-blur-sm shadow-sm select-none animate-fade-up">
        ✨ Response submitted. Parsing job description details.
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md space-y-4 max-w-md text-left shadow-[0_8px_32px_rgba(0,0,0,0.08)] select-none"
    >
      <div className="flex items-center gap-2 text-[var(--accent-cyan)] text-xs font-black tracking-wider uppercase font-mono">
        <HelpCircle className="w-4 h-4 text-[var(--accent-cyan)] shrink-0 animate-pulse" />
        <span>Verify Structure</span>
      </div>
      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
        Please review the **parsed resume** categories on the right panel. Are the sections and content structured accurately?
      </p>
      <div className="flex items-center gap-2.5 pt-3.5 border-t border-[var(--border)]">
        <Button
          size="sm"
          className="bg-[var(--accent)] hover:bg-[var(--accent-cyan)] font-extrabold text-xs rounded-xl select-none px-4 py-2 hover:scale-[1.02] transition-transform cursor-pointer shadow-sm text-white"
          onClick={handleConfirm}
        >
          <Check className="w-3.5 h-3.5 mr-1" />
          Looks Good! Proceed
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-[var(--border)] text-[var(--text-body)] hover:text-white font-bold rounded-xl select-none cursor-pointer hover:scale-[1.02] transition-transform px-4 py-2"
          onClick={handleRetry}
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Re-Parse Layout
        </Button>
      </div>
    </motion.div>
  );
}
