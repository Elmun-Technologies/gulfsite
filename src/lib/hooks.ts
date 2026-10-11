'use client';

/**
 * UMUMIY HOOKLAR
 * ----------------------------------------------------------------
 * `useHydrated()` — "komponent brauzerda gidratsiya bo'ldimi?" bayrog'i.
 *
 * Nega oddiy `useState(false) + useEffect(() => setMounted(true))` emas?
 * React 19 + yangi react-hooks qoidalari effect ichida SINXRON setState ni
 * "cascading render" deb hisoblaydi. useSyncExternalStore esa aynan shu
 * vazifa uchun mo'ljallangan: server snapshot = false, client snapshot = true.
 * Gidratsiya paytida mos kelmaslik (hydration mismatch) bo'lmaydi.
 */

import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};
const getServerSnapshot = () => false;
const getClientSnapshot = () => true;

export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, getClientSnapshot, getServerSnapshot);
}

/* ------------------------------------------------------------
   Kuzatuvchi hook'lar — `motion/react` ga bog'liq EMAS
   ------------------------------------------------------------
   Nega bu yerda: `<Reveal>` deyarli HAR sahifada ishlatiladi. U
   `motion/react` dan `useInView`/`useReducedMotion` olganida, butun
   motion kutubxonasi (~45 KB gzip) har bir sahifaning birinchi
   yuklanishiga tushardi — hatto animatsiya CSS orqali bo'lsa ham
   (`[data-reveal]`). Bu ikki hook kichik va mustaqil, shuning uchun
   reveal-only sahifalar (privacy, terms, about, 404) motion'ni umuman
   yuklamaydi (§14.5: birinchi sahifa JS og'irligi).
*/

import { useEffect, useRef, useState } from 'react';

/**
 * `prefers-reduced-motion: reduce` — jonli (o'zgarsa qayta render).
 * SSR'da `false`: server media so'rovni bilmaydi, gidratsiya mosligi
 * uchun birinchi klient render'ida ham `false` qaytadi, keyin yangilanadi.
 */
export function useReducedMotionPref(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return reduce;
}

/**
 * Element ko'rinishga kirdimi — IntersectionObserver.
 *
 * `once: true`  → birinchi kirishdan keyin kuzatuvchi o'chadi (§8.1:
 *                  kirish animatsiyasi BIR MARTA).
 * `amount`     → elementning qancha qismi ko'rinishi kerak (0.2 = 20%).
 * Observer bo'lmasa (eski brauzer) → darhol `true`: kontent ko'rinadigan
 * qoladi, hech narsa yo'qolmaydi (§8.7).
 */
export function useInViewOnce<T extends Element>(
  options: { once?: boolean; amount?: number; rootMargin?: string } = {},
): [React.RefObject<T | null>, boolean] {
  const { once = true, amount = 0.2, rootMargin = '0px' } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setInView(true);
          if (once) io.disconnect();
        }
        if (!once) {
          const anyIn = entries.some((e) => e.isIntersecting);
          if (!anyIn) setInView(false);
        }
      },
      { threshold: Math.min(Math.max(amount, 0), 1), rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once, amount, rootMargin]);

  return [ref, inView];
}
