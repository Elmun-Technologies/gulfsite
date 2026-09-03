/**
 * MAHSULOT SAHIFASI
 * ----------------------------------------------------------------
 * Har bir mahsulot uchun alohida, indekslanadigan sahifa. Bu saytning
 * "uzun dumli" (long-tail) SEO asosi: mijoz Google'dan "vanilin O'zbekiston"
 * deb izlaydi va to'g'ridan-to'g'ri shu sahifaga tushadi → zayvka qoldiradi.
 *
 * Sahifa tarkibi:
 *   1. Breadcrumb + nom + SKU + sertifikatlar
 *   2. Tavsif, qo'llash sohalari, afzalliklar, saqlash
 *   3. Sticky o'ng panel: texnik spetsifikatsiya + CTA
 *   4. So'rov formasi (LeadForm type="product")
 *   5. O'xshash mahsulotlar
 *   6. JSON-LD: Product + BreadcrumbList
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { makeT, normalizeLocale, LOCALES, type AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata, breadcrumbLd, itemListLd, productLd } from '@/lib/seo';
import {
  allProducts,
  getProductBySlug,
  getProductBySku,
  popularProducts,
  relatedProducts,
  toCard,
} from '@/lib/catalog';
import { BENEFITS, productDescription, storageText } from '@/lib/catalog-copy';
import {
  ALL_GROUPS,
  APPLICATIONS,
  AVAILABILITY,
  CATEGORIES,
  FEATURES,
  FORMS,
  PACKAGING,
  tr,
  type Locale,
} from '@/lib/taxonomy';
import { formatDosage, formatKg } from '@/lib/utils';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Display';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductActions } from '@/components/product/ProductActions';
import { LeadForm } from '@/components/lead/LeadForm';

/** Eng mashhur mahsulotlar oldindan generatsiya qilinadi, qolganlari so'rovda */
const PREBUILD_PER_LOCALE = 150;

