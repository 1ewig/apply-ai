import { useState } from 'react';
import { useStore } from './useStore';
import { JobApplication, Resume } from './types';

export function useDashboardUI() {
  const { activeTab, setActiveTab } = useStore();
  const [viewingAnalysisJobId, setViewingAnalysisJobId] = useState<string | null>(null);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [isAddResumeOpen, setIsAddResumeOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);

  const openAddJob = () => setIsAddJobOpen(true);
  const closeAddJob = () => {
    setIsAddJobOpen(false);
    setEditingJob(null);
  };

  const openEditJob = (job: JobApplication) => {
    setEditingJob(job);
    setIsAddJobOpen(true);
  };

  const openAddResume = () => setIsAddResumeOpen(true);
  const closeAddResume = () => setIsAddResumeOpen(false);

  const startEditResume = (resume: Resume) => setEditingResume(resume);
  const cancelEditResume = () => setEditingResume(null);

  const viewAnalysis = (jobId: string) => setViewingAnalysisJobId(jobId);
  const closeAnalysis = () => setViewingAnalysisJobId(null);

  const switchTab = (tab: 'jobs' | 'resumes') => {
    setActiveTab(tab);
    setViewingAnalysisJobId(null);
  };

  return {
    activeTab,
    viewingAnalysisJobId,
    isAddJobOpen,
    isAddResumeOpen,
    editingResume,
    editingJob,
    switchTab,
    openAddJob,
    closeAddJob,
    openEditJob,
    openAddResume,
    closeAddResume,
    startEditResume,
    cancelEditResume,
    viewAnalysis,
    closeAnalysis,
  };
}
