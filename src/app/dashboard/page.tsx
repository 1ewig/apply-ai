"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Sparkle } from "lucide-react";

import { useApplications } from "../../hooks/useApplications";
import { useResumes } from "../../hooks/useResumes";
import { useAnalysis } from "../../hooks/useAnalysis";
import { useDashboardUI } from "../../hooks/useDashboardUI";
import { useApplicationSearch } from "../../hooks/useApplicationSearch";
import { JobApplication } from "../../hooks/useStore";

import Sidebar from "../../components/dashboard/Sidebar";
import ApplicationsBoard from "../../components/dashboard/ApplicationsBoard";
import ResumeTemplates from "../../components/dashboard/ResumeTemplates";
import MatchAnalysisDetail from "../../components/dashboard/MatchAnalysisDetail";
import AddApplicationModal from "../../components/dashboard/AddApplicationModal";
import AddResumeModal from "../../components/dashboard/AddResumeModal";
import EditResumeModal from "../../components/dashboard/EditResumeModal";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const storeUser = useMutation(api.users.storeUser);

  const { jobs, addJob, updateJob, deleteJob } = useApplications();
  const { resumes, addResume, updateResume, deleteResume, setDefaultResume } = useResumes();
  const { isLoading, loadingPhase, phases, error, runAnalysis, clearError } = useAnalysis();
  const ui = useDashboardUI();
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredJobs } = useApplicationSearch(jobs);

  useEffect(() => {
    setMounted(true);
    storeUser().catch((err) => console.error("Error syncing user:", err));
  }, [storeUser]);

  const handleRunAnalysis = async (jobId: string, resumeContent: string, jobDesc: string) => {
    try {
      const data = await runAnalysis(jobId, resumeContent, jobDesc);
      if (data) {
        updateJob(jobId, {
          matchScore: data.score,
          analysisResult: data,
          jobDescription: jobDesc,
        });
        ui.viewAnalysis(jobId);
      }
    } catch {
      // Error is handled by useAnalysis hook (sets error state)
    }
  };

  const handleAddJobSubmit = async (jobData: {
    company: string;
    role: string;
    status: JobApplication['status'];
    url: string;
    jobDescription: string;
    selectedResumeId: string;
    customResumeContent: string;
    analyzeImmediately: boolean;
  }) => {
    try {
      if (ui.editingJob) {
        await updateJob(ui.editingJob.id, {
          company: jobData.company,
          role: jobData.role,
          status: jobData.status,
          url: jobData.url || "",
          jobDescription: jobData.jobDescription || "",
          resumeUsed: jobData.selectedResumeId || "",
          customResumeContent: jobData.customResumeContent || "",
        });

        if (jobData.analyzeImmediately && jobData.jobDescription && jobData.customResumeContent) {
          await handleRunAnalysis(ui.editingJob.id, jobData.customResumeContent, jobData.jobDescription);
        }
      } else {
        const createdJobId = await addJob({
          company: jobData.company,
          role: jobData.role,
          status: jobData.status,
          dateApplied: new Date().toLocaleDateString(),
          url: jobData.url || "",
          jobDescription: jobData.jobDescription || "",
          resumeUsed: jobData.selectedResumeId || "",
          customResumeContent: jobData.customResumeContent || "",
        });

        if (jobData.analyzeImmediately && jobData.jobDescription && jobData.customResumeContent) {
          await handleRunAnalysis(createdJobId as any, jobData.customResumeContent, jobData.jobDescription);
        }
      }
    } catch (err) {
      console.error("Error saving job application:", err);
    }
  };

  const handleAddResume = (data: { name: string; content: string; isDefault: boolean }) => {
    addResume(data);
  };

  const handleEditResume = (id: string, data: { name: string; content: string; isDefault: boolean }) => {
    updateResume(id, data);
  };

  const currentAnalysisJob = jobs.find((j) => j.id === ui.viewingAnalysisJobId);
  const [expandedPrepIndex, setExpandedPrepIndex] = useState<number | null>(null);

  if (!mounted) {
    return (
      <div
        className="bg-[var(--bg-page)] min-h-screen"
        style={{ fontFamily: '"DM Sans", sans-serif' }}
      />
    );
  }

  return (
    <main
      className="bg-[var(--bg-page)] min-h-screen animate-fade-up"
      style={{ fontFamily: '"DM Sans", sans-serif' }}
    >
      <div className="flex min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
        <Sidebar
          activeTab={ui.activeTab}
          isViewingAnalysis={ui.viewingAnalysisJobId !== null}
          onTabChange={ui.switchTab}
          onBack={() => router.push("/")}
        />

        <main className="flex-1 flex flex-col overflow-y-auto h-screen relative">
          {/* Loading overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
              >
                <div className="bg-white rounded-3xl border border-[var(--border)] shadow-[var(--shadow-float)] p-12 text-center max-w-md w-full">
                  <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-50 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-[var(--accent)] border-r-[var(--accent-cyan)] border-b-transparent border-l-transparent animate-spin"></div>
                    <Sparkle className="w-8 h-8 text-[var(--accent-cyan)] animate-pulse" />
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)] mb-1">
                    Analyzing Alignment
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mb-6">
                    Applying advanced semantic matching rules to optimize your resume bullets.
                  </p>

                  <div className="bg-[var(--bg-page)] rounded-2xl p-4 text-left border border-black/5">
                    <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-1">
                      System Pipeline Status
                    </span>
                    <div className="text-xs font-semibold text-[var(--text-heading)] flex items-center gap-2 min-h-[32px]">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse shrink-0"></div>
                      {phases[loadingPhase]}
                    </div>
                    <div className="w-full bg-gray-200 h-1 rounded-full mt-3 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-cyan)] h-full"
                        animate={{ width: `${((loadingPhase + 1) / phases.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Global Error Toast */}
          {error && (
            <div className="bg-rose-50 border-b border-rose-200 px-6 py-3.5 flex justify-between items-center text-rose-800 text-xs font-medium shrink-0">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                {error}
              </span>
              <button onClick={clearError} className="underline cursor-pointer hover:text-rose-900">Dismiss</button>
            </div>
          )}

          {/* Dashboard inner panels */}
          <div className="p-8 flex-1">
            {ui.viewingAnalysisJobId && currentAnalysisJob ? (
              <MatchAnalysisDetail
                job={currentAnalysisJob}
                resumes={resumes}
                expandedPrepIndex={expandedPrepIndex}
                onTogglePrepItem={(idx) => setExpandedPrepIndex(expandedPrepIndex === idx ? null : idx)}
                onBackClick={ui.closeAnalysis}
                onReRunAnalysis={handleRunAnalysis}
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
                onUpdateJobStatus={(id, status) => updateJob(id, { status as any })}
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

      <AddApplicationModal
        isOpen={ui.isAddJobOpen}
        onClose={ui.closeAddJob}
        resumes={resumes}
        editingJob={ui.editingJob}
        onSubmit={handleAddJobSubmit}
      />

      <AddResumeModal
        isOpen={ui.isAddResumeOpen}
        onClose={ui.closeAddResume}
        onSubmit={handleAddResume}
      />

      <EditResumeModal
        resume={ui.editingResume}
        onClose={ui.cancelEditResume}
        onSubmit={handleEditResume}
      />
    </main>
  );
}
