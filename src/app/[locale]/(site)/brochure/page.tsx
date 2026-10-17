/**
 * ELEKTRON KATALOG (flipbook) — /[locale]/brochure
 * ----------------------------------------------------------------
 * Mijozning dizaynerlik katalogi (PDF) varaqlanadigan ko'rinishda +
 * PDF yuklab olish. Til versiyasi bo'lmasa — o'zbekcha (eslatma bilan).
 * Pastda konversiya: bepul namuna va narx so'rovi.
 */

import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { buildMetadata, breadcrumbLd } from '@/lib/seo';
import { BROCHURE_TOC, getBrochure } from '@/lib/brochure';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/PageHead';
import { Section } from '@/components/ui/SectionHeader';
import { ButtonLink } from '@/components/ui/Button';
import { Flipbook } from '@/components/brochure/Flipbook';
import { ensureCatalog } from '@/lib/catalog-live';

interface Props {
  params: Promise<{ locale: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  await ensureCatalog();
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await ensureCatalog();
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  const { brochure } = getBrochure(locale);
  return buildMetadata({
    locale,
    title: t('seo.brochure.title'),
    description: t('seo.brochure.description'),
    path: '/brochure',
    image: brochure.pages[0]?.src,
  });
}

export default async function BrochurePage({ params }: Props) {
  await ensureCatalog();
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const t = makeT(locale);
  const { brochure, fallback } = getBrochure(locale);
  const sizeMb = (brochure.pdfSizeKb / 1024).toFixed(1);

  return (
    <>
      <JsonLdGroup
        items={[
          breadcrumbLd(
            [
              { name: t('nav.home'), path: '/' },
              { name: t('nav.brochure'), path: '/brochure' },
            ],
            locale,
          ),
        ]}
      />

      {/* Ixcham sarlavha — kitob birinchi ekranda ko'rinsin (PageHead juda baland) */}
      <Section gap={false} className="flex flex-col gap-4 pt-4">
        <Breadcrumbs items={[{ label: t('nav.home'), href: `/${locale}` }, { label: t('nav.brochure') }]} label={t('nav.brochure')} />
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div className="flex min-w-0 max-w-[760px] flex-col gap-2">
            <h1 className="m-0 text-h2 font-normal">{t('nav.brochure')}</h1>
            <p className="m-0 text-[16px] leading-[1.55] text-muted">{t('brochure.lead')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="cert-pill">{t('brochure.positions')}</span>
            {fallback ? <span className="text-[14px] text-muted">{t('brochure.fallbackNote')}</span> : null}
          </div>
        </div>
      </Section>

      <Section gap={false} className="pt-3">
        <Flipbook
          pages={brochure.pages}
          pdf={brochure.pdf}
          lang={brochure.lang}
          toc={BROCHURE_TOC.filter((x) => x.sheet < brochure.pages.length).map((x) => ({
            sheet: x.sheet,
            label: t(`brochure.toc.${x.key}` as never),
          }))}
          labels={{
            prev: t('brochure.prev'),
            next: t('brochure.next'),
            zoom: t('brochure.zoom'),
            zoomOut: t('brochure.zoomOut'),
            fullscreen: t('brochure.fullscreen'),
            exitFullscreen: t('brochure.exitFullscreen'),
            pageOfTpl: t.raw('brochure.pageOf'),
            pageAltTpl: t.raw('brochure.pageAlt'),
            thumbs: t('brochure.thumbs'),
            toc: t('brochure.toc'),
            hint: t('brochure.hint'),
            download: t('brochure.download', { size: sizeMb }),
          }}
        />
      </Section>

      <Section>
        <div
          data-surface="navy"
          className="flex flex-wrap items-center justify-between gap-6 rounded-block bg-navy p-[clamp(28px,4vw,56px)] text-white"
        >
          <span className="max-w-[560px] text-[clamp(26px,3vw,40px)] font-normal leading-[1.1] tracking-[-0.02em]">
            {t('brochure.ctaText')}
          </span>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={`/${locale}/samples`} variant="accent" size="lg">
              {t('brochure.sampleCta')}
              <ArrowRight size={18} strokeWidth={2} aria-hidden />
            </ButtonLink>
            <ButtonLink href={`/${locale}/catalog`} variant="onNavy" size="lg">
              {t('nav.catalog')}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
