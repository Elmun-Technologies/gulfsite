/**
 * "Mavzu bo'yicha maqolalar" — soha / kategoriya / guruh sahifasidan blogga
 * teskari ichki havola (server komponent). Faqat UZ va RU (blog tillari);
 * mos maqola bo'lmasa hech narsa render qilinmaydi.
 */

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { AppLocale, Translator } from '@/i18n';
import { articlesLinkingTo, blogText } from '@/lib/blog';
import type { Locale } from '@/lib/taxonomy';
import { Section } from '@/components/ui/SectionHeader';

export function RelatedArticles({
  locale,
  t,
  path,
  prefix = false,
  className = 'pt-10',
}: {
  locale: AppLocale;
  t: Translator;
  /** `/uz`-siz yo'l: `/industries/bakery`, `/category/flavours/dairy` */
  path: string;
  prefix?: boolean;
  className?: string;
}) {
  const articles = articlesLinkingTo(path, locale, { prefix });
  if (!articles.length) return null;
  const L = locale as Locale;

  return (
    <Section gap={false} className={className}>
      <h2 className="label m-0 pb-3">{t('blog.onTopic')}</h2>
      <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-3">
        {articles.map((a) => {
          const x = blogText(a, L);
          return (
            <li key={a.slug} className="flex">
              <Link
                href={`/${locale}/blog/${a.slug}`}
                className="group flex w-full flex-col gap-3 rounded-card border border-line bg-white p-6 no-underline transition-colors hover:border-copper"
              >
                <span className="text-[18px] font-medium leading-snug text-ink">{x.title}</span>
                <span className="mt-auto flex items-center gap-2 text-[15px] font-medium text-copper-dark">
                  {t('blog.read')}
                  <ArrowUpRight size={18} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
