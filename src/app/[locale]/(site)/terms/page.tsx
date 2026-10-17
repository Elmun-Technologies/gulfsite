/**
 * FOYDALANISH SHARTLARI (§5 · design/Privacy.dc.html tuzilmasi)
 * ----------------------------------------------------------------
 * Matn manbai — `lib/legal.ts` → `TERMS`. Vizual — `LegalPage`
 * (privacy bilan bir xil, shuning uchun ikki sahifa bir-biriga mos).
 *
 * Muhim band: sayt ommaviy oferta emas — narx va mavjudlik har bir
 * so'rov bo'yicha tasdiqlanadi (B2B amaliyoti, `lib/legal.ts`).
 */

import type { Metadata } from 'next';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { buildMetadata, breadcrumbLd } from '@/lib/seo';
import { TERMS } from '@/lib/legal';
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
    title: t('legal.termsTitle'),
    description: t('seo.terms.description'),
    path: '/terms',
    noIndex: true,
  });
}

export default async function TermsPage({ params }: Props) {
  await ensureCatalog();
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const t = makeT(locale);

  const crumbs = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('legal.termsTitle') },
  ];

  return (
    <>
      <JsonLdGroup
        items={[breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href ?? '/terms' })), locale)]}
      />

      <LegalPage
        doc={TERMS}
        locale={locale}
        title={t('legal.termsTitle')}
        crumbs={crumbs}
        labels={{
          toc: t('privacy.toc'),
          updated: (date) => t('privacy.updated', { date }),
          question: t('privacy.question'),
          contactCta: t('nav.contact'),
          homeCrumb: t('nav.home'),
          otherDoc: { href: `/${locale}/privacy`, label: t('nav.privacy') },
        }}
      />
    </>
  );
}
