import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // ❗️Отключает двойной рендер
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;

// для прода
// {
//   protocol: 'https',
//   hostname: 'api.mysite.com',
//   pathname: '/media/**',
// }
