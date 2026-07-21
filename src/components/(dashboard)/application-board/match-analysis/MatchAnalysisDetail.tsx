'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Compass, Loader2, RotateCcw, FileText, Briefcase } from 'lucide-react';
import type { JobApplication, Resume } from '@/types';
import type { ResumeEdit } from '@/agent/types';
import { useAnalysisStore } from '@/stores/useAnalysisStore';
import { useParseResumeStep } from '@/hooks/useParseResumeStep';
import { useExtractJdStep } from '@/hooks/useExtractJdStep';
import Button from '@/components/ui/Button';
import MissingInfoCard from './MissingInfoCard';
import ApprovalCard from './ApprovalCard';
import ChatInputBar from './ChatInputBar';

interface MatchAnalysisDetailProps {
  job: JobApplication;
  resumeForReRun?: Resume;
  onSaveChanges: (id: string, data: Partial<JobApplication>) => Promise<unknown>;
}

const ApplyAiIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="w-4.5 h-4.5 text-white filter drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]"
  >
    {/* Stylized Outer Portal Ring */}
    <path 
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" 
      fill="currentColor" 
      fillOpacity="0.2" 
    />
    {/* Stylized Letter 'A' that morphs into AI Spark Node */}
    <path 
      d="M12 5.5L6 18H8.5L9.8 15H14.2L15.5 18H18L12 5.5ZM12 9.5L13.5 13H10.5L12 9.5Z" 
      fill="currentColor" 
    />
    {/* Synapse Neurons on top vertex */}
    <circle cx="12" cy="5.5" r="1.5" fill="#22D3EE" />
    <circle cx="6" cy="18" r="1.5" fill="#22D3EE" />
    <circle cx="18" cy="18" r="1.5" fill="#22D3EE" />
    <circle cx="12" cy="11.5" r="1" fill="#FFFFFF" />
    {/* Glowing network lines linking nodes */}
    <line x1="12" y1="5.5" x2="12" y2="9.5" stroke="#22D3EE" strokeWidth="0.5" strokeDasharray="1 1" />
  </svg>
);

