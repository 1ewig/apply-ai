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
}

function buildSectionsMap(sections: ParsedResumeSection[]): Record<string, string> {
  return sections.reduce<Record<string, string>>((acc, sec) => {
    if (sec?.heading) {
      acc[sec.heading.toUpperCase()] = sec.content || '';
    }
    return acc;
  }, {});
}

export function useParseResumeStep({
  job,
  resumeForReRun,
  onSaveChanges,
  isAnalysisReady,
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

        // Atomic store update
        useAnalysisStore.setState((state) => {
          const cleanMessages = state.chatMessages.filter(
            (m) => m.id !== 'init-ongoing' && !m.id.startsWith('parse-')
          );

          let newChatMessage;
          if (requiresInput && missingInfo.length > 0 && currentAttempt === 1) {
            newChatMessage = {
              id: 'parse-step-missing',
              role: 'assistant' as const,
              content: `**Step 1 Complete: Resume Parsed!** I've structured your resume into clean sections in the right panel. However, I noticed some missing details:`,
              type: 'agent-text' as const,
              meta: { missingInfoCard: true, items: missingInfo },
            };
          } else if (currentAttempt === 1) {
            newChatMessage = {
              id: 'parse-step-success',
              role: 'assistant' as const,
              content: `**Step 1 Complete: Resume Parsed!** Please review the structured sections under the **Resume** tab in the right reference panel. Is the parsed structure accurate?`,
              type: 'agent-text' as const,
              meta: { approvalCard: true },
            };
          } else {
            newChatMessage = {
              id: 'parse-step-auto-approved',
              role: 'assistant' as const,
              content: `**Step 1 Re-parsed & Approved!** Resume structure updated with 100% data fidelity. Ready to proceed to Step 2.`,
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
                content: `**Step 1 Failed:** ${errorMessage}`,
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
            content: `**Step 1 Approved!** Structured resume confirmed. Ready for Step 2 (JD Extraction).`,
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
          const heading = s.heading.toUpperCase();
          return heading.includes('HEADER') || heading.includes('CONTACT');
        });

        if (headerIndex !== -1) {
          updatedResume[headerIndex] = {
            ...updatedResume[headerIndex],
            content: `${updatedResume[headerIndex].content}\n${addedText}`,
          };
        } else {
          updatedResume.unshift({
            heading: 'CONTACT INFORMATION',
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
                content: `**Missing information added!** Updated your structured resume in the reference panel. Step 1 is complete!`,
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
                content: `**Skipped.** Proceeding with current structured sections. Step 1 is complete!`,
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
            content: `**Skipped.** Proceeding with current structured sections. Step 1 is complete!`,
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
            content: `Hello! I've received your application details for **${job.role || 'Unnamed Role'}** at **${job.company || 'Unnamed Company'}**. Let's tailor your resume to maximize your match rate.`,
            type: 'agent-text',
          },
          {
            id: 'init-ongoing',
            role: 'assistant',
            content: `**Step 1 in progress:** I am currently parsing your resume content and cleaning up formatting into structured sections...`,
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
            content: `Welcome back! I've loaded your structured resume for **${job.role || 'Unnamed Role'}** at **${job.company || 'Unnamed Company'}**.\n\nStep 1 (Parse Resume) is already complete. You can view the parsed sections in the right panel reference.`,
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