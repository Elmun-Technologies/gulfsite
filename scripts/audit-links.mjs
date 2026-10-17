#!/usr/bin/env node
/**
 * O'LIK HAVOLA VA ASSET AUDITI — `npm run audit:links`
 * ----------------------------------------------------------------
 * Nima uchun: `NEXT_PUBLIC_CATALOG_PDF`, `NEXT_PUBLIC_PRODUCTION_VIDEO` va
 * har mahsulot fotosi bo'sh bo'lishi mumkin (§15 TODO). Bo'sh qiymat uchun
 * tugma UMUMAN ko'rsatilmasligi kerak — aks holda saytga `href="#"` yoki
 * 404 beradigan havola chiqib qoladi. Ko'z bilan payqash qiyin, shuning uchun
 * avtomatik tekshiriladi.
 *
 * Tekshiruvlar:
 *   1. SITEMAP — har bir `<loc>` haqiqatan 200 qaytaradimi (1900+ URL,
 *      parallel; soft-404 ham ushlanadi, chunki status ko'riladi)
 *   2. NA'MUNAVIY SAHIFALAR — barcha `href`/`src`:
 *        · ichki havola  → 200 (308/301 → keyingi status)
 *        · `href="#"`, bo'sh href → XATO (joy tutgich havola)
 *        · `#fragment`   → shu sahifada `id` borligi tekshiriladi
 *        · `tel:`/`mailto:` → format to'g'riligi
 *        · tashqi http(s) → `target="_blank"` bo'lsa `rel="noopener"` shart
 *        · `<img src>` va og:image → haqiqatan yuklanadi (200)
 *   3. O'LIK ANKER — `href="#…" ` maqsadi yo'q bo'lsa XATO
 *
 * Ishlatish:  npm run audit:links            # http://127.0.0.1:3000
 *             BASE_URL=https://sayt.uz npm run audit:links
 *             npm run audit:links -- --quick # sitemap o'tkaziladi
 *
 * Xato bo'lsa exit 1 → CI'ga tayyor.
 */

const BASE = (process.env.BASE_URL ?? 'http://127.0.0.1:3000').replace(/\/+$/, '');
const QUICK = process.argv.includes('--quick');
const CONCURRENCY = Number(process.env.CRAWL_CONCURRENCY ?? 12);

const C = { r: '\x1b[31m', y: '\x1b[33m', g: '\x1b[32m', b: '\x1b[1m', d: '\x1b[2m', x: '\x1b[0m' };
const plain = !process.stdout.isTTY;
const c = (color, s) => (plain ? s : `${color}${s}${C.x}`);

/* ------------------------------------------------------------ */

const errors = [];
const warnings = [];
const statusCache = new Map();

async function statusOf(path, redirect = 'manual') {
  const key = `${path}|${redirect}`;
  if (statusCache.has(key)) return statusCache.get(key);
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  let out;
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 20_000);
    const res = await fetch(url, { redirect, signal: ctl.signal, headers: { accept: 'text/html,*/*' } });
    clearTimeout(timer);
    out = res.status;
    try {
      await res.body?.cancel();
    } catch {
      /* e'tiborsiz */
    }
  } catch (e) {
    out = `ERR:${e.name}`;
  }
  statusCache.set(key, out);
  return out;
}

