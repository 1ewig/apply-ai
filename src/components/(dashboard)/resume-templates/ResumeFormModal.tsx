'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { backdropFade, modalSpringScale } from '@/utils/animations';
import Button from '@/components/ui/Button';
import type { Resume } from '@/types';
import { Loader2 } from 'lucide-react';

interface ResumeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingResume?: Resume | null;
  name: string;
  onNameChange: (value: string) => void;
  content: string;
  onContentChange: (value: string) => void;
  isDefault: boolean;
  onIsDefaultChange: (value: boolean) => void;
  isSubmitting: boolean;
}

export default function ResumeFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingResume,
  name,
  onNameChange,
  content,
  onContentChange,
  isDefault,
  onIsDefaultChange,
  isSubmitting,
}: ResumeFormModalProps) {
  const isEditing = !!editingResume;

  const hasChanges = !editingResume || (
    (name || '').trim() !== (editingResume.name || '').trim() ||
    (content || '').trim() !== (editingResume.content || '').trim() ||
    isDefault !== editingResume.isDefault
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...backdropFade}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            {...modalSpringScale}
            className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] shadow-[var(--shadow-float)] w-full max-w-3xl overflow-hidden flex flex-col max-h-[95dvh]"
          >
            <div className="py-4 px-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-page)]">
              <div>
                <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
                  {isEditing ? 'Edit Resume Template' : 'Add New Resume Template'}
                </h3>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                  {isEditing
                    ? 'Update your baseline resume information and details'
                    : 'Upload a new resume baseline to use for tailoring and comparison matches'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-[var(--text-muted)] hover:text-[var(--text-heading)] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="flex-1 flex flex-col overflow-hidden text-xs">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block font-semibold text-[var(--text-heading)] mb-1">Template Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="e.g. Senior Frontend Dev Resume"
                    maxLength={100}
                    className="w-full p-2.5 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] bg-[var(--input-bg)]"
                  />
                </div>

                <div className="flex-1 flex flex-col min-h-[380px] h-[48dvh]">
                  <label className="block font-semibold text-[var(--text-heading)] mb-1">Resume Text Content *</label>
                  <textarea
                    required
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    placeholder="Paste the full text of your CV/Resume here..."
                    maxLength={25000}
                    className="w-full p-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] font-mono text-[11px] leading-relaxed resize-none flex-1 min-h-[340px] bg-[var(--input-bg)]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="modal-isDefault"
                    checked={isDefault}
                    onChange={(e) => onIsDefaultChange(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                  />
                  <label htmlFor="modal-isDefault" className="font-medium text-[var(--text-heading)] cursor-pointer selection:bg-transparent">
                    Set as Active default template for matching
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 px-6 py-3 border-t border-[var(--border)] bg-[var(--bg-page)] shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting || !hasChanges}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </span>
                  ) : isEditing ? (
                    'Save Changes'
                  ) : (
                    'Save Template'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
