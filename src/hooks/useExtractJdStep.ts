'use client';

import { useState, useCallback } from 'react';
import { useAnalysisStore } from '@/stores/useAnalysisStore';

interface UseExtractJdStepProps {
  jobDescription: string;
  onSaveChanges: (id: string, data: any) => Promise<unknown>;
  jobId: string;
  jobRole?: string;
  jobCompany?: string;
}

export function useExtractJdStep({ jobDescription, onSaveChanges, jobId, jobRole, jobCompany }: UseExtractJdStepProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const addChatMessage = useAnalysisStore((s) => s.addChatMessage);

  const runExtractJd = useCallback(async () => {
    if (isExtracting || !jobId || !jobDescription.trim()) return;
    setIsExtracting(true);

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

      const updates: Record<string, any> = { jdExtract: data };
      const isRoleEmpty = !jobRole || !jobRole.trim() || jobRole === 'Unnamed Role';
      if (isRoleEmpty && data.roleTitle && data.roleTitle.trim()) {
        updates.role = data.roleTitle.trim();
      }

      const isCompanyEmpty = !jobCompany || !jobCompany.trim() || jobCompany === 'Unnamed Company';
      if (isCompanyEmpty && data.companyName && data.companyName.trim()) {
        updates.company = data.companyName.trim();
      }

      await onSaveChanges(jobId, updates);

      addChatMessage({
        role: 'assistant',
        content: `I've analyzed the job description for **${data.roleTitle}**. You can see the full breakdown in the Job Desc tab on the right.`,
        type: 'agent-text',
      });
    } catch (err: any) {
      console.error(err);
      addChatMessage({
        role: 'assistant',
        content: `I had trouble reading the job description. ${err.message || 'Failed to extract job description details.'}`,
        type: 'agent-text',
        meta: { retryable: true, retryStep: 'extract-jd' },
      });
    } finally {
      setIsExtracting(false);
    }
  }, [isExtracting, jobDescription, addChatMessage, onSaveChanges, jobId, jobRole, jobCompany]);

  return { isExtracting, runExtractJd };
}
