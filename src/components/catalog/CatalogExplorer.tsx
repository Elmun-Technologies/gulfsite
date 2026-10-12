'use client';

/**
 * KATALOG EXPLORER (§5, §9, design/Catalog.dc.html)
 * ----------------------------------------------------------------
 * Holat URL'da saqlanadi (`?categories=&groups=&forms=&features=&q=&sort=&page=`)
 * — server har so'rovda natijani qayta hisoblaydi. Bu SEO uchun muhim:
 * filtrlangan sahifalar indekslanadi va ulashiladi.
 *
 * Ko'rinishlar:
 *   Jadval  — zich B2B ko'rinish (default, ≥900px)
 *   Kartochka — mobil uchun qulay (default, <900px)
 *
 * <900px: filtrlar pastki "sheet"da, sahifaning o'zi scroll bo'lmaydi (§9).
 * Kategoriya tab'lari har doim BIRTA QATORDA, gorizontal scroll (§9).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { Facet, ProductCard } from '@/lib/types';
import type { Locale } from '@/lib/taxonomy';
import { tr } from '@/lib/taxonomy';
import { dur, ease } from '@/lib/motion';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import { Reveal, RevealGroup } from '@/components/motion';
import { ButtonLink } from '@/components/ui/Button';
import { Pill, StockDot } from '@/components/ui/Pill';
import { Segmented, Tabs } from '@/components/ui/Tabs';
import { AddSampleButton, type AddSampleLabels } from './AddSampleButton';
import { fillVars } from '@/i18n/translator';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const VIEW_KEY = 'gff_catalog_view';
const LIST_KEYS = ['categories', 'groups', 'forms', 'features', 'applications', 'availability', 'packaging'];

export interface CatalogLabels {
  searchPh: string;
  searchAria: string;
  sortLabel: string;
  viewLabel: string;
  viewTable: string;
  viewCards: string;
  filtersBtn: string;
  filtersClose: string;
  /** xom shablonlar (`{count}`, `{from}` …) — RSC funksiyani uzata olmaydi */
  filtersApplyTpl: string;
  reset: string;
  toBox: string;
  boxLineTpl: string;
  resultLineTpl: string;
  emptyTitle: string;
  emptyText: string;
  emptyCta: string;
  showMore: string;
  pagination: string;
  colProduct: string;
  colGroup: string;
  colForm: string;
  colDose: string;
  colStock: string;
  colSample: string;
  inStock: string;
  onOrder: string;
  availabilityNew: string;
  add: AddSampleLabels;
  /** facet sarlavhalari */
  facetLabels: Record<string, string>;
}