/** 308/301 bo'lsa — oxirgi manzilgacha borib statusni qaytaradi */
async function finalStatus(path) {
  let cur = path;
  for (let i = 0; i < 5; i += 1) {
    const s = await statusOf(cur);
    if (s === 301 || s === 302 || s === 307 || s === 308) {
      const url = cur.startsWith('http') ? cur : `${BASE}${cur}`;
      const res = await fetch(url, { redirect: 'manual' }).catch(() => null);
      const loc = res?.headers?.get('location');
      try {
        await res?.body?.cancel();
      } catch {
        /* e'tiborsiz */
      }
      if (!loc) return s;
      cur = loc.startsWith('http') ? loc : `${new URL(url).origin}${loc}`;
      continue;
    }
    return s;
  }
  return 599;
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i;
      i += 1;
      out[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return out;
}

/* ------------------------------------------------------------
   1. SITEMAP
   ------------------------------------------------------------ */

async function auditSitemap() {
  const smUrl = `${BASE}/sitemap.xml`;
  const res = await fetch(smUrl).catch(() => null);
  if (!res || res.status !== 200) {
    errors.push(`sitemap.xml yuklanmadi (${res ? res.status : 'ulanish yo‘q'}) — ${smUrl}`);
    return;
  }
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].trim());
  if (!locs.length) {
    errors.push('sitemap.xml bo\'sh — bitta ham <loc> yo\'q');
    return;
  }

  const origin = new URL(BASE).origin;
  const bad = [];
  let done = 0;
  process.stdout.write(c(C.d, `  sitemap: ${locs.length} URL tekshirilmoqda (${CONCURRENCY} parallel)...`));

  // Sitemap NEXT_PUBLIC_SITE_URL bilan quriladi; audit esa BASE_URL ga boradi.
  // Domen farq qilsa (www/apex, lokal run + production build) URL'lar
  // tashlab yuborilmaydi — yo'li BASE ga ko'chiriladi (aks holda 0 ta URL
  // tekshirilib "barchasi 200" deyilardi).
  let foreign = 0;
  await mapLimit(locs, CONCURRENCY, async (loc) => {
    let path = loc;
    try {
      const u = new URL(loc, BASE);
      if (u.origin !== origin) foreign += 1;
      path = `${u.pathname}${u.search}` || '/';
    } catch {
      /* nisbiy yo'l — o'zi qoladi */
    }
    const s = await finalStatus(path);
    done += 1;
    if (done % 250 === 0) process.stdout.write(` ${done}`);
    if (s !== 200) bad.push({ loc: path, status: s });
  });

  process.stdout.write(` ${done}\n`);
  if (foreign) {
    warnings.push(
      `sitemap'dagi ${foreign} ta URL boshqa domenda (${new URL(locs[0]).origin}) — yo'llari ${origin} da tekshirildi. NEXT_PUBLIC_SITE_URL ni tekshiring.`,
    );
  }

  if (bad.length) {
    for (const b of bad.slice(0, 12)) errors.push(`sitemap'dagi URL ${b.status} qaytardi: ${b.loc}`);
    if (bad.length > 12) errors.push(`... va yana ${bad.length - 12} ta sitemap URL'i 200 emas`);
  } else {
    console.log(c(C.g, `  ✔ sitemap: ${locs.length} URL — barchasi 200`));
  }

  // robots.txt
  const rob = await statusOf('/robots.txt');
  if (rob !== 200) errors.push(`robots.txt ${rob} qaytardi`);
  else console.log(c(C.g, '  ✔ robots.txt 200'));

  // manifest
  const man = await statusOf('/manifest.webmanifest');
  if (man !== 200) warnings.push(`manifest.webmanifest ${man} qaytardi (PWA uchun ixtiyoriy)`);
  else console.log(c(C.g, '  ✔ manifest.webmanifest 200'));
}

/* ------------------------------------------------------------
   2. NA'MUNAVIY SAHIFALAR — havola/asset tahlili
   ------------------------------------------------------------ */

/** Har xil shablonni qamrab oladigan sahifalar (3 til where relevant) */
const PAGES = [
  '/uz',
  '/ru',
  '/en',
  '/uz/catalog',
  '/ru/catalog',
  '/uz/catalog/vanilla-premium',
  '/en/catalog/vanilla-premium',
  '/uz/samples',
  '/uz/industries',
  '/uz/industries/bakery',
  '/uz/about',
  '/ru/about',
  '/uz/contact',
  '/uz/quote',
  '/uz/privacy',
  '/uz/terms',
  '/uz/search?q=vanil',
  '/uz/umuman-yoq-sahifa',
];

const EMAIL_RE = /^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i;

