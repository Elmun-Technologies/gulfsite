/**
 * O'Z ANALITIKAMIZ — saqlash va hisoblash (server-only)
 * ----------------------------------------------------------------
 * Google Analytics / Yandex Metrika beradigan asosiy ko'rsatkichlar
 * tashqi xizmatsiz, admin panelda:
 *   tashrif buyuruvchilar · sessiyalar · ko'rishlar · sessiya davomiyligi ·
 *   bounce · real vaqt · sahifalar (kirish/chiqish) · manbalar va UTM ·
 *   qurilma / brauzer / OT / til / mamlakat · hodisalar · voronka ·
 *   mahsulotlar va qidiruvlar · har bir sessiyaning sahifa yo'li.
 *
 * Saqlash: `<DATA_DIR>/analytics/YYYY-MM-DD.jsonl` — har qator bitta hit.
 * IP manzil SAQLANMAYDI (faqat rate limit uchun xotirada). Mamlakat —
 * Cloudflare sarlavhasi yoki brauzer vaqt mintaqasidan taxmin.
 */

import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ANALYTICS_DIR } from './data-dir';

/* ------------------------------------------------------------
   Turlar
   ------------------------------------------------------------ */

export type HitType = 'pv' | 'ev' | 'leave';

export interface Hit {
  t: HitType;
  /** server vaqti, ms */
  ts: number;
  /** tashrif buyuruvchi (localStorage) va sessiya identifikatori */
  vid: string;
  sid: string;
  /** rozilik berilmagan — vaqtinchalik identifikator (faqat shu tab) */
  anon?: 1;
  path: string;
  title?: string;
  /** tashqi referrer domeni (ichki o'tishlarda bo'sh) */
  ref?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
  /** qurilma: m — mobil, t — planshet, d — desktop */
  dev: 'm' | 't' | 'd';
  br: string;
  os: string;
  lang: string;
  country?: string;
  /** hodisa nomi va parametrlari (t = 'ev') */
  ev?: string;
  p?: Record<string, string | number | boolean>;
  /** sahifada o'tkazilgan vaqt, s (t = 'leave') */
  dur?: number;
}

/* ------------------------------------------------------------
   Yozish
   ------------------------------------------------------------ */

function dayKey(ts: number): string {
  // Toshkent vaqti (UTC+5) bo'yicha kun — hisobotlar mahalliy kunga mos
  return new Date(ts + 5 * 3600_000).toISOString().slice(0, 10);
}

let dirReady = false;
export function appendHits(hits: Hit[]) {
  if (!hits.length) return;
  try {
    if (!dirReady) {
      mkdirSync(ANALYTICS_DIR, { recursive: true });
      dirReady = true;
    }
    const byDay = new Map<string, string>();
    for (const h of hits) {
      const k = dayKey(h.ts);
      byDay.set(k, (byDay.get(k) ?? '') + `${JSON.stringify(h)}\n`);
    }
    for (const [k, lines] of byDay) appendFileSync(join(ANALYTICS_DIR, `${k}.jsonl`), lines, 'utf8');
  } catch (err) {
    console.error('[analytics] yozilmadi:', String(err).slice(0, 200));
  }
}

/* ------------------------------------------------------------
   User-Agent tahlili (kutubxonasiz, asosiy holatlar)
   ------------------------------------------------------------ */

const BOT_RE = /bot|crawl|spider|slurp|lighthouse|headless|preview|facebookexternalhit|embedly|monitor|curl|wget|python|axios|node-fetch|go-http/i;

export function isBot(ua: string): boolean {
  return !ua || BOT_RE.test(ua);
}

export function parseUa(ua: string): { br: string; os: string; dev: 'm' | 't' | 'd' } {
  const br = /YaBrowser/.test(ua)
    ? 'Yandex'
    : /Edg\//.test(ua)
      ? 'Edge'
      : /OPR\/|Opera/.test(ua)
        ? 'Opera'
        : /SamsungBrowser/.test(ua)
          ? 'Samsung'
          : /Firefox|FxiOS/.test(ua)
            ? 'Firefox'
            : /Chrome|CriOS/.test(ua)
              ? 'Chrome'
              : /Safari/.test(ua)
                ? 'Safari'
                : 'Other';
  const os = /Windows/.test(ua)
    ? 'Windows'
    : /iPhone|iPad|iPod/.test(ua)
      ? 'iOS'
      : /Android/.test(ua)
        ? 'Android'
        : /Mac OS X|Macintosh/.test(ua)
          ? 'macOS'
          : /Linux/.test(ua)
            ? 'Linux'
            : 'Other';
  const dev = /iPad|Tablet/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua)) ? 't' : /Mobi|iPhone|Android/.test(ua) ? 'm' : 'd';
  return { br, os, dev };
}

