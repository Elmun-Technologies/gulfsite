#!/usr/bin/env node
/**
 * SEO / A11Y AUDITI (§13, §14) — `npm run audit:seo`
 * ----------------------------------------------------------------
 * Lighthouse sandbox'da ishga tushmaydi (Chrome yo'q), shuning uchun uning
 * SEO va Accessibility tekshiruvlarining biz nazorat qila oladigan qismi
 * bu skriptda: har bir sahifaning HTML'i olinadi va qoidalar bo'yicha
 * tekshiriladi.
 *
 * Tekshiriladi:
 *   §13.1 title ≤ 60 belgi (ogohlantirish 58+)
 *   §13.2 description ≤ 155 belgi
 *   §13.3 canonical + hreflang (uz, ru, en, x-default → uz)
 *   §13.4 JSON-LD mavjud (Organization/Product/BreadcrumbList/FAQPage…)
 *   §13.6 og:image bor va fayl HAQIQATAN yuklanadi (200)
 *   §14.1 <html lang> to'g'ri, bitta <h1>, barcha <img> da alt
 *   §14.2 ikonka-tugmalarda aria-label (matnsiz <button>)
 *   §10.5 ko'rinadigan `{placeholder}` yo'q
 *   404 holatlari haqiqiy 404 (soft-404 yo'q)
 *
 * Ishlatish:
 *   npm run build && npm start   (yoki: npm run dev)
 *   BASE_URL=http://127.0.0.1:3000 npm run audit:seo
 *
 * Chiqish kodi: 0 = toza, 1 = xato bor (CI uchun).
 */

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';

/** Tekshiriladigan sahifalar: har bir tur × 3 til (tanlab) */
const PAGES = [
  { path: '/uz', lang: 'uz', ld: ['Organization', 'WebSite'] },
  { path: '/ru', lang: 'ru', ld: ['Organization'] },
  { path: '/en', lang: 'en', ld: ['Organization'] },
  { path: '/uz/catalog', lang: 'uz', ld: ['BreadcrumbList', 'ItemList'] },
  { path: '/ru/catalog', lang: 'ru', ld: ['BreadcrumbList'] },
  { path: '/uz/catalog/vanilla-premium', lang: 'uz', ld: ['Product', 'BreadcrumbList'] },
  { path: '/en/catalog/vanilla-premium', lang: 'en', ld: ['Product'] },
  { path: '/uz/samples', lang: 'uz', ld: ['BreadcrumbList', 'FAQPage'] },
  { path: '/uz/industries', lang: 'uz', ld: ['BreadcrumbList'] },
  { path: '/uz/industries/bakery', lang: 'uz', ld: ['BreadcrumbList'] },
  { path: '/ru/industries/bakery', lang: 'ru', ld: ['BreadcrumbList'] },
  { path: '/uz/about', lang: 'uz', ld: ['BreadcrumbList'] },
  { path: '/uz/contact', lang: 'uz', ld: ['BreadcrumbList'] },
  { path: '/uz/quote', lang: 'uz', ld: ['BreadcrumbList', 'FAQPage'] },
  { path: '/uz/privacy', lang: 'uz', ld: ['BreadcrumbList'] },
  { path: '/uz/terms', lang: 'uz', ld: ['BreadcrumbList'] },
  { path: '/uz/search?q=vanil', lang: 'uz', ld: ['BreadcrumbList'], noindex: true },
];

/** Haqiqiy 404 qaytarishi kerak bo'lgan manzillar */
const NOT_FOUND = [
  '/uz/catalog/yoq-mahsulot',
  '/ru/catalog/yoq-mahsulot',
  '/uz/industries/yoq-soha',
  '/uz/umuman-yoq-sahifa',
];

/**
 * Production'da YOPIQ bo'lishi kerak, lekin brend 404 ko'rinishi TALAB
 * QILINMAYDigan manzillar.
 *
 * `/styleguide` — dev-only texnik sahifa (§10). U `[locale]` tashqarisida,
 * shuning uchun sahifa ichidan `notFound()` chaqirilganda Next o'zining
 * ichki `__next_error__` hujjatini beradi (status 404 — to'g'ri, ko'rinadigan
 * matn minimal). Foydalanuvchi va krawler bu manzilga tushmaydi:
 * noindex + robots.txt'da yopilgan.
 */
const CLOSED_IN_PROD = ['/styleguide'];

