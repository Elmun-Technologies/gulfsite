/**
 * POST /api/admin/login — admin panelga kirish
 * GET  /api/admin/login — joriy sessiya holati
 */

import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import {
  AUTH_COOKIE,
  checkPassword,
  clearAttempts,
  createSessionToken,
  isAdminConfigured,
  isBlocked,
  registerFailedAttempt,
  verifySessionToken,
} from '@/lib/auth';
import { clientIp } from '@/lib/leads/antispam';
import { sanitizeLog } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);

  const blocked = isBlocked(`login:${ip}`);
  if (blocked.blocked) {
    return NextResponse.json(
      { ok: false, error: { code: 'rate_limit', message: 'admin.loginRateLimit', retryAfterSec: blocked.retryAfterSec } },
      { status: 429 },
    );
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: { code: 'not_configured', message: 'admin.setupHint' },
      },
      { status: 503 },
    );
  }

  let password = '';
  try {
    const body = (await req.json()) as { password?: unknown };
    password = typeof body.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'bad_json', message: 'admin.loginFailed' } }, { status: 400 });
  }

  if (!password || !checkPassword(password)) {
    const attempt = registerFailedAttempt(`login:${ip}`);
    console.warn(`[admin] muvaffaqiyatsiz kirish urinishi, ip=${sanitizeLog(ip)}`);
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: attempt.blocked ? 'rate_limit' : 'invalid_credentials',
          message: attempt.blocked ? 'admin.loginRateLimit' : 'admin.loginFailed',
          retryAfterSec: attempt.retryAfterSec,
        },
      },
      { status: attempt.blocked ? 429 : 401 },
    );
  }

  clearAttempts(`login:${ip}`);
  const token = createSessionToken('admin');
  const store = await cookies();
  store.set(AUTH_COOKIE.name, token, AUTH_COOKIE.options);

  return NextResponse.json({ ok: true, data: { redirect: '/uz/admin' } });
}

export async function GET() {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE.name)?.value;
  return NextResponse.json({
    ok: true,
    authenticated: verifySessionToken(token),
    configured: isAdminConfigured(),
  });
}