/** Vaqt mintaqasidan mamlakat (GeoIP bazasisiz taxmin) */
const TZ_COUNTRY: Record<string, string> = {
  'Asia/Tashkent': 'UZ',
  'Asia/Samarkand': 'UZ',
  'Europe/Moscow': 'RU',
  'Europe/Samara': 'RU',
  'Asia/Yekaterinburg': 'RU',
  'Asia/Novosibirsk': 'RU',
  'Asia/Almaty': 'KZ',
  'Asia/Qostanay': 'KZ',
  'Asia/Aqtobe': 'KZ',
  'Asia/Bishkek': 'KG',
  'Asia/Dushanbe': 'TJ',
  'Asia/Ashgabat': 'TM',
  'Asia/Baku': 'AZ',
  'Asia/Dubai': 'AE',
  'Asia/Riyadh': 'SA',
  'Europe/Istanbul': 'TR',
  'Asia/Shanghai': 'CN',
  'Asia/Kolkata': 'IN',
  'Europe/Kiev': 'UA',
  'Europe/Kyiv': 'UA',
  'Europe/Minsk': 'BY',
  'Europe/London': 'GB',
  'Europe/Berlin': 'DE',
  'America/New_York': 'US',
  'America/Los_Angeles': 'US',
  'America/Chicago': 'US',
};

export function countryFrom(headerCountry: string | null, tz: string): string | undefined {
  const h = (headerCountry ?? '').toUpperCase();
  if (/^[A-Z]{2}$/.test(h) && h !== 'XX') return h;
  return TZ_COUNTRY[tz];
}

/* ------------------------------------------------------------
   O'qish (kunlik fayllar keshlanadi — o'zgarmagan kun qayta o'qilmaydi)
   ------------------------------------------------------------ */

const DAY_CACHE = new Map<string, { mtimeMs: number; size: number; hits: Hit[] }>();

function readDay(day: string): Hit[] {
  const file = join(ANALYTICS_DIR, `${day}.jsonl`);
  try {
    if (!existsSync(file)) return [];
    const st = statSync(file);
    const cached = DAY_CACHE.get(day);
    if (cached && cached.mtimeMs === st.mtimeMs && cached.size === st.size) return cached.hits;
    const hits: Hit[] = [];
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      if (!line) continue;
      try {
        hits.push(JSON.parse(line) as Hit);
      } catch {
        /* buzilgan qator — o'tkazib yuboramiz */
      }
    }
    DAY_CACHE.set(day, { mtimeMs: st.mtimeMs, size: st.size, hits });
    if (DAY_CACHE.size > 120) DAY_CACHE.delete(DAY_CACHE.keys().next().value!);
    return hits;
  } catch {
    return [];
  }
}

export function availableDays(): string[] {
  try {
    return readdirSync(ANALYTICS_DIR)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.jsonl$/.test(f))
      .map((f) => f.slice(0, 10))
      .sort();
  } catch {
    return [];
  }
}

