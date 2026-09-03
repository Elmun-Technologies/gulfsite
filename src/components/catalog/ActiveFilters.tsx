'use client';

/**
 * FAOL FILTRLAR — chip qatori
 * ----------------------------------------------------------------
 * Foydalanuvchi nima tanlaganini DOIM ko'rib turadi va bittadan
 * olib tashlay oladi. Uzun chip qatori natijalarni yashirmasligi
 * uchun gorizontal scroll (mobil) ishlatiladi.
 */

import { cn } from '@/lib/utils';
import { FilterChip } from '@/components/ui/Display';
import { Icon } from '@/components/ui/Icon';
import { useI18n } from '@/components/i18n/I18nProvider';

export interface Chip {
  key: string;
  id?: string;
  label: string;
}

interface Props {
  chips: Chip[];
  onRemove: (key: string, id?: string) => void;
  onReset: () => void;
  className?: string;
}

export function ActiveFilters({ chips, onRemove, onReset, className }: Props) {
  const { t } = useI18n();
  if (chips.length === 0) return null;

  return (
    <div className={cn('flex items-start gap-2', className)}>
      <span className="mt-1.5 hidden shrink-0 items-center gap-1 text-[11.5px] font-bold uppercase tracking-wide text-slate-warm-500 sm:inline-flex">
        <Icon name="filter" size={12} />
        {t('catalog.activeFilters')}
      </span>
      <div className="no-scrollbar -mx-1 flex min-w-0 flex-1 gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
        {chips.map((c) => (
          <FilterChip
            key={`${c.key}:${c.id ?? ''}`}
            label={c.label}
            onRemove={() => onRemove(c.key, c.id)}
            removeLabel={`${t('common.close')}: ${c.label}`}
            className="shrink-0"
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-0.5 inline-flex h-7 shrink-0 items-center gap-1 rounded-lg border border-cream-300 px-2 text-[11.5px] font-semibold text-slate-warm-600 transition hover:border-clay-400 hover:bg-clay-100 hover:text-clay-600"
      >
        <Icon name="refresh" size={12} />
        <span className="hidden sm:inline">{t('catalog.resetAll')}</span>
      </button>
    </div>
  );
}

export default ActiveFilters;
