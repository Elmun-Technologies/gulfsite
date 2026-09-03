/**
 * ROBOTS.TXT
 * ----------------------------------------------------------------
 * Hamma narsa ochiq, bundan mustasno:
 *   - /admin va /api (ichki tizimlar — indekslanmasligi shart)
 *   - katalogning chuqur filtr kombinatsiyalari (?page=2 va h.k.) —
 *     ular crawl budget'ni yeb qo'yadi va duplikat hisoblanadi.
 *
 * Sitemap manzili SITE_URL'dan yig'iladi, shuning uchun staging va
 * production o'z-o'zidan to'g'ri ko'rsatiladi.
 */

import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/_next/', '/uz/admin', '/ru/admin', '/en/admin'],
      },
      {
        // Crawl byudjetini tejash: chuqur sahifalashni yopamiz
        userAgent: '*',
        disallow: ['*?page='],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
