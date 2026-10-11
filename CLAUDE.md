# CLAUDE.md — GFF Uzbekistan sayti

Bu fayl loyiha bilan ishlaydigan agent/ishlab chiquvchi uchun **yagona kirish nuqtasi**.
Har bir bosqichdan keyin yangilanadi (§2 talabi).

> Vazifalar brief'i: `GFF_CLAUDE_CODE_PROMPT.md` (§0–§17). Dizayn haqiqati:
> `design/Styleguide.dc.html` va `design/*.dc.html` (26 fayl; `*.mobile.dc.html`
> fayllari stub — mobil qiymatlar desktop fayllardagi `clamp()` larda).

---

## 1. Loyiha nima

**Gulf Flavours & Fragrances FZCO** (Dubay, JAFZA) ning O'zbekistondagi rasmiy va
yagona distribyutori uchun **B2B lead-generation sayti**.

- Katalog: **617 pozitsiya** (aromatizatorlar, atir kompozitsiyalari, efir moylari,
  aroma kimyosi, oziq-ovqat ingrediyentlari, komoditi) — `src/data/catalog.json`.
- Narxlar **e'lon qilinmaydi** (B2B): har bir so'rov bo'yicha hisoblanadi.
- Asosiy konversiya: **"Bepul namuna qutisi"** (8 tagacha namuna, 25/50/100 g,
  3 ish kuni). Ikkilamchi: narx so'rash (RFQ), qo'ng'iroq, Telegram.
- Tillar: **UZ** (standart, `/uz`), **RU** (`/ru`), **EN** (`/en`).

---

## 2. Buyruqlar

```bash
npm run dev            # 0.0.0.0:3000 (Turbopack)
npm run build          # prepare:assets (shrift + dizayn assetlari + katalog) → next build
npm start              # standalone server (scripts/start.mjs .next/static + public nusxalaydi)
npm run typecheck      # tsc --noEmit  ← har o'zgarishdan keyin MAJBURIY
npm run lint           # eslint .
npm test               # placeholder nazorati: lug'at + kod chaqiruvlari + RENDER HTML
npm run test:i18n      # xuddi shu, lekin offline (--static, serversiz)
npm run assets:design  # design/assets → public/images (optimallashtirish bilan)
npm run catalog:build  # manba JSON'lar → src/data/catalog.json
npm run audit:seo      # SEO/A11y auditi (ISHLAYOTGAN server kerak; BASE_URL=… mumkin)
npm run i18n:export    # RU/EN review CSV'larini yangilash (docs/*.csv)
```

**MUHIM diagnostika:**

```bash
# Build "Invalid segment configuration export" bersa — Next xato faylni
# ko'rsatmaydi. Sabab: Next uni faqat NEXT_COMPILER_NAME=server bo'lganda log'laydi.
NEXT_COMPILER_NAME=server npm run build
```

`node_modules` snapshot'ga tushmaydi (workspace qoidasi) — har sessiyada
`npm install --no-audit --no-fund && node scripts/copy-fonts.mjs` kerak bo'lishi mumkin.
`npx tsc` ISHLATILMAYDI (repo tashqarisida boshqa `tsc@2` paketini tortadi):
`node node_modules/typescript/bin/tsc --noEmit`.

---

## 3. Arxitektura xaritasi

