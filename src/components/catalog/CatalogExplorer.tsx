'use client';

/**
 * KATALOG TADQIQOTCHISI — saytning yuragi
 * ----------------------------------------------------------------
 * Bitta komponent boshqaradi:
 *   • qidiruv (avtoto'ldirish bilan)
 *   • barcha filtrlar (desktop: yon ustun, mobil: drawer)
 *   • saralash, ko'rinish (setka/ro'yxat)
 *   • sahifalash + "Yana ko'rsatish"
 *   • bo'sh natija holati va takliflar
 *
 * Har bir o'zgarish URL'ga yoziladi (`?categories=flavours&features=halal`).
 * Buning foydasi:
 *   1. Havolani ulashish mumkin (B2B xaridorlar hamkasblariga yuboradi)
 *   2. Qidiruv tizimlari filtrlangan sahifalarni indekslaydi
 *   3. Sahifa yangilansa holat yo'qolmaydi
 *   4. "Orqaga" tugmasi to'g'ri ishlaydi
 *
 * Natijalar serverda hisoblanadi (SEO + yengil bundle); "Yana ko'rsatish"
 * esa /api/catalog orqali sahifani qayta yuklamasdan qo'shiladi.
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { filtersToParams } from '@/lib/filters-url';
import type { CatalogFilters, Facet, ProductCard as ProductCardData, SortKey } from '@/lib/types';
import type { Locale } from '@/lib/taxonomy';
import { useI18n } from '@/components/i18n/I18nProvider';
import { track } from '@/lib/analytics';
import { Icon } from '@/components/ui/Icon';
import { Button, ButtonLink, Spinner } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Display';
import { Segmented } from '@/components/ui/Field';
import { Drawer } from '@/components/ui/Overlay';
import { ProductCard } from './ProductCard';
import { FilterPanel } from './FilterPanel';
import { SearchBar } from './SearchBar';
import { ActiveFilters, type Chip } from './ActiveFilters';

const VIEW_KEY = 'gff_catalog_view';

interface Props {
  locale: Locale;
  cards: ProductCardData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  facets: Facet[];
  filters: CatalogFilters;
  activeCount: number;
  chips: Chip[];
  suggestion: string | null;
  basePath: string;
  productBase: string;
  /** Tezkor havolalar — bo'sh natijada taklif qilinadi */
  quickLinks: { label: string; href: string }[];
}

