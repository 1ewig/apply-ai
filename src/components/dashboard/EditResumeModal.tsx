import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { Resume } from '../../hooks/useStore';

interface EditResumeModalProps {
  resume: Resume | null;
  onClose: () => void;
  onSubmit: (id: string, data: { name: string; content: string; isDefault: boolean }) => void;
}

export default function EditResumeModal({ resume, onClose, onSubmit }: EditResumeModalProps) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (resume) {
      setName(resume.name);
      setContent(resume.content);
      setIsDefault(resume.isDefault);
    }
  }, [resume]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume || !name || !content) return;
    onSubmit(resume.id, { name, content, isDefault });
    onClose();
  };

  const isOpen = resume !== null;

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
                Edit Resume Template
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block font-semibold text-[var(--text-heading)] mb-1">Template Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Senior Frontend Dev Resume"
                  className="w-full p-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-heading)] mb-1">Resume Text Content *</label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste the full text of your CV/Resume here..."
                  className="w-full p-3 rounded-xl border border-black/10 focus:outline-none focus:border-[var(--accent)] font-mono text-[11px] leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-isDefault"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="w-4 h-4 rounded text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                />
                <label htmlFor="edit-isDefault" className="font-medium text-[var(--text-heading)] cursor-pointer selection:bg-transparent">
                  Set as Active default template for matching
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
                <Button variant="outline" size="sm" type="button" onClick={onClose}>
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
  );
}
