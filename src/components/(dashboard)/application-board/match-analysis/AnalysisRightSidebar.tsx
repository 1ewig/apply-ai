'use client';

import { 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface ResumeSection {
  heading: string;
  content: string;
}

interface AnalysisRightSidebarProps {
  parsedResume: ResumeSection[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function AnalysisRightSidebar({
  parsedResume,
  isOpen,
  onToggle,
}: AnalysisRightSidebarProps) {
  if (!isOpen) {
    return (
      <div className="w-12 border-l border-[var(--border)] bg-[var(--bg-card)] flex flex-col items-center py-6 gap-6 shrink-0 h-full">
        {/* Toggle Expand Button */}
        <Button variant="ghost" size="sm" onClick={onToggle} className="rounded-full">
          <ChevronLeft className="w-4 h-4 text-[var(--text-body)]" />
        </Button>

        {/* Vertically oriented Resume icon */}
        <div className="flex-1 flex flex-col gap-6 justify-center">
          <button 
            onClick={onToggle}
            className="p-2 rounded-lg text-[var(--accent)] bg-[var(--accent)] bg-opacity-10 hover:bg-[var(--border)] transition duration-200"
            title="Expand Resume Panel"
          >
            <FileText className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-[28%] border-l border-[var(--border)] flex flex-col bg-[var(--bg-card)] shrink-0 h-full overflow-hidden animate-fade-left">
      {/* Header controls */}
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-opacity-50 bg-[var(--bg-dark-gray)]">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[var(--accent)]" />
          <span className="text-xs font-bold text-[var(--text-heading)]">Active Resume Reference</span>
        </div>

        {/* Collapse button */}
        <Button variant="ghost" size="sm" onClick={onToggle} className="rounded-full">
          <ChevronRight className="w-4 h-4 text-[var(--text-body)]" />
        </Button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] tracking-wider uppercase">Active Resume Sections</h3>
            <span className="text-[10px] bg-green-500 bg-opacity-10 text-green-400 px-2 py-0.5 rounded border border-green-500 border-opacity-25 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Structuring active
            </span>
          </div>

          {parsedResume && parsedResume.length > 0 ? (
            parsedResume.map((section, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] bg-opacity-30 space-y-2">
                <h4 className="text-xs font-bold text-[var(--text-heading)] tracking-wide border-b border-[var(--border)] pb-1.5 uppercase">
                  {section.heading}
                </h4>
                <pre className="text-xs text-[var(--text-body)] font-sans whitespace-pre-wrap leading-relaxed">
                  {section.content}
                </pre>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-xs text-[var(--text-muted)]">
              No structured resume data available. Run analysis to parse sections.
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
