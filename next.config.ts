import type { NextConfig } from "next";

const NODEENV = process.env.NEXT_NODE_ENV
const nextConfig: NextConfig = {
  compiler: {
    removeConsole: NODEENV !== "development",
  },
  experimental: {
    staleTimes: {
      dynamic: 60,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
