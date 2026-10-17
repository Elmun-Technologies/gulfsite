/**
 * SEO LANDING SAHIFALARI: kategoriya va guruh (server-only)
 * ----------------------------------------------------------------
 * `/catalog?categories=…` filtri indekslash uchun zaif (parametrli URL).
 * Shu sababli har bir kategoriya va undagi guruh uchun toza URL:
 *   /[locale]/category/<kategoriya>
 *   /[locale]/category/<kategoriya>/<guruh>
 * Faqat MAHSULOTI BOR kategoriya/guruhlar (§7.1) — bo'sh sahifa yo'q.
 */

import { allProducts } from './catalog';
import { ALL_GROUPS, APPLICATIONS, CATEGORIES, sortTaxons, tr, type Locale } from './taxonomy';

/** SEO matni (`catseo.<id>.*`) bor kategoriyalar — faqat ularning landing sahifasi bor */
export const LANDING_CATEGORIES = [
  'flavours',
  'fragrances',
  'food-ingredients',
  'essential-oils',
  'aroma-chemicals',
  'commodities',
] as const;

export function categoryIdsWithData(): string[] {
  const set = new Set<string>(allProducts().map((p) => p.category));
  return CATEGORIES.filter((c) => set.has(c.id) && (LANDING_CATEGORIES as readonly string[]).includes(c.id)).map(
    (c) => c.id,
  );
}

/** Kategoriya havolasi: landing sahifasi bo'lsa o'sha, bo'lmasa katalog filtri (admin qo'shgan) */
export function categoryHref(id: string, locale: string): string {
  return (LANDING_CATEGORIES as readonly string[]).includes(id)
    ? `/${locale}/category/${id}`
    : `/${locale}/catalog?categories=${encodeURIComponent(id)}`;
}

/** Guruh havolasi: landing kategoriyasida — guruh sahifasi, aks holda katalog filtri */
export function groupHref(category: string, group: string, locale: string): string {
  return (LANDING_CATEGORIES as readonly string[]).includes(category)
    ? `/${locale}/category/${category}/${group}`
    : `/${locale}/catalog?categories=${encodeURIComponent(category)}&groups=${encodeURIComponent(group)}`;
}

export function groupsFor(category: string, locale: Locale): { id: string; label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of allProducts()) if (p.category === category) counts.set(p.group, (counts.get(p.group) ?? 0) + 1);
  return ALL_GROUPS.filter((g) => counts.has(g.id))
    .map((g) => ({ id: g.id, label: tr(g.name, locale), count: counts.get(g.id) ?? 0 }))
    .sort((a, b) => b.count - a.count);
}

/** Kategoriya (va guruh) mahsulotlarida eng ko'p uchraydigan qo'llanish sohalari */
export function topApplications(category: string, group: string | null, locale: Locale, limit = 8) {
  const counts = new Map<string, number>();
  for (const p of allProducts()) {
    if (p.category !== category || (group && p.group !== group)) continue;
    for (const a of p.applications) counts.set(a, (counts.get(a) ?? 0) + 1);
  }
  return sortTaxons([...APPLICATIONS])
    .filter((a) => counts.has(a.id))
    .map((a) => ({ id: a.id, label: tr(a.name, locale), count: counts.get(a.id) ?? 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function categoryName(id: string, locale: Locale): string {
  return tr(CATEGORIES.find((c) => c.id === id)?.name, locale, id);
}

export function groupName(id: string, locale: Locale): string {
  return tr(ALL_GROUPS.find((g) => g.id === id)?.name, locale, id);
}

/** Title ≤ 60 (shablon " — GFF Uzbekistan" = 17 belgi, §13.1) */
export function fitTitle(full: string, fallback: string): string {
  return full.length <= 43 ? full : fallback.length <= 43 ? fallback : `${fallback.slice(0, 42)}…`;
}
