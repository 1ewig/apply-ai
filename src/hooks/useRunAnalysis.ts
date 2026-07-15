import { useCallback } from 'react';
import { useAnalysisStore } from '@/stores/useAnalysisStore';

export function useRunAnalysis() {
  const { startAnalysis, setError, finishAnalysis, setAbortController } = useAnalysisStore();

  const runAnalysis = useCallback(async (jobId: string, resumeContent: string, jobDescription: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60_000);

    startAnalysis(jobId);
    setAbortController(controller);
    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: resumeContent, jobDescription }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to compare resume and job description.');
      return data;
    } catch (err: any) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        const wasManuallyCanceled = !useAnalysisStore.getState().isLoading;
        if (wasManuallyCanceled) {
          finishAnalysis();
          throw err;
        }
      }

      const message = err.name === 'AbortError'
        ? 'Analysis timed out after 60 seconds. Please try again.'
        : err.message || 'An unexpected error occurred. Please try again.';

      const retryAction = () => runAnalysis(jobId, resumeContent, jobDescription);
      setError(message, retryAction, 'Failed to Analyze Alignment');
      throw err;
    } finally {
      finishAnalysis();
    }
  }, [startAnalysis, setError, finishAnalysis, setAbortController]);

  return { runAnalysis };
}
