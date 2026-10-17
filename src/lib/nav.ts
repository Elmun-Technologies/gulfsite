/**
 * NAVIGATSIYA MA'LUMOTLARI (server-side)
 * ----------------------------------------------------------------
 * Header/Footer uchun kerakli havolalar katalogdan bir marta hisoblanadi.
 * Klientga faqat tayyor oddiy obyektlar uzatiladi — katalog kutubxonasini
 * brauzerga tashimaymiz.
 *
 * Dizayn (design/Header.dc.html) 5 ta punkt talab qiladi:
 *   Katalog · Sohalar · Namuna olish · Kompaniya · Aloqa
 * + "Elektron katalog" (mijoz talabi, 2026-10-17).
 * Bosh sahifa logotip orqali ochiladi, shuning uchun menuda yo'q.
 */

import { CATEGORIES, ALL_GROUPS, tr, type Locale } from './taxonomy';
import { allProducts, productCount } from './catalog';
import type { Translator } from '@/i18n';

export interface NavItem {
  /** Header'dagi `active` holatini aniqlash uchun */
  id: 'catalog' | 'brochure' | 'industries' | 'samples' | 'about' | 'contact';
  href: string;
  label: string;
}

export interface MegaCategory {
  id: string;
  label: string;
  count: number;
  groups: { id: string; label: string; count: number }[];
}

/** Header nav — dizayndagi tartibda */
export function buildNav(locale: Locale, t: Translator): NavItem[] {
  return [
    { id: 'catalog', href: `/${locale}/catalog`, label: t('nav.catalog') },
    // Elektron katalog (flipbook) — mijoz talabi (2026-10-17): ko'zga tashlanadigan joyda
    { id: 'brochure', href: `/${locale}/brochure`, label: t('nav.brochure') },
    { id: 'industries', href: `/${locale}/industries`, label: t('nav.industries') },
    { id: 'samples', href: `/${locale}/samples`, label: t('nav.samplesShort') },
    { id: 'about', href: `/${locale}/about`, label: t('nav.about') },
    { id: 'contact', href: `/${locale}/contact`, label: t('nav.contact') },
  ];
}

/** Footer "KATALOG" ustuni — 6 kategoriya (soni ma'lumotdan hisoblanadi) */
export function buildMega(locale: Locale): MegaCategory[] {
  const products = allProducts();
  return CATEGORIES.map((c) => {
    const inCat = products.filter((p) => p.category === c.id);
    const groups = ALL_GROUPS.filter((g) => inCat.some((p) => p.group === g.id))
      .map((g) => ({
        id: g.id,
        label: tr(g.name, locale),
        count: inCat.filter((p) => p.group === g.id).length,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      id: c.id,
      label: tr(c.name, locale, c.id),
      count: inCat.length,
      groups: groups.slice(0, 8),
    };
  });
}

/** Footer uchun eng ko'p mahsulotli guruhlar */
export function popularGroupsFor(locale: Locale, limit = 10): { id: string; label: string; count: number }[] {
  const products = allProducts();
  return ALL_GROUPS.map((g) => ({
    id: g.id,
    label: tr(g.name, locale, g.id),
    count: products.filter((p) => p.group === g.id).length,
  }))
    .filter((g) => g.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function totalProducts(): number {
  return productCount();
}
