'use client';

/**
 * SplitLines — sarlavha satrlari maskadan chiqadi (§8.2)
 * ----------------------------------------------------------------
 * Matn `\n` bo'yicha bo'linadi (SO'Z bo'yicha emas — dizayn qoidasi).
 * Har satr `overflow: hidden` ichida, matn `y: 105% → 0`, 700ms,
 * satrlar orasi 80ms.
 *
 * SSR: HTML'da butun sarlavha ko'rinadigan (JS ishlamasa ham).
 */

import { useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { dur, staggerMobile } from '@/lib/motion';
import { useHydrated } from '@/lib/hooks';
import { cn } from '@/lib/utils';

const LINE_STEP = 0.08; // 80ms

export function SplitLines({
  text,
  as: Tag = 'span',
  className,
  lineClassName,
  delay = 0,
  amount = 0.3,
  trigger = 'view',
  id,
}: {
  text: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div';
  className?: string;
  lineClassName?: string;
  /** sekund */
  delay?: number;
  amount?: number;
  /** `view` — ko'rinishga kirganda, `mount` — gidratsiyadan keyin (hero) */
  trigger?: 'view' | 'mount';
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount });

  const lines = text.split('\n');
  const isIn = reduce ? true : trigger === 'mount' ? hydrated : inView;
  const step = hydrated && window.innerWidth < 768 ? staggerMobile : LINE_STEP;

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={cn('block', className)}
      data-in={isIn ? 'true' : undefined}
      style={{ '--reveal-dur': `${dur.line}s` } as React.CSSProperties}
    >
      {lines.map((line, i) => (
        <span key={i} data-line-mask aria-hidden={i > 0 ? undefined : undefined}>
          <span
            data-line=""
            className={cn(lineClassName)}
            style={{ '--reveal-delay': `${delay + i * step}s` } as React.CSSProperties}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
