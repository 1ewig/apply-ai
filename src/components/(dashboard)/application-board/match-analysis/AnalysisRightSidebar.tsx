'use client';

import { useState } from 'react';
import { 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  Briefcase
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface ResumeSection {
  heading: string;
  content: string;
}

interface JdExtract {
  roleTitle: string;
  mustHaveKeywords: string[];
  niceToHaveKeywords: string[];
  seniorityLevel: string;
  coreResponsibilities: string[];
  companyContext: string;
  requiredQualifications: string[];
  preferredQualifications: string[];
}

interface AnalysisRightSidebarProps {
  parsedResume: ResumeSection[];
  jdExtract?: JdExtract | null;
  isOpen: boolean;
  onToggle: () => void;
}

export default function AnalysisRightSidebar({
  parsedResume,
  jdExtract,
  isOpen,
  onToggle,
}: AnalysisRightSidebarProps) {
  const [activeTab, setActiveTab] = useState<'resume' | 'jd'>('resume');

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
            className="p-2 rounded-lg text-[var(--accent)] bg-[var(--accent)]/10 hover:bg-[var(--border)] transition duration-200"
            title="Expand Reference Panel"
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
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-dark-gray)]/50">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('resume')}
            className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'resume'
                ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-heading)] border border-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Resume
          </button>
          <button
            onClick={() => setActiveTab('jd')}
            className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'jd'
                ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-heading)] border border-transparent'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Job Desc
          </button>
        </div>

        {/* Collapse button */}
        <Button variant="ghost" size="sm" onClick={onToggle} className="rounded-full">
          <ChevronRight className="w-4 h-4 text-[var(--text-body)]" />
        </Button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {activeTab === 'resume' ? (
          <div className="space-y-6">
            {parsedResume && parsedResume.length > 0 ? (
              parsedResume.map((section, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]/30 space-y-2 text-left">
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
                No structured resume data available. Parse resume step is active...
              </div>
            )}
          </div>
        ) : jdExtract ? (
          <div className="space-y-6 text-left">
            {/* Role & Seniority */}
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]/30 space-y-2 text-left">
              <h4 className="text-xs font-bold text-[var(--text-heading)] tracking-wide border-b border-[var(--border)] pb-1.5 uppercase">Role</h4>
              <p className="text-sm font-bold text-[var(--text-heading)]">{jdExtract.roleTitle}</p>
              <span className="inline-block text-[10px] bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 rounded border border-[var(--accent)]/20 capitalize">
                {jdExtract.seniorityLevel}
              </span>
            </div>

            {/* Company Context */}
            {jdExtract.companyContext && (
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]/30 space-y-2 text-left">
                <h4 className="text-xs font-bold text-[var(--text-heading)] tracking-wide border-b border-[var(--border)] pb-1.5 uppercase">Company</h4>
                <p className="text-xs text-[var(--text-body)] leading-relaxed">{jdExtract.companyContext}</p>
              </div>
            )}

            {/* Must-have Keywords */}
            {jdExtract.mustHaveKeywords.length > 0 && (
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]/30 space-y-2 text-left">
                <h4 className="text-xs font-bold text-[var(--text-heading)] tracking-wide border-b border-[var(--border)] pb-1.5 uppercase">Must-have Keywords</h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {jdExtract.mustHaveKeywords.map((kw) => (
                    <span key={kw} className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/25">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nice-to-have Keywords */}
            {jdExtract.niceToHaveKeywords.length > 0 && (
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]/30 space-y-2 text-left">
                <h4 className="text-xs font-bold text-[var(--text-heading)] tracking-wide border-b border-[var(--border)] pb-1.5 uppercase">Nice-to-have</h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {jdExtract.niceToHaveKeywords.map((kw) => (
                    <span key={kw} className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/25">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Core Responsibilities */}
            {jdExtract.coreResponsibilities.length > 0 && (
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]/30 space-y-2 text-left">
                <h4 className="text-xs font-bold text-[var(--text-heading)] tracking-wide border-b border-[var(--border)] pb-1.5 uppercase">Core Responsibilities</h4>
                <div className="space-y-1.5 pt-1">
                  {jdExtract.coreResponsibilities.map((r, i) => (
                    <p key={i} className="text-xs text-[var(--text-body)] leading-relaxed flex gap-2">
                      <span className="text-[var(--accent)] shrink-0">•</span>
                      <span>{r}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Required Qualifications */}
            {jdExtract.requiredQualifications.length > 0 && (
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]/30 space-y-2 text-left">
                <h4 className="text-xs font-bold text-[var(--text-heading)] tracking-wide border-b border-[var(--border)] pb-1.5 uppercase">Required Qualifications</h4>
                <div className="space-y-1.5 pt-1">
                  {jdExtract.requiredQualifications.map((q, i) => (
                    <p key={i} className="text-xs text-[var(--text-body)] leading-relaxed flex gap-2">
                      <span className="text-red-400 shrink-0">•</span>
                      <span>{q}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Preferred Qualifications */}
            {jdExtract.preferredQualifications.length > 0 && (
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]/30 space-y-2 text-left">
                <h4 className="text-xs font-bold text-[var(--text-heading)] tracking-wide border-b border-[var(--border)] pb-1.5 uppercase">Preferred Qualifications</h4>
                <div className="space-y-1.5 pt-1">
                  {jdExtract.preferredQualifications.map((q, i) => (
                    <p key={i} className="text-xs text-[var(--text-body)] leading-relaxed flex gap-2">
                      <span className="text-[var(--accent-yellow)] shrink-0">•</span>
                      <span>{q}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-xs text-[var(--text-muted)]">
            No job description extract available. Extract step is active...
          </div>
        )}
      </div>
    </aside>
  );
}
