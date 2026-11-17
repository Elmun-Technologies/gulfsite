/**
 * BLOG — maqolalar ro'yxati (SEO kontent markazi, `lib/blog.ts`)
 * ----------------------------------------------------------------
 * Faqat UZ va RU. EN uchun sahifa yo'q (dublikat zaxira yaratilmaydi) —
 * noma'lum til/slug uchun haqiqiy 404 `proxy.ts` → `catalogPathMissing()` da.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { buildMetadata, breadcrumbLd, linkListLd } from '@/lib/seo';
import { BLOG_LOCALES, blogArticles, blogText, hasBlog } from '@/lib/blog';
import type { Locale } from '@/lib/taxonomy';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { PageHead } from '@/components/ui/PageHead';
import { Section } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/motion';

interface Props {
  params: Promise<{ locale: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return LOCALES.filter(hasBlog).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  return buildMetadata({
    locale,
    title: t('blog.seoTitle'),
    description: t('blog.seoDescription'),
    path: '/blog',
    languages: [...BLOG_LOCALES],
    noIndex: !hasBlog(locale),
  });
}

function formatDate(iso: string, locale: AppLocale): string {
  return new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'uz-Latn-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  if (!hasBlog(locale)) notFound();
  const t = makeT(locale);
  const L = locale as Locale;

  const articles = blogArticles(locale)
    .slice()
    .sort((a, b) => b.published.localeCompare(a.published));
  const crumbs = [{ label: t('nav.home'), href: `/${locale}` }, { label: t('nav.blog') }];

  return (
    <>
      <JsonLdGroup
        items={[
          breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href ?? '/blog' })), locale),
          linkListLd(
            articles.map((a) => ({ path: `/blog/${a.slug}`, name: blogText(a, L).title })),
            locale,
            t('blog.title'),
          ),
        ]}
      />

      <PageHead title={t('blog.title')} text={t('blog.intro')} crumbs={crumbs} crumbLabel={t('nav.blog')} />

      <Section className="grid gap-3 md:grid-cols-2">
        {articles.map((a, i) => {
          const x = blogText(a, L);
          return (
            <Reveal key={a.slug} index={i}>
              <Link
                href={`/${locale}/blog/${a.slug}`}
                className="group flex h-full flex-col gap-4 rounded-card border border-line bg-white p-[clamp(24px,2.6vw,36px)] no-underline transition-colors hover:border-copper"
              >
                <span className="text-[13px] text-muted">{formatDate(a.published, locale)}</span>
                <h2 className="m-0 text-h4 font-medium text-ink">{x.title}</h2>
                <p className="m-0 text-body-l leading-relaxed text-body">{x.description}</p>
                <span className="mt-auto flex items-center gap-2 pt-2 text-[15px] font-medium text-copper-dark">
                  {t('blog.read')}
                  <ArrowUpRight size={18} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </Section>
    </>
  );
}
