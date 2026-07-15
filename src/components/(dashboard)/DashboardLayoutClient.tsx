'use client';

import { useState, useEffect } from 'react';
import { storeUserAction } from '@/app/actions/users';
import { Menu } from 'lucide-react';
import { useAnalysisStore } from '@/stores/useAnalysisStore';
import Sidebar from '@/components/(dashboard)/Sidebar';
import AnalysisLoadingOverlay from '@/components/(dashboard)/application-board/AnalysisLoadingOverlay';
import ErrorToast from '@/components/(dashboard)/ErrorToast';

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const { isLoading, phases, error, errorTitle, retryAction, clearError } = useAnalysisStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    storeUserAction().catch((err: any) => console.error('Error syncing user in layout:', err));
  }, []);

  return (
    <>
      <Sidebar
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col overflow-y-auto h-screen relative">
        <AnalysisLoadingOverlay isLoading={isLoading} phases={phases} />
        <ErrorToast error={error} title={errorTitle} onDismiss={clearError} onRetry={retryAction} />
        <div className="md:hidden relative flex items-center justify-center px-4 py-4 border-b border-[var(--border)] bg-[var(--bg-page)]">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="absolute left-4 p-1.5 rounded-lg hover:bg-[var(--bg-page)] transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5 text-[var(--text-heading)]" />
          </button>
          <span className="font-display font-extrabold text-base text-[var(--text-heading)]">ApplyAI</span>
        </div>
        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </>
  );
}
