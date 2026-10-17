/**
 * Admin hisobotlari uchun davr (URL: ?p=7d yoki ?from=YYYY-MM-DD&to=YYYY-MM-DD)
 */
import { shiftDay, todayKey } from './analytics-store';

export type PeriodKey = 'today' | 'yesterday' | '7d' | '30d' | '90d' | 'custom';

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function resolvePeriod(sp: Record<string, string | string[] | undefined>): {
  key: PeriodKey;
  from: string;
  to: string;
} {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';
  const today = todayKey();
  const from = one(sp.from);
  const to = one(sp.to);
  if (DAY_RE.test(from) && DAY_RE.test(to) && from <= to) {
    // 366 kundan uzun oraliq — server yukini cheklash
    const minFrom = shiftDay(to, -365);
    return { key: 'custom', from: from < minFrom ? minFrom : from, to: to > today ? today : to };
  }
  const p = one(sp.p) as PeriodKey;
  switch (p) {
    case 'today':
      return { key: p, from: today, to: today };
    case 'yesterday': {
      const y = shiftDay(today, -1);
      return { key: p, from: y, to: y };
    }
    case '30d':
      return { key: p, from: shiftDay(today, -29), to: today };
    case '90d':
      return { key: p, from: shiftDay(today, -89), to: today };
    default:
      return { key: '7d', from: shiftDay(today, -6), to: today };
  }
}

/** "2026-10-17" → "17.10" */
export function shortDay(day: string): string {
  return `${day.slice(8, 10)}.${day.slice(5, 7)}`;
}
