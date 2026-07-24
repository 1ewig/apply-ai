'use client';

import { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnalysisAction } from '@/app/actions/applications';

import { useApplications } from '@/hooks/useApplications';
import { useResumes } from '@/hooks/useResumes';
import { useAnalysisStore } from '@/stores/useAnalysisStore';
import { useParseResumeStep } from '@/hooks/useParseResumeStep';
import { useExtractJdStep } from '@/hooks/useExtractJdStep';
import { useChatSync } from '@/hooks/useChatSync';
import type { ComparisonResult } from '@/types';
import type { ChatMessage } from '@/stores/useAnalysisStore';
import { toUserFriendlyError } from '@/utils/userFriendlyErrors';

import AgentChatPanel from './AgentChatPanel';

interface AnalysisQueryResult {
  currentResult: ComparisonResult;
  previousResult: ComparisonResult | null;
  parsedResume: { heading: string; content: string }[];
  jdExtract: any | null;
  chatMessages?: any[];
}

export default function AnalysisPageClient({ id }: { id: string }) {
  const { jobs, updateJob } = useApplications();
  const { resumes } = useResumes();

  const job = jobs.find((j) => j.id === id);
  const { data: analysisData, isError, error: queryError, refetch } = useQuery({
    queryKey: ['analysis', id],
    queryFn: async () => await getAnalysisAction(id as any),
    enabled: !!id,
  }) as { data: AnalysisQueryResult | undefined; isError: boolean; error: Error | null; refetch: () => any };

  useEffect(() => {
    if (isError && queryError) {
      useAnalysisStore.getState().setError(
        toUserFriendlyError(queryError, 'Failed to load analysis details.'),
        () => { refetch(); },
        'Failed to Load Analysis'
      );
    }
  }, [isError, queryError, refetch]);

  const chatMessages = useAnalysisStore((s) => s.chatMessages);
  const addChatMessage = useAnalysisStore((s) => s.addChatMessage);
  const acceptEdit = useAnalysisStore((s) => s.acceptEdit);
  const rejectEdit = useAnalysisStore((s) => s.rejectEdit);
  const modifyEdit = useAnalysisStore((s) => s.modifyEdit);
  const rightSidebarOpen = useAnalysisStore((s) => s.rightSidebarOpen);
  const setRightSidebarOpen = useAnalysisStore((s) => s.setRightSidebarOpen);
  const setRightSidebarTab = useAnalysisStore((s) => s.setRightSidebarTab);

  const [inputVal, setInputVal] = useState('');

  const resumeForReRun = resumes.find(r => r.id === (job?.resumeUsed ?? '')) || resumes.find(r => r.isDefault) || resumes[0];

  const dbMessages = analysisData?.chatMessages ?? [];
  const enrichedChatMessages: ChatMessage[] = dbMessages.map((m: any) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    type: m.type,
    meta: m.metaJson ? JSON.parse(m.metaJson) : undefined,
  }));

  const enrichedJob = job ? {
    ...job,
    analysisResult: analysisData?.currentResult ?? undefined,
    parsedResume: analysisData?.parsedResume ?? [],
    jdExtract: analysisData?.jdExtract ?? null,
    chatMessages: enrichedChatMessages,
  } : null;

  const { isExtracting, runExtractJd } = useExtractJdStep({
    jobDescription: job?.jobDescription || '',
    onSaveChanges: updateJob,
    jobId: job?.id ?? '',
    jobRole: job?.role,
    jobCompany: job?.company,
  });

  const {
    isParsing,
    runParseStep,
    handleApproveStep1: originalApproveStep1,
    handleReParseStep1,
    handleResolveMissingInfo,
    handleSkipMissingInfo,
  } = useParseResumeStep({
    job: enrichedJob!,
    resumeForReRun,
    onSaveChanges: updateJob,
    isAnalysisReady: analysisData !== undefined,
    onStep1Complete: runExtractJd,
  });

  const handleApproveStep1 = () => {
    originalApproveStep1();
    runExtractJd();
  };

  const stepText = isParsing
    ? 'Step 1: Parsing resume sections...'
    : isExtracting
    ? 'Step 2: Extracting requirements...'
    : job?.jdExtract
    ? 'Tailoring Roadmap Active (Step 3)'
    : 'Step 1: Parsing resume details';

  useChatSync(chatMessages, job?.id, updateJob);

  const handleSendCommand = useCallback((e: React.FormEvent) => {
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
        content: `Got it! I'm still working through the resume. I'll get back to you when I'm ready.`,
        type: 'agent-text',
      });
    }, 1000);
  }, [inputVal, addChatMessage]);

  const handleChipClick = useCallback((chipText: string) => {
    addChatMessage({
      role: 'user',
      content: chipText,
      type: 'user',
    });
    setTimeout(() => {
      addChatMessage({
        role: 'assistant',
        content: `Got it — I'll keep that in mind. The parsed sections are on the right if you want to take a look.`,
        type: 'agent-text',
      });
    }, 800);
  }, [addChatMessage]);

  const handleToggleRightSidebar = useCallback((tab: 'resume' | 'jd') => {
    setRightSidebarTab(tab);
    setRightSidebarOpen(true);
  }, [setRightSidebarTab, setRightSidebarOpen]);

  if (!job || !enrichedJob) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full w-full bg-[var(--bg-main)]">
        <p className="text-sm text-[var(--text-muted)]">Job not found.</p>
      </div>
    );
  }

  if (analysisData === undefined) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full w-full bg-[var(--bg-main)]">
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-t-[var(--accent)] border-r-[var(--accent-cyan)] border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-1.5 rounded-full border-2 border-t-[var(--accent-yellow)] border-r-transparent border-b-[var(--accent)] border-l-transparent animate-spin [animation-direction:reverse] [animation-duration:1s]" />
        </div>
        <p className="text-sm font-medium text-[var(--text-muted)] animate-pulse">Loading match analysis report...</p>
      </div>
    );
  }

  return (
    <AgentChatPanel
      chatMessages={chatMessages}
      isParsing={isParsing}
      isExtracting={isExtracting}
      rightSidebarOpen={rightSidebarOpen}
      stepText={stepText}
      role={job.role || job.jdExtract?.roleTitle || 'Unnamed Role'}
      company={job.company || job.jdExtract?.companyName || 'Unnamed Company'}
      inputVal={inputVal}
      onInputChange={setInputVal}
      onToggleRightSidebar={handleToggleRightSidebar}
      onApproveStep1={handleApproveStep1}
      onReParseStep1={handleReParseStep1}
      onResolveMissingInfo={handleResolveMissingInfo}
      onSkipMissingInfo={handleSkipMissingInfo}
      onAcceptEdit={acceptEdit}
      onRejectEdit={rejectEdit}
      onModifyEdit={modifyEdit}
      onRetryParse={runParseStep}
      onRetryExtract={runExtractJd}
      onSendCommand={handleSendCommand}
      onChipClick={handleChipClick}
    />
  );
}