```
src/
  app/
    layout.tsx                    # PASS-THROUGH ildiz (html/body yo'q)
    not-found.tsx                 # ILDIZ 404 — to'liq sayt qobig'i bilan (pastda izoh)
    styleguide/page.tsx           # DEV-ONLY dizayn tizimi (§10) — production'da notFound()
    sitemap.ts  robots.ts  manifest.ts
    [locale]/
      layout.tsx                  # haqiqiy <html lang>/<body> + provider'lar
      error.tsx                   # xato chegarasi (matn lug'atda)
      not-found.tsx               # sahifa ichidagi notFound() uchun
      (site)/                     # Header + Footer + cookie qobig'i
        page.tsx                  # Bosh sahifa
        catalog/page.tsx          # Katalog (filtr, saralash, sahifalash)
        catalog/[slug]/page.tsx   # MAHSULOT (kanonik URL)
        product/[slug]/page.tsx   # eski URL → 301 /catalog/<slug>
        samples/ industries/ industries/[slug]/ about/ contact/
        quote/ search/ privacy/ terms/
      (admin)/admin/…             # lead pipeline (ESKI dizayn tokenlarida — §6)
    api/leads/route.ts            # zod → antispam → Telegram → data/leads/*.json
  components/
    ui/        Button Pill Tabs SectionHeader PageHead Faq MonogramPanel Overlay LegacyButton
    motion/    Reveal SplitLines CountUp MonogramCycle MonogramStatic FlyToBox
    layout/    Header MobileMenu LocaleSwitcher Footer FooterContact CookieConsent
               Analytics StickyCta ContactLinks NotFoundContent NotFoundSearch NotFoundView
    catalog/   CatalogExplorer FacetGroup AddSampleButton
    product/   ProductGallery ProductInfoPanel ProductStickyBar
    sample/    SampleBoxProvider SampleBoxEditor SamplesFormBridge
    industry/  IndustryProducts IndustrySetButton
    lead/      GffLeadForm
    legal/     LegalPage          # privacy + terms uchun umumiy ko'rinish
    search/    SearchInput
    home/      Hero sections.tsx
  i18n/
    meta.ts                       # KLIENT UCHUN XAVFSIZ (lug'atsiz) — §4.3
    uz.ts ru.ts en.ts             # ~1055 kalit × 3 til
    translator.ts                 # fillVars / makeTranslator / pluralIndex
    index.ts                      # SERVER API: getDictionary, makeT, Translator
  lib/
    config.ts taxonomy.ts catalog.ts design.ts design-client.ts legal.ts
    seo.ts analytics.ts nav.ts search.ts industry-copy.ts leads/{schema,antispam,store}.ts
    motion.ts                     # ease/dur/stagger/offset/t() — §8 parametrlari
  proxy.ts                        # til yo'naltirishi + admin himoyasi (Next 16 "proxy")
  data/catalog.json               # 617 mahsulot (build-catalog.mjs yaratadi)
scripts/  copy-fonts.mjs prepare-design-assets.mjs build-catalog.mjs start.mjs
          check-placeholders.mjs  # npm test
design/   26 *.dc.html + assets/  # dizayn paketi (manba, tahrirlanmaydi)
```

### Nega `src/app/not-found.tsx` (ildiz 404) kerak

`[locale]` ostidagi segmentlar `dynamicParams = false` + `generateStaticParams`
ishlatadi, shuning uchun **noma'lum slug uchun Next ROUTER darajasida 404
qaytaradi** va hech qanday `[locale]` layout'iga tushmaydi. Ildiz `layout.tsx`
pass-through bo'lgani uchun bunday javobda `<html>/<body>` ham bo'lmaydi —
foydalanuvchi Next'ning oq "This page could not be found" ekranini ko'rar edi.
Shu sababli ildiz `not-found.tsx` to'liq qobiqni (provider'lar + Header + Footer +
cookie banner) o'zi bilan olib keladi. `app/[locale]/not-found.tsx` esa sahifa
ichidan `notFound()` chaqirilganda ishlaydi. Ikkalasi bir xil vizualni
`components/layout/NotFoundContent.tsx` orqali bo'lishadi.

---

## 4. Üch kritik qoida (buzilsa sayt "jim" buziladi)

### 4.1 Placeholder bug'i — ILDIZ SABAB va yechim

Eski saytda foydalanuvchi ekranda `{from}–{to}`, `{count}`, `{max}` kabi **xom joy
tutgichlarni** ko'rgan. Uchta mustaqil sabab topildi:

1. **`{var}` li kalit o'zgaruvchisiz chaqirilgan**: `t('catalog.resultLine')` —
   lug'atda `{from}/{to}/{total}` bor, chaqiruvda yo'q → xom matn chiqadi.
