import { useCallback } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { useAnalysisStore } from '@/stores/useAnalysisStore';
import type { JobApplication } from './types';

interface AddJobData {
  company: string;
  role: string;
  status: JobApplication['status'];
  dateApplied: string;
  url: string;
  jobDescription: string;
  resumeUsed: string;
  customResumeContent: string;
}

interface UseSubmitApplicationOptions {
  addJob: (data: AddJobData) => Promise<string>;
  updateJob: (id: string, data: Partial<JobApplication>) => void;
  runAnalysis: (jobId: string, customResumeContent: string, jobDescription: string) => Promise<any>;
  router: AppRouterInstance;
}

export function useSubmitApplication({ addJob, updateJob, runAnalysis, router }: UseSubmitApplicationOptions) {
  const { startAnalysis, finishAnalysis, setError } = useAnalysisStore();

  const handleAddJobSubmit = useCallback(async (jobData: {
    company: string;
    role: string;
    status: JobApplication['status'];
    url: string;
    jobDescription: string;
    selectedResumeId: string;
    customResumeContent: string;
    analyzeImmediately: boolean;
    editingJobId?: string;
  }) => {
    try {
      if (jobData.editingJobId) {
        await updateJob(jobData.editingJobId, {
          company: jobData.company,
          role: jobData.role,
          status: jobData.status,
          url: jobData.url || '',
        });
      } else {
        const createdJobId = await addJob({
          company: jobData.company,
          role: jobData.role,
          status: jobData.status,
          dateApplied: new Date().toLocaleDateString(),
          url: jobData.url || '',
          jobDescription: jobData.jobDescription || '',
          resumeUsed: jobData.selectedResumeId || '',
          customResumeContent: jobData.customResumeContent || '',
        });

        if (jobData.analyzeImmediately && jobData.jobDescription && jobData.customResumeContent) {
          startAnalysis();
          try {
            const data = await runAnalysis(createdJobId, jobData.customResumeContent, jobData.jobDescription);
            if (data) {
              updateJob(createdJobId, {
                matchScore: data.score,
                analysisResult: data,
                jobDescription: jobData.jobDescription,
              });
              router.push(`/application-board/${createdJobId}/analysis`);
            }
          } finally {
            finishAnalysis();
          }
        }
      }
    } catch (err: any) {
      console.error('Error saving job application:', err);
      setError(err.message || 'Failed to save job application.');
    }
  }, [addJob, updateJob, runAnalysis, router]);

  return { handleAddJobSubmit };
}