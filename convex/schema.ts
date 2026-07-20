import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const agentTask = v.object({
  id: v.string(),
  title: v.string(),
  section: v.string(),
  severity: v.string(),
  estimatedClicks: v.number(),
  needsUserInput: v.boolean(),
  status: v.string(),
});

const resumeSection = v.object({
  heading: v.string(),
  content: v.string(),
});

const jdExtractValidator = v.object({
  roleTitle: v.string(),
  mustHaveKeywords: v.array(v.string()),
  niceToHaveKeywords: v.array(v.string()),
  seniorityLevel: v.string(),
  coreResponsibilities: v.array(v.string()),
  companyContext: v.string(),
  requiredQualifications: v.array(v.string()),
  preferredQualifications: v.array(v.string()),
});

const comparisonResult = v.object({
  overallScore: v.number(),
  readinessTier: v.string(),
  tasks: v.array(agentTask),
  quickWins: v.array(v.string()),
  blockers: v.array(v.string()),
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
    previousResult: v.optional(comparisonResult),
    parsedResume: v.array(resumeSection),
    jdExtract: v.optional(jdExtractValidator),
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
