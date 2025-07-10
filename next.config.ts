import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable experimental features like server actions
  experimental: {
    serverActions: {
      bodySizeLimit: 10 * 1024 * 1024, // 10 MB limit for server actions
    },
  },

  // Configure external image domains for Next.js Image Optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hdwfpfxyzubfksctezkz.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Optional: Disable telemetry (for dev performance/privacy)
  telemetry: false,

  // Optional: Disable eslint/type-check in dev to speed up hot reloads
  // NOTE: Only enable these if you use a separate tool or it's slow in dev
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
