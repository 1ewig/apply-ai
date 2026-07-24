'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutGrid,
  FileText,
  ArrowLeft,
  Activity,
  Sun,
  Moon,
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/stores/useThemeStore';
import { backdropFade } from '@/utils/animations';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isJobsActive = pathname.startsWith('/application-board');
  const isResumesActive = pathname.startsWith('/resume-templates');
  const isAnalysisPage = pathname.includes('/application-board/') && pathname.includes('/analysis');

  const handleNav = (path: string) => {
    router.push(path);
    onNavClick?.();
  };

  return (
    <>
      {isAnalysisPage ? (
        <div className="p-4 border-b border-[var(--border)]">
          <button
            onClick={() => handleNav('/application-board')}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text-heading)] hover:bg-[var(--bg-page)] hover:border-[var(--accent)] transition-all cursor-pointer shadow-sm bg-[var(--bg-surface)] active:scale-[0.98] select-none"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--accent)] shrink-0" />
            Back to Board
          </button>
        </div>
      ) : (
        <div className="p-6 border-b border-[var(--border)] flex items-center gap-3">
          <div className="w-8 h-8 grid grid-cols-2 gap-1 shrink-0">
            <div className="w-3 h-3 rounded-full bg-[var(--accent)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--accent-cyan)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--accent-yellow)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--accent)]" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-extrabold text-base text-[var(--text-heading)] leading-none">ApplyAI</h1>
            <span className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase">Dashboard</span>
          </div>
          <UserButton />
        </div>
      )}

      <nav className="flex-1 p-4 space-y-1.5">
        {isAnalysisPage ? (
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent-cyan)]/10 text-[var(--accent)] border border-[var(--accent)]/20 shadow-sm translate-x-1 cursor-default"
          >
            <Activity className="w-4 h-4 text-[var(--accent)] shrink-0" />
            Match Analysis
          </button>
        ) : (
          <>
            <button
              onClick={() => handleNav('/application-board')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isJobsActive
                  ? 'bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent-cyan)]/10 text-[var(--accent)] border border-[var(--accent)]/20 shadow-sm'
                  : 'text-[var(--text-body)] hover:bg-[var(--bg-page)] border border-transparent'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Applications Board
            </button>

            <button
              onClick={() => handleNav('/resume-templates')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isResumesActive
                  ? 'bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent-cyan)]/10 text-[var(--accent)] border border-[var(--accent)]/20 shadow-sm'
                  : 'text-[var(--text-body)] hover:bg-[var(--bg-page)] border border-transparent'
              }`}
            >
              <FileText className="w-4 h-4" />
              Resume Templates
            </button>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-[var(--border)] space-y-3">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text-heading)] hover:bg-[var(--bg-page)] hover:scale-[1.01] transition-all cursor-pointer h-9"
        >
          {!mounted ? (
            <div className="w-3.5 h-3.5" />
          ) : theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5" />
              Light
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5" />
              Dark
            </>
          )}
        </button>
        <button
          onClick={() => router.push('/')}
          className="w-full flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text-heading)] hover:bg-[var(--bg-page)] hover:scale-[1.01] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Exit Dashboard
        </button>
      </div>
    </>
  );
}

export default function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      <aside className="hidden md:flex w-64 bg-[var(--bg-surface)] border-r border-[var(--border)] flex-col shrink-0 text-left">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <motion.div
              {...backdropFade}
              className="absolute inset-0 bg-black/40"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute left-0 top-0 h-dvh w-64 bg-[var(--bg-surface)] border-r border-[var(--border)] flex flex-col text-left overflow-y-auto"
            >
              <SidebarContent onNavClick={onMobileClose} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

