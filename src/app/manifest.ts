/**
 * WEB APP MANIFEST
 * ----------------------------------------------------------------
 * PWA sifatida o'rnatish uchun emas (bu B2B sayt), lekin mobil
 * brauzerlarda "Bosh ekranga qo'shish" va Safari tab sarlavhasi
 * uchun kerak: nom, ranglar va ikonkalar.
 */

import type { MetadataRoute } from 'next';
import { siteConfig, SITE_URL } from '@/lib/config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.brand.full} — ${siteConfig.brand.distributor}`,
    short_name: 'GFF UZ',
    description: siteConfig.seo.defaultDescription,
    start_url: '/uz',
    scope: '/',
    display: 'minimal-ui',
    orientation: 'portrait-primary',
    background_color: '#fdfbf7',
    theme_color: '#0d5449',
    lang: 'uz',
    categories: ['business', 'food', 'shopping'],
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/images/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      { name: 'Katalog', url: `${SITE_URL}/uz/catalog` },
      { name: 'Test box', url: `${SITE_URL}/uz/samples` },
      { name: 'Aloqa', url: `${SITE_URL}/uz/contact` },
    ],
  };
}
