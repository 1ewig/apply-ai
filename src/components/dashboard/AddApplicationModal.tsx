import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { JobApplication, Resume } from '../../hooks/useStore';

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
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<JobApplication['status']>('wishlist');
  const [url, setUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [customResumeContent, setCustomResumeContent] = useState('');
  const [analyzeImmediately, setAnalyzeImmediately] = useState(false);

  // Sync selectedResumeId and fields when resumes/open/editing states change
  useEffect(() => {
    if (isOpen) {
      if (editingJob) {
        setCompany(editingJob.company || '');
        setRole(editingJob.role || '');
        setStatus(editingJob.status || 'wishlist');
        setUrl(editingJob.url || '');
        setJobDescription(editingJob.jobDescription || '');
        setSelectedResumeId(editingJob.resumeUsed || '');
        setCustomResumeContent(editingJob.customResumeContent || '');
        setAnalyzeImmediately(false);
      } else {
        const defaultResume = resumes.find((r) => r.isDefault) || resumes[0];
        if (defaultResume) {
          setSelectedResumeId(defaultResume.id);
          setCustomResumeContent(defaultResume.content);
        } else {
          setSelectedResumeId('');
          setCustomResumeContent('');
        }
        // Reset form states
        setCompany('');
        setRole('');
        setStatus('wishlist');
        setUrl('');
        setJobDescription('');
        setAnalyzeImmediately(false);
      }
    }
  }, [isOpen, editingJob, resumes]);

  const handleResumeTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    setSelectedResumeId(templateId);
    const selectedTemplate = resumes.find(r => r.id === templateId);
    if (selectedTemplate) {
      setCustomResumeContent(selectedTemplate.content);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      company: company.trim() || 'Unnamed Company',
      role: role.trim() || 'Unnamed Role',
      status,
      url,
      jobDescription,
      selectedResumeId,
      customResumeContent,
      analyzeImmediately,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl border border-[var(--border)] shadow-[var(--shadow-float)] w-full max-w-6xl overflow-hidden flex flex-col max-h-[95vh]"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
                  {editingJob
                    ? 'Edit Job Application'
                    : analyzeImmediately
                    ? 'Start AI Comparison'
                    : 'Add New Job Application'}
                </h3>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Customize application details, edit resume wording, and load job requirements side-by-side</p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Layout */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 text-xs flex flex-col justify-between">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1: Application Details */}
                <div className="space-y-4 pr-0 lg:pr-2 lg:border-r border-black/5">
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
                      className="w-full p-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-[var(--accent)] bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[var(--text-heading)] mb-1">Role / Title (optional)</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Senior Frontend Dev"
                      className="w-full p-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-[var(--accent)] bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[var(--text-heading)] mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as JobApplication['status'])}
                      className="w-full p-2.5 rounded-xl border border-black/10 bg-white focus:outline-none focus:border-[var(--accent)] cursor-pointer"
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
                      className="w-full p-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-[var(--accent)] bg-slate-50/50"
                    />
                  </div>

                  {resumes.length > 0 && (
                    <div className="pt-2">
                      <label className="block font-semibold text-[var(--text-heading)] mb-1">Resume Template Link</label>
                      <select
                        value={selectedResumeId}
                        onChange={handleResumeTemplateChange}
                        className="w-full p-2.5 rounded-xl border border-black/10 bg-white focus:outline-none focus:border-[var(--accent)] cursor-pointer"
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

                {/* Column 2: Resume Content (Tailorable) */}
                <div className="space-y-4 pr-0 lg:pr-2 lg:border-r border-black/5 flex flex-col">
                  <h4 className="font-bold text-xs text-[var(--text-heading)] border-b pb-2 flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[10px] flex items-center justify-center">2</span>
                    Tailored Resume
                  </h4>
                  <div className="flex-1 flex flex-col min-h-[320px]">
                    <label className="block font-semibold text-[var(--text-heading)] mb-1">Your Highlights for this Job</label>
                    <textarea
                      value={customResumeContent}
                      onChange={(e) => setCustomResumeContent(e.target.value)}
                      placeholder="Highlight skills or project achievements matching the job description here..."
                      className="w-full p-3 rounded-xl border border-black/10 focus:outline-none focus:border-[var(--accent)] font-mono text-[11px] leading-relaxed resize-none flex-1 min-h-[280px]"
                    />
                  </div>
                </div>

                {/* Column 3: Job Description */}
                <div className="space-y-4 flex flex-col">
                  <h4 className="font-bold text-xs text-[var(--text-heading)] border-b pb-2 flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[10px] flex items-center justify-center">3</span>
                    Job Description
                  </h4>
                  <div className="flex-1 flex flex-col min-h-[320px]">
                    <label className="block font-semibold text-[var(--text-heading)] mb-1">Paste Job Requirements *</label>
                    <textarea
                      required={analyzeImmediately}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the core requirements or full job description here..."
                      className="w-full p-3 rounded-xl border border-black/10 focus:outline-none focus:border-[var(--accent)] font-mono text-[11px] leading-relaxed resize-none flex-1 min-h-[280px]"
                    />
                  </div>
                </div>

              </div>

              {/* Bottom checkbox and actions */}
              <div className="space-y-4 mt-6 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="modalAnalyzeImmediately"
                    checked={analyzeImmediately}
                    onChange={(e) => setAnalyzeImmediately(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                  />
                  <label
                    htmlFor="modalAnalyzeImmediately"
                    className="font-medium text-[var(--text-heading)] cursor-pointer selection:bg-transparent"
                  >
                    Analyze matching alignment immediately via Llama AI using the tailored resume in Column 2
                  </label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" type="button" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    disabled={!customResumeContent.trim() && analyzeImmediately}
                  >
                    {editingJob
                      ? 'Save Changes'
                      : analyzeImmediately
                      ? 'Save & Start AI Match'
                      : 'Save Application'}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
