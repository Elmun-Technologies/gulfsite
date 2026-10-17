#!/usr/bin/env node
/**
 * KATALOG (BROSHYURA) → FLIPBOOK RASMLARI
 * ----------------------------------------------------------------
 *   node scripts/build-brochure.mjs <katalog.pdf> <uz|ru|en>
 *
 * Natija (git'ga commit qilinadi — Docker/fly build'da poppler kerak emas):
 *   public/catalog/gff-katalog-<lang>.pdf      — yuklab olish uchun asl PDF
 *   public/catalog/<lang>/pNN.webp             — har sahifa (flipbook)
 *   public/catalog/<lang>/pNN-t.webp           — kichik eskiz (thumbnail)
 *   src/data/brochure-<lang>.json              — sahifalar ro'yxati va o'lchamlari
 *
 * Talab: poppler-utils (pdftoppm, pdfinfo) + sharp.
 * Rus tilidagi katalog kelganda: `node scripts/build-brochure.mjs ru.pdf ru`.
 */

import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const [pdf, lang] = process.argv.slice(2);

if (!pdf || !/^(uz|ru|en)$/.test(lang ?? '')) {
  console.error('Foydalanish: node scripts/build-brochure.mjs <katalog.pdf> <uz|ru|en>');
  process.exit(1);
}

const outDir = join(ROOT, 'public', 'catalog', lang);
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const pdfOut = join(ROOT, 'public', 'catalog', `gff-katalog-${lang}.pdf`);
copyFileSync(pdf, pdfOut);

// 200 dpi — yoyilma ~2330px: ro'yxat sahifalaridagi mayda matn kattalashtirganda o'qiladi
const tmp = mkdtempSync(join(tmpdir(), 'brochure-'));
execFileSync('pdftoppm', ['-r', '200', '-png', pdf, join(tmp, 'p')], { stdio: 'inherit' });

const files = readdirSync(tmp)
  .filter((f) => f.endsWith('.png'))
  .sort((a, b) => Number(a.match(/(\d+)/)[1]) - Number(b.match(/(\d+)/)[1]));

const pages = [];
let total = 0;
for (const [i, f] of files.entries()) {
  const n = String(i + 1).padStart(2, '0');
  const src = join(tmp, f);
  const meta = await sharp(src).metadata();
  const spread = meta.width > meta.height;
  const big = await sharp(src)
    .resize({ width: spread ? 2200 : 1100, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(join(outDir, `p${n}.webp`));
  await sharp(src)
    .resize({ width: spread ? 320 : 160 })
    .webp({ quality: 70 })
    .toFile(join(outDir, `p${n}-t.webp`));
  total += big.size;
  pages.push({
    src: `/catalog/${lang}/p${n}.webp`,
    thumb: `/catalog/${lang}/p${n}-t.webp`,
    width: big.width,
    height: big.height,
    spread,
  });
}
rmSync(tmp, { recursive: true, force: true });

const manifest = {
  lang,
  pdf: `/catalog/gff-katalog-${lang}.pdf`,
  pdfSizeKb: Math.round(statSync(pdfOut).size / 1024),
  pages,
};
writeFileSync(join(ROOT, 'src', 'data', `brochure-${lang}.json`), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`[brochure] ${lang}: ${pages.length} sahifa, ${Math.round(total / 1024)} KB rasm, PDF ${manifest.pdfSizeKb} KB`);
