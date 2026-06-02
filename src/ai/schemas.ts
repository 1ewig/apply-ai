import { z } from "zod";

export const enhancedKeywordSchema = z.object({
  keyword: z.string(),
  category: z.enum(["language", "framework", "tool", "domain", "soft_skill", "education", "certification", "other"]),
  importance: z.enum(["required", "preferred"]),
  matchContext: z.string().optional(),
  whyImportant: z.string().optional(),
});

export const suggestionSchema = z.object({
  section: z.string(),
  original: z.string(),
  suggested: z.string(),
  rationale: z.string(),
});

export const interviewPrepSchema = z.object({
  question: z.string(),
  strategy: z.string(),
  round: z.enum(["phone", "technical", "behavioral", "system_design", "onsite", "general"]).optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
});

export const scoreBreakdownSchema = z.object({
  technicalSkills: z.number().min(0).max(100),
  experience: z.number().min(0).max(100),
  keywordMatch: z.number().min(0).max(100),
  seniorityFit: z.number().min(0).max(100),
});

export const structureSuggestionSchema = z.object({
  type: z.enum(["reorder", "add_section", "remove_section", "expand", "condense", "quantify", "reformat"]),
  section: z.string(),
  suggestion: z.string(),
  rationale: z.string(),
  priority: z.enum(["high", "medium", "low"]),
});

export const skillRecommendationSchema = z.object({
  skill: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  reason: z.string(),
  learningSuggestion: z.string(),
});

export const actionItemSchema = z.object({
  priority: z.enum(["critical", "recommended", "optional"]),
  action: z.string(),
  impact: z.string(),
  effort: z.enum(["low", "medium", "high"]),
});

export const atsIssueSchema = z.object({
  severity: z.enum(["error", "warning", "info"]),
  message: z.string(),
  suggestion: z.string(),
});

export const atsCheckSchema = z.object({
  score: z.number().min(0).max(100),
  issues: z.array(atsIssueSchema),
  formatting: z.string(),
});

export const comparisonResultSchema = z.object({
  score: z.number().min(0).max(100),
  fitLevel: z.enum(["Excellent Match", "Strong Match", "Good Match", "Fair Match", "Needs Work"]),
  summary: z.string(),
  matchedKeywords: z.array(enhancedKeywordSchema),
  missingKeywords: z.array(enhancedKeywordSchema),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  suggestions: z.array(suggestionSchema),
  structureSuggestions: z.array(structureSuggestionSchema).optional(),
  interviewPrep: z.array(interviewPrepSchema),
  coverLetterDraft: z.string().optional(),
  skillRecommendations: z.array(skillRecommendationSchema).optional(),
  actionItems: z.array(actionItemSchema).optional(),
  atsCheck: atsCheckSchema.optional(),
  scoreBreakdown: scoreBreakdownSchema.optional(),
});

export type ComparisonResult = z.infer<typeof comparisonResultSchema>;
export type EnhancedKeyword = z.infer<typeof enhancedKeywordSchema>;
export type ScoreBreakdown = z.infer<typeof scoreBreakdownSchema>;
export type StructureSuggestion = z.infer<typeof structureSuggestionSchema>;
export type SkillRecommendation = z.infer<typeof skillRecommendationSchema>;
export type ActionItem = z.infer<typeof actionItemSchema>;
export type AtsCheck = z.infer<typeof atsCheckSchema>;
