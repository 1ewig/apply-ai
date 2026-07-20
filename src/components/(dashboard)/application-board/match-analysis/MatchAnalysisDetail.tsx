'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Compass, Loader2, RotateCcw } from 'lucide-react';
import type { JobApplication, Resume } from '@/types';
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

export default function MatchAnalysisDetail({
  job,
  resumeForReRun,
  onSaveChanges,
}: MatchAnalysisDetailProps) {
  // Use individual Zustand selectors to prevent unnecessary re-renders per coding standards
  const chatMessages = useAnalysisStore((s) => s.chatMessages);
  const addChatMessage = useAnalysisStore((s) => s.addChatMessage);

  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Business logic hook for Step 1 execution & missing info resolution
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

  // Step 2: Extract JD after Step 1 approval
  const { isExtracting, runExtractJd } = useExtractJdStep({
    jobDescription: job.jobDescription || '',
  });

  const handleApproveStep1 = () => {
    originalApproveStep1();
    runExtractJd();
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isParsing, isExtracting]);

  // Handle user command inputs
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
            className={`font-semibold ${isUser ? 'text-white' : 'text-[var(--text-heading)]'}`}
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <section className="flex-1 flex flex-col bg-[var(--bg-main)] min-w-0 h-full overflow-hidden">
      {/* Workspace Header */}
      <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-surface)] flex justify-between items-center shrink-0">
        <div className="text-left">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-[var(--text-heading)]">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            Agent Tailoring Session
          </h3>
          <p className="text-xs text-[var(--text-muted)]">Step 1: Parsing resume sections</p>
        </div>
      </div>

      {/* Messages Timeline */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        <AnimatePresence initial={false}>
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-cyan)] text-white'
                    : msg.role === 'system'
                    ? 'bg-gray-800 text-[var(--text-muted)]'
                    : 'bg-[var(--accent-yellow)] text-gray-950'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <Sparkles className="w-4 h-4" />
                ) : msg.role === 'system' ? (
                  <Compass className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              {/* Text Content Box & Presentational Actions */}
              <div className="flex flex-col items-start gap-2">
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed text-left max-w-max ${
                    msg.role === 'user'
                      ? 'bg-[var(--accent)] text-white rounded-tr-none'
                      : 'bg-[var(--bg-card)] border border-[var(--border)] rounded-tl-none text-[var(--text-body)]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">
                    {renderMessageContent(msg.content, msg.role === 'user')}
                  </p>
                </div>

                {/* Presentational Approval Prompt Card */}
                {msg.meta?.approvalCard && (
                  <ApprovalCard
                    onApprove={handleApproveStep1}
                    onReParse={handleReParseStep1}
                  />
                )}

                {/* Presentational Missing Info Prompt Card */}
                {msg.meta?.missingInfoCard && (
                  <MissingInfoCard
                    items={msg.meta.items || []}
                    onSubmitInfo={handleResolveMissingInfo}
                    onSkipInfo={handleSkipMissingInfo}
                  />
                )}

                {/* Presentational Retry Button */}
                {msg.meta?.retryable && msg.meta?.retryStep === 'extract-jd' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => runExtractJd()}
                    className="text-xs flex items-center gap-1.5 cursor-pointer mt-1 bg-[var(--bg-card)] border-[var(--border)] text-[var(--accent)] hover:text-white select-none"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Retry Extraction
                  </Button>
                )}
                {msg.meta?.retryable && !msg.meta?.retryStep && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => runParseStep(false)}
                    className="text-xs flex items-center gap-1.5 cursor-pointer mt-1 bg-[var(--bg-card)] border-[var(--border)] text-[var(--accent)] hover:text-white select-none"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Retry Parsing
                  </Button>
                )}
              </div>
            </motion.div>
          ))}

          {isParsing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-[85%] text-left"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-cyan)] text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl text-xs leading-relaxed bg-[var(--bg-card)] border border-[var(--border)] rounded-tl-none text-[var(--text-body)] flex items-center gap-2 max-w-max">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent)]" />
                <span className="animate-pulse">Parsing resume into flexible categories...</span>
              </div>
            </motion.div>
          )}

          {isExtracting && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-[85%] text-left"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-cyan)] text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl text-xs leading-relaxed bg-[var(--bg-card)] border border-[var(--border)] rounded-tl-none text-[var(--text-body)] flex items-center gap-2 max-w-max">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent)]" />
                <span className="animate-pulse">Extracting job requirements and keywords...</span>
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
