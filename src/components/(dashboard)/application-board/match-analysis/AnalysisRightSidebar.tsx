'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  Briefcase,
  Copy,
  Check,
  Sparkles,
  Award
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAnalysisStore } from '@/stores/useAnalysisStore';

// Copy button inline helper component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg bg-[var(--bg-main)] hover:bg-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent-cyan)] border border-[var(--border)] transition-all cursor-pointer shrink-0 select-none"
      title="Copy content"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

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
  const activeTab = useAnalysisStore((s) => s.rightSidebarTab);
  const setActiveTab = useAnalysisStore((s) => s.setRightSidebarTab);

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="w-[28%] border-l border-[var(--border)] flex flex-col bg-[var(--bg-card)] shrink-0 h-full overflow-hidden animate-fade-left">
      {/* Header Controls */}
      <div className="h-[72px] px-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-surface)]/40 backdrop-blur-sm select-none shrink-0">
        <div className="relative flex p-1 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl gap-1">
          {/* Animated Background Pill */}
          <div className="absolute inset-y-1 transition-all duration-300 ease-out bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-sm"
            style={{
              left: activeTab === 'resume' ? '4px' : 'calc(50% + 2px)',
              width: 'calc(50% - 6px)'
            }}
          />

          <button
            onClick={() => setActiveTab('resume')}
            className={`relative z-10 text-[10px] px-3.5 py-1.5 rounded-lg font-bold transition-colors duration-200 cursor-pointer flex items-center gap-1.5 uppercase tracking-wider ${
              activeTab === 'resume' ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Resume
          </button>
          
          <button
            onClick={() => setActiveTab('jd')}
            className={`relative z-10 text-[10px] px-3.5 py-1.5 rounded-lg font-bold transition-colors duration-200 cursor-pointer flex items-center gap-1.5 uppercase tracking-wider ${
              activeTab === 'jd' ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Job Desc
          </button>
        </div>

        {/* Collapse Button */}
        <Button variant="ghost" size="sm" onClick={onToggle} className="rounded-full hover:bg-[var(--border)] transition">
          <ChevronRight className="w-4 h-4 text-[var(--text-body)]" />
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-gradient-to-b from-[var(--bg-card)]/50 to-[var(--bg-main)]/30">
        {activeTab === 'resume' ? (
          <div className="space-y-5">
            {parsedResume && parsedResume.length > 0 ? (
              parsedResume.map((section, idx) => (
                <div 
                  key={idx} 
                  className="group p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm space-y-2.5 text-left hover:border-[var(--accent)]/30 transition-colors duration-200"
                >
                  <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
                    <h4 className="text-[10px] font-extrabold text-[var(--text-heading)] tracking-wider uppercase font-mono">
                      {section.heading}
                    </h4>
                    <CopyButton text={section.content} />
                  </div>
                  <pre className="text-xs text-[var(--text-body)] font-sans whitespace-pre-wrap leading-relaxed">
                    {section.content}
                  </pre>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-xs text-[var(--text-muted)] select-none">
                <FileText className="w-8 h-8 mx-auto mb-2 text-[var(--border)]" />
                No structured resume data available. Parse resume step is active...
              </div>
            )}
          </div>
        ) : jdExtract ? (
          <div className="space-y-5 text-left">
            {/* Role & Seniority */}
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm space-y-2.5 hover:border-[var(--accent)]/30 transition-colors duration-200">
              <h4 className="text-[10px] font-extrabold text-[var(--text-muted)] tracking-wider border-b border-[var(--border)] pb-2 uppercase font-mono">Target Role</h4>
              <div>
                <p className="text-sm font-black text-[var(--text-heading)]">{jdExtract.roleTitle}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Award className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                  <span className="inline-block text-[9px] bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] px-2.5 py-0.5 rounded border border-[var(--accent-cyan)]/20 uppercase font-extrabold tracking-wider">
                    {jdExtract.seniorityLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Company Context */}
            {jdExtract.companyContext && (
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm space-y-2 hover:border-[var(--accent)]/30 transition-colors duration-200">
                <h4 className="text-[10px] font-extrabold text-[var(--text-muted)] tracking-wider border-b border-[var(--border)] pb-2 uppercase font-mono">Company Context</h4>
                <p className="text-xs text-[var(--text-body)] leading-relaxed">{jdExtract.companyContext}</p>
              </div>
            )}

            {/* Must-have Keywords */}
            {jdExtract.mustHaveKeywords && jdExtract.mustHaveKeywords.length > 0 && (
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm space-y-2 hover:border-[var(--accent)]/30 transition-colors duration-200">
                <h4 className="text-[10px] font-extrabold text-[var(--text-muted)] tracking-wider border-b border-[var(--border)] pb-2 uppercase font-mono">Must-Have Core Skills</h4>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {jdExtract.mustHaveKeywords.map((kw) => (
                    <span key={kw} className="text-[9px] font-bold bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/25 tracking-wide uppercase font-mono shadow-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nice-to-have Keywords */}
            {jdExtract.niceToHaveKeywords && jdExtract.niceToHaveKeywords.length > 0 && (
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm space-y-2 hover:border-[var(--accent)]/30 transition-colors duration-200">
                <h4 className="text-[10px] font-extrabold text-[var(--text-muted)] tracking-wider border-b border-[var(--border)] pb-2 uppercase font-mono">Nice-To-Have Skills</h4>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {jdExtract.niceToHaveKeywords.map((kw) => (
                    <span key={kw} className="text-[9px] font-bold bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded border border-amber-500/25 tracking-wide uppercase font-mono shadow-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Core Responsibilities */}
            {jdExtract.coreResponsibilities && jdExtract.coreResponsibilities.length > 0 && (
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm space-y-2.5 hover:border-[var(--accent)]/30 transition-colors duration-200">
                <h4 className="text-[10px] font-extrabold text-[var(--text-muted)] tracking-wider border-b border-[var(--border)] pb-2 uppercase font-mono">Core Responsibilities</h4>
                <div className="space-y-2 pt-1">
                  {jdExtract.coreResponsibilities.map((r, i) => (
                    <div key={i} className="text-xs text-[var(--text-body)] leading-relaxed flex gap-2">
                      <span className="text-[var(--accent-cyan)] shrink-0 font-bold">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Required Qualifications */}
            {jdExtract.requiredQualifications && jdExtract.requiredQualifications.length > 0 && (
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm space-y-2.5 hover:border-[var(--accent)]/30 transition-colors duration-200">
                <h4 className="text-[10px] font-extrabold text-[var(--text-muted)] tracking-wider border-b border-[var(--border)] pb-2 uppercase font-mono">Required Qualifications</h4>
                <div className="space-y-2 pt-1">
                  {jdExtract.requiredQualifications.map((q, i) => (
                    <div key={i} className="text-xs text-[var(--text-body)] leading-relaxed flex gap-2">
                      <span className="text-rose-400 shrink-0 font-bold">•</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferred Qualifications */}
            {jdExtract.preferredQualifications && jdExtract.preferredQualifications.length > 0 && (
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm space-y-2.5 hover:border-[var(--accent)]/30 transition-colors duration-200">
                <h4 className="text-[10px] font-extrabold text-[var(--text-muted)] tracking-wider border-b border-[var(--border)] pb-2 uppercase font-mono">Preferred Qualifications</h4>
                <div className="space-y-2 pt-1">
                  {jdExtract.preferredQualifications.map((q, i) => (
                    <div key={i} className="text-xs text-[var(--text-body)] leading-relaxed flex gap-2">
                      <span className="text-[var(--accent-yellow)] shrink-0 font-bold">•</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-xs text-[var(--text-muted)] select-none">
            <Briefcase className="w-8 h-8 mx-auto mb-2 text-[var(--border)]" />
            No job description extract available. Extract step is active...
          </div>
        )}
      </div>
    </aside>
  );
}
