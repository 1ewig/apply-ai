import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JobApplication, Resume } from './types';
import { initialResumes, initialJobs } from './mockData';

// Re-export types so we do not break any existing component imports in the frontend
export type { ComparisonResult, JobApplication, Resume } from './types';

interface AppStore {
  jobs: JobApplication[];
  resumes: Resume[];
  activeTab: 'jobs' | 'resumes';
  selectedJobForAnalysis: JobApplication | null;
  
  // Tab control
  setActiveTab: (tab: 'jobs' | 'resumes') => void;
  setSelectedJobForAnalysis: (job: JobApplication | null) => void;
  
  // Job actions
  addJob: (job: Omit<JobApplication, 'id' | 'dateApplied'>) => void;
  updateJob: (id: string, updates: Partial<JobApplication>) => void;
  deleteJob: (id: string) => void;
  
  // Resume actions
  addResume: (resume: Omit<Resume, 'id' | 'updatedAt'>) => void;
  updateResume: (id: string, updates: Partial<Resume>) => void;
  deleteResume: (id: string) => void;
  setDefaultResume: (id: string) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      jobs: initialJobs,
      resumes: initialResumes,
      activeTab: 'jobs',
      selectedJobForAnalysis: null,
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedJobForAnalysis: (job) => set({ selectedJobForAnalysis: job }),
      
      addJob: (job) => set((state) => ({
        jobs: [
          ...state.jobs,
          {
            ...job,
            id: `job-${Math.random().toString(36).substr(2, 9)}`,
            dateApplied: new Date().toLocaleDateString(),
          }
        ]
      })),
      
      updateJob: (id, updates) => set((state) => ({
        jobs: state.jobs.map((job) => (job.id === id ? { ...job, ...updates } : job)),
        // Sync selectedJobForAnalysis if it's the one being updated
        selectedJobForAnalysis: state.selectedJobForAnalysis?.id === id 
          ? { ...state.selectedJobForAnalysis, ...updates } 
          : state.selectedJobForAnalysis,
      })),
      
      deleteJob: (id) => set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id),
        selectedJobForAnalysis: state.selectedJobForAnalysis?.id === id ? null : state.selectedJobForAnalysis,
      })),
      
      addResume: (resume) => set((state) => {
        // If setting as default, unset others first
        const resumes = resume.isDefault 
          ? state.resumes.map((r) => ({ ...r, isDefault: false })) 
          : state.resumes;
          
        return {
          resumes: [
            ...resumes,
            {
              ...resume,
              id: `resume-${Math.random().toString(36).substr(2, 9)}`,
              updatedAt: new Date().toLocaleDateString(),
            }
          ]
        };
      }),
      
      updateResume: (id, updates) => set((state) => {
        let resumes = state.resumes;
        
        // If setting as default, unset others
        if (updates.isDefault) {
          resumes = resumes.map((r) => ({ ...r, isDefault: false }));
        }
        
        return {
          resumes: resumes.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toLocaleDateString() } : r)),
        };
      }),
      
      deleteResume: (id) => set((state) => {
        const remaining = state.resumes.filter((r) => r.id !== id);
        // If we deleted the default, set the first remaining one as default
        if (remaining.length > 0 && !remaining.some((r) => r.isDefault)) {
          remaining[0].isDefault = true;
        }
        return { resumes: remaining };
      }),
      
      setDefaultResume: (id) => set((state) => ({
        resumes: state.resumes.map((r) => ({
          ...r,
          isDefault: r.id === id,
          updatedAt: r.id === id ? new Date().toLocaleDateString() : r.updatedAt,
        })),
      })),
    }),
    {
      name: 'apply-ai-storage',
    }
  )
);
