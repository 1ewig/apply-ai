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
  retryAction: (() => void) | null;
  startAnalysis: () => void;
  setPhase: (phase: number) => void;
  setError: (error: string | null, retryAction?: (() => void) | null) => void;
  clearError: () => void;
  finishAnalysis: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  isLoading: false,
  loadingPhase: 0,
  phases: LOADING_PHASES,
  error: null,
  retryAction: null,
  startAnalysis: () => set({ isLoading: true, loadingPhase: 0, error: null, retryAction: null }),
  setPhase: (phase) => set({ loadingPhase: phase }),
  setError: (error, retryAction) => set((state) => ({ isLoading: false, error, retryAction: retryAction !== undefined ? retryAction : state.retryAction })),
  clearError: () => set({ error: null, retryAction: null }),
  finishAnalysis: () => set({ isLoading: false }),
}));
