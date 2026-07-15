import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { overlayFade, progressWidth } from '@/utils/animations';
import { Sparkle, XCircle, AlertTriangle, RotateCcw } from 'lucide-react';
import { useAnalysisStore } from '@/stores/useAnalysisStore';

interface AnalysisLoadingOverlayProps {
  isLoading: boolean;
  phases: string[];
}

const TIMEOUT_MS = 60_000;

export default function AnalysisLoadingOverlay({ isLoading, phases }: AnalysisLoadingOverlayProps) {
  const [localPhase, setLocalPhase] = useState(0);
  const [apiFinished, setApiFinished] = useState(false);
  const [visible, setVisible] = useState(false);
  const { error, retryAction, clearError, setError, finishAnalysis } = useAnalysisStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isLoading) {
      setLocalPhase(0);
      setApiFinished(false);
      setVisible(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setError('Analysis is taking longer than expected. Please try again.');
      }, TIMEOUT_MS);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      if (error) {
        setVisible((prev) => prev);
      } else {
        setApiFinished(true);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isLoading, error, setError]);

  useEffect(() => {
    if (!visible || error) return;

    const interval = setInterval(() => {
      setLocalPhase((prev) => {
        if (prev < phases.length - 1) {
          return prev + 1;
        } else {
          if (apiFinished) {
            setVisible(false);
            clearInterval(interval);
          }
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(interval);
  }, [visible, apiFinished, error, phases.length]);

  useEffect(() => {
    if (apiFinished && !error && localPhase === phases.length - 1) {
      const delay = setTimeout(() => {
        setVisible(false);
      }, 300);
      return () => clearTimeout(delay);
    }
  }, [apiFinished, error, localPhase, phases.length]);

  const activePhase = phases[localPhase] || phases[0];
  const progressPercent = ((localPhase + 1) / phases.length) * 100;

  const handleCancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    finishAnalysis();
    clearError();
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          {...overlayFade}
          className="fixed inset-0 bg-[var(--bg-surface)]/80 backdrop-blur-md z-60 flex items-center justify-center p-6"
        >
          {error ? (
            <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] shadow-[var(--shadow-float)] p-12 text-center max-w-md w-full">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)] mb-2">
                Analysis Failed
              </h3>
              <p className="text-xs text-[var(--text-muted)] mb-6 leading-relaxed">
                {error}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold hover:bg-[var(--bg-page)] transition-colors cursor-pointer flex-1"
                >
                  Cancel / Edit Details
                </button>
                {retryAction && (
                  <button
                    onClick={() => {
                      setLocalPhase(0);
                      setApiFinished(false);
                      retryAction();
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer flex-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Try Again
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] shadow-[var(--shadow-float)] p-12 text-center max-w-md w-full">
              <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[var(--accent)]/20 animate-ping"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-[var(--accent)] border-r-[var(--accent-cyan)] border-b-transparent border-l-transparent animate-spin"></div>
                <Sparkle className="w-8 h-8 text-[var(--accent-cyan)] animate-pulse" />
              </div>
              <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)] mb-1">
                Analyzing Alignment
              </h3>
              <p className="text-xs text-[var(--text-muted)] mb-6">
                Applying advanced semantic matching rules to optimize your resume bullets.
              </p>

              <div className="bg-[var(--bg-page)] rounded-2xl p-4 text-left border border-[var(--border)]">
                <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-1">
                  System Pipeline Status
                </span>
                <div className="text-xs font-semibold text-[var(--text-heading)] flex items-center gap-2 min-h-[32px]">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse shrink-0"></div>
                  {activePhase}
                </div>
                <div className="w-full bg-[var(--progress-track)] h-1 rounded-full mt-3 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-cyan)] h-full"
                    {...progressWidth(progressPercent)}
                  />
                </div>
              </div>

              <button
                onClick={handleCancel}
                className="mt-6 inline-flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] hover:text-rose-500 transition-colors cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                Cancel
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
