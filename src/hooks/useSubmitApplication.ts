import { useCallback } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { useAnalysisStore } from '@/stores/useAnalysisStore';
import { toUserFriendlyError } from '@/utils/userFriendlyErrors';
import type { JobApplication } from '@/types';

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
  onSavingChange?: (saving: boolean) => void;
}

export function useSubmitApplication({ addJob, updateJob, runAnalysis, router, onSavingChange }: UseSubmitApplicationOptions) {
  const { startAnalysis, finishAnalysis, setError, setSuccess } = useAnalysisStore();

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
    onSavingChange?.(true);
    try {
      if (jobData.editingJobId) {
        await updateJob(jobData.editingJobId, {
          company: jobData.company,
          role: jobData.role,
          status: jobData.status,
          url: jobData.url || '',
        });
        setSuccess('Application updated successfully.', 'Application Saved');
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
          startAnalysis(createdJobId);
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
          } catch (analysisErr: any) {
            if (analysisErr.name === 'AbortError') {
              const wasManuallyCanceled = !useAnalysisStore.getState().isLoading;
              if (wasManuallyCanceled) return;
            }
            console.error('Error running immediate analysis:', analysisErr);
            const retryAction = async () => {
              startAnalysis(createdJobId);
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
              } catch (retryErr: any) {
                setError(toUserFriendlyError(retryErr, 'Analysis failed again.'), retryAction, 'Failed to Run Alignment Match');
              } finally {
                finishAnalysis();
              }
            };
            setError(toUserFriendlyError(analysisErr, 'Job created, but AI analysis failed.'), retryAction, 'Failed to Run Alignment Match');
            return;
          } finally {
            finishAnalysis();
          }
        } else {
          setSuccess('Application added successfully.', 'Application Saved');
        }
      }
    } catch (err: any) {
      console.error('Error saving job application:', err);
      const lastData = jobData;
      setError(toUserFriendlyError(err, 'Failed to save application.'), () => handleAddJobSubmit(lastData as any), 'Failed to Save Application');
      throw err;
    } finally {
      onSavingChange?.(false);
    }
  }, [addJob, updateJob, runAnalysis, router, setError, setSuccess, startAnalysis, finishAnalysis, onSavingChange]);

  return { handleAddJobSubmit };
}