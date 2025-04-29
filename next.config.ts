import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'xalingo.vteximg.com.br',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
