import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

interface ErrorToastProps {
  error: string | null;
  onDismiss: () => void;
  onRetry?: (() => void) | null;
}

export default function ErrorToast({ error, onDismiss, onRetry }: ErrorToastProps) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-70 pointer-events-auto"
        >
          <div className="bg-[var(--bg-surface)]/90 backdrop-blur-md border border-rose-500/20 rounded-2xl shadow-[0_10px_30px_rgba(239,68,68,0.15)] p-4 flex gap-3.5 items-start">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            
            <div className="flex-1 min-w-0 pt-0.5">
              <h4 className="text-xs font-bold text-[var(--text-heading)] mb-1">
                Operation Failed
              </h4>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed mb-3 break-words">
                {error}
              </p>
              
              <div className="flex items-center gap-3">
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-[10px] font-bold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Try Again
                  </button>
                )}
                <button
                  onClick={onDismiss}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-[10px] text-[var(--text-muted)] font-bold hover:bg-[var(--bg-page)] hover:text-[var(--text-heading)] transition-all cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>

            <button
              onClick={onDismiss}
              className="p-1 rounded-lg hover:bg-[var(--bg-page)] text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
