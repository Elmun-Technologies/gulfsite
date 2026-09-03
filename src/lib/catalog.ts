/**
 * KATALOG SO'ROV DVIGATELI
 * ----------------------------------------------------------------
 * catalog.json bir marta yuklanadi va modul darajasida keshlanadi.
 * Filtrlash + facet hisoblagichlari + qidiruv — bitta joyda.
 *
 * MUHIM: bu fayl faqat SERVER komponentlarda import qilinadi.
 * Brauzerga butun katalog emas, faqat kerakli sahifa uzatiladi.
 */

import catalogFile from '@/data/catalog.json';
import type {
  CatalogFilters,
  CatalogProduct,
  Facet,
  FacetOption,
  ProductCard,
  SortKey,
} from './types';
import { DEFAULT_FILTERS, PAGE_SIZE } from './types';
import {
  ALL_GROUPS,
  APPLICATIONS,
  AVAILABILITY,
  CATEGORIES,
  FEATURES,
  FORMS,
  PACKAGING,
  getForm,
  getGroup,
  type Locale,
  tr,
} from './taxonomy';
import { meaningfulTokens, scoreMatch, searchKey, suggestCorrection } from './search';
import { productBlurb } from './catalog-copy';

/* URL <-> filtr funksiyalari alohida modulda (`filters-url.ts`).
   Sabab: bu fayl catalog.json'ni import qiladi, shuning uchun uni
   klient komponenti import qila olmaydi. Server kodi qulay bo'lishi
   uchun funksiyalar bu yerdan qayta eksport qilinadi. */
import { countActive, filtersToParams, paramsToFilters, LIST_KEYS } from './filters-url';

export { countActive, filtersToParams, paramsToFilters, LIST_KEYS };

/* ------------------------------------------------------------
   Xotiradagi kesh
   ------------------------------------------------------------ */

const PRODUCTS = (catalogFile as unknown as { products: CatalogProduct[] }).products;

interface SearchBlob {
  primary: string[];
  secondary: string[];
  sku: string;
  key: string;
}

const BLOBS = new Map<string, SearchBlob>();

function blobFor(p: CatalogProduct): SearchBlob {
  const cached = BLOBS.get(p.sku);
  if (cached) return cached;

  const primary = [p.name.uz, p.name.ru, p.name.en];
  const secondary = [
    tr(ALL_GROUPS.find((g) => g.id === p.group)?.name, 'uz', ''),
    tr(ALL_GROUPS.find((g) => g.id === p.group)?.name, 'ru', ''),
    tr(CATEGORIES.find((c) => c.id === p.category)?.name, 'uz', ''),
    tr(CATEGORIES.find((c) => c.id === p.category)?.name, 'ru', ''),
    ...p.applications.flatMap((a) => [
      tr(APPLICATIONS.find((x) => x.id === a)?.name, 'uz', ''),
      tr(APPLICATIONS.find((x) => x.id === a)?.name, 'ru', ''),
    ]),
    ...p.features.flatMap((f) => [
      tr(FEATURES.find((x) => x.id === f)?.name, 'uz', ''),
      tr(FEATURES.find((x) => x.id === f)?.name, 'ru', ''),
    ]),
    tr(FORMS.find((f) => f.id === p.form)?.name, 'uz', ''),
    ...p.tags,
  ].filter(Boolean);

  const blob: SearchBlob = {
    primary,
    secondary,
    sku: p.sku,
    key: searchKey([...primary, ...secondary].join(' ')),
  };
  BLOBS.set(p.sku, blob);
  return blob;
}

/* ------------------------------------------------------------
   Asosiy getter'lar
   ------------------------------------------------------------ */

export function allProducts(): CatalogProduct[] {
  return PRODUCTS;
}

export function productCount(): number {
  return PRODUCTS.length;
}

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductBySku(sku: string): CatalogProduct | undefined {
  return PRODUCTS.find((p) => p.sku === sku);
}

export function getProductsBySlugs(slugs: string[]): CatalogProduct[] {
  const set = new Set(slugs);
  return PRODUCTS.filter((p) => set.has(p.slug));
}

