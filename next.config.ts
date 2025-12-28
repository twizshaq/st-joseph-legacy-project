import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-expect-error - 'eslint' type definition is missing in this Next.js version but valid at runtime
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // 1. REMOVE the "domains" array entirely
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'shaq-portfolio-webapp.s3.us-east-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/**',
      },
      // IMPORTANT: Add your Supabase domain here 
      // Replace 'YOUR_PROJECT_ID' with your actual Supabase project ID
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;