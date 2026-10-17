/**
 * SAYT KONTENTI (server-only) — admin paneldan tahrirlanadi
 * ----------------------------------------------------------------
 * Kod o'zgartirmasdan, deploy qilmasdan yangilanishi kerak bo'lgan narsalar:
 *   · kontaktlar: direktor + sotuv menejerlari (WhatsApp/Telegram bilan)
 *   · "Bizga ishonishadi" — mijoz logotiplari
 *   · videolar (YouTube / Instagram havolalari)
 *
 * Saqlash: `<DATA_DIR>/content/site.json` (fly.io volume). Fayl yo'q yoki
 * buzilgan bo'lsa — STANDART qiymatlar (pastda) ishlatiladi, sayt hech
 * qachon bo'sh qolmaydi. Sahifalar statik (ISR): admin saqlaganda
 * `revalidatePath` chaqiriladi, qolgan holatda `revalidate` oralig'i.
 */

import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONTENT_DIR } from './data-dir';
import { formatPhone, type ContactPerson } from './contacts';

export interface ClientLogo {
  id: string;
  name: string;
  /** `/images/clients/x.webp` (standart) yoki `/api/media/<fayl>` (yuklangan) */
  logo: string;
  url?: string;
  visible: boolean;
}

export type VideoSource = 'youtube' | 'instagram' | 'vk' | 'linkedin' | 'file';

export interface VideoItem {
  id: string;
  url: string;
  title: string;
  visible: boolean;
}

/**
 * Analitika va SEO vositalari — admin → Integratsiyalar. Kod yozmasdan
 * identifikatorni kiritish kifoya; sayt o'zi to'g'ri joyga qo'yadi.
 * Bo'sh maydon — env (NEXT_PUBLIC_*) qiymati ishlatiladi.
 */
export interface Integrations {
  /** <meta name="google-site-verification"> */
  googleVerification: string;
  /** <meta name="yandex-verification"> */
  yandexVerification: string;
  /** <meta name="msvalidate.01"> — Bing Webmaster */
  bingVerification: string;
  /** <meta name="facebook-domain-verification"> */
  facebookVerification: string;
  gtmId: string;
  ga4Id: string;
  yandexMetrikaId: string;
  metaPixelId: string;
  tiktokPixelId: string;
  /** Boshqa xizmatlar uchun qo'shimcha HTML/skript (sayt sahifalariga qo'shiladi) */
  customCode: string;
}

export interface SiteContent {
  people: ContactPerson[];
  clients: ClientLogo[];
  videos: VideoItem[];
  integrations: Integrations;
  /** standart videolar bir marta qo'shildi (keyin admin o'chirsa — qaytib chiqmaydi) */
  videosSeeded: boolean;
  updatedAt: string | null;
}

/* ------------------------------------------------------------
   Standart qiymatlar (mijoz bergan, 2026-10-17)
   ------------------------------------------------------------ */

const DEFAULT_PEOPLE: ContactPerson[] = [
  // Katalog 2026 (mijoz bergan, 2026-10-17): direktor + sotuv bo'limi, barcha raqamlarda WhatsApp/Telegram.
  // NEXT_PUBLIC_DIRECTOR_* env ustun; admin panel → Kontent'dan ham o'zgartiriladi.
  {
    role: 'director',
    name: (process.env.NEXT_PUBLIC_DIRECTOR_NAME ?? '').trim() || 'Zarif Sadriev',
    phone: formatPhone((process.env.NEXT_PUBLIC_DIRECTOR_PHONE ?? '').trim() || '+998 88 766 77 60'),
    whatsapp: true,
    telegram: true,
  },
  { role: 'sales', name: '', phone: '+998 97 570 77 60', whatsapp: true, telegram: true },
  { role: 'sales', name: '', phone: '+998 97 571 77 60', whatsapp: true, telegram: true },
];

