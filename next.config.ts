import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add the ESLint configuration here
  eslint: {
    // This will prevent ESLint from running during the build process on Vercel
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      // Your existing pattern for AWS S3
      {
        protocol: 'https',
        hostname: 'shaq-portfolio-webapp.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      // Add this new pattern for Google User Avatars
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
    ],
  },
};

export default nextConfig;