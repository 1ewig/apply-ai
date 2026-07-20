"use client";

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { JobApplication, Resume } from '@/types';
import { Trash2, Play, Search, ExternalLink, Pencil, Loader2 } from 'lucide-react';

function getStatusBadge(status: JobApplication['status']) {
  switch (status) {
    case 'wishlist':
      return { label: 'Wishlist', className: 'bg-[var(--bg-page)] text-[var(--text-heading)] border-[var(--border)]' };
    case 'applied':
      return { label: 'Applied', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
    case 'interviewing':
      return { label: 'Interviewing', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    case 'offer':
      return { label: 'Offer Received', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
    case 'rejected':
      return { label: 'Rejected', className: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };
  }
}

interface JobCardProps {
  job: JobApplication;
  isCurrentlyAnalyzing: boolean;
  onEditJobClick: (job: JobApplication) => void;
  onViewAnalysisClick: (jobId: string) => void;
  onUpdateJobStatus: (id: string, status: JobApplication['status']) => void;
  onDeleteJob: (id: string) => void;
}

export default function JobCard({
  job,
  isCurrentlyAnalyzing,
  onEditJobClick,
  onViewAnalysisClick,
  onUpdateJobStatus,
  onDeleteJob,
}: JobCardProps) {
  const badgeDetails = getStatusBadge(job.status);

  return (
    <Card className="p-5 border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-md transition-all flex flex-col justify-between group min-h-[220px]">
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

        <div className="flex items-center gap-3 mt-3 text-[10px] text-[var(--text-muted)]">
          <span>Added: {job.dateApplied}</span>
          {job.url && (
            <a href={job.url} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] flex items-center gap-0.5">
              Job Post
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center gap-3 justify-between">
          <div>
            <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              AI Compatibility
            </span>
            {isCurrentlyAnalyzing ? (
              <span className="text-[10px] text-[var(--accent)] font-semibold animate-pulse flex items-center gap-1 mt-0.5">
                Evaluating...
              </span>
            ) : job.matchScore !== undefined ? (
              <span className="text-sm font-extrabold text-emerald-600 flex items-center gap-1 mt-0.5">
                {job.matchScore}% Match
              </span>
            ) : (
              <span className="text-[10px] text-[var(--text-muted)] italic block mt-0.5">
                Not evaluated yet
              </span>
            )}
          </div>

          {isCurrentlyAnalyzing ? (
            <Button
              disabled
              variant="outline"
              size="sm"
              className="text-[10px] px-3 py-1 font-semibold flex items-center gap-1.5 border-[var(--accent)]/20 text-[var(--text-muted)] bg-[var(--bg-page)]"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent)]" />
              Evaluating...
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => onViewAnalysisClick(job.id)} className="text-[10px] px-3 py-1 font-semibold flex items-center gap-1">
              View Report
            </Button>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-[var(--border)] flex justify-between items-center gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Status:</span>
          <select
            value={job.status}
            onChange={(e) => onUpdateJobStatus(job.id, e.target.value as JobApplication['status'])}
            className="text-[10px] border border-[var(--border)] rounded-lg pl-2 pr-5 py-1 bg-[var(--bg-surface)] text-[var(--text-body)] focus:outline-none focus:border-[var(--accent)] cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 5px center',
              backgroundSize: '10px',
            }}
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
            className="p-1.5 rounded-lg border border-transparent hover:bg-[var(--bg-page)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            title="Edit Application"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteJob(job.id)}
            className="p-1.5 rounded-lg border border-transparent hover:bg-[var(--bg-page)] text-[var(--text-muted)] hover:text-rose-500 transition-colors cursor-pointer"
            title="Delete Application"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Card>
  );
}
