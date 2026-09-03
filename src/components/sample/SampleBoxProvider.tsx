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

function readStorage(): SampleItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is SampleItem =>
          !!x && typeof x === 'object' && typeof (x as SampleItem).sku === 'string' && !!(x as SampleItem).name,
      )
      .slice(0, MAX_ITEMS)
      .map((x) => ({
        sku: x.sku,
        slug: x.slug ?? '',
        name: {
          uz: x.name?.uz ?? '',
          ru: x.name?.ru ?? '',
          en: x.name?.en ?? '',
        },
        qty: Number.isFinite(x.qty) ? Math.max(1, Math.min(5000, x.qty)) : 50,
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
  const hydrated = useRef(false);

  // Gidratsiya: birinchi render'dan keyin o'qiymiz (SSR mos kelishi uchun).
  // localStorage brauzerdagina bor — shuning uchun effect majburiy.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readStorage());
    setReady(true);
    hydrated.current = true;
  }, []);

  // Boshqa tab'dagi o'zgarishlarni tinglash
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // O'zgarishlarni saqlash
  useEffect(() => {
    if (hydrated.current) writeStorage(items);
  }, [items]);

  const has = useCallback((sku: string) => items.some((i) => i.sku === sku), [items]);

  const add = useCallback(
    (p: BoxProduct): 'added' | 'exists' | 'full' => {
      let result: 'added' | 'exists' | 'full' = 'added';
      setItems((prev) => {
        if (prev.some((i) => i.sku === p.sku)) {
          result = 'exists';
          return prev;
        }
        if (prev.length >= MAX_ITEMS) {
          result = 'full';
          return prev;
        }
        return [
          ...prev,
          {
            sku: p.sku,
            slug: p.slug,
            name: p.name,
            qty: p.defaultQty ?? 50,
            unit: p.unit ?? 'g',
          },
        ];
      });
      return result;
    },
    [],
  );

  const addMany = useCallback((list: BoxProduct[]) => {
    let added = 0;
    let skipped = 0;
    setItems((prev) => {
      const next = [...prev];
      for (const p of list) {
        if (next.length >= MAX_ITEMS || next.some((i) => i.sku === p.sku)) {
          skipped += 1;
          continue;
        }
        next.push({ sku: p.sku, slug: p.slug, name: p.name, qty: p.defaultQty ?? 50, unit: p.unit ?? 'g' });
        added += 1;
      }
      return next;
    });
    return { added, skipped };
  }, []);

  const remove = useCallback((sku: string) => setItems((prev) => prev.filter((i) => i.sku !== sku)), []);

  const setQty = useCallback(
    (sku: string, qty: number) =>
      setItems((prev) =>
        prev.map((i) => (i.sku === sku ? { ...i, qty: Math.max(1, Math.min(5000, Math.round(qty) || 1)) } : i)),
      ),
    [],
  );

  const setNote = useCallback(
    (sku: string, note: string) =>
      setItems((prev) => prev.map((i) => (i.sku === sku ? { ...i, note: note.slice(0, 300) } : i))),
    [],
  );

  const clear = useCallback(() => setItems([]), []);

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
