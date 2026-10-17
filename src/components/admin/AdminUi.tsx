/**
 * Admin sahifalari uchun umumiy bloklar (server komponentlar)
 */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { AdminCopy } from '@/lib/admin-copy';
import type { PeriodKey } from '@/lib/admin-period';

export function AdminCard({
  title,
  aside,
  children,
  className,
}: {
  title?: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('rounded-[20px] border border-line-soft bg-white p-4', className)}>
      {title || aside ? (
        <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
          {title ? <h2 className="font-display text-[14px] font-semibold tracking-tight text-ink">{title}</h2> : <span />}
          {aside}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function PageTitle({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-[clamp(1.6rem,3vw,2.2rem)] font-normal tracking-[-0.02em] text-ink">{title}</h1>
        {sub ? <p className="mt-1 text-[13px] text-muted">{sub}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export function Kpi({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string | number;
  /** foizdagi o'zgarish (null — taqqoslab bo'lmaydi) */
  delta?: number | null;
  hint?: string;
}) {
  return (
    <div className="rounded-[20px] border border-line-soft bg-white p-3.5">
      <span className="block text-[11.5px] leading-snug text-muted">{label}</span>
      <span className="mt-1.5 block font-display text-[1.55rem] font-semibold leading-none tracking-tight text-ink tabular-nums">
        {value}
      </span>
      {delta != null ? (
        <span
          className={cn(
            'mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-bold tabular-nums',
            delta > 0 ? 'text-copper-dark' : delta < 0 ? 'text-error' : 'text-muted',
          )}
          title={hint}
        >
          {delta > 0 ? '▲' : delta < 0 ? '▼' : '•'} {Math.abs(delta)}%
        </span>
      ) : null}
    </div>
  );
}

export function pctDelta(cur: number, prev: number): number | null {
  if (!prev) return cur ? null : 0;
  return Math.round(((cur - prev) / prev) * 100);
}

export function PeriodPicker({
  base,
  current,
  from,
  to,
  copy,
  extra,
}: {
  base: string;
  current: PeriodKey;
  from: string;
  to: string;
  copy: AdminCopy;
  /** qo'shimcha query parametrlari (masalan metrika tanlovi) */
  extra?: Record<string, string>;
}) {
  const keys: PeriodKey[] = ['today', 'yesterday', '7d', '30d', '90d'];
  const qs = (p: Record<string, string>) => new URLSearchParams({ ...extra, ...p }).toString();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <nav className="flex flex-wrap gap-1 rounded-[20px] border border-line-soft bg-white p-1">
        {keys.map((k) => (
          <Link
            key={k}
            href={`${base}?${qs({ p: k })}`}
            className={cn(
              'rounded-[14px] px-3 py-1.5 text-[12.5px] font-bold transition',
              current === k ? 'bg-navy text-white' : 'text-slate hover:bg-panel',
            )}
            aria-current={current === k ? 'true' : undefined}
          >
            {copy.period[k]}
          </Link>
        ))}
      </nav>
      <form method="get" action={base} className="flex flex-wrap items-center gap-1.5 text-[12.5px]">
        {Object.entries(extra ?? {}).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        <input type="date" name="from" defaultValue={from} className="h-9 rounded-[14px] border border-line bg-white px-2" aria-label={copy.period.from} />
        <span className="text-muted">—</span>
        <input type="date" name="to" defaultValue={to} className="h-9 rounded-[14px] border border-line bg-white px-2" aria-label={copy.period.to} />
        <button type="submit" className="h-9 rounded-[14px] bg-navy px-3 font-bold text-white hover:bg-ink">
          {copy.period.apply}
        </button>
      </form>
    </div>
  );
}
