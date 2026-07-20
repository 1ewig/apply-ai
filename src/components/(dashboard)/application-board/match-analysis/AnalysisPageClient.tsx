'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnalysisAction } from '@/app/actions/applications';

import { useApplications } from '@/hooks/useApplications';
import { useResumes } from '@/hooks/useResumes';
import type { ComparisonResult } from '@/types';
import { useAnalysisStore } from '@/stores/useAnalysisStore';
import { toUserFriendlyError } from '@/utils/userFriendlyErrors';

import MatchAnalysisDetail from './MatchAnalysisDetail';

interface AnalysisQueryResult {
  currentResult: ComparisonResult;
  previousResult: ComparisonResult | null;
  parsedResume: { heading: string; content: string }[];
  jdExtract: any | null;
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

  if (!job) {
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

  const resumeForReRun = resumes.find(r => r.id === job.resumeUsed) || resumes.find(r => r.isDefault) || resumes[0];

  return (
    <MatchAnalysisDetail
      job={{
        ...job,
        analysisResult: analysisData?.currentResult ?? undefined,
        parsedResume: analysisData?.parsedResume ?? [],
        jdExtract: analysisData?.jdExtract ?? null,
      }}
      resumeForReRun={resumeForReRun}
      onSaveChanges={updateJob}
    />
  );
}
