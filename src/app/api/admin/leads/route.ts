/** GET /api/admin/leads — leadlar ro'yxati (faqat admin) */

import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/guard';
import { listLeads } from '@/lib/leads/store';
import type { LeadStatusId } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_STATUSES: LeadStatusId[] = ['new', 'contacted', 'qualified', 'sample_sent', 'proposal', 'won', 'lost', 'spam'];

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: { code: 'unauthorized', message: 'admin.errors.unauthorized' } }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const list = (k: string) =>
    (sp.get(k) ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const status = list('status').filter((s) => VALID_STATUSES.includes(s as LeadStatusId)) as LeadStatusId[];
  const page = Math.max(1, Number(sp.get('page') ?? 1) || 1);
  const pageSize = Math.min(100, Math.max(5, Number(sp.get('pageSize') ?? 25) || 25));

  const period = sp.get('period');
  const now = Date.now();
  let from: string | undefined;
  if (period === 'today') from = new Date(now - 86400000).toISOString();
  else if (period === '7d') from = new Date(now - 7 * 86400000).toISOString();
  else if (period === '30d') from = new Date(now - 30 * 86400000).toISOString();
  else if (sp.get('from')) from = new Date(sp.get('from')!).toISOString();

  const result = listLeads({
    q: (sp.get('q') ?? '').slice(0, 120),
    status,
    type: list('type'),
    region: list('region'),
    from,
    to: sp.get('to') ? new Date(sp.get('to')!).toISOString() : undefined,
    sort: (['newest', 'oldest', 'quality'] as const).includes(sp.get('sort') as 'newest') ? (sp.get('sort') as 'newest') : 'newest',
    page,
    pageSize,
  });

  return NextResponse.json({ ok: true, data: result }, { headers: { 'Cache-Control': 'no-store' } });
}
