/**
 * FOYDALANISH SHARTLARI
 * ----------------------------------------------------------------
 * Muhim band: sayt ommaviy oferta emas — narx va mavjudlik har bir
 * so'rov bo'yicha tasdiqlanadi. Bu B2B amaliyotida standart, lekin
 * uni ochiq yozish kelgusidagi nizolarni kamaytiradi.
 */

import type { Metadata } from 'next';
import { makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { buildMetadata } from '@/lib/seo';
import { TERMS } from '@/lib/legal';
import type { Locale } from '@/lib/taxonomy';
import { LegalDocView } from '@/components/legal/LegalDocView';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  return buildMetadata({
    locale,
    title: t('legal.termsTitle'),
    description: `${t('legal.termsTitle')}: katalog maqomi, arizalar, test box shartlari, narx va to'lov, yetkazib berish, javobgarlik. Tahrir ${TERMS.updated}.`,
    path: '/terms',
    noIndex: true,
  });
}

export default async function TermsPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw) as AppLocale;
  const t = makeT(locale);

  const crumbs = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('legal.termsTitle'), href: `/${locale}/terms` },
  ];

  return (
    <LegalDocView
      doc={TERMS}
      locale={locale as Locale}
      title={t('legal.termsTitle')}
      updatedLabel={t('legal.privacyUpdated')}
      backLabel={t('legal.backToSite')}
      crumbs={crumbs}
    />
  );
}
