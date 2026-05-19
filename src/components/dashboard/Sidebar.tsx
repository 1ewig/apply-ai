import { LayoutGrid, FileText, ArrowLeft } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

interface SidebarProps {
  activeTab: 'jobs' | 'resumes';
  isViewingAnalysis: boolean;
  onTabChange: (tab: 'jobs' | 'resumes') => void;
  onBack: () => void;
}

export default function Sidebar({ activeTab, isViewingAnalysis, onTabChange, onBack }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-[var(--border)] flex flex-col shrink-0">
      {/* Brand */}
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

      {/* Navigation Tabs */}
      <nav className="flex-1 p-4 space-y-1.5">
        <button
          onClick={() => onTabChange('jobs')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'jobs' && !isViewingAnalysis
              ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-[var(--accent)] border border-blue-100 shadow-sm'
              : 'text-[var(--text-body)] hover:bg-[var(--bg-page)] border border-transparent'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Applications Board
        </button>

        <button
          onClick={() => onTabChange('resumes')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'resumes' && !isViewingAnalysis
              ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-[var(--accent)] border border-blue-100 shadow-sm'
              : 'text-[var(--text-body)] hover:bg-[var(--bg-page)] border border-transparent'
          }`}
        >
          <FileText className="w-4 h-4" />
          Resume Templates
        </button>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-[var(--border)] space-y-3">
        <div className="flex items-center justify-center p-2.5 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
          <UserButton showName />
        </div>
        <button
          onClick={onBack}
          className="w-full flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text-heading)] hover:bg-[var(--bg-page)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Exit Workspace
        </button>
      </div>
    </aside>
  );
}
