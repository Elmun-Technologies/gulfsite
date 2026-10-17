/**
 * GET /api/media/<fayl> — admin yuklagan logotiplarni berish
 * ----------------------------------------------------------------
 * Fayllar `<DATA_DIR>/content/media` da (fly.io volume) — `public/` build
 * paytida qotib qoladi, shuning uchun yuklanganlar shu route orqali.
 * Nom qat'iy tekshiriladi (path traversal yo'q), fayl nomi kontent
 * xeshidan iborat — shuning uchun uzoq muddatli immutable kesh.
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { MEDIA_DIR } from '@/lib/data-dir';

export const runtime = 'nodejs';

const TYPES: Record<string, string> = {
  webp: 'image/webp',
  png: 'image/png',
  jpg: 'image/jpeg',
  svg: 'image/svg+xml',
};

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const m = /^([a-f0-9]{16,64})\.(webp|png|jpg|svg)$/.exec(name);
  if (!m) return new Response('Not found', { status: 404 });
  try {
    const buf = await readFile(join(MEDIA_DIR, name));
    return new Response(new Uint8Array(buf), {
      headers: {
        'Content-Type': TYPES[m[2]],
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
        // SVG ichidagi skriptlar ishlamasin
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
