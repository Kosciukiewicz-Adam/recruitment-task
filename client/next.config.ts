import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: "http://localhost:4000"
  }
};

export default nextConfig;
