import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@noble/ciphers", "@noble/hashes"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
