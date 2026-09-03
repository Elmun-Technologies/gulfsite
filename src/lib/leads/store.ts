/**
 * LEAD SAQLASH QATLAMI
 * ----------------------------------------------------------------
 * Drayverlar:
 *   "file"   — JSONL (oylik fayllar). VPS / Docker / Node.js uchun ideal.
 *   "memory" — faqat jarayon xotirasida. Serverless/read-only FS uchun
 *              zaxira variant (leadlar baribir Telegram/e-mail orqali ketadi).
 *
 * Fayl tuzilishi:
 *   data/leads/leads-2026-09.jsonl   — har qatorda bitta lead (JSON)
 *   data/leads/meta.json             — ketma-ket raqamlar hisoblagichi
 *
 * Yozish — append (tez va xavfsiz). Yangilash — oylik faylni
 * vaqtinchalik faylga yozib, atomik rename qilish orqali.
 */

import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import type { LeadRecord, LeadStatusId } from '../types';
import { makeId, sanitizeLog } from '../utils';
import { serverConfig } from '../config';

/* ------------------------------------------------------------
   Konfiguratsiya
   ------------------------------------------------------------ */

const DRIVER = serverConfig.storage.driver === 'memory' ? 'memory' : 'file';
/**
 * Lead papkasi:
 *   - `LEAD_STORAGE_PATH` sozlangan bo'lsa — o'sha yo'l (mutlaq yoki nisbiy);
 *   - aks holda `<cwd>/data/leads`.
 *
 * Diqqat: `process.cwd()` ISHLAYOTGAN papkaga bog'liq. Standalone serverni
 * `.next/standalone` ichidan ishga tushirsangiz, lead'lar build papkasiga
 * tushadi va keyingi `next build` ularni O'CHIRADI — shuning uchun
 * `scripts/start.mjs` serverni loyiha ildizidan (cwd = repo) ishga tushiradi,
 * Docker'da esa `/app/data/leads` volume sifatida ulanadi.
 *
 * Turbopack dinamik yo'llarni bundle'ga trace qilmasligi uchun papkani
 * o'qiydigan joylarda `/* turbopackIgnore: true *\/` belgisi qo'yilgan.
 */
const ENV_DIR = (process.env.LEAD_STORAGE_PATH ?? '').trim();
/**
 * `turbopackIgnore` SHART: aks holda Turbopack dinamik yo'lni ko'rib
 * BUTUN loyihani (src/, public/, data/, README...) server bundle'ga
 * trace qiladi va `.next/standalone` 386 MB ga shishib ketadi
 * (Docker obraz hajmi va deploy tezligi buziladi).
 * Bu belgi faqat BUILD vaqtidagi tracing'ni o'chiradi — runtime'da
 * yo'l xuddi shunday hisoblanadi va ishlaydi.
 */
const BASE_DIR = ENV_DIR
  ? resolve(/* turbopackIgnore: true */ process.cwd(), ENV_DIR)
  : join(process.cwd(), 'data', 'leads');
const MEM: LeadRecord[] = [];

function ensureDir() {
  if (DRIVER !== 'file') return;
  try {
    mkdirSync(BASE_DIR, { recursive: true });
  } catch (err) {
    // Fayl tizimi faqat o'qish uchun → xotira drayveriga o'tamiz
    console.error('[lead-store] papka yaratilmadi, memory rejimiga o‘tiladi:', sanitizeLog(String(err)));
  }
}

