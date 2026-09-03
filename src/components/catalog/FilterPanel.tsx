'use client';

/**
 * FILTR PANELI
 * ----------------------------------------------------------------
 * Barcha filtr o'lchamlari: kategoriya, guruh, qo'llash sohasi, shakl,
 * qadoq, xususiyatlar, mavjudlik + maksimal doza + "faqat yangi/xit".
 *
 * Desktopda — yon ustun (sticky), mobilda — Drawer ichida.
 * Har bir o'zgarish darhol URL'ga yoziladi → havolani ulashish mumkin.
 */

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { CatalogFilters, Facet } from '@/lib/types';
import { useI18n } from '@/components/i18n/I18nProvider';
import { FacetGroup } from './FacetGroup';
import { Icon } from '@/components/ui/Icon';

/** Doza bosqichlari (%) — katalogdagi real diapazonga moslashtirilgan */
const DOSE_STEPS = [0.05, 0.1, 0.2, 0.3, 0.5, 1, 2, 5];

interface Props {
  facets: Facet[];
  filters: CatalogFilters;
  onPatch: (patch: Partial<CatalogFilters>) => void;
  onReset: () => void;
  activeCount: number;
  className?: string;
}

export function FilterPanel({ facets, filters, onPatch, onReset, activeCount, className }: Props) {
  const { t } = useI18n();

  const toggleValue = (key: string, id: string) => {
    const listKey = key as keyof CatalogFilters;
    const current = filters[listKey];
    if (!Array.isArray(current)) return;

    // Qadoq sonlar bilan saqlanadi
    const isNum = key === 'packaging';
    const next = current.map(String).includes(id)
      ? current.filter((v: string | number) => String(v) !== id)
      : [...current, isNum ? Number(id) : id];

    onPatch({ [key]: next } as Partial<CatalogFilters>);
  };

  const doseLabel = useMemo(() => {
    if (filters.dosageMax == null) return t('catalog.doseMax');
    return `${t('catalog.doseMax')} ≤ ${filters.dosageMax}%`;
  }, [filters.dosageMax, t]);

  return (
    <div className={cn('flex flex-col', className)}>
      {/* ---- Sarlavha + tozalash ---- */}
      <div className="flex items-center gap-2 border-b border-cream-200 px-3.5 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mint-100 text-teal-600" aria-hidden>
          <Icon name="sliders" size={15} />
        </span>
        <h2 className="flex-1 font-display text-[14px] font-extrabold tracking-tight text-pine-900">
          {t('catalog.filters')}
        </h2>
        {activeCount > 0 ? (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1.5 font-mono text-[10.5px] font-extrabold text-white">
            {activeCount}
          </span>
        ) : null}
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 rounded-lg border border-cream-300 px-2 py-1 text-[11.5px] font-semibold text-slate-warm-600 transition hover:border-clay-400 hover:bg-clay-100 hover:text-clay-600"
          >
            <Icon name="refresh" size={12} />
            {t('catalog.resetAll')}
          </button>
        ) : null}
      </div>

      {/* ---- Tezkor rejimlar ---- */}
      <div className="flex flex-wrap gap-1.5 border-b border-cream-200 px-3.5 py-3">
        <button
          type="button"
          onClick={() => onPatch({ onlyNew: !filters.onlyNew })}
          aria-pressed={filters.onlyNew}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold transition',
            filters.onlyNew
              ? 'border-teal-600 bg-teal-600 text-white'
              : 'border-cream-300 bg-white text-slate-warm-700 hover:border-teal-500/50 hover:text-teal-600',
          )}
        >
          <Icon name="sparkles" size={13} />
          {t('catalog.onlyNew')}
        </button>
        <button
          type="button"
          onClick={() => onPatch({ onlyTop: !filters.onlyTop })}
          aria-pressed={filters.onlyTop}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold transition',
            filters.onlyTop
              ? 'border-gold-500 bg-gold-500 text-pine-950'
              : 'border-cream-300 bg-white text-slate-warm-700 hover:border-gold-500/60 hover:text-gold-600',
          )}
        >
          <Icon name="star" size={13} />
          {t('catalog.onlyTop')}
        </button>
      </div>

      {/* ---- Facetlar ---- */}
      <div className="flex flex-col">
        {facets.map((facet, i) => (
          <FacetGroup
            key={facet.key}
            facet={facet}
            onToggle={toggleValue}
            defaultOpen={i < 3 || facet.hasSelection}
            removeLabel={t('common.close')}
            searchLabel={t('common.search')}
            moreLabel={(n) => `+${n}`}
            lessLabel={t('common.showLess')}
          />
        ))}

        {/* ---- Doza ---- */}
        <section className="border-b border-cream-200 px-3.5 py-3">
          <h3 className="text-[12.5px] font-bold uppercase tracking-[0.06em] text-pine-800">{doseLabel}</h3>
          <p className="mt-1 text-[11.5px] leading-snug text-slate-warm-500">{t('catalog.doseMaxHint')}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onPatch({ dosageMax: null })}
              aria-pressed={filters.dosageMax == null}
              className={cn(
                'rounded-full border px-2.5 py-1 text-[12px] font-semibold transition',
                filters.dosageMax == null
                  ? 'border-teal-600 bg-teal-600 text-white'
                  : 'border-cream-300 bg-white text-slate-warm-700 hover:border-teal-500/50 hover:text-teal-600',
              )}
            >
              {t('common.all')}
            </button>
            {DOSE_STEPS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onPatch({ dosageMax: filters.dosageMax === d ? null : d })}
                aria-pressed={filters.dosageMax === d}
                className={cn(
                  'rounded-full border px-2.5 py-1 font-mono text-[12px] font-semibold transition',
                  filters.dosageMax === d
                    ? 'border-teal-600 bg-teal-600 text-white'
                    : 'border-cream-300 bg-white text-slate-warm-700 hover:border-teal-500/50 hover:text-teal-600',
                )}
              >
                ≤{d}%
              </button>
            ))}
          </div>
        </section>
      </div>

      {facets.length === 0 ? (
        <p className="px-3.5 py-6 text-center text-[13px] text-slate-warm-500">{t('catalog.noResultsHint')}</p>
      ) : null}
    </div>
  );
}

export default FilterPanel;
