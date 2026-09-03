#!/usr/bin/env node
/**
 * ============================================================
 *  GFF UZBEKISTAN — KATALOG GENERATORI
 * ============================================================
 *  Manba:  data/source/products.json  (ixcham massivlar)
 *  Chiqish: src/data/catalog.json     (to'liq, 3 tilli, izlovsiz)
 *
 *  Ishga tushirish:  npm run catalog:build
 *
 *  products.json qatori tartibi:
 *    [0] en    — inglizcha nom (slug shundan yasaladi)
 *    [1] ru    — ruscha nom
 *    [2] uz    — o'zbekcha nom
 *    [3] cat   — kategoriya id (taxonomy.ts)
 *    [4] grp   — guruh id
 *    [5] apps  — qo'llash sohalari (vergul bilan)
 *    [6] opts  — ixtiyoriy obyekt:
 *                { form, dmin, dmax, pack:[kg], feat:[], avail, pop, new, top, tags }
 * ============================================================
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SRC_DIR = join(ROOT, 'data/source');
const OUT_DIR = join(ROOT, 'src/data');
const OUT = join(OUT_DIR, 'catalog.json');

/* ------------------------------------------------------------
   Kategoriya bo'yicha standart qiymatlar
   ------------------------------------------------------------ */
const CATEGORY_DEFAULTS = {
  flavours: {
    prefix: 'GFFD',
    form: 'liquid',
    dmin: 0.05,
    dmax: 0.3,
    pack: [1, 5, 10, 25],
    feat: ['halal', 'gmo-free', 'alcohol-free', 'heat-stable', 'iso'],
    avail: 'in-stock',
    shelfLife: 24,
  },
  fragrances: {
    prefix: 'GFFF',
    form: 'oil',
    dmin: 0.3,
    dmax: 3,
    pack: [1, 5, 10, 25],
    feat: ['gmo-free', 'iso', 'oil-soluble'],
    avail: 'in-stock',
    shelfLife: 36,
  },
  'essential-oils': {
    prefix: 'GFFE',
    form: 'oil',
    dmin: 0.01,
    dmax: 0.2,
    pack: [1, 5, 10, 25],
    feat: ['natural', 'halal', 'gmo-free', 'vegan', 'iso'],
    avail: 'in-stock',
    shelfLife: 24,
  },
  'aroma-chemicals': {
    prefix: 'GFFA',
    form: 'liquid',
    dmin: 0.01,
    dmax: 1,
    pack: [1, 5, 25],
    feat: ['iso', 'gmo-free'],
    avail: 'on-order',
    shelfLife: 24,
  },
  'food-ingredients': {
    prefix: 'GFFI',
    form: 'powder',
    dmin: 0.05,
    dmax: 2,
    pack: [1, 5, 25],
    feat: ['halal', 'gmo-free', 'iso', 'eac'],
    avail: 'in-stock',
    shelfLife: 24,
  },
  commodities: {
    prefix: 'GFFC',
    form: 'liquid',
    dmin: 0.5,
    dmax: 20,
    pack: [5, 25, 200],
    feat: ['iso', 'gmo-free'],
    avail: 'in-stock',
    shelfLife: 18,
  },
};

/* ------------------------------------------------------------
   Yordamchi funksiyalar
   ------------------------------------------------------------ */
