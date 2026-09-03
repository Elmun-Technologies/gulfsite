/**
 * UMUMIY YORDAMCHI FUNKSIYALAR
 */

/** Klass nomlarini birlashtirish (shartli) */
export function cn(...parts: Array<string | number | bigint | boolean | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Slug yaratish */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\u2018\u2019\u02BB\u02BC'`]/g, '')
    .replace(/[^a-z0-9\u0400-\u04FF]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/* ------------------------------------------------------------
   TELEFON — O'ZBEKISTON
   ------------------------------------------------------------ */

export const UZ_PHONE_RE = /^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;

/** Har qanday kiritishdan +998XXXXXXXXX chiqaradi */
export function normalizeUzPhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('998')) digits = digits.slice(3);
  else if (digits.startsWith('8') && digits.length === 10) digits = digits.slice(1);
  else if (digits.startsWith('0') && digits.length === 10) digits = digits.slice(1);
  digits = digits.slice(0, 9);
  if (digits.length < 9) return '';
  return `+998${digits}`;
}

export function isValidUzPhone(raw: string): boolean {
  const n = normalizeUzPhone(raw);
  if (!n) return false;
  const code = n.slice(4, 6);
  // O'zbekiston operator kodlari: 33, 50, 55, 70..79, 88, 90..99, 71..79 (shahar)
  const valid = /^(33|50|55|61|65|66|67|70|71|72|73|74|75|76|77|79|88|90|91|93|94|95|97|98|99)$/;
  return valid.test(code);
}

/** Ko'rsatish uchun format: +998 90 123 45 67 */
export function formatUzPhone(raw: string): string {
  const n = normalizeUzPhone(raw);
  if (!n) return raw;
  const d = n.slice(4);
  return `+998 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
}

/** Foydalanuvchi yozayotganda real vaqtda formatlash */
export function maskUzPhone(input: string): string {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('998')) digits = digits.slice(3);
  else if (digits.startsWith('8')) digits = digits.slice(1);
  digits = digits.slice(0, 9);

  let out = '+998';
  if (digits.length === 0) return out;
  out += ' ' + digits.slice(0, 2);
  if (digits.length > 2) out += ' ' + digits.slice(2, 5);
  if (digits.length > 5) out += ' ' + digits.slice(5, 7);
  if (digits.length > 7) out += ' ' + digits.slice(7, 9);
  return out;
}

/** Umumiy xalqaro telefon tekshiruvi (O'zbekistondan tashqari mijozlar uchun) */
export function isValidInternationalPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

/* ------------------------------------------------------------
   E-MAIL
   ------------------------------------------------------------ */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(raw: string): boolean {
  return EMAIL_RE.test(raw.trim()) && raw.trim().length <= 254;
}

/** Bepul pochta provayderlari — B2B lead sifatini baholashda */
export const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'mail.ru', 'yandex.ru', 'yandex.uz', 'list.ru', 'bk.ru', 'inbox.ru',
  'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'umail.uz', 'exat.uz',
]);

export function isFreeEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  return FREE_EMAIL_DOMAINS.has(domain);
}

/* ------------------------------------------------------------
   STIRS / INN — O'zbekiston (9 raqam)
   ------------------------------------------------------------ */

export function normalizeInn(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 9);
}

export function isValidInn(raw: string): boolean {
  const inn = normalizeInn(raw);
  return inn.length === 9;
}

/* ------------------------------------------------------------
   SANALAR
   ------------------------------------------------------------ */

const MONTHS = {
  uz: ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'],
  ru: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

export function formatDate(iso: string, locale: 'uz' | 'ru' | 'en' = 'uz'): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())} ${MONTHS[locale][d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateTime(iso: string, locale: 'uz' | 'ru' | 'en' = 'uz'): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${formatDate(iso, locale)}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Nisbiy vaqt: "5 daqiqa oldin" */
export function timeAgo(iso: string, locale: 'uz' | 'ru' | 'en' = 'uz'): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const secs = Math.floor((Date.now() - then) / 1000);

  const t = {
    uz: { just: 'hozir', min: 'daqiqa', hour: 'soat', day: 'kun', ago: 'oldin' },
    ru: { just: 'только что', min: 'мин', hour: 'ч', day: 'дн', ago: 'назад' },
    en: { just: 'just now', min: 'min', hour: 'h', day: 'd', ago: 'ago' },
  }[locale];

  if (secs < 45) return t.just;
  if (secs < 3600) return `${Math.floor(secs / 60)} ${t.min} ${t.ago}`;
  if (secs < 86400) return `${Math.floor(secs / 3600)} ${t.hour} ${t.ago}`;
  if (secs < 86400 * 7) return `${Math.floor(secs / 86400)} ${t.day} ${t.ago}`;
  return formatDate(iso, locale);
}

/* ------------------------------------------------------------
   SONLAR
   ------------------------------------------------------------ */

export function formatNumber(n: number, locale: 'uz' | 'ru' | 'en' = 'uz'): string {
  return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : locale === 'uz' ? 'en-US' : 'en-US').format(n);
}

export function formatDosage(min: number, max: number): string {
  const f = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, '').replace(/\.$/, ''));
  return `${f(min)}–${f(max)}%`;
}

export function formatKg(kg: number): string {
  if (kg >= 1000) return `${kg / 1000} t`;
  return `${kg} kg`;
}

/* ------------------------------------------------------------
   LEAD NOMERI
   ------------------------------------------------------------ */

/** O'qish oson: GFF-UZ-2026-000123 */
export function makeLeadRef(seq: number, date = new Date()): string {
  const y = date.getUTCFullYear();
  const doy = Math.floor((date.getTime() - Date.UTC(y, 0, 0)) / 86400000);
  return `GFF-${y}-${String(doy).padStart(3, '0')}-${String(seq).padStart(4, '0')}`;
}

export function makeId(prefix = 'ld'): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}${rand}`;
}

