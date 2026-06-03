'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutGrid,
  FileText,
  ArrowLeft,
  X,
  Activity,
  CheckSquare,
  TrendingUp,
  Lightbulb,
  MessageSquare,
} from 'lucide-react';
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
  const isAnalysisPage = pathname.includes('/application-board/') && pathname.includes('/analysis');

  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (!isAnalysisPage) return;

    let observer: IntersectionObserver | null = null;
    let intervalId: any = null;

    const targetIds = ['overview', 'keywords', 'strengths', 'suggestions', 'interview'];

    const setupObserver = () => {
      const elements = targetIds.map(id => document.getElementById(id)).filter(Boolean);

      if (elements.length > 0) {
        const obs = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(entry.target.id);
              }
            });
          },
          {
            root: null, // viewport
            rootMargin: '-20% 0px -50% 0px', // trigger when section occupies middle of viewport
            threshold: 0,
          }
        );

        observer = obs;

        elements.forEach((el) => {
          if (el) obs.observe(el);
        });

        if (elements.length === targetIds.length && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    };

    setupObserver();
    intervalId = setInterval(setupObserver, 1000);

    return () => {
      if (observer) observer.disconnect();
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAnalysisPage, pathname]);

  const handleNav = (path: string) => {
    router.push(path);
    onNavClick?.();
  };

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
      onNavClick?.();
    }
  };

  const sections = [
    { id: 'overview', label: 'Match Overview', icon: Activity },
    { id: 'keywords', label: 'Keyword Coverage', icon: CheckSquare },
    { id: 'strengths', label: 'Strengths & Gaps', icon: TrendingUp },
    { id: 'suggestions', label: 'Resume Suggestions', icon: Lightbulb },
    { id: 'interview', label: 'Interview Coach', icon: MessageSquare },
  ];

  return (
    <>
      {isAnalysisPage ? (
        <div className="p-4 border-b border-[var(--border)]">
          <button
            onClick={() => handleNav('/application-board')}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text-heading)] hover:bg-[var(--bg-page)] hover:border-slate-300 transition-all cursor-pointer shadow-sm bg-[var(--bg-surface)] active:scale-[0.98] select-none"
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
          <div>
            <h1 className="font-display font-extrabold text-base text-[var(--text-heading)] leading-none">ApplyAI</h1>
            <span className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase">Workspace</span>
          </div>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-1.5">
        {isAnalysisPage ? (
          sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => handleScrollTo(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-[var(--accent)] border border-blue-100 shadow-sm translate-x-1'
                    : 'text-[var(--text-body)] hover:bg-[var(--bg-page)] hover:translate-x-0.5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} />
                {section.label}
              </button>
            );
          })
        ) : (
          <>
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
          </>
        )}
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
              className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--bg-surface)] border-r border-[var(--border)] flex flex-col text-left"
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

