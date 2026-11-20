/**
 * GURUH LANDING — /[locale]/category/<kategoriya>/<guruh>
 * (SEO long-tail: "клубничные ароматизаторы", "цитрусовые эфирные масла", …)
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary, LOCALES, makeT, normalizeLocale, type AppLocale, type DictKey } from '@/i18n';
import { buildMetadata, breadcrumbLd, collectionPageLd } from '@/lib/seo';
import { CATEGORY_IMAGE, groupImage } from '@/lib/design';
import { categoryIdsWithData, categoryName, fitTitle, groupName, groupsFor } from '@/lib/category-pages';
import type { Locale } from '@/lib/taxonomy';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { CategoryLanding, categoryLdItems } from '@/components/catalog/CategoryLanding';
import { ensureCatalog } from '@/lib/catalog-live';

interface Props {
  params: Promise<{ locale: string; category: string; group: string }>;
}

// admin qo'shgan guruh ham sahifaga ega bo'ladi (ustida loading.tsx yo'q — haqiqiy 404)
export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  await ensureCatalog();
  return LOCALES.flatMap((locale) =>
    categoryIdsWithData().flatMap((category) =>
      groupsFor(category, 'uz').map((g) => ({ locale, category, group: g.id })),
    ),
  );
}

/**
 * Title: avval kategoriyaga xos qidiruv shakli ("Ароматизаторы «Хлеб и выпечка» оптом"),
 * sig'masa — qisqa shakli, keyin umumiy "{group} · {category}", oxiri — guruh nomi.
 * Admin qo'shgan (lug'atda matni yo'q) kategoriya uchun to'g'ridan-to'g'ri umumiy shakl.
 */
function groupMetaTitle(locale: AppLocale, category: string, grp: string, cat: string): string {
  const t = makeT(locale);
  const dict = getDictionary(locale) as unknown as Record<string, string>;
  const generic = fitTitle(t('catseo.groupTitle', { group: grp, category: cat }), grp);
  const long = `catseo.${category}.groupTitle`;
  const short = `catseo.${category}.groupTitleShort`;
  if (!(long in dict) || !(short in dict)) return generic;
  return fitTitle(t(long as DictKey, { group: grp }), fitTitle(t(short as DictKey, { group: grp }), generic));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await ensureCatalog();
  const { locale: raw, category, group } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  const L = locale as Locale;
  const cat = categoryName(category, L);
  const grp = groupName(group, L);
  const count = groupsFor(category, L).find((g) => g.id === group)?.count ?? 0;
  return buildMetadata({
    locale,
    title: groupMetaTitle(locale, category, grp, cat),
    description: t('catseo.groupDescription', { group: grp, category: cat, count }).slice(0, 155),
    path: `/category/${category}/${group}`,
    image: groupImage(group) ?? CATEGORY_IMAGE[category],
  });
}

export default async function GroupPage({ params }: Props) {
  await ensureCatalog();
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
