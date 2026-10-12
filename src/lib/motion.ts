/**
 * ANIMATSIYA TOKENLARI (§8.1)
 * ----------------------------------------------------------------
 * Yagona manba. Barcha motion komponentlari shu qiymatlarni oladi —
 * komponent ichida "sehrli" son yozish taqiqlanadi.
 *
 * Qoidalar:
 *   · faqat transform + opacity animatsiya qilinadi
 *     (istisno: accordion height, namunalar bloki clip-path)
 *   · kirish animatsiyalari bir marta (once: true, amount: 0.2)
 *   · prefers-reduced-motion → harakat o'chadi, 200ms opacity qoladi
 *   · mobil (<768px): stagger 40ms, masofa 16px, parallax yo'q
 */

import type { BezierDefinition, Transition } from 'motion/react';

/** out-expo — barcha kirishlar; inOut — almashinuvlar */
export const ease: Record<'out' | 'inOut' | 'overshoot', BezierDefinition> = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  /** biroz overshoot (aloqa triptixidagi mis doira) */
  overshoot: [0.34, 1.56, 0.64, 1],
};

/** sekund */
export const dur = {
  fast: 0.16,
  base: 0.32,
  slow: 0.6,
  reveal: 0.7,
  /** monogramma almashinuvi */
  cycle: 0.9,
  /** satr maskasidan chiqish */
  line: 0.7,
  /** count-up */
  count: 1.2,
  /** monogramma/slogan almashinish davri */
  cycleInterval: 4.5,
} as const;

/** Ketma-ketlik oralig'i. Maks. 8 element — keyingilari darhol. */
export const stagger = 0.06;
export const staggerMobile = 0.04;
export const STAGGER_MAX = 8;

/** Kirish masofalari (px) */
export const offset = {
  reveal: 24,
  revealMobile: 16,
  capsule: -32,
  pill: 12,
  menu: -12,
} as const;

/** Standart o'tishlar — `transition={t.out()}` */
export const t = {
  out: (duration = dur.base, delay = 0): Transition => ({ duration, delay, ease: ease.out }),
  inOut: (duration = dur.base, delay = 0): Transition => ({ duration, delay, ease: ease.inOut }),
  overshoot: (duration = dur.slow, delay = 0): Transition => ({ duration, delay, ease: ease.overshoot }),
  springSoft: (): Transition => ({ type: 'spring', stiffness: 320, damping: 30 }),
};

/**
 * Stagger indeksini 8 ta bilan cheklaydi — dizayn qoidasi (§8.1):
 * ko'p elementli ro'yxatlarda faqat birinchi 8 tasi ketma-ket,
 * qolganlari darhol paydo bo'ladi.
 */
export function staggerDelay(index: number, step = stagger): number {
  return Math.min(index, STAGGER_MAX - 1) * step;
}

/**
 * `prefers-reduced-motion: reduce` — motion kutubxonasining ichki
 * holatiga bog'liq bo'lmaslik uchun to'g'ridan-to'g'ri matchMedia.
 * SSR'da doim false.
 */
export function prefersReduced(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
