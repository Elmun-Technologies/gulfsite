/**
 * ADMIN — MAHSULOTLAR: katalogni boshqarish (qo'shish, tahrirlash, yashirish,
 * rasm, tavsif), kategoriya va guruhlar. O'zgarishlar fly'dagi tuzatmalar
 * faylida (`lib/catalog-live.ts`), sayt 1 daqiqa ichida yangilanadi.
 */

import { redirect } from 'next/navigation';
import { normalizeLocale } from '@/i18n';
import { requireAdmin } from '@/lib/guard';
import { adminCatalogCopy } from '@/lib/admin-catalog-copy';
import { siteConfig } from '@/lib/config';
import { CatalogManager } from '@/components/admin/CatalogManager';
import { adminCatalogSnapshot } from '@/lib/catalog-admin';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!(await requireAdmin())) redirect(`/${normalizeLocale(raw)}/admin/login`);
  const locale = normalizeLocale(raw);
  // sayt alohida domenda (Vercel) bo'lsa — "Saytda ochish" o'sha yerga
  const siteUrl = ((process.env.FRONTEND_URL ?? '').trim() || siteConfig.url).replace(/\/+$/, '');

  return <CatalogManager initial={adminCatalogSnapshot()} copy={adminCatalogCopy(locale)} locale={locale} siteUrl={siteUrl} />;
}
