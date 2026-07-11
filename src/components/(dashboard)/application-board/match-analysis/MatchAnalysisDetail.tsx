"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { backdropFade, modalSpringScale, contentSlideUp, accordionExpand } from '@/utils/animations';
import Button from '@/components/ui/Button';
import type { JobApplication, Resume, ComparisonResult } from '@/types';
import { useApplications } from '@/hooks/useApplications';
import { 
  ArrowLeft, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Briefcase, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  BookOpen, 
  TrendingUp, 
  Check 
} from 'lucide-react';
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
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('summary');
  const [isSaving, setIsSaving] = useState(false);

  const { updateJob } = useApplications();

  const result = job.analysisResult;
  const canReRun = resumeForReRun && job.jobDescription;

  // Local state tracking
  const [wipResumeContent, setWipResumeContent] = useState('');
  const [acceptedIndexes, setAcceptedIndexes] = useState<Set<number>>(new Set());
  const [rejectedIndexes, setRejectedIndexes] = useState<Set<number>>(new Set());
  const [addedKeywords, setAddedKeywords] = useState<Set<string>>(new Set());
  const [showResumePreview, setShowResumePreview] = useState(false);

  // Sync state if job changes
  useEffect(() => {
    if (job) {
      setWipResumeContent(job.customResumeContent || resumeForReRun?.content || '');
      setAcceptedIndexes(new Set());
      setRejectedIndexes(new Set());
      setAddedKeywords(new Set());
    }
  }, [job, resumeForReRun]);

  if (!result) {
    return (
      <div className="text-center p-8 bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl">
        <p className="text-sm">No analysis result available for this job.</p>
        <Button variant="outline" size="sm" onClick={onBackClick} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  // Recalculate score and level dynamically on client
  const originalScore = result.score;
  const acceptedCount = acceptedIndexes.size;
  const keywordsCount = addedKeywords.size;
  const simulatedScore = Math.min(100, originalScore + (acceptedCount * 3) + (keywordsCount * 2));

  let simulatedFitLevel = result.fitLevel;
  if (simulatedScore >= 85) simulatedFitLevel = 'Excellent Match';
  else if (simulatedScore >= 70) simulatedFitLevel = 'Strong Match';
  else if (simulatedScore >= 50) simulatedFitLevel = 'Good Match';
  else if (simulatedScore >= 35) simulatedFitLevel = 'Fair Match';
  else simulatedFitLevel = 'Needs Work';

  const hasChanges = wipResumeContent.trim() !== (job.customResumeContent || resumeForReRun?.content || '').trim();

  // Handlers
  const handleAcceptSuggestion = (index: number, original: string, suggested: string) => {
    const normalizedWip = wipResumeContent.replace(/\r\n/g, '\n');
    const normalizedOriginal = original.replace(/\r\n/g, '\n');

    if (normalizedWip.includes(normalizedOriginal)) {
      setWipResumeContent(normalizedWip.replace(normalizedOriginal, suggested));
    }

    setAcceptedIndexes((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    setRejectedIndexes((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const handleRejectSuggestion = (index: number) => {
    setRejectedIndexes((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    setAcceptedIndexes((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const handleEditSuggestion = (index: number, editedText: string) => {
    const sug = result.suggestions[index];
    let content = wipResumeContent;

    if (content.includes(sug.original)) {
      content = content.replace(sug.original, editedText);
    } else if (content.includes(sug.suggested)) {
      content = content.replace(sug.suggested, editedText);
    }

    setWipResumeContent(content);
    setAcceptedIndexes((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    setRejectedIndexes((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const handleAddKeyword = (keyword: string) => {
    if (addedKeywords.has(keyword)) return;

    let updatedContent = wipResumeContent;
    const skillsRegex = /(skills|technologies|competencies|tools)/i;
    const lines = updatedContent.split('\n');
    let inserted = false;

    for (let i = 0; i < lines.length; i++) {
      if (skillsRegex.test(lines[i])) {
        lines[i] = lines[i] + `, ${keyword}`;
        updatedContent = lines.join('\n');
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      updatedContent = updatedContent + `\n\nSkills & Tools: ${keyword}`;
    }

    setWipResumeContent(updatedContent);
    setAddedKeywords((prev) => {
      const next = new Set(prev);
      next.add(keyword);
      return next;
    });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await updateJob(job.id, {
        customResumeContent: wipResumeContent,
        matchScore: simulatedScore,
      });
      setShowSaveSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setWipResumeContent(job.customResumeContent || resumeForReRun?.content || '');
    setAcceptedIndexes(new Set());
    setRejectedIndexes(new Set());
    setAddedKeywords(new Set());
  };

  const handleConfirmReRun = () => {
    setShowConfirm(false);
    if (canReRun) {
      onReRunAnalysis(job.id, wipResumeContent || resumeForReRun!.content, job.jobDescription!);
    }
  };

  const handleReRunFromSuccess = () => {
    setShowSaveSuccess(false);
    if (canReRun) {
      onReRunAnalysis(job.id, wipResumeContent, job.jobDescription!);
    }
  };

  const toggleAccordion = (name: string) => {
    setActiveAccordion(activeAccordion === name ? null : name);
  };

  return (
    <motion.div {...contentSlideUp} className="space-y-6 max-w-4xl mx-auto pb-24">
      {/* Header card */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBackClick}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-page)] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[var(--text-heading)]" />
            </button>
            <div className="min-w-0">
              <h2 className="font-display font-extrabold text-sm text-[var(--text-heading)] leading-none truncate">{job.company}</h2>
              <span className="text-[10px] text-[var(--text-muted)] mt-1 block truncate">{job.role} &bull; Tailoring Workspace</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowConfirm(true)} className="flex items-center gap-1.5 cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              Re-run AI Analysis
            </Button>
          </div>
        </div>
      </div>

      {/* Main Score Overview */}
      <div id="overview" className="scroll-mt-6">
        <ScoreBreakdown
          overallScore={simulatedScore}
          fitLevel={simulatedFitLevel}
          breakdown={result.scoreBreakdown}
        />
      </div>

      {/* Accordion Group */}
      <div className="border border-[var(--border)] rounded-3xl overflow-hidden bg-[var(--bg-surface)] shadow-[var(--shadow-card)]">
        
        {/* Accordion Item 1: Summary & Strengths */}
        <div>
          <button
            onClick={() => toggleAccordion('summary')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-[var(--bg-page)]/50 transition-colors border-b border-[var(--border)] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-sm text-[var(--text-heading)]">Summary & Fit Strengths</h4>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Read overall assessment and core professional strengths</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                {simulatedFitLevel}
              </span>
              {activeAccordion === 'summary' ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {activeAccordion === 'summary' && (
              <motion.div
                {...accordionExpand}
                className="overflow-hidden border-b border-[var(--border)] bg-[var(--bg-page)]/30 p-6 space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <h5 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Match Assessment</h5>
                    <p className="text-xs md:text-sm text-[var(--text-body)] leading-relaxed bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)]">{result.summary}</p>
                  </div>
                  <StrengthsAndGaps strengths={result.strengths} gaps={result.gaps} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion Item 2: Resume Wording Suggestions */}
        <div>
          <button
            onClick={() => toggleAccordion('wording')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-[var(--bg-page)]/50 transition-colors border-b border-[var(--border)] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-sm text-[var(--text-heading)]">Resume Suggestions</h4>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Optimize professional bullet points with interactive updates</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {acceptedCount > 0 ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                  {acceptedCount} Accepted
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold border border-amber-500/20">
                  {result.suggestions.length} Suggested
                </span>
              )}
              {activeAccordion === 'wording' ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {activeAccordion === 'wording' && (
              <motion.div
                {...accordionExpand}
                className="overflow-hidden border-b border-[var(--border)] bg-[var(--bg-page)]/30 p-6 space-y-6"
              >
                <ResumeSuggestions 
                  suggestions={result.suggestions}
                  acceptedIndexes={acceptedIndexes}
                  rejectedIndexes={rejectedIndexes}
                  onAccept={handleAcceptSuggestion}
                  onReject={handleRejectSuggestion}
                  onEdit={handleEditSuggestion}
                />

                {/* Local Resume Preview Toggle */}
                <div className="border border-[var(--border)] rounded-2xl bg-[var(--bg-surface)] p-4">
                  <button
                    onClick={() => setShowResumePreview(!showResumePreview)}
                    className="w-full flex items-center justify-between font-bold text-xs text-[var(--text-heading)] cursor-pointer"
                  >
                    <span>Tailored Resume Content Draft ({wipResumeContent.length} chars)</span>
                    {showResumePreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {showResumePreview && (
                      <motion.div {...accordionExpand} className="mt-3 overflow-hidden">
                        <textarea
                          value={wipResumeContent}
                          onChange={(e) => setWipResumeContent(e.target.value)}
                          className="w-full h-48 p-3 rounded-lg border border-[var(--border)] font-mono text-[10px] leading-relaxed bg-[var(--bg-page)] focus:outline-none focus:border-[var(--accent)] resize-y"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion Item 3: Keyword & ATS Check */}
        <div>
          <button
            onClick={() => toggleAccordion('keywords')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-[var(--bg-page)]/50 transition-colors border-b border-[var(--border)] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-sm text-[var(--text-heading)]">ATS Check & Keywords</h4>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Check ATS compliance score and append missing keywords</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {result.atsCheck && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 font-bold border border-cyan-500/20">
                  ATS: {result.atsCheck.score}%
                </span>
              )}
              {activeAccordion === 'keywords' ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {activeAccordion === 'keywords' && (
              <motion.div
                {...accordionExpand}
                className="overflow-hidden border-b border-[var(--border)] bg-[var(--bg-page)]/30 p-6 space-y-6"
              >
                <KeywordCoverage 
                  matchedKeywords={result.matchedKeywords}
                  missingKeywords={result.missingKeywords}
                  addedKeywords={addedKeywords}
                  onAddKeyword={handleAddKeyword}
                />

                {result.structureSuggestions && result.structureSuggestions.length > 0 && (
                  <StructureSuggestions suggestions={result.structureSuggestions} />
                )}

                {result.atsCheck && (
                  <ATSCheck atsCheck={result.atsCheck} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion Item 4: Action Roadmap */}
        <div>
          <button
            onClick={() => toggleAccordion('roadmap')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-[var(--bg-page)]/50 transition-colors border-b border-[var(--border)] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-sm text-[var(--text-heading)]">Action Roadmap & Diff</h4>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Explore action milestones and version differences</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {previousAnalysisResult && (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 font-bold border border-violet-500/20">
                  Diff Active
                </span>
              )}
              {activeAccordion === 'roadmap' ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {activeAccordion === 'roadmap' && (
              <motion.div
                {...accordionExpand}
                className="overflow-hidden border-b border-[var(--border)] bg-[var(--bg-page)]/30 p-6 space-y-6"
              >
                {result.actionItems && result.actionItems.length > 0 && (
                  <ActionItems items={result.actionItems} />
                )}

                {result.skillRecommendations && result.skillRecommendations.length > 0 && (
                  <SkillRoadmap recommendations={result.skillRecommendations} />
                )}

                {previousAnalysisResult && (
                  <AnalysisDiff previous={previousAnalysisResult} current={result} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion Item 5: Interview Prep & Cover Letter */}
        <div>
          <button
            onClick={() => toggleAccordion('interview')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-[var(--bg-page)]/50 transition-colors last:border-b-0 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-sm text-[var(--text-heading)]">Interview Prep & Cover Letter</h4>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Review role-specific interview coaching and cover letter draft</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {activeAccordion === 'interview' ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {activeAccordion === 'interview' && (
              <motion.div
                {...accordionExpand}
                className="overflow-hidden bg-[var(--bg-page)]/30 p-6 space-y-6"
              >
                <InterviewPrepList items={result.interviewPrep} expandedIndex={expandedPrepIndex} onToggle={onTogglePrepItem} />
                
                {result.coverLetterDraft && (
                  <CoverLetterDraft draft={result.coverLetterDraft} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Floating Action Banner */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[var(--bg-surface)] border border-[var(--border)] shadow-[var(--shadow-float)] rounded-2xl p-4 flex items-center justify-between gap-6 max-w-lg w-full animate-fade-up">
          <div className="text-left">
            <h4 className="text-xs font-bold text-[var(--text-heading)]">Unsaved Changes</h4>
            <p className="text-[9px] text-[var(--text-muted)]">You optimized wording/skills. Save them to update your resume.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDiscardChanges} className="cursor-pointer">
              Discard
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveChanges} disabled={isSaving} className="cursor-pointer">
              {isSaving ? 'Saving...' : 'Save Tailored Resume'}
            </Button>
          </div>
        </div>
      )}

      {/* Re-run Confirm Modal */}
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
              className="relative bg-[var(--bg-surface)] rounded-3xl p-6 max-w-sm w-full shadow-[var(--shadow-float)]"
            >
              <h3 className="font-display font-extrabold text-base text-[var(--text-heading)] mb-2">Re-run Match Analysis?</h3>
              <p className="text-xs text-[var(--text-body)] mb-6">
                {canReRun
                  ? 'This will launch the AI matching agent to generate a fresh analysis report. Are you sure?'
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

      {/* Save Success Modal */}
      <AnimatePresence>
        {showSaveSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              {...backdropFade}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowSaveSuccess(false)}
            />
            <motion.div
              {...modalSpringScale}
              className="relative bg-[var(--bg-surface)] rounded-3xl p-6 max-w-md w-full shadow-[var(--shadow-float)] text-center"
            >
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-base text-[var(--text-heading)] mb-2">Changes Saved Successfully!</h3>
              <p className="text-xs text-[var(--text-body)] mb-6">
                Your tailored resume wording is saved. Would you like to run a verified AI analysis now to update your official score?
              </p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowSaveSuccess(false)}>
                  Close
                </Button>
                <Button variant="primary" size="sm" onClick={handleReRunFromSuccess}>
                  Re-run AI Match
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