export function toCard(p: CatalogProduct, locale: Locale): ProductCard {
  const group = ALL_GROUPS.find((g) => g.id === p.group);
  return {
    id: p.id,
    sku: p.sku,
    slug: p.slug,
    name: p.name,
    category: p.category,
    group: p.group,
    form: p.form,
    applications: p.applications,
    dosageMin: p.dosage.min,
    dosageMax: p.dosage.max,
    packaging: p.packaging,
    features: p.features,
    availability: p.availability,
    isNew: p.isNew,
    isTop: p.isTop,
    popularity: p.popularity,
    color: group?.color ?? '#0e7c6b',
    blurb: productBlurb(p.category, p.applications, locale),
  };
}

/* ------------------------------------------------------------
   Filtrlash
   ------------------------------------------------------------ */

type MatchFn = (p: CatalogProduct) => boolean;

interface Matcher {
  /** Qaysi filtr o'lchoviga tegishli (facet hisoblashda chiqarib tashlanadi) */
  key: keyof CatalogFilters;
  fn: MatchFn;
}

function buildMatchers(f: CatalogFilters): { matchers: Matcher[]; searchScore: (p: CatalogProduct) => number } {
  const matchers: Matcher[] = [];
  const add = (key: keyof CatalogFilters, fn: MatchFn) => matchers.push({ key, fn });

  if (f.categories.length) {
    const set = new Set(f.categories);
    add('categories', (p) => set.has(p.category));
  }
  if (f.groups.length) {
    const set = new Set(f.groups);
    add('groups', (p) => set.has(p.group));
  }
  if (f.applications.length) {
    const set = new Set(f.applications);
    add('applications', (p) => p.applications.some((a) => set.has(a)));
  }
  if (f.forms.length) {
    const set = new Set(f.forms);
    add('forms', (p) => set.has(p.form));
  }
  if (f.features.length) {
    // AND mantig'i: mijoz "Halol VA spirtsiz" deb izlaydi
    const set = new Set(f.features);
    add('features', (p) => [...set].every((x) => p.features.includes(x)));
  }
  if (f.packaging.length) {
    const set = new Set(f.packaging);
    add('packaging', (p) => p.packaging.some((kg) => set.has(kg)));
  }
  if (f.availability.length) {
    const set = new Set(f.availability);
    add('availability', (p) => set.has(p.availability));
  }
  if (f.dosageMax != null) {
    const max = f.dosageMax;
    add('dosageMax', (p) => p.dosage.min <= max);
  }
  if (f.onlyNew) add('onlyNew', (p) => p.isNew);
  if (f.onlyTop) add('onlyTop', (p) => p.isTop || p.popularity >= 85);

  const searchScore = (p: CatalogProduct): number => {
    if (!f.q.trim()) return 0;
    const { score, matched } = scoreMatch(f.q, blobFor(p));
    return matched ? score : 0;
  };

  return { matchers, searchScore };
}

/* ------------------------------------------------------------
   Tartiblash
   ------------------------------------------------------------ */

/**
 * Natijalarni saralash.
 * - 'popular' — mashhurlik, so'ng alfavit (qidiruv bo'lsa — ball bo'yicha)
 * - 'name-*'   — tilga mos alfavit (Intl.Collator)
 * - 'dosage-*' — tavsiya etilgan doza bo'yicha
 * - 'new'      — yangilar oldin
 * - 'sku'      — SKU bo'yicha (ombor hisobi uchun qulay)
 */
