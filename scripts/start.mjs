#!/usr/bin/env node
/**
 * START (standalone)
 * ----------------------------------------------------------------
 * `output: 'standalone'` rejimida `next start` ishlamaydi — Next'ning
 * o'zi `node .next/standalone/server.js` ni maslahat beradi.
 *
 * Standalone papkada FAQAT server kodi bo'ladi; statik fayllar
 * (`.next/static`) va `public/` ichida kelmaydi. Docker'da ularni
 * Dockerfile nusxalaydi. Lokal ishga tushirishda shu skript nusxalaydi:
 *
 *   node scripts/start.mjs        # yoki: npm start
 *
 * O'zgaruvchilar:
 *   PORT      (standart 3000)
 *   HOSTNAME  (standart 0.0.0.0 — konteyner/proksi uchun)
 */

import { cpSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const root = process.cwd();
const standalone = join(root, '.next', 'standalone');

if (!existsSync(join(standalone, 'server.js'))) {
  console.error('\n✖ .next/standalone/server.js topilmadi. Avval build qiling:\n\n    npm run build\n');
  process.exit(1);
}

/* ---- Statik fayllarni tayyorlash (Dockerfile'dagi kabi) ---- */
const copies = [
  [join(root, '.next', 'static'), join(standalone, '.next', 'static')],
  [join(root, 'public'), join(standalone, 'public')],
];

for (const [from, to] of copies) {
  if (!existsSync(from)) continue;
  cpSync(from, to, { recursive: true });
  console.log(`✓ nusxalandi: ${from.replace(root + '/', '')} → ${to.replace(root + '/', '')}`);
}

/* ---- Serverni ishga tushirish ---- */
/* ---- Lead papkasi: MUTLAQ yo'l ----
   Standalone `server.js` ichida `process.chdir(__dirname)` bor, shuning uchun
   `process.cwd()` `.next/standalone` ga aylanadi va lead'lar BUILD papkasiga
   yoziladi — keyingi `next build` esa ularni o'chiradi. Buni oldini olish uchun
   LEAD_STORAGE_PATH ni loyiha ildizidagi mutlaq yo'lga o'rnatamiz. */
const env = {
  ...process.env,
  HOSTNAME: process.env.HOSTNAME || '0.0.0.0',
  PORT: process.env.PORT || '3000',
  LEAD_STORAGE_PATH: process.env.LEAD_STORAGE_PATH || join(root, 'data', 'leads'),
};
console.log(`✓ lead papkasi: ${env.LEAD_STORAGE_PATH}`);
console.log(`\n▲ GFF Uzbekistan — http://${env.HOSTNAME}:${env.PORT}\n`);

// MUHIM: cwd = LOYIHA ILDIZI (standalone papka emas!).
// Lead'lar `process.cwd()/data/leads` ga yoziladi; agar cwd `.next/standalone`
// bo'lsa, har bir `next build` papkani tozalab, BARCHA ARIZALARNI o'chiradi.
const child = spawn(process.execPath, [join(standalone, 'server.js')], {
  cwd: root,
  env,
  stdio: 'inherit',
});

for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => child.kill(sig));
child.on('exit', (code) => process.exit(code ?? 0));