export function daysBetween(from: string, to: string): string[] {
  const out: string[] = [];
  const d = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  while (d <= end && out.length < 400) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

export function todayKey(): string {
  return dayKey(Date.now());
}

export function shiftDay(day: string, delta: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

/* ------------------------------------------------------------
   Hisobot
   ------------------------------------------------------------ */

export interface Row {
  key: string;
  value: number;
  extra?: number;
}

export interface SessionSummary {
  sid: string;
  vid: string;
  start: number;
  end: number;
  durationSec: number;
  pages: { path: string; ts: number; title?: string }[];
  events: { ev: string; ts: number; p?: Hit['p'] }[];
  source: string;
  ref?: string;
  utm?: Hit['utm'];
  dev: Hit['dev'];
  br: string;
  os: string;
  lang: string;
  country?: string;
  converted: boolean;
}

export interface Report {
  from: string;
  to: string;
  totals: {
    visitors: number;
    newVisitors: number;
    sessions: number;
    pageviews: number;
    pagesPerSession: number;
    avgSessionSec: number;
    bounceRate: number;
    events: number;
    conversions: number;
    conversionRate: number;
  };
  /** oldingi teng davr — o'zgarish foizini ko'rsatish uchun */
  previous: { visitors: number; sessions: number; pageviews: number; conversions: number };
  series: { day: string; visitors: number; sessions: number; pageviews: number; conversions: number }[];
  hours: number[];
  weekdays: number[];
  pages: (Row & { visitors: number; avgSec: number })[];
  entries: Row[];
  exits: Row[];
  sources: Row[];
  referrers: Row[];
  campaigns: Row[];
  devices: Row[];
  browsers: Row[];
  os: Row[];
  langs: Row[];
  countries: Row[];
  events: Row[];
  products: Row[];
  sampleAdds: Row[];
  searches: Row[];
  funnel: { key: string; value: number }[];
  sessionsList: SessionSummary[];
}

const SEARCH_RE = /(^|\.)(google|yandex|bing|duckduckgo|yahoo|mail\.ru|baidu)\./i;
const SOCIAL_RE = /(^|\.)(instagram|facebook|fb|t\.me|telegram|youtube|youtu\.be|tiktok|linkedin|vk|ok\.ru|twitter|x\.com)/i;

export function sourceOf(h: Pick<Hit, 'ref' | 'utm'>): string {
  if (h.utm?.source) return h.utm.medium && /cpc|ppc|paid|ads/i.test(h.utm.medium) ? 'paid' : 'campaign';
  if (!h.ref) return 'direct';
  if (SEARCH_RE.test(h.ref)) return 'search';
  if (SOCIAL_RE.test(h.ref) || h.ref === 't.me') return 'social';
  return 'referral';
}

const CONVERSION_EVENTS = new Set(['generate_lead', 'lead_submit', 'sample_submit', 'sample_request']);

function topRows(map: Map<string, number>, limit = 20, extra?: Map<string, number>): Row[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, value]) => ({ key, value, extra: extra?.get(key) }));
}

function inc(map: Map<string, number>, key: string | undefined, by = 1) {
  if (!key) return;
  map.set(key, (map.get(key) ?? 0) + by);
}

/** Yo'ldan til prefiksini olib tashlash: /uz/catalog → /catalog (3 til bitta qatorga) */
export function normPath(path: string): string {
  const p = path.split('?')[0].replace(/\/+$/, '') || '/';
  return p.replace(/^\/(uz|ru|en)(?=\/|$)/, '') || '/';
}

function collectSessions(hits: Hit[]): Map<string, SessionSummary> {
  const sessions = new Map<string, SessionSummary>();
  for (const h of hits) {
    let s = sessions.get(h.sid);
    if (!s) {
      s = {
        sid: h.sid,
        vid: h.vid,
        start: h.ts,
        end: h.ts,
        durationSec: 0,
        pages: [],
        events: [],
        source: sourceOf(h),
        ref: h.ref,
        utm: h.utm,
        dev: h.dev,
        br: h.br,
        os: h.os,
        lang: h.lang,
        country: h.country,
        converted: false,
      };
      sessions.set(h.sid, s);
    }
    s.start = Math.min(s.start, h.ts);
    s.end = Math.max(s.end, h.ts + (h.t === 'leave' ? 0 : 0));
    if (h.t === 'pv') s.pages.push({ path: h.path, ts: h.ts, title: h.title });
    else if (h.t === 'ev' && h.ev) {
      s.events.push({ ev: h.ev, ts: h.ts, p: h.p });
      if (CONVERSION_EVENTS.has(h.ev)) s.converted = true;
    } else if (h.t === 'leave' && h.dur) {
      s.end = Math.max(s.end, h.ts);
    }
    if (!s.country && h.country) s.country = h.country;
  }
  for (const s of sessions.values()) {
    s.pages.sort((a, b) => a.ts - b.ts);
    s.events.sort((a, b) => a.ts - b.ts);
    s.durationSec = Math.max(0, Math.round((s.end - s.start) / 1000));
  }
  return sessions;
}

function loadRange(from: string, to: string): Hit[] {
  const out: Hit[] = [];
  for (const d of daysBetween(from, to)) {
    const hits = readDay(d);
    for (const h of hits) out.push(h);
  }
  return out;
}

