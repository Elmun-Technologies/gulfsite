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
        // `/_next/` YOPILMAYDI: Googlebot sahifani render qilish uchun
        // `/_next/static` dagi CSS/JS ni yuklashi shart — yopilsa sahifa
        // "stilsiz/bo'sh" indekslanadi va mobil-moslik bahosi tushadi.
        disallow: [
          '/admin',
          '/api/',
          '/uz/admin',
          '/ru/admin',
          '/en/admin',
          // Qidiruv natijalari sahifasi `noindex` va past qiymatli —
          // crawl byudjetini tejash uchun yopamiz (§13)
          '/uz/search',
          '/ru/search',
          '/en/search',
          // dizayn tizimi (dev-only)
          '/styleguide',
          // Crawl byudjetini tejash: chuqur sahifalash va qidiruv parametrlari.
          // BITTA `*` guruhida — ikkita bir xil user-agent guruhini ba'zi
          // crawler'lar (Yandex'dan tashqari) birlashtirmaydi, faqat birinchisini oladi.
          '/*?page=',
          '/*?q=',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
