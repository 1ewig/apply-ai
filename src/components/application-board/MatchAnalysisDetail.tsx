"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { backdropFade, modalSpringScale, contentSlideUp } from '@/utils/animations';
import Button from '../ui/Button';
import type { JobApplication, Resume, ComparisonResult } from '../../hooks/types';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import ScoreRing from './ScoreRing';
import ScoreBreakdown from './ScoreBreakdown';
import KeywordCoverage from './KeywordCoverage';
import StrengthsAndGaps from './StrengthsAndGaps';
import ResumeSuggestions from './ResumeSuggestions';
import StructureSuggestions from './StructureSuggestions';
import InterviewPrepList from './InterviewPrepList';
import CoverLetterDraft from './CoverLetterDraft';
import SkillRoadmap from './SkillRoadmap';
import ActionItems from './ActionItems';
import ATSCheck from './ATSCheck';
import AnalysisDiff from './AnalysisDiff';

interface MatchAnalysisDetailProps {
  job: JobApplication;
  previousAnalysisResult?: ComparisonResult;
  resumes: Resume[];
  resumeForReRun?: Resume;
  expandedPrepIndex: number | null;
  onTogglePrepItem: (index: number) => void;
  onBackClick: () => void;
  onReRunAnalysis: (jobId: string, resumeContent: string, jobDesc: string) => void;
}

export default function MatchAnalysisDetail({
  job,
  previousAnalysisResult,
  resumes,
  resumeForReRun,
  expandedPrepIndex,
  onTogglePrepItem,
  onBackClick,
  onReRunAnalysis,
}: MatchAnalysisDetailProps) {
  const [showConfirm, setShowConfirm] = useState(false);

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

  const canReRun = resumeForReRun && job.jobDescription;

  const handleConfirmReRun = () => {
    setShowConfirm(false);
    if (canReRun) {
      onReRunAnalysis(job.id, resumeForReRun!.content, job.jobDescription!);
    }
  };

  return (
    <motion.div {...contentSlideUp} className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-[var(--border)] rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackClick}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[var(--text-muted)]" />
            </button>
            <div className="min-w-0">
              <h2 className="font-display font-extrabold text-sm text-[var(--text-heading)] leading-none truncate">{job.company}</h2>
              <span className="text-[10px] text-[var(--text-muted)] mt-1 block truncate">{job.role} &bull; Match Analysis</span>
            </div>
          </div>

          <div className="hidden sm:flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowConfirm(true)} className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              Re-run Analysis
            </Button>
          </div>
        </div>
      </div>

      <div id="overview" className="scroll-mt-6">
        <ScoreBreakdown
          overallScore={result.score}
          fitLevel={result.fitLevel}
          breakdown={result.scoreBreakdown}
        />
      </div>

      <div id="summary" className="scroll-mt-6">
        <div className="bg-white rounded-3xl border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
          <h3 className="font-display font-extrabold text-base text-[var(--text-heading)] mb-2">Match Assessment</h3>
          <p className="text-xs md:text-sm text-[var(--text-body)] leading-relaxed">{result.summary}</p>
        </div>
      </div>

      <div id="keywords" className="scroll-mt-6">
        <KeywordCoverage matchedKeywords={result.matchedKeywords} missingKeywords={result.missingKeywords} />
      </div>

      <div id="strengths" className="scroll-mt-6">
        <StrengthsAndGaps strengths={result.strengths} gaps={result.gaps} />
      </div>

      {result.structureSuggestions && result.structureSuggestions.length > 0 && (
        <div id="structure" className="scroll-mt-6">
          <StructureSuggestions suggestions={result.structureSuggestions} />
        </div>
      )}

      {result.skillRecommendations && result.skillRecommendations.length > 0 && (
        <div id="roadmap" className="scroll-mt-6">
          <SkillRoadmap recommendations={result.skillRecommendations} />
        </div>
      )}

      {result.atsCheck && (
        <div id="ats" className="scroll-mt-6">
          <ATSCheck atsCheck={result.atsCheck} />
        </div>
      )}

      {result.actionItems && result.actionItems.length > 0 && (
        <div id="actions" className="scroll-mt-6">
          <ActionItems items={result.actionItems} />
        </div>
      )}

      {previousAnalysisResult && (
        <div id="diff" className="scroll-mt-6">
          <AnalysisDiff previous={previousAnalysisResult} current={result} />
        </div>
      )}

      <div id="suggestions" className="scroll-mt-6">
        <ResumeSuggestions suggestions={result.suggestions} />
      </div>

      {result.coverLetterDraft && (
        <div id="cover-letter" className="scroll-mt-6">
          <CoverLetterDraft draft={result.coverLetterDraft} />
        </div>
      )}

      <div id="interview" className="scroll-mt-6">
        <InterviewPrepList items={result.interviewPrep} expandedIndex={expandedPrepIndex} onToggle={onTogglePrepItem} />
      </div>

      <button
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-6 right-6 md:hidden z-30 w-14 h-14 rounded-full bg-[var(--accent)] text-white shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
      >
        <RotateCcw className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              {...backdropFade}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowConfirm(false)}
            />
            <motion.div
              {...modalSpringScale}
              className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-[var(--shadow-float)]"
            >
              <h3 className="font-display font-extrabold text-base text-[var(--text-heading)] mb-2">Re-run Analysis?</h3>
              <p className="text-xs text-[var(--text-body)] mb-6">
                {canReRun
                  ? 'This will overwrite the current analysis result. Are you sure?'
                  : 'Add a job description and select a resume to enable re-analysis.'}
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowConfirm(false)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleConfirmReRun} disabled={!canReRun}>
                  Re-run
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
