/**
 * GET /api/health — monitoring uchun
 * Uptime tekshiruvlari (UptimeRobot, BetterStack) shu endpointni chaqiradi.
 */

import { NextResponse } from 'next/server';
import { notificationChannels, serverConfig } from '@/lib/config';
import { getStats } from '@/lib/leads/store';
import { productCount } from '@/lib/catalog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const detailed = url.searchParams.get('detailed') === '1';

  const base = {
    ok: true,
    service: 'gff-uzbekistan',
    status: 'healthy',
    time: new Date().toISOString(),
    uptimeSec: Math.round(process.uptime()),
    node: process.version,
  };

  if (!detailed) return NextResponse.json(base, { headers: { 'Cache-Control': 'no-store' } });

  let storage = { driver: 'unknown', writable: false, total: 0 };
  try {
    const stats = getStats();
    storage = {
      driver: stats.storage.driver,
      writable: stats.storage.writable,
      total: stats.total,
    };
  } catch {
    /* saqlash qatlami ishlamasa ham sayt javob berishi kerak */
  }

  return NextResponse.json(
    {
      ...base,
      catalog: { products: productCount() },
      notifications: notificationChannels(),
      storage,
      config: {
        adminConfigured: serverConfig.admin.isConfigured,
        turnstileEnabled: serverConfig.antispam.turnstileEnabled,
      },
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
