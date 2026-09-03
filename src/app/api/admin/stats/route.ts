/** GET /api/admin/stats — dashboard raqamlari */

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/guard';
import { getStats } from '@/lib/leads/store';
import { notificationChannels } from '@/lib/config';
import { productCount } from '@/lib/catalog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: { code: 'unauthorized', message: 'admin.errors.unauthorized' } }, { status: 401 });
  }
  try {
    const stats = getStats();
    return NextResponse.json(
      { ok: true, data: { ...stats, channels: notificationChannels(), catalog: { products: productCount() } } },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    return NextResponse.json({ ok: false, error: { code: 'stats_error', message: String(err).slice(0, 200) } }, { status: 500 });
  }
}
