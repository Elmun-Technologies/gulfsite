/**
 * DIZAYN XARITASI — KLIENT UCHUN XAVFSIZ QISM
 * ----------------------------------------------------------------
 * `lib/design.ts` server moduli (`node:fs` bilan fayl mavjudligini
 * tekshiradi) — uni klient komponentiga import qilib bo'lmaydi. Bu fayl
 * faqat statik yo'l xaritalarini saqlaydi va ikki tomonda ham ishlaydi.
 */

import type { MonogramVariant } from '@/components/motion';

/** Foto-monogramma fayllari (§15 — vaqtincha PNG, ota kompaniyadan SVG keladi) */
export const MONOGRAM_SRC: Record<MonogramVariant, string> = {
  joy: '/images/monogram-berries.png',
  bliss: '/images/monogram-citrus.png',
  delight: '/images/monogram-coffee.png',
};

export function monogramSrc(variant: MonogramVariant): string {
  return MONOGRAM_SRC[variant];
}

/** Mis monogramma (logo, footer, tasdiq ekranlari — §4.6) */
export const LOGO_COPPER = '/images/monogram-copper.png';

/** Qadoq fotolari (mijozning haqiqiy suratlari, §15) */
export const PACK_SRC = [
  { kg: 1, src: '/images/pack-1kg.jpg' },
  { kg: 5, src: '/images/pack-5kg.jpg' },
  { kg: 10, src: '/images/pack-10kg.jpg' },
] as const;
