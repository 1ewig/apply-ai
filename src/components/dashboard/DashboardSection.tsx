import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useStore, JobApplication, Resume } from '../../hooks/useStore';
import Sidebar from './Sidebar';
import ApplicationsBoard from './ApplicationsBoard';
import ResumeTemplates from './ResumeTemplates';
import MatchAnalysisDetail from './MatchAnalysisDetail';
import AddApplicationModal from './AddApplicationModal';
import { Sparkle, AlertTriangle } from 'lucide-react';

const LOADING_PHASES = [
  'Initializing ApplyAI secure analyzer...',
  'Parsing resume structure and key sections...',
  'Extracting technical skills and core competencies...',
  'Analyzing job description requirements...',
  'Calculating semantic match and keywords coverage...',
  'Generating optimized resume bullets and suggestions...',
  'Formulating targeted interview prep strategy...',
];

export default function DashboardSection({ onBack }: { onBack: () => void }) {
  const { activeTab, setActiveTab } = useStore();

  // Convex Reactive Queries
  const jobsRaw = useQuery(api.applications.list) || [];
  const jobs = jobsRaw.map((j) => ({ ...j, id: j._id })) as JobApplication[];

  const resumesRaw = useQuery(api.resumes.list) || [];
  const resumes = resumesRaw.map((r) => ({ ...r, id: r._id })) as Resume[];

  // Convex Mutations
  const convexAddJob = useMutation(api.applications.add);
  const convexUpdateJob = useMutation(api.applications.update);
  const convexDeleteJob = useMutation(api.applications.remove);

  const convexAddResume = useMutation(api.resumes.add);
  const convexUpdateResume = useMutation(api.resumes.update);
  const convexDeleteResume = useMutation(api.resumes.remove);

  // Wrapper actions matching original Zustand interfaces
  const updateJob = (id: any, updates: Partial<JobApplication>) => {
    convexUpdateJob({ id, ...updates }).catch(err => console.error("Error updating job:", err));
  };
  const deleteJob = (id: any) => {
    convexDeleteJob({ id }).catch(err => console.error("Error deleting job:", err));
  };

  const addResume = (resume: Omit<Resume, 'id' | 'updatedAt'>) => {
    convexAddResume({
      name: resume.name,
      content: resume.content,
      isDefault: resume.isDefault,
    }).catch(err => console.error("Error adding resume:", err));
  };
  const updateResume = (id: any, updates: Partial<Resume>) => {
    convexUpdateResume({ id, ...updates }).catch(err => console.error("Error updating resume:", err));
  };
  const deleteResume = (id: any) => {
    convexDeleteResume({ id }).catch(err => console.error("Error deleting resume:", err));
  };

  // Navigation / Local view state
  const [viewingAnalysisJobId, setViewingAnalysisJobId] = useState<string | null>(null);

  // Modals state
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [isAddResumeOpen, setIsAddResumeOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [evaluatingJob, setEvaluatingJob] = useState<JobApplication | null>(null);

  // Form states for matching/evaluating an existing job
  const [evaluateResumeId, setEvaluateResumeId] = useState('');
  const [evaluateJobDescription, setEvaluateJobDescription] = useState('');

  useEffect(() => {
    if (evaluatingJob) {
      const defaultResume = resumes.find(r => r.id === evaluatingJob.resumeUsed) || resumes.find(r => r.isDefault) || resumes[0];
      setEvaluateResumeId(defaultResume?.id || '');
      setEvaluateJobDescription(evaluatingJob.jobDescription || '');
    }
  }, [evaluatingJob, resumes]);

  const [newResume, setNewResume] = useState({
    name: '',
    content: '',
    isDefault: false,
  });

  // API Call state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Loading animation phase cycle
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingPhase(0);
      interval = setInterval(() => {
        setLoadingPhase((prev) => {
          if (prev < LOADING_PHASES.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Run the Comparison
  const handleCompare = async (jobId: string, resumeContent: string, jobDesc: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || (process.env as any).VITE_API_KEY;
      if (apiKey) {
        headers['x-api-key'] = apiKey;
      }

      const response = await fetch('/api/compare', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          resumeText: resumeContent,
          jobDescription: jobDesc,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to compare resume and job description.');
      }

      // Update the job in store
      updateJob(jobId, {
        matchScore: data.score,
        analysisResult: data,
        jobDescription: jobDesc
      });

      setViewingAnalysisJobId(jobId);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddJobSubmit = async (jobData: {
    company: string;
    role: string;
    status: JobApplication['status'];
    url: string;
    jobDescription: string;
    selectedResumeId: string;
    analyzeImmediately: boolean;
  }) => {
    try {
      if (editingJob) {
        // Edit/Update mode!
        await convexUpdateJob({
          id: editingJob.id as any,
          company: jobData.company,
          role: jobData.role,
          status: jobData.status,
          url: jobData.url || "",
          jobDescription: jobData.jobDescription || "",
          resumeUsed: jobData.selectedResumeId || "",
        });
        
        // Trigger immediate match if requested on edited details
        if (jobData.analyzeImmediately && jobData.jobDescription) {
          const selectedResume = resumes.find(r => r.id === jobData.selectedResumeId) || resumes.find(r => r.isDefault) || resumes[0];
          if (selectedResume) {
            handleCompare(editingJob.id, selectedResume.content, jobData.jobDescription);
          }
        }
      } else {
        // Add/Create mode!
        const createdJobId = await convexAddJob({
          company: jobData.company,
          role: jobData.role,
          status: jobData.status,
          dateApplied: new Date().toLocaleDateString(),
          url: jobData.url || "",
          jobDescription: jobData.jobDescription || "",
          resumeUsed: jobData.selectedResumeId || "",
        });
        
        // Trigger immediate match if requested
        if (jobData.analyzeImmediately && jobData.jobDescription) {
          const selectedResume = resumes.find(r => r.id === jobData.selectedResumeId) || resumes.find(r => r.isDefault) || resumes[0];
          if (selectedResume) {
            handleCompare(createdJobId, selectedResume.content, jobData.jobDescription);
          }
        }
      }
    } catch (err) {
      console.error("Error saving job application:", err);
      setError("Failed to save job application in database.");
    }

    setIsAddJobOpen(false);
    setEditingJob(null);
  };

  const submitNewResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResume.name || !newResume.content) return;

    addResume({
      name: newResume.name,
      content: newResume.content,
      isDefault: newResume.isDefault,
    });

    setNewResume({ name: '', content: '', isDefault: false });
    setIsAddResumeOpen(false);
  };

  const submitEditResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResume) return;

    updateResume(editingResume.id, {
      name: editingResume.name,
      content: editingResume.content,
      isDefault: editingResume.isDefault,
    });

    setEditingResume(null);
  };

  const currentAnalysisJob = jobs.find(j => j.id === viewingAnalysisJobId);

  return (
    <div className="flex min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        isViewingAnalysis={viewingAnalysisJobId !== null}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setViewingAnalysisJobId(null);
        }}
        onBack={onBack}
      />

      {/* Main panel layout */}
      <main className="flex-1 flex flex-col overflow-y-auto h-screen relative">
        {/* Loading overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
            >
              <div className="bg-white rounded-3xl border border-[var(--border)] shadow-[var(--shadow-float)] p-12 text-center max-w-md w-full">
                <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-50 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-[var(--accent)] border-r-[var(--accent-cyan)] border-b-transparent border-l-transparent animate-spin"></div>
                  <Sparkle className="w-8 h-8 text-[var(--accent-cyan)] animate-pulse" />
                </div>
                <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)] mb-1">
                  Analyzing Alignment
                </h3>
                <p className="text-xs text-[var(--text-muted)] mb-6">
                  Applying advanced semantic matching rules to optimize your resume bullets.
                </p>

                <div className="bg-[var(--bg-page)] rounded-2xl p-4 text-left border border-black/5">
                  <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-1">
                    System Pipeline Status
                  </span>
                  <div className="text-xs font-semibold text-[var(--text-heading)] flex items-center gap-2 min-h-[32px]">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse shrink-0"></div>
                    {LOADING_PHASES[loadingPhase]}
                  </div>
                  <div className="w-full bg-gray-200 h-1 rounded-full mt-3 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-cyan)] h-full"
                      animate={{ width: `${((loadingPhase + 1) / LOADING_PHASES.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Error Toast */}
        {error && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-3.5 flex justify-between items-center text-rose-800 text-xs font-medium shrink-0">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              {error}
            </span>
            <button onClick={() => setError(null)} className="underline cursor-pointer hover:text-rose-900">Dismiss</button>
          </div>
        )}

        {/* Dashboard inner panels */}
        <div className="p-8 flex-1">
          {viewingAnalysisJobId && currentAnalysisJob ? (
            <MatchAnalysisDetail
              job={currentAnalysisJob}
              resumes={resumes}
              onBackClick={() => setViewingAnalysisJobId(null)}
              onReRunAnalysis={handleCompare}
            />
          ) : activeTab === 'jobs' ? (
            <ApplicationsBoard
              jobs={jobs}
              resumes={resumes}
              onAddJobClick={() => setIsAddJobOpen(true)}
              onEditJobClick={(job) => {
                setEditingJob(job);
                setIsAddJobOpen(true);
              }}
              onMatchClick={(job) => setEvaluatingJob(job)}
              onViewAnalysisClick={(jobId) => setViewingAnalysisJobId(jobId)}
              onUpdateJobStatus={(id, status) => updateJob(id, { status })}
              onDeleteJob={(id) => deleteJob(id)}
            />
          ) : (
            <ResumeTemplates
              resumes={resumes}
              onAddResumeClick={() => setIsAddResumeOpen(true)}
              onEditResumeClick={(resume) => setEditingResume(resume)}
              onDeleteResume={(id) => deleteResume(id)}
              onSetDefaultResume={(id) => updateResume(id, { isDefault: true })}
            />
          )}
        </div>
      </main>

      <AddApplicationModal
        isOpen={isAddJobOpen}
        onClose={() => {
          setIsAddJobOpen(false);
          setEditingJob(null);
        }}
        resumes={resumes}
        editingJob={editingJob}
        onSubmit={handleAddJobSubmit}
      />

      {/* Edit Job Description / Match triggers from card */}
      <AnimatePresence>
        {evaluatingJob && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[var(--border)] shadow-[var(--shadow-float)] w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-slate-50">
                <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
                  Run AI Comparison for {evaluatingJob.role}
                </h3>
                <button
                  onClick={() => setEvaluatingJob(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
                <div>
                  <label className="block font-semibold text-[var(--text-heading)] mb-1">Company & Role</label>
                  <p className="text-sm font-bold text-[var(--text-heading)]">{evaluatingJob.company} &mdash; {evaluatingJob.role}</p>
                </div>

                {resumes.length > 0 && (
                  <div>
                    <label className="block font-semibold text-[var(--text-heading)] mb-1">Compare Against Resume Template</label>
                    <select
                      value={evaluateResumeId}
                      onChange={(e) => setEvaluateResumeId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-black/10 bg-white focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                    >
                      {resumes.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.name} {r.isDefault ? '(Active Template)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-[var(--text-heading)] mb-1">Paste Job Description *</label>
                  <textarea
                    rows={6}
                    required
                    value={evaluateJobDescription}
                    onChange={(e) => setEvaluateJobDescription(e.target.value)}
                    placeholder="Paste the target job description requirements here..."
                    className="w-full p-3 rounded-xl border border-black/10 focus:outline-none focus:border-[var(--accent)] font-mono text-[11px] leading-relaxed resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
                  <Button variant="outline" size="sm" type="button" onClick={() => setEditingJob(null)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!evaluateJobDescription.trim()}
                    onClick={() => {
                      const selectedResume = resumes.find(r => r.id === evaluateResumeId) || resumes.find(r => r.isDefault) || resumes[0];
                      if (selectedResume && editingJob) {
                        handleCompare(editingJob.id, selectedResume.content, evaluateJobDescription);
                        setEditingJob(null);
                      }
                    }}
                  >
                    Start AI Match
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Resume Modal */}
      <AnimatePresence>
        {isAddResumeOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[var(--border)] shadow-[var(--shadow-float)] w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-slate-50">
                <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
                  Add New Resume Template
                </h3>
                <button
                  onClick={() => setIsAddResumeOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={submitNewResume} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
                <div>
                  <label className="block font-semibold text-[var(--text-heading)] mb-1">Template Name *</label>
                  <input
                    type="text"
                    required
                    value={newResume.name}
                    onChange={(e) => setNewResume(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Senior Frontend Dev Resume"
                    className="w-full p-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-heading)] mb-1">Resume Text Content *</label>
                  <textarea
                    rows={8}
                    required
                    value={newResume.content}
                    onChange={(e) => setNewResume(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Paste the full text of your CV/Resume here..."
                    className="w-full p-3 rounded-xl border border-black/10 focus:outline-none focus:border-[var(--accent)] font-mono text-[11px] leading-relaxed resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={newResume.isDefault}
                    onChange={(e) => setNewResume(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="w-4 h-4 rounded text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                  />
                  <label htmlFor="isDefault" className="font-medium text-[var(--text-heading)] cursor-pointer selection:bg-transparent">
                    Set as Active default template for matching
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsAddResumeOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Save Template
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Resume Modal */}
      <AnimatePresence>
        {editingResume && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[var(--border)] shadow-[var(--shadow-float)] w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-slate-50">
                <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
                  Edit Resume Template
                </h3>
                <button
                  onClick={() => setEditingResume(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={submitEditResume} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
                <div>
                  <label className="block font-semibold text-[var(--text-heading)] mb-1">Template Name *</label>
                  <input
                    type="text"
                    required
                    value={editingResume.name}
                    onChange={(e) => setEditingResume(prev => prev ? { ...prev, name: e.target.value } : null)}
                    placeholder="e.g. Senior Frontend Dev Resume"
                    className="w-full p-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-heading)] mb-1">Resume Text Content *</label>
                  <textarea
                    rows={8}
                    required
                    value={editingResume.content}
                    onChange={(e) => setEditingResume(prev => prev ? { ...prev, content: e.target.value } : null)}
                    placeholder="Paste the full text of your CV/Resume here..."
                    className="w-full p-3 rounded-xl border border-black/10 focus:outline-none focus:border-[var(--accent)] font-mono text-[11px] leading-relaxed resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editIsDefault"
                    checked={editingResume.isDefault}
                    onChange={(e) => setEditingResume(prev => prev ? { ...prev, isDefault: e.target.checked } : null)}
                    className="w-4 h-4 rounded text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                  />
                  <label htmlFor="editIsDefault" className="font-medium text-[var(--text-heading)] cursor-pointer selection:bg-transparent">
                    Set as Active default template for matching
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
                  <Button variant="outline" size="sm" type="button" onClick={() => setEditingResume(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
