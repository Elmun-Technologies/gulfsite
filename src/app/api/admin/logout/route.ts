/** POST /api/admin/logout */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const store = await cookies();
  store.set(AUTH_COOKIE.name, '', { ...AUTH_COOKIE.options, maxAge: 0 });
  return NextResponse.json({ ok: true });
}
