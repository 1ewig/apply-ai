import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
    companyName: v.string(),
    jobTitle: v.string(),
    status: v.string(),
    salary: v.optional(v.string()),
    location: v.optional(v.string()),
    appliedDate: v.string(),
    jobDescription: v.optional(v.string()),
    notes: v.optional(v.string()),
    matchScore: v.optional(v.number()),
    matchAnalysis: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Must be logged in to add application.");
    }

    const newId = await ctx.db.insert("applications", {
      userId: identity.subject,
      companyName: args.companyName,
      jobTitle: args.jobTitle,
      status: args.status,
      salary: args.salary,
      location: args.location,
      appliedDate: args.appliedDate,
      jobDescription: args.jobDescription,
      notes: args.notes,
      matchScore: args.matchScore,
      matchAnalysis: args.matchAnalysis,
    });

    return newId;
  },
});

/**
 * Update pipeline status for a specific application (e.g. during board drag-n-drop).
 */
export const updateStatus = mutation({
  args: {
    id: v.id("applications"),
    status: v.string(),
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

    await ctx.db.patch(args.id, { status: args.status });
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
