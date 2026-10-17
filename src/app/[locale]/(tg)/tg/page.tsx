/**
 * MINI APP — BOSH SAHIFA: katalog (qidiruv + kategoriyalar + ommabop)
 */

import Image from 'next/image';
import Link from 'next/link';
import { LOCALES, makeT, normalizeLocale } from '@/i18n';
import { queryCatalog } from '@/lib/catalog';
import { ensureCatalog } from '@/lib/catalog-live';
import { categoriesWithData, groupImageMap } from '@/lib/design';
import type { Locale } from '@/lib/taxonomy';
import { cn } from '@/lib/utils';
import { TgShop } from '@/components/tg/TgShop';

export const revalidate = 300;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function TgHome({ params }: { params: Promise<{ locale: string }> }) {
  await ensureCatalog();
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const L = locale as Locale;
  const t = makeT(locale);
  const categories = categoriesWithData(L)
    .filter((c) => c.count > 0)
    .map((c) => ({ id: c.id, label: c.label, count: c.count }));
  const r = queryCatalog({ sort: 'popular' }, L, 24);

  return (
    <>
      <header className="flex items-center gap-3 bg-navy px-4 py-4 text-white">
        <Image src="/images/monogram-copper.png" alt="" width={36} height={38} className="h-9 w-auto" />
        <span className="flex-1">
          <span className="block text-[11px] uppercase tracking-[0.18em] text-copper-light">Gulf Flavours &amp; Fragrances</span>
          <span className="block text-[17px]">{t('tg.brand')}</span>
        </span>
        <nav className="flex gap-1" aria-label="Language">
          {LOCALES.map((l) => (
            <Link
              key={l}
              href={`/${l}/tg`}
              className={cn(
                'rounded-pill px-2.5 py-1 text-[12px] uppercase no-underline',
                l === locale ? 'bg-copper text-ink' : 'text-on-navy',
              )}
            >
              {l}
            </Link>
          ))}
        </nav>
      </header>
      <TgShop
        locale={locale}
        categories={categories}
        initial={{ cards: r.cards, total: r.total, page: r.page, totalPages: r.totalPages }}
        groupImages={groupImageMap()}
      />
    </>
  );
}
