'use client';

import { useState, useEffect } from 'react';
import { storeUserAction } from '@/app/actions/users';
import { Menu } from 'lucide-react';
import { useAnalysisStore } from '@/stores/useAnalysisStore';
import Sidebar from '@/components/(dashboard)/Sidebar';
import AnalysisLoadingOverlay from '@/components/(dashboard)/application-board/AnalysisLoadingOverlay';
import Toast from '@/components/(dashboard)/Toast';

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const { 
    isLoading, 
    phases, 
    error, 
    errorTitle, 
    retryAction, 
    clearError, 
    successMessage, 
    successTitle, 
    clearSuccess 
  } = useAnalysisStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    storeUserAction().catch((err: any) => console.error('Error syncing user in layout:', err));
  }, []);

  // Suppress toast rendering for AI alignment analysis errors (they are handled inline by the full-screen overlay card)
  const isAnalysisError = errorTitle === 'Failed to Run Alignment Match' || errorTitle === 'Failed to Analyze Alignment';
  const displayError = isAnalysisError ? null : error;
  const displayErrorTitle = isAnalysisError ? null : errorTitle;
  const displayRetryAction = isAnalysisError ? null : retryAction;

  return (
    <>
      <Sidebar
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col h-dvh">
        <AnalysisLoadingOverlay isLoading={isLoading} phases={phases} />
        <Toast 
          message={displayError || successMessage}
          title={displayError ? displayErrorTitle : successTitle}
          type={displayError ? 'error' : successMessage ? 'success' : null}
          onDismiss={displayError ? clearError : clearSuccess}
          onRetry={displayError ? displayRetryAction : null}
        />
        <div className="md:hidden relative flex items-center justify-center px-4 py-4 border-b border-[var(--border)] bg-[var(--bg-page)]">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="absolute left-4 p-1.5 rounded-lg hover:bg-[var(--bg-page)] transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5 text-[var(--text-heading)]" />
          </button>
          <span className="font-display font-extrabold text-base text-[var(--text-heading)]">ApplyAI</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </>
  );
}
