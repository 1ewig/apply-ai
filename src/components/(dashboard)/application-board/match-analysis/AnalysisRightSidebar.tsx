'use client';

import {
  FileText,
  ChevronRight,
  Briefcase,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAnalysisStore } from '@/stores/useAnalysisStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import type { JdExtract } from '@/agent/types';

interface ResumeSection {
  heading: string;
  content: string;
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
          <div className="space-y-7 p-1 text-left">
            {parsedResume && parsedResume.length > 0 ? (
              parsedResume.map((section, idx) => (
                <div key={idx} className="group space-y-2.5">
                  <div className="border-b border-[var(--border)] pb-1.5">
                    <h3 className="text-xs font-black text-[var(--accent-cyan)] tracking-widest uppercase font-mono">
                      {section.heading}
                    </h3>
                  </div>
                  <div className="text-xs text-[var(--text-body)] font-sans leading-relaxed pt-0.5">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => <h4 className="text-[11px] font-bold text-[var(--text-heading)] mt-2.5 mb-1 font-sans">{children}</h4>,
                        h2: ({ children }) => <h4 className="text-[11px] font-bold text-[var(--text-heading)] mt-2 mb-1 font-sans">{children}</h4>,
                        h3: ({ children }) => <h4 className="text-[11px] font-bold text-[var(--text-heading)] mt-2 mb-1 font-sans">{children}</h4>,
                        p: ({ children }) => <p className="text-xs text-[var(--text-body)] leading-relaxed mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-[var(--text-body)] mb-2 last:mb-0">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-outside pl-4 space-y-1 text-xs text-[var(--text-body)] mb-2 last:mb-0">{children}</ol>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        strong: ({ children }) => <strong className="font-bold text-[var(--text-heading)]">{children}</strong>,
                        em: ({ children }) => <em className="italic text-[var(--text-muted)]">{children}</em>,
                        code: ({ children }) => (
                          <code className="text-[10px] font-mono bg-[var(--bg-main)] text-[var(--accent-cyan)] px-1.5 py-0.5 rounded border border-[var(--border)] font-semibold">
                            {children}
                          </code>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-2 rounded-lg border border-[var(--border)]">
                            <table className="min-w-full text-xs text-left divide-y divide-[var(--border)]">{children}</table>
                          </div>
                        ),
                        th: ({ children }) => <th className="px-2.5 py-1.5 bg-[var(--bg-main)] font-extrabold text-[10px] text-[var(--text-heading)] uppercase tracking-wider font-mono">{children}</th>,
                        td: ({ children }) => <td className="px-2.5 py-1.5 text-[11px] border-t border-[var(--border)] text-[var(--text-body)]">{children}</td>,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-[var(--accent-cyan)] pl-3 py-1 my-2 text-[11px] text-[var(--text-muted)] italic bg-[var(--bg-main)]/50 rounded-r-lg">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {section.content}
                    </ReactMarkdown>
                  </div>
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
          <div className="space-y-7 p-1 text-left">
            {/* Role & Seniority */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-black text-[var(--accent-cyan)] tracking-widest uppercase font-mono border-b border-[var(--border)] pb-1.5">
                Target Role
              </h3>
              <div className="space-y-1 pt-0.5">
                <div className="flex items-center flex-wrap gap-2">
                  <p className="text-sm font-black text-[var(--text-heading)]">{jdExtract.roleTitle}</p>
                  <span className="inline-block text-[9px] bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] px-2 py-0.5 rounded border border-[var(--accent-cyan)]/20 uppercase font-extrabold tracking-wider shrink-0">
                    {jdExtract.seniorityLevel}
                  </span>
                </div>
                {jdExtract.companyName && (
                  <p className="text-xs font-semibold text-[var(--text-muted)] font-mono">at {jdExtract.companyName}</p>
                )}
              </div>
            </div>

            {/* Company Context */}
            {jdExtract.companyContext && (
              <div className="space-y-2">
                <h3 className="text-xs font-black text-[var(--accent-cyan)] tracking-widest uppercase font-mono border-b border-[var(--border)] pb-1.5">
                  Company Context
                </h3>
                <div className="text-xs text-[var(--text-body)] leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="text-xs text-[var(--text-body)] leading-relaxed mb-1 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-bold text-[var(--text-heading)]">{children}</strong>,
                      em: ({ children }) => <em className="italic text-[var(--text-muted)]">{children}</em>,
                      code: ({ children }) => (
                        <code className="text-[10px] font-mono bg-[var(--bg-main)] text-[var(--accent-cyan)] px-1.5 py-0.5 rounded border border-[var(--border)] font-semibold">
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {jdExtract.companyContext}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Must-have Keywords */}
            {jdExtract.mustHaveKeywords && jdExtract.mustHaveKeywords.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-black text-[var(--accent-cyan)] tracking-widest uppercase font-mono border-b border-[var(--border)] pb-1.5">
                  Must-Have Core Skills
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
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
              <div className="space-y-2">
                <h3 className="text-xs font-black text-[var(--accent-cyan)] tracking-widest uppercase font-mono border-b border-[var(--border)] pb-1.5">
                  Nice-To-Have Skills
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
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
              <div className="space-y-2.5">
                <h3 className="text-xs font-black text-[var(--accent-cyan)] tracking-widest uppercase font-mono border-b border-[var(--border)] pb-1.5">
                  Core Responsibilities
                </h3>
                <div className="space-y-2 pt-0.5">
                  {jdExtract.coreResponsibilities.map((r, i) => (
                    <div key={i} className="text-xs text-[var(--text-body)] leading-relaxed flex gap-2">
                      <span className="text-[var(--accent-cyan)] shrink-0 font-bold">•</span>
                      <div className="flex-1">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <span>{children}</span>,
                            strong: ({ children }) => <strong className="font-bold text-[var(--text-heading)]">{children}</strong>,
                            em: ({ children }) => <em className="italic text-[var(--text-muted)]">{children}</em>,
                            code: ({ children }) => (
                              <code className="text-[10px] font-mono bg-[var(--bg-main)] text-[var(--accent-cyan)] px-1.5 py-0.5 rounded border border-[var(--border)] font-semibold">
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {r}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Required Qualifications */}
            {jdExtract.requiredQualifications && jdExtract.requiredQualifications.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-black text-[var(--accent-cyan)] tracking-widest uppercase font-mono border-b border-[var(--border)] pb-1.5">
                  Required Qualifications
                </h3>
                <div className="space-y-2 pt-0.5">
                  {jdExtract.requiredQualifications.map((q, i) => (
                    <div key={i} className="text-xs text-[var(--text-body)] leading-relaxed flex gap-2">
                      <span className="text-rose-400 shrink-0 font-bold">•</span>
                      <div className="flex-1">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <span>{children}</span>,
                            strong: ({ children }) => <strong className="font-bold text-[var(--text-heading)]">{children}</strong>,
                            em: ({ children }) => <em className="italic text-[var(--text-muted)]">{children}</em>,
                            code: ({ children }) => (
                              <code className="text-[10px] font-mono bg-[var(--bg-main)] text-[var(--accent-cyan)] px-1.5 py-0.5 rounded border border-[var(--border)] font-semibold">
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {q}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferred Qualifications */}
            {jdExtract.preferredQualifications && jdExtract.preferredQualifications.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-black text-[var(--accent-cyan)] tracking-widest uppercase font-mono border-b border-[var(--border)] pb-1.5">
                  Preferred Qualifications
                </h3>
                <div className="space-y-2 pt-0.5">
                  {jdExtract.preferredQualifications.map((q, i) => (
                    <div key={i} className="text-xs text-[var(--text-body)] leading-relaxed flex gap-2">
                      <span className="text-[var(--accent-yellow)] shrink-0 font-bold">•</span>
                      <div className="flex-1">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <span>{children}</span>,
                            strong: ({ children }) => <strong className="font-bold text-[var(--text-heading)]">{children}</strong>,
                            em: ({ children }) => <em className="italic text-[var(--text-muted)]">{children}</em>,
                            code: ({ children }) => (
                              <code className="text-[10px] font-mono bg-[var(--bg-main)] text-[var(--accent-cyan)] px-1.5 py-0.5 rounded border border-[var(--border)] font-semibold">
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {q}
                        </ReactMarkdown>
                      </div>
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
