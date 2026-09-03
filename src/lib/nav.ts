/**
 * NAVIGATSIYA MA'LUMOTLARI (server-side)
 * ----------------------------------------------------------------
 * Header/Footer uchun kerakli havolalar va mega-menü ma'lumotlari
 * katalogdan bir marta hisoblanadi. Klientga faqat tayyor oddiy
 * obyektlar uzatiladi — katalog kutubxonasini brauzerga tashimaymiz.
 */

import { CATEGORIES, ALL_GROUPS, tr, type Locale } from './taxonomy';
import { allProducts, productCount } from './catalog';
import type { Translator } from '@/i18n';
import type { IconName } from '@/components/ui/Icon';

export interface NavItem {
  href: string;
  label: string;
  icon?: IconName;
}

export interface MegaCategory {
  id: string;
  label: string;
  count: number;
  icon: IconName;
  color: string;
  groups: { id: string; label: string }[];
}

export function buildNav(locale: Locale, t: Translator): NavItem[] {
  return [
    { href: `/${locale}`, label: t('nav.home'), icon: 'house' },
    { href: `/${locale}/catalog`, label: t('nav.catalog'), icon: 'grid' },
    { href: `/${locale}/samples`, label: t('nav.samples'), icon: 'box' },
    { href: `/${locale}/industries`, label: t('nav.industries'), icon: 'factory' },
    { href: `/${locale}/about`, label: t('nav.about'), icon: 'users' },
    { href: `/${locale}/contact`, label: t('nav.contact'), icon: 'phone' },
  ];
}

/** Mega-menü: kategoriya + eng katta guruhlari */
export function buildMega(locale: Locale): MegaCategory[] {
  const products = allProducts();
  return CATEGORIES.map((c) => {
    const inCat = products.filter((p) => p.category === c.id);
    const groups = ALL_GROUPS.filter((g) => inCat.some((p) => p.group === g.id))
      .map((g) => ({ id: g.id, label: tr(g.name, locale), count: inCat.filter((p) => p.group === g.id).length }))
      .sort((a, b) => b.count - a.count);

    return {
      id: c.id,
      label: tr(c.name, locale, c.id),
      count: inCat.length,
      icon: (c.icon ?? 'tag') as IconName,
      color: c.color ?? '#0e7c6b',
      groups: groups.slice(0, 8).map((g) => ({ id: g.id, label: g.label })),
    };
  });
}

/** Footer uchun eng ko'p mahsulotli guruhlar */
export function popularGroupsFor(locale: Locale, limit = 10): { id: string; label: string }[] {
  const products = allProducts();
  return ALL_GROUPS.map((g) => ({
    id: g.id,
    label: tr(g.name, locale, g.id),
    count: products.filter((p) => p.group === g.id).length,
  }))
    .filter((g) => g.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((g) => ({ id: g.id, label: g.label }));
}

export function totalProducts(): number {
  return productCount();
}
