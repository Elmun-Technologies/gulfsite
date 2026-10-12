#!/usr/bin/env node
/**
 * LIGHTHOUSE O'LCHOVI — `npm run lighthouse`
 * ----------------------------------------------------------------
 * Brief §0/§14.5 mezonlari:
 *   Performance ≥ 90 (mobile) · Accessibility ≥ 95 · SEO = 100
 *
 * Nima uchun skript: sandbox'da Chrome yo'q, lekin GitHub Actions
 * runner'larida bor — shuning uchun `.github/workflows/ci.yml` bu skriptni
 * ishga tushiradi va hisobotni artefakt sifatida saqlaydi. Lokal ham
 * ishlaydi, agar Chrome o'rnatilgan bo'lsa.
 *
 * Ishlatish:
 *   npm run lighthouse                  # 6 ta asosiy sahifa (mobile)
 *   npm run lighthouse -- --all         # 9 ta sahifa
 *   npm run lighthouse -- --desktop     # desktop emulyatsiyasi
 *   npm run lighthouse -- --require     # Chrome topilmasa exit 2 emas, XATO
 *   BASE_URL=https://sayt.uz npm run lighthouse
 *
 * Exit: 0 — mezonlar bajarildi · 1 — biror baho past · 2 — Chrome yo'q (skip)
 */

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, '.lighthouse');

const BASE = (process.env.BASE_URL ?? 'http://127.0.0.1:3000').replace(/\/+$/, '');
const args = process.argv.slice(2);
const WANT_ALL = args.includes('--all');
const DESKTOP = args.includes('--desktop');
const REQUIRE = args.includes('--require');
const CI = args.includes('--ci') || Boolean(process.env.CI);

/** §0 / §14.5 — qabul mezonlari */
const BUDGET = { performance: 90, accessibility: 95, seo: 100 };
const WARN_BUDGET = { 'best-practices': 90 };

const CORE_PAGES = [
  ['Bosh sahifa', '/uz'],
  ['Katalog', '/uz/catalog'],
  ['Mahsulot', '/uz/catalog/vanilla-premium'],
  ['Namunalar', '/uz/samples'],
  ['Sohalar', '/uz/industries'],
  ['Aloqa', '/uz/contact'],
];
const EXTRA_PAGES = [
  ['Kompaniya', '/uz/about'],
  ['RFQ', '/uz/quote'],
  ['Soha detali', '/uz/industries/bakery'],
];
const PAGES = WANT_ALL ? [...CORE_PAGES, ...EXTRA_PAGES] : CORE_PAGES;

/* ---------------- Chrome izlash ---------------- */

const CANDIDATES = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/snap/bin/chromium',
  '/opt/google/chrome/chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  join(homedir(), '.cache/puppeteer/chrome'),
].filter(Boolean);

function findChrome() {
  for (const c of CANDIDATES) {
    if (!existsSync(c)) continue;
    let st;
    try {
      st = statSync(c);
    } catch {
      continue;
    }
    if (st.isFile()) return c;
    if (st.isDirectory()) {
      // puppeteer/Chrome-for-Testing keshi — ichidan binary topamiz
      const found = findInCache(c);
      if (found) return found;
    }
  }
  // PATH'dan
  const which = spawnSync('which', ['google-chrome', 'chromium', 'chromium-browser'], { encoding: 'utf8' });
  const line = (which.stdout ?? '').split('\n').find(Boolean);
  return line ?? null;
}

