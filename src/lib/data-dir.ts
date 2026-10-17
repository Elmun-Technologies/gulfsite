/**
 * ISH VAQTIDAGI MA'LUMOTLAR PAPKASI (server-only)
 * ----------------------------------------------------------------
 * Kontent (kontaktlar, mijoz logotiplari, videolar) va analitika shu
 * papka ichida saqlanadi:
 *
 *   <DATA_DIR>/content/site.json      — admin paneldan tahrirlanadigan kontent
 *   <DATA_DIR>/content/media/*        — yuklangan logotiplar
 *   <DATA_DIR>/analytics/YYYY-MM-DD.jsonl — tashriflar/hodisalar
 *
 * `DATA_DIR` sozlanmasa — `<cwd>/data` (lead'lar bilan bir joyda).
 * fly.io'da volume `/app/data` ga ulanadi (fly.toml), Docker'da `-v`.
 *
 * `turbopackIgnore` — store.ts dagi izohga qarang: dinamik yo'l butun
 * loyihani server bundle'ga trace qilmasligi uchun.
 */

import { join, resolve } from 'node:path';

const ENV_DIR = (process.env.DATA_DIR ?? '').trim();

export const DATA_DIR = ENV_DIR
  ? resolve(/* turbopackIgnore: true */ process.cwd(), ENV_DIR)
  : join(/* turbopackIgnore: true */ process.cwd(), 'data');

export const CONTENT_DIR = join(DATA_DIR, 'content');
export const MEDIA_DIR = join(CONTENT_DIR, 'media');
export const ANALYTICS_DIR = join(DATA_DIR, 'analytics');
