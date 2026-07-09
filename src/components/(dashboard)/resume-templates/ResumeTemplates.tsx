import Button from '../../ui/Button';
import type { Resume } from '../../../hooks/types';
import { Plus, FileText } from 'lucide-react';
import ResumeCard from './ResumeCard';

interface ResumeTemplatesProps {
  resumes: Resume[];
  onAddResumeClick: () => void;
  onEditResumeClick: (resume: Resume) => void;
  onDeleteResume: (id: string) => void;
  onSetDefaultResume: (id: string) => void;
}

export default function ResumeTemplates({
  resumes,
  onAddResumeClick,
  onEditResumeClick,
  onDeleteResume,
  onSetDefaultResume,
}: ResumeTemplatesProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="text-center sm:text-left">
          <h2 className="font-display font-extrabold text-xl md:text-2xl text-[var(--text-heading)]">Resume Templates</h2>
          <p className="text-xs text-[var(--text-muted)]">Store and edit resumes to use during job matches</p>
        </div>
        <Button variant="primary" size="md" onClick={onAddResumeClick} className="hidden sm:flex items-center gap-1.5 shadow-md text-xs">
          <Plus className="w-3.5 h-3.5" />
          Add Resume
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <ResumeCard
            key={resume.id}
            resume={resume}
            onEditResumeClick={onEditResumeClick}
            onDeleteResume={onDeleteResume}
            onSetDefaultResume={onSetDefaultResume}
          />
        ))}

        {resumes.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed border-[var(--border)] rounded-3xl bg-[var(--bg-surface)] shadow-sm">
            <FileText className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
            <h4 className="font-display font-extrabold text-base text-[var(--text-heading)] mb-1">No Resumes Found</h4>
            <p className="text-xs text-[var(--text-muted)] mb-6 max-w-xs mx-auto">
              Please add at least one Resume template to use for job matches and enhancements.
            </p>
            <Button variant="primary" size="sm" onClick={onAddResumeClick}>
              Add Your First Resume
            </Button>
          </div>
        )}
      </div>

      <button
        onClick={onAddResumeClick}
        className="fixed bottom-6 right-6 md:hidden z-30 w-14 h-14 rounded-full bg-[var(--accent)] text-white shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
