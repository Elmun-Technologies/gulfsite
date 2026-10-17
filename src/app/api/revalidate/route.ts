/**
 * POST /api/revalidate — admin kontentni saqlaganda backend (fly) shu yerni
 * chaqiradi (Vercel'dagi sayt). Sarlavha: `x-revalidate-secret: <REVALIDATE_SECRET>`.
 * Kontent va katalog teglari hamda barcha sahifalar qayta yaratiladi.
 */

import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function ok(given: string, expected: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const secret = (process.env.REVALIDATE_SECRET ?? '').trim();
  const given = req.headers.get('x-revalidate-secret') ?? '';
  if (!secret || !ok(given, secret)) {
    return NextResponse.json({ ok: false, error: { code: 'unauthorized' } }, { status: 401 });
  }
  revalidateTag('site-content', { expire: 0 });
  revalidateTag('catalog', { expire: 0 });
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true, revalidated: true });
}
