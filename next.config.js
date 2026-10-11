/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Required for OpenNext on Cloudflare
  // output: undefined (OpenNext handles this)
};

module.exports = nextConfig;
