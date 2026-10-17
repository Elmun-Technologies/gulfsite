/**
 * GET /api/catalog/overrides — admin paneldagi katalog tuzatmalari.
 * Vercel'dagi sayt (BACKEND_URL) shu yerdan oladi (`lib/catalog-live.ts`).
 * Maxfiy narsa yo'q — saytda ko'rinadigan mahsulot ma'lumoti.
 */

import { NextResponse } from 'next/server';
import { currentOverrides } from '@/lib/catalog-live';
import { preflight, withCors } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  return withCors(
    req,
    NextResponse.json(
      { ok: true, data: currentOverrides() },
      { headers: { 'Cache-Control': 'public, max-age=15, s-maxage=30' } },
    ),
  );
}

export function OPTIONS(req: Request) {
  return preflight(req);
}
