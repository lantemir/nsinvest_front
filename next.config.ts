import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Получаем hostname из NEXT_PUBLIC_API_URL
let hostnameFromEnv = "localhost";
try {
  const parsed = new URL(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");
  hostnameFromEnv = parsed.hostname;
} catch {
  console.warn("⚠️ Could not parse NEXT_PUBLIC_API_URL, fallback to localhost");
}

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: hostnameFromEnv,
        pathname: "/media/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