let errors = 0;
let warnings = 0;
const fail = (where, msg) => {
  errors += 1;
  console.error(`  ✖ ${where}: ${msg}`);
};
const warn = (where, msg) => {
  warnings += 1;
  console.warn(`  ⚠ ${where}: ${msg}`);
};

/* ------------------------------------------------------------------ */

/** HTML entitilarni dekodlash — Google uzunlikni DEKODLANGAN matnda o'lchaydi */
const decode = (str) =>
  str
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#x27;|&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ');

const strip = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function meta(html, name, attr = 'name') {
  const re = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]*>`, 'i');
  const tag = html.match(re)?.[0] ?? '';
  return (tag.match(/content=["']([^"']*)["']/i)?.[1] ?? '').trim();
}

function links(html, rel) {
  const out = [];
  const re = new RegExp(`<link[^>]+rel=["']${rel}["'][^>]*>`, 'gi');
  for (const m of html.matchAll(re)) out.push(m[0]);
  return out;
}

function jsonLdTypes(html) {
  const types = [];
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(m[1]);
      const list = Array.isArray(data) ? data : [data];
      for (const item of list) {
        if (item?.['@type']) types.push(String(item['@type']));
        if (item?.['@graph']) for (const g of item['@graph']) if (g?.['@type']) types.push(String(g['@type']));
      }
    } catch {
      types.push('(parse-error)');
    }
  }
  return types;
}

const ogImageCache = new Map();
async function checkImage(url, where) {
  const abs = url.startsWith('http') ? url : `${BASE}${url}`;
  if (ogImageCache.has(abs)) {
    if (!ogImageCache.get(abs)) fail(where, `og:image yuklanmadi: ${abs}`);
    return;
  }
  try {
    const res = await fetch(abs, { method: 'GET' });
    const ok = res.ok;
    ogImageCache.set(abs, ok);
    if (!ok) fail(where, `og:image ${res.status}: ${abs}`);
  } catch (err) {
    ogImageCache.set(abs, false);
    fail(where, `og:image so'rovi quladi (${err.message}): ${abs}`);
  }
}

/* ------------------------------------------------------------------ */

console.log(`\nSEO/A11Y auditi — ${BASE}\n`);