function sortProducts(
  list: CatalogProduct[],
  sort: SortKey,
  locale: Locale,
  scores: Map<string, number>,
): CatalogProduct[] {
  const collator = new Intl.Collator(locale === 'ru' ? 'ru' : locale === 'uz' ? 'uz-Latn' : 'en', {
    sensitivity: 'base',
    numeric: true,
  });
  const nameOf = (p: CatalogProduct) => p.name[locale] || p.name.en || p.sku;
  const out = list.slice();

  switch (sort) {
    case 'name-asc':
      out.sort((a, b) => collator.compare(nameOf(a), nameOf(b)));
      break;
    case 'name-desc':
      out.sort((a, b) => collator.compare(nameOf(b), nameOf(a)));
      break;
    case 'dosage-asc':
      out.sort((a, b) => a.dosage.min - b.dosage.min || a.dosage.max - b.dosage.max || collator.compare(nameOf(a), nameOf(b)));
      break;
    case 'dosage-desc':
      out.sort((a, b) => b.dosage.max - a.dosage.max || b.dosage.min - a.dosage.min || collator.compare(nameOf(a), nameOf(b)));
      break;
    case 'new':
      out.sort(
        (a, b) =>
          Number(b.isNew) - Number(a.isNew) ||
          b.order - a.order ||
          b.popularity - a.popularity ||
          collator.compare(nameOf(a), nameOf(b)),
      );
      break;
    case 'sku':
      out.sort((a, b) => a.sku.localeCompare(b.sku));
      break;
    case 'popular':
    default:
      out.sort((a, b) => {
        // Qidiruv so'rovi bo'lsa — moslik balli birinchi
        const sa = scores.get(a.sku) ?? 0;
        const sb = scores.get(b.sku) ?? 0;
        if (sa !== sb) return sb - sa;
        return (
          Number(b.isTop) - Number(a.isTop) ||
          b.popularity - a.popularity ||
          Number(b.isNew) - Number(a.isNew) ||
          collator.compare(nameOf(a), nameOf(b))
        );
      });
      break;
  }

  return out;
}

function applyMatchers(list: CatalogProduct[], matchers: Matcher[]): CatalogProduct[] {
  if (!matchers.length) return list;
  return list.filter((p) => matchers.every((m) => m.fn(p)));
}

export interface QueryResult {
  cards: ProductCard[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  facets: Facet[];
  activeCount: number;
  suggestion: string | null;
  appliedFilters: CatalogFilters;
}

/**
 * To'liq so'rov: filtrlash + facetlar + sahifalash.
 *
 * Facet hisoblagichlari "boshqa barcha filtrlar qo'llanilgan" holatda
 * hisoblanadi — bu standart professional facet-naved search xatti-harakati:
 * foydalanuvchi tanlashdan oldin nechta natija olishini ko'radi.
 */
export function queryCatalog(rawFilters: Partial<CatalogFilters>, locale: Locale, pageSize = PAGE_SIZE): QueryResult {
  const f: CatalogFilters = { ...DEFAULT_FILTERS, ...rawFilters };
  const { matchers, searchScore } = buildMatchers(f);

  // Qidiruv ballari
  const scores = new Map<string, number>();
  if (f.q.trim()) {
    for (const p of PRODUCTS) {
      const s = searchScore(p);
      if (s > 0) scores.set(p.sku, s);
    }
  }

  // Qidiruv filtri
  const withSearch = f.q.trim()
    ? PRODUCTS.filter((p) => (scores.get(p.sku) ?? 0) > 0)
    : PRODUCTS;

  // Yakuniy natija
  const matched = applyMatchers(withSearch, matchers);
  const sorted = sortProducts(matched, f.sort, locale, scores);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, f.page), totalPages);
  const start = (page - 1) * pageSize;
  const cards = sorted.slice(start, start + pageSize).map((p) => toCard(p, locale));

  // ---- Facetlar ----
  const facets = buildFacets(f, matchers, scores, locale);

  // ---- Yozuv xatosini tuzatish taklifi ----
  let suggestion: string | null = null;
  if (total === 0 && f.q.trim()) {
    suggestion = suggestCorrection(
      f.q,
      PRODUCTS.map((p) => p.name[locale]),
    );
  }

  return {
    cards,
    total,
    page,
    pageSize,
    totalPages,
    facets,
    activeCount: countActive(f),
    suggestion,
    appliedFilters: f,
  };
}

/* ------------------------------------------------------------
   Facetlar
   ------------------------------------------------------------ */

interface FacetDef {
  key: keyof CatalogFilters;
  label: string;
  options: { id: string; label: string; color?: string }[];
  test: (p: CatalogProduct, id: string) => boolean;
  selected: (f: CatalogFilters) => string[];
}

