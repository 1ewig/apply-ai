import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Retrieve the current authenticated user's resume.
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("resumes")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();
  },
});

/**
 * Save or update the authenticated user's resume content.
 */
export const save = mutation({
  args: {
    name: v.string(),
    text: v.string(),
    matchScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db
      .query("resumes")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (existing === null) {
      await ctx.db.insert("resumes", {
        userId: identity.subject,
        name: args.name,
        text: args.text,
        matchScore: args.matchScore,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.patch(existing._id, {
        name: args.name,
        text: args.text,
        matchScore: args.matchScore,
        updatedAt: Date.now(),
      });
    }
  },
});
