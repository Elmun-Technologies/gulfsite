/**
 * Admin API yordamchilari: sessiya + bir xil manba (Origin) tekshiruvi.
 * SameSite=Lax cookie cross-site POST'ni allaqachon to'sadi; Origin
 * tekshiruvi — o'zgartiruvchi so'rovlar uchun qo'shimcha qatlam.
 */
import { NextResponse } from 'next/server';
import { requireAdmin } from './guard';

export async function adminGuard(req: Request, opts: { mutating?: boolean } = {}): Promise<NextResponse | null> {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: { code: 'unauthorized' } }, { status: 401 });
  }
  if (opts.mutating) {
    const origin = req.headers.get('origin');
    const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
    if (origin && host) {
      try {
        if (new URL(origin).host !== host) {
          return NextResponse.json({ ok: false, error: { code: 'bad_origin' } }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ ok: false, error: { code: 'bad_origin' } }, { status: 403 });
      }
    }
  }
  return null;
}
