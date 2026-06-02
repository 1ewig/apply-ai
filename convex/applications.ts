import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ComparisonResult type validator for mutation args
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

/**
 * Retrieve all job applications for the currently authenticated user.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.db
      .query("applications")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});

/**
 * Retrieve the AI analysis result for a specific application.
 */
export const getAnalysis = query({
  args: { applicationId: v.id("applications") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const analysis = await ctx.db
      .query("analyses")
      .withIndex("by_applicationId", (q) => q.eq("applicationId", args.applicationId))
      .first();

    if (!analysis || analysis.userId !== identity.subject) {
      return null;
    }

    return analysis.result;
  },
});

/**
 * Add a new job application to the user's pipeline.
 */
export const add = mutation({
  args: {
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    status: v.string(),
    dateApplied: v.string(),
    url: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
    matchScore: v.optional(v.number()),
    analysisResult: v.optional(comparisonResult),
    resumeUsed: v.optional(v.string()),
    customResumeContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Must be logged in to add application.");
    }

    const newId = await ctx.db.insert("applications", {
      userId: identity.subject,
      company: args.company,
      role: args.role,
      status: args.status,
      dateApplied: args.dateApplied,
      url: args.url,
      jobDescription: args.jobDescription,
      matchScore: args.matchScore,
      resumeUsed: args.resumeUsed,
      customResumeContent: args.customResumeContent,
    });

    if (args.analysisResult) {
      await ctx.db.insert("analyses", {
        applicationId: newId,
        userId: identity.subject,
        result: args.analysisResult,
        updatedAt: new Date().toISOString(),
      });
    }

    return newId;
  },
});

/**
 * Update an existing job application.
 */
export const update = mutation({
  args: {
    id: v.id("applications"),
    company: v.optional(v.string()),
    role: v.optional(v.string()),
    status: v.optional(v.string()),
    dateApplied: v.optional(v.string()),
    url: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
    matchScore: v.optional(v.number()),
    analysisResult: v.optional(comparisonResult),
    resumeUsed: v.optional(v.string()),
    customResumeContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const app = await ctx.db.get(args.id);
    if (!app || app.userId !== identity.subject) {
      throw new Error("Unauthorized or application not found");
    }

    const { id, analysisResult, ...updates } = args;
    await ctx.db.patch(args.id, updates);

    if (analysisResult) {
      const existing = await ctx.db
        .query("analyses")
        .withIndex("by_applicationId", (q) => q.eq("applicationId", args.id))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          result: analysisResult,
          previousResult: existing.result,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await ctx.db.insert("analyses", {
          applicationId: args.id,
          userId: identity.subject,
          result: analysisResult,
          updatedAt: new Date().toISOString(),
        });
      }
    }
  },
});

/**
 * Delete a job application.
 */
export const remove = mutation({
  args: {
    id: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const app = await ctx.db.get(args.id);
    if (!app || app.userId !== identity.subject) {
      throw new Error("Unauthorized or application not found");
    }

    // Delete associated analysis if any
    const existing = await ctx.db
      .query("analyses")
      .withIndex("by_applicationId", (q) => q.eq("applicationId", args.id))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }

    await ctx.db.delete(args.id);
  },
});
