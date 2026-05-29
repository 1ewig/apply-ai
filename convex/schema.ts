import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Strongly-typed validator matching ComparisonResult in types.ts
const comparisonResult = v.object({
  score: v.number(),
  fitLevel: v.string(),
  summary: v.string(),
  matchedKeywords: v.array(v.string()),
  missingKeywords: v.array(v.string()),
  strengths: v.array(v.string()),
  gaps: v.array(v.string()),
  suggestions: v.array(
    v.object({
      section: v.string(),
      original: v.string(),
      suggested: v.string(),
      rationale: v.string(),
    })
  ),
  interviewPrep: v.array(
    v.object({
      question: v.string(),
      strategy: v.string(),
    })
  ),
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
