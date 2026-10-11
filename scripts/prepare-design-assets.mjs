/**
 * DIZAYN AKTIVLARINI TAYYORLASH
 * ----------------------------------------------------------------
 * `design/assets/` → `public/images/`
 *
 * Nima qiladi:
 *   - JPG fayllarni 1440px gacha kichraytiradi, sifat 78 (progressive)
 *   - PNG (monogrammalar) fayllarni metadata'siz, siqilgan holda saqlaydi
 *     (shaffoflik kerak — format o'zgarmaydi)
 *   - mijozning haqiqiy fotolari (warehouse, pack-*) ustuvor: agar
 *     `design/assets` da bo'lmasa, mavjud `public/images` dagi saqlanadi
 *
 * Ishga tushirish:  node scripts/prepare-design-assets.mjs
 * `npm run build` bu skriptni avtomatik chaqiradi (prepare:assets).
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'design', 'assets');
const OUT = path.join(ROOT, 'public', 'images');

const JPG_MAX_WIDTH = 1440;
const JPG_QUALITY = 78;

if (!fs.existsSync(SRC)) {
  console.warn('[assets] design/assets topilmadi — o\'tkazib yuborildi.');
  process.exit(0);
}

fs.mkdirSync(OUT, { recursive: true });

let copied = 0;
let saved = 0;

for (const file of fs.readdirSync(SRC).sort()) {
  const from = path.join(SRC, file);
  const to = path.join(OUT, file);
  const ext = path.extname(file).toLowerCase();
  const before = fs.statSync(from).size;

  try {
    if (ext === '.jpg' || ext === '.jpeg') {
      await sharp(from)
        .rotate()
        .resize({ width: JPG_MAX_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: JPG_QUALITY, progressive: true, mozjpeg: true })
        .toFile(to);
    } else if (ext === '.png') {
      // Monogrammalar foto bilan to'ldirilgan va shaffof — qayta kodlash
      // hajmni oshiradi. Asl nusxa saqlanadi; next/image uni AVIF/WebP ga
      // aylantirib, 90 sifat bilan tarqatadi.
      fs.copyFileSync(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
    saved += before - fs.statSync(to).size;
    copied += 1;
  } catch (err) {
    console.error(`[assets] ${file} — xato:`, err.message);
  }
}

console.log(`[assets] ${copied} fayl public/images ga tayyorlandi (${(saved / 1024).toFixed(0)} KB tejaldi).`);
