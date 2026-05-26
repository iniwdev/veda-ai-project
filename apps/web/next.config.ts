import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Transpile local workspace packages (source-only, no build step)
  transpilePackages: ["@repo/ui", "@repo/types"],

  // Point Turbopack to monorepo root (absolute path required)
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },

  // Production optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // Image domains for Next.js Image (extend as needed)
  images: {
    remotePatterns: [],
  },

  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_APP_NAME: "AI Assessment Creator",
  },
};

export default nextConfig;