/* ------------------------------------------------------------
   UTM / REFERRER PARSING
   ------------------------------------------------------------ */

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'ymclid'];

export function parseUtm(search: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!search) return out;
  try {
    const sp = new URLSearchParams(search);
    for (const k of UTM_KEYS) {
      const v = sp.get(k);
      if (v) out[k] = v.slice(0, 120);
    }
  } catch {
    /* boshqariladigan holat — bo'sh obyekt */
  }
  return out;
}

/* ------------------------------------------------------------
   XAVFSIZLIK
   ------------------------------------------------------------ */

/** Vaqt-bo'yicha o'zgarmas taqqoslash (timing hujumlarining oldini oladi) */
export function safeEqual(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

/** Log uchun xavfsizlashtirish (CRLF injection) */
export function sanitizeLog(input: string): string {
  return String(input).replace(/[\r\n\t]/g, ' ').slice(0, 500);
}

/** Foydalanuvchi matnini HTML dan tozalash (Telegram xabarida muhim) */
export function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** CSV eksporti uchun maydon */
export function csvCell(value: unknown): string {
  const s = value == null ? '' : String(value);
  if (/[",;\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCsv(rows: (string | number | boolean | null | undefined)[][]): string {
  // \uFEFF — UTF-8 BOM: Excel kirill/o'zbek harflarini to'g'ri o'qishi uchun.
  // Ajratgich `;` (Excel'ning MDH lokalizatsiyasida standart).
  // Oxiridagi CRLF — RFC 4180 bo'yicha har bir yozuv qator tugashi kerak;
  // ba'zi parserlar (va `wc -l`) faylni to'liq sanashi uchun ham muhim.
  return '\uFEFF' + rows.map((r) => r.map(csvCell).join(';')).join('\r\n') + '\r\n';
}

/* ------------------------------------------------------------
   HOLAT (debounce / clamp)
   ------------------------------------------------------------ */

export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function debounce<T extends (...args: never[]) => void>(fn: T, ms: number) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

/** Ob'ektdan bo'sh qiymatlarni olib tashlash */
export function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'string' && !v.trim()) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    // @ts-expect-error — dinamik kalit
    out[k] = v;
  }
  return out;
}
