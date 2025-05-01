import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['i.imgur.com', 'xalingo.vteximg.com.br', 'storage.cloud.google.com', 'storage.googleapis.com'],
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'i.imgur.com',
    //     port: '',
    //     pathname: '/**',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'xalingo.vteximg.com.br',
    //     port: '',
    //     pathname: '/**',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'storage.cloud.google.com',
    //     port: '',
    //     pathname: '/**',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'storage.googleapis.com',
    //     port: '',
    //     pathname: '/**',
    //   },
    // ],
  },
};

export default nextConfig;