function decodeEnt(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

async function auditPage(path) {
  const url = `${BASE}${path}`;
  const res = await fetch(url).catch(() => null);
  if (!res) {
    errors.push(`${path} — server javob bermadi`);
    return;
  }
  const status = res.status;
  const html = await res.text();
  const is404 = status === 404;

  // sahifadagi barcha id'lar (anker tekshiruvi uchun)
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

  const tags = [...html.matchAll(/<a\s[^>]*>/gi)].map((m) => m[0]);
  const imgs = [...html.matchAll(/<img\s[^>]*>/gi)].map((m) => m[0]);

  const checkedInternal = new Set();

  for (const tag of tags) {
    const hrefMatch = tag.match(/\shref\s*=\s*"([^"]*)"/i);
    const href = hrefMatch ? decodeEnt(hrefMatch[1]) : null;
    const target = /\starget\s*=\s*"_blank"/i.test(tag);
    const rel = (tag.match(/\srel\s*=\s*"([^"]*)"/i) ?? [, ''])[1];

    if (hrefMatch === null) continue; // href'siz <a> — kam uchraydi

    if (href === '' || href === '#') {
      errors.push(`${path} — joy tutgich havola: href="${href}"`);
      continue;
    }

    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (id && !ids.has(id) && id !== 'top') {
        errors.push(`${path} — o'lik anker: ${href} (sahifada id="${id}" yo'q)`);
      }
      continue;
    }

    if (href.startsWith('tel:')) {
      const digits = href.slice(4).replace(/[^\d+]/g, '');
      if (digits.replace(/\D/g, '').length < 9) errors.push(`${path} — yaroqsiz tel: ${href}`);
      continue;
    }

    if (href.startsWith('mailto:')) {
      const addr = href.slice(7).split('?')[0];
      if (!EMAIL_RE.test(addr)) errors.push(`${path} — yaroqsiz mailto: ${href}`);
      continue;
    }

    if (/^(https?:)?\/\//i.test(href) || /^[a-z]+:/i.test(href)) {
      // tashqi havola — fetch qilinmaydi (internet cheklangan), faqat xavfsizlik
      if (target && !/noopener|noreferrer/i.test(rel)) {
        errors.push(`${path} — tashqi havolada rel="noopener" yo'q: ${href}`);
      }
      continue;
    }

    // Nisbiy havola: `?page=2` (joriy yo'lga nisbatan) yoki `images/x.jpg`
    // — haqiqiy URL, shuning uchun mutlaq yo'lga aylantirib tekshiramiz.
    const absolute = href.startsWith('/')
      ? href
      : new URL(href, url).toString().replace(new URL(BASE).origin, '');

    if (absolute.startsWith('/')) {
      if (checkedInternal.has(absolute)) continue;
      checkedInternal.add(absolute);
      const s = await finalStatus(absolute);
      // 404 sahifasining o'zidagi havolalar ham haqiqiy bo'lishi kerak
      if (s !== 200) {
        // /styleguide production'da qasddan yopiq
        if (absolute.startsWith('/styleguide')) continue;
        errors.push(`${path} — ichki havola ${s} qaytardi: ${absolute}`);
      }
      continue;
    }

    warnings.push(`${path} — kutilmagan href formati: ${href}`);
  }

  // rasmlar
  let imgCount = 0;
  for (const tag of imgs) {
    const srcMatch = tag.match(/\ssrc\s*=\s*"([^"]*)"/i);
    if (!srcMatch) {
      // next/image ba'zan srcset bilan keladi — lekin src majburiy
      warnings.push(`${path} — <img> da src yo'q`);
      continue;
    }
    const src = decodeEnt(srcMatch[1]);
    if (!src || src.startsWith('data:')) continue;
    imgCount += 1;
    if (src.startsWith('/')) {
      const s = await statusOf(src);
      if (s !== 200) errors.push(`${path} — rasm ${s} qaytardi: ${src}`);
    }
    // alt majburiy (§14.1) — audit:seo ham tekshiradi, bu yerda ham
    if (!/\salt\s*=\s*"/i.test(tag)) errors.push(`${path} — <img> da alt yo'q: ${src}`);
  }

  // og:image haqiqatan yuklanadimi
  const og = html.match(/property="og:image"\s+content="([^"]+)"/i) ?? html.match(/content="([^"]+)"\s+property="og:image"/i);
  if (og) {
    const ogUrl = decodeEnt(og[1]);
    const s = ogUrl.startsWith('/') ? await statusOf(ogUrl) : await finalStatus(ogUrl);
    if (s !== 200) errors.push(`${path} — og:image ${s} qaytardi: ${ogUrl}`);
  }

  if (is404) {
    if (!/<h1/i.test(html)) errors.push(`${path} — 404 sahifasida <h1> yo'q`);
    console.log(c(C.y, `  ✓ ${path} — 404 (kutilgan), ${tags.length} havola, ${imgCount} rasm`));
    return;
  }
  if (status !== 200) {
    errors.push(`${path} — ${status} qaytardi (200 kutilgan)`);
    return;
  }
  console.log(
    c(C.g, `  ✓ ${path}`) +
      c(C.d, ` — ${tags.length} havola · ${checkedInternal.size} ichki tekshirildi · ${imgCount} rasm`),
  );
}

/* ------------------------------------------------------------ */

console.log(`\n${c(C.b, "O'LIK HAVOLA / ASSET AUDITI")} ${c(C.d, BASE)}\n`);

const alive = await statusOf('/uz');
if (alive === 'ERR:AbortError' || typeof alive === 'string') {
  console.error(c(C.r, `  ✖ Server javob bermadi (${BASE}). Ishga tushiring: npm run build && npm start`));
  console.error(c(C.d, '     yoki BASE_URL=https://sayt.uz npm run audit:links\n'));
  process.exit(1);
}

if (!QUICK) {
  console.log(c(C.b, '1) Sitemap va texnik fayllar'));
  await auditSitemap();
  console.log();
}

console.log(c(C.b, `2) Sahifalar (${PAGES.length}) — havola, anker, rasm, og:image`));
for (const p of PAGES) {
  // eslint-disable-next-line no-await-in-loop
  await auditPage(p);
}

console.log();
if (warnings.length) {
  console.log(c(C.y, `⚠ Ogohlantirishlar (${warnings.length}):`));
  for (const w of [...new Set(warnings)].slice(0, 15)) console.log(`    ${w}`);
  console.log();
}

if (errors.length) {
  console.log(c(C.r, `✖ XATOLAR (${errors.length}):`));
  for (const e of [...new Set(errors)].slice(0, 40)) console.log(`    ${e}`);
  console.log(c(C.r, `\n✖ O'lik havola/asset auditi YIQILDI (${errors.length} xato)\n`));
  process.exit(1);
}

console.log(
  c(C.g, `✔ O'lik havola yo'q — ${statusCache.size} ta URL tekshirildi, ${warnings.length} ta ogohlantirish\n`),
);
