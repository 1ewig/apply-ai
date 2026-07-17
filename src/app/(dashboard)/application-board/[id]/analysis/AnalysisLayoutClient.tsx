'use client';

import { useRouter } from 'next/navigation';
import { useAnalysisStore } from '@/stores/useAnalysisStore';
import AnalysisSidebar, { SidebarTask } from '@/components/(dashboard)/application-board/match-analysis/AnalysisSidebar';

interface AnalysisLayoutClientProps {
  id: string;
  children: React.ReactNode;
}

export default function AnalysisLayoutClient({ children }: AnalysisLayoutClientProps) {
  const router = useRouter();

  // Use individual selectors to avoid unnecessary re-renders per coding standards
  const taskPlan = useAnalysisStore((s) => s.taskPlan) as SidebarTask[];
  const overallScore = useAnalysisStore((s) => s.overallScore);
  const editHistory = useAnalysisStore((s) => s.editHistory);
  const rejectedEditsLog = useAnalysisStore((s) => s.rejectedEditsLog);
  const updateTaskStatus = useAnalysisStore((s) => s.updateTaskStatus);
  const undoLastEdit = useAnalysisStore((s) => s.undoLastEdit);

  const handleBackClick = () => {
    router.push('/application-board');
  };

  const handleTaskClick = (taskId: string, currentStatus: string) => {
    updateTaskStatus(taskId, currentStatus === 'active' ? 'completed' : 'active');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-surface)] text-[var(--text-body)] w-full">
      {/* Renders presentational sidebar component with passed props */}
      <AnalysisSidebar
        taskPlan={taskPlan}
        overallScore={overallScore}
        editHistoryCount={editHistory.length}
        rejectedEditsCount={rejectedEditsLog.length}
        onBackClick={handleBackClick}
        onTaskClick={handleTaskClick}
        onUndoLastEdit={undoLastEdit}
      />

      {/* Main content slot where Chat & Reference panels render */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {children}
      </div>
    </div>
  );
}
