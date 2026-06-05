'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';

import { useApplications } from '../../../../../hooks/useApplications';
import { useResumes } from '../../../../../hooks/useResumes';
import { useRunAnalysis } from '../../../../../hooks/useRunAnalysis';
import type { ComparisonResult } from '../../../../../hooks/types';

import MatchAnalysisDetail from '../../../../../components/application-board/match-analysis/MatchAnalysisDetail';

interface AnalysisQueryResult {
  currentResult: ComparisonResult;
  previousResult: ComparisonResult | null;
}

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [expandedPrepIndex, setExpandedPrepIndex] = useState<number | null>(null);

  const { jobs, updateJob } = useApplications();
  const { resumes } = useResumes();
  const { runAnalysis } = useRunAnalysis();

  const job = jobs.find((j) => j.id === id);
  const analysisData = useQuery(api.applications.getAnalysis, { applicationId: id as any }) as AnalysisQueryResult | undefined;

  const handleReRunAnalysis = useCallback(async (jobId: string, resumeContent: string, jobDesc: string) => {
    const data = await runAnalysis(jobId, resumeContent, jobDesc);
    if (data) {
      updateJob(jobId, {
        matchScore: data.score,
        analysisResult: data,
        jobDescription: jobDesc,
      });
    }
    return data;
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
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-[var(--accent)] animate-spin"></div>
        <p className="text-xs text-[var(--text-muted)]">Loading match analysis report...</p>
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
    />
  );
}
