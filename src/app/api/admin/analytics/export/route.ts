/**
 * GET /api/admin/analytics/export?days=30 — xom hit'lar CSV (Excel uchun)
 */

import { adminGuard } from '@/lib/admin-api';
import { buildReport, shiftDay, todayKey } from '@/lib/analytics-store';
import { toCsv } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const days = Math.min(365, Math.max(1, Number(new URL(req.url).searchParams.get('days')) || 30));
  const to = todayKey();
  const from = shiftDay(to, -(days - 1));
  const r = buildReport(from, to, { sessionsLimit: 100_000 });

  const rows: (string | number)[][] = [
    ['session_id', 'visitor_id', 'start', 'duration_sec', 'pages', 'source', 'referrer', 'utm', 'device', 'os', 'browser', 'lang', 'country', 'converted', 'path', 'events'],
  ];
  for (const s of r.sessionsList) {
    rows.push([
      s.sid,
      s.vid,
      new Date(s.start).toISOString(),
      s.durationSec,
      s.pages.length,
      s.source,
      s.ref ?? '',
      [s.utm?.source, s.utm?.medium, s.utm?.campaign].filter(Boolean).join('/'),
      s.dev,
      s.os,
      s.br,
      s.lang,
      s.country ?? '',
      s.converted ? 1 : 0,
      s.pages.map((p) => p.path).join(' > '),
      s.events.map((e) => e.ev).join(' > '),
    ]);
  }
  return new Response(toCsv(rows), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="gff-analytics-${from}_${to}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
