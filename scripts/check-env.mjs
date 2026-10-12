#!/usr/bin/env node
/**
 * ENV NAZORATI — `npm run env:check`
 * ----------------------------------------------------------------
 * Ishga tushirishdan oldin muhit o'zgaruvchilarini tekshiradi. Uch xil natija:
 *
 *   ✖ XATO      — launch'ni TO'SADI (exit 1). Masalan: domen yo'q, ariza
 *                 hech qaysi kanalda qabul qilinmaydi, admin paroli standart.
 *   ⚠ OGOHLANTIRISH — sayt ishlaydi, lekin funksiya jim bo'ladi (analitika,
 *                 Turnstile) yoki kontent joy tutgich qolgan.
 *   ✔ OK        — sozlangan.
 *
 * Nima uchun kerak: `.env.example` ni kimdir nusxa olib, ichidagi qiymatni
 * o'ylab topilgan kontakt bilan almashtirsa (masalan `+998712000000` yoki
 * `info@gff.uz`), sayt noto'g'ri telefon/e-mail ko'rsatadi va buni ko'z bilan
 * payqash qiyin. Shuning uchun §15 dagi RASMIY qiymatlar bu yerda etalon
 * sifatida saqlanadi va ziddiyat bo'lsa XATO beriladi.
 *
 * Ishlatish:
 *   npm run env:check            # launch tekshiruvi (xato bo'lsa exit 1)
 *   npm run env:check -- --report # hech narsa to'smaydi (CI uchun hisobot)
 *   npm run env:check -- --prod   # faqat production uchun muhim bandlar
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPORT_ONLY = process.argv.includes('--report');

/* ------------------------------------------------------------
   §15 ETALON — mijoz bergan rasmiy ma'lumotlar.
   Bular o'zgarmas: ziddiyat = xato.
   ------------------------------------------------------------ */
const CANON = {
  phone: '+998 97 570 77 60',
  email: 'info@gulfflavour.uz', // mijoz tasdiqladi, 2026-10-12
  telegram: 'GFF_uzb',
  instagram: 'gulfflavour.uz',
  hqPhone: '+971 4 883 3923',
  rateLimitMax: 5, // §11.2
  rateLimitWindow: 600,
  sampleBoxMax: 8, // §1 / §7.2
  sampleMinVolume: 25,
  sampleMaxVolume: 100,
  sampleDeliveryDays: 3,
};

/** Ruxsat etilgan e-mail domenlari (§15). Boshqa domen = shubhali. */
const ALLOWED_EMAIL_DOMAINS = ['gulfflavour.uz', 'gulfflavours.ae', 'gff.co.ae'];

/* ------------------------------------------------------------
   .env fayllarini o'qish (Next tartibi: .env.local > .env)
   ------------------------------------------------------------ */
