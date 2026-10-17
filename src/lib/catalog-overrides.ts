/**
 * KATALOG TUZATMALARI (admin paneldan) — sof funksiyalar, fs YO'Q
 * ----------------------------------------------------------------
 * `catalog.json` (617 pozitsiya, build vaqtida) — asos. Admin paneldagi
 * o'zgarishlar alohida "tuzatmalar" faylida saqlanadi va asos ustiga
 * qo'yiladi:
 *
 *   products  — mavjud mahsulotga yamoq (nom, kategoriya, rasm, yashirish…)
 *   added     — admin qo'shgan yangi mahsulotlar (to'liq yozuv)
 *   categories— kategoriya nomini o'zgartirish YOKI yangi kategoriya
 *   groups    — guruh (kichik kategoriya) nomi YOKI yangi guruh
 *
 * Asos fayl hech qachon o'zgartirilmaydi (§6) — tuzatmani o'chirsangiz,
 * mahsulot asl holiga qaytadi.
 */

import type { CatalogProduct } from './types';
import type { Taxon, Trilingual } from './taxonomy';

export type ProductPatch = Partial<Omit<CatalogProduct, 'sku' | 'id'>>;

export interface CategoryOverride {
  id: string;
  name: Trilingual;
  hint?: Trilingual;
  hidden?: boolean;
  order?: number;
}

export interface GroupOverride {
  id: string;
  /** qaysi kategoriyaga tegishli (yangi guruh uchun majburiy) */
  category: string;
  name: Trilingual;
  hidden?: boolean;
  order?: number;
}

export interface CatalogOverrides {
  version: 1;
  updatedAt: string | null;
  products: Record<string, ProductPatch>;
  added: CatalogProduct[];
  categories: CategoryOverride[];
  groups: GroupOverride[];
}

export const EMPTY_OVERRIDES: CatalogOverrides = {
  version: 1,
  updatedAt: null,
  products: {},
  added: [],
  categories: [],
  groups: [],
};

/* ------------------------------------------------------------
   Tekshiruv (tashqi JSON — ishonchsiz)
   ------------------------------------------------------------ */

const LOCALES = ['uz', 'ru', 'en'] as const;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function str(v: unknown, max = 400): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export function tri(v: unknown, max = 400): Trilingual {
  const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  return { uz: str(o.uz, max), ru: str(o.ru, max), en: str(o.en, max) };
}

function hasText(t: Trilingual | undefined): t is Trilingual {
  return !!t && LOCALES.some((l) => t[l]);
}

