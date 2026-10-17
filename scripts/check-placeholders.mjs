#!/usr/bin/env node
/**
 * PLACEHOLDER NAZORATI (§10.5) — `npm test`
 * ----------------------------------------------------------------
 * Talab: "CI testi render qilingan HTML'da `{` + harf + `}` ko'rinsa
 * YIQILISHI kerak." Eski saytdagi `{count}`/`{max}` kabi xom
 * placeholder'lar foydalanuvchigacha chiqib ketgan edi.
 *
 * Uch qatlamli nazorat (arzon → qimmat):
 *
 *   1. LUG'AT MOSLIGI (offline, doim ishlaydi)
 *      Har bir kalitdagi `{var}` to'plami UZ/RU/EN da BIR XIL bo'lishi
 *      kerak. Farq = tarjimonda o'zgaruvchi yo'qolgan → ekranda `{var}`.
 *
 *   2. CHAQIRUV NAZORATI (offline, doim ishlaydi) — ESKI BUGNING ILDIZI
 *      `src/**\/*.tsx|ts` dagi barcha `t('kalit', { … })` chaqiruvlari
 *      topiladi va lug'atdagi `{var}` to'plami bilan solishtiriladi:
 *        · `{var}` li kalit o'zgaruvchisiz chaqirilgan  → XATO
 *        · biror `{var}` uzatilmagan                    → XATO
 *        · lug'atda yo'q kalit chaqirilgan              → XATO
 *      Shu sababli xom placeholder build'gacha yetib bormaydi.
 *
 *   3. RENDER QILINGAN HTML (server kerak)
 *      `BASE_URL` (default http://127.0.0.1:3000) dagi asosiy sahifalar
 *      olinadi, `<script>`/`<style>` tozalanadi va `\{[a-zA-Z][\w.]*\}`
 *      qidiriladi. Server javob bermasa — bu qadam O'TKAZIB YUBORILADI
 *      (xitob bilan), chunki CI'da build/start alohida bosqich.
 *      Majburiy qilish uchun: `REQUIRE_SERVER=1 npm test`.
 *
 * Chiqish kodi: 0 = toza, 1 = xato topildi.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const SRC = join(ROOT, 'src');
const LOCALES = ['uz', 'ru', 'en'];
const VAR_RE = /\{([a-zA-Z_][\w]*)\}/g;

let errors = 0;
const fail = (where, msg) => {
  errors += 1;
  console.error(`  ✖ ${where}\n    ${msg}`);
};

/* ================================================================ */
/* 1. LUG'ATLAR                                                      */
/* ================================================================ */

/** Lug'at faylini import qilib, kalit → qiymat xaritasini olamiz */
async function loadDict(locale) {
  const mod = await import(`file://${join(SRC, 'i18n', `${locale}.ts`)}`);
  return mod.default ?? mod[`${locale}`] ?? mod.dictionary;
}

/**
 * TS lug'atini Node to'g'ridan-to'g'ri import qila olmaydi, shuning
 * uchun qiymatlarni oddiy parser bilan o'qiymiz: `'kalit': 'matn',`
 * (ko'p qatorli va escape'langan holatlar ham).
 */