function parseEnvFile(path) {
  const out = {};
  if (!existsSync(path)) return out;
  for (const raw of readFileSync(path, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const fromFiles = { ...parseEnvFile(join(ROOT, '.env')), ...parseEnvFile(join(ROOT, '.env.local')) };
const env = { ...process.env, ...fromFiles };
const get = (k) => (env[k] ?? '').trim();
const source = (k) => (k in fromFiles ? '.env' : k in process.env ? 'muhit' : 'standart');

/* ------------------------------------------------------------
   Natijalarni yig'ish
   ------------------------------------------------------------ */
const errors = [];
const warnings = [];
const oks = [];

const err = (msg, hint) => errors.push({ msg, hint });
const warn = (msg, hint) => warnings.push({ msg, hint });
const ok = (msg) => oks.push(msg);

/* ---------- 1. Domen ---------- */
const siteUrl = get('NEXT_PUBLIC_SITE_URL') || get('VERCEL_PROJECT_PRODUCTION_URL');
if (!siteUrl) {
  err(
    'NEXT_PUBLIC_SITE_URL bo\'sh — canonical, hreflang, sitemap va JSON-LD localhost:3000 ga quriladi',
    'Production domenini yozing: NEXT_PUBLIC_SITE_URL="https://domen.uz" (slash bilan tugamasin)',
  );
} else {
  const url = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`;
  let bad = null;
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') bad = 'https emas';
    else if (u.hostname === 'localhost' || /^127\./.test(u.hostname)) bad = 'localhost';
    else if (u.hostname.includes('vercel.app')) bad = 'vaqtinchalik Vercel domeni';
    else if (url.endsWith('/')) bad = 'oxirida slash bor';
  } catch {
    bad = 'yaroqsiz URL';
  }
  // CI'da audit/lighthouse lokal serverga uriladi, shuning uchun domen
  // qasddan loopback qilib beriladi — bu xato EMAS, lekin production'da
  // haqiqiy domen kerakligini eslatib qo'yamiz.
  const ciLoopback = Boolean(process.env.CI) && (url.includes('127.0.0.1') || url.includes('localhost'));
  if (ciLoopback) {
    warn(
      `Domen CI uchun loopback: ${url}`,
      'Production deploy\'da NEXT_PUBLIC_SITE_URL ni haqiqiy https domen bilan bering',
    );
  } else if (bad) {
    err(`NEXT_PUBLIC_SITE_URL noto'g'ri (${bad}): ${siteUrl}`, 'https://domen.uz ko\'rinishida bering');
  } else ok(`Domen: ${url} (${source('NEXT_PUBLIC_SITE_URL')})`);
}

/* ---------- 2. §15 kontaktlari ziddiyatmi? ---------- */
function canonPhone(v) {
  return v.replace(/[^\d+]/g, '');
}

const phone = get('NEXT_PUBLIC_PHONE_PRIMARY');
if (phone && canonPhone(phone) !== canonPhone(CANON.phone)) {
  err(
    `Telefon §15 dan farq qiladi: "${phone}" (etalon: ${CANON.phone})`,
    'Raqam haqiqatan o\'zgargan bo\'lsa — brief\'ni yangilang; aks holda .env qiymatini olib tashlang (standart ishlaydi)',
  );
} else if (!phone) {
  ok(`Telefon: ${CANON.phone} (standart, §15)`);
} else {
  ok(`Telefon: ${phone}`);
}

for (const key of ['NEXT_PUBLIC_EMAIL', 'NEXT_PUBLIC_SALES_EMAIL', 'LEAD_EMAIL_TO', 'SMTP_FROM', 'NEXT_PUBLIC_HQ_EMAIL']) {
  const v = get(key);
  if (!v) continue;
  const emails = v.match(/[\w.+-]+@[\w.-]+/g) ?? [];
  for (const e of emails) {
    const domain = e.split('@')[1]?.toLowerCase() ?? '';
    if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
      err(
        `${key} dagi domen shubhali: ${e} (§15 domenlari: ${ALLOWED_EMAIL_DOMAINS.join(', ')})`,
        'To\'qilgan e-mail saytga chiqib qolishi mumkin — tasdiqlangan manzilni ishlating',
      );
    }
  }
  if (emails.length && key === 'NEXT_PUBLIC_EMAIL' && !emails.includes(CANON.email)) {
    err(`NEXT_PUBLIC_EMAIL = ${emails[0]}, etalon (§15, mijoz tasdiqlagan) = ${CANON.email}`, 'Tasdiqlangan qiymatni qaytaring');
  }
}
if (!get('NEXT_PUBLIC_EMAIL')) ok(`E-mail: ${CANON.email} (standart, mijoz tasdiqlagan)`);

const tg = get('NEXT_PUBLIC_TELEGRAM') || get('NEXT_PUBLIC_TELEGRAM_HANDLE');
if (tg && !tg.includes(CANON.telegram)) {
  err(`Telegram §15 dan farq qiladi: "${tg}" (etalon: @${CANON.telegram})`, 'To\'g\'ri kanalni bering yoki .env qiymatini olib tashlang');
} else if (!tg) ok(`Telegram: @${CANON.telegram} (standart, §15)`);

const ig = get('NEXT_PUBLIC_INSTAGRAM') || get('NEXT_PUBLIC_INSTAGRAM_HANDLE');
if (ig && !ig.includes(CANON.instagram)) {
  err(`Instagram §15 dan farq qiladi: "${ig}" (etalon: @${CANON.instagram})`, 'To\'g\'ri profilni bering');
} else if (!ig) ok(`Instagram: @${CANON.instagram} (standart, §15)`);

/* ---------- 3. Lead qabul kanallari (§11.1) ---------- */
const channels = [];
const tgToken = get('TELEGRAM_BOT_TOKEN');
const tgChat = get('TELEGRAM_CHAT_ID');
if (tgToken && tgChat) channels.push('Telegram bot');
else if (tgToken || tgChat) err('Telegram yarim sozlangan: TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID IKKALASI ham kerak', '@BotFather dan token, guruh/chat id oling');

const smtpReady = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD', 'LEAD_EMAIL_TO'].every((k) => get(k));
if (smtpReady) channels.push('SMTP e-mail');
else if (['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD', 'LEAD_EMAIL_TO'].some((k) => get(k)))
  warn('SMTP yarim sozlangan — e-mail yuborilmaydi', 'SMTP_HOST, SMTP_USER, SMTP_PASSWORD, LEAD_EMAIL_TO — to\'rtalasi ham kerak');

if (get('RESEND_API_KEY')) channels.push('Resend');
if (get('LEAD_WEBHOOK_URL')) channels.push('Webhook (CRM)');

if (channels.length === 0) {
  err(
    'Arizalar hech qaysi kanalda qabul qilinmaydi — faqat data/leads/*.jsonl fayliga yoziladi',
    'Kamida bittasini sozlang: TELEGRAM_BOT_TOKEN+CHAT_ID (tavsiya) yoki SMTP_*+LEAD_EMAIL_TO yoki LEAD_WEBHOOK_URL',
  );
} else ok(`Lead kanallari: ${channels.join(', ')}`);

/* ---------- 4. Admin panel ---------- */
const adminPass = get('ADMIN_PASSWORD');
const adminSecret = get('ADMIN_SECRET');
const PLACEHOLDER_PASS = "o'zgartiring-kuchli-parol";
if (!adminPass || adminPass === PLACEHOLDER_PASS) {
  err('ADMIN_PASSWORD sozlanmagan (yoki .env.example dagi joy tutgich qolgan)', 'Kuchli parol bering; panel /uz/admin da leadlar bazasi ochiq');
} else if (adminPass.length < 12) {
  warn('ADMIN_PASSWORD 12 belgidan qisqa', 'openssl rand -base64 24');
} else ok('ADMIN_PASSWORD sozlangan');

if (!adminSecret) err('ADMIN_SECRET bo\'sh — sessiya cookie imzolanmaydi', 'openssl rand -hex 32');
else if (adminSecret.length < 32) err(`ADMIN_SECRET juda qisqa (${adminSecret.length} belgi), kamida 32 kerak`, 'openssl rand -hex 32');
else ok('ADMIN_SECRET sozlangan');

/* ---------- 5. Antispam (§11.2) ---------- */
const rlMax = Number(get('RATE_LIMIT_MAX') || CANON.rateLimitMax);
const rlWin = Number(get('RATE_LIMIT_WINDOW_SECONDS') || CANON.rateLimitWindow);
if (rlMax !== CANON.rateLimitMax || rlWin !== CANON.rateLimitWindow) {
  err(
    `Rate limit §11.2 dan farq qiladi: ${rlMax}/${rlWin}s (talab: ${CANON.rateLimitMax}/${CANON.rateLimitWindow}s)`,
    'Brief talabini qaytaring: RATE_LIMIT_MAX=5, RATE_LIMIT_WINDOW_SECONDS=600',
  );
} else ok(`Rate limit: ${rlMax} so'rov / ${rlWin}s (§11.2)`);

if (get('TURNSTILE_SECRET_KEY') && get('NEXT_PUBLIC_TURNSTILE_SITE_KEY')) ok('Turnstile yoqilgan');
else if (get('TURNSTILE_SECRET_KEY') || get('NEXT_PUBLIC_TURNSTILE_SITE_KEY'))
  warn('Turnstile yarim sozlangan — himoya ishlamaydi', 'Ikkala kalit ham kerak (sayt + maxfiy)');
else warn('Turnstile yoqilmagan — faqat honeypot + rate limit + min fill 3s ishlaydi', 'Bot hujumi kuchaysa Cloudflare Turnstile kalitlarini qo\'shing');

/* ---------- 6. Analitika (§12) ---------- */
if (get('NEXT_PUBLIC_GTM_ID')) ok(`GTM: ${get('NEXT_PUBLIC_GTM_ID')}`);
else warn('NEXT_PUBLIC_GTM_ID bo\'sh — dataLayer hodisalari yoziladi, lekin hech qaerga ketmaydi', 'GTM konteynerini bering (GA4/Meta Pixel shu orqali)');

/* ---------- 7. Kontent joy tutgichlari (§15 TODO) ---------- */
if (get('NEXT_PUBLIC_CATALOG_PDF')) ok(`Katalog PDF: ${get('NEXT_PUBLIC_CATALOG_PDF')}`);
else warn('NEXT_PUBLIC_CATALOG_PDF bo\'sh — hujjatlar bloki ko\'rsatilmaydi (o\'lik havola yo\'q)', 'PDF ni public/ ga qo\'ying va yo\'lni bering');

if (get('NEXT_PUBLIC_PRODUCTION_VIDEO')) ok(`Video: ${get('NEXT_PUBLIC_PRODUCTION_VIDEO')}`);
else warn('NEXT_PUBLIC_PRODUCTION_VIDEO bo\'sh — video bloki ko\'rsatilmaydi', 'Ishlab chiqarish videosi (About/Hero) uchun');

const moq = Number(get('MIN_ORDER_KG') || 5);
if (!get('MIN_ORDER_KG')) warn(`MIN_ORDER_KG sozlanmagan — ${moq} kg JOY TUTGICH sifatida ko'rsatiladi`, 'Mijozdan aniq MOQ ni so\'rang (CLAUDE.md §9.1)');
else ok(`MOQ: ${moq} kg`);

/* ---------- 8. Biznes qoidalari (§1/§7.2) ---------- */
const businessChecks = [
  ['NEXT_PUBLIC_SAMPLE_BOX_MAX', CANON.sampleBoxMax, 'namuna qutisi sig\'imi'],
  ['SAMPLE_BOX_MAX_ITEMS', CANON.sampleBoxMax, 'namuna qutisi sig\'imi (server)'],
  ['SAMPLE_MIN_VOLUME', CANON.sampleMinVolume, 'minimal namuna hajmi'],
  ['SAMPLE_MAX_VOLUME', CANON.sampleMaxVolume, 'maksimal namuna hajmi'],
  ['SAMPLE_DELIVERY_DAYS', CANON.sampleDeliveryDays, 'yetkazish kuni'],
];
for (const [key, want, label] of businessChecks) {
  const v = get(key);
  if (!v) continue;
  if (Number(v) !== want) err(`${key} = ${v}, brief talabi ${want} (${label})`, `${key}="${want}" qilib qaytaring`);
}
ok(`Namuna qutisi: ${CANON.sampleBoxMax} ta · ${CANON.sampleMinVolume}–${CANON.sampleMaxVolume} g · ${CANON.sampleDeliveryDays} ish kuni`);

/* ---------- 9. Lead saqlash ---------- */
const storePath = get('LEAD_STORAGE_PATH');
if (storePath && !storePath.startsWith('/')) {
  warn('LEAD_STORAGE_PATH nisbiy yo\'l — standalone server .next/standalone ga nisbatan hisoblaydi, build paytida leadlar o\'chishi mumkin', 'MUTLAQ yo\'l bering: /app/data/leads');
} else if (!storePath) {
  warn('LEAD_STORAGE_PATH bo\'sh — <cwd>/data/leads ishlatiladi', 'Docker/VPS da MUTLAQ yo\'l + volume tavsiya etiladi');
} else ok(`Lead saqlash: ${storePath}`);

/* ------------------------------------------------------------
   Hisobot
   ------------------------------------------------------------ */
const C = { r: '\x1b[31m', y: '\x1b[33m', g: '\x1b[32m', b: '\x1b[1m', d: '\x1b[2m', x: '\x1b[0m' };
const plain = !process.stdout.isTTY;
const c = (color, s) => (plain ? s : `${color}${s}${C.x}`);

console.log(`\n${c(C.b, 'ENV NAZORATI — GFF Uzbekistan')}`);
const manba = Object.keys(fromFiles).length ? '.env/.env.local' : 'faqat muhit (env)';
console.log(c(C.d, `  manba: ${manba} · etalon: brief §15/§11.2/§7.2\n`));

if (oks.length) {
  console.log(c(C.g, '  ✔ Sozlangan / to\'g\'ri:'));
  for (const m of oks) console.log(`      ${m}`);
  console.log();
}

if (warnings.length) {
  console.log(c(C.y, `  ⚠ Ogohlantirish (${warnings.length}):`));
  for (const w of warnings) {
    console.log(`      ${w.msg}`);
    if (w.hint) console.log(c(C.d, `        → ${w.hint}`));
  }
  console.log();
}

if (errors.length) {
  console.log(c(C.r, `  ✖ Xato (${errors.length}) — launch'ni to'sadi:`));
  for (const e of errors) {
    console.log(`      ${e.msg}`);
    if (e.hint) console.log(c(C.d, `        → ${e.hint}`));
  }
  console.log();
  if (REPORT_ONLY) {
    console.log(c(C.y, '  --report rejimi: exit 0 (CI hisoboti)\n'));
    process.exit(0);
  }
  console.log(c(C.r, `  ✖ ${errors.length} ta band launch'ni to'sadi. Tuzatib qayta ishga tushiring.\n`));
  process.exit(1);
}

console.log(
  c(C.g, `  ✔ Launch'ni to'sadigan xato yo'q. Ogohlantirishlar: ${warnings.length}\n`),
);
