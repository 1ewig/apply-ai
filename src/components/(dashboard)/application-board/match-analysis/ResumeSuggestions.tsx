import { useState } from 'react';
import { Check, X, Edit3, Save, RotateCcw } from 'lucide-react';

interface Suggestion {
  section: string;
  original: string;
  suggested: string;
  rationale: string;
}

interface ResumeSuggestionsProps {
  suggestions: Suggestion[];
  acceptedIndexes: Set<number>;
  rejectedIndexes: Set<number>;
  onAccept: (index: number, original: string, suggested: string) => void;
  onReject: (index: number) => void;
  onEdit: (index: number, editedText: string) => void;
}

export default function ResumeSuggestions({
  suggestions,
  acceptedIndexes,
  rejectedIndexes,
  onAccept,
  onReject,
  onEdit,
}: ResumeSuggestionsProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const handleStartEdit = (idx: number, suggested: string) => {
    setEditingIndex(idx);
    setEditText(suggested);
  };

  const handleSaveEdit = (idx: number) => {
    onEdit(idx, editText);
    setEditingIndex(null);
  };

  return (
    <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-display font-extrabold text-sm text-[var(--text-heading)] mb-1">
        Tailored Resume Enhancements
      </h3>
      <p className="text-[10px] text-[var(--text-muted)] mb-4">
        Integrate these suggested rewrites into your resume when applying for this role.
      </p>
      <div className="space-y-4">
        {suggestions.map((sug, idx) => {
          const isAccepted = acceptedIndexes.has(idx);
          const isRejected = rejectedIndexes.has(idx);
          const isEditing = editingIndex === idx;

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl bg-[var(--bg-page)] border transition-all duration-200 space-y-3 ${
                isAccepted
                  ? 'border-emerald-500 bg-emerald-500/5'
                  : isRejected
                  ? 'border-[var(--border)] opacity-60'
                  : 'border-[var(--border)]'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-wider block">
                  {sug.section}
                </span>
                <div className="flex gap-1">
                  {!isAccepted && !isRejected && !isEditing && (
                    <>
                      <button
                        onClick={() => handleStartEdit(idx, sug.suggested)}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors cursor-pointer"
                        title="Edit wording"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onReject(idx)}
                        className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors cursor-pointer"
                        title="Reject suggestion"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onAccept(idx, sug.original, sug.suggested)}
                        className="p-1 rounded-lg hover:bg-emerald-500/10 text-emerald-600 transition-colors cursor-pointer"
                        title="Accept suggestion"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {(isAccepted || isRejected) && (
                    <button
                      onClick={() => {
                        // Undo action
                        onReject(idx); // sets it back to rejected, wait, we can undo by calling parent to clear
                        onEdit(idx, sug.suggested); // Reset text back if we want
                      }}
                      className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors cursor-pointer"
                      title="Undo action"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                  <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wider block mb-1">Original</span>
                  <p className="text-[11px] text-rose-600 italic">"{sug.original}"</p>
                </div>
                
                <div className={`p-2.5 border rounded-lg ${isAccepted ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-500/5 border-emerald-500/10'}`}>
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">Suggested Rewrite</span>
                  {isEditing ? (
                    <div className="space-y-2 mt-1">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2 border border-[var(--border)] rounded-md font-mono text-[10px] leading-relaxed bg-[var(--bg-surface)] focus:outline-none focus:border-[var(--accent)]"
                        rows={3}
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="px-2 py-1 text-[9px] font-bold border rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(idx)}
                          className="px-2 py-1 text-[9px] font-bold bg-[var(--accent)] text-white rounded-md hover:scale-105 transition-transform flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-3 h-3" /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-emerald-600 font-medium">"{sug.suggested}"</p>
                  )}
                </div>
              </div>
              <div className="text-[11px] text-[var(--text-body)]">
                <span className="font-bold text-[var(--text-heading)]">Why:</span> {sug.rationale}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

