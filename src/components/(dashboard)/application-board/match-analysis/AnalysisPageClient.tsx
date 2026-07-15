'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getAnalysisAction } from '@/app/actions/applications';

import { useApplications } from '@/hooks/useApplications';
import { useResumes } from '@/hooks/useResumes';
import { useRunAnalysis } from '@/hooks/useRunAnalysis';
import type { ComparisonResult } from '@/types';
import { useAnalysisStore } from '@/stores/useAnalysisStore';
import { toUserFriendlyError } from '@/utils/userFriendlyErrors';

import MatchAnalysisDetail from './MatchAnalysisDetail';

interface AnalysisQueryResult {
  currentResult: ComparisonResult;
  previousResult: ComparisonResult | null;
}

export default function AnalysisPageClient({ id }: { id: string }) {
  const router = useRouter();
  const [expandedPrepIndex, setExpandedPrepIndex] = useState<number | null>(null);

  const { jobs, updateJob } = useApplications();
  const { resumes } = useResumes();
  const { runAnalysis } = useRunAnalysis();

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

  const handleReRunAnalysis = useCallback(async (jobId: string, resumeContent: string, jobDesc: string) => {
    try {
      const data = await runAnalysis(jobId, resumeContent, jobDesc);
      if (data) {
        updateJob(jobId, {
          matchScore: data.score,
          analysisResult: data,
          jobDescription: jobDesc,
        });
      }
      return data;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        const wasManuallyCanceled = !useAnalysisStore.getState().isLoading;
        if (wasManuallyCanceled) throw err;
      }
      console.error('Error re-running analysis:', err);
      const retryAction = () => handleReRunAnalysis(jobId, resumeContent, jobDesc);
      useAnalysisStore.getState().setError(toUserFriendlyError(err, 'Analysis failed. Please try again.'), retryAction, 'Failed to Analyze Alignment');
      throw err;
    }
  }, [runAnalysis, updateJob]);

  if (!job) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-[var(--text-muted)]">Job not found.</p>
      </div>
    );
  }

  if (analysisData === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-t-[var(--accent)] border-r-[var(--accent-cyan)] border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-1.5 rounded-full border-2 border-t-[var(--accent-yellow)] border-r-transparent border-b-[var(--accent)] border-l-transparent animate-spin [animation-direction:reverse] [animation-duration:1s]" />
        </div>
        <p className="text-sm font-medium text-[var(--text-muted)] animate-pulse">Loading match analysis report...</p>
      </div>
    );
  }

  const resumeForReRun = resumes.find(r => r.id === job.resumeUsed) || resumes.find(r => r.isDefault) || resumes[0];

  return (
    <MatchAnalysisDetail
      job={{ ...job, analysisResult: analysisData?.currentResult ?? undefined }}
      previousAnalysisResult={analysisData?.previousResult ?? undefined}
      resumes={resumes}
      resumeForReRun={resumeForReRun}
      expandedPrepIndex={expandedPrepIndex}
      onTogglePrepItem={(idx) => setExpandedPrepIndex(expandedPrepIndex === idx ? null : idx)}
      onBackClick={() => router.push('/application-board')}
      onReRunAnalysis={handleReRunAnalysis}
      onSaveChanges={updateJob}
    />
  );
}
