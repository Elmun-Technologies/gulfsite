'use client';

/**
 * CountUp — ko'rinishga kirganda 0 → qiymat, 1.2s, out-expo (§8.2)
 * ----------------------------------------------------------------
 * · `Intl.NumberFormat` — lokal raqam formati (uz/ru/en)
 * · "2002" kabi YILLAR count-up qilinmaydi: `plain` prop'i
 * · reduced-motion → yakuniy qiymat darhol ko'rinadi
 * · SSR → yakuniy qiymat HTML'da bor (JS ishlamasa ham to'g'ri)
 */

import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { dur, ease } from '@/lib/motion';
import { useHydrated } from '@/lib/hooks';

const LOCALE_TAG: Record<string, string> = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-US' };

export function CountUp({
  value,
  locale = 'uz',
  suffix = '',
  prefix = '',
  decimals = 0,
  plain = false,
  amount = 0.4,
  className,
}: {
  value: number;
  locale?: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  /** true — count-up qilinmaydi (yillar: 2002) */
  plain?: boolean;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const inView = useInView(ref, { once: true, amount });
  const [display, setDisplay] = useState(value);
  const done = useRef(false);

  useEffect(() => {
    if (plain || reduce || !hydrated || !inView || done.current) return;
    done.current = true;

    const controls = animate(0, value, {
      duration: dur.count,
      ease: ease.out,
      onUpdate: (v: number) => setDisplay(v),
      onComplete: () => setDisplay(value),
    });

    return () => controls.stop();
  }, [plain, reduce, hydrated, inView, value, locale, decimals]);

  const text =
    plain || reduce || !hydrated
      ? value.toLocaleString(LOCALE_TAG[locale] ?? locale, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : new Intl.NumberFormat(LOCALE_TAG[locale] ?? locale, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(display);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}
