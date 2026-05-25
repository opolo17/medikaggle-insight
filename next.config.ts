import type { NextConfig } from "next";

/** Relative path only — avoids OneDrive breaking `.next` symlinks on Windows */
const nextConfig: NextConfig = {
  distDir: "node_modules/.cache/next",
};

export default nextConfig;
