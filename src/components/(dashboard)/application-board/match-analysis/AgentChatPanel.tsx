'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Compass, Loader2, RotateCcw, FileText, Briefcase } from 'lucide-react';
import type { ChatMessage } from '@/stores/useAnalysisStore';
import type { ResumeEdit } from '@/agent/types';
import Button from '@/components/ui/Button';
import ApplyAiIcon from './ApplyAiIcon';
import DiffCard from './DiffCard';
import MissingInfoCard from './MissingInfoCard';
import ApprovalCard from './ApprovalCard';
import ChatInputBar from './ChatInputBar';

interface AgentChatPanelProps {
  chatMessages: ChatMessage[];
  isParsing: boolean;
  isExtracting: boolean;
  rightSidebarOpen: boolean;
  stepText: string;
  role: string;
  company: string;
  inputVal: string;
  onInputChange: (val: string) => void;
  onToggleRightSidebar: (tab: 'resume' | 'jd') => void;
  onApproveStep1: () => void;
  onReParseStep1: () => void;
  onResolveMissingInfo: (values: Record<string, string>) => void;
  onSkipMissingInfo: () => void;
  onAcceptEdit: (id: string) => void;
  onRejectEdit: (id: string) => void;
  onModifyEdit: (id: string, content: string) => void;
  onRetryParse: () => void;
  onRetryExtract: () => void;
  onSendCommand: (e: React.FormEvent) => void;
  onChipClick: (text: string) => void;
}

function renderMessageContent(text: string, isUser: boolean) {
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
}

function renderTimelineMessage(
  msg: ChatMessage,
  onAcceptEdit: (id: string) => void,
  onRejectEdit: (id: string) => void,
  onModifyEdit: (id: string, content: string) => void,
  onApproveStep1: () => void,
  onReParseStep1: () => void,
  onResolveMissingInfo: (values: Record<string, string>) => void,
  onSkipMissingInfo: () => void,
  onRetryParse: () => void,
  onRetryExtract: () => void,
) {
  if (msg.type === 'system-event') {
    return (
      <div key={msg.id} className="flex justify-center my-2 select-none">
        <span className="px-3.5 py-1.5 bg-[var(--bg-surface)]/20 border border-[var(--border)] text-[10px] text-[var(--text-muted)] rounded-full font-mono">
          {msg.content}
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
          <span>&rarr;</span>
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
            onAccept={onAcceptEdit}
            onReject={onRejectEdit}
            onModify={onModifyEdit}
          />
        ) : msg.meta?.approvalCard ? (
          <ApprovalCard
            status={msg.meta.status}
            onApprove={onApproveStep1}
            onReParse={onReParseStep1}
          />
        ) : msg.meta?.missingInfoCard ? (
          <MissingInfoCard
            status={msg.meta.status}
            items={msg.meta.items || []}
            onSubmitInfo={onResolveMissingInfo}
            onSkipInfo={onSkipMissingInfo}
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

        {msg.meta?.retryable && msg.meta?.retryStep === 'extract-jd' && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetryExtract}
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
            onClick={onRetryParse}
            className="text-xs flex items-center gap-1.5 cursor-pointer mt-1 bg-[var(--bg-card)] border-[var(--border)] text-[var(--accent)] hover:text-white select-none shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry Parsing
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export default function AgentChatPanel({
  chatMessages,
  isParsing,
  isExtracting,
  rightSidebarOpen,
  stepText,
  role,
  company,
  inputVal,
  onInputChange,
  onToggleRightSidebar,
  onApproveStep1,
  onReParseStep1,
  onResolveMissingInfo,
  onSkipMissingInfo,
  onAcceptEdit,
  onRejectEdit,
  onModifyEdit,
  onRetryParse,
  onRetryExtract,
  onSendCommand,
  onChipClick,
}: AgentChatPanelProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isParsing, isExtracting]);

  return (
    <section className="flex-1 flex flex-col bg-[var(--bg-main)] min-w-0 h-full overflow-hidden">
      <div className="h-[72px] px-6 border-b border-[var(--border)] bg-[var(--bg-surface)]/70 backdrop-blur-md flex justify-between items-center shrink-0 select-none">
        <div className="text-left flex flex-col justify-center h-full">
          <h3 className="text-sm font-black text-[var(--text-heading)] leading-tight">
            {role} at {company}
          </h3>
          <p className="text-[10px] font-mono text-[var(--accent)] font-semibold mt-0.5">
            {stepText}
          </p>
        </div>

        {!rightSidebarOpen && (
          <div className="flex gap-2">
            <button
              onClick={() => onToggleRightSidebar('resume')}
              className="text-[10px] px-3.5 py-1.5 bg-[var(--bg-card)]/80 hover:bg-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent-cyan)] border border-[var(--border)] rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer select-none uppercase tracking-wider"
            >
              <FileText className="w-3.5 h-3.5" />
              Resume
            </button>
            <button
              onClick={() => onToggleRightSidebar('jd')}
              className="text-[10px] px-3.5 py-1.5 bg-[var(--bg-card)]/80 hover:bg-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent-cyan)] border border-[var(--border)] rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer select-none uppercase tracking-wider"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Job Desc
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gradient-to-b from-[var(--bg-main)] to-[var(--bg-card)]/10">
        <AnimatePresence initial={false}>
          {chatMessages.map((msg) =>
            renderTimelineMessage(msg, onAcceptEdit, onRejectEdit, onModifyEdit, onApproveStep1, onReParseStep1, onResolveMissingInfo, onSkipMissingInfo, onRetryParse, onRetryExtract)
          )}

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

      <ChatInputBar
        inputVal={inputVal}
        onInputChange={onInputChange}
        onSubmit={onSendCommand}
        onChipClick={onChipClick}
      />
    </section>
  );
}