export interface CatalogExplorerProps {
  locale: Locale;
  cards: ProductCard[];
  facets: Facet[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
  labels: CatalogLabels;
  boxHref: string;
  contactHref: string;
  /** `/<locale>/catalog` — kartochka havolasi shu bazadan yig'iladi */
  productHrefBase: string;
  sampleDays: number;
  /** xomashyo kategoriyasi tanlanganmi (bo'sh natija uchun maxsus blok) */
  commoditiesOnly: boolean;
  groupLabels: Record<string, string>;
  formLabels: Record<string, string>;
}

type View = 'table' | 'cards';

export function CatalogExplorer({
  locale,
  cards,
  facets,
  total,
  page,
  totalPages,
  pageSize,
  labels,
  boxHref,
  contactHref,
  productHrefBase,
  sampleDays,
  commoditiesOnly,
  groupLabels,
  formLabels,
}: CatalogExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const box = useSampleBox();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [view, setView] = useState<View>('table');
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [q, setQ] = useState(params.get('q') ?? '');

  /* ---- <900px: filtrlar sheet'da, default ko'rinish — kartochka (§9) ---- */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899px)');
    const apply = () => {
      setNarrow(mq.matches);
      setView((_v) => {
        const stored = window.localStorage.getItem(VIEW_KEY) as View | null;
        if (stored) return stored;
        return mq.matches ? 'cards' : 'table';
      });
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  /* ---- URL'ni yangilash ---- */
  const pushParams = useCallback(
    (mutate: (p: URLSearchParams) => void, opts: { scroll?: boolean; shallow?: boolean } = {}) => {
      const next = new URLSearchParams(params.toString());
      mutate(next);
      if (!next.get('page') || next.get('page') === '1') next.delete('page');
      const qs = next.toString();
      router[opts.shallow ? 'replace' : 'push'](qs ? `${pathname}?${qs}` : pathname, { scroll: opts.scroll ?? false });
    },
    [params, pathname, router],
  );

  const setList = useCallback(
    (key: string, id: string, on: boolean) => {
      pushParams((p) => {
        const cur = (p.get(key) ?? '').split(',').filter(Boolean);
        const next = on ? [...new Set([...cur, id])] : cur.filter((x) => x !== id);
        if (next.length) p.set(key, next.join(','));
        else p.delete(key);
        p.delete('page');
      });
    },
    [pushParams],
  );

  const setCategory = useCallback(
    (id: string) => {
      pushParams((p) => {
        if (id === 'all') p.delete('categories');
        else p.set('categories', id);
        // kategoriya almashganda guruh filtri ma'nosini yo'qotadi
        p.delete('groups');
        p.delete('page');
      });
      track.filterApply({ categories: id });
    },
    [pushParams],
  );

  const setSort = useCallback(
    (sort: string) => {
      pushParams((p) => {
        if (sort === 'popular') p.delete('sort');
        else p.set('sort', sort);
        p.delete('page');
      });
    },
    [pushParams],
  );

  const setPage = useCallback(
    (n: number) => {
      pushParams((p) => p.set('page', String(n)));
      track.pageChange(n);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [pushParams],
  );

  const resetAll = useCallback(() => {
    pushParams((p) => {
      for (const k of [...LIST_KEYS, 'q', 'sort', 'page', 'doseMax', 'onlyNew', 'onlyTop']) p.delete(k);
    });
  }, [pushParams]);

  /* ---- qidiruv: 400ms debounce, URL'ga yoziladi ---- */
  useEffect(() => {
    const current = params.get('q') ?? '';
    if (q === current) return;
    const id = window.setTimeout(() => {
      pushParams((p) => {
        if (q.trim()) p.set('q', q.trim());
        else p.delete('q');
        p.delete('page');
      });
      track.search(q.trim(), total);
    }, 400);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  /* ---- ko'rinish tanlovi localStorage'da ---- */
  const changeView = useCallback((v: View) => {
    setView(v);
    try {
      window.localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* private mode — muhim emas */
    }
    track.viewToggle(v);
  }, []);

  const activeCategory = (params.get('categories') ?? 'all') || 'all';
  const activeCount = useMemo(() => {
    let n = 0;
    for (const key of LIST_KEYS) n += (params.get(key) ?? '').split(',').filter(Boolean).length;
    if (params.get('q')) n += 1;
    return n;
  }, [params]);

  /* ---- tab elementlari ---- */
  const categoryFacet = facets.find((f) => f.key === 'categories');
  const tabItems = [
    { id: 'all', label: labels.facetLabels.all ?? '—', count: total },
    ...(categoryFacet?.options ?? []).map((o) => ({ id: o.id, label: o.label, count: o.count })),
  ];

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const groupFacet = facets.find((f) => f.key === 'groups');
  const formFacet = facets.find((f) => f.key === 'forms');
  const featureFacet = facets.find((f) => f.key === 'features');
  const visibleFacets = [groupFacet, formFacet, featureFacet].filter((f): f is Facet => Boolean(f && f.options.length));

  const filtersBody = (
    <>
      {visibleFacets.map((facet) => (
        <fieldset key={facet.key} className="m-0 flex flex-col gap-3.5 rounded-media border border-line-soft p-6">
          <legend className="label p-0">
            {labels.facetLabels[String(facet.key)] ?? facet.label}
          </legend>
          {facet.options.slice(0, 12).map((opt) => (
            <label
              key={opt.id}
              className="flex min-h-7 cursor-pointer items-center gap-3 text-[15px]"
            >
              <input
                type="checkbox"
                checked={opt.active}
                onChange={(ev) => setList(String(facet.key), opt.id, ev.target.checked)}
                className="h-[18px] w-[18px] shrink-0 accent-navy"
              />
              <span className="flex-grow">{opt.label}</span>
              <span className="text-[13px] text-muted">{opt.count}</span>
            </label>
          ))}
        </fieldset>
      ))}

      {activeCount > 0 ? (
        <button type="button" onClick={resetAll} className="btn btn--ghost btn--sm w-full">
          {labels.reset}
        </button>
      ) : null}
    </>
  );

  return (
    <>
      {/* ============================================================
          KATEGORIYA TAB'LARI — har doim bitta qator, gorizontal scroll
          ============================================================ */}
      <div className="container-page pt-6">
        <Tabs
          items={tabItems}
          value={activeCategory}
          onChange={setCategory}
          layoutId="catalog-cat"
          ariaLabel={labels.facetLabels.tabs ?? 'Kategoriyalar'}
        />
      </div>

      {/* ============================================================
          TOOLBAR
          ============================================================ */}
      <div className="container-page pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex h-14 min-w-0 flex-[1_1_420px] items-center gap-3 rounded-pill border border-line px-[22px] text-muted focus-within:border-ink">
            <Search size={20} strokeWidth={1.8} aria-hidden />
            <span className="sr-only">{labels.searchAria}</span>
            <input
              ref={searchRef}
              type="search"
              value={q}
              maxLength={120}
              placeholder={labels.searchPh}
              onChange={(ev) => setQ(ev.target.value)}
              className="min-w-0 flex-grow border-0 bg-transparent text-[16px] text-ink outline-none"
            />
            {q ? (
              <button
                type="button"
                onClick={() => {
                  setQ('');
                  searchRef.current?.focus();
                }}
                aria-label={labels.reset}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-pill text-muted hover:text-ink"
              >
                <X size={16} strokeWidth={2} aria-hidden />
              </button>
            ) : null}
          </label>

          <label className="flex h-14 shrink-0 items-center gap-2.5 rounded-pill border border-line px-5 text-[15px] text-muted">
            <span className="sr-only">{labels.sortLabel}</span>
            <select
              value={params.get('sort') ?? 'popular'}
              onChange={(ev) => setSort(ev.target.value)}
              className="border-0 bg-transparent text-[15px] font-medium text-ink outline-none"
            >
              {['popular', 'name-asc', 'name-desc', 'new'].map((s) => (
                <option key={s} value={s}>
                  {labels.facetLabels[`sort:${s}`] ?? s}
                </option>
              ))}
            </select>
          </label>

          <Segmented<View>
            options={[
              { id: 'table', label: labels.viewTable },
              { id: 'cards', label: labels.viewCards },
            ]}
            value={view}
            onChange={changeView}
            layoutId="catalog-view"
            ariaLabel={labels.viewLabel}
          />
        </div>
      </div>

      {/* ============================================================
          BODY
          ============================================================ */}
      <div className="container-page flex flex-wrap items-start gap-6 pt-6">
        {/* <900px — filtr tugmasi */}
        {narrow ? (
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-expanded={sheetOpen}
            className="btn btn--outline btn--md w-full"
          >
            <SlidersHorizontal size={18} strokeWidth={1.8} aria-hidden />
            {labels.filtersBtn}
            {activeCount ? <span className="text-copper-light">· {activeCount}</span> : null}
          </button>
        ) : (
          <aside aria-label={labels.filtersBtn} className="sticky top-28 flex w-[280px] shrink-0 flex-col gap-3.5">
            {filtersBody}
          </aside>
        )}

        {/*
          `role="tabpanel"` + `id` MAJBURIY: `<Tabs>` har bir tab'ga
          `aria-controls={`panel-${layoutId}`}` qo'yadi. ID DOM'da bo'lmasa
          axe `aria-valid-attr-value` (Lighthouse A11y og'irligi 10) yiqiladi
          — bu katalog sahifasida A11y'ni 92 ga tushirgan yagona sabab edi.
          `aria-labelledby` faol tab'ga bog'laydi (id shakli: `tab-<layoutId>-<value>`).
        */}
        <div
          id="panel-catalog-cat"
          role="tabpanel"
          aria-labelledby={`tab-catalog-cat-${activeCategory}`}
          className="flex min-w-0 flex-[999_1_560px] flex-col gap-4"
        >
          {/* ---- Namuna qutisi paneli ---- */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-pill bg-navy py-3.5 pl-[26px] pr-3.5 text-white max-tab:rounded-card max-tab:p-5">
            <span className="text-[16px]">
              {fillVars(labels.boxLineTpl, { count: box.count, max: box.max, days: sampleDays })}
            </span>
            <ButtonLink href={boxHref} variant="accent" size="sm" arrow>
              {labels.toBox}
            </ButtonLink>
          </div>

          <span className="px-2 text-[15px] text-muted">
            {fillVars(labels.resultLineTpl, { from, to, total })}
          </span>

          {/* ---- Natija yo'q ---- */}
          {cards.length === 0 ? (
            <Reveal className="flex flex-col items-center gap-4 rounded-card border border-dashed border-line px-8 py-14 text-center">
              <span className="text-[28px] font-normal tracking-[-0.02em]">
                {commoditiesOnly ? labels.emptyTitle : labels.facetLabels.noResults ?? labels.emptyTitle}
              </span>
              <span className="max-w-[460px] text-[16px] leading-[1.55] text-muted">
                {commoditiesOnly ? labels.emptyText : labels.facetLabels.noResultsHint ?? labels.emptyText}
              </span>
              <ButtonLink href={contactHref} variant="primary" size="md">
                {commoditiesOnly ? labels.emptyCta : labels.reset}
              </ButtonLink>
              {!commoditiesOnly ? (
                <button type="button" onClick={resetAll} className="btn btn--ghost btn--sm">
                  {labels.reset}
                </button>
              ) : null}
            </Reveal>
          ) : view === 'table' ? (
            /* ---- JADVAL ---- */
            <div className="overflow-x-auto rounded-media border border-line-soft">
              <table className="data-table" style={{ minWidth: 920 }}>
                <caption className="sr-only">{labels.colProduct}</caption>
                <thead>
                  <tr>
                    <th scope="col">{labels.colProduct}</th>
                    <th scope="col">{labels.colGroup}</th>
                    <th scope="col">{labels.colForm}</th>
                    <th scope="col">{labels.colDose}</th>
                    <th scope="col">{labels.colStock}</th>
                    <th scope="col" className="text-right">
                      {labels.colSample}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((c) => (
                    <tr key={c.sku}>
                      <td>
                        <Link href={`${productHrefBase}/${c.slug}`} className="flex flex-col gap-1 no-underline">
                          <span className="text-[17px] font-semibold text-ink">{tr(c.name, locale)}</span>
                          <span className="text-[13px] tracking-[0.04em] text-muted">{c.sku}</span>
                        </Link>
                      </td>
                      <td>{groupLabels[c.group] ?? c.group}</td>
                      <td>{formLabels[c.form] ?? c.form}</td>
                      <td className="font-medium text-ink">
                        {c.dosageMin}–{c.dosageMax}%
                      </td>
                      <td>
                        <StockDot
                          state={c.availability}
                          label={
                            c.availability === 'in-stock'
                              ? labels.inStock
                              : c.availability === 'on-order'
                                ? labels.onOrder
                                : labels.availabilityNew
                          }
                        />
                      </td>
                      <td className="text-right">
                        <AddSampleButton
                          product={c}
                          locale={locale}
                          labels={labels.add}
                          source="catalog"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* ---- KARTOCHKALAR ---- */
            <RevealGroup className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
              {cards.map((c, i) => (
                <Reveal key={c.sku} index={i} className="flex min-h-[240px] flex-col gap-[18px] rounded-menu bg-panel p-[26px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] tracking-[0.04em] text-muted">{c.sku}</span>
                    <Pill className="text-[13px]">{groupLabels[c.group] ?? c.group}</Pill>
                  </div>
                  <Link
                    href={`${productHrefBase}/${c.slug}`}
                    className="flex-grow text-[22px] font-medium leading-[1.2] tracking-[-0.01em] text-ink no-underline"
                  >
                    {tr(c.name, locale)}
                  </Link>
                  <div className="flex items-end justify-between gap-3">
                    <span className="flex flex-col gap-1 text-[14px] text-body">
                      <span>{formLabels[c.form] ?? c.form}</span>
                      <span className="font-semibold text-ink">
                        {c.dosageMin}–{c.dosageMax}%
                      </span>
                    </span>
                    <AddSampleButton product={c} locale={locale} labels={labels.add} source="catalog" />
                  </div>
                </Reveal>
              ))}
            </RevealGroup>
          )}

          {/* ---- PAGINATION ---- */}
          {total > 0 ? (
            <nav
              aria-label={labels.pagination}
              className="flex flex-wrap items-center justify-between gap-4 px-2 pt-4"
            >
              <span className="text-[15px] text-muted">
                {fillVars(labels.resultLineTpl, { from, to, total })}
              </span>

              <div className="flex gap-1.5">
                {pageNumbers(page, totalPages).map((n, i) =>
                  n === '…' ? (
                    <span
                      key={`gap-${i}`}
                      className="flex h-11 w-11 items-center justify-center text-muted"
                      aria-hidden
                    >
                      …
                    </span>
                  ) : (
                    <Link
                      key={n}
                      href={`?${new URLSearchParams({ ...Object.fromEntries(params.entries()), page: String(n) }).toString()}`}
                      scroll={false}
                      aria-current={n === page ? 'page' : undefined}
                      onClick={() => track.pageChange(n)}
                      className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-pill text-[15px] no-underline transition-colors',
                        n === page
                          ? 'bg-navy font-medium text-white'
                          : 'border border-line text-ink hover:border-ink',
                      )}
                    >
                      {n}
                    </Link>
                  ),
                )}
              </div>

              {page < totalPages ? (
                <button type="button" onClick={() => setPage(page + 1)} className="btn btn--outline btn--sm">
                  {labels.showMore}
                </button>
              ) : null}
            </nav>
          ) : null}
        </div>
      </div>

      {/* ============================================================
          FILTR SHEET'I (<900px, §9)
          ============================================================ */}
      <AnimatePresence>
        {sheetOpen ? (
          <>
            <motion.div
              key="sheet-backdrop"
              className="fixed inset-0 z-[115] bg-navy/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: dur.base, ease: ease.out }}
              onClick={() => setSheetOpen(false)}
              aria-hidden
            />
            <motion.div
              key="sheet"
              role="dialog"
              aria-modal="true"
              aria-label={labels.filtersBtn}
              className="fixed inset-x-0 bottom-0 z-[116] max-h-[85dvh] overflow-y-auto rounded-t-block bg-white p-6 pb-[max(24px,env(safe-area-inset-bottom))]"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: dur.slow, ease: ease.out }}
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="text-[22px] font-medium">{labels.filtersBtn}</span>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  aria-label={labels.filtersClose}
                  className="btn-icon btn-icon--44 btn-icon--outline"
                >
                  <X size={18} strokeWidth={2} aria-hidden />
                </button>
              </div>

              <div className="flex flex-col gap-3.5">{filtersBody}</div>

              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="btn btn--accent btn--lg mt-5 w-full"
              >
                {fillVars(labels.filtersApplyTpl, { count: total })}
              </button>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

/** 1 … 4 5 [6] 7 8 … 26 */
function pageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | '…')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push('…');
  for (let i = start; i <= end; i += 1) out.push(i);
  if (end < total - 1) out.push('…');
  out.push(total);
  return out;
}
