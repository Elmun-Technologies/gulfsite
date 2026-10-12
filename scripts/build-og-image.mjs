#!/usr/bin/env node
/**
 * OG RASM — /images/og-home.jpg (§13.6)
 * ----------------------------------------------------------------
 * Ijtimoiy tarmoqlar (Telegram, Facebook, LinkedIn, X) havola
 * ulashilganda 1200×630 rasm ko'rsatadi. Uy sahifasi uchun alohida
 * brend rasm kerak: `page.tsx` uni so'raydi, fayl yo'q edi → og:image
 * 404 qaytarardi (`npm run audit:seo` shu xatoni topdi).
 *
 * Nega skript, nega qo'lda emas:
 *   · dizayn tizimiga mos (navy + mis + foto-monogramma, gradient YO'Q)
 *   · manba fotolar o'zgarsa rasm o'zi yangilanadi (`prepare:assets`)
 *   · shrift render qilish kerak emas (sandbox'da Urbanist tizim shrifti
 *     sifatida o'rnatilmagan, shuning uchun rasmda MATN YO'Q — faqat
 *     brend belgisi va foto; sarlavhani ijtimoiy tarmoqning o'zi
 *     `<title>` va `og:title` dan oladi)
 *
 * Kompozitsiya:
 *   1. foto (hero-vanilla.jpg) 1200×630 ga cover
 *   2. tekis navy qatlam (72%) — gradient emas (§17)
 *   3. o'ngda foto-monogramma (balandlik 430px)
 *   4. pastda mis chiziq (6px) — yagona aksent
 */

import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'public', 'images');

const W = 1200;
const H = 630;
const OUT = join(IMG, 'og-home.jpg');

/** Dizayn tokenlari (§4.2) — RGB */
const NAVY = { r: 0x0b, g: 0x0a, b: 0x3a };
const COPPER = { r: 0xd6, g: 0xa2, b: 0x7c };

const PHOTO_CANDIDATES = ['hero-vanilla.jpg', 'hero-lab.jpg', 'factory.jpg'];
const MONOGRAM = 'monogram-coffee.png';

function pick(names) {
  for (const n of names) {
    const p = join(IMG, n);
    if (existsSync(p)) return p;
  }
  return null;
}

const photo = pick(PHOTO_CANDIDATES);
const monogram = join(IMG, MONOGRAM);

if (!photo) {
  console.error(`✖ OG rasm: manba foto topilmadi (${PHOTO_CANDIDATES.join(', ')})`);
  process.exit(1);
}
if (!existsSync(monogram)) {
  console.error(`✖ OG rasm: ${MONOGRAM} topilmadi`);
  process.exit(1);
}

/* ---- 1–2. foto + tekis navy qatlam ---- */
const overlay = Buffer.from(
  // RGBA: navy, 72% shaffoflik (0.72 * 255 ≈ 184)
  `<svg width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="rgb(${NAVY.r},${NAVY.g},${NAVY.b})" fill-opacity="0.72"/></svg>`,
);

let canvas = sharp(photo)
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .composite([{ input: overlay, blend: 'over' }]);

/* ---- 3. monogramma (o'ngda, cho'zilmagan — §17) ---- */
const MONO_H = 430;
const mono = sharp(monogram).resize({ height: MONO_H, fit: 'inside', withoutEnlargement: false });
const monoMeta = await mono.toBuffer({ resolveWithObject: true });
const monoW = monoMeta.info.width;

canvas = canvas.composite([
  {
    input: monoMeta.data,
    gravity: 'east',
    blend: 'over',
    // o'ng chekkadan 72px, vertikal markazda
    top: Math.round((H - MONO_H) / 2),
    left: W - monoW - 72,
  },
]);

/* ---- 4. pastdagi mis chiziq ---- */
const rule = Buffer.from(
  `<svg width="${W}" height="6"><rect width="${W}" height="6" fill="rgb(${COPPER.r},${COPPER.g},${COPPER.b})"/></svg>`,
);
canvas = canvas.composite([{ input: rule, gravity: 'southwest', blend: 'over' }]);

/* ---- yozish ---- */
await canvas.jpeg({ quality: 82, mozjpeg: true }).toFile(OUT);

const kb = Math.round((existsSync(OUT) ? (await import('node:fs')).statSync(OUT).size : 0) / 1024);
console.log(`✓ OG rasm: public/images/og-home.jpg (1200×630, ${kb} KB)`);
