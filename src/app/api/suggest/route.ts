/**
 * GET /api/suggest?q=... — katalog avtoto'ldirish
 * ----------------------------------------------------------------
 * Debounce qilingan qidiruv qutisi uchun yengil endpoint.
 * Javob kichik (≤ 8 element) va keshlanmaydi.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { suggest } from '@/lib/catalog';
import { checkRateLimit, clientIp } from '@/lib/leads/antispam';
import { normalizeLocale } from '@/i18n';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const ip = clientIp(req.headers);
  const limit = checkRateLimit(`suggest:${ip}`);
  if (!limit.allowed) {
    return NextResponse.json({ ok: false, suggestions: [] }, { status: 429 });
  }

  const q = (req.nextUrl.searchParams.get('q') ?? '').slice(0, 120);
  const locale = normalizeLocale(req.nextUrl.searchParams.get('lang') ?? 'uz');
  const limitParam = Number(req.nextUrl.searchParams.get('limit') ?? 8);
  const take = Number.isFinite(limitParam) ? Math.min(Math.max(1, limitParam), 20) : 8;

  if (q.trim().length < 2) {
    return NextResponse.json({ ok: true, query: q, suggestions: [] });
  }

  const suggestions = suggest(q, locale, take);
  return NextResponse.json({ ok: true, query: q, suggestions }, { headers: { 'Cache-Control': 'no-store' } });
}
