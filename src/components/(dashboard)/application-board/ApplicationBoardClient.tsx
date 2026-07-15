'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useApplications } from '@/hooks/useApplications';
import { useResumes } from '@/hooks/useResumes';
import { useRunAnalysis } from '@/hooks/useRunAnalysis';
import { useApplicationSearch } from '@/hooks/useApplicationSearch';
import { useSubmitApplication } from '@/hooks/useSubmitApplication';

import ApplicationsBoard from './ApplicationsBoard';
import AddApplicationModal from './AddApplicationModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import type { JobApplication } from '@/types';
import { useAnalysisStore } from '@/stores/useAnalysisStore';

export default function ApplicationBoardClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [pendingDeleteJobId, setPendingDeleteJobId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { jobs, isLoading, isError, error, refetch, addJob, updateJob, deleteJob } = useApplications();
  const { resumes } = useResumes();
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredJobs } = useApplicationSearch(jobs);
  const { runAnalysis } = useRunAnalysis();
  const { handleAddJobSubmit } = useSubmitApplication({ addJob, updateJob, runAnalysis, router });
  const { setError } = useAnalysisStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isError && error) {
      setError(
        error.message || 'Failed to load job applications from database.',
        () => { refetch(); }
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

  const handleViewAnalysis = useCallback((jobId: string) => {
    router.push(`/application-board/${jobId}/analysis`);
  }, [router]);

  const handleMatchClick = useCallback((job: JobApplication) => {
    setEditingJob(job);
    setIsAddJobOpen(true);
  }, []);

  const handleUpdateStatus = useCallback(async (id: string, status: JobApplication['status']) => {
    try {
      await updateJob(id, { status });
    } catch (err: any) {
      console.error('Failed to update job status:', err);
      setError(err.message || 'Failed to update job status.', () => handleUpdateStatus(id, status));
    }
  }, [updateJob, setError]);

  const handleDeleteJob = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteJob(id);
      setPendingDeleteJobId(null);
    } catch (err: any) {
      console.error('Failed to delete job:', err);
      setError(err.message || 'Failed to delete application.', () => handleDeleteJob(id));
    } finally {
      setIsDeleting(false);
    }
  }, [deleteJob, setError]);

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
        onSubmit={(data) => handleAddJobSubmit({ ...data, editingJobId: editingJob?.id })}
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