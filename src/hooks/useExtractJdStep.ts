'use client';

import { useState, useCallback } from 'react';
import { useAnalysisStore } from '@/stores/useAnalysisStore';

interface UseExtractJdStepProps {
  jobDescription: string;
  onSaveChanges: (id: string, data: any) => Promise<unknown>;
  jobId: string;
}

export function useExtractJdStep({ jobDescription, onSaveChanges, jobId }: UseExtractJdStepProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const addChatMessage = useAnalysisStore((s) => s.addChatMessage);

  const runExtractJd = useCallback(async () => {
    if (isExtracting || !jobDescription.trim()) return;
    setIsExtracting(true);

    addChatMessage({
      role: 'assistant',
      content: '🔍 **Step 2 in progress:** Extracting key requirements and keywords from the job description...',
      type: 'agent-text',
    });

    try {
      const response = await fetch('/api/plan/extract-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdText: jobDescription }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to extract job description details.');
      }

      const data = await response.json();

      useAnalysisStore.setState({ jdExtract: data });
      await onSaveChanges(jobId, { jdExtract: data });

      addChatMessage({
        role: 'assistant',
        content: `✅ **Step 2 Complete: JD Extracted!** I've identified the key requirements for **${data.roleTitle}**. Check the **JD** tab in the right reference panel for details.`,
        type: 'agent-text',
      });
    } catch (err: any) {
      console.error(err);
      addChatMessage({
        role: 'assistant',
        content: `❌ **Step 2 Failed:** ${err.message || 'Failed to extract job description details.'}`,
        type: 'agent-text',
        meta: { retryable: true, retryStep: 'extract-jd' },
      });
    } finally {
      setIsExtracting(false);
    }
  }, [isExtracting, jobDescription, addChatMessage, onSaveChanges, jobId]);

  return { isExtracting, runExtractJd };
}
