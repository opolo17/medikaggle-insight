import type { NextConfig } from "next";

/**
 * Custom distDir only for local Windows + OneDrive (avoids EINVAL readlink).
 * Vercel must use the default `.next` output or deploy fails.
 */
const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  ...(isVercel ? {} : { distDir: "node_modules/.cache/next" }),
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/icon",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
