'use client';

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
  taskPlan?: SidebarTask[];
  overallScore?: number;
  editHistoryCount?: number;
  rejectedEditsCount?: number;
  onBackClick?: () => void;
  onTaskClick?: (taskId: string, currentStatus: string) => void;
  onUndoLastEdit?: () => void;
}

export default function AnalysisSidebar({}: AnalysisSidebarProps) {
  return (
    <aside className="w-[22%] border-r border-[var(--border)] flex flex-col bg-opacity-30 bg-[var(--bg-dark-gray)] shrink-0" />
  );
}
