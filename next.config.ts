import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['i.imgur.com', 'veglotus.com.br', 'cdn.discordapp.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
