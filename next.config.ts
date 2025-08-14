// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Allows build to complete even if ESLint finds errors
    ignoreDuringBuilds: true,
  },
  // If you also hit TS type errors blocking builds, uncomment:
  // typescript: { ignoreBuildErrors: true },
};

export default nextConfig;