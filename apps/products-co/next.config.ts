import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@pet/domain', '@pet/shared', '@pet/api'],
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    // Disable static generation for now due to hook issues
  },
};

export default nextConfig;
