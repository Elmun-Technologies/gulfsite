'use client';

/**
 * MonogramCycle — brend monogrammasi va slogan almashinuvi (§8.2)
 * ----------------------------------------------------------------
 * 3 foto-monogramma (berries → citrus → coffee) va slogan
 * (Joy → Bliss → Delight) har 4.5s almashadi:
 *   eskisi: opacity 1→0, scale 1→0.96
 *   yangisi: opacity 0→1, scale 1.04→1
 *   900ms, ease.inOut
 *
 * Pauza: hover'da, tab ko'rinmaganda (`visibilitychange`),
 * blok ekrandan chiqqanda va reduced-motion'da (§8.4).
 *
 * Slogan BARCHA tillarda inglizcha qoladi (§10).
 * Monogrammani cho'zish / rangini o'zgartirish taqiqlanadi (§17).
 */

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { dur, ease } from '@/lib/motion';
import { usePageVisible } from './Reveal';

export type MonogramVariant = 'joy' | 'bliss' | 'delight';

/**
 * Slogan va alt-matn LUG'ATDAN keladi (`lib/design.ts → monogramCopy()`).
 * Slogan qiymatlari uchchala tilda bir xil — §10.4 talabi ("A sense of
 * Joy/Bliss/Delight" tarjima qilinmaydi), lekin komponentda hardcode
 * qilinmaydi (§10.1) va alt-matn har tilda o'zicha (§14).
 */
export interface MonogramCopy {
  slogan: Record<MonogramVariant, string>;
  alt: Record<MonogramVariant, string>;
}

const SLIDES: { id: MonogramVariant; src: string }[] = [
  { id: 'joy', src: '/images/monogram-berries.png' },
  { id: 'bliss', src: '/images/monogram-citrus.png' },
  { id: 'delight', src: '/images/monogram-coffee.png' },
];

const INTERVAL = 4500;

export function slideByVariant(variant: MonogramVariant) {
  return SLIDES.find((s) => s.id === variant) ?? SLIDES[0];
}

export function MonogramCycle({
  variant = 'joy',
  cycle = true,
  copy,
  className,
  imageClassName,
  sloganClassName,
  priority = false,
  sizes = '(max-width: 768px) 62vw, 440px',
  width = 440,
}: {
  variant?: MonogramVariant;
  cycle?: boolean;
  /** slogan + alt matnlar (lug'atdan) */
  copy: MonogramCopy;
  className?: string;
  imageClassName?: string;
  sloganClassName?: string;
  priority?: boolean;
  sizes?: string;
  /** ko'rsatiladigan maksimal kenglik (px) — layout shift'ning oldini oladi */
  width?: number;
}) {
  const startIndex = Math.max(
    0,
    SLIDES.findIndex((s) => s.id === variant),
  );
  const [index, setIndex] = useState(startIndex);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const pageVisible = usePageVisible();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(boxRef, { amount: 0.25 });

  useEffect(() => {
    if (!cycle || reduce || paused || !pageVisible || !inView) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => window.clearInterval(id);
  }, [cycle, reduce, paused, pageVisible, inView]);

  const active = SLIDES[index];
  const animate = cycle && !reduce;

  return (
    <div
      ref={boxRef}
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className={imageClassName} style={{ position: 'relative', width: '100%', aspectRatio: '498 / 523' }}>
        {SLIDES.map((slide, i) => (
          <motion.div
            key={slide.id}
            aria-hidden={i !== index}
            style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}
            initial={false}
            animate={{
              opacity: i === index ? 1 : 0,
              scale: i === index ? 1 : 0.96,
            }}
            transition={{ duration: animate ? dur.cycle : 0, ease: ease.inOut }}
          >
            <Image
              src={slide.src}
              alt={i === index ? copy.alt[slide.id] : ''}
              width={498}
              height={523}
              priority={priority && i === startIndex}
              quality={90}
              sizes={sizes}
              style={{ width: '100%', maxWidth: width, height: 'auto', objectFit: 'contain' }}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={active.id}
          className={sloganClassName}
          initial={animate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          exit={animate ? { opacity: 0 } : undefined}
          transition={{ duration: animate ? dur.cycle * 0.6 : 0, ease: ease.inOut }}
        >
          {copy.slogan[active.id]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/** Statik (almashinmaydigan) monogramma — About/Styleguide uchun */
export function MonogramStatic({
  variant = 'joy',
  alt,
  className,
  priority = false,
  width = 440,
  sizes = '(max-width: 768px) 62vw, 440px',
}: {
  variant?: MonogramVariant;
  /** lug'atdan olingan alt-matn (§14) */
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
  sizes?: string;
}) {
  const slide = slideByVariant(variant);
  return (
    <Image
      src={slide.src}
      alt={alt}
      width={498}
      height={523}
      priority={priority}
      quality={90}
      sizes={sizes}
      className={className}
      style={{ width: '100%', maxWidth: width, height: 'auto', objectFit: 'contain' }}
    />
  );
}
