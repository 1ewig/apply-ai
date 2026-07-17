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

export const jdExtractSchema = z.object({
  roleTitle: z.string(),
  mustHaveKeywords: z.array(z.string()),
  niceToHaveKeywords: z.array(z.string()),
  seniorityLevel: z.string(),
  coreResponsibilities: z.array(z.string()),
  companyContext: z.string(),
});
export type JdExtract = z.infer<typeof jdExtractSchema>;

export const sessionBlueprintSchema = z.object({
  overallScore: z.number().min(0).max(100),
  readinessTier: z.enum(['poor', 'fair', 'good', 'strong']),
  tasks: z.array(agentTaskSchema),
  jdExtract: jdExtractSchema,
  quickWins: z.array(z.string()),
  blockers: z.array(z.string()),
});
export type SessionBlueprint = z.infer<typeof sessionBlueprintSchema>;

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
