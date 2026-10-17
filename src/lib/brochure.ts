/**
 * ELEKTRON KATALOG (broshyura) — flipbook ma'lumotlari
 * ----------------------------------------------------------------
 * Sahifa rasmlari `scripts/build-brochure.mjs` bilan PDF'dan yaratiladi.
 * Til versiyasi yo'q bo'lsa (hozir EN) — o'zbekcha ko'rsatiladi va
 * sahifada bu haqda yoziladi. RU — bosmaxona bukletidan
 * (`scripts/deimpose-booklet.py` → o'qish tartibi → build-brochure).
 */

import ru from '@/data/brochure-ru.json';
import uz from '@/data/brochure-uz.json';
import type { AppLocale } from '@/i18n/meta';

export interface BrochurePage {
  src: string;
  thumb: string;
  width: number;
  height: number;
  spread: boolean;
}

export interface Brochure {
  lang: string;
  pdf: string;
  pdfSizeKb: number;
  pages: BrochurePage[];
}

const BROCHURES: Partial<Record<AppLocale, Brochure>> = {
  uz: uz as Brochure,
  ru: ru as Brochure,
};

export function availableBrochures(): AppLocale[] {
  return Object.keys(BROCHURES) as AppLocale[];
}

/** So'ralgan til bo'lmasa — o'zbekcha (yagona to'liq versiya) */
export function getBrochure(locale: AppLocale): { brochure: Brochure; fallback: boolean } {
  const exact = BROCHURES[locale];
  return exact ? { brochure: exact, fallback: false } : { brochure: BROCHURES.uz!, fallback: true };
}

/**
 * Mundarija: katalog bo'limlari → flipbook "varag'i" (0 — muqova).
 * Varaq raqami = PDF sahifasi − 1 (har PDF sahifasi bitta varaq/yoyilma).
 */
export const BROCHURE_TOC: { sheet: number; key: string }[] = [
  { sheet: 1, key: 'about' },
  { sheet: 2, key: 'food' },
  { sheet: 3, key: 'dairy' },
  { sheet: 5, key: 'fragrance' },
  { sheet: 6, key: 'household' },
  { sheet: 7, key: 'ingredients' },
  { sheet: 8, key: 'wholesale' },
  { sheet: 9, key: 'rnd' },
  { sheet: 10, key: 'assortment' },
  { sheet: 12, key: 'fragranceList' },
  { sheet: 13, key: 'clients' },
];
