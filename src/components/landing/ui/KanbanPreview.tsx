export default function KanbanPreview({ compact = false }: { compact?: boolean }) {
  const columns = [
    { title: 'Saved', color: '#94A3B8', cards: ['Google PM', 'Meta SWE'] },
    { title: 'Applied', color: '#2563EB', cards: ['Stripe PM', 'Figma Design'] },
    { title: 'Interview', color: '#06B6D4', cards: ['Notion SWE'] },
    { title: 'Offer', color: '#22C55E', cards: ['Vercel DX'] },
  ];

  if (compact) {
    return (
      <div className="flex gap-2 p-3">
        {columns.map((col) => (
          <div key={col.title} className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
              <span className="text-[9px] font-medium text-[var(--text-muted)] truncate">
                {col.title}
              </span>
            </div>
            <div className="space-y-1.5">
              {col.cards.map((card) => (
                <div
                  key={card}
                  className="bg-[var(--bg-page)] rounded-md px-2 py-1.5 text-[8px] text-[var(--text-body)] border border-[var(--border)] truncate"
                >
                  {card}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 p-4 w-full">
      {columns.map((col) => (
        <div key={col.title} className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: col.color }} />
            <span className="text-xs font-medium text-[var(--text-heading)]">
              {col.title}
            </span>
            <span className="text-[10px] bg-[var(--bg-page)] px-1.5 py-0.5 rounded-full text-[var(--text-muted)]">
              {col.cards.length}
            </span>
          </div>
          <div className="space-y-2">
            {col.cards.map((card) => (
              <div
                key={card}
                className="bg-[var(--bg-surface)] rounded-lg px-3 py-2.5 text-xs text-[var(--text-body)] border border-[var(--border)] shadow-sm"
              >
                <div className="font-medium text-[var(--text-heading)] mb-1">{card}</div>
                <div className="flex gap-1">
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full"
                    style={{ background: col.color + '15', color: col.color }}
                  >
                    {col.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
