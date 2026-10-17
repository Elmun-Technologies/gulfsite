/**
 * KATALOG (§5, design/Catalog.dc.html)
 * ----------------------------------------------------------------
 * Holat URL'da (`?categories=&groups=&q=&sort=&page=`), natija SERVERDA
 * hisoblanadi — filtrlangan sahifalar indekslanadi va ulashiladi (§13).
 *
 * Bo'limlar: Page head → Kategoriya tab'lari → Toolbar →
 *            (Filtrlar | Natijalar) → Pagination → Help strip → Footer
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata, breadcrumbLd, collectionPageLd } from '@/lib/seo';
import { countActive, productCount, queryCatalog, paramsToFilters } from '@/lib/catalog';
import {
  ALL_GROUPS,
  CATEGORIES,
  FORMS,
  tr,
  type Locale,
} from '@/lib/taxonomy';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { PageHead } from '@/components/ui/PageHead';
import { Section, SectionInset } from '@/components/ui/SectionHeader';
import { ButtonLink } from '@/components/ui/Button';
import { MonogramStatic, Reveal } from '@/components/motion';
import { CatalogExplorer, type CatalogLabels } from '@/components/catalog/CatalogExplorer';
import { ensureCatalog } from '@/lib/catalog-live';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * `true`: `false` bo'lganda admin saqlagan paytdagi revalidatsiyadan keyin
 * (revalidatePath / ISR) sahifa qayta yaratilmay `NoFallbackError` → 404
 * bo'lib qolardi (standalone, 2026-10-17 tekshirilgan). Noma'lum slug uchun
 * haqiqiy 404 — `proxy.ts` da (`catalogPathMissing`).
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  await ensureCatalog();
  return LOCALES.map((locale) => ({ locale }));
}

/** searchParams (obyekt) → URLSearchParams */
function toSearchParams(sp: Record<string, string | string[] | undefined>): URLSearchParams {
  const out = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v == null || v === '') continue;
    out.set(k, Array.isArray(v) ? v.filter(Boolean).join(',') : v);
  }
  return out;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  await ensureCatalog();
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  const sp = toSearchParams(await searchParams);
  const filters = paramsToFilters(sp);
  const result = queryCatalog(filters, locale as Locale);

  const cats = filters.categories
    .map((id) => CATEGORIES.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => tr(c!.name, locale as Locale));

  const title = cats.length
    ? `${cats.join(', ')} — ${t('nav.catalog')}`
    : t('seo.catalog.title', { count: productCount() });

  const description = filters.q.trim()
    ? t('seo.search.description', { q: filters.q.trim(), count: result.total })
    : t('seo.catalog.description');

  // Kanonik URL faqat oq ro'yxatdagi parametrlardan: kategoriya (o'z title'i
  // bor) va sahifa raqami. utm/fbclid/sort/axlat kalitlar alohida kanonik
  // yaratmaydi. Boshqa filtrlar (guruh, shakl, belgilar, qidiruv…) — noindex.
  const canon = new URLSearchParams();
  if (filters.categories.length) canon.set('categories', filters.categories.join(','));
  if (filters.page > 1) canon.set('page', String(filters.page));
  const qs = canon.toString();
  const otherFilters = countActive(filters) - (filters.categories.length ? 1 : 0);
  // Faqat bitta kategoriya (boshqa filtrsiz) — kanonik sahifa uning landing'i
  const onlyCategory = filters.categories.length === 1 && otherFilters === 0 && filters.page === 1;
  return buildMetadata({
    locale,
    title: title.slice(0, 60),
    description: description.slice(0, 155),
    path: onlyCategory ? `/category/${filters.categories[0]}` : `/catalog${qs ? `?${qs}` : ''}`,
    image: '/images/cat-flavours.jpg',
    noIndex: otherFilters > 0,
  });
}

