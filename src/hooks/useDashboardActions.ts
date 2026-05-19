import { useCallback } from 'react';
import { JobApplication } from './types';

interface UseDashboardActionsParams {
  addJob: (job: Omit<JobApplication, 'id'>) => Promise<any>;
  updateJob: (id: any, updates: Partial<JobApplication>) => Promise<any>;
  addResume: (resume: { name: string; content: string; isDefault: boolean }) => Promise<any>;
  updateResume: (id: any, updates: Partial<{ name: string; content: string; isDefault: boolean }>) => Promise<any>;
  runAnalysis: (jobId: string, resumeContent: string, jobDescription: string) => Promise<any>;
  viewAnalysis: (jobId: string) => void;
}

export function useDashboardActions({
  addJob,
  updateJob,
  addResume,
  updateResume,
  runAnalysis,
  viewAnalysis,
}: UseDashboardActionsParams) {
  const handleRunAnalysis = useCallback(async (jobId: string, resumeContent: string, jobDesc: string) => {
    try {
      const data = await runAnalysis(jobId, resumeContent, jobDesc);
      if (data) {
        updateJob(jobId, {
          matchScore: data.score,
          analysisResult: data,
          jobDescription: jobDesc,
        });
        viewAnalysis(jobId);
      }
    } catch {
      // Error is handled by useAnalysis hook (sets error state)
    }
  }, [runAnalysis, updateJob, viewAnalysis]);

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
          jobDescription: jobData.jobDescription || '',
          resumeUsed: jobData.selectedResumeId || '',
          customResumeContent: jobData.customResumeContent || '',
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
          await handleRunAnalysis(createdJobId, jobData.customResumeContent, jobData.jobDescription);
        }
        return;
      }

      if (jobData.analyzeImmediately && jobData.jobDescription && jobData.customResumeContent) {
        await handleRunAnalysis(jobData.editingJobId, jobData.customResumeContent, jobData.jobDescription);
      }
    } catch (err) {
      console.error("Error saving job application:", err);
    }
  }, [addJob, updateJob, handleRunAnalysis]);

  const handleAddResume = useCallback((data: { name: string; content: string; isDefault: boolean }) => {
    addResume(data);
  }, [addResume]);

  const handleEditResume = useCallback((id: string, data: { name: string; content: string; isDefault: boolean }) => {
    updateResume(id, data);
  }, [updateResume]);

  return { handleRunAnalysis, handleAddJobSubmit, handleAddResume, handleEditResume };
}
