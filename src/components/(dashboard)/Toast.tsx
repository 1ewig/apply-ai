import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, RotateCcw, X, Loader2 } from 'lucide-react';
import { useAnalysisStore } from '@/stores/useAnalysisStore';

interface ToastProps {
  message: string | null;
  title?: string | null;
  type?: 'error' | 'success' | null;
  onDismiss: () => void;
  onRetry?: (() => void) | null;
}

export default function Toast({ message, title, type = 'error', onDismiss, onRetry }: ToastProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry || isRetrying) return;
    setIsRetrying(true);
    try {
      await onRetry();
      
      // If the retry resolves successfully without throwing an error:
      const setSuccess = useAnalysisStore.getState().setSuccess;
      setSuccess('The operation was completed successfully.', 'Operation Succeeded');
    } catch (err) {
      console.error('Retry action failed:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  // Auto-dismiss for success toasts (5 seconds)
  useEffect(() => {
    if (message && type === 'success') {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, type, onDismiss]);

  const isSuccess = type === 'success';

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-70 pointer-events-auto"
        >
          <div className={`bg-[var(--bg-surface)]/90 backdrop-blur-md border rounded-2xl p-4 flex gap-3.5 items-start ${
            isSuccess 
              ? 'border-emerald-500/20 shadow-[0_10px_30px_rgba(16,185,129,0.15)]' 
              : 'border-rose-500/20 shadow-[0_10px_30px_rgba(239,68,68,0.15)]'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
              isSuccess 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
            }`}>
              {isSuccess ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
            </div>
            
            <div className="flex-1 min-w-0 pt-0.5">
              <h4 className="text-xs font-bold text-[var(--text-heading)] mb-1">
                {title || (isSuccess ? 'Success' : 'Operation Failed')}
              </h4>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed mb-3 break-words">
                {message}
              </p>
              
              <div className="flex items-center gap-3">
                {!isSuccess && onRetry && (
                  <button
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-[10px] font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRetrying ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <RotateCcw className="w-3 h-3" />
                    )}
                    {isRetrying ? 'Retrying...' : 'Try Again'}
                  </button>
                )}
                <button
                  onClick={onDismiss}
                  disabled={isRetrying}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-[10px] text-[var(--text-muted)] font-bold hover:bg-[var(--bg-page)] hover:text-[var(--text-heading)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Dismiss
                </button>
              </div>
            </div>

            <button
              onClick={onDismiss}
              disabled={isRetrying}
              className="p-1 rounded-lg hover:bg-[var(--bg-page)] text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
