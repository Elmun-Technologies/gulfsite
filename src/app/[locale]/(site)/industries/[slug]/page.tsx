/**
 * TARMOQ SAHIFASI (industry detail)
 * ----------------------------------------------------------------
 * Har bir ishlab chiqarish sohasi uchun to'liq "yechim" sahifasi:
 * muammolar → doza tavsiyalari → shakl → tavsiya etilgan guruhlar →
 * mahsulotlar → zayvka. Bu sahifalar "uzun dumli" so'rovlar uchun
 * asosiy SEO-aktiv ("muzqaymoq uchun aromatizator Toshkent" kabi).
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata, breadcrumbLd, collectionPageLd } from '@/lib/seo';
import {
  applicationCounts,
  applicationDoseRange,
  applicationForms,
  applicationGroups,
  applicationProducts,
  productCount,
} from '@/lib/catalog';
import { fallbackIndustryCopy, industryCopy, industryText } from '@/lib/industry-copy';
import { APPLICATIONS, getApplication, tr, type Locale } from '@/lib/taxonomy';
import { formatUzPhone } from '@/lib/utils';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { ProductCard } from '@/components/catalog/ProductCard';
import { LeadForm } from '@/components/lead/LeadForm';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Badge, SectionHeading } from '@/components/ui/Display';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const slugs = APPLICATIONS.map((a) => a.id);
  return LOCALES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = normalizeLocale(raw);
  const app = getApplication(slug);
  if (!app) return buildMetadata({ locale, title: '404', description: '', path: `/industries/${slug}`, noIndex: true });

  const t = makeT(locale);
  const name = tr(app.name, locale, slug);
  const count = applicationCounts()[slug] ?? 0;

  return buildMetadata({
    locale,
    title: name,
    description: `${name}: ${count} ${t('industries.products')} O'zbekistonda. Bepul test box, texnik ko'mak va ${siteConfig.contact.phonePrimary}.`,
    path: `/industries/${slug}`,
    keywords: [
      `${name} uchun aromatizatorlar`,
      `${name} ingredientlari Toshkent`,
      `ароматизаторы для ${name}`,
    ],
    image: '/images/hero-lab.jpg',
  });
}

export default async function IndustryPage({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  const locale = normalizeLocale(raw) as AppLocale;
  const L = locale as Locale;
  const app = getApplication(slug);
  if (!app) notFound();

  const t = makeT(locale);
  const name = tr(app.name, L, slug);
  const counts = applicationCounts();
  const count = counts[slug] ?? 0;
  if (count === 0) notFound();

  const copy = industryCopy(slug) ?? fallbackIndustryCopy(app.name);
  const groups = applicationGroups(slug, L);
  const forms = applicationForms(slug, L);
  const dose = applicationDoseRange(slug);
  const products = applicationProducts(slug, 6, L);

  const base = `/${locale}/industries`;
  const catalogHref = `/${locale}/catalog`;
  const crumbs = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('nav.industries'), href: base },
    { label: name, href: `${base}/${slug}` },
  ];

  const others = APPLICATIONS.filter((a) => a.id !== slug && (counts[a.id] ?? 0) > 0)
    .slice(0, 8)
    .map((a) => ({ slug: `${base}/${a.id}`, name: tr(a.name, L, a.id) }));

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-cream-200 bg-pine-950 text-white">
        <div className="pattern-uzbek pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden />
        <div
          className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full opacity-25 blur-3xl"
          style={{ backgroundColor: app.color ?? '#0e7c6b' }}
          aria-hidden
        />
        <div className="container-x relative py-10 lg:py-14">
          <Breadcrumb items={crumbs} className="[&_a]:text-white/60 [&_a:hover]:text-mint-200 [&_span:last-child]:text-white" />

          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: app.color ?? '#0e7c6b' }}
                  aria-hidden
                >
                  <Icon name={(app.icon ?? 'factory') as IconName} size={24} />
                </span>
                <span className="rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-mint-200">
                  {count} {t('industries.products')}
                </span>
              </div>

              <h1 className="mt-4 max-w-3xl font-display text-[clamp(1.8rem,5vw,3rem)] leading-[1.06] font-extrabold tracking-tight">
                {name}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70">
                {industryText(copy, 'intro', L)}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-2.5">
                <Link
                  href={`/${locale}/samples`}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-gold-500 px-6 text-[14.5px] font-extrabold text-pine-950 transition hover:bg-gold-400 hover:shadow-glow active:scale-[0.98]"
                >
                  <Icon name="box" size={18} />
                  {t('nav.getSample')}
                </Link>
                <Link
                  href={`${catalogHref}?applications=${slug}`}
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/25 px-5 text-[14px] font-bold text-white transition hover:bg-white/10"
                >
                  <Icon name="grid" size={17} />
                  {t('industries.seeProducts')}
                </Link>
                <a
                  href={siteConfig.contact.phonePrimaryHref}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-white/10 px-5 font-mono text-[14px] font-bold text-white transition hover:bg-white/20"
                >
                  <Icon name="phone" size={16} />
                  {formatUzPhone(siteConfig.contact.phonePrimary)}
                </a>
              </div>
            </div>

            {/* Tezkor texnik xulosa */}
            <div className="flex flex-col gap-2.5 rounded-2xl border border-white/12 bg-white/[0.06] p-5 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-mint-200/80">
                {t('product.specs')}
              </p>
              <dl className="flex flex-col gap-2.5">
                {dose ? (
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-[12.5px] text-white/60">{t('industry.dosage')}</dt>
                    <dd className="font-mono text-[12.5px] font-bold text-white">
                      {dose.min}–{dose.max} %
                    </dd>
                  </div>
                ) : null}
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-[12.5px] text-white/60">{t('catalog.total')}</dt>
                  <dd className="font-mono text-[12.5px] font-bold text-white">{count}</dd>
                </div>
                {forms[0] ? (
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-[12.5px] text-white/60">{t('industry.form')}</dt>
                    <dd className="text-[12.5px] font-bold text-white">{forms[0].label}</dd>
                  </div>
                ) : null}
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-[12.5px] text-white/60">{t('product.packaging')}</dt>
                  <dd className="font-mono text-[12.5px] font-bold text-white">1 / 5 / 10 / 25 kg</dd>
                </div>
              </dl>
              <p className="mt-2 border-t border-white/12 pt-3 text-[11.5px] leading-snug text-white/55">
                {t('form.secureNote')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MUAMMOLAR ============ */}
      <section className="container-x py-10 lg:py-14">
        <SectionHeading eyebrow={t('industry.challenges')} title={t('industry.challenges')} />
        <ul className="mt-6 grid gap-3.5 md:grid-cols-3">
          {copy.challenges.map((c, i) => (
            <li key={i} className="rounded-2xl border border-cream-200 bg-white p-5 shadow-soft">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint-100 font-mono text-[13px] font-extrabold text-teal-600" aria-hidden>
                {i + 1}
              </span>
              <p className="mt-3.5 text-[14px] leading-snug font-bold text-pine-900">{tr(c, L, '')}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-warm-600">
                {locale === 'ru'
                  ? 'Подберём рецептуру под ваш процесс — бесплатно.'
                  : locale === 'en'
                    ? 'We will match the formulation to your process — free of charge.'
                    : 'Jarayoningizga mos retsepturani tanlab beramiz — bepul.'}
              </p>
            </li>
          ))}
        </ul>

        {/* Doza va shakl */}
        <div className="mt-4 grid gap-3.5 lg:grid-cols-2">
          <div className="rounded-2xl border border-cream-200 bg-cream-50 p-5">
            <h2 className="flex items-center gap-2 font-display text-[14px] font-extrabold tracking-tight text-pine-900">
              <Icon name="drop" size={17} className="text-teal-600" />
              {t('industry.dosage')}
            </h2>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-warm-700">{industryText(copy, 'dosage', L)}</p>
            {dose ? (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 font-mono text-[12px] font-bold text-pine-900 shadow-soft">
                <Icon name="sliders" size={13} className="text-teal-600" />
                {dose.min} % — {dose.max} %
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-cream-200 bg-cream-50 p-5">
            <h2 className="flex items-center gap-2 font-display text-[14px] font-extrabold tracking-tight text-pine-900">
              <Icon name="flask" size={17} className="text-teal-600" />
              {t('industry.form')}
            </h2>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-warm-700">{industryText(copy, 'forms', L)}</p>
            {forms.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {forms.slice(0, 5).map((f) => (
                  <Link
                    key={f.id}
                    href={`${catalogHref}?applications=${slug}&forms=${f.id}`}
                    className="rounded-full border border-cream-200 bg-white px-2.5 py-1 text-[11.5px] font-semibold text-pine-800 transition hover:border-teal-500 hover:text-teal-600"
                  >
                    {f.label}
                    <span className="ml-1 font-mono text-slate-warm-500">{f.count}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ============ TAVSIYA ETILGAN GURUHLAR ============ */}
      <section className="border-y border-cream-200 bg-cream-100/60 py-10 lg:py-14">
        <div className="container-x">
          <SectionHeading
            eyebrow={t('industry.recommended')}
            title={t('industry.recommended')}
            description={`${productCount()} ${t('catalog.total').toLowerCase()}`}
            action={
              <Link
                href={`${catalogHref}?applications=${slug}`}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-pine-800/20 px-4 text-[13.5px] font-bold text-pine-800 transition hover:border-teal-500 hover:bg-mint-50 hover:text-teal-600"
              >
                {t('catalog.viewAll')}
                <Icon name="arrow-right" size={15} />
              </Link>
            }
          />

          <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {groups.slice(0, 12).map((g) => (
              <li key={g.id}>
                <Link
                  href={`${catalogHref}?applications=${slug}&groups=${g.id}`}
                  className="group flex h-full items-center gap-3 rounded-xl border border-cream-200 bg-white p-3.5 shadow-soft transition hover:-translate-y-0.5 hover:border-teal-500/35 hover:shadow-lift"
                >
                  <span className="h-8 w-1 shrink-0 rounded-full" style={{ backgroundColor: g.color }} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[13px] font-bold text-pine-900 group-hover:text-teal-600">
                      {g.label}
                    </span>
                    <span className="mt-0.5 block font-mono text-[11px] text-slate-warm-500">
                      {g.count} {t('industries.products')}
                    </span>
                  </span>
                  <Icon
                    name="arrow-up-right"
                    size={15}
                    className="shrink-0 text-slate-warm-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-600"
                  />
                </Link>
              </li>
            ))}
          </ul>

          {copy.features?.length ? (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {copy.features.map((f) => (
                <Link key={f} href={`${catalogHref}?applications=${slug}&features=${f}`}>
                  <Badge tone="mint" size="md" icon="check">
                    {f}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ============ MAHSULOTLAR ============ */}
      <section className="container-x py-10 lg:py-14">
        <SectionHeading
          eyebrow={name}
          title={t('industry.recommended')}
          description={t('catalog.resultsCount', { count })}
          action={
            <Link
              href={`${catalogHref}?applications=${slug}`}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-pine-800 px-4 text-[13.5px] font-bold text-white transition hover:bg-teal-600"
            >
              {t('catalog.viewAll')}
              <Icon name="arrow-right" size={15} />
            </Link>
          }
        />
        <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((c) => (
            <ProductCard key={c.sku} card={c} locale={locale} hrefBase={`/${locale}/product`} />
          ))}
        </div>
      </section>

      {/* ============ ZAYVKA + BOSHQA TARMOQLAR ============ */}
      <section className="border-t border-cream-200 bg-cream-100/60 py-12 lg:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start">
          <div>
            <span className="eyebrow">{t('industry.askSpecialist')}</span>
            <h2 className="mt-2.5 max-w-xl font-display text-[clamp(1.35rem,3.2vw,2rem)] leading-[1.12] font-extrabold tracking-tight text-pine-900">
              {t('cta.title')}
            </h2>
            <p className="mt-3.5 max-w-2xl text-[15px] leading-relaxed text-slate-warm-600">{t('cta.subtitle')}</p>

            <ul className="mt-6 flex flex-col gap-2.5">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-mint-100 text-teal-600" aria-hidden>
                    <Icon name="check" size={14} strokeWidth={2.6} />
                  </span>
                  <span className="text-[14px] leading-snug text-slate-warm-700">{tr(copy.challenges[i - 1] ?? copy.challenges[0], L, '')}</span>
                </li>
              ))}
            </ul>

            {/* Boshqa tarmoqlar */}
            <div className="mt-8">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-warm-500">
                {t('industry.allIndustries')}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={o.slug}
                      className="inline-flex items-center gap-1.5 rounded-full border border-cream-200 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-pine-800 transition hover:border-teal-500 hover:text-teal-600"
                    >
                      {o.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:sticky lg:top-[5.5rem]">
            <LeadForm
              type="quote"
              locale={locale}
              compact
              title={t('industry.askSpecialist')}
              subtitle={`${name} · ${count} ${t('industries.products')}`}
              submitLabel={t('form.submitQuote')}
              initialMessage={`${name}: `}
            />
          </div>
        </div>
      </section>

      <JsonLdGroup
        items={[
          breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href })), locale),
          ...collectionPageLd(
            locale,
            name,
            industryText(copy, 'intro', L),
            `/industries/${slug}`,
            products.map((p) => ({ slug: p.slug, name: p.name })),
          ),
        ]}
      />
    </>
  );
}