for (const page of PAGES) {
  const where = page.path;
  const res = await fetch(`${BASE}${page.path}`, { redirect: 'follow' });
  const html = await res.text();

  if (res.status !== 200) {
    fail(where, `HTTP ${res.status}`);
    continue;
  }

  /* ---- §4 Global CSS (stylesheet ulanganligi) ---- */
  const stylesheets = links(html, 'stylesheet');
  if (!stylesheets.length) {
    fail(where, '<link rel="stylesheet"> yo\'q — globals.css layout\'ga ulanmagan!');
  } else {
    for (const tag of stylesheets) {
      const cssHref = tag.match(/href=["']([^"']+)["']/i)?.[1] ?? '';
      if (cssHref) await checkImage(cssHref, `${where} [stylesheet]`);
    }
  }

  /* ---- §13.1 title ---- */
  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim();
  if (!title) fail(where, '<title> yo\'q');
  else if (title.length > 60) fail(where, `title ${title.length} belgi (> 60): "${title}"`);
  else if (title.length > 58) warn(where, `title ${title.length} belgi (Google 58+ ni kesadi)`);

  /* ---- §13.2 description ---- */
  const desc = decode(meta(html, 'description'));
  if (!desc) fail(where, 'meta description yo\'q');
  else if (desc.length > 155) fail(where, `description ${desc.length} belgi (> 155)`);

  /* ---- §13.3 canonical + hreflang ---- */
  const canonical = links(html, 'canonical')[0]?.match(/href=["']([^"']+)["']/i)?.[1] ?? '';
  if (!canonical) fail(where, 'canonical yo\'q');

  const alts = links(html, 'alternate');
  const hreflangs = new Map(
    alts
      .map((t) => ({
        h: t.match(/hreflang=["']([^"']+)["']/i)?.[1] ?? '',
        href: t.match(/href=["']([^"']+)["']/i)?.[1] ?? '',
      }))
      .filter((x) => x.h)
      .map((x) => [x.h, x.href]),
  );
  for (const need of ['uz', 'ru', 'en']) {
    // Next hreflang'ni BCP-47 tegida beradi (uz-Latn-UZ, ru-RU, en-US)
    const found = [...hreflangs.keys()].some((k) => k === need || k.startsWith(need));
    if (!found) fail(where, `hreflang "${need}" yo'q (bor: ${[...hreflangs.keys()].join(', ') || '—'})`);
  }
  const xdef = [...hreflangs.keys()].find((k) => k.toLowerCase() === 'x-default');
  if (!xdef) fail(where, 'hreflang x-default yo\'q (§13.5)');
  else if (!/\/uz(\/|$|\?)/.test(hreflangs.get(xdef))) {
    fail(where, `x-default uz'ga emas: ${hreflangs.get(xdef)}`);
  }

  /* ---- noindex (qidiruv sahifasi) ---- */
  const robots = meta(html, 'robots');
  if (page.noindex && !/noindex/.test(robots)) fail(where, `noindex kutilgan, robots: "${robots}"`);

  /* ---- §13.4 JSON-LD ---- */
  const ld = jsonLdTypes(html);
  if (!ld.length) fail(where, 'JSON-LD yo\'q');
  for (const need of page.ld ?? []) {
    if (!ld.some((x) => x.includes(need))) fail(where, `JSON-LD @type "${need}" yo'q (bor: ${ld.join(', ')})`);
  }

  /* ---- §13.6 og:image ---- */
  const og = meta(html, 'og:image', 'property');
  if (!og) fail(where, 'og:image yo\'q');
  else await checkImage(og, where);

  /* ---- §14.1 html lang, bitta h1, img alt ---- */
  const lang = html.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1] ?? '';
  if (!lang.startsWith(page.lang)) fail(where, `<html lang="${lang}"> (kutilgan: ${page.lang}…)`);

  const h1 = (html.match(/<h1[\s>]/gi) ?? []).length;
  if (h1 !== 1) fail(where, `<h1> soni = ${h1} (bitta bo'lishi kerak)`);

  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/alt=["'][^"']*["']/i.test(t));
  if (noAlt.length) fail(where, `${noAlt.length}/${imgs.length} <img> da alt yo'q`);

  /* ---- §14.2 matnsiz tugmalarda aria-label ---- */
  const buttons = [...html.matchAll(/<button\b[\s\S]*?<\/button>/gi)].map((m) => m[0]);
  const silent = buttons.filter((b) => {
    const text = strip(b);
    return text.length === 0 && !/aria-label=["'][^"']+["']/i.test(b);
  });
  if (silent.length) fail(where, `${silent.length} ta matnsiz <button> aria-label'siz`);

  /* ---- §10.5 placeholder ---- */
  const ph = [...new Set(strip(html).match(/\{[a-zA-Z][\w.]*\}/g) ?? [])];
  if (ph.length) fail(where, `ko'rinadigan placeholder: ${ph.slice(0, 5).join(' ')}`);

  const okMsg = [
    `title ${title.length}`,
    `desc ${desc.length}`,
    `h1=${h1}`,
    `ld=${[...new Set(ld)].join('/')}`,
    `hreflang=${hreflangs.size}`,
    `img=${imgs.length}`,
  ].join(' · ');
  if (!errors) console.log(`  ✓ ${where.padEnd(32)} ${okMsg}`);
  else console.log(`  · ${where.padEnd(32)} ${okMsg}`);
}

/* ---------------- 404 holatlari ---------------- */

console.log('\n404 holatlari (soft-404 yo\'qligi):');
for (const path of NOT_FOUND) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'follow' });
  const html = await res.text();
  const hasH1 = /<h1[\s>]/i.test(html);
  if (res.status !== 404) fail(path, `HTTP ${res.status} (404 kutilgan)`);
  else if (!hasH1) fail(path, '404 sahifasida <h1> yo\'q (brend ko\'rinishi render bo\'lmagan)');
  else console.log(`  ✓ ${path.padEnd(32)} 404 + brend ko'rinishi`);
}

for (const path of CLOSED_IN_PROD) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'follow' });
  if (res.status !== 404) fail(path, `HTTP ${res.status} (production'da 404 kutilgan)`);
  else console.log(`  ✓ ${path.padEnd(32)} production'da yopiq (404)`);
}

/* ---------------- xulosa ---------------- */

console.log('');
if (errors) {
  console.error(`✖ Audit: ${errors} ta xato, ${warnings} ta ogohlantirish\n`);
  process.exit(1);
}
console.log(`✔ SEO/A11Y auditi toza (${warnings} ta ogohlantirish)\n`);
