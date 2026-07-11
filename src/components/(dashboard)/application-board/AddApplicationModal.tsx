"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { backdropFade, modalSpringScale } from '@/utils/animations';
import Button from '../../ui/Button';
import type { JobApplication, Resume } from '../../../hooks/types';
import { useApplicationForm } from '../../../hooks/useApplicationForm';
import { useAnalysisStore } from '@/hooks/useAnalysisStore';
import { Loader2 } from 'lucide-react';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumes: Resume[];
  editingJob?: JobApplication | null;
  onSubmit: (jobData: {
    company: string;
    role: string;
    status: JobApplication['status'];
    url: string;
    jobDescription: string;
    selectedResumeId: string;
    customResumeContent: string;
    analyzeImmediately: boolean;
  }) => void;
}

export default function AddApplicationModal({
  isOpen,
  onClose,
  resumes,
  editingJob = null,
  onSubmit,
}: AddApplicationModalProps) {
  const {
    company, setCompany,
    role, setRole,
    status, setStatus,
    url, setUrl,
    jobDescription, setJobDescription,
    selectedResumeId,
    customResumeContent, setCustomResumeContent,
    analyzeImmediately, setAnalyzeImmediately,
    handleResumeTemplateChange,
    handleSubmit,
  } = useApplicationForm(isOpen, editingJob, resumes, onSubmit, onClose);
  const { isLoading } = useAnalysisStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...backdropFade}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            {...modalSpringScale}
            className={`bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] shadow-[var(--shadow-float)] w-full overflow-hidden flex flex-col max-h-[95vh] ${
              editingJob ? 'max-w-md' : 'max-w-7xl xl:max-w-[90vw]'
            }`}
          >
            {/* Modal Header */}
            <div className="py-4 px-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-page)]">
              <div>
                <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
                  {editingJob
                    ? 'Edit Job Application'
                    : 'Add New Job Application'}
                </h3>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                  {editingJob
                    ? 'Update basic application details, pipeline status, and target URL'
                    : 'Customize application details, edit resume highlights, and load job requirements side-by-side'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-[var(--text-muted)] hover:text-[var(--text-heading)] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Layout */}
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex-1 flex flex-col overflow-hidden text-xs">
              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className={`grid grid-cols-1 gap-5 ${editingJob ? '' : 'lg:grid-cols-3'}`}>
                  
                  {/* Column 1: Application Info */}
                  <div className={`space-y-3 pr-0 ${editingJob ? '' : 'lg:pr-4 lg:border-r border-[var(--border)]'}`}>
                    <h4 className="font-bold text-xs text-[var(--text-heading)] border-b pb-2 flex items-center gap-1.5 uppercase tracking-wider">
                      <span className="w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[10px] flex items-center justify-center">1</span>
                      Application Info
                    </h4>
                    
                    <div>
                      <label className="block font-semibold text-[var(--text-heading)] mb-1">Company (optional)</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Stripe"
                        className="w-full p-2.5 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] bg-[var(--input-bg)]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[var(--text-heading)] mb-1">Role / Title (optional)</label>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Senior Frontend Dev"
                        className="w-full p-2.5 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] bg-[var(--input-bg)]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[var(--text-heading)] mb-1">Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as JobApplication['status'])}
                        className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                      >
                        <option value="wishlist">Wishlist</option>
                        <option value="applied">Applied</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offer">Offer Received</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[var(--text-heading)] mb-1">Job Post URL (optional)</label>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/job"
                        className="w-full p-2.5 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] bg-[var(--input-bg)]"
                      />
                    </div>

                    {resumes.length > 0 && !editingJob && (
                      <div className="pt-2">
                        <label className="block font-semibold text-[var(--text-heading)] mb-1">Resume Template Link</label>
                        <select
                          value={selectedResumeId}
                          onChange={(e) => handleResumeTemplateChange(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                        >
                          <option value="">-- Choose Template --</option>
                          {resumes.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name} {r.isDefault ? '(Active Template)' : ''}
                            </option>
                          ))}
                        </select>
                        <span className="text-[10px] text-[var(--text-muted)] block mt-1 leading-normal">
                          Select a base template to populate Column 2, then tailor it specifically for this application.
                        </span>
                      </div>
                    )}
                  </div>

                  {!editingJob && (
                    <>
                      {/* Column 2: Resume Content (Tailorable) */}
                      <div className="space-y-3 pr-0 lg:pr-4 lg:border-r border-[var(--border)] flex flex-col">
                        <h4 className="font-bold text-xs text-[var(--text-heading)] border-b pb-2 flex items-center gap-1.5 uppercase tracking-wider">
                          <span className="w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[10px] flex items-center justify-center">2</span>
                          Tailored Resume
                        </h4>
                        <div className="flex-1 flex flex-col min-h-[380px] h-[48vh]">
                          <label className="block font-semibold text-[var(--text-heading)] mb-1">Your Highlights for this Job</label>
                          <textarea
                            value={customResumeContent}
                            onChange={(e) => setCustomResumeContent(e.target.value)}
                            placeholder="Highlight skills or project achievements matching the job description here..."
                            className="w-full p-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] font-mono text-[11px] leading-relaxed resize-none flex-1 min-h-[340px] bg-[var(--input-bg)]"
                          />
                        </div>
                      </div>

                      {/* Column 3: Job Description */}
                      <div className="space-y-3 flex flex-col">
                        <h4 className="font-bold text-xs text-[var(--text-heading)] border-b pb-2 flex items-center gap-1.5 uppercase tracking-wider">
                          <span className="w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[10px] flex items-center justify-center">3</span>
                          Job Description
                        </h4>
                        <div className="flex-1 flex flex-col min-h-[380px] h-[48vh]">
                          <label className="block font-semibold text-[var(--text-heading)] mb-1">Paste Job Requirements *</label>
                          <textarea
                            required={analyzeImmediately}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the core requirements or full job description here..."
                            className="w-full p-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] font-mono text-[11px] leading-relaxed resize-none flex-1 min-h-[340px] bg-[var(--input-bg)]"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom actions (Sticky/Fixed) */}
              <div className="flex justify-end gap-2 px-6 py-3 border-t border-[var(--border)] bg-[var(--bg-page)] shrink-0">
                <Button variant="outline" size="sm" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={(isLoading) || (!customResumeContent.trim() && analyzeImmediately)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Analyzing...
                    </>
                  ) : editingJob
                    ? 'Save Changes'
                    : 'Start AI Match'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
