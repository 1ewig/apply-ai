'use client';

import { useEffect, useState, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useRouter } from 'next/navigation';

import { useApplications } from '../../../hooks/useApplications';
import { useResumes } from '../../../hooks/useResumes';
import { useRunAnalysis } from '../../../hooks/useRunAnalysis';
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
  const { runAnalysis } = useRunAnalysis();

  useEffect(() => {
    setMounted(true);
    storeUser().catch((err: any) => console.error('Error syncing user:', err));
  }, [storeUser]);

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
          const data = await runAnalysis(jobData.editingJobId, jobData.customResumeContent, jobData.jobDescription);
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
          const data = await runAnalysis(createdJobId, jobData.customResumeContent, jobData.jobDescription);
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
    } catch (err: any) {
      console.error('Error saving job application:', err);
    }
  }, [addJob, updateJob, runAnalysis, router]);

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
