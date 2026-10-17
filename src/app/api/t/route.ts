/**
 * POST /api/t — o'z analitikamiz uchun hit'lar (sendBeacon / fetch keepalive)
 * ----------------------------------------------------------------
 * Har qanday kirish ma'lumoti ishonchsiz: maydonlar qat'iy cheklanadi,
 * botlar tashlanadi, IP faqat xotiradagi rate limit uchun ishlatiladi
 * (diskka yozilmaydi). Javob har doim 204 — brauzerda xato chiqmasin.
 */

import { clientIp } from '@/lib/leads/antispam';
import { appendHits, countryFrom, isBot, parseUa, type Hit } from '@/lib/analytics-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_CONTENT = () => new Response(null, { status: 204 });

/* daqiqasiga 240 hit / IP — oddiy foydalanuvchi bunga yetmaydi */
const BUCKETS = new Map<string, { n: number; reset: number }>();
function allowed(ip: string, n: number): boolean {
  const now = Date.now();
  if (BUCKETS.size > 20_000) BUCKETS.clear();
  const b = BUCKETS.get(ip);
  if (!b || b.reset < now) {
    BUCKETS.set(ip, { n, reset: now + 60_000 });
    return true;
  }
  b.n += n;
  return b.n <= 240;
}

const ID_RE = /^[a-z0-9]{8,40}$/i;

function s(v: unknown, max: number): string | undefined {
  if (typeof v !== 'string') return undefined;
  const out = v.replace(/[\u0000-\u001f]/g, '').trim().slice(0, max);
  return out || undefined;
}

function cleanParams(p: unknown): Hit['p'] {
  if (!p || typeof p !== 'object') return undefined;
  const out: Record<string, string | number | boolean> = {};
  let n = 0;
  for (const [k, v] of Object.entries(p as Record<string, unknown>)) {
    if (n >= 12 || !/^[\w-]{1,40}$/.test(k)) continue;
    if (typeof v === 'string') out[k] = v.slice(0, 160);
    else if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
    else if (typeof v === 'boolean') out[k] = v;
    else continue;
    n += 1;
  }
  return n ? out : undefined;
}

export async function POST(req: Request) {
  const ua = req.headers.get('user-agent') ?? '';
  if (isBot(ua)) return NO_CONTENT();

  let body: { hits?: unknown };
  try {
    const text = await req.text();
    if (text.length > 64_000) return NO_CONTENT();
    body = JSON.parse(text) as { hits?: unknown };
  } catch {
    return NO_CONTENT();
  }
  const raw = Array.isArray(body.hits) ? body.hits.slice(0, 30) : [];
  if (!raw.length) return NO_CONTENT();

  const ip = clientIp(req.headers);
  if (!allowed(ip, raw.length)) return NO_CONTENT();

  const { br, os, dev: uaDev } = parseUa(ua);
  const lang = (req.headers.get('accept-language') ?? '').slice(0, 2).toLowerCase() || '—';
  const headerCountry = req.headers.get('cf-ipcountry') ?? req.headers.get('x-vercel-ip-country');
  const now = Date.now();

  const hits: Hit[] = [];
  for (const r of raw as Record<string, unknown>[]) {
    if (!r || typeof r !== 'object') continue;
    const t = r.t === 'pv' || r.t === 'ev' || r.t === 'leave' ? r.t : null;
    const vid = s(r.vid, 40);
    const sid = s(r.sid, 40);
    const path = s(r.path, 300);
    if (!t || !vid || !sid || !ID_RE.test(vid) || !ID_RE.test(sid) || !path?.startsWith('/')) continue;
    if (/^\/(uz|ru|en)\/admin|^\/api\//.test(path)) continue; // admin va API sanalmaydi

    const sw = typeof r.sw === 'number' ? r.sw : 0;
    const dev: Hit['dev'] = sw ? (sw < 768 ? 'm' : sw < 1080 ? 't' : 'd') : uaDev;
    const tz = s(r.tz, 60) ?? '';
    const utmRaw = (r.utm && typeof r.utm === 'object' ? r.utm : {}) as Record<string, unknown>;
    const utm = {
      source: s(utmRaw.source, 80),
      medium: s(utmRaw.medium, 80),
      campaign: s(utmRaw.campaign, 120),
    };
    const siteLang = path.match(/^\/(uz|ru|en)(?=\/|$)/)?.[1];

    hits.push({
      t,
      ts: now,
      vid,
      sid,
      anon: r.anon === 1 ? 1 : undefined,
      path,
      title: t === 'pv' ? s(r.title, 120) : undefined,
      ref: s(r.ref, 100)?.toLowerCase(),
      utm: utm.source || utm.campaign ? utm : undefined,
      dev,
      br,
      os,
      lang: siteLang ?? lang,
      country: countryFrom(headerCountry, tz),
      ev: t === 'ev' ? s(r.ev, 40) : undefined,
      p: t === 'ev' ? cleanParams(r.p) : undefined,
      dur: t === 'leave' && typeof r.dur === 'number' ? Math.max(0, Math.min(Math.round(r.dur), 7200)) : undefined,
    });
  }

  appendHits(hits);
  return NO_CONTENT();
}
