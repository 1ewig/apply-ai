import { create } from 'zustand';

const LOADING_PHASES = [
  'Initializing ApplyAI secure analyzer...',
  'Parsing resume structure and key sections...',
  'Extracting technical skills and core competencies...',
  'Analyzing job description requirements...',
  'Calculating semantic match and keywords coverage...',
  'Generating optimized resume bullets and suggestions...',
  'Formulating targeted interview prep strategy...',
];

interface AnalysisStore {
  isLoading: boolean;
  loadingPhase: number;
  phases: string[];
  error: string | null;
  startAnalysis: () => void;
  setPhase: (phase: number) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  finishAnalysis: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  isLoading: false,
  loadingPhase: 0,
  phases: LOADING_PHASES,
  error: null,
  startAnalysis: () => set({ isLoading: true, loadingPhase: 0, error: null }),
  setPhase: (phase) => set({ loadingPhase: phase }),
  setError: (error) => set({ isLoading: false, error }),
  clearError: () => set({ error: null }),
  finishAnalysis: () => set({ isLoading: false }),
}));
