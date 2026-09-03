'use client';

import { useId, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from './Icon';

/* ============================================================
   BADGE / CHIP
   ============================================================ */

type Tone = 'neutral' | 'pine' | 'teal' | 'mint' | 'gold' | 'clay' | 'cream';

const TONES: Record<Tone, string> = {
  neutral: 'bg-slate-warm-100 text-slate-warm-700 border-slate-warm-200',
  pine: 'bg-pine-800 text-cream-50 border-pine-800',
  teal: 'bg-teal-600 text-white border-teal-600',
  mint: 'bg-mint-100 text-teal-600 border-mint-200',
  gold: 'bg-gold-400/25 text-gold-600 border-gold-400/50',
  clay: 'bg-clay-300/20 text-clay-600 border-clay-300/50',
  cream: 'bg-cream-100 text-pine-700 border-cream-200',
};

export function Badge({
  tone = 'neutral',
  icon,
  children,
  className,
  size = 'sm',
}: {
  tone?: Tone;
  icon?: IconName;
  children: ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border font-semibold whitespace-nowrap',
        size === 'xs' && 'px-1.5 py-0.5 text-[10.5px]',
        size === 'sm' && 'px-2 py-0.5 text-[11.5px]',
        size === 'md' && 'px-2.5 py-1 text-[13px]',
        TONES[tone],
        className,
      )}
    >
      {icon ? <Icon name={icon} size={size === 'xs' ? 10 : 12} /> : null}
      {children}
    </span>
  );
}

/** Olib tashlanadigan filtr chipi */
export function FilterChip({
  label,
  count,
  onRemove,
  removeLabel,
  className,
}: {
  label: ReactNode;
  count?: number;
  onRemove: () => void;
  removeLabel: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border border-teal-500/35 bg-mint-100 py-1 pl-2.5 pr-1 text-[12.5px] font-medium text-teal-600',
        className,
      )}
    >
      <span className="truncate">{label}</span>
      {typeof count === 'number' ? <span className="font-mono text-[11px] text-teal-500/80">{count}</span> : null}
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        title={removeLabel}
        className="rounded p-0.5 transition hover:bg-teal-600 hover:text-white focus-visible:outline-2 focus-visible:outline-teal-600"
      >
        <Icon name="close" size={12} strokeWidth={2.5} />
      </button>
    </span>
  );
}

/** Tanlanadigan pill-chip (filtrlar uchun) */
export function ToggleChip({
  active,
  onClick,
  children,
  count,
  className,
  size = 'md',
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  count?: number;
  className?: string;
  size?: 'sm' | 'md';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium transition active:scale-[0.97]',
        size === 'sm' ? 'px-2.5 py-1 text-[12px]' : 'px-3.5 py-1.5 text-[13px]',
        active
          ? 'border-teal-600 bg-teal-600 text-white shadow-soft'
          : 'border-cream-300 bg-white text-slate-warm-700 hover:border-teal-500/50 hover:bg-mint-100/50 hover:text-teal-600',
        className,
      )}
    >
      {children}
      {typeof count === 'number' ? (
        <span className={cn('font-mono text-[11px]', active ? 'text-white/75' : 'text-slate-warm-500')}>{count}</span>
      ) : null}
    </button>
  );
}

/* ============================================================
   KARTOCHKA
   ============================================================ */

export function Card({
  children,
  className,
  as: Tag = 'div',
  hover,
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section' | 'li';
  hover?: boolean;
}) {
  return (
    <Tag
      className={cn(
        'rounded-2xl border border-cream-200 bg-white shadow-soft',
        hover && 'transition duration-300 hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-lift',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* ============================================================
   SKELETON — yuklanish holati
   ============================================================ */

export function Skeleton({ className, rounded = 'md' }: { className?: string; rounded?: 'sm' | 'md' | 'lg' | 'full' }) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-shimmer bg-cream-200/70',
        rounded === 'sm' && 'rounded',
        rounded === 'md' && 'rounded-lg',
        rounded === 'lg' && 'rounded-2xl',
        rounded === 'full' && 'rounded-full',
        className,
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-cream-200 bg-white p-4 shadow-soft">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="mt-3 h-5 w-4/5" />
      <Skeleton className="mt-2 h-4 w-2/3" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-20" rounded="full" />
        <Skeleton className="h-6 w-16" rounded="full" />
      </div>
      <Skeleton className="mt-4 h-9 w-full" />
    </div>
  );
}

export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className={cn('h-11', i % 3 === 0 ? 'w-full' : i % 3 === 1 ? 'w-[92%]' : 'w-[78%]')} />
      ))}
    </div>
  );
}

/* ============================================================
   BO'SH HOLAT
   ============================================================ */

export function EmptyState({
  icon = 'search',
  title,
  description,
  action,
  className,
  compact,
}: {
  icon?: IconName;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-cream-300 bg-cream-50/60 text-center',
        compact ? 'gap-2 p-6' : 'gap-3 p-10 sm:p-14',
        className,
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center rounded-full bg-mint-100 text-teal-600',
          compact ? 'h-9 w-9' : 'h-14 w-14',
        )}
      >
        <Icon name={icon} size={compact ? 18 : 26} />
      </span>
      <h3 className={cn('font-display font-bold text-pine-900', compact ? 'text-sm' : 'text-lg')}>{title}</h3>
      {description ? (
        <p className={cn('max-w-md text-slate-warm-600', compact ? 'text-[12.5px]' : 'text-sm leading-relaxed')}>
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-1 flex flex-wrap items-center justify-center gap-2">{action}</div> : null}
    </div>
  );
}

