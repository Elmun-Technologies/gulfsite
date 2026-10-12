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
    // §4.2 palitrasi: navy fon (ikonka foni bilan bir xil — splash'da chok yo'q)
    background_color: '#0B0A3A',
    theme_color: '#0B0A3A',
    lang: 'uz',
    categories: ['business', 'food', 'shopping'],
    icons: [
      // `npm run icons` yaratadi (scripts/build-icons.mjs)
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Katalog', url: `${SITE_URL}/uz/catalog` },
      { name: 'Test box', url: `${SITE_URL}/uz/samples` },
      { name: 'Aloqa', url: `${SITE_URL}/uz/contact` },
    ],
  };
}
