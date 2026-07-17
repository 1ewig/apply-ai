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
      // Determine resume sections map (flat or split by common headers)
      const rawResume = job.customResumeContent || resumeForReRun?.content || '';
      const initialSections: Record<string, string> = {};

      if (rawResume.includes('EXPERIENCE') || rawResume.includes('Experience')) {
        // Split by standard section headers for richer UI segmentation
        const parts = rawResume.split(/(?=SUMMARY|EXPERIENCE|SKILLS|EDUCATION|Summary|Experience|Skills|Education)/i);
        parts.forEach((part) => {
          const match = part.match(/^(SUMMARY|EXPERIENCE|SKILLS|EDUCATION|Summary|Experience|Skills|Education)/i);
          if (match) {
            const heading = match[0].trim().toUpperCase();
            initialSections[heading] = part.replace(/^[^\n]*\n/, '').trim();
          } else {
            initialSections['GENERAL'] = (initialSections['GENERAL'] || '') + '\n' + part.trim();
          }
        });
      } else {
        initialSections['RESUME'] = rawResume;
      }

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
            jdExtract: {
              roleTitle: job.role || 'Software Engineer',
              mustHaveKeywords: ['React', 'TypeScript', 'Node.js', 'Docker'],
              niceToHaveKeywords: ['Kubernetes', 'Next.js', 'Convex'],
              seniorityLevel: 'Senior',
              coreResponsibilities: [
                'Design robust reactive architectures',
                'Write clean and testable TypeScript code',
                'Deploy services containerized via Docker',
              ],
              companyContext: job.company || 'ApplyAI Inc.',
            },
            quickWins: ['Add React & TypeScript to skills section'],
            blockers: ['No clear years of experience mentioned in resume for Kubernetes'],
          };

      initializeSession(job.id, blueprint, initialSections);

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
