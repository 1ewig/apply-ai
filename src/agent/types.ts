import { z } from 'zod';

export const agentTaskSeveritySchema = z.enum(['critical', 'warning', 'info']);
export type AgentTaskSeverity = z.infer<typeof agentTaskSeveritySchema>;

export const agentTaskStatusSchema = z.enum([
  'pending',
  'active',
  'completed',
  'working',
  'needs_input',
  'skipped',
]);
export type AgentTaskStatus = z.infer<typeof agentTaskStatusSchema>;

export const agentTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  section: z.string(), // e.g., 'summary', 'experience', 'skills', 'education', 'general'
  severity: agentTaskSeveritySchema,
  estimatedClicks: z.number().min(1).max(5),
  needsUserInput: z.boolean(),
  status: agentTaskStatusSchema.default('pending'),
});
export type AgentTask = z.infer<typeof agentTaskSchema>;

export const resumeSectionSchema = z.object({
  heading: z.string(),
  content: z.string(),
});
export type ResumeSection = z.infer<typeof resumeSectionSchema>;

export const sessionBlueprintSchema = z.object({
  overallScore: z.number().min(0).max(100),
  readinessTier: z.enum(['poor', 'fair', 'good', 'strong']),
  tasks: z.array(agentTaskSchema),
  quickWins: z.array(z.string()),
  blockers: z.array(z.string()),
});
export type SessionBlueprint = z.infer<typeof sessionBlueprintSchema>;

export const jdExtractSchema = z.object({
  roleTitle: z.string(),
  mustHaveKeywords: z.array(z.string()).max(10),
  niceToHaveKeywords: z.array(z.string()).max(10),
  seniorityLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']),
  coreResponsibilities: z.array(z.string()).max(6),
  companyContext: z.string(),
  requiredQualifications: z.array(z.string()).max(10),
  preferredQualifications: z.array(z.string()).max(10),
});
export type JdExtract = z.infer<typeof jdExtractSchema>;

export const matchAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  readinessTier: z.enum(['poor', 'fair', 'good', 'strong']),
  scoreBreakdown: z.object({
    keywordMatch: z.number().min(0).max(100),
    experienceAlignment: z.number().min(0).max(100),
    skillsCoverage: z.number().min(0).max(100),
    educationFit: z.number().min(0).max(100),
  }),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
});
export type MatchAnalysis = z.infer<typeof matchAnalysisSchema>;

export interface ResumeEdit {
  id: string;
  sessionId: string;
  sectionKey: string; // e.g. 'summary', 'experience', etc.
  beforeContent: string;
  afterContent: string;
  reasoning: string;
  scoreImpact: number; // e.g. +10
  status: 'proposed' | 'accepted' | 'rejected' | 'modified';
}
