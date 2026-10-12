/**
 * KOMPANIYA (§5, design/About.dc.html)
 * ----------------------------------------------------------------
 * HERO  — panel (breadcrumb · 3 qatorli H1 · matn · "2002-yildan beri")
 *         + navy monogramma paneli ("Jebel Ali Free Zone, Dubay" pill'i,
 *         "A sense of Joy" slogan) + 2 ta stat kapsulasi
 * 01    — Bizning tarix: foto + 3 paragraf + 3 ta stat (MA'LUMOTDAN)
 * 02    — Sifat va sertifikatlar: matn + 6 ta sertifikat plitkasi
 * 03    — O'zbekistondagi ofis: manzil + sertifikat holati + 4 afzallik
 * CTA   — 3 ta katta plitka: foto · "HAMKORLIK / NAMUNADAN" · "boshlanadi."
 *
 * Barcha sonlar (yil, xomashyo, pozitsiyalar, namuna limiti, kunlar)
 * `siteConfig` va katalog ma'lumotidan hisoblanadi (§7.1).
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { aboutLd, buildMetadata, breadcrumbLd, organizationLd } from '@/lib/seo';
import { productCount } from '@/lib/catalog';
import { monogramCopy, publicAssetExists } from '@/lib/design';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/PageHead';
import { Section, SectionHeader } from '@/components/ui/SectionHeader';
import { ButtonLink } from '@/components/ui/Button';
import { MonogramStatic, Reveal, SplitLines } from '@/components/motion';
import { cn } from '@/lib/utils';

interface Props {
  params: Promise<{ locale: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);

  return buildMetadata({
    locale,
    title: t('seo.about.title'),
    description: t('seo.about.description', { count: productCount() }),
    path: '/about',
    image: '/images/warehouse.jpg',
  });
}

const CERTS: { code: string; key: 'halal' | 'iso' | 'haccp' | 'sgs' | 'racs' | 'trakhees' }[] = [
  { code: 'HALAL', key: 'halal' },
  { code: 'ISO 22000', key: 'iso' },
  { code: 'HACCP', key: 'haccp' },
  { code: 'SGS', key: 'sgs' },
  { code: 'RACS', key: 'racs' },
  { code: 'TRAKHEES', key: 'trakhees' },
];

export default async function AboutPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const t = makeT(locale);

  const biz = siteConfig.business;
  const positions = productCount();
  const years = siteConfig.stats.yearsExperience;
  const rawMaterials = siteConfig.stats.rawMaterials;
  // Manzil matni tilga bog'liq (§10) — config'da 3 tilda saqlanadi
  const address =
    locale === 'ru' ? siteConfig.contact.addressRu : locale === 'en' ? siteConfig.contact.addressEn : siteConfig.contact.address;
  const certPending = !siteConfig.catalogPdf || !publicAssetExists(siteConfig.catalogPdf);

  const advantages = [
    { title: t('about.adv1Title'), text: t('about.adv1Text', { count: positions }) },
    { title: t('about.adv2Title'), text: t('about.adv2Text') },
    { title: t('about.adv3Title'), text: t('about.adv3Text') },
    {
      title: t('about.adv4Title'),
      text: t('about.adv4Text', { max: biz.sampleBoxMaxItems, days: biz.sampleDeliveryDays }),
    },
  ];

  return (
    <>
      <JsonLdGroup
        items={[
          organizationLd(locale),
          aboutLd(locale),
          breadcrumbLd(
            [
              { name: t('nav.home'), path: '/' },
              { name: t('nav.about'), path: '/about' },
            ],
            locale,
          ),
        ]}
      />

      {/* ============ HERO ============ */}
      <Section gap={false} className="flex flex-wrap gap-3 pt-2">
        <Reveal className="flex min-w-0 flex-[1.3_1_560px] flex-col justify-between gap-12 rounded-block bg-panel p-[clamp(28px,4vw,56px)] min-h-[clamp(372px,43.1vw,620px)]">
          <Breadcrumbs
            label={t('nav.about')}
            items={[{ label: t('nav.home'), href: `/${locale}` }, { label: t('nav.about') }]}
          />

          <h1 className="m-0 text-[clamp(42px,7vw,120px)] font-normal leading-[0.92] tracking-[-0.04em]">
            <SplitLines text={t('about.heroTitle')} trigger="mount" />
          </h1>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <p className="m-0 max-w-[520px] text-body-l text-body">{t('about.heroText')}</p>
            <span className="text-[14px] text-muted">{t('about.heroSince')}</span>
          </div>
        </Reveal>

        <Reveal delay={0.08} y={24} className="flex min-w-0 flex-1 basis-[400px] flex-col gap-3">
          <div
            data-surface="navy"
            className="media-frame relative flex min-h-[clamp(372px,43.1vw,620px)] flex-1 items-center justify-center overflow-hidden rounded-block bg-navy px-10 py-16"
          >
            <MonogramStatic
              variant="joy"
              alt={monogramCopy(t).alt.joy}
              width={320}
              sizes="(max-width: 900px) 60vw, 320px"
              className="w-full max-w-[min(64%,320px)]"
              priority
            />
            <span className="absolute left-8 top-8 rounded-pill border border-[#4A4878] px-4 py-[9px] text-[14px] text-white">
              {t('about.heroHq')}
            </span>
            <span className="absolute bottom-9 right-8 text-[clamp(18px,1.7vw,24px)] font-normal italic text-copper-light">
              {monogramCopy(t).slogan.joy}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Reveal delay={0.14} className="flex min-w-0 flex-1 basis-[220px] flex-col gap-1 rounded-card bg-panel px-7 py-6">
              <span className="text-[clamp(30px,3vw,44px)] font-semibold leading-none">{years}+</span>
              <span className="text-[15px] leading-snug text-muted">{t('about.heroYearsLabel')}</span>
            </Reveal>
            <Reveal delay={0.2} y={16} className="flex min-w-0 flex-1 basis-[220px] flex-col gap-1 rounded-card bg-navy px-7 py-6 text-white">
              <span className="text-[clamp(30px,3vw,44px)] font-semibold leading-none">{positions}</span>
              <span className="text-[15px] leading-snug text-on-navy">
                {t('about.heroStock', { count: positions })}
              </span>
            </Reveal>
          </div>
        </Reveal>
      </Section>

      {/* ============ 01 · TARIX ============ */}
      <Section>
        <SectionHeader title={t('about.storyTitle')} num="01" />

        <div className="flex flex-wrap gap-3 pt-[clamp(24px,3.1vw,40px)]">
          <Reveal className="media-frame relative min-h-[clamp(280px,32vw,460px)] min-w-0 flex-1 basis-[420px] overflow-hidden rounded-block">
            <Image
              src={publicAssetExists('/images/warehouse.jpg') ? '/images/warehouse.jpg' : '/images/factory.jpg'}
              alt={t('about.storyAlt')}
              fill
              sizes="(max-width: 900px) 100vw, 46vw"
              className="media-zoom object-cover"
            />
          </Reveal>

          <div className="flex min-w-0 flex-[1.2_1_480px] flex-col gap-6">
            {[
              t('about.story1', { year: siteConfig.brand.since }),
              t('about.story2'),
              t('about.story3'),
            ].map((p, i) => (
              <Reveal key={p.slice(0, 24)} delay={i * 0.06} y={16}>
                <p className="m-0 text-body-l leading-relaxed text-body">{p}</p>
              </Reveal>
            ))}

            <div className="mt-2 grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(min(150px,100%),1fr))]">
              <Stat label={t('about.statFounded')} value={String(siteConfig.brand.since)} />
              <Stat label={t('about.statRaw')} value={`${rawMaterials}+`} />
              <Stat label={t('about.statPositions')} value={String(positions)} />
            </div>
          </div>
        </div>
      </Section>

      {/* ============ 02 · SIFAT VA SERTIFIKATLAR ============ */}
      <Section>
        <SectionHeader title={t('about.qualityTitle')} num="02" />

        <div className="flex flex-wrap gap-3 pt-[clamp(24px,3.1vw,40px)]">
          <Reveal className="min-w-0 flex-1 basis-[360px]">
            <p className="m-0 max-w-[520px] text-body-l leading-relaxed text-body">
              {t('about.qualityText')}
            </p>
          </Reveal>

          <div className="grid min-w-0 flex-[1.4_1_520px] gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr))]">
            {CERTS.map((c, i) => (
              <Reveal
                key={c.code}
                y={16}
                delay={Math.min(i, 7) * 0.06}
                className="flex flex-col gap-2 rounded-card bg-panel px-6 py-5"
              >
                <span className="flex items-center gap-2 text-[17px] font-semibold tracking-[0.02em]">
                  <ShieldCheck size={18} strokeWidth={1.8} aria-hidden />
                  {c.code}
                </span>
                <span className="text-[14px] leading-snug text-muted">
                  {t(`about.cert.${c.key}` as never)}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ============ 03 · O'ZBEKISTONDAGI OFIS ============ */}
      <Section>
        <Reveal
          data-surface="navy"
          className="flex flex-col gap-8 rounded-block bg-navy p-[clamp(28px,4vw,56px)] text-white"
        >
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex max-w-[620px] flex-col gap-4">
              <span className="label text-copper-light">
                03 · {t('about.officeEyebrow')}
              </span>
              <h2 className="m-0 text-h2 text-white">{t('about.officeTitle')}</h2>
              <p className="m-0 text-body-l text-on-navy">{t('about.officeText', { address })}</p>
            </div>

            <div className="flex flex-col gap-2 rounded-card border border-[#4A4878] px-6 py-5">
              <span className="flex items-center gap-2 text-[15px] font-medium">
                <ShieldCheck size={18} strokeWidth={1.8} aria-hidden />
                {t('about.officeCert')}
              </span>
              {certPending ? (
                <span className="text-[14px] text-on-navy">{t('about.officeCertPending')}</span>
              ) : (
                <a
                  href={siteConfig.catalogPdf}
                  className="text-[14px] text-copper-light underline underline-offset-4"
                >
                  PDF
                </a>
              )}
            </div>
          </div>

          <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))]">
            {advantages.map((a, i) => (
              <Reveal
                key={a.title}
                y={16}
                delay={Math.min(i, 7) * 0.06}
                className="flex flex-col gap-2 rounded-card bg-slate px-6 py-5"
              >
                <span className="text-[18px] font-medium">{a.title}</span>
                <span className="text-[15px] leading-snug text-on-navy">{a.text}</span>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ============ CTA — 3 ta plitka ============ */}
      <Section gap={false} className="flex flex-wrap gap-3 pb-4 pt-[clamp(80px,9vw,128px)]">
        <Reveal className="media-frame relative min-h-[360px] min-w-0 flex-1 basis-[300px] overflow-hidden rounded-block">
          <Image
            src={publicAssetExists('/images/spices.jpg') ? '/images/spices.jpg' : '/images/warehouse.jpg'}
            alt={t('about.ctaPhotoAlt')}
            fill
            sizes="(max-width: 900px) 100vw, 31vw"
            className="media-zoom object-cover"
          />
        </Reveal>

        <Reveal
          delay={0.06}
          y={20}
          className="flex min-h-[360px] min-w-0 flex-1 basis-[300px] flex-col justify-between rounded-block bg-ink p-10 text-white"
        >
          <span className="text-[clamp(32px,4vw,60px)] font-normal leading-none tracking-[-0.03em]">
            {t('about.ctaLeft')}
          </span>
          <span className="self-end text-right text-[clamp(32px,4vw,60px)] font-normal leading-none tracking-[-0.03em]">
            {t('about.ctaMid')}
          </span>
        </Reveal>

        <Reveal
          delay={0.12}
          y={20}
          className="flex min-h-[360px] min-w-0 flex-1 basis-[300px] flex-col justify-between gap-6 rounded-block bg-copper p-10"
        >
          <span className="text-[clamp(36px,3.4vw,52px)] font-normal leading-none tracking-[-0.03em]">
            {t('about.ctaEnd')}
          </span>
          <span className="flex flex-col gap-2.5">
            <Link href={`/${locale}/samples`} className={cn('btn btn--primary btn--lg justify-between')}>
              {t('about.ctaSample')}
              <ArrowUpRight size={18} aria-hidden />
            </Link>
            <ButtonLink href={`/${locale}/contact`} variant="outline" size="lg" className="justify-between">
              {t('about.ctaContact')}
              <ArrowUpRight size={18} aria-hidden />
            </ButtonLink>
          </span>
        </Reveal>
      </Section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-card bg-white px-6 py-5">
      <span className="text-[13px] italic text-muted">{label}</span>
      <span className="text-[clamp(26px,2.4vw,34px)] font-semibold leading-none">{value}</span>
    </div>
  );
}
