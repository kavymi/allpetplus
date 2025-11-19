import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable static optimization to avoid SSR errors
  output: 'standalone',
  reactStrictMode: true,
  // Skip static page generation for problematic routes
  async redirects() {
    return [];
  },
};

export default nextConfig;
