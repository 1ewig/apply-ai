import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Retrieve all resumes for the currently authenticated user.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.db
      .query("resumes")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});

/**
 * Add a new resume template.
 */
export const add = mutation({
  args: {
    name: v.string(),
    content: v.string(),
    isDefault: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // If this is set to default, unset any existing default resumes
    if (args.isDefault) {
      const existing = await ctx.db
        .query("resumes")
        .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
        .collect();
      for (const res of existing) {
        if (res.isDefault) {
          await ctx.db.patch(res._id, { isDefault: false });
        }
      }
    }

    const newId = await ctx.db.insert("resumes", {
      userId: identity.subject,
      name: args.name,
      content: args.content,
      isDefault: args.isDefault,
      updatedAt: new Date().toLocaleDateString(),
    });

    return newId;
  },
});

/**
 * Update an existing resume.
 */
export const update = mutation({
  args: {
    id: v.id("resumes"),
    name: v.optional(v.string()),
    content: v.optional(v.string()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const resume = await ctx.db.get(args.id);
    if (!resume || resume.userId !== identity.subject) {
      throw new Error("Unauthorized or resume not found");
    }

    // If setting to default, unset other defaults
    if (args.isDefault) {
      const existing = await ctx.db
        .query("resumes")
        .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
        .collect();
      for (const res of existing) {
        if (res.isDefault && res._id !== args.id) {
          await ctx.db.patch(res._id, { isDefault: false });
        }
      }
    }

    const { id, ...updates } = args;
    await ctx.db.patch(args.id, {
      ...updates,
      updatedAt: new Date().toLocaleDateString(),
    });
  },
});

/**
 * Delete a resume template.
 */
export const remove = mutation({
  args: {
    id: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const resume = await ctx.db.get(args.id);
    if (!resume || resume.userId !== identity.subject) {
      throw new Error("Unauthorized or resume not found");
    }

    await ctx.db.delete(args.id);
  },
});
