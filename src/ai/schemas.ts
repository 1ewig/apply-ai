import { z } from "zod";

export const suggestionSchema = z.object({
  section: z.string(),
  original: z.string(),
  suggested: z.string(),
  rationale: z.string(),
});

export const interviewPrepSchema = z.object({
  question: z.string(),
  strategy: z.string(),
});

export const comparisonResultSchema = z.object({
  score: z.number().min(0).max(100),
  fitLevel: z.enum(["Excellent Match", "Strong Match", "Good Match", "Fair Match", "Needs Work"]),
  summary: z.string(),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  suggestions: z.array(suggestionSchema),
  interviewPrep: z.array(interviewPrepSchema),
});

export type ComparisonResult = z.infer<typeof comparisonResultSchema>;
