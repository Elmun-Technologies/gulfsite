'use client';

/**
 * REVEAL PRIMITIVLARI (§8.2)
 * ----------------------------------------------------------------
 * `<Reveal>`      y: 24 → 0, opacity 0 → 1, 700ms, out-expo
 * `<RevealGroup>` bolalarga stagger bilan Reveal
 *
 * Mexanika globals.css'dagi `[data-reveal]` qoidalarida. Nega CSS
 * o'tish va motion'ning inline `opacity:0` emas — globals.css'da
 * izoh bor. Qisqacha: SSR HTML ko'rinadigan qoladi, gidratsiya
 * nomutanosibligi bo'lmaydi, kompozitorda 60fps.
 *
 * Ko'rinishni `useInViewOnce()` (IntersectionObserver, `lib/hooks`)
 * kuzatadi: `once: true, amount: 0.2` — kirish animatsiyasi BIR MARTA
 * (§8.1). `prefers-reduced-motion` → `useReducedMotionPref()`.
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';
import { dur, stagger as STAGGER, staggerMobile, STAGGER_MAX } from '@/lib/motion';
import { useHydrated, useInViewOnce, useReducedMotionPref } from '@/lib/hooks';

/* `motion/react` BU FAYLDA ISHLATILMAYDI: reveal mexanikasi CSS'da
   (`[data-reveal]`), kuzatuv esa IntersectionObserver/matchMedia orqali.
   Nega muhim: `<Reveal>` deyarli har sahifada bor — motion importi butun
   kutubxonani (~45 KB gzip) barcha sahifalarning birinchi yuklanishiga
   tushirardi (§14.5). Endi reveal-only sahifalar motion'ni yuklamaydi. */

/* ------------------------------------------------------------
   Ekran kengligi hook'lari
   ------------------------------------------------------------ */

/** Ekran < breakpoint (default 768). SSR'da doim false → mismatch yo'q. */
export function useIsMobile(breakpoint = 768): boolean {
  const hydrated = useHydrated();
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [breakpoint]);

  return hydrated ? narrow : false;
}

/** Tab ko'rinmayaptimi (`visibilitychange`) — cheksiz animatsiyalarni to'xtatish uchun */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const apply = () => setVisible(document.visibilityState !== 'hidden');
    apply();
    document.addEventListener('visibilitychange', apply);
    return () => document.removeEventListener('visibilitychange', apply);
  }, []);
  return visible;
}

/* ------------------------------------------------------------
   Reveal
   ------------------------------------------------------------ */

/** son → px, satr → o'zgarishsiz */
function px(v: number | string): string {
  return typeof v === 'number' ? `${v}px` : v;
}

const GroupCtx = createContext<{ next: () => number; step: number } | null>(null);

/**
 * Har bir Reveal o'z indeksini FAQAT birinchi render'da oladi va
 * saqlab qo'yadi — keyingi re-render'lar stagger'ni buzmaydi.
 */
function useStableIndex(group: { next: () => number } | null): number {
  const stored = useRef<number | null>(null);
  if (group && stored.current === null) stored.current = group.next();
  return stored.current ?? 0;
}

export interface RevealProps extends Record<string, unknown> {
  children?: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  /** sekund */
  delay?: number;
  /** px yoki foiz ('40%') */
  y?: number | string;
  x?: number | string;
  /** gorizontal masshtab (chiziq: sx=0 → scaleX 0→1) */
  sx?: number;
  sy?: number;
  /** transform-origin: 'left' | 'right' | 'top' | 'bottom' | 'center' */
  origin?: string;
  /** `view` — ko'rinishga kirganda (default), `mount` — gidratsiyadan keyin */
  trigger?: 'view' | 'mount';
  /** ko'rinish chegarasi: 0.2 = elementning 20% i */
  amount?: number;
  once?: boolean;
  /** clip-path: inset(0 0 100% 0) → inset(0), 900ms */
  clip?: boolean;
  id?: string;
}

export function Reveal({
  children,
  as: Tag = 'div',
  className,
  style,
  delay,
  y = 24,
  x = 0,
  sx = 1,
  sy = 1,
  origin = 'center',
  trigger = 'view',
  amount = 0.2,
  once = true,
  clip = false,
  ...rest
}: RevealProps) {
  const hydrated = useHydrated();
  const reduce = useReducedMotionPref();
  const group = useContext(GroupCtx);

  const [ref, inView] = useInViewOnce<HTMLElement>({ once, amount });

  const index = useStableIndex(group);
  const autoDelay = group ? Math.min(index, STAGGER_MAX - 1) * group.step : 0;
  const finalDelay = delay ?? autoDelay;

  const isIn = reduce ? true : trigger === 'mount' ? hydrated : inView;

  const vars = {
    '--reveal-y': px(y),
    '--reveal-x': px(x),
    '--reveal-sx': String(sx),
    '--reveal-sy': String(sy),
    '--reveal-origin': origin,
    '--reveal-delay': `${finalDelay}s`,
    '--reveal-dur': clip ? '0.9s' : `${dur.reveal}s`,
    ...style,
  } as CSSProperties;

  return (
    <Tag
      ref={ref}
      className={className}
      style={vars}
      {...(clip ? { 'data-reveal-clip': '' } : { 'data-reveal': '' })}
      data-in={isIn ? 'true' : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Bolalarni ketma-ket (stagger) ochadi.
 * Qadam: 60ms desktop, 40ms mobil (§8.1). Maks. 8 element — qolganlari darhol.
 */
export function RevealGroup({
  children,
  as: Tag = 'div',
  className,
  style,
  step,
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  step?: number;
} & Record<string, unknown>) {
  const reduce = useReducedMotionPref();
  const isMobile = useIsMobile();
  const hydrated = useHydrated();

  // Hisoblagichni har render'da nollaymiz: bolalar tartibi barqaror.
  const counter = useRef(-1);
  counter.current = -1;

  const ctx = useMemo(
    () => ({
      next: () => (counter.current += 1),
      step: reduce ? 0 : (step ?? (isMobile ? staggerMobile : STAGGER)),
    }),
    // counter ref — barqaror; hydrated mobil aniqlangach qayta hisoblaydi
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reduce, step, isMobile, hydrated],
  );

  return (
    <GroupCtx.Provider value={ctx}>
      <Tag className={className} style={style} {...rest}>
        {children}
      </Tag>
    </GroupCtx.Provider>
  );
}