function DiffCard({ 
  edit,
  onAccept,
  onReject,
  onModify 
}: { 
  edit: ResumeEdit;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onModify: (id: string, content: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(edit.afterContent);

  useEffect(() => {
    setText(edit.afterContent);
  }, [edit.afterContent]);

  return (
    <div className="w-full max-w-md border border-[var(--border)] rounded-2xl bg-[var(--bg-surface)]/10 overflow-hidden backdrop-blur-md text-left shadow-[0_8px_32px_rgba(0,0,0,0.12)] animate-fade-up select-none">
      <div className="px-4 py-2.5 bg-[var(--bg-card)]/70 border-b border-[var(--border)] flex justify-between items-center text-xs">
        <span className="font-extrabold uppercase tracking-widest text-[var(--accent-cyan)] font-mono text-[9px]">
          {edit.sectionKey} section tweak
        </span>
        {edit.scoreImpact > 0 && edit.status !== 'accepted' && edit.status !== 'rejected' && (
          <span className="font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25 text-[9px] tracking-wider uppercase">
            +{edit.scoreImpact}% Match Impact
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        {edit.reasoning && (
          <p className="text-xs text-[var(--text-body)] leading-relaxed italic">
            {edit.reasoning}
          </p>
        )}

        <div className="space-y-2">
          {edit.beforeContent && (
            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-xs">
              <span className="text-[9px] uppercase tracking-wider text-rose-400/80 font-extrabold block mb-1">Original Text</span>
              <p className="text-rose-300 line-through whitespace-pre-wrap leading-relaxed font-mono text-[11px]">{edit.beforeContent}</p>
            </div>
          )}

          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs">
            <span className="text-[9px] uppercase tracking-wider text-emerald-400/80 font-extrabold block mb-1">Tailored Suggestion</span>
            {isEditing ? (
              <textarea
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-lg p-2.5 text-xs font-mono text-[var(--text-body)] focus:outline-none focus:border-[var(--accent)] transition h-28 resize-none custom-scrollbar"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            ) : (
              <p className="text-emerald-300 whitespace-pre-wrap leading-relaxed font-mono text-[11px]">{edit.afterContent}</p>
            )}
          </div>
        </div>
      </div>

      {edit.status === 'proposed' || edit.status === 'modified' ? (
        <div className="px-4 py-3 bg-[var(--bg-card)]/60 border-t border-[var(--border)] flex justify-between items-center gap-2">
          {isEditing ? (
            <div className="flex gap-2 w-full justify-between">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="text-xs bg-[var(--accent)] hover:bg-[var(--accent-cyan)] font-bold text-white select-none cursor-pointer"
                  onClick={() => {
                    onModify(edit.id, text);
                    setIsEditing(false);
                  }}
                >
                  Save Tweaks
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-[var(--text-muted)] hover:text-white font-bold select-none cursor-pointer"
                  onClick={() => {
                    setText(edit.afterContent);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 font-bold text-white select-none cursor-pointer"
                  onClick={() => onAccept(edit.id)}
                >
                  Approve Tweak
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-[var(--border)] text-[var(--text-body)] hover:text-white font-bold select-none cursor-pointer"
                  onClick={() => onReject(edit.id)}
                >
                  Reject
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-cyan)] font-bold select-none cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                Modify Suggestion
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="px-4 py-2.5 bg-[var(--bg-card)]/40 border-t border-[var(--border)] text-xs text-[var(--text-muted)] flex items-center justify-between font-mono">
          <span>Outcome status:</span>
          <span className={edit.status === 'accepted' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {edit.status === 'accepted' ? 'Approved & Incorporated' : 'Rejected'}
          </span>
        </div>
      )}
    </div>
  );
}

export default function MatchAnalysisDetail({
  job,
  resumeForReRun,
  onSaveChanges,
}: MatchAnalysisDetailProps) {
  const chatMessages = useAnalysisStore((s) => s.chatMessages);
  const addChatMessage = useAnalysisStore((s) => s.addChatMessage);
  const acceptEdit = useAnalysisStore((s) => s.acceptEdit);
  const rejectEdit = useAnalysisStore((s) => s.rejectEdit);
  const modifyEdit = useAnalysisStore((s) => s.modifyEdit);
  const rightSidebarOpen = useAnalysisStore((s) => s.rightSidebarOpen);
  const setRightSidebarOpen = useAnalysisStore((s) => s.setRightSidebarOpen);
  const setRightSidebarTab = useAnalysisStore((s) => s.setRightSidebarTab);

  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const {
    isParsing,
    runParseStep,
    handleApproveStep1: originalApproveStep1,
    handleReParseStep1,
    handleResolveMissingInfo,
    handleSkipMissingInfo,
  } = useParseResumeStep({
    job,
    resumeForReRun,
    onSaveChanges,
  });

  const { isExtracting, runExtractJd } = useExtractJdStep({
    jobDescription: job.jobDescription || '',
    onSaveChanges,
    jobId: job.id,
  });

  const handleApproveStep1 = () => {
    originalApproveStep1();
    runExtractJd();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isParsing, isExtracting]);

  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    if (job.chatMessages) {
      const dbMessages = job.chatMessages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        type: m.type,
        metaJson: m.meta ? JSON.stringify(m.meta) : undefined,
      }));
      lastSavedRef.current = JSON.stringify(dbMessages);
    } else {
      lastSavedRef.current = '';
    }
  }, [job.id]);

  useEffect(() => {
    if (chatMessages.length === 0) return;

    const dbMessages = chatMessages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      type: m.type,
      metaJson: m.meta ? JSON.stringify(m.meta) : undefined,
    }));

    const serialized = JSON.stringify(dbMessages);
    if (lastSavedRef.current === serialized) return;

    lastSavedRef.current = serialized;
    onSaveChanges(job.id, { chatMessages: dbMessages }).catch((err) => {
      console.error('Failed to sync chat history to Convex:', err);
    });
  }, [chatMessages, job.id, onSaveChanges]);

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const val = inputVal.trim();
    setInputVal('');

    addChatMessage({
      role: 'user',
      content: val,
      type: 'user',
    });

    setTimeout(() => {
      addChatMessage({
        role: 'assistant',
        content: `I received your message: "${val}". We are currently focusing on Step 1 (Parse Resume). Let me know how you would like to proceed.`,
        type: 'agent-text',
      });
    }, 1000);
  };

  const handleChipClick = (chipText: string) => {
    addChatMessage({
      role: 'user',
      content: chipText,
      type: 'user',
    });
    setTimeout(() => {
      addChatMessage({
        role: 'assistant',
        content: `Checking your resume structure regarding "${chipText}". The parsed sections are visible on the right side.`,
        type: 'agent-text',
      });
    }, 800);
  };

  const renderMessageContent = (text: string, isUser: boolean) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong
            key={i}
            className={`font-bold ${isUser ? 'text-white' : 'text-[var(--text-heading)]'}`}
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderTimelineMessage = (msg: typeof chatMessages[0]) => {
    if (msg.type === 'system-event') {
      return (
        <div key={msg.id} className="flex justify-center my-2 select-none">
          <span className="px-3.5 py-1.5 bg-[var(--bg-surface)]/20 border border-[var(--border)] text-[10px] text-[var(--text-muted)] rounded-full font-mono">
            ⚙️ {msg.content}
          </span>
        </div>
      );
    }

    if (msg.type === 'score-update') {
      const delta = (msg.meta?.after ?? 0) - (msg.meta?.before ?? 0);
      return (
        <div key={msg.id} className="flex justify-center my-3 select-none">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/25 text-emerald-400 rounded-full text-xs font-bold flex items-center gap-2 shadow-[0_2px_12px_rgba(16,185,129,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Score Update:</span>
            <span className="line-through opacity-60 font-medium">{msg.meta?.before}%</span>
            <span>→</span>
            <span className="text-sm font-black">{msg.meta?.after}%</span>
            {delta > 0 && (
              <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-extrabold font-mono">+{delta}%</span>
            )}
          </motion.div>
        </div>
      );
    }

    const isUser = msg.role === 'user';
    const isAssistant = msg.role === 'assistant';

    return (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 select-none ${
            isAssistant
              ? 'bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-cyan)] text-white shadow-sm'
              : msg.role === 'system'
              ? 'bg-gray-800 text-[var(--text-muted)] border border-[var(--border)]'
              : 'bg-[var(--accent-yellow)] text-gray-950 shadow-sm'
          }`}
        >
          {isAssistant ? (
            <ApplyAiIcon />
          ) : msg.role === 'system' ? (
            <Compass className="w-4 h-4" />
          ) : (
            <User className="w-4 h-4" />
          )}
        </div>

        <div className="flex flex-col items-start gap-2 max-w-full">
          {msg.type === 'diff-card' && msg.meta ? (
            <DiffCard
              edit={msg.meta as ResumeEdit}
              onAccept={acceptEdit}
              onReject={rejectEdit}
              onModify={modifyEdit}
            />
          ) : (
            <div
              className={`p-4 rounded-2xl text-xs leading-relaxed text-left max-w-max ${
                isUser
                  ? 'bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-cyan)] text-white rounded-tr-none shadow-[0_4px_16px_rgba(59,130,246,0.15)] font-medium'
                  : 'bg-[var(--bg-card)]/80 backdrop-blur-md border border-[var(--border)] rounded-tl-none text-[var(--text-body)] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
              }`}
            >
              <p className="whitespace-pre-wrap">
                {renderMessageContent(msg.content, isUser)}
              </p>
            </div>
          )}

          {msg.meta?.approvalCard && (
            <ApprovalCard
              onApprove={handleApproveStep1}
              onReParse={handleReParseStep1}
            />
          )}

          {msg.meta?.missingInfoCard && (
            <MissingInfoCard
              items={msg.meta.items || []}
              onSubmitInfo={handleResolveMissingInfo}
              onSkipInfo={handleSkipMissingInfo}
            />
          )}

          {msg.meta?.retryable && msg.meta?.retryStep === 'extract-jd' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => runExtractJd()}
              className="text-xs flex items-center gap-1.5 cursor-pointer mt-1 bg-[var(--bg-card)] border-[var(--border)] text-[var(--accent)] hover:text-white select-none shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry Extraction
            </Button>
          )}
          {msg.meta?.retryable && !msg.meta?.retryStep && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => runParseStep(false)}
              className="text-xs flex items-center gap-1.5 cursor-pointer mt-1 bg-[var(--bg-card)] border-[var(--border)] text-[var(--accent)] hover:text-white select-none shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry Parsing
            </Button>
          )}
        </div>
      </motion.div>
    );
  };

  const getStepText = () => {
    if (isParsing) return 'Step 1: Parsing resume sections...';
    if (isExtracting) return 'Step 2: Extracting requirements...';
    if (job.jdExtract) return 'Tailoring Roadmap Active (Step 3)';
    return 'Step 1: Parsing resume details';
  };

  return (
    <section className="flex-1 flex flex-col bg-[var(--bg-main)] min-w-0 h-full overflow-hidden">
      {/* Workspace Header */}
      <div className="h-[72px] px-6 border-b border-[var(--border)] bg-[var(--bg-surface)]/70 backdrop-blur-md flex justify-between items-center shrink-0 select-none">
        <div className="text-left flex items-center gap-3">
          <div>
            <h3 className="text-xs font-black tracking-wide text-[var(--text-heading)] uppercase">
              Agent Tailoring Cockpit
            </h3>
            <p className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
              <span>{job.role} at {job.company}</span>
              <span className="opacity-40">•</span>
              <span className="text-[var(--accent)] font-semibold">{getStepText()}</span>
            </p>
          </div>
        </div>

        {!rightSidebarOpen && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setRightSidebarTab('resume');
                setRightSidebarOpen(true);
              }}
              className="text-[10px] px-3.5 py-1.5 bg-[var(--bg-card)]/80 hover:bg-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent-cyan)] border border-[var(--border)] rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer select-none uppercase tracking-wider"
            >
              <FileText className="w-3.5 h-3.5" />
              Resume
            </button>
            <button
              onClick={() => {
                setRightSidebarTab('jd');
                setRightSidebarOpen(true);
              }}
              className="text-[10px] px-3.5 py-1.5 bg-[var(--bg-card)]/80 hover:bg-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent-cyan)] border border-[var(--border)] rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer select-none uppercase tracking-wider"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Job Desc
            </button>
          </div>
        )}
      </div>

      {/* Messages Timeline */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gradient-to-b from-[var(--bg-main)] to-[var(--bg-card)]/10">
        <AnimatePresence initial={false}>
          {chatMessages.map((msg) => renderTimelineMessage(msg))}

          {isParsing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-[85%] text-left"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-cyan)] text-white shadow-sm">
                <ApplyAiIcon />
              </div>
              <div className="p-4 rounded-2xl text-xs leading-relaxed bg-[var(--bg-card)]/80 backdrop-blur-md border border-[var(--border)] rounded-tl-none text-[var(--text-body)] flex items-center gap-2.5 max-w-max shadow-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent-cyan)]" />
                <span className="animate-pulse font-medium">Parsing resume layout into granular blocks...</span>
              </div>
            </motion.div>
          )}

          {isExtracting && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-[85%] text-left"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-cyan)] text-white shadow-sm">
                <ApplyAiIcon />
              </div>
              <div className="p-4 rounded-2xl text-xs leading-relaxed bg-[var(--bg-card)]/80 backdrop-blur-md border border-[var(--border)] rounded-tl-none text-[var(--text-body)] flex items-center gap-2.5 max-w-max shadow-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent-cyan)]" />
                <span className="animate-pulse font-medium">Extracting qualifications and keyword weights...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Presentational Command Bar */}
      <ChatInputBar
        inputVal={inputVal}
        onInputChange={setInputVal}
        onSubmit={handleSendCommand}
        onChipClick={handleChipClick}
      />
    </section>
  );
}

