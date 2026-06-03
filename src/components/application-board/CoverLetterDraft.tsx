import { Copy, Sparkles, Check } from 'lucide-react';
import { useState } from 'react';

interface CoverLetterDraftProps {
  draft: string;
}

export default function CoverLetterDraft({ draft }: CoverLetterDraftProps) {
  const [copied, setCopied] = useState(false);

  if (!draft || !draft.trim()) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-display font-extrabold text-sm text-[var(--text-heading)] flex items-center gap-2">
          <Sparkles className="w-4.5 h-4.5 text-[var(--accent)]" />
          Tailored Cover Letter Draft
        </h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] font-semibold text-[var(--accent)] hover:text-blue-700 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-[var(--accent)]/10 cursor-pointer"
        >
          {copied ? (
            <><Check className="w-3.5 h-3.5" /> Copied</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Copy</>
          )}
        </button>
      </div>
      <div className="p-4 rounded-xl bg-[var(--bg-page)] border border-[var(--border)]">
        <p className="text-[11px] text-[var(--text-body)] leading-relaxed whitespace-pre-line">{draft}</p>
      </div>
    </div>
  );
}
