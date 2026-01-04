import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['react-icons'],
  images: {
    domains: ['localhost'],
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '5000', pathname: '/uploads/**' },
    ],
  },  
};

export default nextConfig;
