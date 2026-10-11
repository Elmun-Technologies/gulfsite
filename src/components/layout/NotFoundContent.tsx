/**
 * 404 TAQDIMOT QISMI (§5, design/NotFound.dc.html)
 * ----------------------------------------------------------------
 * Ikkala joyda ham ishlatiladi:
 *   · `app/[locale]/not-found.tsx` — layout ichida (til aniqlanadi)
 *   · `app/not-found.tsx`          — layout TASHQARISIDA (ildiz 404):
 *     Next.js `[locale]` ostiga tushmagan URL uchun shu faylni chaqiradi,
 *     shuning uchun bu yerda to'liq <html>/<body> ham beriladi.
 *
 * 'use client' EMAS — server va klient komponentlarida bir xil ishlaydi.
 */

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { AppLocale } from '@/i18n';
import { MONOGRAM_SRC } from '@/lib/design-client';
import { NotFoundSearch } from '@/components/layout/NotFoundSearch';

export interface NotFoundLabels {
  code: string;
  title: string;
  text: string;
  searchTitle: string;
  searchPh: string;
  searchCta: string;
  home: string;
  catalog: string;
  contact: string;
  monogramAlt: string;
  /** slogan barcha tillarda inglizcha qoladi (§10.4) */
  slogan: string;
}

export function NotFoundContent({
  locale,
  labels,
}: {
  locale: AppLocale;
  labels: NotFoundLabels;
}) {
  const links = [
    { href: `/${locale}`, label: labels.home },
    { href: `/${locale}/catalog`, label: labels.catalog },
    { href: `/${locale}/contact`, label: labels.contact },
  ];

  return (
    <section className="container-page flex flex-wrap gap-3 pt-2">
      {/* ---- chap: monogramma + 404 ---- */}
      <div
        data-surface="navy"
        className="media-frame relative flex min-h-[clamp(360px,42vw,600px)] min-w-0 flex-1 basis-[400px] items-center justify-center overflow-hidden rounded-block bg-navy px-10 py-16"
      >
        <span
          aria-hidden
          className="absolute left-8 top-4 font-display text-[clamp(64px,9vw,140px)] font-light leading-none tracking-[-0.05em] text-[#2A2850]"
        >
          {labels.code}
        </span>

        {/* eslint-disable-next-line @next/next/no-img-element -- statik PNG, next/image'siz (ildiz 404'da config yo'q) */}
        <img
          src={MONOGRAM_SRC.delight}
          alt={labels.monogramAlt}
          width={498}
          height={523}
          className="relative w-full max-w-[min(64%,320px)] object-contain"
          loading="lazy"
        />

        <span className="absolute bottom-9 right-8 text-[clamp(18px,1.7vw,24px)] font-normal italic text-copper-light">
          {labels.slogan}
        </span>
      </div>

      {/* ---- o'ng: matn + qidiruv + havolalar ---- */}
      <div className="flex min-w-0 flex-[1.2_1_480px] flex-col justify-center gap-7 rounded-block bg-panel p-[clamp(28px,4vw,56px)]">
        <h1 className="m-0 whitespace-pre-line text-[clamp(34px,5vw,80px)] font-normal leading-[0.95] tracking-[-0.035em]">
          {labels.title}
        </h1>

        <p className="m-0 max-w-[520px] text-body-l leading-relaxed text-body">{labels.text}</p>

        <NotFoundSearch
          locale={locale}
          labels={{
            title: labels.searchTitle,
            placeholder: labels.searchPh,
            cta: labels.searchCta,
          }}
        />

        <div className="flex flex-wrap gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-pill border border-line bg-white px-5 py-3 text-[15px] font-medium text-ink no-underline transition-colors hover:border-ink"
            >
              <span className="flex items-center gap-2">
                {l.label}
                <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Lug'atdan 404 yorliqlarini yig'ish (server va klient uchun umumiy) */
export function notFoundLabels(t: (key: never) => string): NotFoundLabels {
  return {
    code: t('nf.code' as never),
    title: t('nf.title' as never),
    text: t('nf.text' as never),
    searchTitle: t('nf.searchTitle' as never),
    searchPh: t('search.inputPh' as never),
    searchCta: t('nf.searchCta' as never),
    home: t('nf.home' as never),
    catalog: t('nf.catalog' as never),
    contact: t('nf.contact' as never),
    monogramAlt: t('nf.monogramAlt' as never),
    slogan: t('slogan.delight' as never),
  };
}
