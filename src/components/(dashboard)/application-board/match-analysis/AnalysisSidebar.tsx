'use client';

import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Undo
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface AnalysisSidebarProps {
  overallScore?: number;
  editHistoryCount?: number;
  rejectedEditsCount?: number;
  onBackClick?: () => void;
  onUndoLastEdit?: () => void;
}

export default function AnalysisSidebar({
  overallScore = 0,
  editHistoryCount = 0,
  rejectedEditsCount = 0,
  onBackClick,
  onUndoLastEdit,
}: AnalysisSidebarProps) {
  return (
    <aside className="w-[22%] border-r border-[var(--border)] flex flex-col bg-[var(--bg-dark-gray)]/30 shrink-0">
      {/* Header */}
      <div className="p-5 border-b border-[var(--border)] flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBackClick} className="rounded-full">
          <ArrowLeft className="w-4 h-4 text-[var(--text-body)]" />
        </Button>
        <div className="text-left">
          <h2 className="font-bold text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-cyan)]">APPLYAI TAILORING</h2>
          <p className="text-xs text-[var(--text-muted)]">Agentic Session</p>
        </div>
      </div>

      {/* Match Score Display */}
      <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-card)]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-[var(--text-muted)]">Overall Match</span>
          <span className="text-xs font-bold text-[var(--accent-yellow)]">{overallScore}%</span>
        </div>
        <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[var(--accent)] via-[var(--accent-cyan)] to-[var(--accent-yellow)]"
            initial={{ width: 0 }}
            animate={{ width: `${overallScore}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="mt-3 flex justify-between text-[10px] text-[var(--text-muted)]">
          <span>Edits: {editHistoryCount} applied</span>
          <span>Rejected: {rejectedEditsCount}</span>
        </div>
      </div>

      {/* Spacer to push footer to bottom */}
      <div className="flex-1" />

      {/* Footer controls */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-card)]">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs flex items-center justify-center gap-1.5" 
          onClick={onUndoLastEdit}
          disabled={editHistoryCount === 0}
        >
          <Undo className="w-3.5 h-3.5" /> Undo Last Edit
        </Button>
      </div>
    </aside>
  );
}
