import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Disable powered by header for security
  poweredByHeader: false,
};

export default nextConfig;
