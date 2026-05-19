import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ComparisonResult type validator for mutation args
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
 * Add a new job application to the user's pipeline.
 */
export const add = mutation({
  args: {
    company: v.string(),
    role: v.string(),
    status: v.string(),
    dateApplied: v.string(),
    url: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
    matchScore: v.optional(v.number()),
    analysisResult: v.optional(comparisonResult),
    resumeUsed: v.optional(v.string()),
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
      analysisResult: args.analysisResult,
      resumeUsed: args.resumeUsed,
    });

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

    const { id, ...updates } = args;
    await ctx.db.patch(args.id, updates);
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

    await ctx.db.delete(args.id);
  },
});
