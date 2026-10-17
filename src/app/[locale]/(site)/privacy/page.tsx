/**
 * MAXFIYLIK SIYOSATI (§5, design/Privacy.dc.html · §11.5, §15)
 * ----------------------------------------------------------------
 * Matn manbai — `lib/legal.ts` → `PRIVACY` (uch tilda, ankorli
 * bo'limlar). Vizual — `LegalPage` (yangi dizayn).
 *
 * ⚠ Matn O'zbekiston qonunchiligiga (ZRU-547) muvofiqlashtirilgan
 *   bo'lsa-da, ishga tushirishdan oldin yurist tasdiqlashi shart
 *   (§15) — bu sahifada ochiq yozilgan.
 */

import type { Metadata } from 'next';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { buildMetadata, breadcrumbLd } from '@/lib/seo';
import { PRIVACY } from '@/lib/legal';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { LegalPage } from '@/components/legal/LegalPage';
import { ensureCatalog } from '@/lib/catalog-live';

interface Props {
  params: Promise<{ locale: string }>;
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await ensureCatalog();
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);

  return buildMetadata({
    locale,
    title: t('seo.privacy.title'),
    description: t('seo.privacy.description'),
    path: '/privacy',
  });
}

export default async function PrivacyPage({ params }: Props) {
  await ensureCatalog();
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const t = makeT(locale);

  const crumbs = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('nav.privacy') },
  ];

  return (
    <>
      <JsonLdGroup
        items={[breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href ?? '/privacy' })), locale)]}
      />

      <LegalPage
        doc={PRIVACY}
        locale={locale}
        title={t('nav.privacy')}
        crumbs={crumbs}
        labels={{
          toc: t('privacy.toc'),
          updated: (date) => t('privacy.updated', { date }),
          question: t('privacy.question'),
          contactCta: t('nav.contact'),
          homeCrumb: t('nav.home'),
          draftNote: t('privacy.draftNote'),
          otherDoc: { href: `/${locale}/terms`, label: t('nav.terms') },
        }}
      />
    </>
  );
}
