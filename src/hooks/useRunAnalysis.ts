import { useCallback } from 'react';
import { useAnalysisStore } from '@/store/useAnalysisStore';

export function useRunAnalysis() {
  const { startAnalysis, setError, finishAnalysis } = useAnalysisStore();

  const runAnalysis = useCallback(async (jobId: string, resumeContent: string, jobDescription: string) => {
    startAnalysis();
    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: resumeContent, jobDescription }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to compare resume and job description.');
      return data;
    } catch (err: any) {
      const message = err.message || 'An unexpected error occurred. Please try again.';
      setError(message);
      throw err;
    } finally {
      finishAnalysis();
    }
  }, [startAnalysis, setError, finishAnalysis]);

  return { runAnalysis };
}