export function CatalogExplorer({
  locale,
  cards,
  total,
  page,
  pageSize,
  totalPages,
  facets,
  filters,
  activeCount,
  chips,
  suggestion,
  basePath,
  productBase,
  quickLinks,
}: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [drawer, setDrawer] = useState(false);
  const [extra, setExtra] = useState<ProductCardData[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  /* ---- Ko'rinish tanlovini eslab qolish ---- */
  // localStorage faqat brauzerda mavjud, shuning uchun SSR bilan mos kelishi
  // uchun mount'dan keyin o'qiymiz (bir martalik gidratsiya).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(VIEW_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === 'list' || saved === 'grid') setView(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const changeView = (v: 'grid' | 'list') => {
    setView(v);
    try {
      window.localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* ignore */
    }
  };

  /* ---- Yangi natijalar kelsa qo'shimcha sahifalarni tozalaymiz ---- */
  const [prevCards, setPrevCards] = useState(cards);
  if (prevCards !== cards) {
    setPrevCards(cards);
    setExtra([]);
    setMoreError(false);
  }

  /* ---- URL ni yangilash ---- */
  const apply = useCallback(
    (patch: Partial<CatalogFilters>, opts?: { keepPage?: boolean }) => {
      const next: CatalogFilters = { ...filters, ...patch };
      if (!opts?.keepPage && !('page' in patch)) next.page = 1;
      const qs = filtersToParams(next).toString();
      const url = qs ? `${basePath}?${qs}` : basePath;
      startTransition(() => {
        router.replace(url, { scroll: false });
      });
      return next;
    },
    [filters, basePath, router],
  );

  const removeChip = (key: string, id?: string) => {
    if (!id) {
      // Yakka qiymatli filtrlar
      if (key === 'q') return apply({ q: '' });
      if (key === 'dose' || key === 'dosageMax') return apply({ dosageMax: null });
      if (key === 'onlyNew' || key === 'new') return apply({ onlyNew: false });
      if (key === 'onlyTop' || key === 'top') return apply({ onlyTop: false });
      return;
    }
    const listKey = key as keyof CatalogFilters;
    const current = filters[listKey];
    if (!Array.isArray(current)) return;
    apply({ [key]: current.filter((v: string | number) => String(v) !== id) } as Partial<CatalogFilters>);
  };

  const resetAll = () => {
    track.filterApply({ action: 'reset' });
    startTransition(() => router.replace(basePath, { scroll: false }));
  };

  /* ---- "Yana ko'rsatish" ---- */
  const loadedPages = 1 + Math.floor(extra.length / pageSize);
  const nextPage = page + loadedPages;
  const canLoadMore = nextPage <= totalPages;

  const loadMore = async () => {
    if (!canLoadMore || loadingMore) return;
    setLoadingMore(true);
    setMoreError(false);
    const params = filtersToParams({ ...filters, page: nextPage });
    params.set('lang', locale);
    try {
      const res = await fetch(`/api/catalog?${params.toString()}`, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { ok: boolean; data?: { cards?: ProductCardData[] } };
      if (!json.ok || !Array.isArray(json.data?.cards)) throw new Error('bad payload');
      setExtra((prev) => [...prev, ...(json.data?.cards ?? [])]);
      track.filterApply({ action: 'load_more', page: nextPage, total });
    } catch {
      setMoreError(true);
    } finally {
      setLoadingMore(false);
    }
  };

  const allCards = useMemo(() => (extra.length ? [...cards, ...extra] : cards), [cards, extra]);

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, (page - 1) * pageSize + allCards.length);

  /* ---- Saralash variantlari ---- */
  const sortOptions: { value: SortKey; label: string }[] = [
    { value: 'popular', label: t('catalog.sort.popular') },
    { value: 'new', label: t('catalog.sort.new') },
    { value: 'name-asc', label: t('catalog.sort') + ' A→Z' },
    { value: 'name-desc', label: t('catalog.sort') + ' Z→A' },
    { value: 'dosage-asc', label: t('catalog.sort') + ' ↓ 0.05%' },
    { value: 'dosage-desc', label: t('catalog.sort') + ' ↑ 20%' },
    { value: 'sku', label: t('catalog.sort.sku') },
  ];

  const hrefForPage = (p: number) => {
    const qs = filtersToParams({ ...filters, page: p }).toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const last = totalPages;
    const cur = page;
    const window = last <= 7 ? last : cur <= 4 ? 5 : cur >= last - 3 ? last - 4 : cur - 2;
    const start = Math.max(1, window);
    for (let i = start; i < Math.min(last, start + 4); i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-7">
      {/* ================= YON USTUN (desktop) ================= */}
      <aside className="hidden w-[17.5rem] shrink-0 lg:block">
        <div className="sticky top-[5.5rem] max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain rounded-2xl border border-cream-200 bg-white shadow-soft">
          <FilterPanel
            facets={facets}
            filters={filters}
            activeCount={activeCount}
            onPatch={(patch) => apply(patch)}
            onReset={resetAll}
          />
        </div>
      </aside>

      {/* ================= NATIJALAR ================= */}
      <div ref={resultsRef} className="min-w-0 flex-1">
        {/* ---- Qidiruv ---- */}
        <SearchBar
          value={filters.q}
          locale={locale}
          placeholder={t('catalog.searchPlaceholder')}
          productHrefBase={productBase}
          correction={suggestion}
          onSubmit={(q) => apply({ q })}
        />

        {/* ---- Boshqaruv paneli ---- */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-cream-300 bg-white px-3.5 text-[13.5px] font-bold text-pine-800 shadow-soft transition hover:border-teal-500/50 hover:text-teal-600 lg:hidden"
          >
            <Icon name="sliders" size={16} />
            {t('catalog.filters')}
            {activeCount > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1 font-mono text-[10.5px] font-extrabold text-white">
                {activeCount}
              </span>
            ) : null}
          </button>

          <p className="flex-1 text-[13.5px] font-medium text-slate-warm-600" role="status" aria-live="polite">
            {total === 0 ? (
              t('catalog.resultsCountZero')
            ) : (
              <>
                <span className="font-mono font-bold text-pine-900 tabular-nums">{from}–{to}</span>
                {' / '}
                <span className="font-mono font-bold text-pine-900 tabular-nums">{total}</span>{' '}
                {t('common.results').toLowerCase()}
              </>
            )}
            {isPending ? <Spinner size={13} className="ml-2 inline-block align-[-2px] text-teal-600" /> : null}
          </p>

          {/* Saralash */}
          <label className="relative inline-flex items-center">
            <span className="sr-only">{t('catalog.sort')}</span>
            <Icon name="sort" size={15} className="pointer-events-none absolute left-3 text-slate-warm-500" />
            <select
              value={filters.sort}
              onChange={(e) => {
                const v = e.target.value as SortKey;
                track.filterApply({ sort: v });
                apply({ sort: v });
              }}
              className="h-10 appearance-none rounded-xl border border-cream-300 bg-white pr-9 pl-9 text-[13px] font-semibold text-pine-800 shadow-soft transition hover:border-teal-500/50 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <Icon name="chevron-down" size={14} className="pointer-events-none absolute right-3 text-slate-warm-500" />
          </label>

          {/* Ko'rinish */}
          <Segmented
            ariaLabel={t('catalog.viewGrid')}
            value={view}
            onChange={changeView}
            size="sm"
            className="hidden sm:inline-flex"
            options={[
              { value: 'grid', label: '', icon: 'grid' },
              { value: 'list', label: '', icon: 'list' },
            ]}
          />
        </div>

        {/* ---- Faol filtrlar ---- */}
        <ActiveFilters chips={chips} onRemove={removeChip} onReset={resetAll} className="mt-3" />

        {/* ================= HOLATLAR ================= */}

        {/* Bo'sh natija */}
        {total === 0 ? (
          <div className="mt-5">
            <EmptyState
              icon="search"
              title={t('catalog.noResults')}
              description={
                <>
                  {t('catalog.noResultsHint')}
                  {suggestion ? (
                    <>
                      {' '}
                      {t('catalog.didYouMean')}{' '}
                      <button
                        type="button"
                        onClick={() => apply({ q: suggestion })}
                        className="font-bold text-teal-600 underline decoration-teal-500/40 underline-offset-2 hover:decoration-teal-600"
                      >
                        {suggestion}
                      </button>
                      ?
                    </>
                  ) : null}
                </>
              }
              action={
                <>
                  <Button variant="outline" size="sm" icon="refresh" onClick={resetAll}>
                    {t('catalog.resetAll')}
                  </Button>
                  <ButtonLink href={`/${locale}/quote`} size="sm" icon="invoice">
                    {t('nav.quote')}
                  </ButtonLink>
                </>
              }
            />

            {/* Kerakli mahsulot topilmasa — so'rov yuborish eng to'g'ri yo'l */}
            <div className="mt-4 rounded-2xl border border-teal-500/25 bg-mint-50 p-5">
              <p className="font-display text-[15px] font-bold text-pine-900">{t('catalog.noResultsCta')}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-warm-600">
                {t('product.askTechnologistHint')}
              </p>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {quickLinks.map((q) => (
                  <Link
                    key={q.href}
                    href={q.href}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-cream-300 bg-white px-3 text-[12.5px] font-semibold text-slate-warm-700 transition hover:border-teal-500/50 hover:text-teal-600"
                  >
                    {q.label}
                    <Icon name="arrow-right" size={13} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ---- Mahsulotlar ---- */}
            <div
              className={cn(
                'mt-5 transition-opacity duration-200',
                isPending && 'pointer-events-none opacity-45',
                view === 'grid'
                  ? 'grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3'
                  : 'flex flex-col gap-3',
              )}
            >
              {allCards.map((c) => (
                <ProductCard key={`${c.sku}-${view}`} card={c} locale={locale} view={view} hrefBase={productBase} />
              ))}
            </div>

            {/* ---- Yana ko'rsatish ---- */}
            {canLoadMore ? (
              <div className="mt-7 flex flex-col items-center gap-2">
                <Button variant="outline" size="lg" onClick={loadMore} loading={loadingMore} icon={loadingMore ? undefined : 'plus'}>
                  {t('catalog.loadMore')}
                </Button>
                <div className="h-1 w-40 overflow-hidden rounded-full bg-cream-200">
                  <div
                    className="h-full rounded-full bg-teal-500 transition-[width] duration-500"
                    style={{ width: `${Math.round((to / total) * 100)}%` }}
                  />
                </div>
                <p className="text-[12px] text-slate-warm-500">
                  {t('catalog.showing').replace('{shown}', String(to)).replace('{total}', String(total))}
                </p>
                {moreError ? (
                  <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-clay-600">
                    <Icon name="alert" size={13} />
                    {t('err.network')}{' '}
                    <button type="button" onClick={loadMore} className="underline underline-offset-2">
                      {t('common.retry')}
                    </button>
                  </p>
                ) : null}
              </div>
            ) : null}

            {/* ---- Sahifalash ---- */}
            {totalPages > 1 ? (
              <nav
                aria-label={t('common.page')}
                className="mt-8 flex flex-wrap items-center justify-center gap-1.5 border-t border-cream-200 pt-6"
              >
                {page > 1 ? (
                  <Link
                    href={hrefForPage(page - 1)}
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-cream-300 px-3 text-[13px] font-semibold text-pine-800 transition hover:border-teal-500/50 hover:text-teal-600"
                    rel="prev"
                  >
                    <Icon name="chevron-left" size={14} />
                    {t('common.prev')}
                  </Link>
                ) : (
                  <span className="inline-flex h-9 cursor-not-allowed items-center gap-1 rounded-lg border border-cream-200 px-3 text-[13px] font-semibold text-slate-warm-400">
                    <Icon name="chevron-left" size={14} />
                    {t('common.prev')}
                  </span>
                )}

                {pageNumbers[0] > 1 ? (
                  <>
                    <Link href={hrefForPage(1)} className="h-9 min-w-9 rounded-lg px-3 text-center font-mono text-[13px] font-semibold leading-9 text-slate-warm-600 transition hover:bg-cream-100">
                      1
                    </Link>
                    {pageNumbers[0] > 2 ? <span className="px-1 text-slate-warm-400">…</span> : null}
                  </>
                ) : null}

                {pageNumbers.map((n) =>
                  n === page ? (
                    <span
                      key={n}
                      aria-current="page"
                      className="h-9 min-w-9 rounded-lg bg-pine-800 px-3 text-center font-mono text-[13px] font-bold leading-9 text-white"
                    >
                      {n}
                    </span>
                  ) : (
                    <Link
                      key={n}
                      href={hrefForPage(n)}
                      className="h-9 min-w-9 rounded-lg px-3 text-center font-mono text-[13px] font-semibold leading-9 text-slate-warm-600 transition hover:bg-cream-100 hover:text-teal-600"
                    >
                      {n}
                    </Link>
                  ),
                )}

                {pageNumbers[pageNumbers.length - 1] < totalPages ? (
                  <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 ? (
                      <span className="px-1 text-slate-warm-400">…</span>
                    ) : null}
                    <Link
                      href={hrefForPage(totalPages)}
                      className="h-9 min-w-9 rounded-lg px-3 text-center font-mono text-[13px] font-semibold leading-9 text-slate-warm-600 transition hover:bg-cream-100"
                    >
                      {totalPages}
                    </Link>
                  </>
                ) : null}

                {page < totalPages ? (
                  <Link
                    href={hrefForPage(page + 1)}
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-cream-300 px-3 text-[13px] font-semibold text-pine-800 transition hover:border-teal-500/50 hover:text-teal-600"
                    rel="next"
                  >
                    {t('common.next')}
                    <Icon name="chevron-right" size={14} />
                  </Link>
                ) : (
                  <span className="inline-flex h-9 cursor-not-allowed items-center gap-1 rounded-lg border border-cream-200 px-3 text-[13px] font-semibold text-slate-warm-400">
                    {t('common.next')}
                    <Icon name="chevron-right" size={14} />
                  </span>
                )}
              </nav>
            ) : null}
          </>
        )}
      </div>

      {/* ================= MOBIL FILTR DRAWER ================= */}
      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        side="left"
        width="md"
        title={t('catalog.filters')}
        footer={
          <div className="flex gap-2">
            <Button variant="outline" size="md" full onClick={resetAll} icon="refresh">
              {t('catalog.reset')}
            </Button>
            <Button
              variant="primary"
              size="md"
              full
              onClick={() => {
                setDrawer(false);
                resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {t('catalog.apply')} · {total}
            </Button>
          </div>
        }
      >
        <div className="-mx-4 -my-4">
          <FilterPanel
            facets={facets}
            filters={filters}
            activeCount={activeCount}
            onPatch={(patch) => apply(patch)}
            onReset={resetAll}
          />
        </div>
      </Drawer>
    </div>
  );
}

export default CatalogExplorer;
