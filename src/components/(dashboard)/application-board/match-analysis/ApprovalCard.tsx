'use client';

import { motion } from 'framer-motion';
import { Check, RotateCcw, HelpCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export interface ApprovalCardProps {
  status?: 'pending' | 'approved' | 'reparsed';
  onApprove: () => void;
  onReParse: () => void;
}

export default function ApprovalCard({ status = 'pending', onApprove, onReParse }: ApprovalCardProps) {
  const hasResponded = status !== 'pending';

  const handleConfirm = () => {
    onApprove();
  };

  const handleRetry = () => {
    onReParse();
  };

  return (
    <motion.div
      initial={status === 'pending' ? { opacity: 0, y: 15 } : undefined}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md space-y-4 max-w-md text-left shadow-[0_8px_32px_rgba(0,0,0,0.08)] select-none"
    >
      <div className="flex items-center gap-2 text-[var(--accent-cyan)] text-xs font-black tracking-wider uppercase font-mono">
        <HelpCircle className="w-4 h-4 text-[var(--accent-cyan)] shrink-0" />
        <span>Verify Structure</span>
      </div>
      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
        Please review the resume categories on the right panel. Are the sections and content structured accurately?
      </p>
      <div className="pt-3.5 border-t border-[var(--border)] text-xs font-mono">
        {hasResponded ? (
          <div>
            {status === 'approved' ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Looks Good! Proceed (Confirmed)
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4" /> Re-Parsed Layout (Requested)
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
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
        )}
      </div>
    </motion.div>
  );
}
