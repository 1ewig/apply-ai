import { useState, useEffect } from 'react';

const LOADING_PHASES = [
  'Initializing ApplyAI secure analyzer...',
  'Parsing resume structure and key sections...',
  'Extracting technical skills and core competencies...',
  'Analyzing job description requirements...',
  'Calculating semantic match and keywords coverage...',
  'Generating optimized resume bullets and suggestions...',
  'Formulating targeted interview prep strategy...',
];

export function useAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      setLoadingPhase(0);
      interval = setInterval(() => {
        setLoadingPhase((prev) => {
          if (prev < LOADING_PHASES.length - 1) return prev + 1;
          return prev;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const runAnalysis = async (jobId: string, resumeContent: string, jobDescription: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || (process.env as any).VITE_API_KEY;
      if (apiKey) headers['x-api-key'] = apiKey;

      const response = await fetch('/api/compare', {
        method: 'POST',
        headers,
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
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { isLoading, loadingPhase, phases: LOADING_PHASES, error, runAnalysis, clearError };
}