function monthKey(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

function fileFor(month: string): string {
  return join(BASE_DIR, `leads-${month}.jsonl`);
}

function metaFile(): string {
  return join(BASE_DIR, 'meta.json');
}

/* ------------------------------------------------------------
   Jarayon ichidagi bloklash (bir vaqtda bir yozish)
   ------------------------------------------------------------ */

let writeQueue: Promise<unknown> = Promise.resolve();

function serialized<T>(task: () => Promise<T> | T): Promise<T> {
  const next = writeQueue.then(task, task);
  writeQueue = next.catch(() => undefined);
  return next as Promise<T>;
}

/* ------------------------------------------------------------
   Ketma-ket raqam (ref)
   ------------------------------------------------------------ */

interface Meta {
  seq: number;
  lastMonth: string;
}

function readMeta(): Meta {
  if (DRIVER !== 'file') return { seq: MEM.length, lastMonth: monthKey() };
  try {
    if (!existsSync(metaFile())) return { seq: 0, lastMonth: monthKey() };
    const raw = JSON.parse(readFileSync(metaFile(), 'utf8')) as Partial<Meta>;
    return { seq: Number(raw.seq) || 0, lastMonth: raw.lastMonth || monthKey() };
  } catch {
    return { seq: 0, lastMonth: monthKey() };
  }
}

function writeMeta(meta: Meta) {
  if (DRIVER !== 'file') return;
  try {
    writeFileSync(metaFile(), JSON.stringify(meta, null, 2), 'utf8');
  } catch (err) {
    console.error('[lead-store] meta yozilmadi:', sanitizeLog(String(err)));
  }
}

/** GFF-2026-246-0007 ko'rinishidagi o'qish oson raqam */
function nextRef(): { ref: string; seq: number } {
  const meta = readMeta();
  const now = new Date();
  const mk = monthKey(now);
  const seq = meta.lastMonth === mk ? meta.seq + 1 : 1;
  writeMeta({ seq, lastMonth: mk });

  const doy = Math.floor((now.getTime() - Date.UTC(now.getUTCFullYear(), 0, 0)) / 86400000);
  const ref = `GFF-${now.getUTCFullYear()}-${String(doy).padStart(3, '0')}-${String(seq).padStart(4, '0')}`;
  return { ref, seq };
}

/* ------------------------------------------------------------
   O'qish
   ------------------------------------------------------------ */

function parseLine(line: string): LeadRecord | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed) as LeadRecord;
  } catch {
    return null;
  }
}

function readMonth(month: string): LeadRecord[] {
  if (DRIVER !== 'file') return [];
  const f = fileFor(month);
  if (!existsSync(f)) return [];
  try {
    return readFileSync(f, 'utf8')
      .split('\n')
      .map(parseLine)
      .filter((x): x is LeadRecord => x !== null);
  } catch (err) {
    console.error('[lead-store] oy fayli o‘qilmadi:', sanitizeLog(String(err)));
    return [];
  }
}

