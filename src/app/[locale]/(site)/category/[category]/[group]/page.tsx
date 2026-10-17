/**
 * GURUH LANDING — /[locale]/category/<kategoriya>/<guruh>
 * (SEO long-tail: "клубничные ароматизаторы", "цитрусовые эфирные масла", …)
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { buildMetadata, breadcrumbLd, collectionPageLd } from '@/lib/seo';
import { CATEGORY_IMAGE, groupImage } from '@/lib/design';
import { categoryIdsWithData, categoryName, fitTitle, groupName, groupsFor } from '@/lib/category-pages';
import type { Locale } from '@/lib/taxonomy';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { CategoryLanding, categoryLdItems } from '@/components/catalog/CategoryLanding';

interface Props {
  params: Promise<{ locale: string; category: string; group: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    categoryIdsWithData().flatMap((category) =>
      groupsFor(category, 'uz').map((g) => ({ locale, category, group: g.id })),
    ),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, category, group } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  const L = locale as Locale;
  const cat = categoryName(category, L);
  const grp = groupName(group, L);
  const count = groupsFor(category, L).find((g) => g.id === group)?.count ?? 0;
  return buildMetadata({
    locale,
    title: fitTitle(t('catseo.groupTitle', { group: grp, category: cat }), grp),
    description: t('catseo.groupDescription', { group: grp, category: cat, count }).slice(0, 155),
    path: `/category/${category}/${group}`,
    image: groupImage(group) ?? CATEGORY_IMAGE[category],
  });
}

export default async function GroupPage({ params }: Props) {
  const { locale: raw, category, group } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const L = locale as Locale;
  if (!groupsFor(category, L).some((g) => g.id === group)) notFound();
  const t = makeT(locale);
  const cat = categoryName(category, L);
  const grp = groupName(group, L);
  const count = groupsFor(category, L).find((g) => g.id === group)?.count ?? 0;

  return (
    <>
      <JsonLdGroup
        items={[
          breadcrumbLd(
            [
              { name: t('nav.home'), path: '/' },
              { name: t('nav.catalog'), path: '/catalog' },
              { name: cat, path: `/category/${category}` },
              { name: grp, path: `/category/${category}/${group}` },
            ],
            locale,
          ),
          collectionPageLd(
            locale,
            `${grp} · ${cat}`,
            t('catseo.groupDescription', { group: grp, category: cat, count }),
            `/category/${category}/${group}`,
            categoryLdItems(category, group, locale),
          ),
        ]}
      />
      <CategoryLanding locale={locale} t={t} category={category} group={group} />
    </>
  );
}
