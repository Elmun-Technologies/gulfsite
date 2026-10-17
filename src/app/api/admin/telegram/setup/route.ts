/**
 * POST /api/admin/telegram/setup — botni do'kon uchun sozlash (admin)
 * webhook (shu server), menyu tugmasi "Do'kon" (Mini App), /start buyrug'i, tavsif.
 * GET — joriy holat (bot nomi, webhook manzili, oxirgi xato).
 */

import { NextResponse } from 'next/server';
import { adminGuard } from '@/lib/admin-api';
import { botStatus, setupBot } from '@/lib/telegram';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  return NextResponse.json({ ok: true, data: await botStatus() });
}

export async function POST(req: Request) {
  const denied = await adminGuard(req, { mutating: true });
  if (denied) return denied;
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '';
  if (!host || /^(localhost|127\.|0\.0\.0\.0)/.test(host)) {
    return NextResponse.json({ ok: false, error: { code: 'not_public' } }, { status: 400 });
  }
  const result = await setupBot(`https://${host}`);
  const ok = result.steps.every((s) => s.ok);
  return NextResponse.json({ ok, data: { ...result, status: await botStatus() } }, { status: ok ? 200 : 502 });
}
