/**
 * GET/PUT /api/admin/content — sayt kontenti (kontaktlar, logotiplar, videolar)
 * Saqlangandan keyin barcha sahifalar qayta yaratiladi (ISR revalidatePath).
 */

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminGuard } from '@/lib/admin-api';
import { getContent, saveContent } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  return NextResponse.json({ ok: true, data: getContent() }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(req: Request) {
  const denied = await adminGuard(req, { mutating: true });
  if (denied) return denied;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'bad_json' } }, { status: 400 });
  }
  try {
    const data = saveContent(body);
    // kontakt (footer) va logotip/video (bosh sahifa, kompaniya) — butun sayt
    revalidatePath('/', 'layout');
    await notifyFrontend();
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error('[admin/content] saqlanmadi:', String(err).slice(0, 200));
    return NextResponse.json({ ok: false, error: { code: 'save_failed' } }, { status: 500 });
  }
}

/**
 * Sayt alohida joyda (Vercel) bo'lsa — uni ham yangilash.
 * FRONTEND_URL + REVALIDATE_SECRET (ikkala tomonda bir xil) kerak.
 */
async function notifyFrontend() {
  const url = (process.env.FRONTEND_URL ?? '').trim().replace(/\/+$/, '');
  const secret = (process.env.REVALIDATE_SECRET ?? '').trim();
  if (!url || !secret) return;
  try {
    const res = await fetch(`${url}/api/revalidate`, {
      method: 'POST',
      headers: { 'x-revalidate-secret': secret },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error('[admin/content] sayt yangilanmadi:', res.status);
  } catch (err) {
    console.error('[admin/content] sayt yangilanmadi:', String(err).slice(0, 200));
  }
}
