import type { NextConfig } from 'next';

/**
 * Clickjacking himoyasi: production'da BARCHA sahifalar `SAMEORIGIN`
 * (lead formalari bor — /contact, /samples, /quote). Faqat dev serverda
 * (cross-origin preview iframe, masalan *.e2b.app) yoki aniq
 * `ALLOW_FRAMING=1` berilganda ommaviy sahifalar iframe'ga ruxsat oladi.
 * Admin har doim himoyalangan.
 */
const allowFraming =
  process.env.NODE_ENV !== 'production' || process.env.ALLOW_FRAMING === '1';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['*.e2b.app'],
  /**
   * Docker deploy uchun o'z-o'zi yetarli server (`server.js`).
   * `next start` ham ishlashda davom etadi — standalone qo'shimcha artefakt.
   *
   * Vercel'da BU YOQILMASLIGI KERAK: standalone rejimi Vercel serverless
   * funksiyalari uchun zarur `.next/*.nft.json` fayllarini yaratmaydi va
   * build "ENOENT: next-server.js.nft.json" xatosi bilan yiqiladi. Shuning
   * uchun faqat Vercel muhitidan tashqarida (Docker build) yoqamiz.
   */
  output: process.env.VERCEL ? undefined : 'standalone',
  poweredByHeader: false,
  compress: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    /** monogram PNG'lari 90 sifatda chiqadi (shaffoflik + ranglar) */
    qualities: [75, 90],
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
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
      ...(allowFraming
        ? []
        : [{ source: '/:path*', headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }] }]),
      {
        source: '/:locale/admin/:path*',
        headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
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
