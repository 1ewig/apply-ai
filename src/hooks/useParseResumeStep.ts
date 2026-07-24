'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { JobApplication, Resume } from '@/types';
import { useAnalysisStore } from '@/stores/useAnalysisStore';

interface ParsedResumeSection {
  heading: string;
  content: string;
}

interface UseParseResumeStepProps {
  job: JobApplication;
  resumeForReRun?: Resume;
  onSaveChanges: (id: string, data: Partial<JobApplication>) => Promise<unknown>;
  isAnalysisReady: boolean;
  onStep1Complete?: () => void;
}

function buildSectionsMap(sections: ParsedResumeSection[]): Record<string, string> {
  return sections.reduce<Record<string, string>>((acc, sec) => {
    if (sec?.heading) {
      acc[sec.heading] = sec.content || '';
    }
    return acc;
  }, {});
}

export function useParseResumeStep({
  job,
  resumeForReRun,
  onSaveChanges,
  isAnalysisReady,
  onStep1Complete,
}: UseParseResumeStepProps) {
  const initializeSession = useAnalysisStore((s) => s.initializeSession);
  const [isParsing, setIsParsing] = useState(false);
  const [parseAttemptCount, setParseAttemptCount] = useState(1);

  const isParsingRef = useRef(false);
  const hasInitiatedRef = useRef<string | null>(null);

  const rawResume = job?.customResumeContent || resumeForReRun?.content || '';

  // Helper to safely retain analysisResult without wiping user data
  const getPreservedAnalysisResult = useCallback(() => {
    return (
      job?.analysisResult || {
        overallScore: 0,
        readinessTier: 'poor' as const,
        tasks: [],
        quickWins: [],
        blockers: [],
      }
    );
  }, [job?.analysisResult]);

  const runParseStep = useCallback(
    async (isReParse = false) => {
      // Synchronous ref check prevents double fetch triggers
      if (isParsingRef.current || !job?.id) return;

      isParsingRef.current = true;
      setIsParsing(true);

      const currentAttempt = isReParse ? parseAttemptCount + 1 : parseAttemptCount;
      if (isReParse) setParseAttemptCount(currentAttempt);

      try {
        const response = await fetch('/api/plan/parse-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText: rawResume }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to parse resume content.');
        }

        const data = await response.json();
        const newParsedResume: ParsedResumeSection[] = data.parsedResume || [];
        const missingInfo: string[] = data.missingInfo || [];
        const requiresInput: boolean = data.requiresInput || false;
        const fidelityScore: number = data.fidelityScore ?? 100;

        // Atomic store update
        useAnalysisStore.setState((state) => {
          const cleanMessages = state.chatMessages.filter(
            (m) => m.id !== 'init-ongoing' && !m.id.startsWith('parse-')
          );

          let newChatMessage;
          if (fidelityScore >= 90 && currentAttempt === 1) {
            newChatMessage = {
              id: 'parse-step-auto-approved',
              role: 'assistant' as const,
              content: `I've organized your resume into sections and everything looks complete. Ready to move on!`,
              type: 'agent-text' as const,
            };
          } else if (requiresInput && missingInfo.length > 0 && currentAttempt === 1) {
            newChatMessage = {
              id: 'parse-step-missing',
              role: 'assistant' as const,
              content: `I've laid out your resume in the right panel, but I noticed a few details are missing. Could you help fill these in?`,
              type: 'agent-text' as const,
              meta: { missingInfoCard: true, items: missingInfo },
            };
          } else if (currentAttempt === 1) {
            newChatMessage = {
              id: 'parse-step-success',
              role: 'assistant' as const,
              content: `I've structured your resume into sections. Take a quick look in the right panel to make sure everything looks right?`,
              type: 'agent-text' as const,
              meta: { approvalCard: true },
            };
          } else {
            newChatMessage = {
              id: 'parse-step-auto-approved',
              role: 'assistant' as const,
              content: `Got it — I've re-parsed your resume and updated the sections. We're good to go!`,
              type: 'agent-text' as const,
            };
          }

          return {
            parsedResume: newParsedResume,
            resumeSections: buildSectionsMap(newParsedResume),
            chatMessages: [...cleanMessages, newChatMessage],
          };
        });

        // Save parsed resume while PRESERVING analysisResult
        await onSaveChanges(job.id, {
          parsedResume: newParsedResume,
          analysisResult: getPreservedAnalysisResult(),
        });

        if (fidelityScore >= 90 && currentAttempt === 1) {
          onStep1Complete?.();
        }
      } catch (err: unknown) {
        console.error('Error parsing resume:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';

        useAnalysisStore.setState((state) => {
          const cleanMessages = state.chatMessages.filter(
            (m) => m.id !== 'init-ongoing' && !m.id.startsWith('parse-')
          );
          return {
            chatMessages: [
              ...cleanMessages,
              {
                id: 'parse-step-error',
                role: 'assistant',
                content: `Sorry, I couldn't read your resume properly. ${errorMessage}`,
                type: 'agent-text',
                meta: { retryable: true },
              },
            ],
          };
        });
      } finally {
        isParsingRef.current = false;
        setIsParsing(false);
      }
    },
    [job, rawResume, parseAttemptCount, onSaveChanges, getPreservedAnalysisResult]
  );

  const handleApproveStep1 = useCallback(() => {
    // Atomic card status update + approval message appending
    useAnalysisStore.setState((state) => {
      const updatedMessages = state.chatMessages.map((msg) =>
        msg.meta?.approvalCard
          ? { ...msg, meta: { ...msg.meta, status: 'approved' } }
          : msg
      );

      return {
        chatMessages: [
          ...updatedMessages,
          {
            id: `approve-step1-${Date.now()}`,
            role: 'assistant',
            content: `Perfect, your resume structure is confirmed! Now let's look at the job description.`,
            type: 'agent-text',
          },
        ],
      };
    });
  }, []);

  const handleReParseStep1 = useCallback(() => {
    // Atomic card status update before running re-parse
    useAnalysisStore.setState((state) => ({
      chatMessages: state.chatMessages.map((msg) =>
        msg.meta?.approvalCard
          ? { ...msg, meta: { ...msg.meta, status: 'reparsed' } }
          : msg
      ),
    }));

    runParseStep(true);
  }, [runParseStep]);

  const handleResolveMissingInfo = useCallback(
    async (values: Record<string, string>) => {
      if (!job?.id) return;

      const currentParsed = (useAnalysisStore.getState().parsedResume as ParsedResumeSection[]) || [];
      const entries = Object.entries(values).filter(([_, v]) => v.trim() !== '');

      if (entries.length > 0) {
        const addedText = entries.map(([field, val]) => `${field}: ${val}`).join('\n');
        const updatedResume = [...currentParsed];

        const headerIndex = updatedResume.findIndex((s) => {
          const heading = s.heading;
          return heading === 'header';
        });

        if (headerIndex !== -1) {
          updatedResume[headerIndex] = {
            ...updatedResume[headerIndex],
            content: `${updatedResume[headerIndex].content}\n${addedText}`,
          };
        } else {
          updatedResume.unshift({
            heading: 'header',
            content: addedText,
          });
        }

        useAnalysisStore.setState((state) => {
          const updatedMessages = state.chatMessages.map((msg) =>
            msg.meta?.missingInfoCard
              ? { ...msg, meta: { ...msg.meta, status: 'submitted' } }
              : msg
          );

          return {
            parsedResume: updatedResume,
            resumeSections: buildSectionsMap(updatedResume),
            chatMessages: [
              ...updatedMessages,
              {
                id: `missing-resolved-${Date.now()}`,
                role: 'assistant',
                content: `Thanks! I've added those details to your resume structure. All set.`,
                type: 'agent-text',
              },
            ],
          };
        });

        // Save parsed resume while PRESERVING analysisResult
        await onSaveChanges(job.id, {
          parsedResume: updatedResume,
          analysisResult: getPreservedAnalysisResult(),
        });
      } else {
        useAnalysisStore.setState((state) => {
          const updatedMessages = state.chatMessages.map((msg) =>
            msg.meta?.missingInfoCard
              ? { ...msg, meta: { ...msg.meta, status: 'skipped' } }
              : msg
          );

          return {
            chatMessages: [
              ...updatedMessages,
              {
                id: `missing-skipped-${Date.now()}`,
                role: 'assistant',
                content: `No problem — we'll continue with what we have.`,
                type: 'agent-text',
              },
            ],
          };
        });
      }
    },
    [job, onSaveChanges, getPreservedAnalysisResult]
  );

  const handleSkipMissingInfo = useCallback(() => {
    useAnalysisStore.setState((state) => {
      const updatedMessages = state.chatMessages.map((msg) =>
        msg.meta?.missingInfoCard
          ? { ...msg, meta: { ...msg.meta, status: 'skipped' } }
          : msg
      );

      return {
        chatMessages: [
          ...updatedMessages,
          {
            id: `missing-skipped-${Date.now()}`,
            role: 'assistant',
            content: `No problem — we'll continue with what we have.`,
            type: 'agent-text',
          },
        ],
      };
    });
  }, []);

  useEffect(() => {
    if (!job || !isAnalysisReady) return;
    if (hasInitiatedRef.current === job.id) return;

    hasInitiatedRef.current = job.id;

    const existingResult = job.analysisResult || {
      overallScore: 0,
      readinessTier: 'poor' as const,
      tasks: [],
      quickWins: [],
      blockers: [],
    };
    const parsedResume = job.parsedResume || [];

    initializeSession(
      job.id,
      {
        overallScore: existingResult.overallScore,
        readinessTier: existingResult.readinessTier,
        tasks: existingResult.tasks,
        parsedResume,
        quickWins: existingResult.quickWins,
        blockers: existingResult.blockers,
        chatMessages: job.chatMessages,
      },
      job.role,
      job.company
    );

    if (job.jdExtract) {
      useAnalysisStore.setState({ jdExtract: job.jdExtract });
    }

    if (parsedResume.length === 0 && rawResume.trim() && !isParsingRef.current) {
      useAnalysisStore.setState({
        chatMessages: [
          {
            id: 'init-ack',
            role: 'assistant',
            content: `Hey! I've got your application for **${job.role || 'Unnamed Role'}** at **${job.company || 'Unnamed Company'}**. Let's get your resume ready.`,
            type: 'agent-text',
          },
          {
            id: 'init-ongoing',
            role: 'assistant',
            content: `Reading through your resume now — I'm organizing everything into clean sections so we can work with them.`,
            type: 'agent-text',
          },
        ],
      });
      runParseStep();
    } else if (parsedResume.length > 0 && (!job.chatMessages || job.chatMessages.length === 0)) {
      useAnalysisStore.setState({
        chatMessages: [
          {
            id: 'init-msg-parsed',
            role: 'assistant',
            content: `Welcome back! Your resume for **${job.role || 'Unnamed Role'}** at **${job.company || 'Unnamed Company'}** is loaded and ready to go.`,
            type: 'agent-text',
          },
        ],
      });
    }
  }, [job, isAnalysisReady, rawResume, initializeSession, runParseStep]);

  return {
    isParsing,
    runParseStep,
    handleApproveStep1,
    handleReParseStep1,
    handleResolveMissingInfo,
    handleSkipMissingInfo,
  };
}