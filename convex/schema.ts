import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Strongly-typed validator matching ComparisonResult in types.ts
const enhancedKeyword = v.object({
  keyword: v.string(),
  category: v.string(),
  importance: v.string(),
  matchContext: v.optional(v.string()),
  whyImportant: v.optional(v.string()),
});

const suggestion = v.object({
  section: v.string(),
  original: v.string(),
  suggested: v.string(),
  rationale: v.string(),
});

const interviewPrep = v.object({
  question: v.string(),
  strategy: v.string(),
  round: v.optional(v.string()),
  difficulty: v.optional(v.string()),
});

const scoreBreakdown = v.object({
  technicalSkills: v.number(),
  experience: v.number(),
  keywordMatch: v.number(),
  seniorityFit: v.number(),
});

const structureSuggestion = v.object({
  type: v.string(),
  section: v.string(),
  suggestion: v.string(),
  rationale: v.string(),
  priority: v.string(),
});

const skillRecommendation = v.object({
  skill: v.string(),
  priority: v.string(),
  reason: v.string(),
  learningSuggestion: v.string(),
});

const actionItem = v.object({
  priority: v.string(),
  action: v.string(),
  impact: v.string(),
  effort: v.string(),
});

const atsIssue = v.object({
  severity: v.string(),
  message: v.string(),
  suggestion: v.string(),
});

const atsCheck = v.object({
  score: v.number(),
  issues: v.array(atsIssue),
  formatting: v.string(),
});

const comparisonResult = v.object({
  score: v.number(),
  fitLevel: v.string(),
  summary: v.string(),
  scoreBreakdown: v.optional(scoreBreakdown),
  matchedKeywords: v.array(enhancedKeyword),
  missingKeywords: v.array(enhancedKeyword),
  strengths: v.array(v.string()),
  gaps: v.array(v.string()),
  suggestions: v.array(suggestion),
  structureSuggestions: v.optional(v.array(structureSuggestion)),
  interviewPrep: v.array(interviewPrep),
  coverLetterDraft: v.optional(v.string()),
  skillRecommendations: v.optional(v.array(skillRecommendation)),
  actionItems: v.optional(v.array(actionItem)),
  atsCheck: v.optional(atsCheck),
});

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  applications: defineTable({
    userId: v.string(), // Maps to the user's Clerk user ID
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    status: v.string(), // "wishlist" | "applied" | "interviewing" | "offer" | "rejected"
    dateApplied: v.string(),
    url: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
    matchScore: v.optional(v.number()),
    resumeUsed: v.optional(v.string()),
    customResumeContent: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  analyses: defineTable({
    applicationId: v.id("applications"),
    userId: v.string(), // Maps to the user's Clerk user ID
    result: comparisonResult,
    updatedAt: v.string(),
  }).index("by_applicationId", ["applicationId"])
    .index("by_userId", ["userId"]),

  resumes: defineTable({
    userId: v.string(), // Maps to the user's Clerk user ID
    name: v.string(),
    content: v.string(),
    isDefault: v.boolean(),
    updatedAt: v.string(),
  }).index("by_userId", ["userId"]),
});
