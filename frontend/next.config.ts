import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/api/qwen/:path*",
        destination: "http://localhost:8080/api/qwen/:path*",
      },
    ];
  },
};

export default nextConfig;
