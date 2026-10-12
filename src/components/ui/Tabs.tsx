'use client';

/**
 * TABS — pill tab'lar, faol fon `layoutId` bilan suriladi (§5, §8.3)
 * ----------------------------------------------------------------
 * · 320ms, ease.out — faol fon bir tabdan ikkinchisiga silliq o'tadi
 * · mobil: gorizontal scroll, bitta qator, scrollbar yashirin,
 *   chetida 24px fade-mask (§9)
 * · klaviatura: ←/→ va Home/End, `role="tablist"` (§14)
 * · faol tab ko'rinadigan joyga avtomatik scroll bo'ladi
 */

import { useCallback, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { dur, ease } from '@/lib/motion';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  href?: string;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  /** layoutId — bir sahifada bir nechta Tabs bo'lsa har xil bo'lsin */
  layoutId?: string;
  ariaLabel?: string;
  className?: string;
  /** kichik o'lcham (ko'rinish toggle uchun) */
  compact?: boolean;
}

export function Tabs({
  items,
  value,
  onChange,
  layoutId = 'tab',
  ariaLabel,
  className,
  compact = false,
}: TabsProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  // Faol tab har doim ko'rinadigan joyda (mobil gorizontal scroll)
  useEffect(() => {
    const el = activeRef.current;
    const box = listRef.current;
    if (!el || !box || box.scrollWidth <= box.clientWidth) return;
    const target = el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2;
    box.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [value]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const i = items.findIndex((it) => it.id === value);
      let next = -1;
      if (e.key === 'ArrowRight') next = (i + 1) % items.length;
      else if (e.key === 'ArrowLeft') next = (i - 1 + items.length) % items.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = items.length - 1;
      if (next < 0) return;
      e.preventDefault();
      const item = items[next];
      if (item) onChange(item.id);
    },
    [items, value, onChange],
  );

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn(
        'no-scrollbar fade-mask-x flex flex-nowrap items-center gap-2.5 overflow-x-auto pb-1',
        className,
      )}
    >
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            ref={selected ? activeRef : undefined}
            type="button"
            role="tab"
            id={`tab-${layoutId}-${item.id}`}
            aria-selected={selected}
            aria-controls={`panel-${layoutId}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            style={{ flexShrink: 0 }}
            className={cn(
              'relative isolate inline-flex shrink-0 items-center gap-2.5 rounded-pill border text-[16px] font-medium transition-colors',
              compact ? 'h-11 px-4 text-[15px]' : 'h-12 px-5',
              selected ? 'border-transparent text-white' : 'border-line text-ink hover:border-ink',
            )}
          >
            {selected ? (
              <motion.span
                layoutId={`${layoutId}-bg`}
                className="absolute inset-0 -z-10 rounded-pill bg-navy"
                transition={{ duration: dur.base, ease: ease.out }}
              />
            ) : null}
            <span className="relative">{item.label}</span>
            {typeof item.count === 'number' ? (
              <span
                className={cn(
                  'relative text-[13px] font-semibold',
                  selected ? 'text-copper-light' : 'text-muted',
                )}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Segmented switch — Jadval/Kartochka, 25/50/100 g, til (§8.3).
 * `role="radiogroup"` (§14), faol fon `layoutId` bilan suriladi.
 */
export interface SegmentOption<T extends string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  layoutId = 'segment',
  ariaLabel,
  onPanel = true,
  className,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (id: T) => void;
  layoutId?: string;
  ariaLabel?: string;
  /** panel fon (default) yoki kontur (til switch) */
  onPanel?: boolean;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        'flex shrink-0 items-center rounded-pill p-1',
        onPanel ? 'bg-panel' : 'border border-line-warm',
        className,
      )}
    >
      {options.map((opt) => {
        const selected = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.id)}
            className={cn(
              'relative isolate inline-flex h-11 items-center justify-center gap-2 rounded-pill px-4 text-[15px] font-medium transition-colors',
              selected ? 'text-ink' : 'text-muted hover:text-ink',
            )}
          >
            {selected ? (
              <motion.span
                layoutId={`${layoutId}-bg`}
                className={cn('absolute inset-0 -z-10 rounded-pill', onPanel ? 'bg-white' : 'bg-ink')}
                transition={{ duration: dur.base, ease: ease.out }}
              />
            ) : null}
            <span className={cn('relative', selected && !onPanel && 'text-white')}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
