/**
 * O'Z ANALITIKAMIZ — brauzer tomoni (client-only, kutubxonasiz)
 * ----------------------------------------------------------------
 * Har bir sahifa ko'rishi, hodisa (`trackEvent` orqali) va sahifadan
 * chiqish (o'tkazilgan vaqt) `/api/t` ga paket bo'lib yuboriladi
 * (`navigator.sendBeacon` — sahifa yopilayotganda ham yetib boradi).
 *
 * Identifikatorlar:
 *   · rozilik 'all' — `localStorage` dagi doimiy `vid` (qaytgan
 *     tashrif buyuruvchilar aniqlanadi);
 *   · rozilik yo'q — `sessionStorage` (faqat shu tab, keyingi tashrifda yangi).
 *   · sessiya — 30 daqiqa harakatsizlikdan keyin yangilanadi.
 * Ism, telefon kabi shaxsiy ma'lumot YUBORILMAYDI.
 */

import { apiUrl } from './api-base';

const CONSENT_KEY = 'gff_cookie_consent';
const VID_KEY = 'gff_vid';
const SID_KEY = 'gff_sid';
const SESSION_MS = 30 * 60_000;
// alohida backend (fly) bo'lsa — to'g'ridan-to'g'ri unga (lib/api-base.ts)
const ENDPOINT = apiUrl('/api/t');

type Payload = Record<string, unknown>;

let queue: Payload[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let current: { path: string; start: number } | null = null;
let landing = true;

function rand(): string {
  try {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 20);
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

function safeGet(store: Storage | undefined, key: string): string | null {
  try {
    return store?.getItem(key) ?? null;
  } catch {
    return null;
  }
}
function safeSet(store: Storage | undefined, key: string, value: string) {
  try {
    store?.setItem(key, value);
  } catch {
    /* private mode */
  }
}

function consented(): boolean {
  return safeGet(globalThis.localStorage, CONSENT_KEY) === 'all';
}

let memVid = '';
function ids(): { vid: string; sid: string; anon: boolean } {
  const anon = !consented();
  const vStore = anon ? globalThis.sessionStorage : globalThis.localStorage;
  // rozilik endi berilgan bo'lsa — shu tabdagi vaqtinchalik id doimiyga o'tadi
  // (aks holda bitta odam ikki tashrif buyuruvchi bo'lib sanalardi)
  let vid = safeGet(vStore, VID_KEY) || (anon ? '' : safeGet(globalThis.sessionStorage, VID_KEY) ?? '') || memVid;
  if (!vid) {
    vid = rand();
    safeSet(vStore, VID_KEY, vid);
  }
  memVid = vid;

  // sessiya: "id:oxirgiFaollik"
  const now = Date.now();
  const raw = safeGet(globalThis.sessionStorage, SID_KEY) ?? '';
  const [sidOld, last] = raw.split(':');
  const sid = sidOld && now - Number(last) < SESSION_MS ? sidOld : rand();
  safeSet(globalThis.sessionStorage, SID_KEY, `${sid}:${now}`);
  return { vid, sid, anon };
}

function flush(useBeacon = false) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (!queue.length) return;
  const body = JSON.stringify({ hits: queue.splice(0, 30) });
  try {
    if (useBeacon && navigator.sendBeacon) {
      // text/plain — CORS "oddiy" so'rov (preflight'siz); server tanani baribir JSON sifatida o'qiydi
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain;charset=UTF-8' }));
    } else {
      void fetch(ENDPOINT, { method: 'POST', body, keepalive: true, headers: { 'content-type': 'text/plain;charset=UTF-8' } }).catch(
        () => {},
      );
    }
  } catch {
    /* analitika asosiy oqimni buzmaydi */
  }
  if (queue.length) flush(useBeacon);
}

function push(p: Payload, immediate = false) {
  if (typeof window === 'undefined') return;
  const { vid, sid, anon } = ids();
  queue.push({
    ...p,
    vid,
    sid,
    anon: anon ? 1 : undefined,
    sw: window.screen?.width,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  if (immediate) flush(true);
  else if (!timer) timer = setTimeout(() => flush(), 1500);
}

function sendLeave(useBeacon: boolean) {
  if (!current) return;
  const dur = Math.round((Date.now() - current.start) / 1000);
  if (dur > 0) push({ t: 'leave', path: current.path, dur });
  current = null;
  flush(useBeacon);
}

/** Sahifa ko'rishi — klient navigatsiyasida ham (SiteTracker chaqiradi) */
export function fpPageview(path: string, title: string) {
  if (typeof window === 'undefined') return;
  if (current?.path === path) return;
  sendLeave(false);
  const url = new URL(window.location.href);
  const utm = landing
    ? {
        source: url.searchParams.get('utm_source') ?? undefined,
        medium: url.searchParams.get('utm_medium') ?? undefined,
        campaign: url.searchParams.get('utm_campaign') ?? undefined,
      }
    : undefined;
  let ref: string | undefined;
  if (landing && document.referrer) {
    try {
      const r = new URL(document.referrer);
      if (r.host !== window.location.host) ref = r.hostname.replace(/^www\./, '');
    } catch {
      /* noto'g'ri referrer */
    }
  }
  landing = false;
  current = { path, start: Date.now() };
  push({ t: 'pv', path, title: title.slice(0, 120), ref, utm: utm?.source ? utm : undefined });
}

/** Hodisa — `lib/analytics.ts` dagi `trackEvent` dan */
export function fpEvent(name: string, params: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;
  const important = /submit|lead|request|click_call|phone_click|whatsapp_click|telegram_click/.test(name);
  push({ t: 'ev', ev: name, p: params, path: window.location.pathname }, important);
}

let listening = false;
export function fpInit() {
  if (listening || typeof window === 'undefined') return;
  listening = true;
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') sendLeave(true);
    else if (!current) current = { path: window.location.pathname, start: Date.now() };
  });
  window.addEventListener('pagehide', () => sendLeave(true));
}

/** Lead formasi uchun — arizani tashrif yo'li bilan bog'lash */
export function fpIds(): { vid: string; sid: string } | null {
  if (typeof window === 'undefined') return null;
  const { vid, sid } = ids();
  return { vid, sid };
}
