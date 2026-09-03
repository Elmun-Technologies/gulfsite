'use client';

/**
 * FACET GURUHI — bitta filtr o'lchami
 * ----------------------------------------------------------------
 * Xususiyatlari:
 *   - Yig'iladigan/ochiladigan (uzun ro'yxatlarda joy tejaydi)
 *   - 8+ qiymat bo'lsa guruh ICHIDA qidiruv paydo bo'ladi
 *     (masalan 19 ta ta'm guruhi — "citrus" deb yozsangiz tez topasiz)
 *   - Har bir qiymat yonida NATIJA SONI (hisoblagich) — foydalanuvchi
 *     tanlashdan oldin nechta mahsulot ko'rishini biladi
 *   - "0 natija" qiymatlar xira ko'rinadi, lekin tanlangan bo'lsa yashirilmaydi
 *   - Tanlangan qiymatlar doim ro'yxatning boshida
 */

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Facet, FacetOption } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';

const SEARCH_THRESHOLD = 8;
const COLLAPSED_LIMIT = 7;

interface Props {
  facet: Facet;
  onToggle: (key: string, id: string) => void;
  /** Boshlang'ich holatda ochiqmi */
  defaultOpen?: boolean;
  removeLabel: string;
  searchLabel: string;
  moreLabel: (n: number) => string;
  lessLabel: string;
}

export function FacetGroup({
  facet,
  onToggle,
  defaultOpen,
  removeLabel,
  searchLabel,
  moreLabel,
  lessLabel,
}: Props) {
  const [open, setOpen] = useState(defaultOpen ?? facet.hasSelection);
  const [inner, setInner] = useState('');
  const [expanded, setExpanded] = useState(false);

  const needsSearch = facet.options.length > SEARCH_THRESHOLD;

  const visible = useMemo(() => {
    let list = facet.options;
    const q = inner.trim().toLowerCase();
    if (q) {
      list = list.filter((o) => o.label.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
    }
    // Tanlanganlar doim ko'rinadi
    const active = list.filter((o) => o.active);
    const rest = list.filter((o) => !o.active);
    const merged = [...active, ...rest];
    if (!q && !expanded && merged.length > COLLAPSED_LIMIT) return merged.slice(0, COLLAPSED_LIMIT);
    return merged;
  }, [facet.options, inner, expanded]);

  const hiddenCount = !inner && !expanded ? Math.max(0, facet.options.length - COLLAPSED_LIMIT) : 0;
  const selectedCount = facet.options.filter((o) => o.active).length;

  return (
    <section
      className={cn(
        'border-b border-cream-200 last:border-b-0',
        facet.hasSelection && 'bg-mint-50/40',
      )}
      aria-labelledby={`facet-${facet.key}`}
    >
      <h3>
        <button
          type="button"
          id={`facet-${facet.key}`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left transition hover:bg-cream-50"
        >
          <span className="flex-1 text-[12.5px] font-bold uppercase tracking-[0.06em] text-pine-800">
            {facet.label}
          </span>
          {selectedCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1.5 font-mono text-[10.5px] font-extrabold text-white">
              {selectedCount}
            </span>
          ) : null}
          <Icon
            name="chevron-down"
            size={15}
            strokeWidth={2.2}
            className={cn('shrink-0 text-slate-warm-500 transition-transform duration-200', open && 'rotate-180')}
          />
        </button>
      </h3>

      {open ? (
        <div className="px-3.5 pb-3">
          {needsSearch ? (
            <div className="relative mb-2">
              <Icon
                name="search"
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-warm-500"
              />
              <input
                type="search"
                value={inner}
                onChange={(e) => {
                  setInner(e.target.value);
                  setExpanded(true);
                }}
                placeholder={searchLabel}
                aria-label={`${facet.label}: ${searchLabel}`}
                className="h-8 w-full rounded-lg border border-cream-300 bg-white pl-8 pr-2 text-[12.5px] text-ink placeholder:text-slate-warm-500/70 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          ) : null}

          <ul className="flex flex-col gap-0.5">
            {visible.map((o: FacetOption) => {
              const disabled = o.count === 0 && !o.active;
              return (
                <li key={o.id}>
                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition select-none',
                      disabled ? 'cursor-not-allowed opacity-45' : 'hover:bg-cream-50',
                      o.active && 'bg-mint-100/70 hover:bg-mint-100',
                    )}
                  >
                    <span className="relative flex h-[16px] w-[16px] shrink-0 items-center justify-center">
                      <input
                        type="checkbox"
                        checked={o.active}
                        disabled={disabled}
                        onChange={() => onToggle(String(facet.key), o.id)}
                        className="peer h-[16px] w-[16px] cursor-pointer appearance-none rounded border border-cream-300 bg-white transition checked:border-teal-600 checked:bg-teal-600 focus-visible:outline-2 focus-visible:outline-teal-500 focus-visible:outline-offset-2 disabled:cursor-not-allowed"
                        aria-label={o.label}
                      />
                      <Icon
                        name="check"
                        size={11}
                        strokeWidth={3}
                        className="pointer-events-none absolute text-white opacity-0 transition peer-checked:opacity-100"
                      />
                    </span>

                    {o.color ? (
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/5" style={{ backgroundColor: o.color }} aria-hidden />
                    ) : null}

                    <span className={cn('min-w-0 flex-1 truncate text-[13px]', o.active ? 'font-bold text-pine-900' : 'text-slate-warm-700')}>
                      {o.label}
                    </span>

                    <span
                      className={cn(
                        'shrink-0 rounded px-1 font-mono text-[10.5px] tabular-nums',
                        o.active ? 'bg-teal-600/12 text-teal-600' : 'bg-cream-100 text-slate-warm-500',
                      )}
                      title={`${o.count}`}
                    >
                      {o.count}
                    </span>
                  </label>
                </li>
              );
            })}

            {visible.length === 0 ? (
              <li className="px-2 py-2 text-[12px] text-slate-warm-500">—</li>
            ) : null}
          </ul>

          {hiddenCount > 0 ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="mt-1.5 inline-flex items-center gap-1 px-2 text-[12px] font-semibold text-teal-600 transition hover:text-pine-800"
            >
              <Icon name="plus" size={12} strokeWidth={2.4} />
              {moreLabel(hiddenCount)}
            </button>
          ) : expanded && facet.options.length > COLLAPSED_LIMIT ? (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="mt-1.5 inline-flex items-center gap-1 px-2 text-[12px] font-semibold text-slate-warm-600 transition hover:text-teal-600"
            >
              <Icon name="minus" size={12} strokeWidth={2.4} />
              {lessLabel}
            </button>
          ) : null}
        </div>
      ) : null}

      {/* Yopiq holatda tanlovlarni qisqacha ko'rsatish */}
      {!open && selectedCount > 0 ? (
        <div className="flex flex-wrap gap-1 px-3.5 pb-2.5">
          {facet.options
            .filter((o) => o.active)
            .slice(0, 3)
            .map((o) => (
              <span key={o.id} className="rounded bg-mint-100 px-1.5 py-0.5 text-[10.5px] font-semibold text-teal-600">
                {o.label}
              </span>
            ))}
          {selectedCount > 3 ? (
            <span className="rounded bg-mint-100 px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-teal-600">
              +{selectedCount - 3}
            </span>
          ) : null}
          <span className="sr-only">{removeLabel}</span>
        </div>
      ) : null}
    </section>
  );
}

export default FacetGroup;