export function listMonths(): string[] {
  if (DRIVER !== 'file') return [monthKey()];
  ensureDir();
  try {
    return readdirSync(/* turbopackIgnore: true */ BASE_DIR)
      .filter((f) => /^leads-\d{4}-\d{2}\.jsonl$/.test(f))
      .map((f) => f.replace(/^leads-|\.jsonl$/g, ''))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

/** Barcha leadlar (yangi → eski). Katta hajmda `listLeads` dan foydalaning. */
export function readAllLeads(): LeadRecord[] {
  if (DRIVER === 'memory') return [...MEM].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const out: LeadRecord[] = [];
  for (const m of listMonths()) out.push(...readMonth(m));
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* ------------------------------------------------------------
   Filtrlash
   ------------------------------------------------------------ */

export interface LeadQuery {
  q?: string;
  status?: LeadStatusId[];
  type?: string[];
  region?: string[];
  from?: string; // ISO
  to?: string; // ISO
  sort?: 'newest' | 'oldest' | 'quality';
  page?: number;
  pageSize?: number;
}

export interface LeadQueryResult {
  items: LeadRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function listLeads(query: LeadQuery = {}): LeadQueryResult {
  const {
    q = '',
    status = [],
    type = [],
    region = [],
    from,
    to,
    sort = 'newest',
    page = 1,
    pageSize = 25,
  } = query;

  let items = readAllLeads();

  if (status.length) {
    const set = new Set(status);
    items = items.filter((l) => set.has(l.status));
  }
  if (type.length) {
    const set = new Set(type);
    items = items.filter((l) => set.has(l.type));
  }
  if (region.length) {
    const set = new Set(region);
    items = items.filter((l) => (l.location.region ? set.has(l.location.region) : false));
  }
  if (from) items = items.filter((l) => l.createdAt >= from);
  if (to) items = items.filter((l) => l.createdAt <= to);

  const needle = q.trim().toLowerCase();
  if (needle) {
    const digits = needle.replace(/\D/g, '');
    items = items.filter((l) => {
      const hay = [
        l.ref,
        l.contact.fullName,
        l.contact.phone,
        l.contact.email ?? '',
        l.company.name,
        l.company.inn ?? '',
        l.location.city ?? '',
        (l.request.products ?? []).map((p) => Object.values(p.name).join(' ')).join(' '),
        l.request.message ?? '',
      ]
        .join(' ')
        .toLowerCase();
      if (hay.includes(needle)) return true;
      if (digits.length >= 5 && l.contact.phone.replace(/\D/g, '').includes(digits)) return true;
      return false;
    });
  }

  if (sort === 'oldest') items = items.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  else if (sort === 'quality') items = items.sort((a, b) => b.spamScore - a.spamScore || b.createdAt.localeCompare(a.createdAt));

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return { items: items.slice(start, start + pageSize), total, page: safePage, pageSize, totalPages };
}

export function getLead(id: string): LeadRecord | null {
  return readAllLeads().find((l) => l.id === id) ?? null;
}

export function getLeadByRef(ref: string): LeadRecord | null {
  return readAllLeads().find((l) => l.ref.toLowerCase() === ref.toLowerCase()) ?? null;
}

/* ------------------------------------------------------------
   Yaratish
   ------------------------------------------------------------ */

export function createLead(
  input: Omit<LeadRecord, 'id' | 'ref' | 'createdAt' | 'updatedAt' | 'status' | 'history'>,
): LeadRecord {
  const now = new Date().toISOString();
  const { ref } = nextRef();

  const record: LeadRecord = {
    ...input,
    id: makeId(),
    ref,
    status: input.spamScore >= 80 ? 'spam' : 'new',
    createdAt: now,
    updatedAt: now,
    notes: input.notes ?? [],
    history: [{ at: now, from: '—', to: input.spamScore >= 80 ? 'spam' : 'new' }],
  };

  const mk = monthKey(new Date(now));
  if (DRIVER === 'memory') {
    MEM.unshift(record);
    return record;
  }

  ensureDir();
  try {
    appendFileSync(fileFor(mk), `${JSON.stringify(record)}\n`, 'utf8');
  } catch (err) {
    console.error('[lead-store] yozishda xato:', sanitizeLog(String(err)));
    MEM.unshift(record); // zaxira — hech bo'lmaganda jarayon xotirasida saqlansin
  }
  return record;
}

/* ------------------------------------------------------------
   Yangilash
   ------------------------------------------------------------ */

export type LeadPatch = Partial<Pick<LeadRecord, 'status' | 'spamScore' | 'notifications'>> & {
  note?: { text: string; author: string };
};

export async function updateLead(id: string, patch: LeadPatch): Promise<LeadRecord | null> {
  return serialized(async () => {
    const mk = monthOfLead(id);
    const month = mk ?? monthKey();

    if (DRIVER === 'memory') {
      const idx = MEM.findIndex((l) => l.id === id);
      if (idx < 0) return null;
      const prev = MEM[idx]!;
      const updated = applyPatch(prev, patch);
      MEM[idx] = updated;
      return updated;
    }

    const rows = readMonth(month);
    const idx = rows.findIndex((l) => l.id === id);
    if (idx < 0) return null;

    const prev = rows[idx]!;
    const updated = applyPatch(prev, patch);
    rows[idx] = updated;

    // Atomik yozish: vaqtinchalik fayl → rename
    const target = fileFor(month);
    const tmp = `${target}.tmp-${process.pid}-${Date.now()}`;
    try {
      writeFileSync(tmp, rows.map((r) => JSON.stringify(r)).join('\n') + '\n', 'utf8');
      renameSync(tmp, target);
    } catch (err) {
      console.error('[lead-store] yangilash yozilmadi:', sanitizeLog(String(err)));
      try {
        if (existsSync(tmp)) renameSync(tmp, `${target}.corrupt-${Date.now()}`);
      } catch {
        /* e'tiborsiz qoldiramiz */
      }
      return null;
    }
    return updated;
  });
}

function applyPatch(lead: LeadRecord, patch: LeadPatch): LeadRecord {
  const now = new Date().toISOString();
  const next: LeadRecord = { ...lead, updatedAt: now };

  if (patch.status && patch.status !== lead.status) {
    next.status = patch.status;
    next.history = [...(lead.history ?? []), { at: now, from: lead.status, to: patch.status }];
  }
  if (typeof patch.spamScore === 'number') next.spamScore = patch.spamScore;
  if (patch.notifications) next.notifications = { ...lead.notifications, ...patch.notifications };
  if (patch.note?.text?.trim()) {
    next.notes = [
      ...(lead.notes ?? []),
      { at: now, text: patch.note.text.trim().slice(0, 2000), author: patch.note.author || 'admin' },
    ];
  }
  return next;
}

function monthOfLead(id: string): string | null {
  for (const m of listMonths()) {
    if (readMonth(m).some((l) => l.id === id)) return m;
  }
  return null;
}

/* ------------------------------------------------------------
   Statistika
   ------------------------------------------------------------ */

export interface LeadStats {
  total: number;
  today: number;
  last7: number;
  last30: number;
  unseen: number;
  won: number;
  spam: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  byRegion: Record<string, number>;
  topProducts: { sku: string; name: string; count: number }[];
  timeline: { date: string; count: number }[];
  storage: { driver: string; writable: boolean; months: number; sizeKb: number };
}

export function getStats(): LeadStats {
  const all = readAllLeads();
  const now = Date.now();
  const dayMs = 86400000;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const byType: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const byRegion: Record<string, number> = {};
  const productMap = new Map<string, { sku: string; name: string; count: number }>();
  const dayMap = new Map<string, number>();

  let today = 0;
  let last7 = 0;
  let last30 = 0;
  let unseen = 0;
  let won = 0;
  let spam = 0;

  for (const l of all) {
    const t = new Date(l.createdAt).getTime();
    if (t >= todayStart.getTime()) today++;
    if (now - t <= 7 * dayMs) last7++;
    if (now - t <= 30 * dayMs) last30++;
    if (l.status === 'new') unseen++;
    if (l.status === 'won') won++;
    if (l.status === 'spam') spam++;

    byType[l.type] = (byType[l.type] ?? 0) + 1;
    byStatus[l.status] = (byStatus[l.status] ?? 0) + 1;
    if (l.location.region) byRegion[l.location.region] = (byRegion[l.location.region] ?? 0) + 1;

    for (const p of l.request.products ?? []) {
      const existing = productMap.get(p.sku);
      const label = p.name.uz || p.name.ru || p.name.en || p.sku;
      if (existing) existing.count++;
      else productMap.set(p.sku, { sku: p.sku, name: label, count: 1 });
    }

    const day = l.createdAt.slice(0, 10);
    dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
  }

  const timeline: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * dayMs).toISOString().slice(0, 10);
    timeline.push({ date: d, count: dayMap.get(d) ?? 0 });
  }

  let sizeKb = 0;
  if (DRIVER === 'file') {
    for (const m of listMonths()) {
      try {
        sizeKb += statSync(fileFor(m)).size / 1024;
      } catch {
        /* fayl yo'q */
      }
    }
  }

  return {
    total: all.length,
    today,
    last7,
    last30,
    unseen,
    won,
    spam,
    byType,
    byStatus,
    byRegion,
    topProducts: [...productMap.values()].sort((a, b) => b.count - a.count).slice(0, 10),
    timeline,
    storage: {
      driver: DRIVER,
      writable: DRIVER === 'file' ? isWritable() : true,
      months: listMonths().length,
      sizeKb: Math.round(sizeKb * 10) / 10,
    },
  };
}

function isWritable(): boolean {
  ensureDir();
  try {
    const probe = join(BASE_DIR, `.probe-${process.pid}`);
    writeFileSync(probe, 'ok', 'utf8');
    renameSync(probe, `${probe}.done`);
    try {
      unlinkSync(`${probe}.done`);
    } catch {
      /* muhim emas */
    }
    return true;
  } catch {
    return false;
  }
}

/** Barcha leadlarni tekis ro'yxatda (CSV eksport uchun) */
export function exportLeads(): LeadRecord[] {
  return readAllLeads();
}

/** Ikki xil arizani tekshirish (bir xil telefon + yaqin vaqt) */
export function findRecentDuplicate(phone: string, withinSec: number): LeadRecord | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  const cutoff = Date.now() - withinSec * 1000;
  const all = readAllLeads();
  return (
    all.find((l) => {
      const t = new Date(l.createdAt).getTime();
      return t >= cutoff && l.contact.phone.replace(/\D/g, '').endsWith(digits.slice(-9));
    }) ?? null
  );
}
