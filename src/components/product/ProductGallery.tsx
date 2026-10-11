'use client';

/**
 * PRODUCT GALLERY (§5, design/Product.dc.html · GALLERY)
 * ----------------------------------------------------------------
 * Katta rasm (radius 40) + qadoq rasmlari (1/5/10 kg, radius 24).
 * Thumb bosilganda asosiy rasm 500ms crossfade bilan almashadi.
 *
 * Har mahsulotga alohida foto YO'Q (§15): kategoriya/guruh fotosi
 * ishlatiladi, qadoq fotolari esa mijozning haqiqiy suratlari.
 */

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { dur, ease } from '@/lib/motion';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export interface GallerySlide {
  src: string;
  alt: string;
  /** pastki-chapdagi izoh (masalan "1 kg flakon") */
  caption?: string;
}

export function ProductGallery({
  main,
  slides,
  sku,
  badge,
  className,
}: {
  main: GallerySlide;
  slides: GallerySlide[];
  sku: string;
  badge?: string;
  className?: string;
}) {
  const [index, setIndex] = useState(-1);
  const active = index >= 0 ? slides[index] : main;

  return (
    <div className={cn('flex min-w-0 flex-1 basis-[520px] flex-col gap-3', className)}>
      <div className="media-frame relative min-h-[clamp(336px,38.9vw,560px)] flex-grow overflow-hidden rounded-block bg-panel">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={active.src + String(index)}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur.slow - 0.1, ease: ease.out }}
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              priority={index < 0}
              sizes="(max-width: 900px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {badge && index < 0 ? (
          <span className="absolute left-5 top-5 rounded-pill bg-white px-4 py-[9px] text-[14px] font-medium">
            {badge}
          </span>
        ) : null}
      </div>

      {slides.length ? (
        <div className="grid grid-cols-3 gap-3">
          {slides.map((s, i) => (
            <button
              key={s.src + i}
              type="button"
              onClick={() => {
                setIndex(i);
                track.productGallery(sku, i);
              }}
              aria-label={s.caption ?? s.alt}
              aria-pressed={index === i}
              className={cn(
                'media-frame group relative block aspect-4/3 overflow-hidden rounded-tile transition-opacity',
                index === i ? 'opacity-100' : 'opacity-80 hover:opacity-100',
              )}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="(max-width: 900px) 33vw, 17vw"
                className="media-zoom object-cover"
              />
              {s.caption ? (
                <span className="absolute bottom-2.5 left-2.5 rounded-pill bg-white px-3 py-1.5 text-[13px] font-semibold">
                  {s.caption}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
