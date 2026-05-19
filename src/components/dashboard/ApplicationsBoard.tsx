import { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { JobApplication, Resume } from '../../hooks/useStore';
import { Sparkles, Plus, Trash2, Play, Search, ExternalLink, Pencil } from 'lucide-react';

interface ApplicationsBoardProps {
  jobs: JobApplication[];
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
  resumes,
  onAddJobClick,
  onEditJobClick,
  onMatchClick,
  onViewAnalysisClick,
  onUpdateJobStatus,
  onDeleteJob,
}: ApplicationsBoardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusBadge = (status: JobApplication['status']) => {
    switch (status) {
      case 'wishlist':
        return { label: 'Wishlist', className: 'bg-slate-100 text-slate-700 border-slate-200' };
      case 'applied':
        return { label: 'Applied', className: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'interviewing':
        return { label: 'Interviewing', className: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'offer':
        return { label: 'Offer Received', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'rejected':
        return { label: 'Rejected', className: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
  };

  // Filter jobs based on search term and status dropdown
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-[var(--text-heading)]">Applications</h2>
          <p className="text-xs text-[var(--text-muted)]">Track your target roles and evaluate compatibility</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={onAddJobClick}
            className="flex items-center gap-1.5 shadow-md text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Application
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-[var(--border)] shadow-sm">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company or role name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 text-xs focus:outline-none focus:border-[var(--accent)] bg-slate-50/50"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 border border-black/10 rounded-xl bg-slate-50/50 text-xs text-[var(--text-body)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="wishlist">Wishlist</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer Received</option>
            <option value="rejected">Rejected</option>
          </select>

          <span className="text-[10px] font-bold text-[var(--text-muted)] whitespace-nowrap bg-[var(--bg-page)] px-3 py-2 rounded-xl">
            {filteredJobs.length} of {jobs.length} roles
          </span>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => {
          const badgeDetails = getStatusBadge(job.status);
          return (
            <Card
              key={job.id}
              className="p-5 border border-black/5 hover:border-[var(--accent)] hover:shadow-md transition-all flex flex-col justify-between group min-h-[220px]"
            >
              {/* Top row: Company & Status Badge */}
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                      {job.company}
                    </span>
                    <h4 className="font-display font-extrabold text-base text-[var(--text-heading)] mt-0.5 leading-tight line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                      {job.role}
                    </h4>
                  </div>
                  <Badge className={`px-2.5 py-0.5 text-[9px] font-bold shrink-0 border ${badgeDetails.className}`}>
                    {badgeDetails.label}
                  </Badge>
                </div>

                {/* Subinfo */}
                <div className="flex items-center gap-3 mt-3 text-[10px] text-[var(--text-muted)]">
                  <span>Added: {job.dateApplied}</span>
                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--accent)] flex items-center gap-0.5"
                    >
                      Job Post
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                {/* Match Score section */}
                <div className="mt-4 pt-3 border-t border-black/5 flex items-center gap-3 justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                      AI Compatibility
                    </span>
                    {job.matchScore !== undefined ? (
                      <span className="text-sm font-extrabold text-[#16A34A] flex items-center gap-1 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/10" />
                        {job.matchScore}% Match
                      </span>
                    ) : (
                      <span className="text-[10px] text-[var(--text-muted)] italic block mt-0.5">
                        Not evaluated yet
                      </span>
                    )}
                  </div>

                  {job.matchScore !== undefined ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewAnalysisClick(job.id)}
                      className="text-[10px] px-3 py-1 font-semibold flex items-center gap-1"
                    >
                      View Report
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMatchClick(job)}
                      disabled={resumes.length === 0}
                      className="text-[10px] px-3 py-1 font-semibold flex items-center gap-1 border-blue-200 text-blue-600 hover:bg-blue-50/50"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Evaluate
                    </Button>
                  )}
                </div>
              </div>

              {/* Bottom row: Status dropdown & Delete */}
              <div className="mt-5 pt-3 border-t border-black/5 flex justify-between items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Status:
                  </span>
                  <select
                    value={job.status}
                    onChange={(e) => onUpdateJobStatus(job.id, e.target.value as JobApplication['status'])}
                    className="text-[10px] border border-black/10 rounded-lg px-2 py-1 bg-white text-[var(--text-body)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                  >
                    <option value="wishlist">Wishlist</option>
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offer">Offer Received</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditJobClick(job)}
                    className="p-1.5 rounded-lg border border-transparent hover:border-blue-100 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Edit Application"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteJob(job.id)}
                    className="p-1.5 rounded-lg border border-transparent hover:border-rose-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete Application"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredJobs.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-200 rounded-3xl bg-white shadow-sm">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h4 className="font-display font-extrabold text-base text-[var(--text-heading)] mb-1">
              No Applications Found
            </h4>
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
    </div>
  );
}
