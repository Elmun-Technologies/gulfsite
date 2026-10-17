/**
 * GET /api/health — monitoring uchun
 * Uptime tekshiruvlari (UptimeRobot, BetterStack) shu endpointni chaqiradi.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE, verifySessionToken } from '@/lib/auth';
import { notificationChannels, serverConfig } from '@/lib/config';
import { getStats } from '@/lib/leads/store';
import { productCount } from '@/lib/catalog';
import { ensureCatalog } from '@/lib/catalog-live';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  await ensureCatalog();
  const url = new URL(req.url);
  // Batafsil holat (lead soni, kanallar, admin sozlanganmi) — faqat admin
  // sessiyasi bilan: ochiq bo'lsa ma'lumot sizib chiqadi va har chaqiruv
  // barcha JSONL fayllarini o'qiydi (arzon DoS).
  const wantsDetailed = url.searchParams.get('detailed') === '1';
  const detailed = wantsDetailed && verifySessionToken((await cookies()).get(AUTH_COOKIE.name)?.value);

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
