import { motion, AnimatePresence } from 'framer-motion';
import { Sparkle } from 'lucide-react';

interface AnalysisLoadingOverlayProps {
  isLoading: boolean;
  loadingPhase: number;
  phases: string[];
}

export default function AnalysisLoadingOverlay({ isLoading, loadingPhase, phases }: AnalysisLoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
        >
          <div className="bg-white rounded-3xl border border-[var(--border)] shadow-[var(--shadow-float)] p-12 text-center max-w-md w-full">
            <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-50 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-[var(--accent)] border-r-[var(--accent-cyan)] border-b-transparent border-l-transparent animate-spin"></div>
              <Sparkle className="w-8 h-8 text-[var(--accent-cyan)] animate-pulse" />
            </div>
            <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)] mb-1">
              Analyzing Alignment
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-6">
              Applying advanced semantic matching rules to optimize your resume bullets.
            </p>

            <div className="bg-[var(--bg-page)] rounded-2xl p-4 text-left border border-black/5">
              <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-1">
                System Pipeline Status
              </span>
              <div className="text-xs font-semibold text-[var(--text-heading)] flex items-center gap-2 min-h-[32px]">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse shrink-0"></div>
                {phases[loadingPhase]}
              </div>
              <div className="w-full bg-gray-200 h-1 rounded-full mt-3 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-cyan)] h-full"
                  animate={{ width: `${((loadingPhase + 1) / phases.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
