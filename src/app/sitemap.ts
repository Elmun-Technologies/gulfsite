/**
 * SITEMAP
 * ----------------------------------------------------------------
 * Barcha indekslanadigan sahifalar × 3 til, har birida hreflang
 * alternates — bu Google'ga bir xil kontentning 3 tilini to'g'ri
 * bog'lash imkonini beradi (duplikat kontent jazosini oldini oladi).
 *
 * Katalogda har bir mahsulot uchun alohida URL bor (617 × 3),
 * shuningdek kategoriya/guruh/tarmoq filtr sahifalari ham kiritilgan —
 * ular "uzun dumli" qidiruv so'rovlari uchun asosiy kirish nuqtalari.
 *
 * Admin va API yo'llari KIRITILMAYDI (robots.txt ham ularni yopadi).
 */

import type { MetadataRoute } from 'next';
import { LOCALES, type AppLocale } from '@/i18n';
import { SITE_URL } from '@/lib/config';
import { allProducts, applicationCounts } from '@/lib/catalog';
import { categoryIdsWithData, groupsFor } from '@/lib/category-pages';
import { industryIds } from '@/lib/industry-copy';

/** Bitta mantiqiy sahifa uchun 3 tilli yozuv */
function entry(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'], lastmod?: Date) {
  return LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    lastModified: lastmod ?? new Date('2026-01-15'),
    changeFrequency,
    priority,
    alternates: {
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])),
        // §13.5 — x-default doim standart tilga (uz) ko'rsatadi
        'x-default': `${SITE_URL}/uz${path}`,
      } as Record<AppLocale | 'x-default', string>,
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];

  /* ---------- Asosiy sahifalar ---------- */
  for (const p of ['', '/catalog', '/brochure', '/samples', '/quote', '/industries', '/about', '/contact']) {
    out.push(...entry(p, p === '' ? 1 : 0.8, p === '' ? 'weekly' : 'weekly'));
  }

  /* ---------- Huquqiy sahifalar (past ustuvorlik) ---------- */
  // `/terms` — noindex (terms/page.tsx), shuning uchun sitemap'ga kirmaydi
  for (const p of ['/privacy']) {
    out.push(...entry(p, 0.2, 'yearly'));
  }

  /* ---------- Nega filtr URL'lari (`?categories=`, `?groups=`) YO'Q? ----------
     Sitemap faqat KANONIK, parametrsiz manzillarni o'z ichiga oladi:
       - qidiruv tizimlari query-paramli URL'larni dublikat sifatida ko'radi;
       - `/uz/catalog` sahifasining o'zi sitemap'da bor, filtr havolalari esa
         sayt ichki linklaridan (kategoriya/guruh kartalaridan) topiladi.
     Shu sababli 6 kategoriya va 49 guruh bo'yicha URL'lar bu yerga qo'shilmaydi.
  ------------------------------------------------------------------------ */

  /* ---------- Kategoriya va guruh landing sahifalari (SEO) ---------- */
  for (const c of categoryIdsWithData()) {
    out.push(...entry(`/category/${c}`, 0.8, 'weekly'));
    for (const g of groupsFor(c, 'uz')) out.push(...entry(`/category/${c}/${g.id}`, 0.7, 'weekly'));
  }

  /* ---------- Tarmoq sahifalari ---------- */
  const appCounts = applicationCounts();
  for (const id of industryIds().filter((i) => (appCounts[i] ?? 0) > 0)) {
    out.push(...entry(`/industries/${id}`, 0.7, 'monthly'));
  }

  /* ---------- Mahsulot sahifalari ---------- */
  const products = allProducts();
  for (const p of products) {
    // KANONIK mahsulot manzili — `/catalog/<slug>`; eski `/product/<slug>`
    // 301 bilan shu yerga yo'naltirilgan, shuning uchun sitemap'ga TUSHMAYDI
    // (aks holda Google har bir mahsulot uchun redirect'ni kuzatadi).
    out.push(...entry(`/catalog/${p.slug}`, 0.6, 'monthly'));
  }

  return out;
}
