'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { backdropFade, modalSpringScale } from '@/utils/animations';
import Button from '../../ui/Button';
import type { Resume } from '../../../hooks/types';
import { useResumeForm } from '../../../hooks/useResumeForm';

interface ResumeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; content: string; isDefault: boolean }) => void;
  editingResume?: Resume | null;
}

export default function ResumeFormModal({ isOpen, onClose, onSubmit, editingResume }: ResumeFormModalProps) {
  const isEditing = !!editingResume;

  const { name, setName, content, setContent, isDefault, setIsDefault, handleSubmit } = useResumeForm({
    isOpen,
    editingResume,
    onSubmit,
    onClose,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...backdropFade}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            {...modalSpringScale}
            className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] shadow-[var(--shadow-float)] w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-page)]">
              <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
                {isEditing ? 'Edit Resume Template' : 'Add New Resume Template'}
              </h3>
              <button
                onClick={onClose}
                className="text-[var(--text-muted)] hover:text-[var(--text-heading)] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block font-semibold text-[var(--text-heading)] mb-1">Template Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Senior Frontend Dev Resume"
                  maxLength={100}
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
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
                  maxLength={25000}
                  className="w-full p-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] font-mono text-[11px] leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="modal-isDefault"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="w-4 h-4 rounded text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                />
                <label htmlFor="modal-isDefault" className="font-medium text-[var(--text-heading)] cursor-pointer selection:bg-transparent">
                  Set as Active default template for matching
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
                <Button variant="outline" size="sm" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  {isEditing ? 'Save Changes' : 'Save Template'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
