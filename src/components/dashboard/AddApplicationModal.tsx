import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { JobApplication, Resume } from '../../hooks/useStore';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumes: Resume[];
  onSubmit: (jobData: {
    company: string;
    role: string;
    status: JobApplication['status'];
    url: string;
    jobDescription: string;
    selectedResumeId: string;
    analyzeImmediately: boolean;
  }) => void;
}

export default function AddApplicationModal({
  isOpen,
  onClose,
  resumes,
  onSubmit,
}: AddApplicationModalProps) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<JobApplication['status']>('wishlist');
  const [url, setUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [analyzeImmediately, setAnalyzeImmediately] = useState(false);

  // Sync selectedResumeId with default resume when resumes/open state changes
  useEffect(() => {
    if (isOpen) {
      const defaultResume = resumes.find((r) => r.isDefault) || resumes[0];
      if (defaultResume) {
        setSelectedResumeId(defaultResume.id);
      }
      // Reset form states
      setCompany('');
      setRole('');
      setStatus('wishlist');
      setUrl('');
      setJobDescription('');
      setAnalyzeImmediately(false);
    }
  }, [isOpen, resumes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;

    onSubmit({
      company,
      role,
      status,
      url,
      jobDescription,
      selectedResumeId,
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
            className="bg-white rounded-3xl border border-[var(--border)] shadow-[var(--shadow-float)] w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-slate-50">
              <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
                {analyzeImmediately ? 'Start AI Comparison' : 'Add New Job Application'}
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[var(--text-heading)] mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Stripe"
                    className="w-full p-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--text-heading)] mb-1">Role / Title *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior Frontend Dev"
                    className="w-full p-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    className="w-full p-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              {resumes.length > 0 && (
                <div>
                  <label className="block font-semibold text-[var(--text-heading)] mb-1">Compare Against Resume Template</label>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-black/10 bg-white focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                  >
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} {r.isDefault ? '(Active Template)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-[var(--text-heading)] mb-1">Job Description *</label>
                <textarea
                  rows={4}
                  required={analyzeImmediately}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description requirements here..."
                  className="w-full p-3 rounded-xl border border-black/10 focus:outline-none focus:border-[var(--accent)] font-mono text-[11px] leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
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
                  Analyze matching alignment immediately via Llama AI
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
                <Button variant="outline" size="sm" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={resumes.length === 0 && analyzeImmediately}
                >
                  {analyzeImmediately ? 'Save & Start AI Match' : 'Save Application'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
