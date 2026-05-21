"use client";

import { useEffect, useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

import { useApplications } from "../../hooks/useApplications";
import { useResumes } from "../../hooks/useResumes";
import { useAnalysis } from "../../hooks/useAnalysis";
import { useDashboardUI } from "../../hooks/useDashboardUI";
import { useApplicationSearch } from "../../hooks/useApplicationSearch";
import { useDashboardActions } from "../../hooks/useDashboardActions";

import Sidebar from "../../components/dashboard/Sidebar";
import ApplicationsBoard from "../../components/application-board/ApplicationsBoard";
import ResumeTemplates from "../../components/resume-templates/ResumeTemplates";
import MatchAnalysisDetail from "../../components/application-board/MatchAnalysisDetail";
import AddApplicationModal from "../../components/application-board/AddApplicationModal";
import AddResumeModal from "../../components/resume-templates/AddResumeModal";
import EditResumeModal from "../../components/resume-templates/EditResumeModal";
import AnalysisLoadingOverlay from "../../components/dashboard/AnalysisLoadingOverlay";
import ErrorToast from "../../components/dashboard/ErrorToast";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const storeUser = useMutation(api.users.storeUser);

  const { jobs, addJob, updateJob, deleteJob } = useApplications();
  const { resumes, addResume, updateResume, deleteResume, setDefaultResume } = useResumes();
  const { isLoading, loadingPhase, phases, error, runAnalysis, clearError } = useAnalysis();
  const ui = useDashboardUI();
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredJobs } = useApplicationSearch(jobs);
  const [expandedPrepIndex, setExpandedPrepIndex] = useState<number | null>(null);

  const actions = useDashboardActions({ addJob, updateJob, addResume, updateResume, runAnalysis, viewAnalysis: ui.viewAnalysis });

  const handleAddJobSubmit = useCallback(
    (data: Parameters<typeof actions.handleAddJobSubmit>[0]) =>
      actions.handleAddJobSubmit({ ...data, editingJobId: ui.editingJob?.id }),
    [actions.handleAddJobSubmit, ui.editingJob?.id],
  );

  useEffect(() => {
    setMounted(true);
    storeUser().catch((err) => console.error("Error syncing user:", err));
  }, [storeUser]);

  const currentAnalysisJob = jobs.find((j) => j.id === ui.viewingAnalysisJobId);

  if (!mounted) {
    return (
      <div className="bg-[var(--bg-page)] min-h-screen" style={{ fontFamily: '"DM Sans", sans-serif' }} />
    );
  }

  return (
    <main className="bg-[var(--bg-page)] min-h-screen animate-fade-up" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <div className="flex min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
        <Sidebar activeTab={ui.activeTab} isViewingAnalysis={ui.viewingAnalysisJobId !== null} onTabChange={ui.switchTab} onBack={() => router.push("/")} />

        <main className="flex-1 flex flex-col overflow-y-auto h-screen relative">
          <AnalysisLoadingOverlay isLoading={isLoading} loadingPhase={loadingPhase} phases={phases} />
          <ErrorToast error={error} onDismiss={clearError} />

          <div className="p-8 flex-1">
            {ui.viewingAnalysisJobId && currentAnalysisJob ? (
              <MatchAnalysisDetail
                job={currentAnalysisJob}
                resumes={resumes}
                expandedPrepIndex={expandedPrepIndex}
                onTogglePrepItem={(idx) => setExpandedPrepIndex(expandedPrepIndex === idx ? null : idx)}
                onBackClick={ui.closeAnalysis}
                onReRunAnalysis={actions.handleRunAnalysis}
              />
            ) : ui.activeTab === 'jobs' ? (
              <ApplicationsBoard
                jobs={jobs}
                filteredJobs={filteredJobs}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                resumes={resumes}
                onAddJobClick={ui.openAddJob}
                onEditJobClick={ui.openEditJob}
                onMatchClick={ui.openEditJob}
                onViewAnalysisClick={ui.viewAnalysis}
                onUpdateJobStatus={(id, status) => updateJob(id, { status })}
                onDeleteJob={(id) => deleteJob(id)}
              />
            ) : (
              <ResumeTemplates
                resumes={resumes}
                onAddResumeClick={ui.openAddResume}
                onEditResumeClick={ui.startEditResume}
                onDeleteResume={(id) => deleteResume(id)}
                onSetDefaultResume={(id) => setDefaultResume(id)}
              />
            )}
          </div>
        </main>
      </div>

      <AddApplicationModal isOpen={ui.isAddJobOpen} onClose={ui.closeAddJob} resumes={resumes} editingJob={ui.editingJob} onSubmit={handleAddJobSubmit} />
      <AddResumeModal isOpen={ui.isAddResumeOpen} onClose={ui.closeAddResume} onSubmit={actions.handleAddResume} />
      <EditResumeModal resume={ui.editingResume} onClose={ui.cancelEditResume} onSubmit={actions.handleEditResume} />
    </main>
  );
}
