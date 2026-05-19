import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Re-export types so we do not break any existing component imports
export type { ComparisonResult, JobApplication, Resume } from './types';

interface AppStore {
  activeTab: 'jobs' | 'resumes';
  setActiveTab: (tab: 'jobs' | 'resumes') => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      activeTab: 'jobs',
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'apply-ai-storage',
    }
  )
);
