/**
 * CORS — Vercel'dagi sayt (gulfflavours.uz) fly backend'iga murojaat qiladi.
 * Ruxsat etilgan manbalar: CORS_ORIGINS (vergul bilan) + FRONTEND_URL + sayt URL.
 * Faqat ochiq endpointlar uchun (ariza, analitika, ochiq kontent) — admin API'lar
 * CORS'siz qoladi (faqat o'z domenidan).
 */
import { siteConfig } from './config';

function allowedOrigins(): Set<string> {
  const list = [
    ...(process.env.CORS_ORIGINS ?? '').split(','),
    process.env.FRONTEND_URL ?? '',
    siteConfig.url,
  ]
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean);
  // www va apex ikkalasi
  for (const o of [...list]) {
    try {
      const u = new URL(o);
      list.push(`${u.protocol}//${u.host.startsWith('www.') ? u.host.slice(4) : `www.${u.host}`}`);
    } catch {
      /* noto'g'ri qiymat */
    }
  }
  return new Set(list);
}

export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin');
  if (!origin || !allowedOrigins().has(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function preflight(req: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

/** Mavjud javobga CORS sarlavhalarini qo'shish */
export function withCors<T extends Response>(req: Request, res: T): T {
  for (const [k, v] of Object.entries(corsHeaders(req))) res.headers.set(k, v);
  return res;
}
