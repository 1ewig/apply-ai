"use client";

import Button from '@/components/ui/Button';
import type { JobApplication, Resume } from '@/types';
import { Plus, Search, Sparkles } from 'lucide-react';
import JobCard from './JobCard';
import SearchFilterBar from './SearchFilterBar';

interface ApplicationsBoardProps {
  jobs: JobApplication[];
  filteredJobs: JobApplication[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  resumes: Resume[];
  isAnalyzingId: string | null;
  onAddJobClick: () => void;
  onEditJobClick: (job: JobApplication) => void;
  onMatchClick: (job: JobApplication) => void;
  onViewAnalysisClick: (jobId: string) => void;
  onUpdateJobStatus: (id: string, status: JobApplication['status']) => void;
  onDeleteJob: (id: string) => void;
  isLoading?: boolean;
}

export default function ApplicationsBoard({
  jobs,
  filteredJobs,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  resumes,
  isAnalyzingId,
  onAddJobClick,
  onEditJobClick,
  onMatchClick,
  onViewAnalysisClick,
  onUpdateJobStatus,
  onDeleteJob,
  isLoading = false,
}: ApplicationsBoardProps) {

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="text-center sm:text-left">
          <h2 className="font-display font-extrabold text-xl md:text-2xl text-[var(--text-heading)]">Applications</h2>
          <p className="text-xs text-[var(--text-muted)]">Track your target roles and evaluate compatibility</p>
        </div>
        <Button variant="primary" size="md" onClick={onAddJobClick} className="hidden sm:flex items-center gap-1.5 shadow-md text-xs">
          <Plus className="w-3.5 h-3.5" />
          Add Application
        </Button>
      </div>

      {/* Premium Product Update Notice */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--accent)]/5 via-[var(--accent-cyan)]/5 to-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shrink-0">
            <Sparkles className="w-4.5 h-4.5 text-[var(--accent)] stroke-[2.5]" />
          </div>
          <div>
            <h4 className="font-display font-extrabold text-xs text-[var(--text-heading)] flex items-center gap-1.5 leading-none">
              ApplyAI Premium Upgrades
              <span className="text-[8px] bg-[var(--accent)] text-white font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90 origin-left">Alpha Progress</span>
            </h4>
            <p className="text-[10px] text-[var(--text-body)] mt-1.5 max-w-2xl leading-relaxed">
              We are actively developing premium dashboard features! Coming next in the alpha roadmap: **Resume PDF Drag-and-Drop Parser**, **Pipeline Analytics Dashboard**, and **OAuth-Secure Gmail Auto-Sync** to automatically parse company replies.
            </p>
          </div>
        </div>
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        total={jobs.length}
        filteredCount={filteredJobs.length}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <div className="relative w-12 h-12 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-t-[var(--accent)] border-r-[var(--accent-cyan)] border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-1.5 rounded-full border-2 border-t-[var(--accent-yellow)] border-r-transparent border-b-[var(--accent)] border-l-transparent animate-spin [animation-direction:reverse] [animation-duration:1s]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-muted)] animate-pulse">Loading job applications...</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              resumes={resumes}
              isCurrentlyAnalyzing={isAnalyzingId === job.id}
              onEditJobClick={onEditJobClick}
              onMatchClick={onMatchClick}
              onViewAnalysisClick={onViewAnalysisClick}
              onUpdateJobStatus={onUpdateJobStatus}
              onDeleteJob={onDeleteJob}
            />
          ))
        )}

        {!isLoading && filteredJobs.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed border-[var(--border)] rounded-3xl bg-[var(--bg-surface)] shadow-sm">
            <Search className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
            <h4 className="font-display font-extrabold text-base text-[var(--text-heading)] mb-1">No Applications Found</h4>
            <p className="text-xs text-[var(--text-muted)] mb-6 max-w-xs mx-auto">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'Get started by creating your first job application.'}
            </p>
            <Button variant="primary" size="sm" onClick={onAddJobClick}>
              Add Application
            </Button>
          </div>
        )}
      </div>

      <button
        onClick={onAddJobClick}
        className="fixed bottom-6 right-6 md:hidden z-30 w-14 h-14 rounded-full bg-[var(--accent)] text-white shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
