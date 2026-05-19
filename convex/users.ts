import { mutation } from "./_generated/server";

/**
 * Syncs the currently logged-in Clerk user details with our Convex database.
 * If the user doesn't exist, it creates one. If they do, it updates their profile.
 */
export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Must be logged in to sync user.");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user === null) {
      // New user registration
      await ctx.db.insert("users", {
        clerkId: identity.subject,
        email: identity.email ?? "",
        name: identity.name,
        createdAt: Date.now(),
      });
    } else {
      // Existing user profile update (if email or name changed)
      if (user.email !== identity.email || user.name !== identity.name) {
        await ctx.db.patch(user._id, {
          email: identity.email ?? "",
          name: identity.name,
        });
      }
    }
  },
});