function num(v: unknown, min: number, max: number, fallback: number): number {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

function strList(v: unknown, max = 40): string[] {
  return Array.isArray(v) ? v.map((x) => str(x, 60)).filter(Boolean).slice(0, max) : [];
}

export function isSlug(s: string): boolean {
  return SLUG_RE.test(s) && s.length <= 80;
}

/** Rasm manzili: faqat sayt ichidagi yo'l yoki yuklangan media */
function imagePath(v: unknown): string | undefined {
  const s = str(v, 300);
  if (!s) return undefined;
  if (/^\/api\/media\/[a-f0-9]{24}\.webp$/.test(s)) return s;
  if (/^\/images\/[\w\-/.]+\.(webp|jpe?g|png)$/.test(s) && !s.includes('..')) return s;
  return undefined;
}

export function sanitizePatch(raw: unknown): ProductPatch {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const p: ProductPatch = {};
  if ('name' in o) {
    const n = tri(o.name, 160);
    if (hasText(n)) p.name = n;
  }
  if ('description' in o) {
    const d = tri(o.description, 2000);
    p.description = hasText(d) ? d : undefined;
  }
  if ('category' in o && str(o.category)) p.category = str(o.category, 60) as CatalogProduct['category'];
  if ('group' in o && str(o.group)) p.group = str(o.group, 60);
  if ('form' in o && str(o.form)) p.form = str(o.form, 30) as CatalogProduct['form'];
  if ('applications' in o) p.applications = strList(o.applications);
  if ('features' in o) p.features = strList(o.features);
  if ('tags' in o) p.tags = strList(o.tags, 30);
  if ('packaging' in o)
    p.packaging = (Array.isArray(o.packaging) ? o.packaging : [])
      .map((x) => num(x, 0.01, 10000, 0))
      .filter((x) => x > 0)
      .slice(0, 8);
  if ('dosage' in o && o.dosage && typeof o.dosage === 'object') {
    const d = o.dosage as Record<string, unknown>;
    const min = num(d.min, 0, 100, 0.1);
    p.dosage = { min, max: Math.max(min, num(d.max, 0, 100, min)), unit: str(d.unit, 10) || '%' };
  }
  if ('availability' in o && ['in-stock', 'on-order', 'new'].includes(str(o.availability)))
    p.availability = str(o.availability) as CatalogProduct['availability'];
  if ('isNew' in o) p.isNew = o.isNew === true;
  if ('isTop' in o) p.isTop = o.isTop === true;
  if ('hidden' in o) p.hidden = o.hidden === true;
  if ('popularity' in o) p.popularity = num(o.popularity, 0, 100, 50);
  if ('shelfLifeMonths' in o) p.shelfLifeMonths = num(o.shelfLifeMonths, 1, 120, 12);
  if ('image' in o) p.image = imagePath(o.image);
  if ('slug' in o) {
    const s = str(o.slug, 80).toLowerCase();
    if (isSlug(s)) p.slug = s;
  }
  return p;
}

export function sanitizeOverrides(raw: unknown): CatalogOverrides {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const products: Record<string, ProductPatch> = {};
  if (o.products && typeof o.products === 'object') {
    for (const [sku, patch] of Object.entries(o.products as Record<string, unknown>).slice(0, 5000)) {
      const k = str(sku, 40);
      if (k) products[k] = sanitizePatch(patch);
    }
  }
  const added: CatalogProduct[] = [];
  for (const a of Array.isArray(o.added) ? o.added.slice(0, 2000) : []) {
    const p = buildProduct(a);
    if (p) added.push(p);
  }
  const categories: CategoryOverride[] = (Array.isArray(o.categories) ? o.categories : [])
    .slice(0, 50)
    .map((c) => {
      const r = (c ?? {}) as Record<string, unknown>;
      return {
        id: str(r.id, 60).toLowerCase(),
        name: tri(r.name, 120),
        hint: hasText(tri(r.hint, 240)) ? tri(r.hint, 240) : undefined,
        hidden: r.hidden === true,
        order: r.order == null ? undefined : num(r.order, 0, 999, 99),
      };
    })
    .filter((c) => isSlug(c.id) && hasText(c.name));
  const groups: GroupOverride[] = (Array.isArray(o.groups) ? o.groups : [])
    .slice(0, 300)
    .map((g) => {
      const r = (g ?? {}) as Record<string, unknown>;
      return {
        id: str(r.id, 60).toLowerCase(),
        category: str(r.category, 60).toLowerCase(),
        name: tri(r.name, 120),
        hidden: r.hidden === true,
        order: r.order == null ? undefined : num(r.order, 0, 999, 99),
      };
    })
    .filter((g) => isSlug(g.id) && g.category && hasText(g.name));
  return {
    version: 1,
    updatedAt: str(o.updatedAt, 40) || null,
    products,
    added,
    categories,
    groups,
  };
}

/** Yangi mahsulot — to'liq yozuv (yetishmagan maydonlarga standart qiymat) */
export function buildProduct(raw: unknown): CatalogProduct | null {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const sku = str(o.sku, 40).toUpperCase();
  const patch = sanitizePatch(o);
  if (!/^[A-Z0-9][A-Z0-9-]{1,39}$/.test(sku) || !patch.name || !patch.slug || !patch.category || !patch.group) return null;
  return {
    id: `custom-${sku.toLowerCase()}`,
    sku,
    slug: patch.slug,
    category: patch.category,
    group: patch.group,
    form: patch.form ?? 'liquid',
    applications: patch.applications ?? [],
    dosage: patch.dosage ?? { min: 0.1, max: 0.5, unit: '%' },
    packaging: patch.packaging?.length ? patch.packaging : [1, 5],
    features: patch.features ?? [],
    availability: patch.availability ?? 'on-order',
    popularity: patch.popularity ?? 50,
    isNew: patch.isNew ?? true,
    isTop: patch.isTop ?? false,
    shelfLifeMonths: patch.shelfLifeMonths ?? 12,
    name: patch.name,
    copyVariant: 0,
    tags: patch.tags ?? [],
    order: num(o.order, 0, 100000, 90000),
    description: patch.description,
    image: patch.image,
    hidden: patch.hidden ?? false,
  };
}

/* ------------------------------------------------------------
   Birlashtirish
   ------------------------------------------------------------ */

/** Asos + tuzatmalar → BARCHA mahsulotlar (yashirinlari ham — admin uchun) */
export function mergeProducts(base: CatalogProduct[], ov: CatalogOverrides): CatalogProduct[] {
  const out: CatalogProduct[] = base.map((p) => {
    const patch = ov.products[p.sku];
    return patch ? ({ ...p, ...stripUndefinedKeys(patch, ['description', 'image']) } as CatalogProduct) : p;
  });
  const skus = new Set(out.map((p) => p.sku));
  for (const a of ov.added) {
    if (skus.has(a.sku)) continue;
    const patch = ov.products[a.sku];
    out.push(patch ? ({ ...a, ...stripUndefinedKeys(patch, ['description', 'image']) } as CatalogProduct) : a);
    skus.add(a.sku);
  }
  // slug to'qnashuvi: keyingisiga SKU qo'shiladi (URL doim yagona)
  const slugs = new Set<string>();
  for (const p of out) {
    if (slugs.has(p.slug)) p.slug = `${p.slug}-${p.sku.toLowerCase()}`;
    slugs.add(p.slug);
  }
  return out;
}

/** `undefined` qiymatli kalitlar asosni o'chirmasin (faqat ruxsat etilganlari) */
function stripUndefinedKeys(patch: ProductPatch, clearable: (keyof ProductPatch)[]): ProductPatch {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined && !clearable.includes(k as keyof ProductPatch)) continue;
    out[k] = v;
  }
  return out as ProductPatch;
}

/** Taksonomiya ro'yxatini tuzatmalar bilan yangilash (JOYIDA — havolalar saqlanadi) */
export function applyTaxonOverrides(
  list: Taxon[],
  baseline: Taxon[],
  overrides: { id: string; name: Trilingual; hint?: Trilingual; hidden?: boolean; order?: number }[],
  hiddenSink: Set<string>,
): void {
  const next: Taxon[] = baseline.map((t) => ({ ...t }));
  for (const o of overrides) {
    const cur = next.find((t) => t.id === o.id);
    if (cur) {
      cur.name = o.name;
      if (o.hint) cur.hint = o.hint;
      if (o.order != null) cur.order = o.order;
    } else {
      next.push({ id: o.id, name: o.name, hint: o.hint, order: o.order ?? 90, color: '#94603E' });
    }
    if (o.hidden) hiddenSink.add(o.id);
  }
  list.splice(0, list.length, ...next);
}
