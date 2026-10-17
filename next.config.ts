import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@noble/ciphers", "@noble/hashes"],
  eslint: {
    // Do not fail Cloudflare Pages builds on lint noise
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
