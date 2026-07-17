'use client';

import { useEffect } from 'react';
import type { JobApplication, Resume } from '@/types';
import { useAnalysisStore } from '@/stores/useAnalysisStore';

interface MatchAnalysisDetailProps {
  job: JobApplication;
  previousAnalysisResult?: any;
  resumes: Resume[];
  resumeForReRun?: Resume;
  expandedPrepIndex: number | null;
  onTogglePrepItem: (index: number) => void;
  onBackClick: () => void;
  onReRunAnalysis: (jobId: string, resumeContent: string, jobDesc: string) => void;
  onSaveChanges: (id: string, data: Partial<JobApplication>) => Promise<unknown>;
}

export default function MatchAnalysisDetail({
  job,
  resumeForReRun,
  onBackClick,
}: MatchAnalysisDetailProps) {
  const initializeSession = useAnalysisStore((state) => state.initializeSession);
  const proposeEdit = useAnalysisStore((state) => state.proposeEdit);
  const activeSessionId = useAnalysisStore((state) => state.activeSessionId);

  useEffect(() => {
    if (job && job.id !== activeSessionId) {
      const rawResume = job.customResumeContent || resumeForReRun?.content || '';

      // Check if job has direct blueprint results, otherwise load fallback mockblueprint for testing
      const blueprint = (job.analysisResult as any)?.tasks
        ? (job.analysisResult as any)
        : {
            overallScore: job.matchScore || 65,
            readinessTier: 'fair' as const,
            tasks: [
              {
                id: 'task-1',
                title: 'Align experience bullets with must-have keywords',
                section: 'EXPERIENCE',
                severity: 'critical' as const,
                estimatedClicks: 3,
                needsUserInput: false,
                status: 'active' as const,
              },
              {
                id: 'task-2',
                title: 'Optimize professional summary for seniority fit',
                section: 'SUMMARY',
                severity: 'warning' as const,
                estimatedClicks: 2,
                needsUserInput: false,
                status: 'pending' as const,
              },
              {
                id: 'task-3',
                title: 'Add missing Docker and Kubernetes technical skills',
                section: 'SKILLS',
                severity: 'critical' as const,
                estimatedClicks: 1,
                needsUserInput: true,
                status: 'needs_input' as const,
              },
            ],
            parsedResume: [
              {
                heading: 'SUMMARY',
                content: 'Results-driven software developer with expertise in building responsive applications.',
              },
              {
                heading: 'EXPERIENCE',
                content: 'Software Engineer @ ApplyAI Inc. (2024-Present)\n- Developed software features.\n- Collaborated with product teams to design web application interfaces.',
              },
              {
                heading: 'SKILLS',
                content: 'Languages: JavaScript, HTML, CSS, SQL.\nFrameworks: React, Next.js, Node.js.',
              },
            ],
            quickWins: ['Add React & TypeScript to skills section'],
            blockers: ['No clear years of experience mentioned in resume for Kubernetes'],
          };

      initializeSession(job.id, blueprint, job.role, job.company);

      // Trigger initial proposed edits simulation for Task 1
      setTimeout(() => {
        proposeEdit({
          id: 'edit-1',
          sessionId: job.id,
          sectionKey: 'EXPERIENCE',
          beforeContent: 'Developed software features.',
          afterContent: 'Engineered high-performance React features using TypeScript, boosting responsive page load speed by 25%.',
          reasoning: 'Quantifies impact and introduces missing must-have keywords (React, TypeScript).',
          scoreImpact: 8,
          status: 'proposed',
        });
      }, 1500);
    }
  }, [job?.id, activeSessionId, resumeForReRun?.content, initializeSession, proposeEdit, job]);

  return null;
}
