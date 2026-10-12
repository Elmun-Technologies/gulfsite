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

/* ---------------- muhit diagnostikasi ----------------
   CI log'larini o'qish har doim ham mumkin emas (artefakt/log host'lari
   bloklangan bo'lishi mumkin), shuning uchun muhim ma'lumotni shu yerga
   ham yozamiz: `.lighthouse/diagnostics.txt` artefakt bilan birga chiqadi. */

function ver(bin, args) {
  const r = spawnSync(bin, args, { encoding: 'utf8', timeout: 30_000 });
  return ((r.stdout ?? '') + (r.stderr ?? '')).trim().split('\n')[0] ?? `exit ${r.status}`;
}

const DIAG = [
  `sana            : ${new Date().toISOString()}`,
  `form-factor     : ${formFactor}${WANT_ALL ? ' (--all)' : ''}`,
  `BASE            : ${BASE}`,
  `node            : ${process.version}`,
  `chrome path     : ${CHROME}`,
  `chrome --version: ${ver(CHROME, ['--version'])}`,
  `lighthouse      : ${ver(LH_BIN, ['--version'])}`,
  `platform        : ${process.platform} ${process.arch}`,
  `ci              : ${CI ? 'ha' : "yo'q"}`,
].join('\n');
console.log(`\n${DIAG}\n`);
writeFileSync(join(OUT_DIR, 'diagnostics.txt'), DIAG + '\n', 'utf8');

/* Nega flag'lar shunday:
   - `--headless` BERMAYMIZ: Lighthouse'ning chrome-launcher'i sukut bo'yicha
     headless ishga tushiradi. `--headless=new` ni qo'lda berish yangi Chrome
     versiyalarida launch'ni buzishi mumkin (CI'da 6 sahifa × ~11s dan keyin
     hisobot umuman yozilmagan holat shundan bo'lgan).
   - `--no-sandbox --disable-dev-shm-usage` CI konteynerida MAJBURIY.
   - desktop uchun FAQAT `--preset=desktop`: uni `--form-factor=desktop` bilan
     birga berish flag konfliktini beradi (LH darhol xato qaytaradi). */
const BASE_FLAGS = '--no-sandbox --disable-dev-shm-usage --disable-gpu';
const RETRY_FLAGS = '--headless --no-sandbox --disable-dev-shm-usage --disable-gpu';

function lhArgsFor(url, jsonPath) {
  const a = [
    url,
    '--quiet',
    '--output=json',
    `--output-path=${jsonPath}`,
    '--only-categories=performance,accessibility,seo,best-practices',
    '--throttling-method=simulate',
    '--max-wait-for-load=45000',
  ];
  if (DESKTOP) a.push('--preset=desktop');
  else a.push('--form-factor=mobile');
  return a;
}

function runLh(args, flags) {
  return spawnSync(LH_BIN, [...args, `--chrome-flags=${flags}`], {
    encoding: 'utf8',
    env: { ...process.env, CHROME_PATH: CHROME },
    timeout: 180_000,
  });
}

console.log(`Mezonlar (§0/§14.5): Perf ≥ ${BUDGET.performance} · A11y ≥ ${BUDGET.accessibility} · SEO = ${BUDGET.seo}\n`);

const results = [];
let failed = 0;
const diagLog = [];