/* ============================================================
   ACCORDION — savol-javob, filtr guruhlarini yig'ish
   ============================================================ */

export function Accordion({
  items,
  defaultOpen = 0,
  className,
  allowMultiple = false,
}: {
  items: { title: ReactNode; content: ReactNode; badge?: ReactNode }[];
  defaultOpen?: number | number[];
  className?: string;
  allowMultiple?: boolean;
}) {
  const base = useId();
  const initial = Array.isArray(defaultOpen) ? defaultOpen : defaultOpen >= 0 ? [defaultOpen] : [];
  const [open, setOpen] = useState<number[]>(initial);

  const toggle = (i: number) =>
    setOpen((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : allowMultiple ? [...prev, i] : [i],
    );

  return (
    <div className={cn('divide-y divide-cream-200 overflow-hidden rounded-2xl border border-cream-200 bg-white', className)}>
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                id={`${base}-h-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-p-${i}`}
                onClick={() => toggle(i)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-cream-50 sm:px-5"
              >
                <span className="flex-1 font-display text-[15px] font-bold text-pine-900">{item.title}</span>
                {item.badge}
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cream-200 bg-cream-50 text-teal-600 transition-transform duration-300',
                    isOpen && 'rotate-180 border-teal-500/40 bg-mint-100',
                  )}
                >
                  <Icon name="chevron-down" size={15} strokeWidth={2.2} />
                </span>
              </button>
            </h3>
            <div
              id={`${base}-p-${i}`}
              role="region"
              aria-labelledby={`${base}-h-${i}`}
              hidden={!isOpen}
              className="px-4 pb-4 text-[14px] leading-relaxed text-slate-warm-700 sm:px-5 sm:pb-5"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   SARLAVHA BLOKI
   ============================================================ */

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  action,
  level = 2,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  action?: ReactNode;
  level?: 2 | 3;
}) {
  const Tag = level === 2 ? 'h2' : 'h3';
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        action && 'sm:flex-row sm:items-end sm:justify-between sm:gap-6',
        className,
      )}
    >
      <div className={cn('flex max-w-2xl flex-col gap-2.5', align === 'center' && 'items-center')}>
        {eyebrow ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-teal-600">
            <span className="h-px w-5 bg-teal-500/60" />
            {eyebrow}
          </span>
        ) : null}
        <Tag className="font-display text-[clamp(1.4rem,3.4vw,2.15rem)] leading-[1.12] font-extrabold tracking-tight text-pine-900 text-balance">
          {title}
        </Tag>
        {description ? <p className="text-[15px] leading-relaxed text-slate-warm-600">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ============================================================
   STATISTIKA KARTOCHKASI
   ============================================================ */

export function Stat({
  value,
  label,
  icon,
  hint,
  className,
  tone = 'light',
}: {
  value: ReactNode;
  label: ReactNode;
  icon?: IconName;
  hint?: ReactNode;
  className?: string;
  /** 'dark' — qorong'i (pine) fonli bloklarda ishlatiladi */
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4',
        dark ? 'border-white/12 bg-white/[0.06]' : 'border-cream-200 bg-white',
        className,
      )}
    >
      {icon ? (
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            dark ? 'bg-teal-500/20 text-mint-200' : 'bg-mint-100 text-teal-600',
          )}
        >
          <Icon name={icon} size={20} />
        </span>
      ) : null}
      <div className="min-w-0">
        <div
          className={cn(
            'font-display text-2xl leading-none font-extrabold tracking-tight tabular-nums',
            dark ? 'text-white' : 'text-pine-900',
          )}
        >
          {value}
        </div>
        <div className={cn('mt-1.5 text-[13px] font-medium', dark ? 'text-white/60' : 'text-slate-warm-600')}>
          {label}
        </div>
        {hint ? (
          <div className={cn('mt-1 text-[11.5px]', dark ? 'text-white/45' : 'text-slate-warm-500')}>{hint}</div>
        ) : null}
      </div>
    </div>
  );
}

/* ============================================================
   PROGRESS / RATING
   ============================================================ */

export function ProgressBar({
  value,
  max = 100,
  label,
  className,
  tone = 'teal',
}: {
  value: number;
  max?: number;
  label?: string;
  className?: string;
  tone?: 'teal' | 'gold' | 'clay';
}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label ? (
        <div className="flex items-baseline justify-between text-[12px]">
          <span className="font-medium text-slate-warm-600">{label}</span>
          <span className="font-mono text-slate-warm-700 tabular-nums">{Math.round(pct)}%</span>
        </div>
      ) : null}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-cream-200"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-700 ease-out',
            tone === 'teal' && 'bg-teal-500',
            tone === 'gold' && 'bg-gold-500',
            tone === 'clay' && 'bg-clay-500',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   AJRATGICH / TA'RIF RO'YXATI
   ============================================================ */

export function DefList({
  items,
  className,
}: {
  items: { label: ReactNode; value: ReactNode }[];
  className?: string;
}) {
  return (
    <dl className={cn('divide-y divide-cream-200 overflow-hidden rounded-xl border border-cream-200 bg-white', className)}>
      {items.map((it, i) => (
        <div key={i} className="flex items-baseline gap-3 px-4 py-2.5">
          <dt className="w-[38%] shrink-0 text-[12.5px] font-medium text-slate-warm-500">{it.label}</dt>
          <dd className="min-w-0 flex-1 text-[13.5px] font-semibold text-pine-900">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}
