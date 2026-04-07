import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // تأكد من إضافة https:// في البداية
        destination: 'https://fullstack-lms-platform-production.up.railway.app/api/:path*', 
      },
    ]
  },
  /* config options here */
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true, 
    contentDispositionType: 'attachment', 
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      
    ],
  },
};

export default nextConfig;