function facetDefs(locale: Locale): FacetDef[] {
  return [
    {
      key: 'categories',
      label: locale === 'ru' ? 'Категория' : locale === 'en' ? 'Category' : 'Kategoriya',
      options: CATEGORIES.map((c) => ({ id: c.id, label: tr(c.name, locale), color: c.color })),
      test: (p, id) => p.category === id,
      selected: (f) => f.categories,
    },
    {
      key: 'groups',
      label: locale === 'ru' ? 'Группа' : locale === 'en' ? 'Group' : 'Guruh',
      options: ALL_GROUPS.map((g) => ({ id: g.id, label: tr(g.name, locale), color: g.color })),
      test: (p, id) => p.group === id,
      selected: (f) => f.groups,
    },
    {
      key: 'applications',
      label: locale === 'ru' ? 'Применение' : locale === 'en' ? 'Application' : 'Qo‘llash sohasi',
      options: APPLICATIONS.map((a) => ({ id: a.id, label: tr(a.name, locale), color: a.color })),
      test: (p, id) => p.applications.includes(id),
      selected: (f) => f.applications,
    },
    {
      key: 'forms',
      label: locale === 'ru' ? 'Форма' : locale === 'en' ? 'Form' : 'Shakli',
      options: FORMS.map((x) => ({ id: x.id, label: tr(x.name, locale) })),
      test: (p, id) => p.form === id,
      selected: (f) => f.forms,
    },
    {
      key: 'packaging',
      label: locale === 'ru' ? 'Фасовка' : locale === 'en' ? 'Pack size' : 'Qadoq',
      options: PACKAGING.map((x) => ({ id: String(x.kg), label: tr(x.name, locale) })),
      test: (p, id) => p.packaging.includes(Number(id)),
      selected: (f) => f.packaging.map(String),
    },
    {
      key: 'features',
      label: locale === 'ru' ? 'Свойства и сертификаты' : locale === 'en' ? 'Properties & certificates' : 'Xususiyat va sertifikatlar',
      options: FEATURES.map((x) => ({ id: x.id, label: tr(x.name, locale) })),
      test: (p, id) => p.features.includes(id),
      selected: (f) => f.features,
    },
    {
      key: 'availability',
      label: locale === 'ru' ? 'Наличие' : locale === 'en' ? 'Availability' : 'Mavjudlik',
      options: AVAILABILITY.map((x) => ({ id: x.id, label: tr(x.name, locale), color: x.color })),
      test: (p, id) => p.availability === id,
      selected: (f) => f.availability,
    },
  ];
}

function buildFacets(
  f: CatalogFilters,
  matchers: Matcher[],
  scores: Map<string, number>,
  locale: Locale,
): Facet[] {
  const defs = facetDefs(locale);
  const facets: Facet[] = [];

  const base = f.q.trim() ? PRODUCTS.filter((p) => (scores.get(p.sku) ?? 0) > 0) : PRODUCTS;

  for (const def of defs) {
    const selectedIds = new Set(def.selected(f));

    // Ushbu facetdan TASHQARI barcha filtrlarni qo'llaymiz
    const others = matchers.filter((m) => m.key !== def.key);
    const pool = applyMatchers(base, others);

    const options: FacetOption[] = [];
    for (const opt of def.options) {
      const count = pool.filter((p) => def.test(p, opt.id)).length;
      // Tanlangan, ammo hozir 0 natijali qiymatlarni ham ko'rsatamiz (chip yo'qolmasligi uchun)
      if (count === 0 && !selectedIds.has(opt.id)) continue;
      options.push({ id: opt.id, label: opt.label, count, color: opt.color, active: selectedIds.has(opt.id) });
    }

    if (!options.length) continue;

    const collator = new Intl.Collator(locale === 'ru' ? 'ru' : locale === 'uz' ? 'uz-Latn' : 'en');
    options.sort((a, b) => Number(b.active) - Number(a.active) || collator.compare(a.label, b.label));

    facets.push({ key: def.key, label: def.label, options, hasSelection: selectedIds.size > 0 });
  }

  return facets;
}

/* ------------------------------------------------------------
   Faol filtrlar
   ------------------------------------------------------------ */