export function generateStaticParams() {
  const top = allProducts()
    .slice()
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, PREBUILD_PER_LOCALE);

  return LOCALES.flatMap((locale) => top.map((p) => ({ locale, slug: p.slug })));
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = normalizeLocale(rawLocale);
  const product = getProductBySlug(slug);
  if (!product) {
    return buildMetadata({ locale, title: 'Not found', path: `/product/${slug}`, noIndex: true });
  }

  const name = product.name[locale] || product.name.en;
  const category = tr(CATEGORIES.find((c) => c.id === product.category)?.name, locale, product.category);
  const group = tr(ALL_GROUPS.find((g) => g.id === product.group)?.name, locale, product.group);
  const apps = product.applications.slice(0, 3).map((a) => tr(APPLICATIONS.find((x) => x.id === a)?.name, locale, a));

  return buildMetadata({
    locale,
    title: `${name} — ${category} | ${product.sku}`,
    description: `${name} (${product.sku}) — ${group}. ${apps.join(', ')}. Doza ${formatDosage(product.dosage.min, product.dosage.max)}, qadoq ${product.packaging.map(formatKg).join('/')}. O‘zbekistonda ombordan, bepul namuna. ${siteConfig.contact.phonePrimary}`.slice(0, 190),
    path: `/product/${slug}`,
    type: 'product',
    keywords: [name, product.name.ru, product.name.en, product.sku, category, group, ...apps],
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = normalizeLocale(rawLocale);
  if (!(LOCALES as readonly string[]).includes(locale)) notFound();

  // SKU bilan ham ochilishi mumkin (/product/GFFD1001) — qulay va ishonchli
  const product = getProductBySlug(slug) ?? getProductBySku(slug.toUpperCase());
  if (!product) notFound();

  const loc = locale as AppLocale;
  const t = makeT(loc);

  const name = product.name[locale] || product.name.en || product.sku;
  const category = CATEGORIES.find((c) => c.id === product.category);
  const group = ALL_GROUPS.find((g) => g.id === product.group);
  const form = FORMS.find((f) => f.id === product.form);
  const availability = AVAILABILITY.find((a) => a.id === product.availability);

  const description = productDescription(
    product.category,
    name,
    product.applications,
    product.copyVariant,
    locale,
  );
  const benefits = BENEFITS[product.category]?.[locale] ?? [];
  const storage = storageText(product.category, locale);
  const related = relatedProducts(product, 6, locale);
  const fallback = related.length < 3 ? popularProducts(6, locale, product.category) : [];
  const relatedCards = [...related, ...fallback.filter((r) => !related.some((x) => x.sku === r.sku))].slice(0, 6);

  const productBase = `/${locale}/product`;
  const catalogBase = `/${locale}/catalog`;

  const crumbs = [
    { name: t('nav.home'), path: `/${locale}` },
    { name: t('nav.catalog'), path: catalogBase },
    { name: tr(category?.name, locale, product.category), path: `${catalogBase}?categories=${product.category}` },
    { name: tr(group?.name, locale, product.group), path: `${catalogBase}?groups=${product.group}` },
    { name, path: `${productBase}/${product.slug}` },
  ];

  const featureIcons: Record<string, IconName> = {
    halal: 'halal',
    'gmo-free': 'gmo',
    'alcohol-free': 'no-alcohol',
    'heat-stable': 'thermo',
    vegan: 'vegan',
    kosher: 'kosher',
  };

  return (
    <>
      {/* ================= SARLAVHA ================= */}
      <section className="border-b border-cream-200 bg-white">
        <div className="container-x py-5 lg:py-7">
          <Breadcrumb items={crumbs.map((c) => ({ label: c.name, href: c.path }))} />

          <div className="mt-4 grid gap-7 lg:grid-cols-[minmax(0,1fr)_22rem]">
            {/* ---- Chap: asosiy ma'lumot ---- */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                  style={{ backgroundColor: category?.color ?? '#0e7c6b' }}
                >
                  <Icon name={(category?.icon ?? 'tag') as IconName} size={12} />
                  {tr(category?.name, locale, product.category)}
                </span>
                <span className="rounded-lg bg-cream-100 px-2 py-1 font-mono text-[11.5px] font-bold text-slate-warm-700">
                  {product.sku}
                </span>
                {product.isNew ? <Badge tone="mint" size="sm">{t('card.new')}</Badge> : null}
                {product.isTop ? <Badge tone="gold" size="sm" icon="star">{t('card.top')}</Badge> : null}
                {availability ? (
                  <Badge
                    tone={product.availability === 'on-order' ? 'clay' : 'teal'}
                    size="sm"
                    icon={product.availability === 'on-order' ? 'truck' : 'check'}
                  >
                    {tr(availability.name, locale)}
                  </Badge>
                ) : null}
              </div>

              <h1 className="mt-3 font-display text-[clamp(1.5rem,4vw,2.35rem)] leading-[1.1] font-extrabold tracking-tight text-pine-900">
                {name}
              </h1>

              {/* Boshqa tillardagi nomlar — qidiruvda ham topilishi uchun */}
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12.5px] text-slate-warm-500">
                {(['uz', 'ru', 'en'] as Locale[])
                  .filter((l) => l !== locale && product.name[l])
                  .map((l) => (
                    <span key={l}>
                      <span className="font-mono uppercase">{l}:</span> {product.name[l]}
                    </span>
                  ))}
              </p>

              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-warm-700">{description}</p>

              {/* Qo'llash sohalari */}
              {product.applications.length ? (
                <div className="mt-5">
                  <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-warm-500">
                    {t('product.applications')}
                  </h2>
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {product.applications.map((a) => {
                      const app = APPLICATIONS.find((x) => x.id === a);
                      return (
                        <li key={a}>
                          <Link
                            href={`${catalogBase}?applications=${a}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-cream-300 bg-cream-50 px-3 py-1.5 text-[12.5px] font-medium text-slate-warm-700 transition hover:border-teal-500/50 hover:bg-mint-50 hover:text-teal-600"
                          >
                            {app?.color ? (
                              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: app.color }} aria-hidden />
                            ) : null}
                            {tr(app?.name, locale, a)}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              {/* Sertifikatlar / xususiyatlar */}
              {product.features.length ? (
                <div className="mt-5">
                  <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-warm-500">
                    {t('product.features')}
                  </h2>
                  <ul className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {product.features.map((f) => {
                      const feat = FEATURES.find((x) => x.id === f);
                      return (
                        <li
                          key={f}
                          className="flex items-center gap-2 rounded-xl border border-cream-200 bg-white px-3 py-2"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mint-100 text-teal-600">
                            <Icon name={featureIcons[f] ?? 'badge'} size={15} />
                          </span>
                          <span className="text-[12.5px] font-semibold leading-tight text-pine-800">
                            {tr(feat?.name, locale, f)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              {/* Afzalliklar */}
              {benefits.length ? (
                <div className="mt-6 rounded-2xl border border-cream-200 bg-cream-50/70 p-5">
                  <h2 className="font-display text-[15px] font-bold text-pine-900">{t('product.benefits')}</h2>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13.5px] leading-snug text-slate-warm-700">
                        <Icon name="check" size={15} strokeWidth={2.4} className="mt-0.5 shrink-0 text-teal-600" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {/* ---- O'ng: spetsifikatsiya + CTA ---- */}
            <aside className="lg:sticky lg:top-[5.5rem] lg:self-start">
              <div className="overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-lift">
                <div className="border-b border-cream-200 bg-pine-900 px-4 py-3 text-white">
                  <p className="font-display text-[15px] font-bold">{t('product.specs')}</p>
                  <p className="mt-0.5 font-mono text-[11.5px] text-mint-200/80">{product.sku}</p>
                </div>

                <dl className="divide-y divide-cream-200">
                  {[
                    {
                      label: t('product.dosage'),
                      value: formatDosage(product.dosage.min, product.dosage.max),
                      icon: 'drop' as IconName,
                      hint: t('product.dosageHint'),
                    },
                    { label: t('product.form'), value: tr(form?.name, locale, product.form), icon: 'flask' as IconName },
                    {
                      label: t('product.packaging'),
                      value: product.packaging.map((kg) => tr(PACKAGING.find((p) => p.kg === kg)?.name, locale, formatKg(kg))).join(' · '),
                      icon: 'package' as IconName,
                    },
                    {
                      label: t('product.shelfLife'),
                      value: t('product.shelfLifeValue', { months: product.shelfLifeMonths }),
                      icon: 'calendar' as IconName,
                    },
                    {
                      label: t('product.manufacturer'),
                      value: t('product.manufacturerValue'),
                      icon: 'factory' as IconName,
                    },
                    { label: t('product.country'), value: t('product.countryValue'), icon: 'globe' as IconName },
                    {
                      label: tr(group?.name, locale, product.group) || t('catalog.groupsTitle'),
                      value: tr(category?.name, locale, product.category),
                      icon: 'tag' as IconName,
                    },
                  ].map((row, i) => (
                    <div key={i} className="flex items-start gap-2.5 px-4 py-2.5">
                      <Icon name={row.icon} size={15} className="mt-0.5 shrink-0 text-teal-600" />
                      <dt className="w-[38%] shrink-0 text-[12px] leading-snug text-slate-warm-500">{row.label}</dt>
                      <dd className="min-w-0 flex-1 text-[12.5px] leading-snug font-semibold text-pine-900">
                        {row.value}
                        {row.hint ? <span className="mt-0.5 block text-[11px] font-normal text-slate-warm-500">{row.hint}</span> : null}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="border-t border-cream-200 bg-cream-50 px-4 py-3">
                  <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-pine-800">
                    <Icon name="tag" size={14} className="text-gold-600" />
                    {t('common.priceOnRequest')}
                  </p>
                  <p className="mt-1 text-[11.5px] leading-snug text-slate-warm-600">{t('product.priceNote')}</p>
                </div>

                <div className="border-t border-cream-200 p-4">
                  <ProductActions
                    sku={product.sku}
                    slug={product.slug}
                    name={product.name}
                    locale={locale}
                    form={product.form}
                  />
                </div>
              </div>

              {/* Saqlash shartlari */}
              <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-cream-200 bg-white p-3.5">
                <Icon name="snowflake" size={16} className="mt-0.5 shrink-0 text-teal-600" />
                <div>
                  <p className="text-[12px] font-bold text-pine-900">{t('product.storage')}</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-slate-warm-600">{storage}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ================= SO'ROV FORMASI ================= */}
      <section id="product-request" className="scroll-mt-24 border-b border-cream-200 bg-cream-100/60 py-10 lg:py-14">
        <div className="container-x grid gap-7 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
          <div>
            <h2 className="font-display text-[clamp(1.3rem,3.2vw,1.9rem)] font-extrabold tracking-tight text-pine-900">
              {t('product.askTechnologist')}
            </h2>
            <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-slate-warm-600">
              {t('product.askTechnologistHint')}
            </p>

            <LeadForm
              type="product"
              locale={locale}
              compact
              className="mt-5"
              product={{ sku: product.sku, slug: product.slug, name: product.name }}
              title={t('card.requestPrice')}
              subtitle={`${name} · ${product.sku}`}
              nextHref={`/${locale}/catalog?groups=${product.group}`}
              nextLabel={t('product.related')}
            />
          </div>

          {/* Hujjatlar + qo'shimcha ishonch */}
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-cream-200 bg-white p-5 shadow-soft">
              <h3 className="font-display text-[15px] font-bold text-pine-900">{t('product.documents')}</h3>
              <p className="mt-1.5 text-[12.5px] leading-snug text-slate-warm-600">{t('product.docsHint')}</p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {[
                  { k: 'product.docCoA', icon: 'certificate' as IconName },
                  { k: 'product.docTds', icon: 'file' as IconName },
                  { k: 'product.docMsds', icon: 'shield' as IconName },
                  { k: 'product.docHalal', icon: 'halal' as IconName },
                  { k: 'product.docDeclaration', icon: 'invoice' as IconName },
                ].map((d) => (
                  <li key={d.k} className="flex items-center gap-2.5 rounded-lg border border-cream-200 bg-cream-50 px-3 py-2">
                    <Icon name={d.icon} size={15} className="shrink-0 text-teal-600" />
                    <span className="flex-1 text-[12.5px] font-semibold text-pine-800">{t(d.k as never)}</span>
                    <Icon name="lock" size={13} className="shrink-0 text-slate-warm-400" />
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11.5px] leading-snug text-slate-warm-500">{t('product.requestDocs')}</p>
            </div>

            <div className="rounded-2xl bg-pine-900 p-5 text-white">
              <p className="font-display text-[15px] font-bold text-mint-200">{t('box.title')}</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/70">{t('box.subtitle')}</p>
              <Link
                href={`/${locale}/samples`}
                className="mt-3.5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white text-[13.5px] font-bold text-pine-900 transition hover:bg-mint-200"
              >
                <Icon name="box" size={16} />
                {t('box.cta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= O'XSHASH MAHSULOTLAR ================= */}
      {relatedCards.length ? (
        <section className="container-x py-10 lg:py-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-[clamp(1.25rem,3vw,1.7rem)] font-extrabold tracking-tight text-pine-900">
                {t('product.related')}
              </h2>
              <p className="mt-1.5 text-[13.5px] text-slate-warm-600">{t('product.relatedHint')}</p>
            </div>
            <Link
              href={`/${locale}/catalog?groups=${product.group}`}
              className="inline-flex h-9 items-center gap-1.5 self-start rounded-lg border border-pine-800/20 px-3 text-[13px] font-semibold text-pine-800 transition hover:border-teal-500 hover:text-teal-600 sm:self-auto"
            >
              {t('categories.viewAll')}
              <Icon name="arrow-right" size={14} />
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCards.map((c) => (
              <ProductCard key={c.sku} card={c} locale={locale} hrefBase={productBase} />
            ))}
          </div>
        </section>
      ) : null}

      {/* ================= JSON-LD ================= */}
      <JsonLdGroup
        items={[
          productLd(product, loc, tr(category?.name, locale, product.category)),
          breadcrumbLd(crumbs, loc),
          itemListLd(relatedCards.map((c) => ({ slug: c.slug, name: c.name })), loc, t('product.related')),
        ]}
      />

      {/* Qidiruv tizimlari uchun qo'shimcha matn (ko'rinmaydi) */}
      <span className="sr-only">
        {toCard(product, locale).blurb} · {siteConfig.brand.full} · {siteConfig.contact.phonePrimary}
      </span>
    </>
  );
}
