'use client';

import { useAnalysisStore } from '@/hooks/useAnalysisStore';
import Sidebar from '@/components/dashboard/Sidebar';
import AnalysisLoadingOverlay from '@/components/dashboard/AnalysisLoadingOverlay';
import ErrorToast from '@/components/dashboard/ErrorToast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, loadingPhase, phases, error, clearError } = useAnalysisStore();

  return (
    <main className="bg-[var(--bg-page)] min-h-screen animate-fade-up" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <div className="flex min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-y-auto h-screen relative">
          <AnalysisLoadingOverlay isLoading={isLoading} loadingPhase={loadingPhase} phases={phases} />
          <ErrorToast error={error} onDismiss={clearError} />
          <div className="p-8 flex-1">
            {children}
          </div>
        </main>
      </div>
    </main>
  );
}