/** Puppeteer/Chrome-for-Testing keshidan binary izlash (chuqurlik ≤ 5) */
function findInCache(dir, depth = 0) {
  if (depth > 5) return null;
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return null;
  }
  for (const name of entries.sort().reverse()) {
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isFile() && /^(chrome|chrome-headless-shell)$/.test(name)) return full;
    if (st.isDirectory()) {
      const found = findInCache(full, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

const CHROME = findChrome();
if (!CHROME) {
  console.log('\n⚠ Chrome/Chromium topilmadi — Lighthouse o\'tkazib yuborildi.');
  console.log('  Bu sandbox\'da brauzer yo\'q; o\'lchov CI\'da bajariladi:');
  console.log('    .github/workflows/ci.yml → "Lighthouse (mobile)" bosqichi');
  console.log('  Lokal o\'lchash uchun Chrome o\'rnating yoki CHROME_PATH bering:');
  console.log('    CHROME_PATH=/usr/bin/google-chrome npm run lighthouse\n');
  process.exit(REQUIRE || CI ? 1 : 2);
}

/* ---------------- sayt tirikmi ---------------- */

const probe = spawnSync('node', ['-e', `fetch(${JSON.stringify(BASE + '/uz')}).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))`], {
  encoding: 'utf8',
});
if (probe.status !== 0) {
  console.error(`\n✖ Server javob bermadi: ${BASE}`);
  console.error('  Avval ishga tushiring:  npm run build && npm start\n');
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

const LH_BIN = join(ROOT, 'node_modules', '.bin', 'lighthouse');
const formFactor = DESKTOP ? 'desktop' : 'mobile';

console.log(`\nLighthouse ${formFactor} · ${BASE} · Chrome: ${CHROME}`);
console.log(`Mezonlar (§0/§14.5): Perf ≥ ${BUDGET.performance} · A11y ≥ ${BUDGET.accessibility} · SEO = ${BUDGET.seo}\n`);

const results = [];
let failed = 0;

for (const [label, path] of PAGES) {
  const url = `${BASE}${path}`;
  const slug = path.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '') || 'home';
  const jsonPath = join(OUT_DIR, `${formFactor}-${slug}.json`);

  const lhArgs = [
    url,
    '--quiet',
    '--output=json',
    `--output-path=${jsonPath}`,
    '--only-categories=performance,accessibility,seo,best-practices',
    `--form-factor=${formFactor}`,
    '--screenEmulation.mobile',
    '--throttling-method=simulate',
    '--max-wait-for-load=60000',
    `--chrome-flags=--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage`,
  ];
  if (DESKTOP) lhArgs.push('--preset=desktop');

  const run = spawnSync(LH_BIN, lhArgs, {
    encoding: 'utf8',
    env: { ...process.env, CHROME_PATH: CHROME },
    timeout: 180_000,
  });

  if (!existsSync(jsonPath)) {
    console.log(`  ✖ ${label.padEnd(14)} ${path} — hisobot yozilmadi`);
    if (run.stderr) console.log(`      ${(run.stderr.split('\n').find(Boolean) ?? '').slice(0, 160)}`);
    failed += 1;
    results.push({ label, path, error: true });
    continue;
  }

  const report = JSON.parse(readFileSync(jsonPath, 'utf8'));
  const score = (id) => Math.round((report.categories?.[id]?.score ?? 0) * 100);
  const row = {
    label,
    path,
    performance: score('performance'),
    accessibility: score('accessibility'),
    seo: score('seo'),
    'best-practices': score('best-practices'),
    lcp: report.audits?.['largest-contentful-paint']?.displayValue ?? '—',
    cls: report.audits?.['cumulative-layout-shift']?.displayValue ?? '—',
    tbt: report.audits?.['total-blocking-time']?.displayValue ?? '—',
    fcp: report.audits?.['first-contentful-paint']?.displayValue ?? '—',
  };
  results.push(row);

  const marks = [];
  for (const [cat, min] of Object.entries(BUDGET)) {
    if (row[cat] < min) {
      marks.push(`${cat} ${row[cat]} < ${min}`);
      failed += 1;
    }
  }
  for (const [cat, min] of Object.entries(WARN_BUDGET)) {
    if (row[cat] < min) marks.push(`${cat} ${row[cat]} < ${min} (ogohlantirish)`);
  }

  const icon = marks.some((m) => !m.includes('ogohlantirish')) ? '✖' : marks.length ? '⚠' : '✓';
  console.log(
    `  ${icon} ${label.padEnd(14)} P:${String(row.performance).padStart(3)} A:${String(row.accessibility).padStart(3)} ` +
      `S:${String(row.seo).padStart(3)} BP:${String(row['best-practices']).padStart(3)}  ` +
      `LCP ${row.lcp} · CLS ${row.cls} · TBT ${row.tbt}` +
      (marks.length ? `\n      ${marks.join(' · ')}` : ''),
  );
}

/* ---------------- markdown xulosa (CI summary uchun) ---------------- */

const md = [
  `# Lighthouse — ${formFactor}`,
  '',
  `Mezonlar: **Perf ≥ ${BUDGET.performance} · A11y ≥ ${BUDGET.accessibility} · SEO = ${BUDGET.seo}** (§0/§14.5)`,
  '',
  '| Sahifa | Perf | A11y | SEO | BP | LCP | CLS | TBT |',
  '| --- | --- | --- | --- | --- | --- | --- | --- |',
  ...results.map((r) =>
    r.error
      ? `| ${r.label} \`${r.path}\` | — | — | — | — | — | — | — |`
      : `| ${r.label} \`${r.path}\` | ${r.performance} | ${r.accessibility} | ${r.seo} | ${r['best-practices']} | ${r.lcp} | ${r.cls} | ${r.tbt} |`,
  ),
  '',
  failed ? `**Natija: ${failed} ta mezon bajarilmadi.**` : '**Natija: barcha mezonlar bajarildi.**',
  '',
].join('\n');

writeFileSync(join(OUT_DIR, `summary-${formFactor}.md`), md, 'utf8');
if (process.env.GITHUB_STEP_SUMMARY) {
  writeFileSync(process.env.GITHUB_STEP_SUMMARY, md, { flag: 'a' });
}

console.log(`\nHisobotlar: .lighthouse/ (${results.filter((r) => !r.error).length} ta JSON + summary-${formFactor}.md)`);

if (failed) {
  console.log(`\n✖ ${failed} ta mezon bajarilmadi.\n`);
  process.exit(1);
}
console.log('\n✔ Lighthouse mezonlari bajarildi.\n');
