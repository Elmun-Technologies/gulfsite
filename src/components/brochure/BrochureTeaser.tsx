/**
 * ELEKTRON KATALOG TIZERI (server) — bosh sahifa va kompaniya sahifasi
 * ----------------------------------------------------------------
 * Chapda "kitob": muqova + orqasida ochiq yoyilma (soya o'rniga siljish
 * va chegara — §17). O'ngda sarlavha, matn, 5 000+ pozitsiya va ikki
 * tugma: flipbook'ni ochish / PDF yuklab olish.
 */

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Download } from 'lucide-react';
import type { AppLocale, Translator } from '@/i18n';
import { getBrochure } from '@/lib/brochure';
import { Reveal } from '@/components/motion';
import { Section } from '@/components/ui/SectionHeader';
import { BrochureDownload } from './BrochureDownload';

export function BrochureTeaser({ locale, t }: { locale: AppLocale; t: Translator }) {
  const { brochure } = getBrochure(locale);
  const cover = brochure.pages[0];
  const spread = brochure.pages.find((p) => p.spread);
  if (!cover) return null;
  const sizeMb = (brochure.pdfSizeKb / 1024).toFixed(1);

  return (
    <Section id="katalog">
      <Reveal className="flex flex-wrap items-center gap-[clamp(28px,4vw,64px)] overflow-hidden rounded-block bg-panel p-[clamp(24px,4vw,56px)]">
        {/* ---- kitob ---- */}
        <Link
          href={`/${locale}/brochure`}
          className="group relative mx-auto block aspect-[1.35] w-full max-w-[520px] flex-[1_1_360px]"
          aria-label={t('brochure.open')}
        >
          {spread ? (
            <span className="absolute right-0 top-[6%] block h-[82%] w-[88%] overflow-hidden rounded-media border border-line bg-white transition-transform duration-500 group-hover:translate-x-2">
              <Image src={spread.src} alt="" fill sizes="(max-width: 768px) 90vw, 460px" className="object-cover" unoptimized />
            </span>
          ) : null}
          <span className="absolute bottom-0 left-0 block h-full w-[48%] overflow-hidden rounded-media border border-navy/20 transition-transform duration-500 group-hover:-translate-y-1 group-hover:-rotate-2">
            <Image src={cover.src} alt={t('brochure.title')} fill sizes="(max-width: 768px) 45vw, 250px" className="object-cover" unoptimized />
          </span>
        </Link>

        {/* ---- matn ---- */}
        <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-5">
          <span className="label">{t('brochure.eyebrow')}</span>
          <h2 className="m-0 text-h2 font-normal">{t('brochure.ctaTitle')}</h2>
          <p className="m-0 max-w-[520px] text-body-l text-muted">{t('brochure.ctaText')}</p>
          <span className="cert-pill self-start">{t('brochure.positions')}</span>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href={`/${locale}/brochure`} className="btn btn--primary btn--lg">
              <BookOpen size={18} strokeWidth={1.8} aria-hidden />
              {t('brochure.open')}
              <ArrowRight size={18} strokeWidth={2} aria-hidden />
            </Link>
            <BrochureDownload href={brochure.pdf} lang={brochure.lang} source="teaser" className="btn btn--outline btn--lg">
              <Download size={18} strokeWidth={1.8} aria-hidden />
              {t('brochure.download', { size: sizeMb })}
            </BrochureDownload>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
