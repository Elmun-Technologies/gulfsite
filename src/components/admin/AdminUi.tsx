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
    <section className={cn('admin-card p-5', className)}>
      {title || aside ? (
        <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {title ? <h2 className="text-[15px] font-semibold text-ink">{title}</h2> : <span />}
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
        <h1 className="text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-[-0.02em] text-ink">{title}</h1>
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
    <div className="admin-card p-4">
      <span className="block text-[13px] leading-snug text-muted">{label}</span>
      <span className="mt-2 block text-[26px] font-semibold leading-none tracking-[-0.02em] text-ink tabular-nums">
        {value}
      </span>
      {delta != null ? (
        <span
          className={cn(
            'mt-2 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[12px] font-medium tabular-nums',
            delta > 0 ? 'bg-ok/10 text-ok' : delta < 0 ? 'bg-error/10 text-error' : 'bg-panel text-muted',
          )}
          title={hint}
        >
          {delta > 0 ? '↑' : delta < 0 ? '↓' : '•'} {Math.abs(delta)}%
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
      <nav className="flex flex-wrap gap-1 admin-card p-1">
        {keys.map((k) => (
          <Link
            key={k}
            href={`${base}?${qs({ p: k })}`}
            className={cn(
              'rounded-[10px] px-3 py-1.5 text-[12.5px] font-semibold transition',
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
        <input type="date" name="from" defaultValue={from} className="h-9 rounded-[10px] border border-line bg-white px-2" aria-label={copy.period.from} />
        <span className="text-muted">—</span>
        <input type="date" name="to" defaultValue={to} className="h-9 rounded-[10px] border border-line bg-white px-2" aria-label={copy.period.to} />
        <button type="submit" className="h-9 rounded-[10px] bg-navy px-3 font-semibold text-white hover:bg-ink">
          {copy.period.apply}
        </button>
      </form>
    </div>
  );
}