const DEFAULT_CLIENTS: ClientLogo[] = [
  { id: 'solis-golden', name: 'Solis Golden', logo: '/images/clients/solis-golden.webp', visible: true },
  { id: 'torto', name: 'Torto', logo: '/images/clients/torto.webp', visible: true },
  { id: 'silver-green-tea', name: 'Silver Green Tea', logo: '/images/clients/silver-green-tea.webp', visible: true },
  { id: 'candy-gold', name: 'Candy Gold', logo: '/images/clients/candy-gold.webp', visible: true },
  { id: 'vitagum', name: 'Vitagum', logo: '/images/clients/vitagum.webp', visible: true },
  { id: 'pure-milky', name: 'Pure Milky', logo: '/images/clients/pure-milky.webp', visible: true },
  { id: 'asi-prime', name: 'ASI Prime', logo: '/images/clients/asi-prime.webp', visible: true },
];

/** Mijoz bergan videolar (2026-10-17): GFF reel, VK, LinkedIn, Instagram */
const DEFAULT_VIDEOS: VideoItem[] = [
  { id: 'gff-reel', url: 'https://gulfflavours.ae/images/gff-reel.mp4', title: 'Gulf Flavours & Fragrances', visible: true },
  { id: 'vk-880883776-456239018', url: 'https://vkvideo.ru/video880883776_456239018', title: '', visible: true },
  {
    id: 'li-7386667042013220865',
    url: 'https://www.linkedin.com/posts/gulf-flavours-and-fragrances_gulfflavoursandfragrances-20yearsofexcellence-activity-7386667042013220865-vg31',
    title: 'GFF — 20 years of excellence',
    visible: true,
  },
  { id: 'ig-DQeCjPfk9Mg', url: 'https://www.instagram.com/reel/DQeCjPfk9Mg/', title: '', visible: true },
  { id: 'ig-DQLyCNkk4Ti', url: 'https://www.instagram.com/reel/DQLyCNkk4Ti/', title: '', visible: true },
  { id: 'ig-DCTQ7NZvMRC', url: 'https://www.instagram.com/reel/DCTQ7NZvMRC/', title: '', visible: true },
  { id: 'ig-DCJJVmRIbV9', url: 'https://www.instagram.com/reel/DCJJVmRIbV9/', title: '', visible: true },
];

const env = (k: string) => (process.env[k] ?? '').trim();

/** Bo'sh integratsiyalar — env qiymatlari zaxira sifatida `effectiveIntegrations()` da */
export const EMPTY_INTEGRATIONS: Integrations = {
  googleVerification: '',
  yandexVerification: '',
  bingVerification: '',
  facebookVerification: '',
  gtmId: '',
  ga4Id: '',
  yandexMetrikaId: '',
  metaPixelId: '',
  tiktokPixelId: '',
  customCode: '',
};

export const DEFAULT_CONTENT: SiteContent = {
  people: DEFAULT_PEOPLE,
  clients: DEFAULT_CLIENTS,
  videos: DEFAULT_VIDEOS,
  integrations: EMPTY_INTEGRATIONS,
  videosSeeded: true,
  updatedAt: null,
};

/* ------------------------------------------------------------
   Integratsiyalar: tekshiruv
   ------------------------------------------------------------
   Admin ko'pincha butun <meta …> tegini yoki skript parchasini
   joylashtiradi — kerakli identifikatorni o'zimiz ajratib olamiz. */

function pick(raw: unknown, re: RegExp, max = 200): string {
  const s = typeof raw === 'string' ? raw.trim().slice(0, 4000) : '';
  if (!s) return '';
  const content = /content\s*=\s*["']([^"']+)["']/i.exec(s)?.[1] ?? s;
  const m = re.exec(content);
  return m ? (m[1] ?? m[0]).slice(0, max) : '';
}

