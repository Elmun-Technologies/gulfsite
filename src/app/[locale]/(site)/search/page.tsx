/**
 * QIDIRUV (§5, design/Search.dc.html)
 * ----------------------------------------------------------------
 * `/search?q=…` — natija SERVERDA hisoblanadi (`queryCatalog({q})` +
 * soha nomlari bo'yicha moslik), shuning uchun URL ulashiladi va
 * indekslanadi (§13). Qidiruv maydoni URL'ni debounce bilan yangilaydi.
 *
 * Bo'limlar:
 *   SEARCH HEAD — breadcrumb · katta kapsula input · "Ko'p qidiriladi"
 *   RESULTS     — xulosa H1 + tur tab'lari (Hammasi/Mahsulotlar/Sohalar)
 *                 · MAHSULOTLAR qatorlari · SOHALAR chip'lari
 *   EMPTY       — "Hech narsa topilmadi" + texnolog CTA
 *   FOOTER CTA  — "To'liq katalog — N" · "Bepul namuna qutisi"
 *
 * Qidiruv so'zli sahifa `noindex` (§13) — duplikat kontent emas.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata, breadcrumbLd } from '@/lib/seo';
import { applicationCounts, productCount, queryCatalog } from '@/lib/catalog';
import {
  ALL_GROUPS,
  APPLICATIONS,
  CATEGORIES,
  FORMS,
  sortTaxons,
  tr,
  type Locale,
} from '@/lib/taxonomy';
import { searchKey } from '@/lib/search';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { Section } from '@/components/ui/SectionHeader';
import { Breadcrumbs } from '@/components/ui/PageHead';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/motion';
import { SearchInput } from '@/components/search/SearchInput';
import { AddSampleButton } from '@/components/catalog/AddSampleButton';

const PRODUCT_LIMIT = 30;

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q.trim().slice(0, 60) : '';

  if (!q) {
    return buildMetadata({ locale, title: t('search.headTitle'), path: '/search', noIndex: true });
  }

  const result = queryCatalog({ q }, locale as Locale, PRODUCT_LIMIT);
  return buildMetadata({
    locale,
    title: t('seo.search.title', { q }),
    description: t('seo.search.description', { q, count: result.total }),
    path: `/search?q=${encodeURIComponent(q)}`,
    noIndex: true,
  });
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const L = locale as Locale;
  const t = makeT(locale);

  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q.trim() : '';
  const tab = typeof sp.tab === 'string' && ['products', 'industries'].includes(sp.tab) ? sp.tab : 'all';

  const result = q ? queryCatalog({ q }, L, PRODUCT_LIMIT) : null;
  const products = result?.cards ?? [];
  const industries = q ? matchIndustries(q, L) : [];
  const total = products.length + industries.length;

  const catLabels = Object.fromEntries(CATEGORIES.map((c) => [c.id, tr(c.name, L)]));
  const formLabels = Object.fromEntries(FORMS.map((f) => [f.id, tr(f.name, L)]));

  /* ---- "Ko'p qidiriladi" — MA'LUMOTDAN (eng katta guruhlar) ---- */
  const popular = sortTaxons([...ALL_GROUPS])
    .map((g) => ({ label: tr(g.name, L), q: tr(g.name, 'en'), count: 0 }))
    .slice(0, 6);

  const showProducts = tab !== 'industries';
  const showIndustries = tab !== 'products';

  const tabs = [
    { id: 'all', label: t('search.tabAll'), count: total },
    { id: 'products', label: t('search.tabProducts'), count: products.length },
    { id: 'industries', label: t('search.tabIndustries'), count: industries.length },
  ];

  return (
    <>
      <JsonLdGroup
        items={[
          breadcrumbLd(
            [
              { name: t('nav.home'), path: '/' },
              { name: t('search.headTitle'), path: '/search' },
            ],
            locale,
          ),
        ]}
      />

      {/* ============ SEARCH HEAD ============ */}
      <Section gap={false} className="pt-2">
        <Reveal className="flex flex-col gap-7 rounded-block bg-panel p-[clamp(28px,4vw,56px)]">
          <Breadcrumbs
            label={t('search.headTitle')}
            items={[{ label: t('nav.home'), href: `/${locale}` }, { label: t('search.headTitle') }]}
          />

          <h1 className="sr-only">{t('search.headTitle')}</h1>

          <SearchInput
            initialQuery={q}
            resultsCount={total}
            popular={popular}
            labels={{
              aria: t('search.inputAria'),
              placeholder: t('search.inputPh'),
              clear: t('search.clear'),
              popular: t('search.popular'),
            }}
          />
        </Reveal>
      </Section>

      {/* ============ RESULTS ============ */}
      <Section gap={false} className="pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 px-2 pb-6">
          <h2 className="m-0 text-[clamp(28px,3vw,44px)] font-normal tracking-[-0.03em]">
            {q ? t('search.summary', { q, count: total }) : t('search.summaryEmpty')}
          </h2>

          {q ? (
            <div
              role="tablist"
              aria-label={t('search.headTitle')}
              className="no-scrollbar flex gap-2 overflow-x-auto"
            >
              {tabs.map((x) => (
                <Link
                  key={x.id}
                  role="tab"
                  aria-selected={tab === x.id}
                  href={`/${locale}/search?q=${encodeURIComponent(q)}${x.id === 'all' ? '' : `&tab=${x.id}`}`}
                  className={`flex h-10 shrink-0 items-center gap-2 rounded-pill px-4 text-[14px] font-medium no-underline transition-colors ${
                    tab === x.id ? 'bg-navy text-white' : 'border border-line bg-white text-ink hover:border-ink'
                  }`}
                >
                  {x.label}
                  <span className={tab === x.id ? 'text-copper-light' : 'text-muted'}>{x.count}</span>
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {q && total === 0 ? (
          /* ---- bo'sh natija ---- */
          <Reveal className="flex flex-col items-center gap-5 rounded-block border border-dashed border-line px-6 py-16 text-center">
            <span className="text-[clamp(26px,3vw,40px)] font-normal tracking-[-0.02em]">
              {t('search.emptyTitle')}
            </span>
            <p className="m-0 max-w-[560px] text-body-l text-muted">
              {t('search.emptyText', { raw: siteConfig.stats.rawMaterials })}
            </p>
            <ButtonLink href={`/${locale}/contact`} variant="accent" size="lg" className="mt-2">
              {t('industries.writeTech')}
              <ArrowUpRight size={18} aria-hidden />
            </ButtonLink>
          </Reveal>
        ) : null}

        {q && total > 0 ? (
          <div className="flex flex-col gap-8">
            {/* ---- MAHSULOTLAR ---- */}
            {showProducts && products.length ? (
              <div className="flex flex-col gap-2.5">
                <span className="label px-2">{t('search.tabProducts')}</span>
                {products.map((c, i) => (
                  <Reveal
                    key={c.sku}
                    y={12}
                    delay={Math.min(i, 7) * 0.04}
                    className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-media bg-panel py-[18px] pl-[28px] pr-[18px]"
                  >
                    <Link
                      href={`/${locale}/catalog/${c.slug}`}
                      className="flex min-w-0 flex-[1_1_280px] flex-col gap-1 text-ink no-underline hover:text-copper-dark"
                    >
                      <span className="text-[20px] font-semibold">{tr(c.name, L)}</span>
                      <span className="text-[14px] text-muted">
                        {c.sku} · {catLabels[c.category] ?? c.category}
                      </span>
                    </Link>

                    <span className="flex items-center gap-5 text-[15px] text-body">
                      <span>{formLabels[c.form] ?? c.form}</span>
                      <span className="whitespace-nowrap">
                        {c.dosageMin}–{c.dosageMax}%
                      </span>
                      <AddSampleButton
                        product={c}
                        locale={L}
                        source="search"
                        labels={{
                          add: t('catalog.addSample'),
                          added: t('catalog.addedSample'),
                          remove: t('catalog.removeSample'),
                          fullTpl: t.raw('samples.boxFullToast'),
                        }}
                      />
                    </span>
                  </Reveal>
                ))}

                {result && result.total > products.length ? (
                  <Link
                    href={`/${locale}/catalog?q=${encodeURIComponent(q)}`}
                    className="btn btn--outline btn--md mt-1 self-start"
                  >
                    {t('catalog.showMore')} · {result.total}
                    <ArrowUpRight size={18} aria-hidden />
                  </Link>
                ) : null}
              </div>
            ) : null}

            {/* ---- SOHALAR ---- */}
            {showIndustries && industries.length ? (
              <div className="flex flex-col gap-3">
                <span className="label px-2">{t('search.tabIndustries')}</span>
                <div className="flex flex-wrap gap-2">
                  {industries.map((ind) => (
                    <Link
                      key={ind.id}
                      href={`/${locale}/industries/${ind.id}`}
                      className="flex items-center gap-2 rounded-pill border border-line bg-white px-4 py-2.5 text-[15px] text-ink no-underline transition-colors hover:border-ink"
                    >
                      {ind.label}
                      <span className="text-muted">{ind.count}</span>
                      <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Section>

      {/* ============ FOOTER CTA ============ */}
      <Section gap={false} className="flex flex-wrap gap-3 pb-6 pt-10">
        <Reveal className="flex min-h-[140px] flex-[1.4_1_420px] items-center justify-between gap-4 rounded-block bg-navy px-[clamp(24px,3vw,40px)] text-white">
          <span className="text-[clamp(22px,2.2vw,32px)] font-normal tracking-[-0.02em]">
            {t('search.fullCatalog', { count: productCount() })}
          </span>
          <Link
            href={`/${locale}/catalog`}
            className="btn-icon btn-icon--white btn-icon--44 shrink-0"
            aria-label={t('nav.catalog')}
          >
            <ArrowUpRight size={18} strokeWidth={2} aria-hidden />
          </Link>
        </Reveal>

        <Reveal
          delay={0.06}
          y={20}
          className="flex min-h-[140px] flex-1 basis-[300px] items-center justify-between gap-4 rounded-block bg-copper px-[clamp(24px,3vw,40px)]"
        >
          <span className="text-[clamp(22px,2.2vw,32px)] font-normal tracking-[-0.02em]">
            {t('search.sampleBox')}
          </span>
          <Link
            href={`/${locale}/samples`}
            className="btn-icon btn-icon--navy btn-icon--44 shrink-0"
            aria-label={t('nav.samples')}
          >
            <ArrowUpRight size={18} strokeWidth={2} aria-hidden />
          </Link>
        </Reveal>
      </Section>
    </>
  );
}

/* ---------------- soha mosligi ---------------- */

interface IndustryHit {
  id: string;
  label: string;
  count: number;
}

/**
 * Soha nomi bo'yicha moslik (3 tildagi nom + id), lotin/kirill
 * normalizatsiyasi bilan (`searchKey`). Son — MA'LUMOTDAN: shu sohada
 * nechta pozitsiya bor (§7.1).
 */
function matchIndustries(q: string, locale: Locale): IndustryHit[] {
  const needle = searchKey(q);
  if (needle.length < 2) return [];

  const counts = applicationCounts();

  return sortTaxons([...APPLICATIONS])
    .filter((a) => [a.name.uz, a.name.ru, a.name.en, a.id].some((v) => searchKey(v).includes(needle)))
    .map((a) => ({
      id: a.id,
      label: tr(a.name, locale),
      count: counts[a.id] ?? 0,
    }))
    .filter((x) => x.count > 0);
}
