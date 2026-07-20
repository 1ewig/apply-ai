'use client';

import { useState, useEffect, useCallback } from 'react';
import type { JobApplication, Resume } from '@/types';
import { useAnalysisStore } from '@/stores/useAnalysisStore';

interface UseParseResumeStepProps {
  job: JobApplication;
  resumeForReRun?: Resume;
  onSaveChanges: (id: string, data: Partial<JobApplication>) => Promise<unknown>;
}

export function useParseResumeStep({
  job,
  resumeForReRun,
  onSaveChanges,
}: UseParseResumeStepProps) {
  const initializeSession = useAnalysisStore((s) => s.initializeSession);
  const addChatMessage = useAnalysisStore((s) => s.addChatMessage);
  const [isParsing, setIsParsing] = useState(false);

  const rawResume = job?.customResumeContent || resumeForReRun?.content || '';

  const runParseStep = useCallback(async () => {
    if (isParsing || !job) return;
    setIsParsing(true);

    const currentMessages = useAnalysisStore.getState().chatMessages;
    const filteredMessages = currentMessages.filter(
      (m) =>
        !m.id.startsWith('parse-error-') &&
        !m.id.startsWith('parse-progress-') &&
        !m.id.startsWith('parse-success-') &&
        !m.id.startsWith('parse-missing-')
    );

    useAnalysisStore.setState({
      chatMessages: [
        ...filteredMessages,
        {
          id: `parse-progress-${Date.now()}`,
          role: 'assistant',
          content: `🔄 **Parsing resume into flexible categories...**`,
          type: 'agent-text',
        },
      ],
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
            ...useAnalysisStore.getState().chatMessages.filter((m) => !m.id.startsWith('parse-progress-')),
            {
              id: `parse-missing-${Date.now()}`,
              role: 'assistant',
              content: `📋 **Step 1 Complete: Resume Parsed!** I've structured your resume into clean sections in the right panel. However, I noticed some missing details that will improve tailoring:`,
              type: 'agent-text',
              meta: {
                missingInfoCard: true,
                items: missingInfo,
              },
            },
          ],
        });
      } else {
        useAnalysisStore.setState({
          chatMessages: [
            ...useAnalysisStore.getState().chatMessages.filter((m) => !m.id.startsWith('parse-progress-')),
            {
              id: `parse-success-${Date.now()}`,
              role: 'assistant',
              content: `🎉 **Step 1 Complete: Resume Parsed!** I have parsed your resume into clean, structured sections. All core information looks complete! You can inspect the sections under the **Resume** tab in the right reference panel.`,
              type: 'agent-text',
            },
          ],
        });
      }

      await onSaveChanges(job.id, {
        analysisResult: {
          overallScore: 0,
          readinessTier: 'poor',
          tasks: [],
          parsedResume: newParsedResume,
          quickWins: [],
          blockers: [],
        },
      });
    } catch (err: any) {
      console.error(err);
      useAnalysisStore.setState({
        chatMessages: [
          ...useAnalysisStore.getState().chatMessages.filter((m) => !m.id.startsWith('parse-progress-')),
          {
            id: `parse-error-${Date.now()}`,
            role: 'assistant',
            content: `❌ **Step 1 Failed:** ${err.message || 'I encountered an error while trying to parse your resume content.'}`,
            type: 'agent-text',
            meta: { retryable: true },
          },
        ],
      });
    } finally {
      setIsParsing(false);
    }
  }, [isParsing, job, rawResume, onSaveChanges]);

  const handleResolveMissingInfo = useCallback(
    async (values: Record<string, string>) => {
      if (!job) return;
      const currentParsed = useAnalysisStore.getState().parsedResume;
      const entries = Object.entries(values).filter(([_, v]) => v.trim() !== '');

      if (entries.length > 0) {
        const addedText = entries.map(([field, val]) => `${field}: ${val}`).join('\n');

        let updatedResume = [...currentParsed];
        const headerIndex = updatedResume.findIndex(
          (s) => s.heading.toUpperCase().includes('HEADER') || s.heading.toUpperCase().includes('CONTACT')
        );

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
            },
          ],
        });

        await onSaveChanges(job.id, {
          analysisResult: {
            overallScore: 0,
            readinessTier: 'poor',
            tasks: [],
            parsedResume: updatedResume,
            quickWins: [],
            blockers: [],
          },
        });
      } else {
        addChatMessage({
          role: 'assistant',
          content: `⏭️ **Skipped.** Proceeding with current structured sections. Step 1 is complete!`,
          type: 'agent-text',
        });
      }
    },
    [job, onSaveChanges, addChatMessage]
  );

  const handleSkipMissingInfo = useCallback(() => {
    addChatMessage({
      role: 'assistant',
      content: `⏭️ **Skipped.** Proceeding with current structured sections. Step 1 is complete!`,
      type: 'agent-text',
    });
  }, [addChatMessage]);

  useEffect(() => {
    if (!job) return;

    const existingAnalysis = job.analysisResult as any;
    const parsedResume = existingAnalysis?.parsedResume || [];

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

    if (parsedResume.length === 0 && rawResume.trim() && !isParsing) {
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
            content: `🔍 **Step 1 in progress:** I am currently parsing your resume content and cleaning up formatting into structured sections...`,
            type: 'agent-text',
          },
        ],
      });
      runParseStep();
    } else if (parsedResume.length > 0) {
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
  }, [job?.id]);

  return {
    isParsing,
    runParseStep,
    handleResolveMissingInfo,
    handleSkipMissingInfo,
  };
}
