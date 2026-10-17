/**
 * KATEGORIYA / GURUH LANDING SAHIFASI (server komponent, SEO)
 * ----------------------------------------------------------------
 * Bitta H1, kalit so'zli kirish matni, guruhlar va qo'llanish sohalari
 * (ichki havolalar), mahsulotlar jadvali, CTA. Sonlar ma'lumotdan (§7.1).
 */

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import type { AppLocale, Translator } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { queryCatalog } from '@/lib/catalog';
import { CATEGORY_IMAGE, groupImage } from '@/lib/design';
import { FEATURES, FORMS, tr, type Locale } from '@/lib/taxonomy';
import { categoryName, groupName, groupsFor, topApplications } from '@/lib/category-pages';
import { industryIds } from '@/lib/industry-copy';
import { applicationCounts } from '@/lib/catalog';
import { Breadcrumbs } from '@/components/ui/PageHead';
import { Section } from '@/components/ui/SectionHeader';
import { ButtonLink } from '@/components/ui/Button';
import { IndustryProductsTable } from '@/components/industry/IndustryProducts';

export function CategoryLanding({
  locale,
  t,
  category,
  group,
}: {
  locale: AppLocale;
  t: Translator;
  category: string;
  group: string | null;
}) {
  const L = locale as Locale;
  const catLabel = categoryName(category, L);
  const groupLabel = group ? groupName(group, L) : null;
  const result = queryCatalog({ categories: [category], groups: group ? [group] : [], sort: 'popular' }, L, 400);
  const groups = groupsFor(category, L);
  const counts = applicationCounts();
  const withPage = new Set(industryIds().filter((id) => (counts[id] ?? 0) > 0));
  const apps = topApplications(category, group, L).filter((a) => withPage.has(a.id));
  const formLabels = Object.fromEntries(FORMS.map((f) => [f.id, tr(f.name, L)]));
  const featureLabels = Object.fromEntries(FEATURES.map((f) => [f.id, tr(f.name, L)]));
  const image = (group ? groupImage(group) : null) ?? CATEGORY_IMAGE[category] ?? '/images/lab.jpg';

  const intro = group
    ? t('catseo.groupIntro', {
        group: groupLabel ?? '',
        category: catLabel,
        count: result.total,
        max: siteConfig.business.sampleBoxMaxItems,
      })
    : t(`catseo.${category}.intro` as never);

  const crumbs = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('nav.catalog'), href: `/${locale}/catalog` },
    group ? { label: catLabel, href: `/${locale}/category/${category}` } : { label: catLabel },
    ...(group ? [{ label: groupLabel ?? group }] : []),
  ];

  return (
    <>
      {/* ============ SARLAVHA ============ */}
      <Section gap={false} className="flex flex-wrap items-stretch gap-3 pt-4">
        <div className="flex min-w-0 flex-[1.4_1_520px] flex-col gap-5 rounded-block bg-panel p-[clamp(24px,4vw,56px)]">
          <Breadcrumbs items={crumbs} label={t('nav.catalog')} />
          <h1 className="m-0 text-h2 font-normal">{groupLabel ? `${groupLabel} · ${catLabel}` : catLabel}</h1>
          <p className="m-0 max-w-[680px] text-body-l leading-relaxed text-body">{intro}</p>
          <div className="flex flex-wrap gap-2">
            <span className="cert-pill">{t('catseo.positions', { count: result.total })}</span>
            <Link
              href={`/${locale}/catalog?categories=${category}${group ? `&groups=${group}` : ''}`}
              className="cert-pill no-underline hover:border-ink"
            >
              {t('catseo.allInCatalog')}
            </Link>
          </div>
        </div>
        <div className="relative min-h-[260px] flex-[1_1_320px] overflow-hidden rounded-block">
          <Image src={image} alt={groupLabel ?? catLabel} fill priority sizes="(max-width: 900px) 100vw, 40vw" className="object-cover" />
        </div>
      </Section>

      {/* ============ GURUHLAR (ichki havolalar) ============ */}
      {groups.length > 1 ? (
        <Section gap={false} className="pt-8">
          <h2 className="label m-0 pb-3">{t('catseo.groups')}</h2>
          <div className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <Link
                key={g.id}
                href={`/${locale}/category/${category}/${g.id}`}
                aria-current={g.id === group ? 'page' : undefined}
                className={
                  g.id === group
                    ? 'cert-pill border-navy bg-navy text-white no-underline'
                    : 'cert-pill no-underline hover:border-ink'
                }
              >
                {g.label} <span className="opacity-60">· {g.count}</span>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      {/* ============ QO'LLANISH SOHALARI ============ */}
      {apps.length ? (
        <Section gap={false} className="pt-6">
          <h2 className="label m-0 pb-3">{t('catseo.apps')}</h2>
          <div className="flex flex-wrap gap-2">
            {apps.map((a) => (
              <Link key={a.id} href={`/${locale}/industries/${a.id}`} className="cert-pill no-underline hover:border-ink">
                {a.label}
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      {/* ============ MAHSULOTLAR ============ */}
      <Section gap={false} className="pt-10">
        <h2 className="m-0 pb-6 text-[clamp(26px,2.6vw,36px)] font-normal tracking-[-0.02em]">
          {t('catseo.products')} <span className="text-muted">· {result.total}</span>
        </h2>
        <IndustryProductsTable
          cards={result.cards}
          locale={L}
          productHrefBase={`/${locale}/catalog`}
          formLabels={formLabels}
          featureLabels={featureLabels}
          labels={{
            colProduct: t('catalog.col.product'),
            colForm: t('catalog.col.form'),
            colDose: t('catalog.col.dose'),
            colFeature: t('catalog.facet.feature'),
            colSample: t('catalog.col.sample'),
            openProduct: t('catalog.openProduct'),
            tableCaption: groupLabel ?? catLabel,
            add: t('catalog.addSample'),
            added: t('catalog.addedSample'),
            remove: t('catalog.removeSample'),
            fullTpl: t.raw('samples.boxFullToast'),
          }}
        />
      </Section>

      {/* ============ CTA ============ */}
      <Section>
        <div
          data-surface="navy"
          className="flex flex-wrap items-center justify-between gap-6 rounded-block bg-navy p-[clamp(28px,4vw,56px)] text-white"
        >
          <span className="max-w-[560px] text-[clamp(24px,2.6vw,36px)] font-normal leading-[1.15] tracking-[-0.02em]">
            {t('brochure.ctaText')}
          </span>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={`/${locale}/samples`} variant="accent" size="lg">
              {t('brochure.sampleCta')}
              <ArrowRight size={18} strokeWidth={2} aria-hidden />
            </ButtonLink>
            <ButtonLink href={`/${locale}/brochure`} variant="onNavy" size="lg">
              <BookOpen size={18} strokeWidth={1.8} aria-hidden />
              {t('nav.brochure')}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}

export function categoryLdItems(category: string, group: string | null, locale: AppLocale) {
  return queryCatalog({ categories: [category], groups: group ? [group] : [] }, locale as Locale, 50).cards.map((c) => ({
    slug: c.slug,
    name: c.name,
  }));
}
