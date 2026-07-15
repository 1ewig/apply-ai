'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useApplications } from '@/hooks/useApplications';
import { useResumes } from '@/hooks/useResumes';
import { useRunAnalysis } from '@/hooks/useRunAnalysis';
import { useApplicationSearch } from '@/hooks/useApplicationSearch';
import { useApplicationForm } from '@/hooks/useApplicationForm';
import { useSubmitApplication } from '@/hooks/useSubmitApplication';

import ApplicationsBoard from './ApplicationsBoard';
import AddApplicationModal from './AddApplicationModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import type { JobApplication } from '@/types';
import { useAnalysisStore } from '@/stores/useAnalysisStore';
import { toUserFriendlyError } from '@/utils/userFriendlyErrors';

export default function ApplicationBoardClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [pendingDeleteJobId, setPendingDeleteJobId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { jobs, isLoading, isError, error, refetch, addJob, updateJob, deleteJob } = useApplications();
  const { resumes } = useResumes();
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredJobs } = useApplicationSearch(jobs);
  const { runAnalysis } = useRunAnalysis();
  const { handleAddJobSubmit } = useSubmitApplication({ addJob, updateJob, runAnalysis, router, onSavingChange: setIsSaving });
  const { isLoading: analysisLoading, analyzingJobId, setError, setSuccess } = useAnalysisStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isError && error) {
      setError(
        toUserFriendlyError(error, 'Failed to load job applications.'),
        () => { refetch(); },
        'Failed to Load Applications'
      );
    }
  }, [isError, error, refetch, setError]);

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

  const applicationForm = useApplicationForm(isAddJobOpen, editingJob, resumes, (data) => handleAddJobSubmit({ ...data, editingJobId: editingJob?.id }), handleCloseAddJob);

  const handleViewAnalysis = useCallback((jobId: string) => {
    router.push(`/application-board/${jobId}/analysis`);
  }, [router]);

  const handleMatchClick = useCallback(async (job: JobApplication) => {
    if (job.jobDescription && job.customResumeContent) {
      const startAnalysis = useAnalysisStore.getState().startAnalysis;
      const finishAnalysis = useAnalysisStore.getState().finishAnalysis;

      startAnalysis();
      try {
        const data = await runAnalysis(job.id, job.customResumeContent, job.jobDescription);
        if (data) {
          await updateJob(job.id, {
            matchScore: data.score,
            analysisResult: data,
          });
          router.push(`/application-board/${job.id}/analysis`);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          const wasManuallyCanceled = !useAnalysisStore.getState().isLoading;
          if (wasManuallyCanceled) return;
        }
        console.error('Failed to run alignment analysis:', err);
        const retryAction = () => handleMatchClick(job);
        setError(toUserFriendlyError(err, 'Failed to analyze alignment.'), retryAction, 'Failed to Analyze Alignment');
      } finally {
        finishAnalysis();
      }
    } else {
      setEditingJob(job);
      setIsAddJobOpen(true);
    }
  }, [runAnalysis, updateJob, router, setError]);

  const handleUpdateStatus = useCallback(async (id: string, status: JobApplication['status']) => {
    try {
      await updateJob(id, { status });
      setSuccess('Status moved successfully.', 'Status Updated');
    } catch (err: any) {
      console.error('Failed to update job status:', err);
      setError(toUserFriendlyError(err, 'Failed to update application status.'), () => handleUpdateStatus(id, status), 'Failed to Move Application');
      throw err;
    }
  }, [updateJob, setError, setSuccess]);

  const handleDeleteJob = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteJob(id);
      setPendingDeleteJobId(null);
      setSuccess('Application deleted successfully.', 'Application Removed');
    } catch (err: any) {
      console.error('Failed to delete job:', err);
      setError(toUserFriendlyError(err, 'Failed to delete application.'), () => handleDeleteJob(id), 'Failed to Delete Application');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, [deleteJob, setError, setSuccess]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <ApplicationsBoard
        jobs={jobs}
        isLoading={isLoading}
        filteredJobs={filteredJobs}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        resumes={resumes}
        isAnalyzingId={analyzingJobId}
        onAddJobClick={handleAddJob}
        onEditJobClick={handleEditJob}
        onMatchClick={handleMatchClick}
        onViewAnalysisClick={handleViewAnalysis}
        onUpdateJobStatus={handleUpdateStatus}
        onDeleteJob={(id) => setPendingDeleteJobId(id)}
      />

      <AddApplicationModal
        isOpen={isAddJobOpen}
        onClose={handleCloseAddJob}
        resumes={resumes}
        editingJob={editingJob}
        company={applicationForm.company}
        onCompanyChange={applicationForm.setCompany}
        role={applicationForm.role}
        onRoleChange={applicationForm.setRole}
        status={applicationForm.status}
        onStatusChange={applicationForm.setStatus}
        url={applicationForm.url}
        onUrlChange={applicationForm.setUrl}
        jobDescription={applicationForm.jobDescription}
        onJobDescriptionChange={applicationForm.setJobDescription}
        selectedResumeId={applicationForm.selectedResumeId}
        customResumeContent={applicationForm.customResumeContent}
        onCustomResumeContentChange={applicationForm.setCustomResumeContent}
        analyzeImmediately={applicationForm.analyzeImmediately}
        onAnalyzeImmediatelyChange={applicationForm.setAnalyzeImmediately}
        onResumeTemplateChange={applicationForm.handleResumeTemplateChange}
        isSubmitting={applicationForm.isSubmitting || isSaving}
        isLoading={analysisLoading}
        onSubmit={applicationForm.handleSubmit}
      />

      <ConfirmDialog
        isOpen={!!pendingDeleteJobId}
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={() => pendingDeleteJobId && handleDeleteJob(pendingDeleteJobId)}
        onCancel={() => setPendingDeleteJobId(null)}
      />
    </>
  );
}