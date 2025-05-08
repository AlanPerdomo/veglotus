import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.veglotus.com.br', port: '', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '3001', pathname: '/**' },
      { protocol: 'http', hostname: '192.168.1.5', port: '3001', pathname: '/**' },
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
