#!/usr/bin/env node
/**
 * IndexNow — Bing, Yandex, Seznam, Naver va boshqalarga URL'larni darhol yuborish.
 * Nega: ChatGPT qidiruvi asosan Bing indeksiga tayanadi; IndexNow yangi/yangilangan
 * sahifalarni (blog, katalog) kunlar emas, daqiqalarda indeksga yetkazadi.
 *
 * Kalit OCHIQ bo'lishi kerak (protokol talabi): public/<KEY>.txt — sir emas.
 *
 *   node scripts/indexnow.mjs                 # sitemap'dagi barcha URL
 *   node scripts/indexnow.mjs --only blog     # faqat yo'lida "blog" bo'lganlar
 *   node scripts/indexnow.mjs <url> <url> …   # aniq URL'lar
 *   SITE=https://gulfflavours.uz DRY_RUN=1 node scripts/indexnow.mjs
 */

const SITE = (process.env.SITE ?? 'https://gulfflavours.uz').replace(/\/$/, '');
const KEY = process.env.INDEXNOW_KEY ?? '9885c5e4ec2d0432f3cae5559a979e3d';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const BATCH = 10000; // protokol limiti

const args = process.argv.slice(2);
const onlyIdx = args.indexOf('--only');
const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
const explicit = args.filter((a, i) => a.startsWith('http') && i !== onlyIdx + 1);

async function sitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  // Kalit fayli haqiqatan jonli saytda bormi (deploy tugamagan bo'lsa — to'xtaymiz)
  const k = await fetch(`${SITE}/${KEY}.txt`);
  const body = k.ok ? (await k.text()).trim() : '';
  if (body !== KEY) {
    console.error(`✗ ${SITE}/${KEY}.txt topilmadi yoki mos emas (status ${k.status}) — deploy tugaganmi?`);
    process.exit(1);
  }

  let urls = explicit.length ? explicit : await sitemapUrls();
  if (only) urls = urls.filter((u) => u.includes(only));
  const host = new URL(SITE).host;
  urls = [...new Set(urls)].filter((u) => new URL(u).host === host);
  console.log(`IndexNow: ${urls.length} ta URL (${host})`);
  if (!urls.length || process.env.DRY_RUN) return;

  for (let i = 0; i < urls.length; i += BATCH) {
    const urlList = urls.slice(i, i + BATCH);
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
    });
    // 200 = qabul qilindi, 202 = kalit tekshiruvi kutilmoqda
    console.log(`  partiya ${i / BATCH + 1}: HTTP ${res.status}`);
    if (res.status >= 400) {
      console.error(await res.text());
      process.exit(1);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
