import { create } from 'zustand';

const LOADING_PHASES = [
  'Initializing ApplyAI secure analyzer...',
  'Parsing resume structure and key sections...',
  'Extracting technical skills and core competencies...',
  'Analyzing job description requirements...',
  'Calculating semantic match and keywords coverage...',
  'Evaluating score breakdown across all dimensions...',
  'Generating optimized resume bullets and suggestions...',
  'Formulating targeted interview prep strategy...',
  'Building cover letter draft and skill roadmap...',
  'Running ATS compatibility check...',
];

interface AnalysisStore {
  isLoading: boolean;
  loadingPhase: number;
  phases: string[];
  error: string | null;
  errorTitle: string | null;
  retryAction: (() => void) | null;
  startAnalysis: () => void;
  setPhase: (phase: number) => void;
  setError: (error: string | null, retryAction?: (() => void) | null, errorTitle?: string | null) => void;
  clearError: () => void;
  finishAnalysis: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  isLoading: false,
  loadingPhase: 0,
  phases: LOADING_PHASES,
  error: null,
  errorTitle: null,
  retryAction: null,
  startAnalysis: () => set({ isLoading: true, loadingPhase: 0, error: null, errorTitle: null, retryAction: null }),
  setPhase: (phase) => set({ loadingPhase: phase }),
  setError: (error, retryAction, errorTitle) => set((state) => ({
    isLoading: false,
    error,
    retryAction: retryAction !== undefined ? retryAction : state.retryAction,
    errorTitle: errorTitle !== undefined ? errorTitle : state.errorTitle,
  })),
  clearError: () => set({ error: null, errorTitle: null, retryAction: null }),
  finishAnalysis: () => set({ isLoading: false }),
}));