function parseDictFile(locale) {
  const file = join(SRC, 'i18n', `${locale}.ts`);
  const src = readFileSync(file, 'utf8');
  const out = new Map();
  // 'key': 'value'  |  "key": "value"  |  'key': `value`
  const re = /^\s*(['"])((?:(?!\1)[^\\]|\\.)+)\1\s*:\s*(['"`])((?:\\.|(?!\3)[^\\])*)\3\s*,?\s*$/gm;
  let m;
  while ((m = re.exec(src))) {
    out.set(m[2], m[4]);
  }
  return out;
}

function varsOf(value) {
  const set = new Set();
  for (const m of String(value).matchAll(VAR_RE)) set.add(m[1]);
  return set;
}

const dicts = Object.fromEntries(LOCALES.map((l) => [l, parseDictFile(l)]));
const keyCount = Object.fromEntries(LOCALES.map((l) => [l, dicts[l].size]));

console.log('\n[1/3] Lug\'at mosligi');
console.log(`  kalitlar: ${LOCALES.map((l) => `${l}=${keyCount[l]}`).join(' · ')}`);

for (const l of LOCALES) {
  if (keyCount[l] === 0) fail(`i18n/${l}.ts`, 'hech qanday kalit topilmadi (parser ishlamadi)');
}
if (new Set(LOCALES.map((l) => keyCount[l])).size !== 1) {
  const base = LOCALES.reduce((a, b) => (keyCount[a] >= keyCount[b] ? a : b));
  for (const l of LOCALES) {
    if (l === base) continue;
    const missing = [...dicts[base].keys()].filter((k) => !dicts[l].has(k)).slice(0, 8);
    const extra = [...dicts[l].keys()].filter((k) => !dicts[base].has(k)).slice(0, 8);
    if (missing.length) fail(`i18n/${l}.ts`, `${base} dagi ${missing.length}+ kalit yo'q: ${missing.join(', ')}`);
    if (extra.length) fail(`i18n/${l}.ts`, `ortiqcha kalitlar: ${extra.join(', ')}`);
  }
}

/** Har bir kalitning `{var}` to'plami 3 tilda bir xilmi? */
let varKeys = 0;
for (const [key, uzValue] of dicts.uz) {
  const want = varsOf(uzValue);
  if (!want.size) continue;
  varKeys += 1;
  for (const l of ['ru', 'en']) {
    const have = varsOf(dicts[l].get(key) ?? '');
    const missing = [...want].filter((v) => !have.has(v));
    const extra = [...have].filter((v) => !want.has(v));
    if (missing.length) fail(`i18n/${l}.ts · '${key}'`, `{${missing.join('}, {')}} o'zgaruvchisi yo'q (uz: {${[...want].join('}, {')}})`);
    if (extra.length) fail(`i18n/${l}.ts · '${key}'`, `ortiqcha o'zgaruvchi: {${extra.join('}, {')}}`);
  }
}
console.log(`  {var} li kalitlar: ${varKeys} — 3 tilda solishtirildi`);

/* ================================================================ */
/* 2. CHAQIRUV NAZORATI                                              */
/* ================================================================ */

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name.startsWith('.')) continue;
      walk(p, out);
    } else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

console.log('\n[2/3] Kod chaqiruvlari');

const files = walk(SRC).filter(
  // lug'at fayllari va translator implementatsiyasi (ichida hujjat
  // misollari bor) — chaqiruv nazoratidan tashqarida
  (f) => !/\/i18n\//.test(f),
);
let calls = 0;

