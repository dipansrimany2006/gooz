import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ignore pino-pretty in client-side bundles
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'pino-pretty': false,
      };
    }
    return config;
  },
};

export default nextConfig;
