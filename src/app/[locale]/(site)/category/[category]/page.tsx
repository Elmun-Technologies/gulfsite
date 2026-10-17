/**
 * KATEGORIYA LANDING — /[locale]/category/<id> (SEO: "пищевые ароматизаторы оптом", …)
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { buildMetadata, breadcrumbLd, collectionPageLd } from '@/lib/seo';
import { CATEGORY_IMAGE } from '@/lib/design';
import { categoryIdsWithData, categoryName, fitTitle } from '@/lib/category-pages';
import type { Locale } from '@/lib/taxonomy';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { CategoryLanding, categoryLdItems } from '@/components/catalog/CategoryLanding';
import { ensureCatalog } from '@/lib/catalog-live';

interface Props {
  params: Promise<{ locale: string; category: string }>;
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
  const ids = categoryIdsWithData();
  return LOCALES.flatMap((locale) => ids.map((category) => ({ locale, category })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await ensureCatalog();
  const { locale: raw, category } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  const name = categoryName(category, locale as Locale);
  return buildMetadata({
    locale,
    title: fitTitle(t(`catseo.${category}.title` as never), name),
    description: t(`catseo.${category}.description` as never),
    path: `/category/${category}`,
    image: CATEGORY_IMAGE[category],
  });
}

export default async function CategoryPage({ params }: Props) {
  await ensureCatalog();
  const { locale: raw, category } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  if (!categoryIdsWithData().includes(category)) notFound();
  const t = makeT(locale);
  const name = categoryName(category, locale as Locale);

  return (
    <>
      <JsonLdGroup
        items={[
          breadcrumbLd(
            [
              { name: t('nav.home'), path: '/' },
              { name: t('nav.catalog'), path: '/catalog' },
              { name, path: `/category/${category}` },
            ],
            locale,
          ),
          collectionPageLd(
            locale,
            name,
            t(`catseo.${category}.description` as never),
            `/category/${category}`,
            categoryLdItems(category, null, locale),
          ),
        ]}
      />
      <CategoryLanding locale={locale} t={t} category={category} group={null} />
    </>
  );
}