export function buildReport(from: string, to: string, opts: { sessionsLimit?: number } = {}): Report {
  const hits = loadRange(from, to);
  const days = daysBetween(from, to);
  const span = days.length;
  const prevHits = loadRange(shiftDay(from, -span), shiftDay(from, -1));

  // ---- "yangi" tashrif buyuruvchilar: davrdan oldingi 90 kunda ko'rinmagan ----
  const seenBefore = new Set<string>();
  for (const d of daysBetween(shiftDay(from, -90), shiftDay(from, -1))) {
    for (const h of readDay(d)) seenBefore.add(h.vid);
  }

  const sessions = collectSessions(hits);
  const visitors = new Set<string>();
  const perDay = new Map<string, { v: Set<string>; s: Set<string>; pv: number; c: Set<string> }>();
  for (const d of days) perDay.set(d, { v: new Set(), s: new Set(), pv: 0, c: new Set() });

  const hours = new Array<number>(24).fill(0);
  const weekdays = new Array<number>(7).fill(0);
  const pageViews = new Map<string, number>();
  const pageVisitors = new Map<string, Set<string>>();
  const pageTime = new Map<string, { sum: number; n: number }>();
  const entries = new Map<string, number>();
  const exits = new Map<string, number>();
  const sources = new Map<string, number>();
  const referrers = new Map<string, number>();
  const campaigns = new Map<string, number>();
  const devices = new Map<string, number>();
  const browsers = new Map<string, number>();
  const oses = new Map<string, number>();
  const langs = new Map<string, number>();
  const countries = new Map<string, number>();
  const events = new Map<string, number>();
  const products = new Map<string, number>();
  const sampleAdds = new Map<string, number>();
  const searches = new Map<string, number>();
  let pageviews = 0;
  let eventCount = 0;

  for (const h of hits) {
    visitors.add(h.vid);
    const day = dayKey(h.ts);
    const pd = perDay.get(day);
    if (pd) {
      pd.v.add(h.vid);
      pd.s.add(h.sid);
    }
    if (h.t === 'pv') {
      pageviews += 1;
      if (pd) pd.pv += 1;
      const local = new Date(h.ts + 5 * 3600_000);
      hours[local.getUTCHours()] += 1;
      weekdays[(local.getUTCDay() + 6) % 7] += 1; // Du = 0
      const p = normPath(h.path);
      inc(pageViews, p);
      if (!pageVisitors.has(p)) pageVisitors.set(p, new Set());
      pageVisitors.get(p)!.add(h.vid);
      const prod = p.match(/^\/catalog\/([\w-]+)$/)?.[1];
      if (prod) inc(products, prod);
    } else if (h.t === 'ev' && h.ev) {
      eventCount += 1;
      inc(events, h.ev);
      if (CONVERSION_EVENTS.has(h.ev) && pd) pd.c.add(h.sid);
      if (h.ev === 'sample_add' && h.p?.sku) inc(sampleAdds, String(h.p.sku));
      if (h.ev === 'search' && h.p?.query) {
        inc(searches, String(h.p.query).toLowerCase().slice(0, 60));
      }
    } else if (h.t === 'leave' && h.dur != null) {
      const p = normPath(h.path);
      const pt = pageTime.get(p) ?? { sum: 0, n: 0 };
      pt.sum += Math.min(h.dur, 1800);
      pt.n += 1;
      pageTime.set(p, pt);
    }
  }

  let bounces = 0;
  let durSum = 0;
  let conversions = 0;
  const funnel = { sessions: 0, product: 0, sample: 0, form: 0, converted: 0 };
  for (const s of sessions.values()) {
    funnel.sessions += 1;
    if (s.pages.some((p) => /^\/catalog\/[\w-]+$/.test(normPath(p.path)))) funnel.product += 1;
    if (s.events.some((e) => e.ev === 'sample_add' || e.ev === 'sample_set_add')) funnel.sample += 1;
    if (s.pages.some((p) => /^\/(samples|contact|quote)$/.test(normPath(p.path)))) funnel.form += 1;
    if (s.converted) {
      funnel.converted += 1;
      conversions += 1;
    }
    if (s.pages.length <= 1 && s.durationSec < 10 && !s.converted) bounces += 1;
    durSum += s.durationSec;
    const first = s.pages[0];
    const last = s.pages[s.pages.length - 1];
    if (first) inc(entries, normPath(first.path));
    if (last) inc(exits, normPath(last.path));
    inc(sources, s.source);
    if (s.ref) inc(referrers, s.ref);
    if (s.utm?.campaign || s.utm?.source) inc(campaigns, [s.utm.source, s.utm.medium, s.utm.campaign].filter(Boolean).join(' / '));
    inc(devices, s.dev);
    inc(browsers, s.br);
    inc(oses, s.os);
    inc(langs, s.lang);
    inc(countries, s.country ?? '—');
  }

  const nSessions = sessions.size;
  const pages = [...pageViews.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([key, value]) => {
      const pt = pageTime.get(key);
      return {
        key,
        value,
        visitors: pageVisitors.get(key)?.size ?? 0,
        avgSec: pt && pt.n ? Math.round(pt.sum / pt.n) : 0,
      };
    });

  const prevSessions = collectSessions(prevHits);
  const prevVisitors = new Set(prevHits.map((h) => h.vid));

  const limit = opts.sessionsLimit ?? 50;
  const sessionsList = [...sessions.values()].sort((a, b) => b.start - a.start).slice(0, limit);

  return {
    from,
    to,
    totals: {
      visitors: visitors.size,
      newVisitors: [...visitors].filter((v) => !seenBefore.has(v)).length,
      sessions: nSessions,
      pageviews,
      pagesPerSession: nSessions ? +(pageviews / nSessions).toFixed(2) : 0,
      avgSessionSec: nSessions ? Math.round(durSum / nSessions) : 0,
      bounceRate: nSessions ? Math.round((bounces / nSessions) * 100) : 0,
      events: eventCount,
      conversions,
      conversionRate: nSessions ? +((conversions / nSessions) * 100).toFixed(1) : 0,
    },
    previous: {
      visitors: prevVisitors.size,
      sessions: prevSessions.size,
      pageviews: prevHits.filter((h) => h.t === 'pv').length,
      conversions: [...prevSessions.values()].filter((s) => s.converted).length,
    },
    series: days.map((d) => {
      const pd = perDay.get(d)!;
      return { day: d, visitors: pd.v.size, sessions: pd.s.size, pageviews: pd.pv, conversions: pd.c.size };
    }),
    hours,
    weekdays,
    pages,
    entries: topRows(entries),
    exits: topRows(exits),
    sources: topRows(sources),
    referrers: topRows(referrers),
    campaigns: topRows(campaigns),
    devices: topRows(devices),
    browsers: topRows(browsers),
    os: topRows(oses),
    langs: topRows(langs),
    countries: topRows(countries),
    events: topRows(events, 30),
    products: topRows(products, 20),
    sampleAdds: topRows(sampleAdds, 20),
    searches: topRows(searches, 30),
    funnel: [
      { key: 'sessions', value: funnel.sessions },
      { key: 'product', value: funnel.product },
      { key: 'sample', value: funnel.sample },
      { key: 'form', value: funnel.form },
      { key: 'converted', value: funnel.converted },
    ],
    sessionsList,
  };
}

