'use client';

/**
 * FlyToBox — "+ Namunaga" → header'dagi quti ikonkasiga uchish (§8.2)
 * ----------------------------------------------------------------
 * Tugmadan header'dagi quti ikonkasiga 10px mis nuqta parabola
 * bo'ylab uchadi (500ms), keyin hisoblagich `scale 1 → 1.25 → 1` (300ms).
 *
 * Nega imperativ: nuqta `document.body` ga bir martalik qo'shiladi va
 * uchib bo'lgach o'chiriladi — React daraxtida ortiqcha holat yo'q,
 * har bir katalog qatorida alohida komponent ushlab turish shart emas.
 *
 * Maqsad elementi: `#gff-box-target` (Header'da).
 * reduced-motion → uchish yo'q, faqat hisoblagich pulsatsiyasi.
 */

import { animate } from 'motion/react';
import { ease, prefersReduced } from '@/lib/motion';

export const BOX_TARGET_ID = 'gff-box-target';
/**
 * Header'da quti tugmasi IKKI marta render qilinadi (≥1080px matnli va
 * <1080px ikonkali). Bitta `id` ikki elementda bo'lishi HTML'ni buzadi,
 * shuning uchun nishon `data-box-target` bilan belgilanadi va bu funksiya
 * EKRANDA KO'RINADIGANini tanlaydi.
 */
export const BOX_TARGET_ATTR = 'data-box-target';
export const BOX_PULSE_EVENT = 'gff:box-pulse';

function boxTarget(): HTMLElement | null {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>(`[${BOX_TARGET_ATTR}]`));
  const visible = nodes.find((n) => n.getClientRects().length > 0);
  return visible ?? nodes[0] ?? document.getElementById(BOX_TARGET_ID);
}

const DOT = 10;
const FLIGHT = 0.5;

/** Hisoblagichni pulsatsiya qiladi (header tinglaydi) */
export function pulseBoxCounter(source: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(BOX_PULSE_EVENT, { detail: { source } }));
}

/**
 * Nuqtani `from` elementidan quti ikonkasiga uchiradi.
 * Maqsad topilmasa — faqat pulsatsiya.
 */
export function flyToBox(from: Element | DOMRect | null, source = 'catalog'): void {
  if (typeof window === 'undefined') return;

  const target = boxTarget();
  const fromRect =
    from instanceof DOMRect
      ? from
      : from
        ? from.getBoundingClientRect()
        : null;

  if (!target || !fromRect || prefersReduced()) {
    pulseBoxCounter(source);
    return;
  }

  const toRect = target.getBoundingClientRect();
  const x0 = fromRect.left + fromRect.width / 2 - DOT / 2;
  const y0 = fromRect.top + fromRect.height / 2 - DOT / 2;
  const dx = toRect.left + toRect.width / 2 - DOT / 2 - x0;
  const dy = toRect.top + toRect.height / 2 - DOT / 2 - y0;

  const dot = document.createElement('span');
  dot.setAttribute('aria-hidden', 'true');
  dot.style.cssText = [
    'position:fixed',
    `left:${x0}px`,
    `top:${y0}px`,
    `width:${DOT}px`,
    `height:${DOT}px`,
    'border-radius:999px',
    'background:var(--copper)',
    'pointer-events:none',
    'z-index:120',
    'will-change:transform,opacity',
  ].join(';');
  document.body.appendChild(dot);

  // Parabola: gorizontal tekis, vertikal — yuqoriga ko'tarilib pastga
  const lift = Math.max(60, Math.abs(dy) * 0.35);

  const controls = animate(
    dot,
    {
      x: [0, dx * 0.5, dx],
      y: [0, -lift, dy],
      opacity: [1, 1, 0.25],
      scale: [1, 1.25, 0.7],
    },
    {
      duration: FLIGHT,
      ease: ease.inOut,
      times: [0, 0.45, 1],
      onComplete: () => {
        dot.remove();
        pulseBoxCounter(source);
      },
    },
  );

  // Sahifa almashsa — nuqtani majburan olib tashlaymiz
  window.setTimeout(() => {
    if (dot.isConnected) {
      controls.stop();
      dot.remove();
    }
  }, FLIGHT * 1000 + 400);
}

/**
 * "To'plamni qo'shish" — N ta nuqta ketma-ket, 60ms oraliq bilan (§8.3).
 * Hisoblagich pulsatsiyasi oxirgi nuqtadan keyin (flyToBox ichida).
 */
export function flyToBoxMany(from: Element | null, count: number, source = 'set'): void {
  if (typeof window === 'undefined') return;

  const rect = from instanceof Element ? from.getBoundingClientRect() : from;
  const n = Math.max(1, Math.min(count, 8));

  if (prefersReduced() || !boxTarget()) {
    pulseBoxCounter(source);
    return;
  }

  for (let i = 0; i < n; i += 1) {
    window.setTimeout(() => flyToBox(rect, source), i * 0.06 * 1000);
  }
}

export const FLY_STAGGER = 0.06;
