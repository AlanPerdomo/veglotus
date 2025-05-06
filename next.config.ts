import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.veglotus.com.br', port: '', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '3001', pathname: '/**' },
    ],
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
