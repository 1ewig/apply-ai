'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, FileText, ArrowLeft, X } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { backdropFade } from '@/utils/animations';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const isJobsActive = pathname.startsWith('/application-board');
  const isResumesActive = pathname.startsWith('/resume-templates');

  const handleNav = (path: string) => {
    router.push(path);
    onNavClick?.();
  };

  return (
    <>
      <div className="p-6 border-b border-[var(--border)] flex items-center gap-3">
        <div className="w-8 h-8 grid grid-cols-2 gap-1 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[var(--accent)]" />
          <div className="w-3 h-3 rounded-full bg-[var(--accent-cyan)]" />
          <div className="w-3 h-3 rounded-full bg-[var(--accent-yellow)]" />
          <div className="w-3 h-3 rounded-full bg-[var(--accent)]" />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-base text-[var(--text-heading)] leading-none">ApplyAI</h1>
          <span className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase">Workspace</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5">
        <button
          onClick={() => handleNav('/application-board')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            isJobsActive
              ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-[var(--accent)] border border-blue-100 shadow-sm'
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
              ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-[var(--accent)] border border-blue-100 shadow-sm'
              : 'text-[var(--text-body)] hover:bg-[var(--bg-page)] border border-transparent'
          }`}
        >
          <FileText className="w-4 h-4" />
          Resume Templates
        </button>
      </nav>

      <div className="p-4 border-t border-[var(--border)] space-y-3">
        <div className="flex items-center justify-center p-2.5 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
          <UserButton showName />
        </div>
        <button
          onClick={() => router.push('/')}
          className="w-full flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text-heading)] hover:bg-[var(--bg-page)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Exit Workspace
        </button>
      </div>
    </>
  );
}

export default function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      <aside className="hidden md:flex w-64 bg-white border-r border-[var(--border)] flex-col shrink-0">
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
              className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-[var(--border)] flex flex-col"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-6 right-4 p-1 text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent onNavClick={onMobileClose} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
