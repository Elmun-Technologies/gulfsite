/**
 * ADMIN AUTENTIFIKATSIYA
 * ----------------------------------------------------------------
 * Oddiy, lekin xavfsiz sxema: parol bilan kirish → HMAC imzolangan
 * httpOnly cookie. Tashqi provayderlar yo'q, hech narsa o'rnatish shart emas.
 *
 * Cookie tarkibi: `<payload>.<expiryEpochSec>.<hmacSha256>`
 *  - payload: foydalanuvchi belgisi
 *  - imza ADMIN_SECRET bilan hisoblanadi → qalbaki cookie yasab bo'lmaydi
 *
 * Ishlab chiqarishda ADMIN_SECRET ni ALMASHTIRISH shart:
 *   openssl rand -hex 32
 */

import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { serverConfig } from './config';

const COOKIE_MAX_AGE = serverConfig.admin.sessionHours * 3600;

function getSecret(): string {
  const s = serverConfig.admin.secret;
  if (!s) {
    // Ishlab chiqarishda bu holat bloklanadi (pastda tekshiriladi).
    // Rivojlanish rejimida tasodifiy kalit — sessiya qayta ishga tushgach tugaydi.
    return 'dev-insecure-secret-change-me';
  }
  return s;
}

function sign(payload: string, expiry: number): string {
  return createHmac('sha256', getSecret()).update(`${payload}.${expiry}`).digest('base64url');
}

export function createSessionToken(subject = 'admin'): string {
  const expiry = Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE;
  return `${subject}.${expiry}.${sign(subject, expiry)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [subject, expiryRaw, signature] = parts;
  const expiry = Number(expiryRaw);
  if (!subject || !Number.isFinite(expiry)) return false;
  if (expiry * 1000 < Date.now()) return false;

  const expected = sign(subject, expiry);
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function checkPassword(password: string): boolean {
  const expected = serverConfig.admin.password;
  if (!expected) return false; // parol o'rnatilmagan → hech kim kira olmaydi
  // Ikkala qiymatning SHA-256 xeshi solishtiriladi: uzunliklar har doim teng,
  // shuning uchun javob vaqti parol UZUNLIGINI ham oshkor qilmaydi.
  const a = createHash('sha256').update(password).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

export function isAdminConfigured(): boolean {
  return serverConfig.admin.isConfigured;
}

export const AUTH_COOKIE = {
  name: serverConfig.admin.cookieName || 'gff_admin',
  options: {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  },
};

/** Kirish urinishlarini cheklash (brute-force himoyasi) */
const ATTEMPTS = new Map<string, { count: number; first: number }>();
const MAX_ATTEMPTS = 6;
const WINDOW_MS = 15 * 60 * 1000;

/**
 * IP'dan qat'i nazar umumiy chegara: IP sarlavhasi soxtalashtirilsa ham
 * (har so'rovda yangi X-Forwarded-For) parolni cheksiz terib bo'lmaydi.
 */
export const GLOBAL_LOGIN_KEY = 'login:*';
const GLOBAL_MAX_ATTEMPTS = 30;
const MAX_TRACKED = 5000;

function maxFor(key: string) {
  return key === GLOBAL_LOGIN_KEY ? GLOBAL_MAX_ATTEMPTS : MAX_ATTEMPTS;
}

/** Muddati o'tgan yozuvlarni tozalash — xarita cheksiz o'smasin */
function sweep(now: number) {
  if (ATTEMPTS.size < MAX_TRACKED) return;
  for (const [k, v] of ATTEMPTS) if (now - v.first > WINDOW_MS) ATTEMPTS.delete(k);
  // hammasi "yangi" bo'lsa ham chegaradan oshmasin (eng eskilari o'chadi)
  for (const k of ATTEMPTS.keys()) {
    if (ATTEMPTS.size < MAX_TRACKED) break;
    if (k !== GLOBAL_LOGIN_KEY) ATTEMPTS.delete(k);
  }
}

export function registerFailedAttempt(key: string): { blocked: boolean; retryAfterSec: number } {
  const now = Date.now();
  sweep(now);
  const entry = ATTEMPTS.get(key);

  if (!entry || now - entry.first > WINDOW_MS) {
    ATTEMPTS.set(key, { count: 1, first: now });
    return { blocked: false, retryAfterSec: 0 };
  }

  entry.count += 1;
  if (entry.count >= maxFor(key)) {
    const retryAfterSec = Math.ceil((entry.first + WINDOW_MS - now) / 1000);
    return { blocked: true, retryAfterSec };
  }
  return { blocked: false, retryAfterSec: 0 };
}

export function clearAttempts(key: string) {
  ATTEMPTS.delete(key);
}

export function isBlocked(key: string): { blocked: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = ATTEMPTS.get(key);
  if (!entry) return { blocked: false, retryAfterSec: 0 };
  if (now - entry.first > WINDOW_MS) {
    ATTEMPTS.delete(key);
    return { blocked: false, retryAfterSec: 0 };
  }
  if (entry.count >= maxFor(key)) {
    return { blocked: true, retryAfterSec: Math.ceil((entry.first + WINDOW_MS - now) / 1000) };
  }
  return { blocked: false, retryAfterSec: 0 };
}
