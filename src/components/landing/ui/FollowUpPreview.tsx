import { AlertTriangle } from 'lucide-react';

export default function FollowUpPreview() {
  const jobs = [
    { name: 'Stripe — Product Manager', daysAgo: 8, urgent: true },
    { name: 'Figma — UX Designer', daysAgo: 5, urgent: true },
    { name: 'Vercel — Developer Advocate', daysAgo: 2, urgent: false },
  ];

  return (
    <div className="w-full p-4 space-y-2">
      {jobs.map((job, i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-[var(--bg-surface)] rounded-lg px-3 py-2.5 border border-[var(--border)] shadow-sm"
        >
          <div>
            <div className="text-xs font-medium text-[var(--text-heading)]">{job.name}</div>
            <div className="text-[10px] text-[var(--text-muted)]">Applied {job.daysAgo} days ago</div>
          </div>
          {job.urgent && (
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 font-semibold whitespace-nowrap flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              {job.daysAgo} days no update
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
