import { motion } from 'framer-motion';
import Button from '../ui/Button';
import type { JobApplication, Resume } from '../../hooks/types';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import ScoreRing from './ScoreRing';
import KeywordCoverage from './KeywordCoverage';
import StrengthsAndGaps from './StrengthsAndGaps';
import ResumeSuggestions from './ResumeSuggestions';
import InterviewPrepList from './InterviewPrepList';

interface MatchAnalysisDetailProps {
  job: JobApplication;
  resumes: Resume[];
  resumeForReRun?: Resume;
  expandedPrepIndex: number | null;
  onTogglePrepItem: (index: number) => void;
  onBackClick: () => void;
  onReRunAnalysis: (jobId: string, resumeContent: string, jobDesc: string) => void;
}

export default function MatchAnalysisDetail({
  job,
  resumes,
  resumeForReRun,
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
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between bg-white border border-[var(--border)] rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBackClick} className="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4 text-[var(--text-body)]" />
          </button>
          <div>
            <h2 className="font-display font-extrabold text-sm text-[var(--text-heading)] leading-none">{job.company}</h2>
            <span className="text-[10px] text-[var(--text-muted)] mt-1 block">{job.role} &bull; Match Analysis</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { if (resumeForReRun && job.jobDescription) onReRunAnalysis(job.id, resumeForReRun.content, job.jobDescription); }} className="flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            Re-run Analysis
          </Button>
          <Button variant="primary" size="sm" onClick={onBackClick}>Done View</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScoreRing score={result.score} fitLevel={result.fitLevel} />
        <div className="md:col-span-2 bg-white rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)] flex flex-col justify-center">
          <h3 className="font-display font-extrabold text-base text-[var(--text-heading)] mb-2">Match Assessment</h3>
          <p className="text-xs md:text-sm text-[var(--text-body)] leading-relaxed">{result.summary}</p>
        </div>
      </div>

      <KeywordCoverage matchedKeywords={result.matchedKeywords} missingKeywords={result.missingKeywords} />
      <StrengthsAndGaps strengths={result.strengths} gaps={result.gaps} />
      <ResumeSuggestions suggestions={result.suggestions} />
      <InterviewPrepList items={result.interviewPrep} expandedIndex={expandedPrepIndex} onToggle={onTogglePrepItem} />
    </motion.div>
  );
}
