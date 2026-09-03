/**
 * BOSH SAHIFA BO'LIMLARI (server komponentlari)
 * ----------------------------------------------------------------
 * Bosh sahifaning vazifasi — ishonch o'rnatish va zayvkaga olib borish.
 * Tartib ataylab shunday:
 *   1. Kategoriyalar (nima bor) → 2. Nega biz (ishonch) →
 *   3. Test box (past xavf, yuqori konversiya) → 4. Jarayon (aniqlik) →
 *   5. Tarmoqlar (o'zini tanish) → 6. Mahsulotlar (isbot) →
 *   7. Sertifikatlar (xavfsizlik) → 8. FAQ (e'tirozlarni yechish) →
 *   9. Yakuniy CTA (harakat).
 */

import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/config';
import { catalogStats, newProducts, popularProducts } from '@/lib/catalog';
import { APPLICATIONS, CATEGORIES, tr, type Locale } from '@/lib/taxonomy';
import type { AppLocale, DictKey, Translator } from '@/i18n';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Badge, SectionHeading, Stat } from '@/components/ui/Display';
import { ProductCard } from '@/components/catalog/ProductCard';

interface SectionProps {
  locale: Locale;
  t: Translator;
}

/* ============================================================
   1. KATEGORIYALAR
   ============================================================ */

