import { motion } from 'framer-motion';
import { AlertTriangle, XCircle, Info, FileText } from 'lucide-react';
import type { AtsCheck } from '@/hooks/types';

interface AtsCheckProps {
  atsCheck?: AtsCheck;
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case 'error': return <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />;
    case 'warning': return <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />;
    case 'info': return <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />;
    default: return <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />;
  }
}

function getSeverityBadge(severity: string) {
  switch (severity) {
    case 'error': return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'info': return 'bg-blue-50 text-blue-700 border-blue-200';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
}

export default function AtsCheckComponent({ atsCheck }: AtsCheckProps) {
  if (!atsCheck) return null;

  const atsScore = atsCheck.score;
  const strokeColor = atsScore >= 80 ? '#22C55E' : atsScore >= 60 ? '#FACC15' : '#EF4444';

  return (
    <div className="bg-white rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-display font-extrabold text-sm text-[var(--text-heading)] mb-4 flex items-center gap-2">
        <FileText className="w-4.5 h-4.5 text-[var(--accent-cyan)]" />
        ATS Compatibility Check
      </h3>

      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#F1F5F9" strokeWidth="2.5" />
            <motion.circle
              cx="18" cy="18" r="15" fill="none"
              stroke={strokeColor}
              strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 15}
              initial={{ strokeDashoffset: 2 * Math.PI * 15 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 15 - (atsScore / 100) * 2 * Math.PI * 15 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-display font-extrabold text-[var(--text-heading)]">{atsScore}%</span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-[11px] text-[var(--text-body)] mb-3">{atsCheck.formatting}</p>
          <div className="space-y-1.5">
            {atsCheck.issues.map((issue, idx) => (
              <div key={idx} className="flex items-start gap-2">
                {getSeverityIcon(issue.severity)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full border font-semibold ${getSeverityBadge(issue.severity)}`}>
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--text-body)]">{issue.message}</p>
                  <p className="text-[9px] text-[var(--accent)] italic">{issue.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
