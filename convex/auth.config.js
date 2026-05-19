export default {
  providers: [
    {
      // Replace with your Clerk JWT Template Issuer URL (from Clerk Dashboard > JWT Templates > Convex)
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN || "https://your-clerk-instance-domain-goes-here.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
