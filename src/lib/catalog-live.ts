/**
 * JONLI KATALOG (server-only): asos + admin tuzatmalari
 * ----------------------------------------------------------------
 * Har bir sahifa/route boshida `await ensureCatalog()` chaqiriladi —
 * shundan keyin `lib/catalog.ts` dagi barcha sinxron funksiyalar
 * yangilangan ro'yxat bilan ishlaydi.
 *
 * Manba:
 *   · bitta server (fly) — `<DATA_DIR>/catalog/overrides.json` (mtime keshi)
 *   · sayt Vercel'da (`BACKEND_URL`) — fly'dagi `/api/catalog/overrides`,
 *     ISR keshi (60 s) + `catalog` tegi (admin saqlaganda darhol yangilanadi)
 * Aloqa uzilsa — oxirgi muvaffaqiyatli holat, u ham bo'lmasa asos katalog.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BASE_PRODUCTS, __replaceProducts } from './catalog';
import {
  EMPTY_OVERRIDES,
  applyTaxonOverrides,
  mergeProducts,
  sanitizeOverrides,
  type CatalogOverrides,
} from './catalog-overrides';
import { DATA_DIR } from './data-dir';
import {
  ALL_GROUPS,
  CATEGORIES,
  COMMODITY_GROUPS,
  FLAVOUR_GROUPS,
  FRAGRANCE_GROUPS,
  INGREDIENT_GROUPS,
  type Taxon,
} from './taxonomy';
import type { CatalogProduct } from './types';

export const CATALOG_DIR = join(DATA_DIR, 'catalog');
const FILE = join(CATALOG_DIR, 'overrides.json');
const BACKEND_URL = (process.env.BACKEND_URL ?? '').trim().replace(/\/+$/, '');

/* asl taksonomiya nusxasi — tuzatmalar har safar shu ustiga qo'yiladi */
const BASE_CATEGORIES: Taxon[] = CATEGORIES.map((c) => ({ ...c }));
const BASE_GROUPS: Taxon[] = [...FLAVOUR_GROUPS, ...FRAGRANCE_GROUPS, ...INGREDIENT_GROUPS, ...COMMODITY_GROUPS].map(
  (g) => ({ ...g }),
);

let applied: string | null = null; // qo'llangan tuzatmalar imzosi
let fileCache: { mtimeMs: number; data: CatalogOverrides } | null = null;
let lastRemote: CatalogOverrides | null = null;

/* ------------------------------------------------------------
   O'qish / yozish (fly)
   ------------------------------------------------------------ */

export function readOverridesFile(): CatalogOverrides {
  try {
    if (!existsSync(FILE)) return EMPTY_OVERRIDES;
    const { mtimeMs } = statSync(FILE);
    if (fileCache && fileCache.mtimeMs === mtimeMs) return fileCache.data;
    const data = sanitizeOverrides(JSON.parse(readFileSync(FILE, 'utf8')));
    fileCache = { mtimeMs, data };
    return data;
  } catch (err) {
    console.error('[catalog] overrides.json o‘qilmadi, asos katalog:', String(err).slice(0, 200));
    return EMPTY_OVERRIDES;
  }
}

export function writeOverridesFile(next: CatalogOverrides): CatalogOverrides {
  const data = sanitizeOverrides({ ...next, updatedAt: new Date().toISOString() });
  mkdirSync(CATALOG_DIR, { recursive: true });
  // har saqlashdan oldingi holat — qo'lda tiklash uchun (oxirgi 20 ta)
  if (existsSync(FILE)) {
    const backups = join(CATALOG_DIR, 'history');
    mkdirSync(backups, { recursive: true });
    writeFileSync(join(backups, `${Date.now()}.json`), readFileSync(FILE));
    pruneHistory(backups, 20);
  }
  const tmp = `${FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  renameSync(tmp, FILE);
  fileCache = null;
  applied = null;
  return data;
}

function pruneHistory(dir: string, keep: number) {
  try {
    const files = readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
    for (const f of files.slice(0, Math.max(0, files.length - keep))) unlinkSync(join(dir, f));
  } catch {
    /* tarixni tozalash muhim emas */
  }
}

/* ------------------------------------------------------------
   Manbadan olish
   ------------------------------------------------------------ */

async function loadOverrides(): Promise<CatalogOverrides> {
  if (!BACKEND_URL) return readOverridesFile();
  try {
    const res = await fetch(`${BACKEND_URL}/api/catalog/overrides`, {
      next: { revalidate: 60, tags: ['catalog'] },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { data?: unknown };
    lastRemote = sanitizeOverrides(json.data);
    return lastRemote;
  } catch (err) {
    console.error('[catalog] backend tuzatmalari olinmadi:', String(err).slice(0, 200));
    return lastRemote ?? EMPTY_OVERRIDES;
  }
}

/** Yuklangan rasm fly'da — sayt Vercel'da bo'lsa mutlaq manzil */
function absolutize(p: CatalogProduct): CatalogProduct {
  if (BACKEND_URL && p.image?.startsWith('/api/media/')) return { ...p, image: `${BACKEND_URL}${p.image}` };
  return p;
}

/** Tuzatmalarni xotiradagi katalog va taksonomiyaga qo'llash */
export function applyOverrides(ov: CatalogOverrides): void {
  const signature = `${ov.updatedAt ?? ''}:${ov.added.length}:${Object.keys(ov.products).length}:${ov.groups.length}:${ov.categories.length}`;
  if (signature === applied) return;

  const hiddenTaxa = new Set<string>();
  applyTaxonOverrides(CATEGORIES, BASE_CATEGORIES, ov.categories, hiddenTaxa);
  applyTaxonOverrides(ALL_GROUPS, BASE_GROUPS, ov.groups, hiddenTaxa);

  const all = mergeProducts(BASE_PRODUCTS as CatalogProduct[], ov).map(absolutize);
  const visible = all.filter((p) => !p.hidden && !hiddenTaxa.has(p.category) && !hiddenTaxa.has(p.group));
  __replaceProducts(visible, all);
  applied = signature;
}

/**
 * Sahifa/route boshida chaqiring. Arzon: tuzatmalar o'zgarmagan bo'lsa
 * (imzo bir xil) hech narsa qayta hisoblanmaydi.
 */
export async function ensureCatalog(): Promise<void> {
  applyOverrides(await loadOverrides());
}

/**
 * Proxy uchun: ko'pi bilan 60 soniyada bir marta yangilash (proxy'da
 * `fetch` ning ISR keshi yo'q — har so'rovda tarmoqqa chiqmaslik uchun).
 */
let ttlLoadedAt = 0;
export async function ensureCatalogTtl(ttlMs = 60_000): Promise<void> {
  // bitta server (fly): fayl mtime bilan keshlangan — arzon, har safar tekshiramiz
  if (!BACKEND_URL) return ensureCatalog();
  if (Date.now() - ttlLoadedAt < ttlMs) return;
  ttlLoadedAt = Date.now();
  await ensureCatalog();
}

/** Admin: joriy tuzatmalar (faqat fly'da — fayldan) */
export function currentOverrides(): CatalogOverrides {
  return readOverridesFile();
}
