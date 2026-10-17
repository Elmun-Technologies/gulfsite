'use client';

/**
 * MINI APP — KATALOG: qidiruv, kategoriya chiplari, mahsulot ro'yxati,
 * "Qutiga" tugmasi. Natijalar /api/catalog dan (sayt bilan bir xil
 * filtr dvigateli), sahifalab yuklanadi.
 */

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import type { ProductCard } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useTg } from './TgProvider';

export interface TgCategory {
  id: string;
  label: string;
  count: number;
}

interface Result {
  cards: ProductCard[];
  total: number;
  page: number;
  totalPages: number;
}

export function TgShop({
  locale,
  categories,
  initial,
  groupImages,
}: {
  locale: string;
  categories: TgCategory[];
  initial: Result;
  /** guruh/kategoriya → zaxira rasm (yuklangan rasm bo'lmasa) */
  groupImages: Record<string, string>;
}) {
  const { t } = useI18n();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [data, setData] = useState<Result>(initial);
  const [loading, setLoading] = useState(false);
  const reqId = useRef(0);

  async function fetchPage(page: number, append: boolean, query = q, category = cat) {
    const id = ++reqId.current;
    setLoading(true);
    const sp = new URLSearchParams({ lang: locale, page: String(page), size: '24' });
    if (query.trim()) sp.set('q', query.trim());
    if (category) sp.set('categories', category);
    if (!query.trim() && !category) sp.set('sort', 'popular');
    try {
      const res = await fetch(`/api/catalog?${sp.toString()}`);
      const json = (await res.json()) as { ok: boolean; data?: Result };
      if (id !== reqId.current || !json.ok || !json.data) return;
      const next = json.data;
      setData((prev) => (append ? { ...next, cards: [...prev.cards, ...next.cards] } : next));
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }

  // qidiruv — 300 ms kechikish bilan; kategoriya — darhol
  const timer = useRef<number | undefined>(undefined);
  function schedule(query: string, category: string, delay: number) {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => fetchPage(1, false, query, category), delay);
  }
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div className="flex flex-col gap-4 px-4 pb-6 pt-4">
      <label className="relative block">
        <span className="sr-only">{t('tg.search')}</span>
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            schedule(e.target.value, cat, 300);
          }}
          placeholder={t('tg.search')}
          className="h-12 w-full rounded-pill border border-line bg-white pl-11 pr-4 text-[15px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
        />
      </label>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {[{ id: '', label: t('tg.all'), count: 0 }, ...categories].map((c) => (
          <button
            key={c.id || 'all'}
            type="button"
            onClick={() => {
              setCat(c.id);
              schedule(q, c.id, 0);
            }}
            className={cn(
              'h-10 shrink-0 rounded-pill border px-4 text-[14px] transition',
              cat === c.id ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink',
            )}
          >
            {c.label}
            {c.count ? <span className="ml-1.5 opacity-60">{c.count}</span> : null}
          </button>
        ))}
      </div>

      <p className="text-[13px] text-muted">
        {!q && !cat ? t('tg.popular') : t('tg.results', { count: data.total })}
      </p>

      {data.cards.length ? (
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0">
          {data.cards.map((card) => (
            <li key={card.sku}>
              <ProductTile card={card} locale={locale} fallback={groupImages[card.group] ?? groupImages[card.category]} />
            </li>
          ))}
        </ul>
      ) : !loading ? (
        <p className="rounded-card bg-panel p-6 text-center text-[15px] text-body">{t('tg.empty')}</p>
      ) : null}

      {data.page < data.totalPages ? (
        <button
          type="button"
          disabled={loading}
          onClick={() => fetchPage(data.page + 1, true)}
          className="btn btn--outline btn--md self-center"
        >
          {loading ? '…' : t('tg.loadMore')}
        </button>
      ) : null}
    </div>
  );
}

export function ProductTile({ card, locale, fallback }: { card: ProductCard; locale: string; fallback?: string }) {
  const { t } = useI18n();
  const box = useSampleBox();
  const tg = useTg();
  const inBox = box.has(card.sku);
  const name = card.name[locale as 'uz' | 'ru' | 'en'] || card.name.uz;
  const img = card.image ?? fallback ?? '/images/sample-pod.jpg';

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[20px] bg-panel">
      <Link href={`/${locale}/tg/p/${card.slug}`} className="flex flex-1 flex-col text-ink no-underline">
        <span className="relative block aspect-square overflow-hidden">
          <Image src={img} alt="" fill sizes="50vw" className="object-cover" unoptimized={img.includes('/api/media/')} />
        </span>
        <span className="flex flex-1 flex-col gap-1 px-3 pt-2.5">
          <span className="text-[12px] text-muted">{card.sku}</span>
          <span className="line-clamp-2 text-[14.5px] font-medium leading-snug">{name}</span>
        </span>
      </Link>
      <div className="p-3 pt-2">
        <button
          type="button"
          onClick={() => {
            if (inBox) {
              box.remove(card.sku);
              tg.haptic('light');
              return;
            }
            const r = box.add({ sku: card.sku, slug: card.slug, name: card.name });
            tg.haptic(r === 'full' ? 'error' : 'success');
          }}
          className={cn(
            'h-10 w-full rounded-pill text-[14px] font-medium transition',
            inBox ? 'border border-ink bg-white text-ink' : 'bg-navy text-white',
          )}
          aria-pressed={inBox}
        >
          {inBox ? `✓ ${t('tg.inBox')}` : `+ ${t('tg.add')}`}
        </button>
      </div>
    </article>
  );
}
