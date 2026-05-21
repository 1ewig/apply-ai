'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useApplications } from '../../../../../hooks/useApplications';
import { useResumes } from '../../../../../hooks/useResumes';
import { useAnalysisStore } from '../../../../../hooks/useAnalysisStore';

import MatchAnalysisDetail from '../../../../../components/application-board/MatchAnalysisDetail';

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [expandedPrepIndex, setExpandedPrepIndex] = useState<number | null>(null);

  const { jobs, updateJob } = useApplications();
  const { resumes } = useResumes();
  const { startAnalysis, setError, finishAnalysis } = useAnalysisStore();

  const job = jobs.find((j) => j.id === id);

  const handleReRunAnalysis = useCallback(async (jobId: string, resumeContent: string, jobDesc: string) => {
    startAnalysis();
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      if (apiKey) headers['x-api-key'] = apiKey;

      const response = await fetch('/api/compare', {
        method: 'POST',
        headers,
        body: JSON.stringify({ resumeText: resumeContent, jobDescription: jobDesc }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to compare resume and job description.');

      updateJob(jobId, {
        matchScore: data.score,
        analysisResult: data,
        jobDescription: jobDesc,
      });
      return data;
    } catch (err: any) {
      const message = err.message || 'An unexpected error occurred. Please try again.';
      setError(message);
      throw err;
    } finally {
      finishAnalysis();
    }
  }, [startAnalysis, setError, finishAnalysis, updateJob]);

  if (!job) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-[var(--text-muted)]">Job not found.</p>
      </div>
    );
  }

  return (
    <MatchAnalysisDetail
      job={job}
      resumes={resumes}
      expandedPrepIndex={expandedPrepIndex}
      onTogglePrepItem={(idx) => setExpandedPrepIndex(expandedPrepIndex === idx ? null : idx)}
      onBackClick={() => router.push('/application-board')}
      onReRunAnalysis={handleReRunAnalysis}
    />
  );
}
