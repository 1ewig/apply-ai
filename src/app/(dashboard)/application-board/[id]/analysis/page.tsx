'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useApplications } from '../../../../../hooks/useApplications';
import { useResumes } from '../../../../../hooks/useResumes';
import { useRunAnalysis } from '../../../../../hooks/useRunAnalysis';

import MatchAnalysisDetail from '../../../../../components/application-board/MatchAnalysisDetail';

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [expandedPrepIndex, setExpandedPrepIndex] = useState<number | null>(null);

  const { jobs, updateJob } = useApplications();
  const { resumes } = useResumes();
  const { runAnalysis } = useRunAnalysis();

  const job = jobs.find((j) => j.id === id);

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

  const resumeForReRun = resumes.find(r => r.id === job.resumeUsed) || resumes.find(r => r.isDefault) || resumes[0];

  return (
    <MatchAnalysisDetail
      job={job}
      resumes={resumes}
      resumeForReRun={resumeForReRun}
      expandedPrepIndex={expandedPrepIndex}
      onTogglePrepItem={(idx) => setExpandedPrepIndex(expandedPrepIndex === idx ? null : idx)}
      onBackClick={() => router.push('/application-board')}
      onReRunAnalysis={handleReRunAnalysis}
    />
  );
}
