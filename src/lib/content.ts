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

export type VideoSource = 'youtube' | 'instagram';

export interface VideoItem {
  id: string;
  url: string;
  title: string;
  visible: boolean;
}

export interface SiteContent {
  people: ContactPerson[];
  clients: ClientLogo[];
  videos: VideoItem[];
  updatedAt: string | null;
}

/* ------------------------------------------------------------
   Standart qiymatlar (mijoz bergan, 2026-10-17)
   ------------------------------------------------------------ */

const DEFAULT_PEOPLE: ContactPerson[] = [
  ...((process.env.NEXT_PUBLIC_DIRECTOR_PHONE ?? '').trim()
    ? [
        {
          role: 'director' as const,
          name: (process.env.NEXT_PUBLIC_DIRECTOR_NAME ?? '').trim(),
          phone: formatPhone(process.env.NEXT_PUBLIC_DIRECTOR_PHONE ?? ''),
          whatsapp: true,
          telegram: true,
        },
      ]
    : []),
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
];

export const DEFAULT_CONTENT: SiteContent = {
  people: DEFAULT_PEOPLE,
  clients: DEFAULT_CLIENTS,
  videos: [],
  updatedAt: null,
};

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

  return { people, clients, videos, updatedAt: str(r.updatedAt, 40) || null };
}

export function getContent(): SiteContent {
  try {
    if (!existsSync(FILE)) return DEFAULT_CONTENT;
    const { mtimeMs } = statSync(FILE);
    if (cache && cache.mtimeMs === mtimeMs) return cache.data;
    const data = sanitizeContent(JSON.parse(readFileSync(FILE, 'utf8')));
    cache = { mtimeMs, data };
    return data;
  } catch (err) {
    console.error('[content] site.json o‘qilmadi, standart qiymatlar ishlatiladi:', String(err).slice(0, 200));
    return DEFAULT_CONTENT;
  }
}

export function saveContent(next: unknown): SiteContent {
  const data = { ...sanitizeContent(next), updatedAt: new Date().toISOString() };
  mkdirSync(CONTENT_DIR, { recursive: true });
  const tmp = `${FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  renameSync(tmp, FILE); // atomik: yarim yozilgan fayl o'qilmaydi
  cache = null;
  return data;
}

/* ------------------------------------------------------------
   Sayt uchun qulay yordamchilar
   ------------------------------------------------------------ */

export function visibleClients(): ClientLogo[] {
  return getContent().clients.filter((c) => c.visible);
}

export function visibleVideos(): (VideoItem & { parsed: ParsedVideo })[] {
  return getContent()
    .videos.filter((v) => v.visible)
    .map((v) => ({ ...v, parsed: parseVideo(v.url)! }))
    .filter((v) => v.parsed);
}

export function contactPeople(): { director: ContactPerson | null; managers: ContactPerson[] } {
  const people = getContent().people;
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
  /** muqova rasmi (YouTube'da bor, Instagram'da yo'q) */
  thumb?: string;
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

  return null;
}
