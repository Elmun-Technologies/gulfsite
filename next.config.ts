import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Docker deploy uchun o'z-o'zi yetarli server (`server.js`).
   * `next start` ham ishlashda davom etadi — standalone qo'shimcha artefakt.
   */
  output: 'standalone',
  poweredByHeader: false,
  compress: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'gulfflavours.ae' },
      { protocol: 'https', hostname: 'gulfflavours.ru' },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }],
      },
    ];
  },

  async redirects() {
    return [
      { source: '/uzbekistan', destination: '/uz', permanent: true },
      { source: '/admin', destination: '/uz/admin', permanent: false },
    ];
  },
};

export default nextConfig;
