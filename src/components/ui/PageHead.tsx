import type { ReactNode } from 'react';
import Link from 'next/link';
import { Reveal, SplitLines } from '@/components/motion';
import { cn } from '@/lib/utils';

/**
 * BREADCRUMB (§5, §14)
 * ----------------------------------------------------------------
 * `Bosh sahifa / Katalog / …` — 15px, muted, oxirgi element ink.
 * `<nav aria-label>` ichida, `BreadcrumbList` JSON-LD bilan birga.
 */

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <nav aria-label={label} className="flex flex-wrap gap-2.5 text-[15px] text-muted">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${c.label}-${i}`} className="flex items-center gap-2.5">
            {i > 0 ? <span aria-hidden>/</span> : null}
            {c.href && !last ? (
              <Link href={c.href} className="text-muted no-underline hover:text-ink">
                {c.label}
              </Link>
            ) : (
              <span className="text-ink" aria-current={last ? 'page' : undefined}>
                {c.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

/**
 * PAGE HEAD — sahifa boshi (§5)
 * ----------------------------------------------------------------
 * Panel fon (radius 40) · breadcrumb · H1 (SplitLines) ·
 * ixtiyoriy "hisob" ustbelgisi (0.24em, copper-dark) · matn · tugmalar
 */

export function PageHead({
  title,
  count,
  text,
  crumbs,
  crumbLabel,
  actions,
  className,
  /** panel — kulcha fon (radius 40); plain — fonsiz */
  variant = 'panel',
  /** o'ng ustun (masalan Samples: 01/02/03 qadamlar kapsulasi) */
  aside,
  children,
}: {
  title: string;
  /** H1 yonidagi kichik raqam (masalan katalog: 617) */
  count?: number | string;
  text?: ReactNode;
  crumbs?: Crumb[];
  crumbLabel?: string;
  actions?: ReactNode;
  className?: string;
  variant?: 'panel' | 'plain';
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className={cn('container-page flex flex-wrap gap-3 pt-2', className)}>
      <Reveal
        className={cn(
          'flex min-w-0 flex-wrap items-end justify-between gap-8',
          aside ? 'flex-[1.6_1_560px]' : 'w-full',
          variant === 'panel' &&
            'rounded-block bg-panel p-[clamp(28px,4vw,56px)] min-h-[clamp(252px,29.2vw,420px)] flex-col justify-between',
        )}
      >
        <div className="flex max-w-[760px] flex-col gap-6">
          {crumbs?.length ? <Breadcrumbs items={crumbs} label={crumbLabel ?? 'Breadcrumb'} /> : null}

          <h1 className="m-0 flex items-start gap-3 text-page-title font-normal">
            <SplitLines text={title} trigger="mount" className="block" />
            {typeof count !== 'undefined' ? (
              <span
                className="pt-[0.5em] text-[0.24em] font-medium tracking-normal text-copper-dark"
                aria-hidden
              >
                {count}
              </span>
            ) : null}
          </h1>

          {text ? (
            <Reveal as="p" delay={0.1} className="m-0 max-w-[560px] text-body-l text-body">
              {text}
            </Reveal>
          ) : null}

          {children}
        </div>

        {actions && aside ? (
          <Reveal delay={0.14} className="flex flex-wrap gap-3">
            {actions}
          </Reveal>
        ) : null}

        {actions && !aside ? (
          <Reveal delay={0.14} className="flex flex-wrap gap-3">
            {actions}
          </Reveal>
        ) : null}
      </Reveal>

      {aside ? (
        <Reveal delay={0.1} sx={24} className="flex min-w-0 flex-[1_1_360px] flex-col gap-3">
          {aside}
        </Reveal>
      ) : null}
    </section>
  );
}