export function activeChips(f: CatalogFilters, locale: Locale): { key: string; id?: string; label: string }[] {
  const chips: { key: string; id?: string; label: string }[] = [];
  const L = {
    uz: { search: 'Qidiruv', dosage: 'Doza ≤', newOnly: 'Faqat yangi', topOnly: 'Faqat xit', reset: 'Tozalash' },
    ru: { search: 'Поиск', dosage: 'Доза ≤', newOnly: 'Только новинки', topOnly: 'Только хиты', reset: 'Сбросить' },
    en: { search: 'Search', dosage: 'Dose ≤', newOnly: 'New only', topOnly: 'Top only', reset: 'Reset' },
  }[locale];

  if (f.q.trim()) chips.push({ key: 'q', label: `${L.search}: «${f.q.trim()}»` });
  for (const id of f.categories) chips.push({ key: 'categories', id, label: tr(CATEGORIES.find((c) => c.id === id)?.name, locale, id) });
  for (const id of f.groups) chips.push({ key: 'groups', id, label: tr(ALL_GROUPS.find((c) => c.id === id)?.name, locale, id) });
  for (const id of f.applications) chips.push({ key: 'applications', id, label: tr(APPLICATIONS.find((c) => c.id === id)?.name, locale, id) });
  for (const id of f.forms) chips.push({ key: 'forms', id, label: tr(FORMS.find((c) => c.id === id)?.name, locale, id) });
  for (const id of f.features) chips.push({ key: 'features', id, label: tr(FEATURES.find((c) => c.id === id)?.name, locale, id) });
  for (const kg of f.packaging) chips.push({ key: 'packaging', id: String(kg), label: tr(PACKAGING.find((p) => p.kg === kg)?.name, locale, `${kg} kg`) });
  for (const id of f.availability) chips.push({ key: 'availability', id, label: tr(AVAILABILITY.find((c) => c.id === id)?.name, locale, id) });
  if (f.dosageMax != null) chips.push({ key: 'dosageMax', label: `${L.dosage} ${f.dosageMax}%` });
  if (f.onlyNew) chips.push({ key: 'onlyNew', label: L.newOnly });
  if (f.onlyTop) chips.push({ key: 'onlyTop', label: L.topOnly });
  return chips;
}

/* ------------------------------------------------------------
   Statistika (bosh sahifa uchun)
   ------------------------------------------------------------ */

export function catalogStats(locale: Locale) {
  const byCategory = CATEGORIES.map((c) => ({
    id: c.id,
    label: tr(c.name, locale),
    color: c.color,
    icon: c.icon,
    hint: tr(c.hint, locale, ''),
    count: PRODUCTS.filter((p) => p.category === c.id).length,
  }));

  return {
    total: PRODUCTS.length,
    byCategory,
    newCount: PRODUCTS.filter((p) => p.isNew).length,
    topCount: PRODUCTS.filter((p) => p.isTop).length,
    inStock: PRODUCTS.filter((p) => p.availability === 'in-stock').length,
    applications: APPLICATIONS.length,
    generatedAt: (catalogFile as { generatedAt?: string }).generatedAt ?? '',
  };
}

/** Bosh sahifa va kategoriya bloklari uchun eng mashhur mahsulotlar */
export function popularProducts(limit: number, locale: Locale, categoryId?: string): ProductCard[] {
  return PRODUCTS.filter((p) => !categoryId || p.category === categoryId)
    .slice()
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
    .map((p) => toCard(p, locale));
}

export function newProducts(limit: number, locale: Locale): ProductCard[] {
  return PRODUCTS.filter((p) => p.isNew)
    .slice(0, limit)
    .map((p) => toCard(p, locale));
}

