import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Disable powered by header for security
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/application-board",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
