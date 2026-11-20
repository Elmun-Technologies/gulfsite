/**
 * BLOG MAQOLASI — `/[locale]/blog/<slug>` (matn manbai: `lib/blog.ts`)
 * ----------------------------------------------------------------
 * Faqat UZ/RU. Maqola yo'q yoki til EN bo'lsa — 404 (proxy ham ushlaydi).
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { articleLd, buildMetadata, breadcrumbLd, clipText, faqLd } from '@/lib/seo';
import { BLOG_LOCALES, allBlogSlugs, blogFaq, blogText, getArticle, hasBlog } from '@/lib/blog';
import type { Locale } from '@/lib/taxonomy';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/PageHead';
import { ButtonLink } from '@/components/ui/Button';
import { Section } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/motion';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return LOCALES.filter(hasBlog).flatMap((locale) => allBlogSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = normalizeLocale(raw);
  const article = getArticle(slug, locale);
  if (!article) return buildMetadata({ locale, title: '404', path: '/404', noIndex: true });
  const x = blogText(article, locale as Locale);
  return buildMetadata({
    locale,
    title: clipText(x.title, 42),
    description: clipText(x.description, 155),
    path: `/blog/${article.slug}`,
    type: 'article',
    publishedTime: article.published,
    languages: [...BLOG_LOCALES],
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const article = getArticle(slug, locale);
  if (!article) notFound();
  const t = makeT(locale);
  const x = blogText(article, locale as Locale);
  const faq = blogFaq(x);

  const date = new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'uz-Latn-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.published));

  const crumbs = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('nav.blog'), href: `/${locale}/blog` },
    { label: x.title },
  ];

  return (
    <>
      <JsonLdGroup
        items={[
          breadcrumbLd(
            crumbs.map((c) => ({ name: c.label, path: c.href ?? `/blog/${article.slug}` })),
            locale,
          ),
          articleLd({
            locale,
            path: `/blog/${article.slug}`,
            headline: x.title,
            description: x.description,
            published: article.published,
          }),
          ...(faq.length ? [faqLd(faq)] : []),
        ]}
      />

      <Section gap={false} className="pt-2">
        <Reveal className="flex flex-col gap-6 rounded-block bg-panel p-[clamp(28px,4vw,56px)]">
          <Breadcrumbs label={t('nav.blog')} items={crumbs} />
          <h1 className="m-0 max-w-[900px] text-[clamp(32px,4.6vw,72px)] font-normal leading-[1.02] tracking-[-0.035em]">
            {x.title}
          </h1>
          <p className="m-0 max-w-[760px] text-body-l leading-relaxed text-body">{x.intro}</p>
          <span className="text-[15px] text-muted">{t('blog.published', { date })}</span>
        </Reveal>
      </Section>

      <Section className="flex flex-wrap gap-8 md:gap-12">
        <article className="legal-prose flex min-w-0 flex-[1.6_1_560px] flex-col">
          {x.blocks.map((b, i) => {
            if ('h2' in b) return <h2 key={i}>{b.h2}</h2>;
            if ('p' in b)
              return (
                <p key={i} className="max-w-[720px] text-body-l leading-relaxed">
                  {b.p}
                </p>
              );
            if ('faq' in b)
              return (
                <div key={i} className="flex max-w-[720px] flex-col">
                  {b.faq.map((f, fi) => (
                    <div key={fi} className="border-t border-line py-5 first:border-t-0 first:pt-2">
                      <h3 className="m-0 text-[clamp(18px,1.6vw,22px)] font-medium leading-snug text-ink">{f.q}</h3>
                      <p className="mb-0 mt-2 text-body-l leading-relaxed">{f.a}</p>
                    </div>
                  ))}
                </div>
              );
            return (
              <ul key={i} className="my-4 flex max-w-[720px] list-none flex-col gap-2 p-0">
                {b.ul.map((li, ii) => (
                  <li key={ii} className="flex gap-3 text-body-l leading-relaxed text-body">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-pill bg-copper" />
                    {li}
                  </li>
                ))}
              </ul>
            );
          })}
        </article>

        <aside className="flex flex-1 basis-[280px] flex-col gap-4 self-start md:sticky md:top-28">
          <span className="label">{t('blog.related')}</span>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {x.links.map((l) => (
              <li key={l.path}>
                <Link
                  href={`/${locale}${l.path}`}
                  className="flex items-baseline gap-2 py-1.5 text-[15px] leading-snug text-body no-underline transition-colors hover:text-ink"
                >
                  <ArrowUpRight size={15} aria-hidden className="shrink-0 text-copper-dark" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </Section>

      <Section
        gap={false}
        className="flex flex-wrap items-center justify-between gap-6 rounded-block bg-navy p-[clamp(24px,3vw,40px)] text-white"
      >
        <span className="flex max-w-[640px] flex-col gap-2">
          <span className="text-[clamp(22px,2.4vw,32px)] font-medium">{t('blog.ctaTitle')}</span>
          <span className="text-body-l text-copper-light">{t('blog.ctaText')}</span>
        </span>
        <span className="flex flex-wrap gap-3">
          <ButtonLink href={`/${locale}/samples`} variant="accent" size="lg">
            {t('blog.ctaSamples')}
            <ArrowUpRight size={18} aria-hidden />
          </ButtonLink>
          <ButtonLink href={`/${locale}/quote`} variant="primary" size="lg">
            {t('blog.ctaQuote')}
          </ButtonLink>
        </span>
      </Section>

      <p className="container-page py-6 text-[13px]">
        <Link href={`/${locale}/blog`} className="text-muted underline underline-offset-4 hover:text-ink">
          {t('blog.all')}
        </Link>
      </p>
    </>
  );
}
