import Button from '../ui/Button';
import type { JobApplication, Resume } from '../../hooks/types';
import { Plus, Search } from 'lucide-react';
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
  onAddJobClick: () => void;
  onEditJobClick: (job: JobApplication) => void;
  onMatchClick: (job: JobApplication) => void;
  onViewAnalysisClick: (jobId: string) => void;
  onUpdateJobStatus: (id: string, status: JobApplication['status']) => void;
  onDeleteJob: (id: string) => void;
}

export default function ApplicationsBoard({
  jobs,
  filteredJobs,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  resumes,
  onAddJobClick,
  onEditJobClick,
  onMatchClick,
  onViewAnalysisClick,
  onUpdateJobStatus,
  onDeleteJob,
}: ApplicationsBoardProps) {

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="font-display font-extrabold text-xl md:text-2xl text-[var(--text-heading)]">Applications</h2>
          <p className="text-xs text-[var(--text-muted)]">Track your target roles and evaluate compatibility</p>
        </div>
        <Button variant="primary" size="md" onClick={onAddJobClick} className="hidden sm:flex items-center gap-1.5 shadow-md text-xs">
          <Plus className="w-3.5 h-3.5" />
          Add Application
        </Button>
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
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            resumes={resumes}
            onEditJobClick={onEditJobClick}
            onMatchClick={onMatchClick}
            onViewAnalysisClick={onViewAnalysisClick}
            onUpdateJobStatus={onUpdateJobStatus}
            onDeleteJob={onDeleteJob}
          />
        ))}

        {filteredJobs.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-200 rounded-3xl bg-white shadow-sm">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
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
