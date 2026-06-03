import { Send } from 'lucide-react';

export default function OutreachPreview() {
  return (
    <div className="w-full p-4 space-y-3">
      <div className="bg-[var(--bg-surface)] rounded-lg border border-[var(--border)] overflow-hidden shadow-sm">
        <div className="bg-[var(--bg-page)] px-3 py-1.5 border-b border-[var(--border)] flex items-center gap-1.5 text-[9px] text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-heading)]">To:</span> recruiter@figma.com
        </div>
        <div className="bg-[var(--bg-page)] px-3 py-1.5 border-b border-[var(--border)] flex items-center gap-1.5 text-[9px] text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-heading)]">Subject:</span> PM Application — Jordan Lee
        </div>
        <div className="p-3 text-[9px] space-y-1 text-[var(--text-body)] font-mono leading-relaxed bg-[var(--input-bg)]">
          <div>Hi Sarah,</div>
          <div>
            Loved Figma's recent launch! I built a design-to-code tool matching your specs...
          </div>
          <div className="h-4 w-2/3 bg-[var(--progress-track)] animate-pulse rounded" />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <span className="text-[9px] px-2.5 py-1 rounded-full bg-[var(--bg-page)] text-[var(--text-muted)] font-medium cursor-default">
          Draft Cover Letter
        </span>
        <span className="text-[9px] px-2.5 py-1 rounded-full bg-[var(--accent)] text-white font-semibold flex items-center gap-1 shadow-sm cursor-default hover:bg-[var(--accent)]/95">
          <Send className="w-2.5 h-2.5" /> Send Outreach
        </span>
      </div>
    </div>
  );
}
