import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import { Reveal, SplitLines } from '@/components/motion';
import { cn } from '@/lib/utils';

/**
 * SECTION / SECTION HEADER (§4.3, §5, §8.3)
 * ----------------------------------------------------------------
 * Bo'lim sarlavhasi patterni:
 *   yuqori va pastki 1px --line chiziq · chapda H2 · o'ngda "0N." raqam
 *
 * Animatsiya (§8.3):
 *   yuqori chiziq  scaleX 0 → 1 chapdan (700ms)
 *   H2             SplitLines
 *   "0N." raqam    y: 40% → 0 + opacity (100ms delay)
 */

export function Section({
  children,
  id,
  className,
  gap = true,
  bleed = false,
  style,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  /** clamp(80px, 9vw, 128px) yuqori oraliq */
  gap?: boolean;
  /** konteynersiz (fon butun eniga) */
  bleed?: boolean;
  style?: CSSProperties;
}) {
  return (
    <section
      id={id}
      style={style}
      className={cn(
        bleed ? 'w-full' : 'container-page',
        gap && 'pt-[clamp(80px,9vw,128px)]',
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Bo'lim ichidagi yon chekinish (dizayn: `padding: 0 clamp(0px, 3vw, 48px)`) */
export function SectionInset({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-[clamp(0px,3vw,48px)]', className)}>{children}</div>;
}

export interface SectionHeaderProps {
  title: string;
  /** "02" → "02." ko'rinishida chiqadi */
  num?: string;
  /** o'ngda 2 ta doira rasm */
  images?: { src: string; alt: string }[];
  /** chiziqlar: 'both' (default) · 'top' · 'none' */
  rules?: 'both' | 'top' | 'none';
  /** raqam o'rniga/o'ngiga qo'shimcha tugma yoki matn */
  aside?: ReactNode;
  className?: string;
  id?: string;
  titleAs?: 'h2' | 'h3';
}

export function SectionHeader({
  title,
  num,
  images,
  rules = 'both',
  aside,
  className,
  id,
  titleAs = 'h2',
}: SectionHeaderProps) {
  const rule = (position: 'top' | 'bottom') =>
    rules === 'none' || (rules === 'top' && position === 'bottom') ? null : (
      <Reveal
        aria-hidden
        y={0}
        sx={0}
        origin="left"
        delay={position === 'top' ? 0 : 0.1}
        className="h-px w-full shrink-0 bg-line"
      />
    );

  return (
    <div id={id} className={cn('flex flex-col', className)}>
      {rule('top')}

      <div className="flex flex-wrap items-center justify-between gap-5 py-7">
        <SplitLines
          as={titleAs}
          text={title}
          className="m-0 text-h2 font-normal"
        />

        <div className="flex items-center gap-5">
          {num ? (
            <Reveal
              y="40%"
              delay={0.1}
              className="text-section-num font-light leading-none"
              aria-hidden
            >
              {num}.
            </Reveal>
          ) : null}

          {images?.length ? (
            <div className="flex">
              {images.map((img, i) => (
                <Reveal
                  key={img.src}
                  x={12}
                  y={0}
                  delay={0.15 + i * 0.06}
                  className={cn(
                    'relative h-[76px] w-[76px] overflow-hidden rounded-pill',
                    i > 0 && '-ml-3.5 border-[3px] border-white',
                  )}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="76px"
                    className="object-cover"
                  />
                </Reveal>
              ))}
            </div>
          ) : null}

          {aside}
        </div>
      </div>

      {rule('bottom')}
    </div>
  );
}
