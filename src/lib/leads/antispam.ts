/**
 * ANTISPAM VA TEZLIK CHEKLOVI
 * ----------------------------------------------------------------
 * Uch qatlamli himoya:
 *   1. Honeypot maydoni (odam ko'rmaydi, bot to'ldiradi)
 *   2. Vaqt tuzog'i — forma juda tez yuborilsa bot deb hisoblanadi
 *   3. IP bo'yicha tezlik cheklovi (sliding window, xotirada)
 *   4. (Ixtiyoriy) Cloudflare Turnstile — server tomonida tekshiriladi
 *
 * Xotiradagi limiter bitta jarayon uchun ishlaydi. Ko'p instansli
 * joylashtirishda (Vercel, bir nechta konteyner) Redis yoki Cloudflare
 * WAF rate-limiting qo'shing — docs/DEPLOYMENT.md da ko'rsatilgan.
 */

import { serverConfig } from '../config';

/* ------------------------------------------------------------
   IP bo'yicha tezlik cheklovi
   ------------------------------------------------------------ */

interface Bucket {
  hits: number[];
}

const BUCKETS = new Map<string, Bucket>();
const MAX_BUCKETS = 5000;
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  const cutoff = now - serverConfig.antispam.rateLimitWindowSec * 1000 * 2;
  for (const [key, bucket] of BUCKETS) {
    bucket.hits = bucket.hits.filter((t) => t >= cutoff);
    if (bucket.hits.length === 0) BUCKETS.delete(key);
  }
  if (BUCKETS.size > MAX_BUCKETS) {
    // Eng eski yarmisini tashlab yuboramiz
    const keys = [...BUCKETS.keys()].slice(0, MAX_BUCKETS / 2);
    for (const k of keys) BUCKETS.delete(k);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const windowMs = serverConfig.antispam.rateLimitWindowSec * 1000;
  const max = serverConfig.antispam.rateLimitMax;
  const cutoff = now - windowMs;

  const bucket = BUCKETS.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => t >= cutoff);

  if (bucket.hits.length >= max) {
    const oldest = bucket.hits[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    BUCKETS.set(key, bucket);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  bucket.hits.push(now);
  BUCKETS.set(key, bucket);
  return { allowed: true, remaining: max - bucket.hits.length, retryAfterSec: 0 };
}

export function resetRateLimit(key: string) {
  BUCKETS.delete(key);
}

/* ------------------------------------------------------------
   IP manzilini aniqlash (proksi orqali)
   ------------------------------------------------------------ */

export function clientIp(headers: Headers): string {
  const candidates = [
    headers.get('cf-connecting-ip'),
    headers.get('x-real-ip'),
    headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
    headers.get('vercel-forwarded-for'),
    headers.get('forwarded')?.match(/for=([^;]+)/)?.[1]?.replace(/"/g, ''),
  ];
  for (const c of candidates) {
    if (c && c.trim() && c !== 'unknown') return c.trim().slice(0, 64);
  }
  return 'unknown';
}

export function clientCountry(headers: Headers): string | undefined {
  return headers.get('cf-ipcountry') ?? headers.get('x-vercel-ip-country') ?? undefined;
}

/* ------------------------------------------------------------
   Spam bahosi
   ------------------------------------------------------------ */

export interface SpamSignals {
  /** Honeypot maydoni to'ldirilganmi */
  honeypot?: string;
  /** Forma ochilgan vaqt (ms epoch) */
  formStartedAt?: number;
  /** Turnstile natijasi */
  turnstilePassed?: boolean;
  /** Xabar matni */
  message?: string;
  /** E-mail */
  email?: string;
  /** Foydalanuvchi agenti */
  userAgent?: string;
  /** IP */
  ip?: string;
}

/**
 * 0–100 oralig'ida spam bahosi. ≥80 → avtomatik "spam" holati.
 *
 * Ball berish mantiqi:
 *  +60 honeypot to'ldirilgan (deyarli ishonchli bot belgisi)
 *  +30 forma 3 sekunddan tez yuborilgan
 *  +25 Turnstile yiqilgan (agar yoqilgan bo'lsa)
 *  +20 spamm so'zlar
 *  +15 URL xabarning ichida
 *  +10 shubhali user-agent (bot yoki bo'sh)
 *   +5 biriktirilgan (ko'rinmas) belgilar
 */
const SPAM_WORDS = [
  'casino', 'вино казино', 'poker', 'betting', 'ставки', 'кредит', 'займ',
  'crypto invest', 'forex signal', 'seo services', 'backlink', 'escort',
  'intimate', 'виагра', 'viagra', 'увеличение', 'заработок', 'passive income',
  'lottery winner', 'inheritance', 'bitcoin mining',
];

const BOT_AGENTS = /bot|crawler|spider|curl|wget|python|httpie|postman|scrapy|headless|phantomjs|selenium/i;

export function spamScore(s: SpamSignals): number {
  let score = 0;

  if (s.honeypot && s.honeypot.trim().length > 0) score += 60;

  if (typeof s.formStartedAt === 'number' && Number.isFinite(s.formStartedAt)) {
    const elapsedMs = Date.now() - s.formStartedAt;
    if (elapsedMs < 3000) score += 30;
    else if (elapsedMs < 6000) score += 12;
    // Kelajak sanasi → soxta
    else if (elapsedMs < -60_000) score += 25;
  } else {
    // formStartedAt umuman yo'q — shubhali (haqiqiy forma har doim yuboradi)
    score += 10;
  }

  if (s.turnstilePassed === false) score += 25;

  const msg = (s.message ?? '').toLowerCase();
  if (msg) {
    if (SPAM_WORDS.some((w) => msg.includes(w))) score += 20;
    if (/https?:\/\//.test(msg)) score += 15;
    // Hammasi katta harf bilan va uzun
    if (s.message && s.message.length > 60 && s.message === s.message.toUpperCase()) score += 8;
  }

  if (s.email && /(mailinator|tempmail|10minutemail|guerrillamail|yopmail|trashmail|maildrop)\./i.test(s.email)) {
    score += 20;
  }

  const ua = s.userAgent ?? '';
  if (!ua) score += 10;
  else if (BOT_AGENTS.test(ua)) score += 15;

  if (s.ip && /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(s.ip)) score -= 20; // ichki — sinov

  return Math.max(0, Math.min(100, score));
}

/* ------------------------------------------------------------
   Cloudflare Turnstile (ixtiyoriy)
   ------------------------------------------------------------ */

export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = serverConfig.antispam.turnstileSecret;
  if (!secret) return true; // yoqilmagan → to'siq yo'q
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== 'unknown') body.set('remoteip', ip);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      // 5 sekundlik taymaut — tashqi servis formani bloklamasligi kerak
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return true; // Turnstile ishlamasa — foydalanuvchini bloklamaymiz
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // Tarmoq xatosi → foydalanuvchini ayblamaymiz
    return true;
  }
}