const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[‘’ʻʼ'`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);

/** Deterministik hash — bir xil kirish har doim bir xil chiqish beradi */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const pick = (arr, seed) => arr[seed % arr.length];

function skuFor(prefix, en, index) {
  const n = (hash(prefix + en) % 8999) + 1000;
  return `${prefix}${n}${index % 10 === 0 ? '' : ''}`;
}

/* ------------------------------------------------------------
   Asosiy jarayon
   ------------------------------------------------------------ */
function loadRows() {
  const files = readdirSync(SRC_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort();

  const rows = [];
  const meta = [];
  for (const f of files) {
    const parsed = JSON.parse(readFileSync(join(SRC_DIR, f), 'utf8'));
    const list = Array.isArray(parsed) ? parsed : parsed.products;
    if (!Array.isArray(list)) continue;
    rows.push(...list);
    meta.push({ file: f, count: list.length });
  }
  return { rows, meta };
}

function main() {
  const { rows, meta } = loadRows();
  console.log('📦 Manba fayllar:');
  for (const m of meta) console.log(`   ${m.file.padEnd(28)} ${String(m.count).padStart(4)} qator`);

  const products = [];
  const seenSlug = new Map();
  const seenSku = new Set();
  const errors = [];

  rows.forEach((row, i) => {
    const [en, ru, uz, cat, grp, appsStr, optsRaw] = row;
    const opts = optsRaw && typeof optsRaw === 'object' ? optsRaw : {};
    if (!en || !ru || !uz || !cat || !grp) {
      errors.push(`Qator ${i + 1}: majburiy maydon to‘ldirilmagan -> ${JSON.stringify(row)}`);
      return;
    }
    const def = CATEGORY_DEFAULTS[cat];
    if (!def) {
      errors.push(`Qator ${i + 1}: noma‘lum kategoriya "${cat}"`);
      return;
    }

    // slug — takrorlangan bo‘lsa raqam qo‘shamiz
    let slug = slugify(en.replace(/\bflavour\b|\bfragrance\b/gi, '').trim() || en);
    if (!slug) slug = slugify(en);
    if (seenSlug.has(slug)) {
      const n = seenSlug.get(slug) + 1;
      seenSlug.set(slug, n);
      slug = `${slug}-${n}`;
    } else {
      seenSlug.set(slug, 1);
    }

    // SKU — takrorlanmasligi kerak
    let sku = skuFor(def.prefix, en, i);
    let guard = 0;
    while (seenSku.has(sku) && guard < 50) {
      sku = skuFor(def.prefix, en + guard, i);
      guard++;
    }
    seenSku.add(sku);

    const apps = String(appsStr || '')
      .split(/[;,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const seed = hash(slug + sku);
    const dmin = opts.dmin ?? def.dmin;
    const dmax = opts.dmax ?? def.dmax;
    const pack = opts.pack ?? def.pack;
    const feat = Array.from(new Set([...(opts.feat ?? []), ...(def.feat ?? [])]));
    const form = opts.form ?? def.form;
    const avail = opts.avail ?? (opts.new ? 'new' : def.avail);

    // Mashhurlik: top belgilangan bo‘lsa yuqori, aks holda deterministik
    const popularity = opts.pop ?? (opts.top ? 92 : opts.new ? 78 : 30 + (seed % 55));

    products.push({
      id: sku,
      sku,
      slug,
      category: cat,
      group: grp,
      form,
      applications: apps,
      dosage: { min: dmin, max: dmax, unit: '%' },
      packaging: pack,
      features: feat,
      availability: avail,
      popularity,
      isNew: Boolean(opts.new),
      isTop: Boolean(opts.top),
      shelfLifeMonths: opts.shelf ?? def.shelfLife,
      name: { uz, ru, en },
      copyVariant: seed % 3,
      tags: opts.tags ?? [],
      order: i,
    });
  });

  mkdirSync(OUT_DIR, { recursive: true });

  const payload = {
    version: 1,
    generatedAt: new Date().toISOString().slice(0, 10),
    count: products.length,
    products,
  };

  writeFileSync(OUT, JSON.stringify(payload, null, 0), 'utf8');

  /* ---- Hisobot ---- */
  const byCat = {};
  const byGroup = {};
  for (const p of products) {
    byCat[p.category] = (byCat[p.category] ?? 0) + 1;
    byGroup[p.group] = (byGroup[p.group] ?? 0) + 1;
  }

  console.log(`\n✅ Katalog yaratildi: src/data/catalog.json`);
  console.log(`   Mahsulotlar soni: ${products.length}`);
  console.log(`\n   Kategoriya bo'yicha:`);
  for (const [k, v] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
    console.log(`     ${k.padEnd(20)} ${String(v).padStart(4)}`);
  }
  console.log(`\n   Guruh bo'yicha (${Object.keys(byGroup).length} ta):`);
  for (const [k, v] of Object.entries(byGroup).sort((a, b) => b[1] - a[1])) {
    console.log(`     ${k.padEnd(20)} ${String(v).padStart(4)}`);
  }

  if (errors.length) {
    console.log(`\n⚠️  ${errors.length} ta xato topildi:`);
    errors.slice(0, 20).forEach((e) => console.log('   - ' + e));
    process.exitCode = 1;
  }

  const size = (readFileSync(OUT).length / 1024).toFixed(1);
  console.log(`\n   Fayl hajmi: ${size} KB\n`);
}

main();
