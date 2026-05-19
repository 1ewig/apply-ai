import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Resume } from '../../hooks/useStore';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-[var(--text-heading)]">Resume Templates</h2>
          <p className="text-xs text-[var(--text-muted)]">Store and edit resumes to use during job matches</p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={onAddResumeClick}
          className="flex items-center gap-1.5 shadow-md text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Resume
        </Button>
      </div>

      {/* Resumes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <Card
            key={resume.id}
            className="p-5 border border-black/5 hover:border-[var(--accent)] hover:shadow-md transition-all flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-[var(--accent)]" />
                  <h4 className="font-display font-extrabold text-sm text-[var(--text-heading)] leading-tight line-clamp-1">
                    {resume.name}
                  </h4>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => onEditResumeClick(resume)}
                    className="p-1 text-slate-400 hover:text-[var(--accent)] transition-colors cursor-pointer"
                    title="Edit Resume"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteResume(resume.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Delete Template"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 items-center mb-4">
                <span className="text-[9px] text-[var(--text-muted)]">
                  Updated: {resume.updatedAt}
                </span>
                {resume.isDefault ? (
                  <Badge className="px-2 py-0.2 text-[8px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200">
                    Active Template
                  </Badge>
                ) : (
                  <button
                    onClick={() => onSetDefaultResume(resume.id)}
                    className="text-[8px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Set Active
                  </button>
                )}
              </div>

              <p className="text-[11px] text-[var(--text-body)] line-clamp-4 font-mono bg-slate-50 p-2 rounded-lg leading-relaxed border border-slate-100">
                {resume.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-black/5 text-[10px] text-[var(--text-muted)] flex justify-between items-center">
              <span>{resume.content.split(/\s+/).filter(Boolean).length} words</span>
              <span>{resume.content.length} chars</span>
            </div>
          </Card>
        ))}

        {resumes.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-200 rounded-3xl bg-white shadow-sm">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
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
    </div>
  );
}
