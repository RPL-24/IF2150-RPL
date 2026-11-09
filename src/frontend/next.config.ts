import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  async rewrites() {
    return [
      {
        // Only the QR demo confirmation is proxied from LAN/tunnel visitors.
        // Do not expose the entire FastAPI surface through the Next dev server.
        source: '/api/pembayaran/scan/:token',
        destination: 'http://localhost:8000/api/pembayaran/scan/:token',
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
