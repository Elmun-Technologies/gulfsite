import type { ReactNode } from 'react';
import Link from 'next/link';
import { Reveal } from '@/components/motion';
import { cn } from '@/lib/utils';

/**
 * FAQ — AKKORDEON (§5, design/Samples.dc.html · FAQ · §13.4, §14)
 * ----------------------------------------------------------------
 * Tabiiy `<details>/<summary>`: JavaScript'siz ishlaydi, skriner to'g'ri
 * o'qiydi, qidiruv tizimlari matnni ko'radi (FAQPage JSON-LD bilan birga).
 *
 * "+" belgisi ochilganda 45° aylanadi (faqat transform, §8.1).
 * Balandlik animatsiyasi §8.1 istisnosi — bu yerda umuman yo'q:
 * `content-visibility` emas, oddiy ochilish (LCP/CLS'ga ta'sir qilmaydi).
 */

export interface FaqItem {
  q: string;
  a: string;
}

export function Faq({
  title,
  items,
  moreLabel,
  moreHref,
  className,
  /** birinchi element ochiq chiqsin (dizayndagi holat) */
  firstOpen = true,
}: {
  title: string;
  items: FaqItem[];
  moreLabel: string;
  moreHref: string;
  className?: string;
  firstOpen?: boolean;
}) {
  return (
    <div className={cn('flex flex-wrap gap-8 md:gap-12', className)}>
      <div className="flex flex-1 basis-[300px] flex-col gap-6 md:px-[clamp(0px,3vw,48px)]">
        <Reveal>
          <h2 className="m-0 text-[clamp(32px,4.6vw,72px)] font-normal leading-none tracking-[-0.03em]">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <Link href={moreHref} className="btn btn--outline btn--lg self-start">
            {moreLabel}
          </Link>
        </Reveal>
      </div>

      <div className="min-w-0 flex-[1.6_1_560px] border-t border-line">
        {items.map((it, i) => (
          <details key={it.q} open={firstOpen && i === 0} className="faq-item border-b border-line px-2 py-[26px]">
            <summary className="flex items-center justify-between gap-4 text-[clamp(17px,1.5vw,21px)] font-medium">
              {it.q}
              <span className="faq-plus shrink-0 text-[26px] font-light leading-none" aria-hidden>
                +
              </span>
            </summary>
            <p className="m-0 mt-3.5 max-w-[640px] text-body-l leading-relaxed text-body">{it.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

/** FAQ + CTA paneli — "Boshqa savol bormi?" blokchasi (ixtiyoriy) */
export function FaqAside({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-4', className)}>{children}</div>;
}
