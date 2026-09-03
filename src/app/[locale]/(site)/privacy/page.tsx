/**
 * MAXFIYLİK SIYOSATI
 * ----------------------------------------------------------------
 * B2B mijozlar (ayniqsa yirik ishlab chiqaruvchilar) zayvka yuborishdan
 * oldin ma'lumotlar qanday qayta ishlanishini tekshiradi. Shuning uchun
 * bu sahifa ancha batafsil: bo'limlar, ankorlar, jadval va chop etish.
 *
 * Matn `src/lib/legal.ts` da — u uch tilda va config'dan qiymat oladi.
 */

import type { Metadata } from 'next';
import { makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { buildMetadata } from '@/lib/seo';
import { PRIVACY } from '@/lib/legal';
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
    title: t('legal.privacyTitle'),
    description: `${t('legal.privacyTitle')}: ${t('legal.privacyUpdated')} ${PRIVACY.updated}. Shaxsiy ma'lumotlarni qayta ishlash, saqlash muddatlari va sizning huquqlaringiz.`,
    path: '/privacy',
    noIndex: true,
  });
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw) as AppLocale;
  const t = makeT(locale);

  const crumbs = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('legal.privacyTitle'), href: `/${locale}/privacy` },
  ];

  return (
    <LegalDocView
      doc={PRIVACY}
      locale={locale as Locale}
      title={t('legal.privacyTitle')}
      updatedLabel={t('legal.privacyUpdated')}
      backLabel={t('legal.backToSite')}
      crumbs={crumbs}
    />
  );
}
