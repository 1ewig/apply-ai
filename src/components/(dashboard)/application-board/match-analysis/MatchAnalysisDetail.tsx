'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Send, Compass, Loader2, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { JobApplication, Resume } from '@/types';
import { useAnalysisStore } from '@/stores/useAnalysisStore';
import Button from '@/components/ui/Button';

interface MatchAnalysisDetailProps {
  job: JobApplication;
  previousAnalysisResult?: any;
  resumes: Resume[];
  resumeForReRun?: Resume;
  expandedPrepIndex: number | null;
  onTogglePrepItem: (index: number) => void;
  onBackClick: () => void;
  onReRunAnalysis: (jobId: string, resumeContent: string, jobDesc: string) => void;
  onSaveChanges: (id: string, data: Partial<JobApplication>) => Promise<unknown>;
}

interface MissingInfoCardProps {
  items: Array<{ field: string; description: string; severity: 'critical' | 'warning' }>;
  onSubmitInfo: (providedValues: Record<string, string>) => void;
  onSkipInfo: () => void;
}

function MissingInfoCard({ items, onSubmitInfo, onSkipInfo }: MissingInfoCardProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDone(true);
    onSubmitInfo(formValues);
  };

  const handleSkip = () => {
    setIsDone(true);
    onSkipInfo();
  };

  if (isDone) {
    return (
      <div className="p-3 rounded-xl bg-[var(--bg-card)]/50 border border-[var(--border)] text-xs text-[var(--text-muted)] italic">
        Response submitted.
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] space-y-3 max-w-md text-left">
      <div className="flex items-center gap-2 text-[var(--accent-yellow)] text-xs font-semibold">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>Missing Resume Details Detected</span>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-medium text-[var(--text-heading)]">
              <span>{item.field}</span>
              {item.severity === 'critical' && <span className="text-[10px] text-red-400 font-bold uppercase">Required</span>}
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">{item.description}</p>
            <input
              type="text"
              placeholder={`Enter your ${item.field.toLowerCase()}...`}
              className="w-full bg-[var(--bg-main)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-body)] focus:outline-none focus:border-[var(--accent)] transition"
              value={formValues[item.field] || ''}
              onChange={(e) => setFormValues({ ...formValues, [item.field]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
        <Button
          size="sm"
          className="bg-[var(--accent)] hover:bg-[var(--accent-cyan)] font-semibold text-xs rounded-lg select-none"
          onClick={handleSubmit}
        >
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
          Save & Proceed
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-[var(--text-muted)] hover:text-white rounded-lg select-none"
          onClick={handleSkip}
        >
          Skip for Now
        </Button>
      </div>
    </div>
  );
}

export default function MatchAnalysisDetail({
  job,
  resumeForReRun,
  onSaveChanges,
}: MatchAnalysisDetailProps) {
  const {
    activeSessionId,
    chatMessages,
    initializeSession,
    addChatMessage,
  } = useAnalysisStore();

  const [inputVal, setInputVal] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isParsing]);

  // Execute parsing step
  const runParseStep = async () => {
    if (isParsing) return;
    setIsParsing(true);

    const rawResume = job.customResumeContent || resumeForReRun?.content || '';

    // Clear previous error messages if we are retrying
    const currentMessages = useAnalysisStore.getState().chatMessages;
    const filteredMessages = currentMessages.filter(
      (m) => !m.id.startsWith('parse-error-') && !m.id.startsWith('parse-progress-') && !m.id.startsWith('parse-success-') && !m.id.startsWith('parse-missing-')
    );

    useAnalysisStore.setState({
      chatMessages: [
        ...filteredMessages,
        {
          id: `parse-progress-${Date.now()}`,
          role: 'assistant',
          content: `🔄 **Parsing resume into flexible categories...**`,
          type: 'agent-text',
        }
      ]
    });

    try {
      const response = await fetch('/api/compare/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: rawResume }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to parse resume content.');
      }

      const data = await response.json();
      const newParsedResume = data.parsedResume || [];
      const missingInfo = data.missingInfo || [];
      const requiresInput = data.requiresInput || false;

      // Update client Zustand store
      useAnalysisStore.setState({
        parsedResume: newParsedResume,
        resumeSections: newParsedResume.reduce((acc: Record<string, string>, sec: any) => {
          acc[sec.heading.toUpperCase()] = sec.content;
          return acc;
        }, {} as Record<string, string>),
      });

      if (requiresInput && missingInfo.length > 0) {
        useAnalysisStore.setState({
          chatMessages: [
            ...useAnalysisStore.getState().chatMessages.filter(m => !m.id.startsWith('parse-progress-')),
            {
              id: `parse-missing-${Date.now()}`,
              role: 'assistant',
              content: `📋 **Step 1 Parsed!** I've organized your resume into flexible sections in the right panel. However, I noticed some missing details that will improve tailoring:`,
              type: 'agent-text',
              meta: {
                missingInfoCard: true,
                items: missingInfo,
              }
            }
          ]
        });
      } else {
        useAnalysisStore.setState({
          chatMessages: [
            ...useAnalysisStore.getState().chatMessages.filter(m => !m.id.startsWith('parse-progress-')),
            {
              id: `parse-success-${Date.now()}`,
              role: 'assistant',
              content: `🎉 **Step 1 Complete!** I have parsed your resume into flexible sections. All core information looks complete! View the **Resume** tab in the right panel to check your structured sections.`,
              type: 'agent-text',
            }
          ]
        });
      }

      // Persist the parsed resume in Convex database under analysisResult
      await onSaveChanges(job.id, {
        analysisResult: {
          overallScore: 0,
          readinessTier: 'poor',
          tasks: [],
          parsedResume: newParsedResume,
          quickWins: [],
          blockers: [],
        }
      });

    } catch (err: any) {
      console.error(err);
      useAnalysisStore.setState({
        chatMessages: [
          ...useAnalysisStore.getState().chatMessages.filter(m => !m.id.startsWith('parse-progress-')),
          {
            id: `parse-error-${Date.now()}`,
            role: 'assistant',
            content: `❌ **Step 1 Failed:** ${err.message || 'I encountered an error while trying to parse your resume content.'}`,
            type: 'agent-text',
            meta: { retryable: true },
          }
        ]
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleResolveMissingInfo = async (values: Record<string, string>) => {
    const currentParsed = useAnalysisStore.getState().parsedResume;
    const entries = Object.entries(values).filter(([_, v]) => v.trim() !== '');

    if (entries.length > 0) {
      const addedText = entries.map(([field, val]) => `${field}: ${val}`).join('\n');

      let updatedResume = [...currentParsed];
      const headerIndex = updatedResume.findIndex(s => 
        s.heading.toUpperCase().includes('HEADER') || s.heading.toUpperCase().includes('CONTACT')
      );

      if (headerIndex !== -1) {
        updatedResume[headerIndex] = {
          ...updatedResume[headerIndex],
          content: `${updatedResume[headerIndex].content}\n${addedText}`
        };
      } else {
        updatedResume.unshift({
          heading: 'CONTACT INFORMATION',
          content: addedText
        });
      }

      useAnalysisStore.setState({
        parsedResume: updatedResume,
        resumeSections: updatedResume.reduce((acc: Record<string, string>, sec: any) => {
          acc[sec.heading.toUpperCase()] = sec.content;
          return acc;
        }, {} as Record<string, string>),
        chatMessages: [
          ...useAnalysisStore.getState().chatMessages,
          {
            id: `missing-resolved-${Date.now()}`,
            role: 'assistant',
            content: `✅ **Missing information added!** Updated your structured resume in the reference panel. Step 1 is complete!`,
            type: 'agent-text',
          }
        ]
      });

      await onSaveChanges(job.id, {
        analysisResult: {
          overallScore: 0,
          readinessTier: 'poor',
          tasks: [],
          parsedResume: updatedResume,
          quickWins: [],
          blockers: [],
        }
      });
    } else {
      handleSkipMissingInfo();
    }
  };

  const handleSkipMissingInfo = () => {
    addChatMessage({
      role: 'assistant',
      content: `⏭️ **Skipped.** Proceeding with current structured sections. Step 1 is complete!`,
      type: 'agent-text',
    });
  };

  useEffect(() => {
    if (!job) return;

    const rawResume = job.customResumeContent || resumeForReRun?.content || '';

    // Initialize state from existing job analysis or set up fresh empty state
    const existingAnalysis = job.analysisResult as any;
    const parsedResume = existingAnalysis?.parsedResume || [];

    // Initialize Zustand tailoring session
    initializeSession(
      job.id,
      {
        overallScore: existingAnalysis?.overallScore || 0,
        readinessTier: existingAnalysis?.readinessTier || 'poor',
        tasks: existingAnalysis?.tasks || [],
        parsedResume,
        quickWins: existingAnalysis?.quickWins || [],
        blockers: existingAnalysis?.blockers || [],
      },
      job.role,
      job.company
    );

    // If the resume has not been parsed yet, trigger the parse step!
    if (parsedResume.length === 0 && rawResume.trim() && !isParsing) {
      useAnalysisStore.setState({
        chatMessages: [
          {
            id: 'init-msg',
            role: 'assistant',
            content: `Hello! I've loaded your application details for **${job.role || 'Unnamed Role'}** at **${job.company || 'Unnamed Company'}**.\n\n**Step 1: Parsing your resume text...**`,
            type: 'agent-text',
          }
        ]
      });
      runParseStep();
    } else if (parsedResume.length > 0) {
      // If already parsed in past, set welcome message accordingly
      useAnalysisStore.setState({
        chatMessages: [
          {
            id: 'init-msg-parsed',
            role: 'assistant',
            content: `Welcome back! I've loaded your structured resume for **${job.role || 'Unnamed Role'}** at **${job.company || 'Unnamed Company'}**.\n\nStep 1 (Parse Resume) is already complete. You can view the parsed sections in the right panel reference.`,
            type: 'agent-text',
          }
        ]
      });
    }
  }, [job?.id]);

  // Handle user inputs / commands
  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const val = inputVal.trim();
    setInputVal('');

    // Add user message to timeline
    addChatMessage({
      role: 'user',
      content: val,
      type: 'user',
    });

    // Simulate basic reply
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
      {/* Header bar */}
      <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-surface)] flex justify-between items-center shrink-0">
        <div className="text-left">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-[var(--text-heading)]">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" /> 
            Agent Tailoring Session
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Step 1: Parsing resume sections
          </p>
        </div>
      </div>

      {/* Messages Area */}
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                msg.role === 'assistant' 
                  ? 'bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-cyan)] text-white' 
                  : msg.role === 'system'
                  ? 'bg-gray-800 text-[var(--text-muted)]'
                  : 'bg-[var(--accent-yellow)] text-gray-950'
              }`}>
                {msg.role === 'assistant' ? <Sparkles className="w-4 h-4" /> : msg.role === 'system' ? <Compass className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Text content box */}
              <div className="flex flex-col items-start gap-2">
                <div className={`p-4 rounded-2xl text-xs leading-relaxed text-left max-w-max ${
                  msg.role === 'user' 
                    ? 'bg-[var(--accent)] text-white rounded-tr-none' 
                    : 'bg-[var(--bg-card)] border border-[var(--border)] rounded-tl-none text-[var(--text-body)]'
                }`}>
                  <p className="whitespace-pre-wrap">{renderMessageContent(msg.content, msg.role === 'user')}</p>
                </div>

                {/* Interactive Missing Info Card */}
                {msg.meta?.missingInfoCard && (
                  <MissingInfoCard
                    items={msg.meta.items || []}
                    onSubmitInfo={handleResolveMissingInfo}
                    onSkipInfo={handleSkipMissingInfo}
                  />
                )}

                {/* Retry Button */}
                {msg.meta?.retryable && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={runParseStep}
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
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-surface)] space-y-3 shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          <button 
            className="px-3 py-1 rounded-full bg-[var(--border)] hover:bg-gray-600 text-[var(--text-body)] shrink-0 transition cursor-pointer select-none"
            onClick={() => handleChipClick('Summarize my sections')}
          >
            @sections summary
          </button>
          <button 
            className="px-3 py-1 rounded-full bg-[var(--border)] hover:bg-gray-600 text-[var(--text-body)] shrink-0 transition cursor-pointer select-none"
            onClick={() => handleChipClick('Show parsing details')}
          >
            /show details
          </button>
        </div>

        <form onSubmit={handleSendCommand} className="flex gap-2">
          <input 
            type="text"
            placeholder="Ask agent, type commands or steer edits..."
            className="flex-1 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--accent)] transition text-[var(--text-body)] placeholder:text-[var(--text-muted)]"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <Button type="submit" size="sm" className="bg-[var(--accent)] hover:bg-[var(--accent-cyan)] font-semibold rounded-xl select-none">
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </section>
  );
}
