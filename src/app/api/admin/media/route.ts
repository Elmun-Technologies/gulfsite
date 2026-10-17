/**
 * POST /api/admin/media — logotip yoki mahsulot fotosi (multipart: file, kind=logo|product)
 * ----------------------------------------------------------------
 * Har qanday format (PNG/JPG/WebP/SVG) sharp orqali tozalanadi: chetlar
 * kesiladi, 480×240 ga sig'diriladi va WebP ga o'giriladi — SVG ichidagi
 * skript yoki ulkan fayl saytga tushmaydi. Nom — kontent xeshi.
 */

import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { adminGuard } from '@/lib/admin-api';
import { MEDIA_DIR } from '@/lib/data-dir';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 12 * 1024 * 1024;

export async function POST(req: Request) {
  const denied = await adminGuard(req, { mutating: true });
  if (denied) return denied;

  let file: File | null = null;
  let kind = 'logo';
  try {
    const form = await req.formData();
    const f = form.get('file');
    file = f instanceof File ? f : null;
    kind = form.get('kind') === 'product' ? 'product' : 'logo';
  } catch {
    /* noto'g'ri forma */
  }
  if (!file || !file.size) return NextResponse.json({ ok: false, error: { code: 'no_file' } }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ ok: false, error: { code: 'too_large' } }, { status: 413 });

  try {
    const input = Buffer.from(await file.arrayBuffer());
    // mahsulot fotosi: kesilmaydi, 1600 px gacha; logotip: chetlari kesiladi, 480×240
    const out =
      kind === 'product'
        ? await sharp(input, { limitInputPixels: 60_000_000 })
            .rotate()
            .flatten({ background: '#ffffff' })
            .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 82 })
            .toBuffer()
        : await sharp(input, { density: 300, limitInputPixels: 40_000_000 })
            .flatten({ background: '#ffffff' })
            .trim({ threshold: 12 })
            .resize({ width: 480, height: 240, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 88 })
            .toBuffer();
    const name = `${createHash('sha256').update(out).digest('hex').slice(0, 24)}.webp`;
    mkdirSync(MEDIA_DIR, { recursive: true });
    writeFileSync(join(MEDIA_DIR, name), out);
    return NextResponse.json({ ok: true, data: { url: `/api/media/${name}` } });
  } catch (err) {
    console.error('[admin/media] rasm qayta ishlanmadi:', String(err).slice(0, 200));
    return NextResponse.json({ ok: false, error: { code: 'bad_image' } }, { status: 415 });
  }
}
