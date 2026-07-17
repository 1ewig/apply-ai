'use client';

import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Check,
  AlertTriangle,
  Undo
} from 'lucide-react';
import Button from '@/components/ui/Button';

export interface SidebarTask {
  id: string;
  title: string;
  section: string;
  severity: 'critical' | 'warning' | 'info';
  estimatedClicks: number;
  needsUserInput: boolean;
  status: 'active' | 'completed' | 'pending' | 'needs_input' | 'skipped';
}

interface AnalysisSidebarProps {
  taskPlan: SidebarTask[];
  overallScore: number;
  editHistoryCount: number;
  rejectedEditsCount: number;
  onBackClick: () => void;
  onTaskClick: (taskId: string, currentStatus: string) => void;
  onUndoLastEdit: () => void;
}

export default function AnalysisSidebar({
  taskPlan,
  overallScore,
  editHistoryCount,
  rejectedEditsCount,
  onBackClick,
  onTaskClick,
  onUndoLastEdit,
}: AnalysisSidebarProps) {
  return (
    <aside className="w-[22%] border-r border-[var(--border)] flex flex-col bg-opacity-30 bg-[var(--bg-dark-gray)] shrink-0">
      {/* Header */}
      <div className="p-5 border-b border-[var(--border)] flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBackClick} className="rounded-full">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
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

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <h3 className="text-xs font-semibold text-[var(--text-muted)] px-2 mb-2 tracking-wider uppercase">Tailoring Tasks</h3>
        {taskPlan && taskPlan.length > 0 ? (
          taskPlan.map((task) => (
            <div 
              key={task.id} 
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                task.status === 'active' 
                  ? 'border-[var(--accent)] bg-[var(--accent)] bg-opacity-5' 
                  : 'border-[var(--border)] hover:border-gray-500'
              }`}
              onClick={() => onTaskClick(task.id, task.status)}
            >
              <div className="flex items-start gap-2">
                {/* Status Bullet */}
                <div className="mt-1 flex-shrink-0">
                  {task.status === 'completed' && <Check className="w-4 h-4 text-green-500" />}
                  {task.status === 'active' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse mt-1" />}
                  {task.status === 'pending' && <div className="w-2.5 h-2.5 rounded-full border border-gray-400 mt-1" />}
                  {task.status === 'needs_input' && <AlertTriangle className="w-4 h-4 text-[var(--accent-yellow)]" />}
                  {task.status === 'skipped' && <div className="w-2.5 h-2.5 bg-gray-600 rounded-full mt-1" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-medium truncate ${task.status === 'completed' ? 'line-through text-[var(--text-muted)]' : ''}`}>
                    {task.title}
                  </h4>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10px] text-[var(--text-muted)] capitalize truncate max-w-[60%]">{task.section}</span>
                    <span className="text-[10px] bg-[var(--border)] px-1.5 py-0.5 rounded text-[var(--text-muted)] flex-shrink-0">
                      {task.estimatedClicks} clicks
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-xs text-[var(--text-muted)]">
            Generating active task list...
          </div>
        )}
      </div>

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