2. **`.replace()` bilan qo'lda to'ldirish**: nomlar mos kelmaganda
   (`{max}` o'rniga `{count}`) almashtirish jim bajarilmaydi.
3. **Yo'q kalit**: `t('catalog.availNew')` kabi lug'atda mavjud bo'lmagan kalit
   chaqirilganda kalitning o'zi qaytadi.

**Yechim (uch qatlam):**

- `translator.ts` → `assertFilled()`: natijada `{x}` qolsa **xato tashlaydi**
  (jim emas). `pluralIndex()` + `'one|few|many'` shakli ko'plik uchun.
- **RSC → Client chegarasi**: funksiya prop sifatida uzatilmaydi (Next bunu
  taqiqlaydi va sahifa **bo'sh** render bo'ladi — HTTP 200, faqat header/footer!).
  Qoida: server `t.raw('key')` orqali **shablon**ni beradi, klient
  `fillVars(tpl, { … })` bilan to'ldiradi. `.replace()` TAQIQLANADI.
- `scripts/check-placeholders.mjs` (`npm test`) — CI nazorati:
  1. har bir `{var}` li kalitning o'zgaruvchilar to'plami 3 tilda bir xilmi;
  2. **kod chaqiruvlari**: `{var}` li kalit o'zgaruvchisiz chaqirilmaganmi,
     lug'atda yo'q kalit chaqirilmaganmi (1 va 3-sabablarni build'dan oldin ushlaydi);
  3. render qilingan HTML'da ko'rinadigan `{x}` bormi (12 ta route).

### 4.2 Sahifa "bo'sh" ko'rinsa

HTTP 200 + katta hajm hech narsani anglatmaydi (RSC flight payload HTML ichida).
Tekshirish usuli: `<script>`/`<style>` ni olib tashlab, `<section>` sonini,
`<h1>` ni va `\{[a-zA-Z][\w.]*\}` ni tekshirish. Dev log'da
`Functions cannot be passed directly to Client Components` xatosi = 4.1 dagi
chegara qoidasi buzilgan.

### 4.3 Production soft-404 (`dynamicParams`)

`dynamicParams = true` bo'lgan dinamik segmentda noma'lum slug uchun
**production** javobi `200 + loading.tsx skeleti` bo'lib qoldi (soft-404):
`notFound()` Suspense chegarasi ichida otiladi, javob allaqachon flush
bo'lgan shell bilan 200 sifatida keshlanadi (`x-nextjs-cache: HIT`).
Dev rejimida bu 404 ko'rinadi — **shuning uchun 404 holatlarini faqat
production build'da tekshirish kerak.**

Qoida: barcha slug'lari `generateStaticParams` da bor bo'lgan segmentlarda
`dynamicParams = false` (router darajasida 404). Hozir shunday:
`catalog/[slug]`, `product/[slug]`, `industries/[slug]`.

Tekshirish:
```bash
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/uz/catalog/yoq-mahsulot   # 404
```

**Kutilgan shovqin (bug emas):** `dynamicParams = false` segmentga noma'lum
slug bilan so'rov kelganda standalone server log'ida bir marta
`Error: Internal: NoFallbackError` chiqadi. Bu Next'ning ichki signali
("fallback yo'q → 404 ber") — HTTP javobi to'g'ri (404 + brend ko'rinishi),
tekshirilgan: `/uz`, `/uz/catalog/vanilla-premium`, `/uz/privacy` kabi
manzillar bu xatoni chaqirmaydi.

### 4.4 Klient bundle'iga lug'at tushib ketmasin

`@/i18n` (index.ts) uchala lug'atni import qiladi. Klient komponenti undan bitta
**qiymat** olsa (masalan `normalizeLocale`), bundler 3 tildagi ~1055 kalitni
(~165 KB xom) birinchi sahifa bundle'iga tortadi. Shuning uchun:

- `@/i18n/meta` — lug'atsiz meta (`LOCALES`, `LOCALE_META`, `isLocale`,
  `normalizeLocale`, `localeFromAcceptLanguage`, `AppLocale`).
- **Klient komponentlari qiymatlarni FAQAT `@/i18n/meta` dan oladi.**
  (`import type { DictKey } from '@/i18n'` — ruxsat, turlar o'chiriladi.)
- Lug'at klientga faqat `I18nProvider` prop'i sifatida, **bitta til** uchun boradi.

**Tekshirilgan (production build, 3 til):** birinchi sahifada yuklanadigan
17 ta JS chunk'ining hech birida lug'at matni yo'q. Diskdagi lug'atli
chunk'lar — SSG RSC payload'lari, birinchi paint'da JS sifatida yuklanmaydi.

---

## 5. Dizayn tizimi (qisqa xulosa — to'liq ro'yxat `/styleguide` da)

Palitra (§4.2): `--navy #0B0A3A` · `--ink #14132E` · `--copper #D6A27C`
(**yagona** aksent) · `--copper-light #E8C3A3` · `--copper-dark #94603E` ·
`--panel #F4EEE7` · `--slate #26254A` · `--body #4C4A5E` · `--muted #615E72` ·
`--line #DCD2C7` · `--line-soft #ECE4DA` · `--ok #2E8B57` · `--error #8E2B2B`.

**Taqiqlar (§17):** yangi rang, gradient, soya, emoji, kategoriya uchun alohida
rang, har joyda "Best-seller", qo'lda yozilgan matn/raqam, klient sir'lari,
Lenis/GSAP, monogrammani cho'zish/bo'yash.

Shakl: radius 40 (blok) / 36 (karta) / 28 (media, jadval) / 24 (plitka) / 999
(tugma, pill, input). Konteyner `max-width: 1408px; padding-inline: 16px`;
blok orasi 12–16px; seksiya orasi `clamp(80px, 9vw, 128px)`.
Breakpoint: 390 / 768 / 1080 (header → burger) / 1440. Teginish ≥ 44px.
Fokus: `2px solid var(--ink)`, offset 3px.

Tipografiya: **Urbanist** (300–600 + italic 400) lotin, **Onest** kirill —
self-hosted (`public/fonts/*.woff2`, `display: swap`). O'lchamlar `clamp()`.

Animatsiya (§8): `motion/react` + `lib/motion.ts` (`ease.out [0.16,1,0.3,1]`,
`dur {fast .16, base .32, slow .6, reveal .7}`, `stagger .06`, maks 8 element).
Faqat `transform`/`opacity`. **Reveallar CSS orqali** (`[data-reveal]` +
`html[data-motion-ready]`) — JS bo'lmasa kontent ko'rinadigan qoladi, LCP buzilmaydi.
`prefers-reduced-motion` → 200ms opacity.

---

## 6. Ma'lumot modeli (O'ZGARTIRILMAYDI — §2)

- `src/data/catalog.json` — `build-catalog.mjs` orqali `data/source/*.json` dan.
  **Qo'lda tahrirlanmaydi.**
- `lib/catalog.ts`: `allProducts, productCount, getProductBySlug, getProductBySku,
  queryCatalog(filters, locale, pageSize) → {cards,total,page,totalPages,facets,
  activeCount,suggestion,appliedFilters}, activeChips, catalogStats,
  popularProducts, newProducts, relatedProducts, applicationCounts,
  applicationProducts, suggest, groupOverview`.
- `lib/taxonomy.ts`: `CATEGORIES, FLAVOUR_GROUPS, FRAGRANCE_GROUPS,
  INGREDIENT_GROUPS, COMMODITY_GROUPS, APPLICATIONS (21), FORMS, PACKAGING,
  FEATURES, AVAILABILITY, UZ_REGIONS, BUSINESS_TYPES, LEAD_TYPES, tr(), sortTaxons`.
- **Barcha sonlar ma'lumotdan hisoblanadi** (§7.1) — komponentda qo'lda yozilgan
  raqam bo'lmasligi kerak. Masalan sohalar soni **18** (dizaynda 14 yozilgan edi —
  ma'lumot ustuvor).
- `lib/design.ts` (SERVER: `node:fs` bilan asset mavjudligini tekshiradi) —
  rasm xaritalari, `readySets`, `industrySet`, `taskSolutions`, `monogramCopy`.
  `lib/design-client.ts` — klient uchun xavfsiz kichik xaritalar.
- Namuna qutisi: `SampleBoxProvider` (localStorage `gff_sample_box_v2`),
  `{sku, size: 25|50|100}` (default 50), **maks 8**, 9-chi → toast
  "Qutida 8 ta joy bor". Header hisoblagichi, katalog paneli va mahsulot tugmasi
  **bitta store** ni ishlatadi (`data-box-target` + `FlyToBox`).
- Lead: `POST /api/leads` → zod (`lib/leads/schema.ts`) → honeypot + rate limit
  (5/10 min) + min 3 s to'ldirish + ixtiyoriy Turnstile → Telegram bot →
  `data/leads/*.json`. **Diqqat:** `type: 'sample'` uchun kamida 1 mahsulot
  talab qilinadi — quti bo'sh bo'lsa `SamplesFormBridge` yuborishni bloklaydi.

**Admin panel (`/[locale]/admin`) ESKI dizayn tokenlarida qoldirildi** — brief
12 ta marketing sahifasini talab qiladi, panel ichki tizim (§6 izohi). Shu
sababli `ui/Icon.tsx` va `ui/LegacyButton.tsx` hamon mavjud va `globals.css` da
eski `@theme` bloki saqlanadi.

---

## 7. Konventsiyalar

- **Commit**: Conventional Commits, kichik mantiqiy bo'laklar
  (`feat(catalog): …`, `fix(build): …`). Branch: `arena/41ce5453-gulfsite`.
- **Matn**: barcha matn lug'atda (`src/i18n/*.ts`). Mahsulot nomlari inglizcha
  qoladi. Sloganlar (`A sense of Joy/Bliss/Delight`) **barcha tillarda inglizcha**.
  O'zbek apostroflari: `o‘`/`g‘` = U+2018, tutuq belgisi `’` = U+2019.
- **RSC chegarasi**: server → klient faqat JSON/strings. Funksiya uzatilmaydi.
  Shablon kerak bo'lsa: `t.raw('key')` + klientda `fillVars()`.
- **Rasmlar**: `next/image`, `sizes` majburiy, hero `priority`, `aspect-ratio`
  bilan CLS 0. Monogrammalar hozircha PNG (SVG kutilmoqda — TODO).
- **Ikonkalar**: `lucide-react`, stroke 1.8–2. Emoji yo'q.
- **Har sahifada**: bitta `<h1>`, `generateMetadata` (title ≤ 60, desc ≤ 155),
  canonical + hreflang (**`x-default` → `uz`**), JSON-LD.
- **`cn()` = oddiy `join`** (tailwind-merge YO'Q): ziddiyatli utility'lar ikkalasi
  ham chiqadi. Shuning uchun `Section` da `gap={false}` + aniq `className`
  ishlatiladi, klass tartibiga tayanilmaydi.

---

## 8. O'lchangan holat (production build, 2026-10-11)

| Ko'rsatkich | Qiymat | Izoh |
|---|---|---|
| `npm run build` | ✅ 3805 statik sahifa | 617 mahsulot × 3 til + qolganlari |
| `npm test` (placeholder) | ✅ toza | 1055 kalit × 3 til, 736 chaqiruv, 12 route |
| `tsc --noEmit` | ✅ xato yo'q | strict |
| Birinchi sahifa JS | ⚠️ **~293 KB gzip** | maqsad < 180 KB — pastda tahlil |
| HTML (gzip, /uz) | ~43 KB | RSC payload + bir til lug'ati |
| 404 (production) | ✅ 404 + brend ko'rinishi | noma'lum slug, til, `/uz/…` — barchasi |
| `/product/<slug>` | ✅ 308 → `/catalog/<slug>` | doimiy, kanonik URL |
| `/styleguide` (production) | ✅ 404 | dev-only (§10) |
| `npm run audit:seo` | ✅ 0 xato, 0 ogohlantirish | 17 sahifa × 3 til + 5 ta 404 holati |

**`npm run audit:seo` nima tekshiradi** (Lighthouse sandbox'da ishlamaydi —
Chrome yo'q, shuning uchun uning SEO/A11y qoidalari skriptda):
title ≤ 60 va description ≤ 155 (HTML entitilar DEKODLANIB o'lchanadi) ·
canonical + hreflang (uz/ru/en + **x-default → uz**) · JSON-LD `@type`
(sahifa turi bo'yicha kutilgan ro'yxat) · og:image **haqiqatan yuklanadi** ·
`<html lang>` · bitta `<h1>` · barcha `<img>` da `alt` · matnsiz `<button>`
da `aria-label` · ko'rinadigan `{placeholder}` yo'q · 404 holatlari haqiqiy
404 (soft-404 yo'q).

**JS og'irligi tahlili (`/uz`, gzip):**

| Chunk | gz | Nima |
|---|---|---|
| `07vwp…` | 69.5 KB | react-dom (framework floor) |
| `2-rtuq…` | 43.9 KB | Next App Router + RSC klient runtime |
| `0cz1d0…` | 38.6 KB | Next core-js polyfill moduli |
| `1m1fiv…` | 45.5 KB | **motion** (layout + gestures + spring) |
| `1gyldz…` + qolgan | ~95 KB | bizning klient komponentlari (Header, CatalogExplorer, GffLeadForm, MonogramCycle…) |

Framework floor ~152 KB gzip — Next 16 App Router'da 180 KB maqsadi **birinchi
sahifa uchun amalda erishib bo'lmaydigan** (faqat react-dom + router + polyfill
shu qiymatni beradi).

**Qanday qisqartirish mumkin (o'lchangan, lekin mijoz qarori kerak):**

- `<Reveal>` endi motion'ni import QILMAYDI (`useInViewOnce` +
  `useReducedMotionPref` — `lib/hooks.ts`). Bu to'g'ri arxitektura, lekin
  **o'lchangan foyda hozircha 0**: motion chunk'i har sahifada qoladi, chunki
  sayt qobig'i (Header, LocaleSwitcher, MobileMenu, CookieConsent, StickyCta)
  motion ishlatadi.
- Qobiqni ham CSS o'tishlariga o'tkazish **−45 KB gzip** beradi (293 → ~248),
  motion faqat haqiqatan kerakli sahifalarda qoladi (home, katalog, mahsulot,
  namuna, forma). **Ammo** bu §3.3 ("animatsiyalar faqat `motion/react`") dan
  og'ish va `LocaleSwitcher`dagi `layoutId` pill animatsiyasini soddalashtiradi
  — shuning uchun bu qaror mijoz/dizayner bilan kelishilishi kerak (§16: ochiq
  savol). Bundan keyin ham 180 KB maqsadi erishilmaydi (framework floor 152 KB).
- `LazyMotion` + `domMax` va `motion.*` → `m.*` (~19 fayl, ~100 chaqiruv):
  taxminan −20…25 KB gzip, §3.3 buzilmaydi, lekin katta mexanik refactor va
  animatsiya regressiyasi xavfi.

---

## 9. TODO (mijozdan kutilayotgan va texnik qarzlar)

### 9.1 Mijozdan kerak (§15 — joy tutgich bilan qoldirilgan)

- [ ] **MOQ / minimal buyurtma** — hozir `siteConfig.business.minOrderKg = 5`
      (taxmin). Tasdiqlash kerak.
- [ ] **Distribyutorlik sertifikati PDF** — footer/hujjatlar bloki uchun.
- [ ] **Maxfiylik siyosati va shartlarning yakuniy yuridik matni** —
      `lib/legal.ts` ZRU-547 asosida tayyorlangan, **yurist tasdig'i shart**
      (sahifada ochiq ogohlantirish bor).
- [ ] **Hujjatlar (TDS/SDS/Halal/ISO) PDF'lari** — `catalogPdf` hozir bo'sh.
- [ ] **Ishlab chiqarish videosi** — About/Hero uchun.
- [ ] **Har mahsulot uchun foto** — hozir kategoriya/qadoq fotolari fallback.
- [ ] **Monogrammalarning SVG versiyasi** — hozir PNG (ota kompaniyadan).
- [x] **E-mail tasdiqlandi (2026-10-12)** — mijoz `info@gulfflavour.uz` ni
      tanladi (saytda allaqachon shu). Avvalgi `info@gulfflovour.uz` yozuvi
      xato bo'lgan; TODO yopildi.

### 9.2 Texnik

- [x] **JS byudjeti bo'yicha qaror qabul qilindi (2026-10-12)** — mijoz
      hozirgi **293 KB gzip** ni qabul qildi: motion to'liq saqlanadi (§3.3
      buzilmaydi), hech qanday qisqartirish kiritilmaydi. §14.5 ning
      <180 KB talabi Next 16 App Router'da texnik jihatdan erishib
      bo'lmaydi (framework poli ≈152 KB), shuning uchun asosiy mezon —
      **Lighthouse Perf ≥ 90 (mobile)**, deploy'dan keyin o'lchanadi.
      Saqlangan variantlar (kerak bo'lib qolsa): (a) qobiqni CSS'ga
      o'tkazish −45 KB, (b) `LazyMotion`+`domMax` −20…25 KB,
      (c) `GffLeadForm` dagi zod'ni server-only qilish −6 KB.
- [x] **RU/EN review ro'yxati tayyorlandi (§10.6)** — `docs/TRANSLATIONS_REVIEW.md`
      + `docs/translations-review.csv` (1055 kalit) + `docs/taxonomy-review.csv`
      (151 uch tilli takson yozuvi). Generatsiya: `npm run i18n:export`.
      Provenance: UZ — dizayn matni (asosiy); RU — dizaynerdan 44 qiymat
      (`design/Main.ru.dc.html`, faqat bosh sahifa) + 918 texnik tarjima;
      EN — barchasi texnik tarjima.
- [ ] **RU/EN tarjimalarini mijoz ko'rigidan o'tkazish** — ro'yxat yuqorida;
      javob kelgach lug'atlarga ko'chiriladi (P1 yurist, P2 mijoz faktlari).
- [ ] **Lighthouse o'lchovi** (Perf ≥ 90 mobile, A11y ≥ 95, SEO 100) — sandbox'da
      Chrome yo'q, shuning uchun o'lchanmagan. Deploy'dan keyin tekshirish.
      SEO/A11y qoidalarining biz nazorat qila oladigan qismi
      `npm run audit:seo` da tekshirilgan va hozir toza.
- [ ] **GTM/GA4 identifikatorlari** (`NEXT_PUBLIC_GTM_ID`) va Telegram bot tokeni
      (`.env`) — production'da yoqish.
- [ ] **Turnstile** — `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`
      bo'sh, shuning uchun hozir faqat honeypot + rate limit ishlaydi.
- [ ] **Admin panel yangi dizaynga o'tkazilmagan** (§6 izohi) — brief talab
      qilmaydi, lekin token ikkiligi texnik qarz.
- [ ] **`/styleguide` production'da 404** — `NODE_ENV` bo'yicha; deploy'da
      tekshirish (sitemap/robots'da ham yopilgan).

---

## 10. Qabul qilingan og'ishlar (brief'dan, sababi bilan)

1. **`/uz` prefiksi saqlandi** (standart til uchun ham) — mavjud `src/proxy.ts`
   shunday ishlaydi; brief "UZ prefikssiz" degan, lekin migratsiya 617×3 URL'ni
   qayta yozishni va 301 zanjirini talab qilardi.
   **Mijoz tasdiqladi (2026-10-12)** — `/` → `/uz` (307), `/catalog` →
   `/uz/catalog` (308) shunday qoladi; uch til simmetrik, `x-default` → uz.
2. **Mahsulot slug'lari qisqa** (`vanilla-premium`) — mavjud ma'lumot; kanonik
   URL `/catalog/<slug>`, eski `/product/<slug>` **301**.
3. **Shriftlar self-hosted** (`@fontsource-variable/*`) — sandbox'da Google Fonts
   yo'q; bu LCP va GDPR uchun ham yaxshi.
4. **Reveallar CSS bilan** (`[data-reveal]` + `html[data-motion-ready]`), motion
   `whileInView` emas — JS'siz holat va LCP buzilmasligi uchun (§8.7).
5. **Ko'plik shakli** `'one|few|many'` + `pluralIndex()` orqali.
6. **Admin panel eski tokenlarda** (§6).
7. **localStorage kaliti `gff_sample_box_v2`** — eski `v1` ma'lumoti yangi
   `{sku,size}` sxemasiga mos emas.
8. **Sohalar soni 18** (dizaynda 14) — ma'lumot ustuvor (§7.1).
9. **Soha rasmlari** — mijoz fotosi yo'q, eng yaqin mavjud foto fallback.
10. **1–3-bosqich ishi `feat(product)` commit'iga tushdi** — oldingi sessiyalarda
    commit qilinmagan edi.
11. **Quote sahifasi yangi dizaynda qayta qurildi** — dizayn paketida yo'q, lekin
    eng "issiq" lead turi; Contact bloklari bilan qurildi, mantiq saqlandi.
12. **Huquqiy matnlar `lib/legal.ts` dan** — i18n'dagi `privacy.s1..s8` kalitlari
    endi ishlatilmaydi (ikkita manba xavfini yo'qotish uchun).

---

## 11. Bosqichlar holati (§16)

| # | Bosqich | Holat | Commit |
|---|---|---|---|
| 0 | Audit + reja | ✅ | — |
| 1 | Tokenlar, shriftlar, UI primitivlar, motion | ✅ | `9ab7fd1` ichida |
| 2 | Layout (Header/Footer/MobileMenu) + Bosh sahifa | ✅ | `9ab7fd1` ichida |
| 3 | Katalog + filtr + mahsulot kartasi | ✅ | `9ab7fd1` ichida |
| 4 | Mahsulot sahifasi + namuna qutisi | ✅ | `9ab7fd1` |
| 5 | Namuna olish sahifasi | ✅ | `e54630c` |
| 6 | Sohalar (indeks + detal) | ✅ | `f1104be` |
| 7 | About, Contact, Search, 404, Privacy/Terms, Quote | ✅ | `1061170`, `0f6c55f` |
| 8 | Styleguide + `npm test` + build tuzatish + SEO | ✅ | `0f6c55f` + keyingi |
| 9 | Optimallashtirish (JS, Lighthouse) + RU/EN review | ✅ (Lighthouse deploy'dan keyin) | `a5285e4`, `ee64b3f`, `cd2677b` + docs |

**9-bosqich natijasi:** JS og'irligi o'lchandi va tahlil qilindi (§8) — §14.5
ning <180 KB gzip maqsadi Next 16 App Router'da **erishib bo'lmaydi**
(framework poli ≈152 KB: react-dom 69.5 + App Router/RSC 43.9 + core-js 38.6),
hozirgi holat 293 KB gzip. Kamaytirishning 3 varianti §8 da — **mijoz qarori
kerak**, ruxsatsiz boshlanmaydi. SEO/A11y auditi (`npm run audit:seo`) va
tarjima review ro'yxati (`docs/`) tayyor. Lighthouse sandbox'da Chrome yo'qligi
sababli o'lchanmadi — deploy'dan keyin.
