'use client';

import { useEffect, useState, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useRouter } from 'next/navigation';

import { useApplications } from '../../../hooks/useApplications';
import { useResumes } from '../../../hooks/useResumes';
import { useAnalysisStore } from '../../../hooks/useAnalysisStore';
import { useApplicationSearch } from '../../../hooks/useApplicationSearch';

import ApplicationsBoard from '../../../components/application-board/ApplicationsBoard';
import AddApplicationModal from '../../../components/application-board/AddApplicationModal';
import type { JobApplication } from '../../../hooks/types';

export default function ApplicationBoardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const storeUser = useMutation(api.users.storeUser);

  const { jobs, addJob, updateJob, deleteJob } = useApplications();
  const { resumes } = useResumes();
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredJobs } = useApplicationSearch(jobs);
  const { startAnalysis, setError, finishAnalysis } = useAnalysisStore();

  useEffect(() => {
    setMounted(true);
    storeUser().catch((err) => console.error('Error syncing user:', err));
  }, [storeUser]);

  const handleRunAnalysis = useCallback(async (jobId: string, resumeContent: string, jobDescription: string) => {
    startAnalysis();
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      if (apiKey) headers['x-api-key'] = apiKey;

      const response = await fetch('/api/compare', {
        method: 'POST',
        headers,
        body: JSON.stringify({ resumeText: resumeContent, jobDescription }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to compare resume and job description.');
      return data;
    } catch (err: any) {
      const message = err.message || 'An unexpected error occurred. Please try again.';
      setError(message);
      throw err;
    } finally {
      finishAnalysis();
    }
  }, [startAnalysis, setError, finishAnalysis]);

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

        if (jobData.analyzeImmediately && jobData.jobDescription && jobData.customResumeContent) {
          const data = await handleRunAnalysis(jobData.editingJobId, jobData.customResumeContent, jobData.jobDescription);
          if (data) {
            updateJob(jobData.editingJobId, {
              matchScore: data.score,
              analysisResult: data,
              jobDescription: jobData.jobDescription,
            });
            router.push(`/application-board/${jobData.editingJobId}/analysis`);
          }
        }
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
          const data = await handleRunAnalysis(createdJobId, jobData.customResumeContent, jobData.jobDescription);
          if (data) {
            updateJob(createdJobId, {
              matchScore: data.score,
              analysisResult: data,
              jobDescription: jobData.jobDescription,
            });
            router.push(`/application-board/${createdJobId}/analysis`);
          }
        }
      }
    } catch (err) {
      console.error('Error saving job application:', err);
    }
  }, [addJob, updateJob, handleRunAnalysis, router]);

  const handleAddJob = useCallback(() => {
    setEditingJob(null);
    setIsAddJobOpen(true);
  }, []);

  const handleEditJob = useCallback((job: JobApplication) => {
    setEditingJob(job);
    setIsAddJobOpen(true);
  }, []);

  const handleCloseAddJob = useCallback(() => {
    setIsAddJobOpen(false);
    setEditingJob(null);
  }, []);

  const handleViewAnalysis = useCallback((jobId: string) => {
    router.push(`/application-board/${jobId}/analysis`);
  }, [router]);

  const handleMatchClick = useCallback((job: JobApplication) => {
    setEditingJob(job);
    setIsAddJobOpen(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <ApplicationsBoard
        jobs={jobs}
        filteredJobs={filteredJobs}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        resumes={resumes}
        onAddJobClick={handleAddJob}
        onEditJobClick={handleEditJob}
        onMatchClick={handleMatchClick}
        onViewAnalysisClick={handleViewAnalysis}
        onUpdateJobStatus={(id, status) => updateJob(id, { status })}
        onDeleteJob={(id) => deleteJob(id)}
      />

      <AddApplicationModal
        isOpen={isAddJobOpen}
        onClose={handleCloseAddJob}
        resumes={resumes}
        editingJob={editingJob}
        onSubmit={(data) => handleAddJobSubmit({ ...data, editingJobId: editingJob?.id })}
      />
    </>
  );
}
