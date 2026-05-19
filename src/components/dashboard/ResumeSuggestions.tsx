interface Suggestion {
  section: string;
  original: string;
  suggested: string;
  rationale: string;
}

interface ResumeSuggestionsProps {
  suggestions: Suggestion[];
}

export default function ResumeSuggestions({ suggestions }: ResumeSuggestionsProps) {
  return (
    <div className="bg-white rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-display font-extrabold text-sm text-[var(--text-heading)] mb-1">
        Tailored Resume Enhancements
      </h3>
      <p className="text-[10px] text-[var(--text-muted)] mb-4">
        Integrate these suggested rewrites into your resume when applying for this role.
      </p>
      <div className="space-y-4">
        {suggestions.map((sug, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
            <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-wider block">{sug.section}</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-lg">
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wider block mb-1">Original</span>
                <p className="text-[11px] text-rose-800 italic">"{sug.original}"</p>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">Suggested Rewrite</span>
                <p className="text-[11px] text-emerald-900 font-medium">"{sug.suggested}"</p>
              </div>
            </div>
            <div className="text-[11px] text-[var(--text-body)]">
              <span className="font-bold text-[var(--text-heading)]">Why:</span> {sug.rationale}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
