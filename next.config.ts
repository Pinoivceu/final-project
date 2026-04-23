import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from the local public/uploads directory
    remotePatterns: [],
    localPatterns: [
      {
        pathname: '/uploads/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
