/**
 * BREND IKONKALARI — monogram-copper.png → favicon/PWA/Apple ikonkalari.
 * ----------------------------------------------------------------
 * Monogramma cho'zilmaydi va bo'yalmaydi (§17): navy (#0B0A3A) kvadrat
 * ustiga proporsiyasi saqlangan holda markazlanadi.
 *
 *   src/app/favicon.ico      16/32/48 (PNG-in-ICO) — Next avtomatik <link> qo'yadi
 *   src/app/icon.png         192×192              — Next avtomatik <link rel=icon>
 *   src/app/apple-icon.png   180×180              — Next avtomatik apple-touch-icon
 *   public/icons/icon-192.png, icon-512.png       — manifest (purpose: any)
 *   public/icons/maskable-512.png                 — manifest (purpose: maskable, 20% xavfsiz zona)
 *
 * Ishga tushirish: `npm run icons` (natija repoga commit qilinadi).
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const SRC = 'public/images/monogram-copper.png';
const NAVY = { r: 11, g: 10, b: 58, alpha: 1 };

/** size — kvadrat tomoni; pad — monogramma atrofidagi bo'sh joy ulushi */
async function icon(size, pad) {
  const inner = Math.round(size * (1 - pad * 2));
  const mono = await sharp(SRC).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: NAVY } })
    .composite([{ input: mono, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** PNG yuklamali ICO (Vista+ va barcha zamonaviy brauzerlar qo'llaydi) */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const dir = [];
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    dir.push(e);
  }
  return Buffer.concat([header, ...dir, ...pngs.map((p) => p.buf)]);
}

mkdirSync('public/icons', { recursive: true });
const icoParts = [];
for (const size of [16, 32, 48]) icoParts.push({ size, buf: await icon(size, 0.08) });
writeFileSync('src/app/favicon.ico', ico(icoParts));
writeFileSync('src/app/icon.png', await icon(192, 0.12));
writeFileSync('src/app/apple-icon.png', await icon(180, 0.14));
writeFileSync('public/icons/icon-192.png', await icon(192, 0.12));
writeFileSync('public/icons/icon-512.png', await icon(512, 0.12));
writeFileSync('public/icons/maskable-512.png', await icon(512, 0.22));
console.log('✓ ikonkalar yaratildi');
