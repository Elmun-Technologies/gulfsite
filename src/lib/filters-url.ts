/**
 * FILTR ↔ URL
 * ----------------------------------------------------------------
 * Nima uchun alohida fayl:
 *   `catalog.ts` butun catalog.json'ni import qiladi (300 KB). Agar
 *   klient komponenti URL yig'ish uchun shu faylni import qilsa,
 *   katalog brauzer bundle'iga tushib qoladi. Bu modul HECH NARSA
 *   import qilmaydi — shuning uchun uni xotirjam klientda ishlatamiz.
 *
 * Natija: har bir filtr holati havolaga aylanadi. Mijoz "shu filtrlar
 * bilan" havolani hamkasbiga yuborishi mumkin — B2B'da bu juda muhim.
 */

import type { CatalogFilters, SortKey } from './types';
import { DEFAULT_FILTERS } from './types';

/** Ko'p qiymatli filtr kalitlari (vergul bilan ajratiladi) */
export const LIST_KEYS: (keyof CatalogFilters)[] = [
  'categories',
  'groups',
  'applications',
  'forms',
  'features',
  'packaging',
  'availability',
];

export const VALID_SORTS: SortKey[] = [
  'popular',
  'name-asc',
  'name-desc',
  'dosage-asc',
  'dosage-desc',
  'new',
  'sku',
];

/** Filtrlarni URL parametrlariga aylantirish (bo'sh qiymatlar chiqarilmaydi) */
export function filtersToParams(f: CatalogFilters): URLSearchParams {
  const sp = new URLSearchParams();
  if (f.q.trim()) sp.set('q', f.q.trim());

  for (const key of LIST_KEYS) {
    const raw = f[key];
    if (!Array.isArray(raw) || raw.length === 0) continue;
    sp.set(key, raw.map(String).join(','));
  }

  if (f.dosageMax != null) sp.set('dose', String(f.dosageMax));
  if (f.onlyNew) sp.set('new', '1');
  if (f.onlyTop) sp.set('top', '1');
  if (f.sort !== DEFAULT_FILTERS.sort) sp.set('sort', f.sort);
  if (f.page > 1) sp.set('page', String(f.page));
  return sp;
}

/** Filtrlarni URL'dan tiklash — barcha qiymatlar chegaralanadi (xavfsizlik) */
export function paramsToFilters(sp: URLSearchParams): CatalogFilters {
  const readList = (key: string) =>
    (sp.get(key) ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const sortRaw = sp.get('sort') as SortKey | null;
  const doseRaw = sp.get('dose');
  const doseNum = doseRaw != null ? Number(doseRaw) : null;

  return {
    q: (sp.get('q') ?? '').slice(0, 120),
    categories: readList('categories').slice(0, 20),
    groups: readList('groups').slice(0, 40),
    applications: readList('applications').slice(0, 40),
    forms: readList('forms').slice(0, 20),
    features: readList('features').slice(0, 30),
    packaging: readList('packaging')
      .map(Number)
      .filter((n) => Number.isFinite(n) && n > 0 && n <= 10000)
      .slice(0, 20),
    availability: readList('availability').slice(0, 10),
    dosageMax:
      doseNum != null && Number.isFinite(doseNum) && doseNum >= 0 && doseNum <= 100 ? doseNum : null,
    onlyNew: sp.get('new') === '1',
    onlyTop: sp.get('top') === '1',
    sort: sortRaw && VALID_SORTS.includes(sortRaw) ? sortRaw : DEFAULT_FILTERS.sort,
    page: Math.max(1, Math.min(500, Number(sp.get('page') ?? '1') || 1)),
  };
}

/** URL'dan filtrlarni o'qish (server sahifalarida qulay) */
export function searchParamsToFilters(
  sp: Record<string, string | string[] | undefined> | URLSearchParams,
): CatalogFilters {
  const url = sp instanceof URLSearchParams ? sp : new URLSearchParams();
  if (!(sp instanceof URLSearchParams)) {
    for (const [k, v] of Object.entries(sp)) {
      if (v == null) continue;
      url.set(k, Array.isArray(v) ? v.filter(Boolean).join(',') : v);
    }
  }
  return paramsToFilters(url);
}

/** Faol filtrlar soni (tugmadagi hisoblagich uchun) */
export function countActive(f: CatalogFilters): number {
  let n = 0;
  if (f.q.trim()) n++;
  for (const key of LIST_KEYS) {
    const v = f[key];
    if (Array.isArray(v) && v.length) n++;
  }
  if (f.dosageMax != null) n++;
  if (f.onlyNew) n++;
  if (f.onlyTop) n++;
  return n;
}

/** Filtr holati standartdan farq qiladimi? */
export function isDefault(f: CatalogFilters): boolean {
  return countActive(f) === 0 && f.sort === DEFAULT_FILTERS.sort;
}
