#!/usr/bin/env node
/**
 * TARJIMALAR REVIEW RO'YXATI (§10.6) — `npm run i18n:export`
 * ----------------------------------------------------------------
 * Brief talabi: "qolgan RU/EN nusxalari alohida review ro'yxati sifatida
 * beriladi". Bu skript uchala lug'atni bitta CSV'ga chiqaradi — mijoz
 * uni Google Sheets/Excel'da ustunma-ustun ko'rib chiqishi mumkin.
 *
 * Chiqish: `docs/translations-review.csv`
 *   key · screen · uz · ru · en · flags · note
 *
 * Bayroqlar (avtomatik):
 *   `same-as-uz`   — RU yoki EN nusxa UZ bilan bir xil (tarjima qilinmagan)
 *   `empty`        — qiymat bo'sh
 *   `vars`         — `{var}` bor: tarjimonda joy tutgichlar SAQLANISHLI
 *   `keep-en`      — inglizcha qolishi shart (slogan, monogramma, §10.4)
 *   `plural`       — ko'plik shakli (`one|few|many`), 3 qism bo'lishi kerak
 *   `legal`        — yurist tasdig'i kerak (§15)
 *   `client`       — mijoz tasdiqlashi kerak (aloqa, MOQ, sertifikatlar)
 *
 * Lug'atlar TS fayllarda, Node ularni import qila olmaydi — shuning uchun
 * `scripts/check-placeholders.mjs` dagi tekshirilgan regex parser ishlatiladi.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'docs');
const OUT = join(OUT_DIR, 'translations-review.csv');

const LOCALES = ['uz', 'ru', 'en'];

/** `'kalit': 'qiymat',` — ko'p qatorli va escape holatlarini ham oladi */
function parseDictFile(locale) {
  const src = readFileSync(join(ROOT, 'src', 'i18n', `${locale}.ts`), 'utf8');
  const out = new Map();
  const re = /^\s*(['"])((?:(?!\1)[^\\]|\\.)+)\1\s*:\s*(['"`])((?:\\.|(?!\3)[^\\])*)\3\s*,?\s*$/gm;
  let m;
  while ((m = re.exec(src))) {
    out.set(m[2], m[4].replace(/\\'/g, "'").replace(/\\"/g, '"'));
  }
  return out;
}

const dicts = Object.fromEntries(LOCALES.map((l) => [l, parseDictFile(l)]));

/* ---------------- ekran (guruh) xaritasi ---------------- */

const SCREENS = {
  nav: 'Navigatsiya',
  header: 'Header',
  footer: 'Footer',
  hero: 'Bosh sahifa · Hero',
  home: 'Bosh sahifa',
  stats: 'Bosh sahifa · raqamlar',
  why: 'Nega biz',
  cta: 'CTA bloklari',
  catalog: 'Katalog',
  product: 'Mahsulot sahifasi',
  samples: 'Namuna qutisi',
  industry: 'Sohalar',
  industries: 'Sohalar',
  about: 'Kompaniya',
  contact: 'Aloqa',
  quote: 'Narx so‘rash (RFQ)',
  search: 'Qidiruv',
  nf: '404',
  privacy: 'Maxfiylik',
  legal: 'Huquqiy',
  form: 'Formalar',
  faq: 'FAQ',
  cookie: 'Cookie banneri',
  box: 'Namuna qutisi (header)',
  sticky: 'Sticky CTA',
  toast: 'Bildirishnomalar',
  a11y: 'A11y / skip',
  common: 'Umumiy',
  plural: 'Ko‘plik shakllari',
  applicationBlurb: 'Qo‘llanish sohalari matni',
  categories: 'Kategoriyalar',
  groups: 'Guruhlar',
  forms: 'Shakllar',
  features: 'Xususiyatlar',
  availability: 'Mavjudlik',
  regions: 'Hududlar',
  business: 'Biznes turlari',
  leadTypes: 'So‘rov turlari',
  seo: 'SEO (title/description)',
  slogan: 'Slogan (inglizcha qoladi)',
  monogram: 'Monogramma',
  brand: 'Brend',
  site: 'Sayt',
  admin: 'Admin panel',
  docs: 'Hujjatlar',
  certificate: 'Sertifikatlar',
};

function screenOf(key) {
  const head = key.split('.')[0];
  return SCREENS[head] ?? head;
}

/* ---------------- bayroqlar ---------------- */

const CLIENT_KEYS = /^(contact\.|site\.|docs\.|certificate\.|stats\.)/;
const LEGAL_KEYS = /^(privacy\.|legal\.|form\.consent)/;
const KEEP_EN = /^(slogan\.|monogram\.)/;

const hasLetters = (s) => /[\p{L}]/u.test(s);

function flagsFor(key, uz, ru, en) {
  const flags = [];

  if (!uz || !ru || !en) flags.push('empty');
  if (ru && uz && ru === uz && hasLetters(uz) && !KEEP_EN.test(key)) flags.push('ru-same-as-uz');
  if (en && uz && en === uz && hasLetters(uz) && !KEEP_EN.test(key)) flags.push('en-same-as-uz');

  const vars = [...(uz.match(/\{[\w]+\}/g) ?? [])];
  if (vars.length) flags.push(`vars:${vars.join('')}`);

  if (KEEP_EN.test(key)) flags.push('keep-en');
  if (LEGAL_KEYS.test(key)) flags.push('legal');
  if (CLIENT_KEYS.test(key)) flags.push('client');

  // ko'plik: 'one|few|many' shakli
  if (/\|/.test(uz) && /^plural\./.test(key)) {
    const parts = uz.split('|').length;
    flags.push(`plural:${parts}`);
    if (parts !== 3) flags.push('plural-parts-not-3');
  }

  return flags;
}

/* ---------------- TAKSONOMIYA (src/lib/taxonomy.ts) ----------------
   Kategoriya/guruh/qo'llanish/shakl/mavjudlik/hudud nomlari lug'atlarda
   EMAS — ular `taxonomy.ts` ichida uch tilli obyekt sifatida yashaydi va
   foydalanuvchiga ko'rinadi (filtrlar, kartalar, breadcrumb). Shuning uchun
   review ro'yxatiga alohida CSV qilib chiqariladi.                        */

const KIND_LABEL = {
  CATEGORIES: 'Kategoriya',
  FLAVOUR_GROUPS: 'Guruh (aromatizator)',
  FRAGRANCE_GROUPS: 'Guruh (atir)',
  INGREDIENT_GROUPS: 'Guruh (ingredient)',
  COMMODITY_GROUPS: 'Guruh (kommoditi)',
  APPLICATIONS: 'Qo\'llanish sohasi',
  FORMS: 'Mahsulot shakli',
  PACKAGING: 'Qadoq',
  FEATURES: 'Xususiyat',
  AVAILABILITY: 'Mavjudlik',
  UZ_REGIONS: 'Hudud',
  BUSINESS_TYPES: 'Biznes turi',
  LEAD_TYPES: 'So\'rov turi',
  LEAD_STATUSES: 'So\'rov statusi',
  ALL_GROUPS: 'Guruh',
};

function parseTaxonomy() {
  const src = readFileSync(join(ROOT, 'src', 'lib', 'taxonomy.ts'), 'utf8');
  const tri =
    /\buz:\s*(['"`])((?:\\.|(?!\1)[^\\])*)\1\s*,\s*ru:\s*(['"`])((?:\\.|(?!\3)[^\\])*)\3\s*,\s*en:\s*(['"`])((?:\\.|(?!\5)[^\\])*)\5/g;
  const out = [];
  let m;
  while ((m = tri.exec(src))) {
    const before = src.slice(0, m.index);
    const kindMatch = [...before.matchAll(/export const (\w+)/g)].pop();
    const kind = kindMatch ? kindMatch[1] : '(boshqa)';
    const idMatch = [...before.slice(-500).matchAll(/\bid:\s*(['"])([^'"]+)\1/g)].pop();
    out.push({
      kind,
      kindLabel: KIND_LABEL[kind] ?? kind,
      id: idMatch ? idMatch[2] : '(idsiz)',
      uz: unesc(m[2]),
      ru: unesc(m[4]),
      en: unesc(m[6]),
    });
  }
  const total = (src.match(/\buz:/g) ?? []).length;
  return { rows: out, total };
}

const unesc = (v) => v.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\r?\n/g, ' ⏎ ');

/* ---------------- CSV ---------------- */

function csvCell(v) {
  const s = String(v ?? '').replace(/\r?\n/g, ' ⏎ ');
  return /[",;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const keys = [...dicts.uz.keys()].sort((a, b) => {
  const sa = screenOf(a);
  const sb = screenOf(b);
  return sa === sb ? a.localeCompare(b) : sa.localeCompare(sb) || a.localeCompare(b);
});

mkdirSync(OUT_DIR, { recursive: true });

const rows = [['key', 'screen', 'uz', 'ru', 'en', 'flags', 'note'].join(',')];
const counters = { 'ru-same-as-uz': 0, 'en-same-as-uz': 0, empty: 0, legal: 0, client: 0, vars: 0, 'keep-en': 0 };

for (const key of keys) {
  const uz = dicts.uz.get(key) ?? '';
  const ru = dicts.ru.get(key) ?? '';
  const en = dicts.en.get(key) ?? '';
  const flags = flagsFor(key, uz, ru, en);

  for (const f of flags) {
    const base = f.split(':')[0];
    if (base === 'vars') counters.vars += 1;
    else if (counters[base] !== undefined) counters[base] += 1;
  }

  let note = '';
  if (flags.includes('keep-en')) note = 'Barcha tillarda inglizcha qoladi (§10.4) — tarjima QILINMAYDI';
  else if (flags.includes('ru-same-as-uz') || flags.includes('en-same-as-uz'))
    note = 'Tarjima qilinmagan — ko\'rib chiqish shart';
  else if (flags.some((f) => f.startsWith('vars')))
    note = 'Joy tutgichlarni ({…}) saqlang va tartibini o\'zgartirmang';
  else if (flags.includes('legal')) note = 'Yurist tasdiqlashi kerak (§15)';
  else if (flags.includes('client')) note = 'Mijoz tasdiqlashi kerak (raqam/manzil/son)';

  rows.push([key, screenOf(key), uz, ru, en, flags.join(' '), note].map(csvCell).join(','));
}

writeFileSync(OUT, `\uFEFF${rows.join('\n')}\n`, 'utf8'); // BOM — Excel kirillni to'g'ri ochadi

const kb = Math.round((existsSync(OUT) ? readFileSync(OUT).length : 0) / 1024);

console.log(`\n✓ ${OUT.replace(ROOT + '/', '')} (${keys.length} kalit, ${kb} KB)\n`);
console.log('  Ko\'rib chiqish ustuvorligi:');
console.log(`    tarjima qilinmagan RU : ${counters['ru-same-as-uz']}`);
console.log(`    tarjima qilinmagan EN : ${counters['en-same-as-uz']}`);
console.log(`    bo'sh qiymat          : ${counters.empty}`);
console.log(`    yurist tasdig'i       : ${counters.legal}`);
console.log(`    mijoz tasdig'i        : ${counters.client}`);
console.log(`    {var} li (tegilmaydi) : ${counters.vars}`);
console.log(`    inglizcha qoladi      : ${counters['keep-en']}\n`);

/* ---------------- taksonomiya CSV ---------------- */

const tax = parseTaxonomy();
const TAX_OUT = join(OUT_DIR, 'taxonomy-review.csv');
const taxRows = [['id', 'turi', 'uz', 'ru', 'en', 'flags', 'note'].join(',')];
let taxSame = 0;
for (const r of tax.rows) {
  const flags = [];
  if (r.ru === r.uz && hasLetters(r.uz)) flags.push('ru-same-as-uz');
  if (r.en === r.uz && hasLetters(r.uz)) flags.push('en-same-as-uz');
  if (flags.length) taxSame += 1;
  taxRows.push(
    [r.id, r.kindLabel, r.uz, r.ru, r.en, flags.join(' '), flags.length ? "Tarjima qilinmagan — ko'rib chiqish shart" : '']
      .map(csvCell)
      .join(','),
  );
}
writeFileSync(TAX_OUT, `\uFEFF${taxRows.join('\n')}\n`, 'utf8');

console.log(
  `✓ ${TAX_OUT.replace(ROOT + '/', '')} (${tax.rows.length}/${tax.total} uch tilli yozuv, ` +
    `${taxSame} ta tarjimasi qilinmagan)`,
);
if (tax.rows.length < tax.total) {
  console.error(
    `✖ taxonomy.ts da ${tax.total} ta 'uz:' bor, ${tax.rows.length} tasi parse qilindi — parserni yangilang`,
  );
  process.exit(1);
}

if (counters.empty) {
  console.error(`✖ ${counters.empty} ta kalit bo'sh — to'ldirish kerak`);
  process.exit(1);
}
