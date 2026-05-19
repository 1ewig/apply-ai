import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
