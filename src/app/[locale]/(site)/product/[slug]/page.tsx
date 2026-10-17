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
import { ensureCatalog } from '@/lib/catalog-live';

/**
 * `true`: `false` bo'lganda admin saqlagan paytdagi revalidatsiyadan keyin
 * (revalidatePath / ISR) sahifa qayta yaratilmay `NoFallbackError` → 404
 * bo'lib qolardi (standalone, 2026-10-17 tekshirilgan). Noma'lum slug uchun
 * haqiqiy 404 — `proxy.ts` da (`catalogPathMissing`).
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  await ensureCatalog();
  return LOCALES.flatMap((locale) => allProducts().map((p) => ({ locale, slug: p.slug })));
}

export default async function LegacyProductRedirect({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  await ensureCatalog();
  const { locale, slug } = await params;
  permanentRedirect(`/${normalizeLocale(locale)}/catalog/${slug}`);
}
