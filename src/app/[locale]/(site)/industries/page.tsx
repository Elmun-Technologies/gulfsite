/**
 * TARMOQLAR (INDUSTRIES) — RO'YXAT
 * ----------------------------------------------------------------
 * Har bir ishlab chiqarish sohasi uchun alohida "yechim" sahifasi.
 * B2B mijoz o'z tarmog'ini tanlab, o'ziga tegishli muammolar,
 * doza tavsiyalari va mahsulotlarni ko'radi — bu konversiyani
 * sezilarli oshiradi, chunki mijoz "bu mening holatim" deydi.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata, breadcrumbLd, collectionPageLd, linkListLd } from '@/lib/seo';
import { applicationCounts, catalogStats } from '@/lib/catalog';
import { APPLICATIONS, tr, type Locale } from '@/lib/taxonomy';
import { formatUzPhone } from '@/lib/utils';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Stat } from '@/components/ui/Display';
import { LeadForm } from '@/components/lead/LeadForm';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  return buildMetadata({
    locale,
    title: t('industries.title'),
    description: t('industries.subtitle'),
    path: '/industries',
    keywords: [
      'aromatizator tarmoqlar bo\'yicha',
      'oziq-ovqat ishlab chiqarish uchun ingredientlar',
      'отраслевые решения ароматизаторы Узбекистан',
    ],
  });
}

export default async function IndustriesPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw) as AppLocale;
  const L = locale as Locale;
  const t = makeT(locale);

  const counts = applicationCounts();
  const stats = catalogStats(L);
  const base = `/${locale}/industries`;

  const crumbs = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('nav.industries'), href: base },
  ];

  const ldItems = APPLICATIONS.filter((a) => (counts[a.id] ?? 0) > 0).map((a) => ({
    path: `${base}/${a.id}`,
    name: tr(a.name, L, a.id),
  }));

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-cream-200 bg-pine-950 text-white">
        <div className="pattern-uzbek pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden />
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl" aria-hidden />
        <div className="container-x relative py-10 lg:py-14">
          <Breadcrumb items={crumbs} className="[&_a]:text-white/60 [&_a:hover]:text-mint-200 [&_span:last-child]:text-white" />

          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
            <div>
              <span className="eyebrow text-mint-200/80">{t('industries.eyebrow')}</span>
              <h1 className="mt-2.5 max-w-3xl font-display text-[clamp(1.8rem,5vw,3rem)] leading-[1.06] font-extrabold tracking-tight">
                {t('industries.title')}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70">{t('industries.subtitle')}</p>
            </div>

            <dl className="grid grid-cols-2 gap-3">
              {[
                { v: String(APPLICATIONS.length), k: t('stats.applications') },
                { v: `${stats.total}+`, k: t('stats.products') },
                { v: `${siteConfig.stats.yearsExperience}+`, k: t('stats.years') },
                { v: `${siteConfig.business.responseMinutes} ${locale === 'ru' ? 'мин' : 'min'}`, k: t('cta.fast') },
              ].map((s, i) => (
                <div key={i} className="rounded-xl border border-white/12 bg-white/[0.06] p-3.5">
                  <dt className="font-display text-[1.4rem] leading-none font-extrabold text-white tabular-nums">{s.v}</dt>
                  <dd className="mt-1.5 text-[11px] leading-snug text-white/55">{s.k}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ============ TARMOQLAR RO'YXATI ============ */}
      <section className="container-x py-10 lg:py-14">
        <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {APPLICATIONS.map((a) => {
            const count = counts[a.id] ?? 0;
            const disabled = count === 0;
            const inner = (
              <>
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: a.color ?? '#0e7c6b' }}
                  aria-hidden
                >
                  <Icon name={(a.icon ?? 'factory') as IconName} size={24} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-[15.5px] leading-snug font-extrabold tracking-tight text-pine-900 group-hover:text-teal-600">
                    {tr(a.name, L, a.id)}
                  </h2>
                  <p className="mt-1 font-mono text-[11.5px] font-bold text-slate-warm-500">
                    {count} {t('industries.products')}
                  </p>
                </div>
                <Icon
                  name={disabled ? 'lock' : 'arrow-up-right'}
                  size={18}
                  className="shrink-0 text-slate-warm-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-600"
                />
                {a.hint ? (
                  <p className="mt-3.5 line-clamp-2 text-[12.5px] leading-snug text-slate-warm-600">
                    {tr(a.hint, L, '')}
                  </p>
                ) : null}
              </>
            );

            return (
              <li key={a.id}>
                {disabled ? (
                  <span className="flex h-full cursor-not-allowed flex-col gap-3 rounded-2xl border border-dashed border-cream-200 bg-cream-50 p-5 opacity-70">
                    {inner}
                  </span>
                ) : (
                  <Link
                    href={`${base}/${a.id}`}
                    className="group flex h-full flex-col gap-3 rounded-2xl border border-cream-200 bg-white p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-teal-500/35 hover:shadow-lift"
                  >
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* ============ ISHONCH + CTA ============ */}
      <section className="border-y border-cream-200 bg-cream-100/60 py-12 lg:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start">
          <div>
            <span className="eyebrow">{t('why.eyebrow')}</span>
            <h2 className="mt-2.5 max-w-xl font-display text-[clamp(1.35rem,3.2vw,2rem)] leading-[1.12] font-extrabold tracking-tight text-pine-900">
              {t('industry.askSpecialist')}
            </h2>
            <p className="mt-3.5 max-w-2xl text-[15px] leading-relaxed text-slate-warm-600">
              {t('contact.subtitle')}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Stat icon="clock" value={`${siteConfig.business.responseMinutes} ${locale === 'ru' ? 'мин' : 'min'}`} label={t('cta.fast')} />
              <Stat icon="truck" value={`${siteConfig.business.sampleDeliveryDays} ${locale === 'ru' ? 'дн' : locale === 'en' ? 'days' : 'kun'}`} label={t('samples.deliveryInfo')} hint={t('samples.deliveryFree')} />
              <Stat icon="box" value={String(siteConfig.business.sampleBoxMaxItems)} label={t('stats.samples')} />
              <Stat icon="map-pin" value={String(siteConfig.stats.uzRegions)} label={t('stats.regions')} hint={t('stats.delivery')} />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Link
                href={`/${locale}/samples`}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-teal-600 px-6 text-[14.5px] font-bold text-white shadow-soft transition hover:bg-pine-800 hover:shadow-lift active:scale-[0.98]"
              >
                <Icon name="box" size={18} />
                {t('nav.getSample')}
              </Link>
              <a
                href={siteConfig.contact.phonePrimaryHref}
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-pine-800/20 px-5 font-mono text-[14px] font-bold text-pine-800 transition hover:border-teal-500 hover:bg-mint-50 hover:text-teal-600"
              >
                <Icon name="phone" size={17} />
                {formatUzPhone(siteConfig.contact.phonePrimary)}
              </a>
            </div>
          </div>

          <LeadForm
            type="quote"
            locale={locale}
            compact
            title={t('industry.askSpecialist')}
            subtitle={t('form.secureNote')}
            submitLabel={t('form.submitQuote')}
          />
        </div>
      </section>

      <JsonLdGroup
        items={[
          breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href })), locale),
          collectionPageLd(locale, t('industries.title'), t('industries.subtitle'), '/industries', []),
          linkListLd(ldItems, locale, t('industries.title')),
        ]}
      />
    </>
  );
}