/** O'xshash mahsulotlar: bir xil guruh → bir xil kategoriya → bir xil ilova */
export function relatedProducts(product: CatalogProduct, limit: number, locale: Locale): ProductCard[] {
  const pool = PRODUCTS.filter((p) => p.sku !== product.sku);
  const scored = pool
    .map((p) => {
      let s = 0;
      if (p.group === product.group) s += 50;
      if (p.category === product.category) s += 25;
      s += p.applications.filter((a) => product.applications.includes(a)).length * 8;
      s += p.popularity / 20;
      return { p, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit);
  return scored.map((x) => toCard(x.p, locale));
}

/** Qidiruv avtoto'ldirish (autocomplete) */
export interface Suggestion {
  sku: string;
  slug: string;
  name: string;
  category: string;
  group: string;
  color: string;
}

export function suggest(query: string, locale: Locale, limit = 8): Suggestion[] {
  const tokens = meaningfulTokens(query);
  if (!tokens.length) return [];

  return PRODUCTS.map((p) => {
    const b = blobFor(p);
    const { score, matched } = scoreMatch(query, b);
    return { p, score: matched ? score : 0 };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.popularity - a.p.popularity)
    .slice(0, limit)
    .map(({ p }) => ({
      sku: p.sku,
      slug: p.slug,
      name: p.name[locale] || p.name.en,
      category: p.category,
      group: p.group,
      color: ALL_GROUPS.find((g) => g.id === p.group)?.color ?? '#0e7c6b',
    }));
}

/** Guruhlar bo'yicha tezkor havolalar (katalog bosh sahifasi) */
export function groupOverview(locale: Locale, categoryId?: string) {
  const pool = categoryId ? PRODUCTS.filter((p) => p.category === categoryId) : PRODUCTS;
  const groups = categoryId
    ? ALL_GROUPS.filter((g) => pool.some((p) => p.group === g.id))
    : ALL_GROUPS;

  return groups
    .map((g) => ({
      id: g.id,
      label: tr(g.name, locale),
      color: g.color ?? '#0e7c6b',
      icon: g.icon ?? 'tag',
      count: pool.filter((p) => p.group === g.id).length,
      examples: pool
        .filter((p) => p.group === g.id)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 6)
        .map((p) => ({ slug: p.slug, name: p.name[locale] || p.name.en })),
    }))
    .filter((g) => g.count > 0)
    .sort((a, b) => b.count - a.count);
}


/* ============================================================
   TARMOQ (INDUSTRY) YORDAMCHILARI
   /industries va /industries/[slug] sahifalari uchun
   ============================================================ */

/** Har bir qo'llash sohasi bo'yicha mahsulot soni (bir martalik hisob) */
export function applicationCounts(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const a of APPLICATIONS) out[a.id] = 0;
  for (const p of PRODUCTS) {
    for (const id of p.applications) {
      if (out[id] !== undefined) out[id] += 1;
    }
  }
  return out;
}

/** Bir tarmoq uchun eng mashhur mahsulotlar */
export function applicationProducts(applicationId: string, limit: number, locale: Locale): ProductCard[] {
  return PRODUCTS.filter((p) => p.applications.includes(applicationId))
    .slice()
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
    .map((p) => toCard(p, locale));
}

/** Bir tarmoqda uchraydigan guruhlar (son bilan, kamayish tartibida) */
export function applicationGroups(applicationId: string, locale: Locale) {
  const counts = new Map<string, number>();
  for (const p of PRODUCTS) {
    if (!p.applications.includes(applicationId)) continue;
    counts.set(p.group, (counts.get(p.group) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([id]) => Boolean(getGroup(id)))
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => {
      const g = getGroup(id)!;
      return {
        id,
        label: tr(g.name, locale, id),
        count,
        color: g.color ?? '#0e7c6b',
        icon: g.icon ?? 'tag',
      };
    });
}

/** Bir tarmoqda uchraydigan formalarning statistikasi */
export function applicationForms(applicationId: string, locale: Locale) {
  const counts = new Map<string, number>();
  for (const p of PRODUCTS) {
    if (!p.applications.includes(applicationId)) continue;
    counts.set(p.form, (counts.get(p.form) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([id]) => Boolean(getForm(id)))
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ id, label: tr(getForm(id)!.name, locale, id), count }));
}

/** Bir tarmoqdagi doza diapazoni (min–max) */
export function applicationDoseRange(applicationId: string): { min: number; max: number } | null {
  let min = Infinity;
  let max = -Infinity;
  for (const p of PRODUCTS) {
    if (!p.applications.includes(applicationId)) continue;
    if (typeof p.dosage?.min === 'number') min = Math.min(min, p.dosage.min);
    if (typeof p.dosage?.max === 'number') max = Math.max(max, p.dosage.max);
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  return { min, max };
}
