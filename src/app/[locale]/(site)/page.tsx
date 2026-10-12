/**
 * BOSH SAHIFA (§5, design/Main.dc.html)
 * ----------------------------------------------------------------
 * Vazifasi: 5 soniyada uchta savolga javob berish —
 *   1. Bu kim?   (GFF rasmiy va yagona distribyutori)
 *   2. Nima bor? (617 pozitsiya + bepul namuna qutisi)
 *   3. Nima qilish kerak? (namuna so'rash / narx so'rash / qo'ng'iroq)
 *
 * Bo'limlar: HERO · 01 Kompaniya · 02 Kategoriyalar · 03 Namuna qutisi ·
 *            04 Jarayon · 05 Sohalar · 06 Aloqa · Footer
 *
 * Barcha sonlar ma'lumotdan hisoblanadi (§7.1). Sahifa to'liq statik (SSG).
 */

import type { Metadata } from 'next';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { PACKAGING } from '@/lib/taxonomy';
import { buildMetadata, faqLd, homeLd } from '@/lib/seo';
import { productCount } from '@/lib/catalog';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { Hero } from '@/components/home/Hero';
import {
  AboutSection,
  CategoriesSection,
  ContactSection,
  IndustriesSection,
  ProcessSection,
  SampleBoxSection,
} from '@/components/home/sections';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  const count = productCount();

  const title = t('seo.home.title');
  const description = t('seo.home.description', { count, raw: siteConfig.stats.rawMaterials });

  return {
    ...buildMetadata({
      locale,
      title,
      description,
      path: '',
      image: '/images/og-home.jpg',
    }),
    // Bosh sahifa — saytning o'zi; shablon ("%s — GFF Uzbekistan") qo'shilmaydi
    title: { absolute: title },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const t = makeT(locale);
  const count = productCount();

  const biz = siteConfig.business;
  const packs = PACKAGING.filter((p) => [1, 5, 10, 25].includes(p.kg))
    .map((p) => p.kg)
    .join(', ');

  const faqItems = [
    { q: t('samples.faq1Q'), a: t('samples.faq1A') },
    { q: t('samples.faq2Q'), a: t('samples.faq2A', { days: biz.sampleDeliveryDays }) },
    {
      q: t('samples.faq3Q'),
      a: t('samples.faq3A', {
        moq: t('samples.moqValue', { kg: biz.minOrderKg }),
        packs: `${packs} kg`,
      }),
    },
    { q: t('samples.faq4Q'), a: t('samples.faq4A') },
    {
      q: t('samples.faq5Q'),
      a: t('samples.faq5A', { raw: siteConfig.stats.rawMaterials }),
    },
  ];

  return (
    <>
      <Hero locale={locale} t={t} tp={t.tp} productCount={count} />
      <AboutSection locale={locale} t={t} tp={t.tp} productCount={count} />
      <CategoriesSection locale={locale} t={t} productCount={count} />
      <SampleBoxSection locale={locale} t={t} />
      <ProcessSection t={t} />
      <IndustriesSection locale={locale} t={t} />
      <ContactSection locale={locale} t={t} />

      <JsonLdGroup items={[homeLd(locale), faqLd(faqItems)]} />
    </>
  );
}
