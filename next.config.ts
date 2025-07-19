import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
let imageHost = 'localhost';
try {
  imageHost = new URL(process.env.NEXT_PUBLIC_API_URL || '').hostname;
} catch (e) {
  console.warn('⚠️ Invalid NEXT_PUBLIC_API_URL, fallback to "localhost"');
}

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // ❗️Отключает двойной рендер
  images: {
    remotePatterns: 
       [
        {
          protocol: isProd ? 'https': 'http',
          hostname: imageHost,       
          pathname: '/media/**',
        },
      ]    
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

// для прода
// {
//   protocol: 'https',
//   hostname: 'api.mysite.com',
//   pathname: '/media/**',
// }
