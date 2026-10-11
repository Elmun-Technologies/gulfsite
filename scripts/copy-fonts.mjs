#!/usr/bin/env node
/**
 * SHRIFTLARNI NUSXALASH
 * ----------------------------------------------------------------
 * Google Fonts build vaqtida tarmoqdan yuklanmaydi (next/font/google
 * oflayn muhitda qulaydi), shuning uchun shriftlar npm paketlaridan
 * (Fontsource) olinadi va `public/fonts/` ga joylashtiriladi.
 *
 * Dizayn tizimi (design/Styleguide.dc.html) ikki shriftni talab qiladi:
 *   - Urbanist  — lotin (brend shrifti, 300/400/500/600 + italic 400)
 *   - Onest     — kirill (Urbanist'da kirill gliflari yo'q)
 * Ikkalasi ham geometrik grotesk, o'lcham va og'irliklari bir xil,
 * shuning uchun `font-family: Urbanist, Onest, sans-serif` stack'ida
 * brauzer har bir belgi uchun kerakli yuzani avtomatik tanlaydi.
 *
 * Afzalliklari:
 *   - tashqi so'rov yo'q → tezroq LCP, GDPR/shaxsiy ma'lumot xavfi yo'q
 *   - faqat kerakli subsetlar (lotin + kirill) → ~72 KB
 *   - versiya package.json orqali boshqariladi
 *
 * Ishga tushirish:  node scripts/copy-fonts.mjs
 */

import { copyFileSync, existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'fonts');

/** [paket, fayl, chiqish nomi] */
const JOBS = [
  ['@fontsource-variable/urbanist', 'urbanist-latin-wght-normal.woff2', 'urbanist-latin.woff2'],
  ['@fontsource-variable/urbanist', 'urbanist-latin-wght-italic.woff2', 'urbanist-latin-italic.woff2'],
  ['@fontsource-variable/onest', 'onest-cyrillic-wght-normal.woff2', 'onest-cyrillic.woff2'],
];

/** Eski dizayn tizimidan qolgan shriftlar — endi ishlatilmaydi */
const STALE = ['manrope-latin.woff2', 'manrope-cyrillic.woff2', 'unbounded-latin.woff2', 'unbounded-cyrillic.woff2'];

mkdirSync(OUT, { recursive: true });

let copied = 0;
const missing = [];

for (const [pkg, file, outName] of JOBS) {
  const src = join(ROOT, 'node_modules', pkg, 'files', file);
  const dst = join(OUT, outName);
  if (!existsSync(src)) {
    missing.push(`${pkg}/${file}`);
    continue;
  }
  copyFileSync(src, dst);
  copied += 1;
}

for (const name of STALE) {
  const stale = join(OUT, name);
  if (existsSync(stale)) rmSync(stale);
}

const total = JOBS.filter((j) => existsSync(join(OUT, j[2]))).reduce((sum, j) => {
  try {
    return sum + statSync(join(OUT, j[2])).size;
  } catch {
    return sum;
  }
}, 0);

// eslint-disable-next-line no-console
console.log(
  `✓ Shriftlar: ${copied}/${JOBS.length} fayl → public/fonts/ (${(total / 1024).toFixed(1)} KB)` +
    (missing.length ? `\n  ! topilmadi: ${missing.join(', ')}` : ''),
);

if (copied === 0) {
  // eslint-disable-next-line no-console
  console.warn('⚠ Shriftlar nusxalanmadi — sayt zaxira shriftlar bilan ishlaydi.');
}
