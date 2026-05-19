export default function AnalyticsWidget({ compact = false }: { compact?: boolean }) {
  const bars = [
    { day: 'M', height: 40 },
    { day: 'T', height: 65 },
    { day: 'W', height: 45 },
    { day: 'T', height: 80 },
    { day: 'F', height: 55 },
    { day: 'S', height: 30 },
    { day: 'S', height: 20 },
  ];

  if (compact) {
    return (
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[9px] font-medium text-[var(--text-heading)]">This Week</div>
            <div className="text-lg font-bold text-[var(--accent)] font-display">12</div>
          </div>
          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] font-medium">
            +3 ↑
          </span>
        </div>
        <div className="flex items-end gap-1 h-8">
          {bars.map((bar, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-[var(--accent)]"
              style={{ height: `${bar.height * 0.3}%`, opacity: 0.3 + (bar.height / 100) * 0.7 }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs text-[var(--text-muted)]">Applications This Week</div>
          <div className="text-3xl font-bold text-[var(--text-heading)] font-display">12</div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#16A34A] font-medium">
          +3 from last week ↑
        </span>
      </div>
      <div className="flex items-end gap-2 h-28">
        {bars.map((bar, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-md bg-[var(--accent)] transition-all duration-300"
              style={{ height: `${bar.height}%`, opacity: 0.4 + (bar.height / 100) * 0.6 }}
            />
            <span className="text-[10px] text-[var(--text-muted)]">{bar.day}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-lg font-bold text-[var(--text-heading)] font-display">67%</div>
          <div className="text-[10px] text-[var(--text-muted)]">Response Rate</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[var(--accent)] font-display">4</div>
          <div className="text-[10px] text-[var(--text-muted)]">Interviews</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[#22C55E] font-display">1</div>
          <div className="text-[10px] text-[var(--text-muted)]">Offers</div>
        </div>
      </div>
    </div>
  );
}