/** Real vaqt: oxirgi N daqiqadagi faol tashrif buyuruvchilar va ular turgan sahifalar */
export function realtime(minutes = 5): { active: number; pages: Row[]; recent: Hit[] } {
  const cutoff = Date.now() - minutes * 60_000;
  const today = readDay(todayKey());
  const yesterday = readDay(shiftDay(todayKey(), -1));
  const recent = [...yesterday, ...today].filter((h) => h.ts >= cutoff);
  const lastByVisitor = new Map<string, Hit>();
  for (const h of recent) {
    if (h.t !== 'pv') continue;
    const prev = lastByVisitor.get(h.vid);
    if (!prev || prev.ts < h.ts) lastByVisitor.set(h.vid, h);
  }
  const pages = new Map<string, number>();
  for (const h of lastByVisitor.values()) inc(pages, normPath(h.path));
  return {
    active: new Set(recent.map((h) => h.vid)).size,
    pages: topRows(pages, 10),
    recent: recent.filter((h) => h.t !== 'leave').sort((a, b) => b.ts - a.ts).slice(0, 30),
  };
}

/** Bitta sessiya yoki tashrif buyuruvchining to'liq yo'li (lead sahifasi uchun) */
export function journey(opts: { sid?: string; vid?: string; days?: number }): SessionSummary[] {
  if (!opts.sid && !opts.vid) return [];
  const to = todayKey();
  const from = shiftDay(to, -(opts.days ?? 30));
  const hits = loadRange(from, to).filter((h) => (opts.sid ? h.sid === opts.sid : h.vid === opts.vid));
  return [...collectSessions(hits).values()].sort((a, b) => b.start - a.start);
}
