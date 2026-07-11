'use client';

import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Menu } from 'lucide-react';
import { useAnalysisStore } from '@/stores/useAnalysisStore';
import Sidebar from '@/components/(dashboard)/Sidebar';
import AnalysisLoadingOverlay from '@/components/(dashboard)/application-board/AnalysisLoadingOverlay';
import ErrorToast from '@/components/(dashboard)/ErrorToast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, loadingPhase, phases, error, clearError } = useAnalysisStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const storeUser = useMutation(api.users.storeUser);

  useEffect(() => {
    storeUser().catch((err: any) => console.error('Error syncing user in layout:', err));
  }, [storeUser]);

  return (
    <main className="bg-[var(--bg-page)] min-h-screen animate-fade-up" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <div className="flex min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
        <Sidebar
          isMobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
        <main className="flex-1 flex flex-col overflow-y-auto h-screen relative">
          <AnalysisLoadingOverlay isLoading={isLoading} loadingPhase={loadingPhase} phases={phases} />
          <ErrorToast error={error} onDismiss={clearError} />
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
      </div>
    </main>
  );
}
