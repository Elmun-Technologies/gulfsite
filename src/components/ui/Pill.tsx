import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * PILL · TAG · CERT · STOCK (§4.1, §5)
 * ----------------------------------------------------------------
 * Kontur/fon variantlari. Kategoriya ranglari YO'Q (§17) — barcha
 * pill'lar bir xil palitrada.
 */

export type PillTone = 'outline' | 'white' | 'soft' | 'navy' | 'accent';

const TONE: Record<PillTone, string> = {
  outline: 'pill',
  white: 'pill pill--white',
  soft: 'pill pill--soft',
  navy: 'pill pill--navy',
  accent: 'pill pill--accent',
};

export function Pill({
  tone = 'outline',
  small = false,
  className,
  children,
  ...rest
}: { tone?: PillTone; small?: boolean; className?: string; children: ReactNode } & ComponentPropsWithoutRef<'span'>) {
  return (
    <span className={cn(TONE[tone], small && 'pill--sm', className)} {...rest}>
      {children}
    </span>
  );
}

/** "354 pozitsiya" — kategoriya kartochkasidagi hisob pill'i */
export function CountPill({ count, label, className }: { count: number; label: string; className?: string }) {
  return (
    <Pill className={className}>
      {count} {label}
    </Pill>
  );
}

/** Mahsulot xususiyati: Halal, GMO-free, Spirtsiz... (✓ bilan) */
export function Tag({
  children,
  check = true,
  className,
}: {
  children: ReactNode;
  check?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-pill border border-line px-[14px] py-2 text-[14px] leading-none text-ink',
        className,
      )}
    >
      {check ? <Check size={14} strokeWidth={2.4} aria-hidden /> : null}
      {children}
    </span>
  );
}

/** Sertifikat pill'i (footer, hero) — Halal, ISO 22000, HACCP, SGS... */
export function CertPill({ label, className }: { label: string; className?: string }) {
  return <span className={cn('cert-pill', className)}>{label}</span>;
}

/** Sertifikatlar to'ri (bosh sahifa 01-bo'limi) */
export function CertGrid({ items, className }: { items: string[]; className?: string }) {
  return (
    <div
      className={cn(
        // Mobil: 2 ustun (minmax 130) — 1 ustunda 6×104px bo'sh joy egallardi
        'grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] border-t border-l border-line-soft',
        className,
      )}
    >
      {items.map((c) => (
        <div
          key={c}
          className="flex h-[104px] items-center justify-center border-r border-b border-line-soft text-[22px] font-semibold tracking-[0.02em] max-tab:h-[72px] max-tab:text-[17px]"
        >
          {c}
        </div>
      ))}
    </div>
  );
}

/**
 * "Omborda" / "Buyurtma bilan" nuqtasi.
 * Yashil (--ok) FAQAT shu elementda ishlatiladi (§4.1).
 */
export function StockDot({
  state,
  label,
  className,
}: {
  state: 'in-stock' | 'on-order' | 'new';
  label: string;
  className?: string;
}) {
  return (
    <span className={cn('stock-dot', className)} data-state={state}>
      {label}
    </span>
  );
}

/** Havolali pill (katalog teglari, soha pill'lari) */
export function PillLink({
  href,
  children,
  tone = 'outline',
  className,
  ...rest
}: { href: string; children: ReactNode; tone?: PillTone; className?: string } & ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link href={href} className={cn(TONE[tone], className)} {...rest}>
      {children}
    </Link>
  );
}