try {
  for (const [label, path] of PAGES) {
    const url = `${BASE}${path}`;
    const slug = path.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '') || 'home';
    const jsonPath = join(OUT_DIR, `${formFactor}-${slug}.json`);
    const args = lhArgsFor(url, jsonPath);

    let run = runLh(args, BASE_FLAGS);

    if (!existsSync(jsonPath)) {
      // Bir marta boshqa Chrome flag'lari bilan qayta urinish (masalan headless
      // rejimni launcher topa olmagan bo'lsa) va XATONI TO'LIQ log'lash.
      const firstOut = [run.stdout ?? '', run.stderr ?? ''].filter(Boolean).join('\n');
      diagLog.push(`--- ${label} ${path} (1-urinish, exit ${run.status}) ---\n${firstOut.split('\n').slice(-25).join('\n')}`);
      run = runLh(args, RETRY_FLAGS);
    }

    if (!existsSync(jsonPath)) {
      const out = [run.stdout ?? '', run.stderr ?? ''].filter(Boolean).join('\n');
      diagLog.push(`--- ${label} ${path} (2-urinish, exit ${run.status}) ---\n${out.split('\n').slice(-25).join('\n')}`);
      const tail = out.split('\n').filter(Boolean).slice(-6);
      console.log(`  ✖ ${label.padEnd(14)} ${path} — hisobot yozilmadi (exit ${run.status}${run.error ? `, ${run.error.code ?? run.error.message}` : ''})`);
      for (const l of tail) console.log(`      ${l.slice(0, 190)}`);
      failed += 1;
      results.push({ label, path, error: true });
      continue;
    }

    const report = JSON.parse(readFileSync(jsonPath, 'utf8'));
    if (report.runtimeError) {
      diagLog.push(`--- ${label} ${path} runtimeError --- ${report.runtimeError.code}: ${report.runtimeError.message}`);
    }
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
      runtimeError: report.runtimeError?.code,
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
    if (row.runtimeError) marks.push(`runtimeError: ${row.runtimeError}`);

    const icon = marks.some((m) => !m.includes('ogohlantirish')) ? '✖' : marks.length ? '⚠' : '✓';
    console.log(
      `  ${icon} ${label.padEnd(14)} P:${String(row.performance).padStart(3)} A:${String(row.accessibility).padStart(3)} ` +
        `S:${String(row.seo).padStart(3)} BP:${String(row['best-practices']).padStart(3)}  ` +
        `LCP ${row.lcp} · CLS ${row.cls} · TBT ${row.tbt}` +
        (marks.length ? `\n      ${marks.join(' · ')}` : ''),
    );

    /* ---- Mezon bajarilmasa: ANIQ audit ro'yxati ----
       Nega kerak: CI log'ini o'qib bo'lmaganda ham annotation orqali
       "qaysi audit yiqildi, qaysi elementda" ko'rinadi. Taxmin bilan
       tuzatishdan ko'ra bitta qator ma'lumot arzonroq. */
    if (marks.length) {
      const lines = [];
      for (const cat of ['accessibility', 'seo', 'best-practices']) {
        const refs = report.categories?.[cat]?.auditRefs ?? [];
        const bad = refs
          .map((r) => report.audits?.[r.id])
          .filter((a) => a && a.score !== null && a.score < 1)
          .map((a) => {
            const items = a.details?.items ?? [];
            const node = items[0]?.node?.snippet ?? items[0]?.node?.selector?.join(' ') ?? '';
            return `${a.id}${items.length ? `[${items.length}]` : ''}${node ? ` → ${String(node).slice(0, 100)}` : ''}`;
          });
        if (bad.length) lines.push(`      ${cat}: ${bad.join(' · ')}`);
      }
      const opps = Object.values(report.audits ?? {})
        .filter((a) => a.details?.type === 'opportunity' && (a.details.overallSavingsMs ?? 0) > 0)
        .sort((x, y) => y.details.overallSavingsMs - x.details.overallSavingsMs)
        .slice(0, 6)
        .map((a) => `${a.id} ≈${Math.round(a.details.overallSavingsMs)}ms`);
      if (opps.length) lines.push(`      imkoniyatlar: ${opps.join(' · ')}`);
      const lcpNode =
        report.audits?.['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet ?? '';
      if (lcpNode) lines.push(`      LCP element: ${String(lcpNode).slice(0, 150)}`);
      const tbt = report.audits?.['total-blocking-time'];
      const longTasks = report.audits?.['bootup-time']?.details?.items?.[0];
      if (longTasks) lines.push(`      eng ko'p JS vaqti: ${longTasks.url?.slice(-60)} ≈${Math.round(longTasks.total)}ms`);
      for (const l of lines) console.log(l);
      diagLog.push(`### ${label} ${path}\n${lines.join('\n')}`);
    }
  }
} catch (err) {
  // Kutilmagan xato bo'lsa ham xulosa va diagnostika YOZILSIN — aks holda
  // CI'da "nima bo'ldi" ni umuman ko'rib bo'lmaydi.
  diagLog.push(`--- KUTILMAGAN XATO ---\n${err?.stack ?? err}`);
  console.error(`\n✖ Kutilmagan xato: ${err?.message ?? err}\n`);
  failed += 1;
}

writeFileSync(join(OUT_DIR, `diagnostics-${formFactor}.log`), diagLog.join('\n\n') + '\n', 'utf8');

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