export function CategoriesSection({ locale, t }: SectionProps) {
  const stats = catalogStats(locale);
  const href = `/${locale}/catalog`;

  return (
    <section className="container-x py-14 lg:py-20">
      <SectionHeading
        eyebrow={t('categories.eyebrow')}
        title={t('categories.title')}
        description={t('categories.subtitle')}
        action={
          <Link
            href={href}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-pine-800/20 px-4 text-[13.5px] font-bold text-pine-800 transition hover:border-teal-500 hover:bg-mint-50 hover:text-teal-600"
          >
            {t('categories.viewAll')}
            <Icon name="arrow-right" size={15} />
          </Link>
        }
      />

      <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.byCategory.map((c) => (
          <Link
            key={c.id}
            href={`${href}?categories=${c.id}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-teal-500/35 hover:shadow-lift"
          >
            <span
              className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
              style={{ backgroundColor: c.color ?? '#0e7c6b' }}
              aria-hidden
            />
            <div className="flex items-start gap-3.5">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: c.color ?? '#0e7c6b' }}
                aria-hidden
              >
                <Icon name={(c.icon ?? 'tag') as IconName} size={24} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[16px] leading-snug font-extrabold tracking-tight text-pine-900 group-hover:text-teal-600">
                  {c.label}
                </h3>
                <p className="mt-1 font-mono text-[12px] font-bold text-slate-warm-500">
                  {c.count} {t('categories.positions').toLowerCase()}
                </p>
              </div>
              <Icon
                name="arrow-up-right"
                size={18}
                className="shrink-0 text-slate-warm-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-600"
              />
            </div>
            {c.hint ? <p className="mt-3.5 text-[13px] leading-relaxed text-slate-warm-600">{c.hint}</p> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   2. NEGA BIZ
   ============================================================ */

const WHY_ICONS: IconName[] = ['badge', 'lab', 'truck', 'certificate', 'users', 'sparkles'];

export function WhySection({ t }: SectionProps) {
  return (
    <section className="border-y border-cream-200 bg-cream-100/60 py-14 lg:py-20">
      <div className="container-x">
        <SectionHeading align="center" eyebrow={t('why.eyebrow')} title={t('why.title')} />

        <div className="mt-9 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <article
              key={i}
              className="group flex flex-col rounded-2xl border border-cream-200 bg-white p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-lift"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint-100 text-teal-600 transition-colors group-hover:bg-teal-600 group-hover:text-white" aria-hidden>
                <Icon name={WHY_ICONS[i - 1] ?? 'badge'} size={22} />
              </span>
              <h3 className="mt-4 font-display text-[15.5px] leading-snug font-bold text-pine-900">
                {t(`why.${i}.title` as DictKey)}
              </h3>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-slate-warm-600">
                {t(`why.${i}.text` as DictKey)}
              </p>
              <span className="mt-4 flex items-center gap-1.5 text-[12px] font-bold text-teal-600 opacity-0 transition-opacity group-hover:opacity-100">
                {t('brand.role')}
                <Icon name="check" size={13} strokeWidth={2.6} />
              </span>
            </article>
          ))}
        </div>

        {/* Raqamli isbot */}
        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon="award" value={`${siteConfig.stats.yearsExperience}+`} label={t('stats.years')} hint={`GFF ${siteConfig.brand.since}`} />
          <Stat icon="flask" value={`${siteConfig.stats.rawMaterials}+`} label={t('stats.rawMaterials')} />
          <Stat icon="globe" value={siteConfig.stats.exportCountries} label={t('stats.export')} />
          <Stat icon="map-pin" value={siteConfig.stats.uzRegions} label={t('stats.regions')} hint={t('stats.delivery')} />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   3. TEST BOX
   ============================================================ */

export function TestBoxSection({ locale, t }: SectionProps) {
  const biz = siteConfig.business;

  return (
    <section className="container-x py-14 lg:py-20">
      <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-lift lg:grid-cols-2 lg:gap-0">
        {/* Rasm */}
        <div className="relative min-h-[16rem] overflow-hidden lg:min-h-[28rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/sample-box.jpg"
            alt={t('box.title')}
            className="h-full w-full object-cover"
            loading="lazy"
            width={900}
            height={900}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pine-950/70 via-pine-950/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-white/25" aria-hidden />

          <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2 lg:inset-x-auto lg:bottom-6 lg:left-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1.5 text-[12px] font-bold text-pine-900 shadow-soft backdrop-blur">
              <Icon name="check" size={13} className="text-teal-600" strokeWidth={2.8} />
              {t('samples.deliveryFree')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1.5 text-[12px] font-bold text-pine-900 shadow-soft backdrop-blur">
              <Icon name="clock" size={13} className="text-teal-600" />
              {t('samples.deliveryTime').replace('{days}', String(biz.sampleDeliveryDays))}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-3 py-1.5 text-[12px] font-extrabold text-pine-950 shadow-soft">
              <Icon name="box" size={13} />
              {biz.sampleBoxMaxItems} {locale === 'ru' ? 'образцов' : locale === 'en' ? 'samples' : 'namuna'}
            </span>
          </div>
        </div>

        {/* Matn */}
        <div className="p-6 lg:p-10">
          <span className="eyebrow">{t('box.eyebrow')}</span>
          <h2 className="mt-2.5 font-display text-[clamp(1.4rem,3.4vw,2.1rem)] leading-[1.12] font-extrabold tracking-tight text-pine-900">
            {t('box.title')}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-warm-600">{t('box.subtitle')}</p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-mint-100 text-teal-600" aria-hidden>
                  <Icon name="check" size={14} strokeWidth={2.6} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-bold leading-snug text-pine-900">
                    {t(`box.what${i}.title` as DictKey)}
                  </span>
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-slate-warm-600">
                    {t(`box.what${i}.text` as DictKey)}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <Link
              href={`/${locale}/samples`}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-teal-600 px-6 text-[14.5px] font-bold text-white shadow-soft transition hover:bg-pine-800 hover:shadow-lift active:scale-[0.98]"
            >
              <Icon name="box" size={18} />
              {t('box.cta')}
            </Link>
            <Link
              href={`/${locale}/catalog`}
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-pine-800/20 px-5 text-[14px] font-bold text-pine-800 transition hover:border-teal-500 hover:bg-mint-50 hover:text-teal-600"
            >
              <Icon name="grid" size={17} />
              {t('nav.catalog')}
            </Link>
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-[12.5px] text-slate-warm-500">
            <Icon name="lock" size={13} className="text-teal-600" />
            {t('form.secureNote')}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   4. JARAYON
   ============================================================ */

const PROCESS_ICONS: IconName[] = ['search', 'box', 'send', 'truck'];

export function ProcessSection({ t }: SectionProps) {
  return (
    <section className="border-y border-cream-200 bg-pine-950 py-14 text-white lg:py-20">
      <div className="container-x">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-mint-200">
            <span className="h-px w-5 bg-mint-200/50" />
            {t('process.eyebrow')}
          </span>
          <h2 className="mt-2.5 font-display text-[clamp(1.4rem,3.4vw,2.1rem)] leading-[1.12] font-extrabold tracking-tight text-white">
            {t('process.title')}
          </h2>
        </div>

        <ol className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="group relative rounded-2xl border border-white/12 bg-white/[0.05] p-5 transition hover:border-teal-500/40 hover:bg-white/[0.08]">
              <span className="absolute right-4 top-3 font-display text-[2.5rem] leading-none font-extrabold text-white/[0.07] transition group-hover:text-teal-500/20" aria-hidden>
                {i}
              </span>
              <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white" aria-hidden>
                <Icon name={PROCESS_ICONS[i - 1] ?? 'send'} size={22} />
              </span>
              <h3 className="relative mt-4 font-display text-[15px] leading-snug font-bold text-white">
                {t(`process.${i}.title` as DictKey)}
              </h3>
              <p className="relative mt-2 text-[13px] leading-relaxed text-white/60">
                {t(`process.${i}.text` as DictKey)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ============================================================
   5. TARMOQLAR
   ============================================================ */

export function IndustriesSection({ locale, t }: SectionProps) {
  const apps = APPLICATIONS.slice(0, 12);
  const href = `/${locale}/catalog`;

  return (
    <section className="container-x py-14 lg:py-20">
      <SectionHeading
        eyebrow={t('industries.eyebrow')}
        title={t('industries.title')}
        description={t('industries.subtitle')}
        action={
          <Link
            href={`/${locale}/industries`}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-pine-800/20 px-4 text-[13.5px] font-bold text-pine-800 transition hover:border-teal-500 hover:bg-mint-50 hover:text-teal-600"
          >
            {t('industry.allIndustries')}
            <Icon name="arrow-right" size={15} />
          </Link>
        }
      />

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {apps.map((a) => (
          <li key={a.id}>
            <Link
              href={`${href}?applications=${a.id}`}
              className="group flex h-full flex-col gap-2 rounded-2xl border border-cream-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-teal-500/35 hover:shadow-lift"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-8 w-1 rounded-full transition-all group-hover:w-1.5"
                  style={{ backgroundColor: a.color ?? '#0e7c6b' }}
                  aria-hidden
                />
                <span className="flex-1 font-display text-[13.5px] leading-snug font-bold text-pine-900 group-hover:text-teal-600">
                  {tr(a.name, locale, a.id)}
                </span>
              </span>
              {a.hint ? (
                <span className="line-clamp-2 pl-3 text-[12px] leading-snug text-slate-warm-600">{tr(a.hint, locale, '')}</span>
              ) : null}
              <span className="mt-auto inline-flex items-center gap-1 pl-3 text-[11.5px] font-semibold text-slate-warm-500 transition group-hover:text-teal-600">
                {t('industries.seeProducts')}
                <Icon name="arrow-right" size={12} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ============================================================
   6. MASHHUR MAHSULOTLAR
   ============================================================ */

export function PopularProductsSection({ locale, t }: SectionProps) {
  const popular = popularProducts(6, locale);
  const fresh = newProducts(3, locale);
  const href = `/${locale}/catalog`;

  return (
    <section className="border-y border-cream-200 bg-cream-100/60 py-14 lg:py-20">
      <div className="container-x">
        <SectionHeading
          eyebrow={t('catalog.popular')}
          title={t('catalog.quickLinks')}
          description={t('catalog.resultsCount', { count: catalogStats(locale).total })}
          action={
            <Link
              href={href}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-pine-800 px-4 text-[13.5px] font-bold text-white transition hover:bg-teal-600"
            >
              {t('categories.viewAll')}
              <Icon name="arrow-right" size={15} />
            </Link>
          }
        />

        <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((c) => (
            <ProductCard key={c.sku} card={c} locale={locale} hrefBase={`/${locale}/product`} />
          ))}
        </div>

        {fresh.length ? (
          <div className="mt-9">
            <h3 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-slate-warm-500">
              <Icon name="sparkles" size={14} className="text-teal-600" />
              {t('catalog.newArrivals')}
            </h3>
            <div className="mt-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              {fresh.map((c) => (
                <ProductCard key={c.sku} card={c} locale={locale} hrefBase={`/${locale}/product`} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ============================================================
   7. SERTIFIKATLAR
   ============================================================ */

export function CertsSection({ t }: SectionProps) {
  const certs: { key: DictKey; icon: IconName; name: string }[] = [
    { key: 'certs.halal', icon: 'halal', name: 'HALAL' },
    { key: 'certs.iso', icon: 'iso', name: 'ISO 22000' },
    { key: 'certs.haccp', icon: 'shield', name: 'HACCP' },
    { key: 'certs.sgs', icon: 'certificate', name: 'SGS' },
    { key: 'certs.racs', icon: 'award', name: 'RACS' },
    { key: 'certs.eac', icon: 'eac', name: 'EAC' },
    { key: 'certs.nonGmo', icon: 'gmo', name: 'NON-GMO' },
    { key: 'certs.alcoholFree', icon: 'no-alcohol', name: 'ALCOHOL FREE' },
  ];

  return (
    <section className="container-x py-14 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-center">
        <div>
          <SectionHeading eyebrow={t('certs.eyebrow')} title={t('certs.title')} description={t('certs.subtitle')} />
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge tone="mint" size="md" icon="factory">Jebel Ali Free Zone, Dubai</Badge>
            <Badge tone="cream" size="md" icon="calendar">{siteConfig.brand.since}</Badge>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {certs.map((c) => (
            <li
              key={c.name}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-cream-200 bg-white p-4 text-center shadow-soft transition hover:-translate-y-0.5 hover:border-teal-500/35 hover:shadow-lift"
              title={t(c.key)}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mint-100 text-teal-600 transition group-hover:bg-teal-600 group-hover:text-white" aria-hidden>
                <Icon name={c.icon} size={22} />
              </span>
              <span className="font-display text-[12px] font-extrabold tracking-tight text-pine-900">{c.name}</span>
              <span className="text-[11px] leading-snug text-slate-warm-500">{t(c.key)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ============================================================
   8. FAQ
   ============================================================ */

export function FaqSection({ locale, t }: SectionProps) {
  const items: { q: string; a: string }[] = [1, 2, 3, 4, 5, 6, 7].map((i) => ({
    q: t(`faq.q${i}` as DictKey),
    a: t(`faq.a${i}` as DictKey),
  }));

  return (
    <section className="border-t border-cream-200 bg-cream-100/60 py-14 lg:py-20">
      <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-start">
        <div className="lg:sticky lg:top-[5.5rem]">
          <SectionHeading eyebrow={t('faq.eyebrow')} title={t('faq.title')} description={t('faq.more')} />
          <Link
            href={`/${locale}/contact`}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-pine-800 px-5 text-[13.5px] font-bold text-white transition hover:bg-teal-600"
          >
            <Icon name="phone" size={16} />
            {t('nav.contact')}
          </Link>
        </div>

        <div className="flex flex-col gap-2.5">
          {items.map((f, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-cream-200 bg-white shadow-soft transition open:border-teal-500/35 open:shadow-lift"
              open={i === 0}
            >
              <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span className="flex-1 font-display text-[15px] leading-snug font-bold text-pine-900">{f.q}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cream-200 bg-cream-50 text-teal-600 transition-transform duration-300 group-open:rotate-45" aria-hidden>
                  <Icon name="plus" size={14} strokeWidth={2.4} />
                </span>
              </summary>
              <p className="border-t border-cream-200 px-5 py-4 text-[14px] leading-relaxed text-slate-warm-700">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   9. YAKUNIY CTA
   ============================================================ */

export function FinalCta({ locale, t, children }: SectionProps & { children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-pine-900 py-14 text-white lg:py-20">
      <div className="pattern-uzbek pointer-events-none absolute inset-0 opacity-[0.09]" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-teal-500/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" aria-hidden />

      <div className="container-x relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-400">
            <Icon name="sparkles" size={12} />
            {t('brand.role')}
          </span>
          <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.5rem,4vw,2.4rem)] leading-[1.1] font-extrabold tracking-tight text-white">
            {t('cta.title')}
          </h2>
          <p className="mt-3.5 max-w-xl text-[15px] leading-relaxed text-white/70">{t('cta.subtitle')}</p>

          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <Link
              href={`/${locale}/samples`}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-teal-500 px-6 text-[14.5px] font-bold text-white transition hover:bg-teal-400 hover:shadow-glow active:scale-[0.98]"
            >
              <Icon name="box" size={18} />
              {t('nav.getSample')}
            </Link>
            <Link
              href={`/${locale}/quote`}
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/25 px-5 text-[14px] font-bold text-white transition hover:bg-white/10"
            >
              <Icon name="invoice" size={17} />
              {t('nav.quote')}
            </Link>
            <a
              href={siteConfig.contact.phonePrimaryHref}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-white/10 px-5 font-mono text-[14px] font-bold text-white transition hover:bg-white/20"
            >
              <Icon name="phone" size={16} />
              {siteConfig.contact.phonePrimary}
            </a>
          </div>

          <p className="mt-4 flex items-center gap-2 text-[12.5px] text-white/55">
            <Icon name="clock" size={13} className="text-mint-200" />
            {t('cta.orCall')} · {t('cta.fast')}
          </p>
        </div>

        {children ? <div>{children}</div> : null}
      </div>
    </section>
  );
}

/* ============================================================
   10. KATEGORIYA LENTASI (marquee) — vizual ritm
   ============================================================ */

export function CategoryMarquee({ locale }: { locale: Locale }) {
  const items = CATEGORIES.map((c) => tr(c.name, locale, c.id));
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-cream-200 bg-white py-3" aria-hidden>
      <div className="animate-marquee flex w-max gap-8">
        {doubled.map((label, i) => (
          <span key={i} className={cn('flex items-center gap-3 text-[13px] font-bold whitespace-nowrap text-slate-warm-500')}>
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500/60" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export type { AppLocale };
