/**
 * ESKI MAHSULOT URL'I → 301
 * ----------------------------------------------------------------
 * Detal sahifa endi katalog ichida yashaydi (`/<locale>/catalog/<slug>`,
 * §13.3 — bitta kanonik URL). Indekslangan eski havolalar yo'qolmasligi
 * uchun bu marshrut doimiy yo'naltirish bo'lib qoladi; `sitemap.ts` esa
 * faqat yangi manzilni chiqaradi.
 */

import { permanentRedirect } from 'next/navigation';
import { LOCALES, normalizeLocale } from '@/i18n';
import { allProducts } from '@/lib/catalog';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => allProducts().map((p) => ({ locale, slug: p.slug })));
}

export default async function LegacyProductRedirect({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  permanentRedirect(`/${normalizeLocale(locale)}/catalog/${slug}`);
}
