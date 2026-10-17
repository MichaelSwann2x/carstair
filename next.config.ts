import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Avoid transpile surprises on Cloudflare Pages
  transpilePackages: ["@noble/ciphers", "@noble/hashes"],
};

export default nextConfig;
