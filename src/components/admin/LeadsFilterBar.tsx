/**
 * ADMIN — ARIZALAR FILTRI
 * ----------------------------------------------------------------
 * Filtr URL'da saqlanadi (?q=&status=&type=&period=&sort=&page=).
 * Nega URL: savdo menejeri filtrlangan ro'yxatni hamkasbiga havola
 * qilib yuborishi yoki xatcho'pga olishi mumkin — bu CRM'larda eng
 * ko'p ishlatiladigan imkoniyat.
 *
 * O'zgarish `router.replace` bilan kiritiladi (tarixni to'ldirmaydi),
 * `page` esa har qanday filtr o'zgarishida 1-ga qaytariladi.
 */

'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useRef, useState, useTransition } from 'react';
import { useI18n } from '@/components/i18n/I18nProvider';
import { Icon } from '@/components/ui/Icon';
import { cn, debounce } from '@/lib/utils';
import { LEAD_STATUSES, LEAD_TYPES, tr, type Locale } from '@/lib/taxonomy';

interface Props {
  locale: Locale;
  total: number;
}

const PERIODS = ['all', 'today', '7d', '30d'] as const;
const SORTS = ['newest', 'oldest', 'quality'] as const;

export function LeadsFilterBar({ locale, total }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname() ?? `/${locale}/admin/leads`;
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const [q, setQ] = useState(params.get('q') ?? '');

  const push = useCallback(
    (mutate: (sp: URLSearchParams) => void, resetPage = true) => {
      const sp = new URLSearchParams(params.toString());
      mutate(sp);
      if (resetPage) sp.delete('page');
      const qs = sp.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [params, pathname, router],
  );

  // Qidiruv — 350ms debounced (har bir belgida serverni urmaslik uchun)
  const debouncedRef = useRef(
    debounce((value: string) => {
      push((sp) => {
        if (value.trim()) sp.set('q', value.trim());
        else sp.delete('q');
      });
    }, 350),
  );

  const toggleList = (key: 'status' | 'type' | 'region', value: string) => {
    push((sp) => {
      const cur = (sp.get(key) ?? '').split(',').filter(Boolean);
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      if (next.length) sp.set(key, next.join(','));
      else sp.delete(key);
    });
  };

  const activeStatus = (params.get('status') ?? '').split(',').filter(Boolean);
  const activeType = (params.get('type') ?? '').split(',').filter(Boolean);
  const period = params.get('period') ?? 'all';
  const sort = params.get('sort') ?? 'newest';
  const activeCount =
    (params.get('q') ? 1 : 0) + activeStatus.length + activeType.length + (period !== 'all' ? 1 : 0) + (sort !== 'newest' ? 1 : 0);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-cream-200 bg-white p-3.5 shadow-soft">
      {/* Qidiruv + davr + saralash */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[14rem] flex-1">
          <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-warm-500" />
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              debouncedRef.current(e.target.value);
            }}
            placeholder={t('admin.leads.search')}
            maxLength={120}
            aria-label={t('admin.leads.search')}
            className="h-10 w-full rounded-lg border border-cream-300 bg-white pr-3 pl-9 text-[13px] text-pine-900 shadow-soft transition focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/12"
          />
        </div>

        <div className="flex items-center gap-1.5" role="group" aria-label={t('admin.leads.filterPeriod')}>
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => push((sp) => (p === 'all' ? sp.delete('period') : sp.set('period', p)))}
              className={cn(
                'h-10 rounded-lg px-3 text-[12.5px] font-bold transition',
                period === p
                  ? 'bg-pine-900 text-white shadow-soft'
                  : 'border border-cream-300 bg-white text-pine-800 hover:border-teal-500 hover:text-teal-600',
              )}
              aria-pressed={period === p}
            >
              {t(`admin.leads.period.${p}` as 'admin.leads.period.all')}
            </button>
          ))}
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => push((sp) => (e.target.value === 'newest' ? sp.delete('sort') : sp.set('sort', e.target.value)))}
            aria-label={t('catalog.sort')}
            className="h-10 appearance-none rounded-lg border border-cream-300 bg-white pr-8 pl-3 text-[12.5px] font-semibold text-pine-800 shadow-soft transition focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/12"
          >
            {SORTS.map((s) => (
              <option key={s} value={s}>
                {s === 'newest'
                  ? locale === 'ru' ? 'Сначала новые' : locale === 'en' ? 'Newest first' : 'Yangi → eski'
                  : s === 'oldest'
                    ? locale === 'ru' ? 'Сначала старые' : locale === 'en' ? 'Oldest first' : 'Eski → yangi'
                    : locale === 'ru' ? 'По качеству' : locale === 'en' ? 'By quality' : 'Sifat bo‘yicha'}
              </option>
            ))}
          </select>
          <Icon name="chevron-down" size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-warm-500" />
        </div>

        {/* CSV eksport — bu API endpoint (sahifa emas), shuning uchun oddiy <a> */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/admin/leads/export?format=csv"
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-cream-300 bg-white px-3 text-[12.5px] font-bold text-pine-800 shadow-soft transition hover:border-teal-500 hover:text-teal-600"
        >
          <Icon name="download" size={15} />
          <span className="hidden sm:inline">{t('admin.leads.export')}</span>
        </a>
      </div>

      {/* Holatlar */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-cream-200 pt-3">
        <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-warm-500">
          {t('admin.leads.columns.status')}
        </span>
        {Object.entries(LEAD_STATUSES).map(([id, meta]) => {
          const on = activeStatus.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleList('status', id)}
              aria-pressed={on}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-bold transition',
                on ? 'text-white' : 'bg-white text-pine-800 hover:border-teal-500',
              )}
              style={
                on
                  ? { backgroundColor: meta.color, borderColor: meta.color }
                  : { borderColor: `${meta.color}44`, color: meta.color }
              }
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: on ? '#fff' : meta.color }} aria-hidden />
              {tr(meta.name, locale, id)}
            </button>
          );
        })}
      </div>

      {/* Turlar */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-cream-200 pt-3">
        <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-warm-500">
          {t('admin.leads.columns.type')}
        </span>
        {Object.entries(LEAD_TYPES).map(([id, meta]) => {
          const on = activeType.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleList('type', id)}
              aria-pressed={on}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-bold transition',
                on ? 'text-white' : 'bg-white text-pine-800 hover:border-teal-500',
              )}
              style={
                on
                  ? { backgroundColor: meta.color, borderColor: meta.color }
                  : { borderColor: `${meta.color}44`, color: meta.color }
              }
            >
              {tr(meta.name, locale, id)}
            </button>
          );
        })}

        {activeCount > 0 ? (
          <button
            type="button"
            onClick={() => startTransition(() => router.replace(pathname, { scroll: false }))}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-cream-300 bg-white px-2.5 py-1.5 text-[11.5px] font-bold text-clay-600 transition hover:border-clay-500 hover:bg-clay-50"
          >
            <Icon name="close" size={13} />
            {t('catalog.reset')} ({activeCount})
          </button>
        ) : (
          <span className="ml-auto font-mono text-[11.5px] text-slate-warm-500 tabular-nums">
            {total} {t('common.results')}
          </span>
        )}
      </div>
    </div>
  );
}
