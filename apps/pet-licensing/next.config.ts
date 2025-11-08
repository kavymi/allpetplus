import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@pet/domain', '@pet/shared'],
  
  // Module Federation for micro-frontend integration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Expose components to be consumed by dashboard
      config.output = config.output || {};
      config.output.publicPath = 'auto';
    }
    return config;
  },

  // Environment
  env: {
    NEXT_PUBLIC_DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000',
  },
};

export default nextConfig;


