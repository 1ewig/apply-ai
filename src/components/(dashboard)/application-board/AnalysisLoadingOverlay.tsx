import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { overlayFade, progressWidth } from '@/utils/animations';
import { Sparkle } from 'lucide-react';

interface AnalysisLoadingOverlayProps {
  isLoading: boolean;
  phases: string[];
}


export default function AnalysisLoadingOverlay({ isLoading, phases }: AnalysisLoadingOverlayProps) {
  const [localPhase, setLocalPhase] = useState(0);
  const [apiFinished, setApiFinished] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setLocalPhase(0);
      setApiFinished(false);
      setVisible(true);
    } else {
      setApiFinished(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setLocalPhase((prev) => {
        if (prev < phases.length - 1) {
          return prev + 1;
        } else {
          // If we reached the end but API is still processing, stay at 95%
          if (apiFinished) {
            setVisible(false);
            clearInterval(interval);
          }
          return prev;
        }
      });
    }, 600); // 12 phases * 600ms = 7.2 seconds cinematic minimum duration

    return () => clearInterval(interval);
  }, [visible, apiFinished, phases.length]);

  // If the API finishes and we've reached the last phase, hide
  useEffect(() => {
    if (apiFinished && localPhase === phases.length - 1) {
      const delay = setTimeout(() => {
        setVisible(false);
      }, 300);
      return () => clearTimeout(delay);
    }
  }, [apiFinished, localPhase, phases.length]);

  const activePhase = phases[localPhase] || phases[0];
  const progressPercent = ((localPhase + 1) / phases.length) * 100;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          {...overlayFade}
          className="fixed inset-0 bg-[var(--bg-surface)]/80 backdrop-blur-md z-60 flex items-center justify-center p-6"
        >
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

