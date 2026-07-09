'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { backdropFade, modalSpringScale } from '@/utils/animations';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger' as const,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...backdropFade}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            {...modalSpringScale}
            className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] shadow-[var(--shadow-float)] w-full max-w-sm overflow-hidden"
          >
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="font-display font-extrabold text-base text-[var(--text-heading)] mb-2">{title}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{message}</p>
            </div>
            <div className="px-6 pb-6 flex justify-end gap-2">
              <Button variant="outline" size="sm" type="button" onClick={onCancel}>
                {cancelLabel}
              </Button>
              <Button variant={variant} size="sm" type="button" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}