import Card from '../ui/Card';
import Badge from '../ui/Badge';
import type { Resume } from '../../hooks/types';
import { FileText, Edit, Trash2 } from 'lucide-react';

interface ResumeCardProps {
  resume: Resume;
  onEditResumeClick: (resume: Resume) => void;
  onDeleteResume: (id: string) => void;
  onSetDefaultResume: (id: string) => void;
}

export default function ResumeCard({ resume, onEditResumeClick, onDeleteResume, onSetDefaultResume }: ResumeCardProps) {
  return (
    <Card className="p-5 border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-md transition-all flex flex-col justify-between min-h-[220px]">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-[var(--accent)]" />
            <h4 className="font-display font-extrabold text-sm text-[var(--text-heading)] leading-tight line-clamp-1">{resume.name}</h4>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => onEditResumeClick(resume)} className="p-1 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer" title="Edit Resume">
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDeleteResume(resume.id)} className="p-1 text-[var(--text-muted)] hover:text-rose-500 transition-colors cursor-pointer" title="Delete Template">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 items-center mb-4">
          <span className="text-[9px] text-[var(--text-muted)]">Updated: {resume.updatedAt}</span>
          {resume.isDefault ? (
            <Badge className="px-2 py-0.2 text-[8px] font-bold bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active Template</Badge>
          ) : (
            <button onClick={() => onSetDefaultResume(resume.id)} className="text-[8px] font-bold text-[var(--accent)] hover:underline cursor-pointer">Set Active</button>
          )}
        </div>

        <p className="text-[11px] text-[var(--text-body)] line-clamp-4 font-mono bg-[var(--bg-page)] p-2 rounded-lg leading-relaxed border border-[var(--border)]">
          {resume.content}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border)] text-[10px] text-[var(--text-muted)] flex justify-between items-center">
        <span>{resume.content.split(/\s+/).filter(Boolean).length} words</span>
        <span>{resume.content.length} chars</span>
      </div>
    </Card>
  );
}
