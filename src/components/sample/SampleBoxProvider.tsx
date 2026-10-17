'use client';

/**
 * TEST BOX KONTEKSTI
 * ----------------------------------------------------------------
 * Foydalanuvchi katalogda mahsulot tanlaydi → localStorage'da saqlanadi
 * → /samples sahifasida ro'yxat ko'rinadi → bitta zayvka yuboriladi.
 *
 * Nima uchun localStorage:
 *   - server holati kerak emas (leadlar serverda saqlanadi)
 *   - sahifa yangilansa ham tanlov yo'qolmaydi
 *   - turli tab'larda sinxronizatsiya ('storage' hodisasi orqali)
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { siteConfig } from '@/lib/config';
import type { SampleItem } from '@/lib/types';
import type { Trilingual } from '@/lib/taxonomy';

const STORAGE_KEY = 'gff_sample_box_v2';
const MAX_ITEMS = siteConfig.business.sampleBoxMaxItems;

export interface BoxProduct {
  sku: string;
  slug: string;
  name: Trilingual;
  /** grammda standart namuna hajmi */
  defaultQty?: number;
  unit?: SampleItem['unit'];
}

interface SampleBoxCtx {
  items: SampleItem[];
  count: number;
  max: number;
  full: boolean;
  ready: boolean;
  has: (sku: string) => boolean;
  add: (p: BoxProduct) => 'added' | 'exists' | 'full';
  remove: (sku: string) => void;
  setQty: (sku: string, qty: number) => void;
  setNote: (sku: string, note: string) => void;
  clear: () => void;
  /** Bir nechta mahsulotni bir vaqtda qo'shish (ombor tugmasi) */
  addMany: (list: BoxProduct[]) => { added: number; skipped: number };
}

const Ctx = createContext<SampleBoxCtx | null>(null);

/* ---------------- saqlash / o'qish ---------------- */

/** Namuna o'lchami faqat 25 / 50 / 100 (§5) — boshqa qiymat eng yaqiniga */
const QTY_OPTIONS = [25, 50, 100] as const;
function snapQty(qty: unknown): number {
  const n = Number(qty);
  if (!Number.isFinite(n)) return 50;
  return QTY_OPTIONS.reduce((best, o) => (Math.abs(o - n) < Math.abs(best - n) ? o : best), 50 as number);
}

function readStorage(): SampleItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    return parsed
      .filter(
        (x): x is SampleItem =>
          !!x && typeof x === 'object' && typeof (x as SampleItem).sku === 'string' && !!(x as SampleItem).name,
      )
      // takroriy SKU (eski/buzilgan ma'lumot) — React kalitlari to'qnashmasin
      .filter((x) => (seen.has(x.sku) ? false : (seen.add(x.sku), true)))
      .slice(0, MAX_ITEMS)
      .map((x) => ({
        sku: x.sku,
        slug: x.slug ?? '',
        name: {
          uz: x.name?.uz ?? '',
          ru: x.name?.ru ?? '',
          en: x.name?.en ?? '',
        },
        qty: snapQty(x.qty),
        unit: x.unit === 'ml' || x.unit === 'kg' ? x.unit : 'g',
        note: typeof x.note === 'string' ? x.note.slice(0, 300) : undefined,
      }));
  } catch {
    return [];
  }
}

function writeStorage(items: SampleItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* kvota to'lgan yoki private mode — jim o'tamiz */
  }
}

/* ---------------- provider ---------------- */

export function SampleBoxProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SampleItem[]>([]);
  const [ready, setReady] = useState(false);
  // add/addMany natijasi (added/exists/full) setState updater'idan EMAS, shu
  // ko'zgudan hisoblanadi — updater keyinroq (render paytida) bajarilishi mumkin.
  const itemsRef = useRef<SampleItem[]>([]);

  // Gidratsiya: birinchi render'dan keyin o'qiymiz (SSR mos kelishi uchun).
  // localStorage brauzerdagina bor — shuning uchun effect majburiy.
  useEffect(() => {
    const stored = readStorage();
    itemsRef.current = stored;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(stored);
    setReady(true);
  }, []);

  // Boshqa tab'dagi o'zgarishlarni tinglash
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const stored = readStorage();
      itemsRef.current = stored;
      setItems(stored);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // O'zgarishlarni saqlash. `ready` shu commit'ning state'i: gidratsiya
  // commit'ida u hali false — boshlang'ich [] localStorage'ni o'chirmaydi
  // (StrictMode'da qayta o'qish ham saqlangan qutini ko'radi).
  useEffect(() => {
    if (ready) writeStorage(items);
  }, [items, ready]);

  const commit = useCallback((next: SampleItem[]) => {
    itemsRef.current = next;
    setItems(next);
  }, []);

  const has = useCallback((sku: string) => items.some((i) => i.sku === sku), [items]);

  const add = useCallback(
    (p: BoxProduct): 'added' | 'exists' | 'full' => {
      const prev = itemsRef.current;
      if (prev.some((i) => i.sku === p.sku)) return 'exists';
      if (prev.length >= MAX_ITEMS) return 'full';
      commit([
        ...prev,
        { sku: p.sku, slug: p.slug, name: p.name, qty: snapQty(p.defaultQty ?? 50), unit: p.unit ?? 'g' },
      ]);
      return 'added';
    },
    [commit],
  );

  const addMany = useCallback(
    (list: BoxProduct[]) => {
      let added = 0;
      let skipped = 0;
      const next = [...itemsRef.current];
      for (const p of list) {
        if (next.length >= MAX_ITEMS || next.some((i) => i.sku === p.sku)) {
          skipped += 1;
          continue;
        }
        next.push({ sku: p.sku, slug: p.slug, name: p.name, qty: snapQty(p.defaultQty ?? 50), unit: p.unit ?? 'g' });
        added += 1;
      }
      if (added) commit(next);
      return { added, skipped };
    },
    [commit],
  );

  const remove = useCallback((sku: string) => commit(itemsRef.current.filter((i) => i.sku !== sku)), [commit]);

  const setQty = useCallback(
    (sku: string, qty: number) =>
      commit(itemsRef.current.map((i) => (i.sku === sku ? { ...i, qty: snapQty(qty) } : i))),
    [commit],
  );

  const setNote = useCallback(
    (sku: string, note: string) =>
      commit(itemsRef.current.map((i) => (i.sku === sku ? { ...i, note: note.slice(0, 300) } : i))),
    [commit],
  );

  const clear = useCallback(() => commit([]), [commit]);

  const value = useMemo<SampleBoxCtx>(
    () => ({
      items,
      count: items.length,
      max: MAX_ITEMS,
      full: items.length >= MAX_ITEMS,
      ready,
      has,
      add,
      addMany,
      remove,
      setQty,
      setNote,
      clear,
    }),
    [items, ready, has, add, addMany, remove, setQty, setNote, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

const EMPTY: SampleBoxCtx = {
  items: [],
  count: 0,
  max: MAX_ITEMS,
  full: false,
  ready: false,
  has: () => false,
  add: () => 'full',
  addMany: () => ({ added: 0, skipped: 0 }),
  remove: () => {},
  setQty: () => {},
  setNote: () => {},
  clear: () => {},
};

/** Provider bo'lmasa ham sahifa buzilmasligi uchun xavfsiz hook */
export function useSampleBox(): SampleBoxCtx {
  return useContext(Ctx) ?? EMPTY;
}

export { STORAGE_KEY, MAX_ITEMS };
