/**
 * BOSH SAHIFA
 * ----------------------------------------------------------------
 * Vazifasi: 5 soniyada uchta savolga javob berish —
 *   1. Bu kim? (GFF rasmiy distribyutori)
 *   2. Nima taklif qiladi? (600+ aromatizator/ingredient + bepul test box)
 *   3. Nima qilishim kerak? (namuna so'rash / narx so'rash / qo'ng'iroq)
 *
 * Har bir bo'lim CTA ga olib boradi. Sahifa to'liq statik (SSG) —
 * shuning uchun juda tez ochiladi va yaxshi indekslanadi.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata, homeLd, faqLd } from '@/lib/seo';
import { productCount } from '@/lib/catalog';
import { CATEGORIES, tr, type Locale } from '@/lib/taxonomy';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Display';
import { LeadForm } from '@/components/lead/LeadForm';
import {
  CategoriesSection,
  CategoryMarquee,
  CertsSection,
  FaqSection,
  FinalCta,
  IndustriesSection,
  PopularProductsSection,
  ProcessSection,
  TestBoxSection,
  WhySection,
} from '@/components/home/sections';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const base = buildMetadata({
    locale,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    path: '',
  });
  return {
    ...base,
    title: {
      default: siteConfig.seo.defaultTitle,
      template: '%s — GFF Uzbekistan',
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw) as AppLocale;
  const L = locale as Locale;
  const t = makeT(locale);

  const products = productCount();

  const trustBadges: { icon: IconName; label: string }[] = [
    { icon: 'badge', label: t('hero.badge1') },
    { icon: 'halal', label: t('hero.badge2') },
    { icon: 'box', label: t('hero.badge3') },
    { icon: 'truck', label: t('hero.badge4') },
  ];

  const faqItems = [1, 2, 3, 4, 5, 6, 7].map((i) => ({
    q: t(`faq.q${i}` as never),
    a: t(`faq.a${i}` as never),
  }));

  return (
    <>
      {/* ============================================================
          HERO
          ============================================================ */}
      <section className="relative overflow-hidden bg-pine-950 text-white">
        {/* Fon rasmi */}
        <div className="absolute inset-0" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-lab.jpg"
            alt=""
            className="h-full w-full object-cover opacity-40"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pine-950 via-pine-950/92 to-pine-900/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-transparent to-transparent" />
        </div>
        <div className="pattern-uzbek pointer-events-none absolute inset-0 opacity-[0.09]" aria-hidden />
        <div className="pointer-events-none absolute -right-32 top-0 h-[30rem] w-[30rem] rounded-full bg-teal-500/18 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" aria-hidden />

        <div className="container-x relative py-12 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,24rem)] lg:items-center">
            {/* ---- Chap ---- */}
            <div>
              <span className="inline-flex flex-wrap items-center gap-2 rounded-full border border-gold-500/35 bg-gold-500/10 px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.13em] text-gold-400">
                <Icon name="badge" size={13} />
                {t('hero.eyebrow')}
              </span>

              <h1 className="mt-5 max-w-3xl font-display text-[clamp(1.9rem,5.6vw,3.5rem)] leading-[1.05] font-extrabold tracking-tight">
                {t('hero.titleA')}{' '}
                <span className="gradient-text">{t('hero.titleB')}</span>
              </h1>

              <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-white/75 sm:text-[16.5px]">
                {t('hero.subtitle')}
              </p>

              {/* Tezkor qidiruv — eng qisqa yo'l katalogga */}
              <form
                action={`/${locale}/catalog`}
                method="GET"
                role="search"
                className="mt-7 flex max-w-xl items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.07] p-1.5 backdrop-blur-sm transition focus-within:border-teal-400/60 focus-within:bg-white/[0.1]"
              >
                <Icon name="search" size={18} className="ml-2.5 shrink-0 text-white/50" />
                <input
                  type="search"
                  name="q"
                  maxLength={120}
                  aria-label={t('catalog.searchPlaceholder')}
                  placeholder={t('catalog.searchPlaceholder')}
                  className="h-11 min-w-0 flex-1 bg-transparent text-[14.5px] text-white placeholder:text-white/45 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-teal-500 px-4 text-[13.5px] font-bold text-white transition hover:bg-teal-400 sm:px-5"
                >
                  <span className="hidden sm:inline">{t('common.search')}</span>
                  <Icon name="arrow-right" size={15} />
                </button>
              </form>

              {/* Kategoriyalar bo'yicha tezkor havolalar */}
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {CATEGORIES.slice(0, 4).map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/${locale}/catalog?categories=${c.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-2.5 py-1 text-[12px] font-medium text-white/70 transition hover:border-teal-400/50 hover:bg-teal-500/15 hover:text-white"
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} aria-hidden />
                      {tr(c.name, L, c.id)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={`/${locale}/catalog`}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold text-mint-200 transition hover:text-white"
                  >
                    {t('common.all')}
                    <Icon name="arrow-right" size={12} />
                  </Link>
                </li>
              </ul>

              {/* CTA */}
              <div className="mt-7 flex flex-wrap items-center gap-2.5">
                <Link
                  href={`/${locale}/samples`}
                  className="group inline-flex h-13 items-center gap-2 rounded-xl bg-gold-500 px-6 text-[15px] font-extrabold text-pine-950 shadow-lift transition hover:bg-gold-400 active:scale-[0.98]"
                >
                  <Icon name="box" size={19} />
                  {t('hero.ctaSample')}
                  <Icon
                    name="arrow-right"
                    size={17}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href={`/${locale}/catalog`}
                  className="inline-flex h-13 items-center gap-2 rounded-xl border border-white/25 bg-white/[0.06] px-5 text-[14.5px] font-bold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/12"
                >
                  <Icon name="grid" size={18} />
                  {t('hero.ctaCatalog')}
                </Link>
                <a
                  href={siteConfig.contact.phonePrimaryHref}
                  className="inline-flex h-13 items-center gap-2 rounded-xl px-4 font-mono text-[14.5px] font-bold text-white/85 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon name="phone" size={17} className="text-mint-200" />
                  {siteConfig.contact.phonePrimary}
                </a>
              </div>

              {/* Ishonch belgilari */}
              <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
                {trustBadges.map((b) => (
                  <li key={b.label} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-white/65">
                    <Icon name={b.icon} size={15} className="text-mint-200" />
                    {b.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* ---- O'ng: raqamlar + tezkor forma ---- */}
            <div className="flex flex-col gap-3.5">
              <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-5 backdrop-blur-sm">
                <p className="text-[11.5px] font-bold uppercase tracking-[0.13em] text-mint-200/80">
                  {t('hero.trustLine')}
                </p>
                <dl className="mt-3.5 grid grid-cols-2 gap-3.5">
                  {[
                    { v: `${products}+`, k: t('stats.products') },
                    { v: `${siteConfig.stats.rawMaterials}+`, k: t('stats.rawMaterials') },
                    { v: `${siteConfig.stats.yearsExperience}+`, k: t('stats.years') },
                    { v: String(siteConfig.stats.uzRegions), k: t('stats.regions') },
                  ].map((s, i) => (
                    <div key={i}>
                      <dt className="font-display text-[1.6rem] leading-none font-extrabold tracking-tight text-white tabular-nums">
                        {s.v}
                      </dt>
                      <dd className="mt-1.5 text-[11.5px] leading-snug text-white/55">{s.k}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-2xl border border-gold-500/25 bg-gold-500/[0.07] p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Icon name="clock" size={16} className="text-gold-400" />
                  <p className="text-[13.5px] font-bold text-white">{t('cta.fast')}</p>
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-white/65">
                  {t('hero.scrollHint')}
                </p>
                <Link
                  href={`/${locale}/contact`}
                  className="mt-3.5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white/12 text-[13.5px] font-bold text-white transition hover:bg-white/20"
                >
                  <Icon name="users" size={16} />
                  {t('contact.departments')}
                </Link>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {['HALAL', 'ISO 22000', 'HACCP', 'SGS'].map((c) => (
                  <span
                    key={c}
                    className="rounded-md border border-white/12 bg-white/[0.05] px-2 py-1 font-mono text-[10.5px] font-bold tracking-wide text-white/60"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategoryMarquee locale={L} />

      {/* ============================================================
          BO'LIMLAR
          ============================================================ */}
      <CategoriesSection locale={L} t={t} />
      <WhySection locale={L} t={t} />
      <TestBoxSection locale={L} t={t} />
      <ProcessSection locale={L} t={t} />
      <IndustriesSection locale={L} t={t} />
      <PopularProductsSection locale={L} t={t} />
      <CertsSection locale={L} t={t} />

      {/* ---- R&D / sifat bloki ---- */}
      <section className="container-x py-14 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="relative overflow-hidden rounded-3xl border border-cream-200 shadow-lift">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/rnd.jpg"
              alt={t('about.rnd')}
              className="h-full min-h-[18rem] w-full object-cover"
              loading="lazy"
              width={900}
              height={700}
            />
            <div className="absolute inset-x-4 bottom-4 rounded-xl bg-white/92 p-3.5 shadow-soft backdrop-blur">
              <p className="flex items-center gap-2 text-[12.5px] font-bold text-pine-900">
                <Icon name="lab" size={15} className="text-teal-600" />
                {t('about.rnd')}
              </p>
              <p className="mt-1 text-[12px] leading-snug text-slate-warm-600">{t('about.rndText')}</p>
            </div>
          </div>

          <div>
            <span className="eyebrow">{t('about.quality')}</span>
            <h2 className="mt-2.5 font-display text-[clamp(1.35rem,3.2vw,2rem)] leading-[1.12] font-extrabold tracking-tight text-pine-900">
              {t('about.uzTitle')}
            </h2>
            <p className="mt-3.5 text-[15px] leading-relaxed text-slate-warm-600">{t('about.uzText')}</p>

            <ul className="mt-6 flex flex-col gap-3">
              {[t('about.value1'), t('about.value2'), t('about.value3'), t('about.value4')].map((v, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-mint-100 text-teal-600" aria-hidden>
                    <Icon name="check" size={14} strokeWidth={2.6} />
                  </span>
                  <span className="text-[14px] leading-snug text-slate-warm-700">{v}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Link
                href={`/${locale}/about`}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-pine-800 px-5 text-[14px] font-bold text-white transition hover:bg-teal-600"
              >
                <Icon name="users" size={17} />
                {t('nav.about')}
              </Link>
              <Link
                href={`/${locale}/industries`}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-pine-800/20 px-5 text-[14px] font-bold text-pine-800 transition hover:border-teal-500 hover:bg-mint-50 hover:text-teal-600"
              >
                <Icon name="factory" size={17} />
                {t('nav.industries')}
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge tone="mint" size="md" icon="certificate">{t('certs.halal')}</Badge>
              <Badge tone="cream" size="md" icon="shield">{t('certs.haccp')}</Badge>
              <Badge tone="cream" size="md" icon="award">{t('certs.racs')}</Badge>
            </div>
          </div>
        </div>
      </section>

      <FaqSection locale={L} t={t} />

      {/* ============================================================
          YAKUNIY CTA + QO'NG'IROQ FORMASI
          ============================================================ */}
      <FinalCta locale={L} t={t}>
        <LeadForm
          type="callback"
          locale={locale}
          className="border-white/12 bg-white shadow-float"
          title={t('contact.callBack')}
          subtitle={t('contact.callBackHint')}
          submitLabel={t('form.submitCallback')}
        />
      </FinalCta>

      <JsonLdGroup items={[homeLd(locale), faqLd(faqItems)]} />
    </>
  );
}
