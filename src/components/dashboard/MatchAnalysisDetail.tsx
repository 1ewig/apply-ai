import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { JobApplication, Resume } from '../../hooks/useStore';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MatchAnalysisDetailProps {
  job: JobApplication;
  resumes: Resume[];
  expandedPrepIndex: number | null;
  onTogglePrepItem: (index: number) => void;
  onBackClick: () => void;
  onReRunAnalysis: (jobId: string, resumeContent: string, jobDesc: string) => void;
}

function getScoreStroke(score: number) {
  if (score >= 85) return '#22C55E';
  if (score >= 70) return '#2563EB';
  if (score >= 50) return '#FACC15';
  return '#EF4444';
}

export default function MatchAnalysisDetail({
  job,
  resumes,
  expandedPrepIndex,
  onTogglePrepItem,
  onBackClick,
  onReRunAnalysis,
}: MatchAnalysisDetailProps) {

  if (!job.analysisResult) {
    return (
      <div className="text-center p-8 bg-white border border-[var(--border)] rounded-3xl">
        <p className="text-sm">No analysis result available for this job.</p>
        <Button variant="outline" size="sm" onClick={onBackClick} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const result = job.analysisResult;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Back header */}
      <div className="flex items-center justify-between bg-white border border-[var(--border)] rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackClick}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--text-body)]" />
          </button>
          <div>
            <h2 className="font-display font-extrabold text-sm text-[var(--text-heading)] leading-none">
              {job.company}
            </h2>
            <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
              {job.role} &bull; Match Analysis
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const resume = resumes.find(r => r.id === job.resumeUsed) || resumes.find(r => r.isDefault) || resumes[0];
              if (resume && job.jobDescription) {
                onReRunAnalysis(job.id, resume.content, job.jobDescription);
              }
            }}
            className="flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Re-run Analysis
          </Button>
          <Button variant="primary" size="sm" onClick={onBackClick}>
            Done View
          </Button>
        </div>
      </div>

      {/* Executive Match Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score */}
        <div className="bg-white rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)] flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#F1F5F9" strokeWidth="2.5" />
              <motion.circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke={getScoreStroke(result.score)}
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: `${result.score * 0.942}, 100` }}
                transition={{ duration: 1.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-display font-extrabold text-[var(--text-heading)]">
                {result.score}%
              </span>
              <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Match Score
              </span>
            </div>
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[10px] font-bold text-[var(--accent)]">
            {result.fitLevel}
          </div>
        </div>

        {/* Summary */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)] flex flex-col justify-center">
          <h3 className="font-display font-extrabold text-base text-[var(--text-heading)] mb-2">
            Match Assessment
          </h3>
          <p className="text-xs md:text-sm text-[var(--text-body)] leading-relaxed">
            {result.summary}
          </p>
        </div>
      </div>

      {/* Keyword Coverage */}
      <div className="bg-white rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
        <h3 className="font-display font-extrabold text-sm text-[var(--text-heading)] mb-4 flex items-center gap-2">
          <FileSpreadsheet className="w-4.5 h-4.5 text-[var(--accent-cyan)]" />
          Keyword Coverage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
              Matched Keywords ({result.matchedKeywords.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {result.matchedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  {kw}
                </span>
              ))}
              {result.matchedKeywords.length === 0 && (
                <span className="text-xs text-[var(--text-muted)] italic">No matches detected.</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
              Missing Keywords ({result.missingKeywords.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {result.missingKeywords.map((kw) => (
                <span
                  key={kw}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-100 flex items-center gap-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
                  {kw}
                </span>
              ))}
              {result.missingKeywords.length === 0 && (
                <span className="text-xs text-[var(--text-muted)] italic">No missing keywords! Excellent coverage.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
          <h3 className="font-display font-extrabold text-sm text-[#16A34A] mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5" />
            Key Strengths
          </h3>
          <ul className="space-y-2">
            {result.strengths.map((str, idx) => (
              <li key={idx} className="text-xs text-[var(--text-body)] flex items-start gap-2 leading-relaxed">
                <div className="w-1 h-1 rounded-full bg-[#16A34A] mt-2 shrink-0"></div>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
          <h3 className="font-display font-extrabold text-sm text-[#EF4444] mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4.5 h-4.5" />
            Major Gaps
          </h3>
          <ul className="space-y-2">
            {result.gaps.map((gap, idx) => (
              <li key={idx} className="text-xs text-[var(--text-body)] flex items-start gap-2 leading-relaxed">
                <div className="w-1 h-1 rounded-full bg-[#EF4444] mt-2 shrink-0"></div>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Resume Enhancements */}
      <div className="bg-white rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
        <h3 className="font-display font-extrabold text-sm text-[var(--text-heading)] mb-1">
          Tailored Resume Enhancements
        </h3>
        <p className="text-[10px] text-[var(--text-muted)] mb-4">
          Integrate these suggested rewrites into your resume when applying for this role.
        </p>
        <div className="space-y-4">
          {result.suggestions.map((sug, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-wider block">
                {sug.section}
              </span>
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

      {/* Interview Preparation */}
      <div className="bg-white rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
        <h3 className="font-display font-extrabold text-sm text-[var(--text-heading)] mb-1 flex items-center gap-2">
          <HelpCircle className="w-4.5 h-4.5 text-[var(--accent)]" />
          Targeted Interview Prep
        </h3>
        <p className="text-[10px] text-[var(--text-muted)] mb-4">
          Anticipate and prepare for questions recruiters might ask based on your resume gaps.
        </p>
        <div className="space-y-2">
          {result.interviewPrep.map((prep, idx) => {
            const isExpanded = expandedPrepIndex === idx;
            return (
              <div key={idx} className="border border-[var(--border)] rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => onTogglePrepItem(idx)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-xs text-[var(--text-heading)] hover:bg-[var(--bg-page)] transition-colors cursor-pointer"
                >
                  <span>{prep.question}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  )}
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-[var(--border)] bg-slate-50"
                    >
                      <div className="p-4 text-[11px] text-[var(--text-body)] leading-relaxed">
                        <span className="font-bold text-[var(--text-heading)] block mb-1 text-[9px] uppercase tracking-wider">
                          Suggested Response Strategy
                        </span>
                        {prep.strategy}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