export default async function CatalogPage({ params, searchParams }: Props) {
  await ensureCatalog();
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const L = locale as Locale;
  const t = makeT(locale);

  const sp = toSearchParams(await searchParams);
  const filters = paramsToFilters(sp);
  const result = queryCatalog(filters, L);

  const biz = siteConfig.business;
  const commoditiesOnly =
    filters.categories.length === 1 && filters.categories[0] === 'commodities' && result.total === 0;

  const groupLabels: Record<string, string> = Object.fromEntries(
    ALL_GROUPS.map((g) => [g.id, tr(g.name, L)]),
  );
  const formLabels: Record<string, string> = Object.fromEntries(FORMS.map((f) => [f.id, tr(f.name, L)]));

  const labels: CatalogLabels = {
    searchPh: t('catalog.searchPh'),
    searchAria: t('catalog.searchAria'),
    sortLabel: t('catalog.sortLabel'),
    viewLabel: t('catalog.viewLabel'),
    viewTable: t('catalog.viewTable'),
    viewCards: t('catalog.viewGrid'),
    filtersBtn: t('catalog.filtersBtn'),
    filtersClose: t('catalog.filtersClose'),
    filtersApplyTpl: t.raw('catalog.filtersApply'),
    reset: t('common.resetFilters'),
    toBox: t('catalog.toBox'),
    boxLineTpl: t.raw('catalog.sampleBar'),
    resultLineTpl: t.raw('catalog.resultLine'),
    emptyTitle: t('catalog.empty.title'),
    emptyText: t('catalog.empty.text'),
    emptyCta: t('catalog.empty.cta'),
    showMore: t('catalog.showMore'),
    pagination: t('catalog.pagination'),
    colProduct: t('catalog.col.product'),
    colGroup: t('catalog.col.group'),
    colForm: t('catalog.col.form'),
    colDose: t('catalog.col.dose'),
    colStock: t('catalog.col.stock'),
    colSample: t('catalog.col.sample'),
    inStock: t('product.inStock'),
    onOrder: t('product.onOrder'),
    availabilityNew: t('product.availNew'),
    add: {
      add: t('catalog.addSample'),
      added: t('catalog.addedSample'),
      remove: t('catalog.removeSample'),
      fullTpl: t.raw('samples.boxFullToast'),
    },
    facetLabels: {
      all: t('common.showAll'),
      tabs: t('catalog.tabsLabel'),
      groups: t('catalog.facet.group'),
      forms: t('catalog.facet.form'),
      features: t('catalog.facet.feature'),
      applications: t('catalog.facet.application'),
      availability: t('catalog.facet.availability'),
      noResults: t('catalog.noResults.title'),
      noResultsHint: t('catalog.noResults.text'),
      'sort:popular': t('catalog.sort.popularity'),
      'sort:name-asc': t('catalog.sort.nameAsc'),
      'sort:name-desc': t('catalog.sort.nameDesc'),
      'sort:new': t('catalog.sort.newest'),
    },
  };

  const crumbs = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('nav.catalog') },
  ];

  return (
    <>
      <PageHead
        title={t('nav.catalog')}
        count={productCount()}
        text={t('catalog.head.text')}
        crumbs={crumbs}
        crumbLabel={t('nav.catalog')}
        actions={
          <>
            {/* elektron katalog (flipbook + PDF yuklab olish) */}
            <ButtonLink
              href={`/${locale}/brochure`}
              variant="accent"
              size="md"
              icon={<BookOpen size={18} strokeWidth={1.8} aria-hidden />}
            >
              {t('nav.brochure')}
            </ButtonLink>
            <ButtonLink href={`/${locale}/contact`} variant="primary" size="md">
              {t('catalog.askTech')}
            </ButtonLink>
          </>
        }
      />

      <CatalogExplorer
        locale={L}
        cards={result.cards}
        facets={result.facets}
        total={result.total}
        page={result.page}
        totalPages={result.totalPages}
        pageSize={result.pageSize}
        labels={labels}
        boxHref={`/${locale}/samples`}
        contactHref={`/${locale}/contact`}
        productHrefBase={`/${locale}/catalog`}
        sampleDays={biz.sampleDeliveryDays}
        commoditiesOnly={commoditiesOnly}
        groupLabels={groupLabels}
        formLabels={formLabels}
      />

      {/* ---------- HELP STRIP ---------- */}
      <Section className="pb-4 pt-[clamp(64px,7vw,96px)]">
        <Reveal
          data-surface="navy"
          className="flex flex-wrap items-center justify-between gap-8 rounded-block bg-navy p-[clamp(28px,4vw,56px)] text-white"
        >
          <div className="flex flex-[1_1_520px] items-center gap-7">
            <MonogramStatic
              variant="joy"
              alt={t('monogram.alt.joy')}
              width={88}
              sizes="88px"
              className="h-[88px] w-auto shrink-0"
            />
            <div className="flex flex-col gap-2.5">
              <span className="text-[clamp(30px,3vw,44px)] font-normal leading-[1.05] tracking-[-0.03em]">
                {t('catalog.help.title')}
              </span>
              <span className="text-[16px] leading-[1.55] text-on-navy">
                {t('catalog.help.text', { raw: siteConfig.stats.rawMaterials })}
              </span>
            </div>
          </div>
          <ButtonLink href={`/${locale}/contact`} variant="accent" size="lg" arrow className="shrink-0">
            {t('catalog.help.cta')}
          </ButtonLink>
        </Reveal>
      </Section>

      {/* Kategoriyalarga tezkor havolalar (SEO ichki linklar) */}
      <Section className="pb-4 pt-8">
        <SectionInset>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/${locale}/catalog?categories=${c.id}`}
                className="cert-pill no-underline hover:border-ink"
              >
                {tr(c.name, L, c.id)}
              </Link>
            ))}
          </div>
        </SectionInset>
      </Section>

      <JsonLdGroup
        items={[
          breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href ?? `/${locale}/catalog` })), locale),
          collectionPageLd(
            locale,
            t('nav.catalog'),
            t('seo.catalog.description'),
            `/${locale}/catalog`,
            result.cards.map((c) => ({ slug: c.slug, name: c.name })),
          ),
        ]}
      />
    </>
  );
}
