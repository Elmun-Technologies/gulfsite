/**
 * Bitta tashrif (sessiya) kartasi — sahifalar ketma-ketligi va hodisalar.
 * Tashriflar yo'li sahifasi va ariza tafsilotlarida ishlatiladi.
 */

import type { AdminCopy } from '@/lib/admin-copy';
import { fmtDuration } from '@/lib/admin-copy';
import { normPath, type SessionSummary } from '@/lib/analytics-store';
import { cn } from '@/lib/utils';

function time(ts: number, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale === 'ru' ? 'ru-RU' : 'uz-UZ', {
    timeZone: 'Asia/Tashkent',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ts));
}

export function SessionCard({ session: s, locale, copy: c }: { session: SessionSummary; locale: string; copy: AdminCopy }) {
  // sahifalar va hodisalar bitta vaqt chizig'ida
  const timeline = [
    ...s.pages.map((p) => ({ ts: p.ts, kind: 'page' as const, text: normPath(p.path), title: p.title })),
    ...s.events.map((e) => ({
      ts: e.ts,
      kind: 'event' as const,
      text: c.events[e.ev] ?? e.ev,
      title: e.p ? Object.entries(e.p).map(([k, v]) => `${k}: ${v}`).join(' · ') : undefined,
    })),
  ].sort((a, b) => a.ts - b.ts);

  return (
    <article className={cn('rounded-xl border bg-white p-4 shadow-soft', s.converted ? 'border-teal-500' : 'border-cream-200')}>
      <header className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-slate-warm-600">
        <span className="font-bold text-pine-900 tabular-nums">{time(s.start, locale)}</span>
        <span>{c.devices[s.dev] ?? s.dev} · {s.os} · {s.br}</span>
        {s.country ? <span>{s.country}</span> : null}
        <span>
          {c.sources[s.source] ?? s.source}
          {s.ref ? ` · ${s.ref}` : ''}
          {s.utm?.campaign ? ` · ${s.utm.campaign}` : ''}
        </span>
        <span className="tabular-nums">
          {c.session.duration}: {fmtDuration(s.durationSec)} · {s.pages.length} {c.session.pagesN}
        </span>
        {s.converted ? (
          <span className="rounded-full bg-teal-600 px-2 py-0.5 text-[11px] font-bold text-white">{c.session.converted}</span>
        ) : null}
        <span className="ml-auto font-mono text-[10.5px] text-slate-warm-400">{s.vid.slice(0, 8)}</span>
      </header>
      <ol className="flex flex-wrap items-center gap-1.5">
        {timeline.map((item, i) => (
          <li key={`${item.ts}-${i}`} className="flex items-center gap-1.5">
            {i ? <span aria-hidden className="text-slate-warm-400">→</span> : null}
            <span
              title={item.title ? `${item.title} · ${time(item.ts, locale)}` : time(item.ts, locale)}
              className={cn(
                'max-w-[260px] truncate rounded-md px-2 py-1 text-[12px]',
                item.kind === 'page' ? 'bg-cream-100 text-pine-800' : 'bg-teal-600/12 font-semibold text-teal-600',
              )}
            >
              {item.text}
            </span>
          </li>
        ))}
      </ol>
    </article>
  );
}
