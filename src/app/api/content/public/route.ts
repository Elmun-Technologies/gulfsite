/**
 * GET /api/content/public — sayt kontenti (kontaktlar, logotiplar, videolar)
 * Vercel'dagi sayt (BACKEND_URL) shu yerdan oladi. Maxfiy narsa yo'q —
 * aynan saytda ko'rinadigan ma'lumot.
 */

import { NextResponse } from 'next/server';
import { getContent } from '@/lib/content';
import { preflight, withCors } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  return withCors(
    req,
    NextResponse.json({ ok: true, data: getContent() }, { headers: { 'Cache-Control': 'public, max-age=30, s-maxage=60' } }),
  );
}

export function OPTIONS(req: Request) {
  return preflight(req);
}