// t('key') · t('key', { a, b: c }) · t("key") · tp('key', n, { … })
const CALL_RE = /\b(?:\bt|t\.raw|translator|\btr)\s*\(\s*(['"])((?:(?!\1)[^\\]|\\.)+)\1\s*(\))?/g;

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const rel = relative(ROOT, file);
  let m;
  CALL_RE.lastIndex = 0;
  while ((m = CALL_RE.exec(src))) {
    const key = m[2];
    const closed = m[3] === ')'; // darhol yopilgan = o'zgaruvchisiz
    calls += 1;

    const known = dicts.uz.has(key);
    if (!known) {
      // `tr(taxon.name, locale)` kabi kalit bo'lmagan chaqiruvlar ham bor —
      // ular lug'atdan emas, shuning uchun faqat `t('…')` shaklini tekshiramiz
      fail(rel, `lug'atda yo'q kalit: '${key}'`);
      continue;
    }

    const want = varsOf(dicts.uz.get(key));
    if (!want.size) continue;

    // t.raw('key') — shablon klientga uzatiladi va u yerda `fillVars()`
    // bilan to'ldiriladi, shuning uchun o'zgaruvchisiz chaqiruv TO'G'RI
    if (/\.raw\s*\(/.test(m[0])) continue;

    if (closed) {
      fail(rel, `'${key}' {${[...want].join('}, {')}} talab qiladi, lekin o'zgaruvchisiz chaqirilgan`);
      continue;
    }

    // Ikkinchi argument — `{ … }` ichidagi kalit nomlari
    const tail = src.slice(CALL_RE.lastIndex, CALL_RE.lastIndex + 600);
    const braceStart = tail.indexOf('{');
    if (braceStart < 0) {
      fail(rel, `'${key}' {${[...want].join('}, {')}} talab qiladi, lekin argument topilmadi`);
      continue;
    }
    let depth = 0;
    let end = -1;
    for (let i = braceStart; i < tail.length; i += 1) {
      if (tail[i] === '{') depth += 1;
      else if (tail[i] === '}') {
        depth -= 1;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    const passed = end > 0 ? tail.slice(braceStart, end + 1) : '';
    const given = new Set(
      [...passed.matchAll(/(?:^|[,{\s])([a-zA-Z_]\w*)\s*:/g)].map((x) => x[1]),
    );
    // qisqa shakl: `{ count }` yoki `{ count, total }`
    for (const x of passed.matchAll(/[,{\s]([a-zA-Z_]\w*)\s*(?:[,}])/g)) given.add(x[1]);

    const missing = [...want].filter((v) => !given.has(v));
    if (missing.length) {
      fail(rel, `'${key}' uchun {${missing.join('}, {')}} uzatilmagan (berilgan: {${[...given].join('}, {') || '—'}})`);
    }
  }
}
console.log(`  tekshirilgan fayl: ${files.length} · chaqiruv: ${calls}`);

/* ================================================================ */
/* 3. RENDER QILINGAN HTML                                           */
/* ================================================================ */

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const REQUIRE = process.env.REQUIRE_SERVER === '1';
/** `npm run test:i18n` — faqat offline qatlamlar (server talab qilinmaydi) */
const STATIC_ONLY = process.argv.includes('--static');

const ROUTES = [
  '/uz',
  '/ru',
  '/en',
  '/uz/catalog',
  '/uz/catalog/vanilla-premium',
  '/uz/samples',
  '/uz/industries',
  '/uz/industries/bakery',
  '/uz/about',
  '/uz/contact',
  '/uz/search?q=vanil',
  '/uz/privacy',
  '/uz/terms',
  '/uz/quote',
];

const HTML_VAR_RE = /\{[a-zA-Z][\w.]*\}/g;

async function fetchRoute(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'follow' });
  const html = await res.text();
  // RSC flight payload HTML ichida bo'ladi — faqat KO'RINADIGAN qismni tekshiramiz
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  return { status: res.status, hits: [...new Set(body.match(HTML_VAR_RE) ?? [])] };
}

console.log(`\n[3/3] Render qilingan HTML (${BASE})`);

let checked = 0;
if (STATIC_ONLY) {
  console.log('  ⚠ --static: bu qadam o\'tkazib yuborildi (faqat lug\'at va kod chaqiruvlari tekshirildi)');
}
try {
  if (STATIC_ONLY) throw new Error('static-only');
  const probe = await fetch(`${BASE}/uz`, { method: 'GET' });
  if (!probe.ok && probe.status >= 500) throw new Error(`server ${probe.status} qaytardi`);

  for (const path of ROUTES) {
    const { status, hits } = await fetchRoute(path);
    checked += 1;
    if (status >= 400) fail(path, `HTTP ${status}`);
    if (hits.length) fail(path, `ko'rinadigan placeholder: ${hits.slice(0, 6).join(' ')}`);
    else console.log(`  ✓ ${path} · ${status}`);
  }
} catch (err) {
  if (STATIC_ONLY) {
    // yuqorida allaqachon yozildi — ikkinchi xabar kerak emas
  } else {
    const msg = `serverga ulanib bo'lmadi (${err.message ?? err})`;
    if (REQUIRE) fail(BASE, msg);
    else
      console.log(
        `  ⚠ ${msg} — bu qadam o'tkazib yuborildi.\n    Majburiy qilish: npm run build && npm start, so'ng REQUIRE_SERVER=1 npm test`,
      );
  }
}

/* ================================================================ */

console.log('');
if (errors) {
  console.error(`✖ Placeholder nazorati: ${errors} ta xato (tekshirilgan route: ${checked})\n`);
  process.exit(1);
}
console.log(`✔ Placeholder yo'q — lug'atlar, chaqiruvlar${checked ? ` va ${checked} ta route` : ''} toza.\n`);
