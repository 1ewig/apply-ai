'use client';

import { useRouter } from 'next/navigation';
import { useAnalysisStore } from '@/stores/useAnalysisStore';
import { useApplications } from '@/hooks/useApplications';
import AnalysisSidebar from '@/components/(dashboard)/application-board/match-analysis/AnalysisSidebar';
import AnalysisRightSidebar from '@/components/(dashboard)/application-board/match-analysis/AnalysisRightSidebar';

interface AnalysisLayoutClientProps {
  id: string;
  children: React.ReactNode;
}

export default function AnalysisLayoutClient({ id, children }: AnalysisLayoutClientProps) {
  const router = useRouter();
  const { jobs } = useApplications();

  // Use individual selectors to avoid unnecessary re-renders per coding standards
  const overallScore = useAnalysisStore((s) => s.overallScore);
  const editHistory = useAnalysisStore((s) => s.editHistory);
  const undoLastEdit = useAnalysisStore((s) => s.undoLastEdit);
  const parsedResume = useAnalysisStore((s) => s.parsedResume);
  const jdExtract = useAnalysisStore((s) => s.jdExtract);
  const readinessTier = useAnalysisStore((s) => s.readinessTier);
  const taskPlan = useAnalysisStore((s) => s.taskPlan);
  const rightSidebarOpen = useAnalysisStore((s) => s.rightSidebarOpen);
  const setRightSidebarOpen = useAnalysisStore((s) => s.setRightSidebarOpen);

  const handleBackClick = () => {
    router.push('/application-board');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-surface)] text-[var(--text-body)] w-full">
      {/* 1. Renders presentational left task sidebar */}
      <AnalysisSidebar
        overallScore={overallScore}
        editHistoryCount={editHistory.length}
        onBackClick={handleBackClick}
        onUndoLastEdit={undoLastEdit}
        readinessTier={readinessTier}
        taskPlan={taskPlan}
      />

      {/* 2. Main content page slot */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {children}
      </div>

      {/* 3. Renders presentational right active files sidebar */}
      <AnalysisRightSidebar
        parsedResume={parsedResume}
        jdExtract={jdExtract}
        isOpen={rightSidebarOpen}
        onToggle={() => setRightSidebarOpen(!rightSidebarOpen)}
      />
    </div>
  );
}
