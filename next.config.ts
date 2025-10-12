import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable to prevent double-mounting WebSocket in dev
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