export function sanitizeIntegrations(raw: unknown): Integrations {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const token = /^[\w\-=+/.]{4,200}$/;
  return {
    googleVerification: pick(r.googleVerification, token),
    yandexVerification: pick(r.yandexVerification, token),
    bingVerification: pick(r.bingVerification, token),
    facebookVerification: pick(r.facebookVerification, token),
    gtmId: pick(r.gtmId, /GTM-[A-Z0-9]{4,12}/i).toUpperCase(),
    ga4Id: pick(r.ga4Id, /G-[A-Z0-9]{4,16}/i).toUpperCase(),
    // Metrika: raqam yoki ym(12345678, …) / mc.yandex.ru/watch/12345678
    yandexMetrikaId: pick(r.yandexMetrikaId, /(?:ym\(|watch\/)?(\d{5,12})/),
    metaPixelId: pick(r.metaPixelId, /(?:init['",\s]+|id=)?(\d{10,20})/),
    tiktokPixelId: pick(r.tiktokPixelId, /(?:load\(['"])?([A-Z0-9]{15,30})/i).toUpperCase(),
    customCode: typeof r.customCode === 'string' ? r.customCode.slice(0, 20000) : '',
  };
}

/** Saytda ishlatiladigan qiymatlar: admin kiritgani, bo'lmasa env */
export function effectiveIntegrations(i: Integrations): Integrations {
  return {
    googleVerification: i.googleVerification || env('GOOGLE_SITE_VERIFICATION'),
    yandexVerification: i.yandexVerification || env('YANDEX_VERIFICATION'),
    bingVerification: i.bingVerification || env('BING_SITE_VERIFICATION'),
    facebookVerification: i.facebookVerification || env('FACEBOOK_DOMAIN_VERIFICATION'),
    gtmId: i.gtmId || env('NEXT_PUBLIC_GTM_ID'),
    ga4Id: i.ga4Id || env('NEXT_PUBLIC_GA4_ID'),
    yandexMetrikaId: i.yandexMetrikaId || env('NEXT_PUBLIC_YANDEX_METRIKA_ID'),
    metaPixelId: i.metaPixelId || env('NEXT_PUBLIC_META_PIXEL_ID'),
    tiktokPixelId: i.tiktokPixelId || env('NEXT_PUBLIC_TIKTOK_PIXEL_ID'),
    customCode: i.customCode,
  };
}

/* ------------------------------------------------------------
   O'qish / yozish
   ------------------------------------------------------------ */

const FILE = join(CONTENT_DIR, 'site.json');
let cache: { mtimeMs: number; data: SiteContent } | null = null;

function str(v: unknown, max = 200): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/** Fayldan kelgan (yoki admin yuborgan) ma'lumotni tozalash — noma'lum maydonlar tashlanadi */
export function sanitizeContent(raw: unknown): SiteContent {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const arr = (v: unknown) => (Array.isArray(v) ? v : []);

  const people = arr(r.people)
    .map((p) => p as Record<string, unknown>)
    .map(
      (p): ContactPerson => ({
        role: p.role === 'director' ? 'director' : 'sales',
        name: str(p.name, 80),
        phone: formatPhone(str(p.phone, 40)),
        whatsapp: p.whatsapp !== false,
        telegram: p.telegram !== false,
      }),
    )
    .filter((p) => p.phone.replace(/\D/g, '').length >= 9)
    .slice(0, 12);

  const clients = arr(r.clients)
    .map((c) => c as Record<string, unknown>)
    .map(
      (c): ClientLogo => ({
        id: str(c.id, 60) || `c${Math.random().toString(36).slice(2, 8)}`,
        name: str(c.name, 80),
        logo: str(c.logo, 300),
        url: /^https?:\/\//.test(str(c.url, 300)) ? str(c.url, 300) : undefined,
        visible: c.visible !== false,
      }),
    )
    // faqat o'z serverimizdagi rasm yo'llari (tashqi URL — XSS/tracking xavfi)
    .filter((c) => c.name && /^\/(images\/clients|api\/media)\/[\w.-]+$/.test(c.logo))
    .slice(0, 40);

  const videos = arr(r.videos)
    .map((v) => v as Record<string, unknown>)
    .map(
      (v): VideoItem => ({
        id: str(v.id, 60) || `v${Math.random().toString(36).slice(2, 8)}`,
        url: str(v.url, 300),
        title: str(v.title, 140),
        visible: v.visible !== false,
      }),
    )
    .filter((v) => parseVideo(v.url) !== null)
    .slice(0, 24);

  return {
    people,
    clients,
    videos,
    integrations: sanitizeIntegrations(r.integrations),
    videosSeeded: r.videosSeeded === true,
    updatedAt: str(r.updatedAt, 40) || null,
  };
}

export function getContent(): SiteContent {
  try {
    if (!existsSync(FILE)) return DEFAULT_CONTENT;
    const { mtimeMs } = statSync(FILE);
    if (cache && cache.mtimeMs === mtimeMs) return cache.data;
    const data = withSeededVideos(sanitizeContent(JSON.parse(readFileSync(FILE, 'utf8'))));
    cache = { mtimeMs, data };
    return data;
  } catch (err) {
    console.error('[content] site.json o‘qilmadi, standart qiymatlar ishlatiladi:', String(err).slice(0, 200));
    return DEFAULT_CONTENT;
  }
}

/** Fayl standart videolar qo'shilishidan oldin saqlangan bo'lsa — ularni bir marta qo'shamiz */
function withSeededVideos(data: SiteContent): SiteContent {
  if (data.videosSeeded) return data;
  const have = new Set(data.videos.map((v) => v.url));
  return { ...data, videos: [...data.videos, ...DEFAULT_VIDEOS.filter((v) => !have.has(v.url))].slice(0, 24), videosSeeded: true };
}

/**
 * Saqlash. Kelgan obyekt joriy kontent ustiga qo'yiladi — Kontent va
 * Integratsiyalar sahifalari faqat o'z bo'limini yuborsa ham boshqasi o'chmaydi.
 */
export function saveContent(next: unknown): SiteContent {
  const patch = (next && typeof next === 'object' ? next : {}) as Record<string, unknown>;
  const data = {
    ...sanitizeContent({ ...getContent(), ...patch }),
    videosSeeded: true,
    updatedAt: new Date().toISOString(),
  };
  mkdirSync(CONTENT_DIR, { recursive: true });
  const tmp = `${FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  renameSync(tmp, FILE); // atomik: yarim yozilgan fayl o'qilmaydi
  cache = null;
  return data;
}

/* ------------------------------------------------------------
   Sayt uchun: mahalliy fayl YOKI alohida backend (Vercel + fly)
   ------------------------------------------------------------
   `BACKEND_URL` sozlangan bo'lsa (Vercel'dagi sayt), kontent fly'dagi
   `/api/content/public` dan olinadi: ISR keshi + `site-content` tegi.
   Admin saqlaganda fly Vercel'ning `/api/revalidate` ga xabar beradi.
   Aloqa uzilsa — standart qiymatlar (sayt hech qachon bo'sh qolmaydi). */

const BACKEND_URL = (process.env.BACKEND_URL ?? '').trim().replace(/\/+$/, '');

export async function loadContent(): Promise<SiteContent> {
  if (!BACKEND_URL) return getContent();
  try {
    const res = await fetch(`${BACKEND_URL}/api/content/public`, {
      next: { revalidate: 600, tags: ['site-content'] },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { data?: unknown };
    const data = sanitizeContent(json.data);
    // yuklangan logotiplar fly'da — mutlaq manzil
    return {
      ...data,
      clients: data.clients.map((c) => (c.logo.startsWith('/api/media/') ? { ...c, logo: `${BACKEND_URL}${c.logo}` } : c)),
    };
  } catch (err) {
    console.error('[content] backend kontenti olinmadi, standart qiymatlar:', String(err).slice(0, 200));
    return DEFAULT_CONTENT;
  }
}

export async function visibleClients(): Promise<ClientLogo[]> {
  return (await loadContent()).clients.filter((c) => c.visible);
}

export async function visibleVideos(): Promise<(VideoItem & { parsed: ParsedVideo })[]> {
  return (await loadContent())
    .videos.filter((v) => v.visible)
    .map((v) => ({ ...v, parsed: parseVideo(v.url)! }))
    .filter((v) => v.parsed);
}

export async function contactPeople(): Promise<{ director: ContactPerson | null; managers: ContactPerson[] }> {
  const people = (await loadContent()).people;
  const managers = people.filter((p) => p.role === 'sales');
  return {
    director: people.find((p) => p.role === 'director') ?? null,
    // menejerlar ro'yxati bo'shatib yuborilsa ham sayt raqamsiz qolmasin
    managers: managers.length ? managers : DEFAULT_PEOPLE.filter((p) => p.role === 'sales'),
  };
}

/* ------------------------------------------------------------
   Video havolasini tahlil qilish
   ------------------------------------------------------------ */

export interface ParsedVideo {
  source: VideoSource;
  id: string;
  /** iframe manzili (faqat bosilgandan keyin yuklanadi) */
  embed: string;
  /** asl sahifa (yangi oynada ochish uchun) */
  href: string;
  /** muqova rasmi (YouTube'da bor, Instagram/VK'da yo'q) */
  thumb?: string;
  /** to'g'ridan-to'g'ri video fayl (.mp4/.webm) — iframe emas, <video> */
  file?: string;
}

export function parseVideo(url: string): ParsedVideo | null {
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\.|^m\./, '');

  if (host === 'youtu.be' || host === 'youtube.com' || host === 'youtube-nocookie.com') {
    let id = '';
    if (host === 'youtu.be') id = u.pathname.slice(1);
    else if (u.pathname === '/watch') id = u.searchParams.get('v') ?? '';
    else id = u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]+)/)?.[1] ?? '';
    if (!/^[\w-]{6,20}$/.test(id)) return null;
    return {
      source: 'youtube',
      id,
      embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
      href: `https://www.youtube.com/watch?v=${id}`,
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }

  if (host === 'instagram.com') {
    const m = u.pathname.match(/^\/(?:[\w.]+\/)?(p|reel|reels|tv)\/([\w-]+)/);
    if (!m) return null;
    const kind = m[1] === 'reels' ? 'reel' : m[1];
    return {
      source: 'instagram',
      id: m[2],
      embed: `https://www.instagram.com/${kind}/${m[2]}/embed`,
      href: `https://www.instagram.com/${kind}/${m[2]}/`,
    };
  }

  // VK Video: vkvideo.ru/video-123_456, vk.com/video123_456, ?z=video123_456
  if (host === 'vkvideo.ru' || host === 'vk.com' || host === 'vk.ru') {
    const m = `${u.pathname}${u.search}`.match(/video(-?\d+)_(\d+)/);
    if (!m) return null;
    const [, oid, vid] = m;
    return {
      source: 'vk',
      id: `${oid}_${vid}`,
      embed: `https://vkvideo.ru/video_ext.php?oid=${oid}&id=${vid}&hd=2&autoplay=1`,
      href: `https://vkvideo.ru/video${oid}_${vid}`,
    };
  }

  // LinkedIn post: /posts/…-activity-<id>-… yoki /feed/update/urn:li:activity:<id>
  if (host === 'linkedin.com') {
    const id = (u.pathname.match(/activity[-:](\d{15,22})/) ?? [])[1];
    if (!id) return null;
    return {
      source: 'linkedin',
      id,
      embed: `https://www.linkedin.com/embed/feed/update/urn:li:activity:${id}`,
      href: `https://www.linkedin.com/feed/update/urn:li:activity:${id}/`,
    };
  }

  // To'g'ridan-to'g'ri fayl (masalan gulfflavours.ae/images/gff-reel.mp4) — faqat https
  if (u.protocol === 'https:' && /\.(mp4|webm|mov)$/i.test(u.pathname)) {
    const file = `${u.origin}${u.pathname}`;
    return { source: 'file', id: file.slice(-40), embed: file, href: file, file };
  }

  return null;
}
