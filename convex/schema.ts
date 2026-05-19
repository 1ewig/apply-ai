import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  applications: defineTable({
    userId: v.string(), // Maps to the user's Clerk user ID
    companyName: v.string(),
    jobTitle: v.string(),
    status: v.string(), // "applied" | "interviewing" | "offered" | "rejected"
    salary: v.optional(v.string()),
    location: v.optional(v.string()),
    appliedDate: v.string(),
    jobDescription: v.optional(v.string()),
    notes: v.optional(v.string()),
    matchScore: v.optional(v.number()),
    matchAnalysis: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  resumes: defineTable({
    userId: v.string(), // Maps to the user's Clerk user ID
    name: v.string(),
    text: v.string(),
    matchScore: v.optional(v.number()),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),
});
