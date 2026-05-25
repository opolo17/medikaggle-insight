import type { NextConfig } from "next";

/** Relative path only — avoids OneDrive breaking `.next` symlinks on Windows */
const nextConfig: NextConfig = {
  distDir: "node_modules/.cache/next",
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
