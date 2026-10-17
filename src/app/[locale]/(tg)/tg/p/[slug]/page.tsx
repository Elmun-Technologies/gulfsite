/**
 * MINI APP — MAHSULOT (noma'lum slug → 404; ustida loading.tsx yo'q)
 */

import { notFound } from 'next/navigation';
import { makeT, normalizeLocale } from '@/i18n';
import { getProductBySlug } from '@/lib/catalog';
import { productDescription } from '@/lib/catalog-copy';
import { ensureCatalog } from '@/lib/catalog-live';
import { categoryName } from '@/lib/category-pages';
import { productHeroImage } from '@/lib/design';
import { APPLICATIONS, FORMS, tr, type Locale } from '@/lib/taxonomy';
import { TgProductView } from '@/components/tg/TgProductView';

export const revalidate = 3600;

export default async function TgProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  await ensureCatalog();
  const { locale: raw, slug } = await params;
  const locale = normalizeLocale(raw);
  const L = locale as Locale;
  const t = makeT(locale);
  const p = getProductBySlug(slug);
  if (!p) notFound();

  const title = tr(p.name, L);
  const availability =
    p.availability === 'in-stock' ? t('product.inStock') : p.availability === 'on-order' ? t('product.onOrder') : t('product.availNew');

  return (
    <TgProductView
      locale={locale}
      sku={p.sku}
      slug={p.slug}
      name={p.name}
      title={title}
      image={p.image ?? productHeroImage(p)}
      category={categoryName(p.category, L)}
      description={p.description?.[L] || productDescription(p.category, title, p.applications, p.copyVariant, L)}
      facts={[
        { label: t('product.formLabel'), value: tr(FORMS.find((f) => f.id === p.form)?.name, L, p.form) },
        { label: t('product.dosageLabel'), value: `${p.dosage.min}–${p.dosage.max}${p.dosage.unit}` },
        { label: t('product.packLabel'), value: `${p.packaging.join(' · ')} kg` },
        { label: t('tg.details'), value: availability },
      ]}
      applications={p.applications.map((a) => tr(APPLICATIONS.find((x) => x.id === a)?.name, L, a))}
    />
  );
}
