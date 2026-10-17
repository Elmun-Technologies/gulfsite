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
npm run audit:links    # o'lik havola/asset auditi (sitemap + 18 sahifa, server kerak)
npm run env:check      # launch tayyorligi (§15 etalon nazorati bilan)
npm run lighthouse     # Perf/A11y/SEO o'lchovi (Chrome kerak — CI'da bajariladi)
npm run i18n:export    # RU/EN review CSV'larini yangilash (docs/*.csv)
```

**CI:** `.github/workflows/ci.yml` har push/PR'da bularning hammasini bajaradi
— typecheck, lint, placeholder testi (offline + RENDER), `env:check --report`,
build, server, `audit:seo`, `audit:links`, HTTP semantikasi (307/308/404),
lead API (201 + honeypot), server log'i va **Lighthouse** (mobile: Perf ≥ 90 ·
A11y ≥ 95 · SEO 100; desktop qo'shimcha). GitHub runner'larida Chrome bor,
sandbox'da yo'q — shuning uchun Lighthouse CI'da o'lchanadi.

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

## 4. Kritik qoidalar (buzilsa sayt "jim" buziladi)

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

### 4.5 Stagger indeksi — SERVER komponentda `child.type === Reveal` ISHLAMAYDI

`home/sections.tsx` — **server** komponent. U `<RevealGroup>` (klient
komponent) ichiga `<Reveal>` bolalarini berganda, bolalar bu yerga funksiya
emas, **client-reference proksi** sifatida yetib keladi. Shuning uchun guruh
ichida `child.type === Reveal` solishtiruvi `false` bo'ladi va
`cloneElement(child, { index })` hech narsa qilmaydi — stagger **jim** yo'qoladi
(barcha `--reveal-delay: 0s`). Build ham, test ham, konsol ham xato bermaydi;
faqat animatsiya "yopishib" qoladi.

**Qoida: stagger indeksini doim OCHIQ prop qilib bering** —
`{items.map((it, i) => <Reveal key={it.id} index={i}>…</Reveal>)}`.
`RevealGroup` faqat `step` kontekstini beradi (60ms desktop / 40ms mobil,
maks. 8 — §8.1).

Tekshirish (SSR HTML'da ko'rinadi, brauzer kerak emas):

```bash
curl -s localhost:3000/uz | grep -o -- '--reveal-delay:[0-9.]*s' | head
# kutilgan: 0s, 0.06s, 0.12s, 0.18s … (bir xil qiymat takrorlanaversa — stagger yo'q)
```

### 4.6 react-hooks v6 (React Compiler) qoidalari — CI lint'ni talab qiladi

`.github/workflows/ci.yml` dagi `verify` job'i `eslint .` ni ishga tushiradi,
shuning uchun lint **0 muammo** bo'lishi shart. Qoidani o'chirmang
(`eslint-disable` ishlatilmaydi) — shaklni o'zgartiring:

| Xato | Noto'g'ri shakl | To'g'ri shakl |
| --- | --- | --- |
| `set-state-in-effect` | `useEffect(() => setMounted(true))` | `useSyncExternalStore` (`useHydrated`, `CookieConsent`) |
| `set-state-in-effect` | prop o'zgarsa effect ichida `setState` | "adjust state during render": `prevValue` state + shartli `setState` (`Header`, `SearchInput`) |
| `refs` | render ichida `ref.current` ni o'qish/yozish | effect yoki handler ichida; render'da kerak bo'lsa — **derivatsiya** (`useInViewOnce`'dagi `noObserver`) |
| `purity` | `useRef(Date.now())` | `useRef(0)` + mount effect'ida `Date.now()` (`GffLeadForm`) |
| `immutability` | funksiyani e'lon qilishdan oldin ishlatish | `useCallback` ni effect'dan OLDIN e'lon qilish (`Analytics.loadGtm`) |

Ikkita xato shakl **o'zimiz** qayta takrorlamasligimiz uchun: (a) `Children.map`
callback'i ichida tashqi `let` hisoblagichni oshirish → "Cannot reassign
variable after render completes"; (b) render paytidagi "adjust state" bloki
ichida ref yozish → "Cannot access refs during render" (u yerda faqat
`setState` mumkin).

### 4.7 Mobil tuzoqlar (2026-10-12, 390px skrinshot auditida topilgan)

- **`layoutId` fon + `-z-10`**: tugma stacking context yaratmasa, `-z-10` fon
  ota panel (`bg-panel`) ORQASIGA tushadi — tanlangan holat ko'rinmaydi
  (namuna o'lchami 50 g). Qoida: bunday tugmaga doim `isolate`.
- **`flex-col` + `basis-[Npx]`**: ustun yo'nalishida `basis` BALANDLIKKA
  aylanadi (CookieConsent ichi bo'sh 390px edi) → `max-tab:basis-auto`.
- **`.btn` mobilda o'raladi** (globals.css, <768px): `nowrap` + qat'iy balandlik
  uzun CTA'ni kartadan chiqarib sahifani yon tomonga surardi.
- **Ko'p qatorli matnli kapsula** (`rounded-pill`) mobilda matnni kesadi →
  `max-tab:rounded-card max-tab:p-6`.
- **Skrinshot auditida "bo'sh joy"** ko'pincha reveal/lazy-rasm artefakti:
  sahifani sekin skroll qiling (300px / 250ms), keyin xulosa qiling.

### 4.8 SEO: ikonkalar va robots

- Ikonkalar `npm run icons` (scripts/build-icons.mjs) bilan monogram-copper.png
  dan yaratiladi: `src/app/{favicon.ico,icon.png,apple-icon.png}` (Next o'zi
  `<link>` qo'yadi) + `public/icons/*` (manifest, Organization.logo).
- `robots.txt` da `/_next/` YOPILMAYDI (Googlebot render uchun CSS/JS kerak).
- Title ≤ 60 (shablon " — GFF Uzbekistan" = 17 belgi); soha title'i
  `industryTitle()` bilan qisqaradi. `GOOGLE_SITE_VERIFICATION` /
  `YANDEX_VERIFICATION` env → meta teglar.

### 4.9 To'liq audit (2026-10-17) — topilgan "jim" xatolar va qoidalar

- **Namuna qutisi**: `setState` updater ichida natija (`added/full`)
  hisoblamang — updater keyinroq bajarilishi mumkin. `SampleBoxProvider`
  `itemsRef` ko'zgusidan hisoblaydi. Persist effect `ready` bo'lmaguncha
  yozmaydi (aks holda gidratsiya commit'ida `[]` localStorage'ni o'chiradi).
- **`clear()` dan keyin son kerak bo'lsa** — avval state'ga saqlang
  (`SamplesFormBridge.sentCount`), aks holda "0 ta namuna" chiqadi.
- **`localizedPath()` idempotent** — breadcrumb `href: /${locale}/…` berilsa
  ham JSON-LD `/uz/uz/…` bo'lmaydi.
- **Katalog kanonik URL** — faqat `categories` + `page`; boshqa filtr → noindex.
- **Takroriy lead** — telefon + tur + SKU'lar bo'yicha (faqat telefon emas).
- **`TRUSTED_IP_HEADER`** — production'da proksiga mos bering (env:check
  ogohlantiradi); admin login'da IP'siz umumiy cheklov ham bor (30/15 min).
- **Analitika** — `dataLayer` GA4_ID'siz ham to'ldiriladi (GTM-only sozlama).
- **`audit:links`** endi sitemap domeni `BASE_URL` dan farq qilsa ham
  barcha URL'larni tekshiradi (avval 0 ta tekshirib "toza" derdi).


### 4.10 Admin panel, o'z analitikamiz, kontent (2026-10-17)

- **Ma'lumotlar** `DATA_DIR` (standart `<cwd>/data`, fly/Docker `/app/data` volume):
  `leads/` · `analytics/YYYY-MM-DD.jsonl` · `content/site.json` + `content/media/`.
  Standalone `server.js` `chdir` qiladi → `scripts/start.mjs` `DATA_DIR` ni
  mutlaq yo'lga qo'yadi (aks holda `.next/standalone/data` ga yozilib, build o'chiradi).
- **Analitika** (GA/Metrika'siz): `lib/fp-tracker.ts` (klient, `SiteTracker`) →
  `POST /api/t` → `lib/analytics-store.ts`. `trackEvent()` har hodisani ham yuboradi.
  IP saqlanmaydi; `HeadlessChrome`/botlar sanalmaydi (Playwright testida oddiy UA bering).
  Lead'ga `visitorId/sessionId` yoziladi → ariza sahifasida tashrif yo'li.
- **Admin sahifalari**: `/admin` · `analytics` · `analytics/sessions` · `leads` ·
  `samples` · `clients` · `content` · `settings`. Matnlar `lib/admin-copy.ts` da
  (sayt lug'atiga QO'SHILMAYDI — §4.4). Har sahifada `requireAdmin()`.
- **Kontent** (`lib/content.ts`): kontaktlar (direktor + menejerlar, WA/TG),
  "Bizga ishonishadi" logotiplari, videolar. Saqlashda `revalidatePath('/', 'layout')`;
  `(site)/layout.tsx` da `revalidate = 600` (deploy'dan keyingi zaxira).
  Logotip yuklash `sharp` → WebP (`/api/media/<xesh>.webp`).
- **Video**: facade — iframe faqat bosilganda (Perf). YouTube nocookie, Instagram embed.
- **fly.io**: `fly.toml` (volume `gff_data`, `TRUSTED_IP_HEADER=fly-client-ip`,
  `NEXT_PUBLIC_*` → `[build.args]`). Dockerfile entrypoint volume egasini tuzatadi;
  `.next` `gff` egaligida — ISR yozishi uchun shart.


### 4.11 Elektron katalog (flipbook) va katalog fotolari (2026-10-17)

- **Manba**: mijoz PDF katalogi → `node scripts/build-brochure.mjs <pdf> <uz|ru|en>`
  (poppler + sharp) → `public/catalog/<lang>/pNN.webp` + `src/data/brochure-<lang>.json`.
  Natija commit qilinadi (Docker/fly build'da poppler yo'q). **RU kelganda**: skriptni
  ishga tushirib, `lib/brochure.ts` dagi `ru:` qatorini oching; mundarija varaqlari
  (`BROCHURE_TOC`) PDF sahifa tartibiga bog'liq — RU tartibi farq qilsa tekshiring.
- **`/brochure`**: `components/brochure/Flipbook.tsx` — desktop 3D varaq (faqat
  transform), mobil yarim-sahifa surish; tizer `BrochureTeaser` (bosh sahifa hero'dan
  keyin, kompaniya). Menyu punkti `wideOnly` — header ≥1320px da (torroqda qator sig'maydi).
- **Fotolar** `public/images/stock/*` — katalogdagi dizaynerlik stok rasmlari
  (`pdfimages -png`: CMYK JPEG to'g'ridan-to'g'ri `sharp` bilan teskari rangda chiqadi!).
  Yoyilma rasmlari ikki yarimdan iborat va listing tartibi chap/o'ng emas — birlashtirishda tekshiring.
- **id to'qnashuvi**: bosh sahifada `#katalog` kategoriyalar bo'liminiki; tizer `#e-katalog`.

### 4.12 SEO landing'lar, split deploy, admin identikasi (2026-10-17)

- **Kategoriya/guruh sahifalari**: `/[locale]/category/<cat>` (6) va
  `/[locale]/category/<cat>/<group>` (65) — `components/catalog/CategoryLanding.tsx`,
  `lib/category-pages.ts`, matnlar `catseo.*`. `dynamicParams = false`. Footer, bosh
  sahifa va mahsulot breadcrumb'i shu sahifalarga havola beradi; sitemap'da bor;
  katalogda faqat bitta kategoriya filtri bo'lsa canonical → `/category/<id>`.
- **hreflang** faqat til kodi (`uz`/`ru`/`en`, `ru-RU` emas) — auditoriya O'zbekiston/O'rta Osiyo.
- **Split deploy** (Vercel frontend + fly backend) — `docs/DEPLOY_VERCEL_FLY.md`.
  `NEXT_PUBLIC_API_URL` → klient lead/analitikani fly'ga yuboradi (`lib/api-base.ts`,
  CORS `lib/cors.ts`, `CORS_ORIGINS`). `BACKEND_URL` → Vercel kontentni
  `/api/content/public` dan ISR (tag `site-content`) bilan oladi, `/admin` → fly'ga 307.
  `FRONTEND_URL` + `REVALIDATE_SECRET` → admin saqlaganda fly Vercel'ning
  `/api/revalidate` ini chaqiradi; fly'dagi ommaviy sahifalar frontend'ga 308.
  Env berilmasa — bitta server rejimi (avvalgidek).
- **Manzil**: Olmazor tumani, Qoraqamish 2/4, 25-uy (katalogdagi kabi — Mirzo Ulug'bek EMAS).
  **E-mail** hozir `sales-uzb@gff.co.ae`; `info@gulfflavours.uz` uchun pochta
  provayderi + MX yozuvlari kerak (fly/Vercel pochta bermaydi) — keyin `NEXT_PUBLIC_EMAIL`.
- **Admin** endi sayt tokenlarida (navy/copper/panel, monogramma, soyasiz) — §6 dagi
  "eski tokenlar" izohi tarixiy; `globals.css` dagi eski `@theme` bloki qolgan klasslar uchun.

### 4.13 Admin'dan katalog, Telegram do'kon, admin dizayni (2026-10-17, 2-qism)

- **Katalog tuzatmalari** (`lib/catalog-overrides.ts` sof, `lib/catalog-live.ts` server):
  `catalog.json` O'ZGARMAYDI — admin o'zgarishlari `<DATA_DIR>/catalog/overrides.json`
  (`products` yamoqlari, `added` yangi mahsulotlar, `categories`, `groups`; har saqlashda
  `catalog/history/` ga zaxira, oxirgi 20 ta). Vercel'da `BACKEND_URL/api/catalog/overrides`
  (ISR 60 s + `catalog` tegi; admin saqlaganda `notifyFrontend()` darhol yangilaydi).
- **QOIDA: katalogga tegadigan har sahifa/route boshida `await ensureCatalog()`** — aks holda
  asos ro'yxat ko'rinadi (yangi/yashirin mahsulot farqi jim yo'qoladi). `lib/catalog.ts`
  funksiyalari sinxron qoldi; ro'yxat `__replaceProducts()` bilan almashtiriladi,
  taksonomiya massivlari JOYIDA (`splice`) yangilanadi, `byId()` keshi o'zi qayta quriladi.
- **Mahsulot sahifasi `dynamicParams = true`** (admin qo'shgan mahsulot build'siz ochiladi).
  Soft-404 bo'lmasligi uchun ro'yxat sahifasi va `loading.tsx` `catalog/(list)/` ichida —
  `[slug]` ustida loading chegarasi YO'Q. Yangi loading.tsx qo'shayotganda shuni buzmang
  (`curl …/uz/catalog/yoq` → 404 bo'lishi shart). Guruh landingi ham `true`.
- **Yangi kategoriya** landing sahifasiga ega emas (`catseo.*` matni yo'q) — havolalar
  `categoryHref()/groupHref()` orqali katalog filtriga ketadi. Kod `BENEFITS/STORAGE/BLURBS`
  uchun aromatizator matnini zaxira qiladi.
- **Admin → Mahsulotlar** (`components/admin/CatalogManager.tsx`, `/api/admin/catalog`):
  qidiruv/filtr, tahrirlash (3 til nom/tavsif, guruh, shakl, doza, qadoq, belgilar), rasm
  (`/api/admin/media` `kind=product` → 1600 px WebP), yashirish, yangi mahsulot, guruh/kategoriya.
- **Telegram do'kon (Mini App)**: `/[locale]/tg` (`(tg)` route guruhi, sayt qobig'isiz,
  noindex). Katalog `/api/catalog` dan, quti — saytdagi `SampleBoxProvider`. Ariza fly'dagi
  `/api/leads` ga `tgInitData` bilan — server imzoni bot tokeni bilan tekshiradi
  (`lib/telegram.ts verifyInitData`), arizaga `telegram` va `source.channel='telegram'`
  yoziladi, mijozga botda tasdiq ketadi. Bot webhook: `/api/telegram/webhook` (sirli sarlavha,
  shaxsiy chat: /start → "Do'konni ochish"; mijoz matni oxirgi arizasiga izoh + guruhga).
  Admin → Sozlamalar → **"Botni sozlash"** (webhook + menyu tugmasi + /start). Ariza
  sahifasida — mijozga bot orqali javob. `/tg` sahifalarida X-Frame-Options YO'Q, o'rniga
  CSP `frame-ancestors` faqat Telegram (Desktop/Web iframe'da ochadi).
- **Video**: YouTube, Instagram, **VK Video** (`video_ext.php`), to'g'ridan-to'g'ri `.mp4`
  (`<video>`, birinchi kadr muqova). Boshqa manba qo'shsangiz — `parseVideo()` + ContentEditor.
- **Admin dizayni**: `.admin-ui` (globals.css) sayt tokenlarini panel ichida qayta belgilaydi
  (indigo aksent, slate matn, tizim shrifti, `.admin-card`). Marketing sahifalari ta'sirlanmaydi;
  admin klasslarini o'zgartirmasdan rang almashtirish shu blokda.

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
- **Vercel'da lead yetkazish (2026-10-12):** Vercel FS read-only → `createLead`
  diskka yoza olmaydi va lead faqat jarayon xotirasida qoladi (`durable: false`).
  Shuning uchun Vercel'da **kamida bitta kanal SHART** (tavsiya: `TELEGRAM_BOT_TOKEN`
  + `TELEGRAM_CHAT_ID`). Kanal ham ishlamasa API **503 `delivery_failed`** qaytaradi —
  forma "qo'ng'iroq qiling" xatosini ko'rsatadi, soxta "Rahmat" chiqmaydi
  (avval lead jim yo'qolardi). Admin panel/leads ro'yxati Vercel'da ishlamaydi —
  uning uchun VPS/Docker (`data/leads` volume) yoki webhook → CRM.

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
| `npm run build` | ✅ 3804 statik sahifa | 617 mahsulot × 3 til + qolganlari |
| `npm test` (placeholder) | ✅ toza | 1055 kalit × 3 til, 736 chaqiruv, 12 route |
| `tsc --noEmit` | ✅ xato yo'q | strict |
| `npm run lint` | ✅ 0 muammo | react-hooks v6 (React Compiler) qoidalari ham — CI shu yerdan o'tadi (§4.6) |
| Birinchi sahifa JS | ⚠️ **~293 KB gzip** | maqsad < 180 KB — pastda tahlil |
| HTML (gzip, /uz) | ~43 KB | RSC payload + bir til lug'ati |
| 404 (production) | ✅ 404 + brend ko'rinishi | noma'lum slug, til, `/uz/…` — barchasi |
| `/product/<slug>` | ✅ 308 → `/catalog/<slug>` | doimiy, kanonik URL |
| `/styleguide` (production) | ✅ 404 | dev-only (§10) |
| `npm run audit:seo` | ✅ 0 xato, 0 ogohlantirish | 17 sahifa × 3 til + 5 ta 404 holati |
| `npm run audit:links` | ✅ 0 xato, 0 ogohlantirish | sitemap 1935 URL + 18 sahifa: 242 URL, havola/anker/rasm/og:image |
| `POST /api/leads` | ✅ 201 (`GFF-2026-285-0001`) | zod + antispam; `notified: telegram/email/webhook = "sozlanmagan"` — env yo'q |
| `npm run env:check` | ⚠️ 4 xato, 6 ogohlantirish | launch'ni to'sadiganlar: domen, lead kanali, admin parol/secret |
| `npm run lighthouse` (lokal) | ⏭️ skip (exit 2) | sandbox'da Chrome yo'q → CI'da o'lchanadi |
| `npm run lighthouse` (CI, desktop) | ✅ 9/9 sahifa o'tdi | Perf ≥ 90 · A11y ≥ 95 · SEO 100 |
| `npm run lighthouse` (CI, mobil) | ⚠️ Perf 55–95 (hisobot) | A11y 96–100 ✅ · SEO 100 ✅ · CLS 0 — pastdagi izoh |

**Lighthouse — CI'da o'lchangan haqiqiy raqamlar (GitHub runner, 2026-10-12):**

Run `38215922773` (a11y tuzatishlaridan keyin, **ikkala job ham yashil**):

| Sahifa | Perf mobil | Perf desktop | A11y mobil/desktop | SEO | BP | LCP (m/d) | CLS | TBT (m) |
|---|---|---|---|---|---|---|---|---|
| Bosh `/uz` | 55 | 99 | 97 / 97 | 100 | 88 | 5.1 s / 0.8 s | 0 | 1210 ms |
| Katalog | 92 | 100 | **97** / 97 | 100 | 96 / 92 | 2.8 s / 0.7 s | 0 | 220 ms |
| Mahsulot | 87 | 100 | 96 / 96 | 100 | 92 | 3.6 s / 0.8 s | 0 | 190 ms |
| Namunalar | 95 | 100 | 97 / 97 | 100 | 96 / 92 | 2.4 s / 0.7 s | 0 | 200 ms |
| Sohalar | 87 | 100 | 100 / 100 | 100 | 92 | 3.7 s / 0.8 s | 0 | 160 ms |
| Aloqa | 92 | 100 | 96 / 96 | 100 | 96 / 92 | 3.4 s / 0.7 s | 0 | 50 ms |
| Kompaniya | — | 98 | — / 100 | 100 | 92 | — / 1.1 s | 0 | 0 ms |
| RFQ | — | 100 | — / 97 | 100 | 92 | — / 0.7 s | 0 | 0 ms |
| Soha detali | — | 100 | — / 100 | 100 | 92 | — / 0.8 s | 0 | 0 ms |

Katalog A11y **92 → 97** (pastdagi 3 tuzatish). Keyingi run (`fe7e317`, ham
yashil) mobil Perf: bosh 65 · katalog 92 · mahsulot 94 · namunalar 91 · sohalar
89 · aloqa 92; A11y/SEO bir xil. Run-to-run shovqin ±10 (bosh sahifa 55/56/58/65)
— aynan shu sababdan Perf CI'da hisobot rejimida va qat'iy mezon production'da
tekshiriladi.

**Desktop: 9 sahifaning BARCHASI Perf ≥ 90 · A11y ≥ 95 · SEO 100** — o'sha
runner'da, o'sha build bilan. Farq: mobil o'lchovda Lighthouse 4× CPU throttle
+ Moto G emulyatsiyasini qo'llaydi, runner'ning ulashilgan CPU'si esa haqiqiy
telefondan sekin. Shuning uchun **mijoz qarori bilan CI'da Perf — HISOBOT**
(`--perf-report-only`), qat'iy mezon (Perf ≥ 90 mobil) production deploy'dan
keyin o'lchanadi (`docs/LAUNCH_CHECKLIST.md` §E3). A11y ≥ 95 va SEO = 100
CI'da QAT'IY — ular ushunaga bog'liq emas.

**A11y tuzatishlari (Lighthouse topgan, 2026-10-12):**

1. `aria-valid-attr-value` (og'irlik 10) — `<Tabs>` har bir tab'ga
   `aria-controls="panel-catalog-cat"` berardi, lekin DOM'da bunday ID yo'q
   edi → katalog A11y 92. Yechim: natijalar konteyneriga
   `id="panel-catalog-cat" role="tabpanel" aria-labelledby="tab-catalog-cat-<faol>"`.
   (Xuddi shu sababdan `Header` burger tugmasi uchun `<div id="gff-mobile-menu">`
   DOIM render qilinadi — yangi `aria-controls` qo'shayotganda ID'ning DOM'da
   borligini tekshiring.)
2. `target-size` (og'irlik 7, WCAG 2.5.8: min 24px) — `.foot-link` balandligi
   ~22px edi. Yechim: `padding-block: 11px; margin-block: -11px` (teginish
   maydoni 44px — §9 talabi, vizual ritm o'zgarmaydi) va `::after { bottom: 9px }`.
3. `label-content-name-mismatch` (WCAG 2.5.3, Lighthouse'da og'irligi 0, lekin
   nutq bilan boshqaruvchi foydalanuvchilar uchun real muammo) — header logotipi
   va soha kartalarining `aria-label`'i ko'rinadigan matnni o'z ichiga olmasdi.
   Yechim: `aria-label` olib tashlandi, nom kontentdan olinadi.

**Qoida:** `aria-label` berishdan oldin o'ylang — agar elementda ko'rinadigan
matn bo'lsa, `aria-label` uni O'Z ICHIGA olishi shart (WCAG 2.5.3). Matn bo'lsa
`aria-label` umuman kerak emas; u faqat matnsiz (ikonka) tugmalar uchun (§14).

**Hisobot jadvali CI'da `::notice` annotation sifatida ham chiqadi** — log yoki
artefaktni ochmasdan o'qiladi: `gh api repos/<o>/<r>/check-runs/<job>/annotations`.
Artefakt (`lighthouse-reports`) `lh-reports/` papkasidan yuklanadi, chunki
`upload-artifact` yashirin (`.lighthouse/`) papkani glob qilmaydi.

**BP ogohlantirishlari (hozircha qoldi, mezon emas):** `image-aspect-ratio`
(`fill` + `object-cover` rasmlarda konteyner va rasm proporsiyasi farq qiladi —
Lighthouse buni "cho'zilgan" deb hisoblaydi, garchi `object-cover` qirqsa ham)
va `image-size-responsive` (logotip 498×523 manbadan 40px'da ko'rsatiladi;
`sizes` aniqlashtirildi). Bosh sahifada `unused-javascript ≈380–450ms` —
bu motion kutubxonasining narxi (mijoz qarori: to'liq motion saqlanadi, §14.5).

**`npm run audit:links` topgan va TUZATILGAN 3 ta real bug (2026-10-12):**

1. **O'lik anker `#forma`** — bosh sahifadagi "formaga o'tish" tugmasi
   (`home/sections.tsx`) `href="#forma"` edi, lekin hech qaysi elementda
   `id="forma"` yo'q edi → tugma bosilganda hech narsa bo'lmasdi.
   Yechim: `GffLeadForm` ga ixtiyoriy `id` prop qo'shildi va
   `ContactSection` da `id="forma"` berildi (`scroll-padding-top: 6.5rem`
   globals.css'da allaqachon bor, shuning uchun sticky header yopib qolmaydi).
2. **404 sahifasida til switcher o'lik havola yasardi** — ildiz 404'da
   `usePathname()` Next'ning ICHKI yo'lini qaytaradi (`/uz/_not-found`),
   shuning uchun `localizePath()` `/ru/_not-found` va `/en/_not-found`
   havolalarini yasardi (ikkalasi ham 404). Yechim: `localizePath()`
   `/_not-found` quyrug'ini kesadi → til almashtirish o'sha tilning bosh
   sahifasiga o'tadi (§10.8 mantiqiga mos zaxira).
3. **Audit skriptining o'zi** — `?page=2` kabi nisbiy (faqat query) havolalarni
   "kutilmagan format" deb ogohlantirardi; endi `new URL(href, url)` bilan
   mutlaq yo'lga aylantirilib tekshiriladi.

**Qoida:** havola/asset yo'lini hech qachon "ishlayapti" deb taxmin qilmang —
`npm run audit:links` sitemap'dagi HAR bir URL'ni va sahifadagi har bir
`href`/`src` ni tekshiradi. Bo'sh kontent (PDF/video/foto) uchun tugma
UMUMAN render qilinmasligi kerak (`publicAssetExists`), aks holda saytga
o'lik havola chiqib qoladi.

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

> Aniq qaysi o'zgaruvchi/fayl kerakligi va qanday tekshirilishi:
> **`docs/LAUNCH_CHECKLIST.md`** (A — to'sadiganlar, B — "jim" bo'ladiganlar,
> C — kontent fayllari, D — sign-off, E — deploy va deploy'dan keyingi
> tekshiruvlar). Holatni bir buyruqda ko'rish: `npm run env:check`.

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

- [x] **Rate limit brief'ga qaytarildi (2026-10-12)** — §11.2 "bir IP dan
      5 ta so'rov / 10 minut" deydi, `config.ts` da standart **8** edi.
      Endi `rateLimitMax` standarti 5. `npm run env:check` bu qiymat
      o'zgarsa XATO beradi (shuningdek `.env.example` dagi kontaktlar
      §15 etalonidan farq qilsa — to'qilgan telefon/e-mail saytda
      ko'rinib qolmasligi uchun).
- [x] **To'qilgan qiymatlar tozalandi (2026-10-12)** — `.env.example` da
      `+998712000000`, `info@gff.uz`, `t.me/gffuzbekistan` kabi O'YLAB
      TOPILGAN kontaktlar bor edi (brief §15 va `config.ts` standartlariga
      zid): kimdir nusxa olib deploy qilsa, sayt noto'g'ri raqam/e-mail
      ko'rsatardi. Fayl §15 qiymatlari bilan qayta yozildi, o'lik kalit
      (`NEXT_PUBLIC_TELEGRAM_CHANNEL`) olib tashlandi, 23 ta
      hujjatlanmagan kalit qo'shildi. `config.ts` dagi `hqEmail`
      (`enquiry@gff.co.ae`) brief'da YO'Q edi → `NEXT_PUBLIC_HQ_EMAIL`
      orqali beriladigan BO'SH standartga almashtirildi; `SMTP_FROM`
      standarti to'qilgan `no-reply@gff.uz` o'rniga tasdiqlangan
      `info@gulfflavour.uz` dan quriladi.
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
- [x] **Admin panel yangi dizaynga o'tkazildi (2026-10-17)** — §4.12.
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
13. **CI'da Lighthouse Perf — hisobot, to'suvchi emas** (mijoz qarori,
    2026-10-12). Sabab: GitHub Actions'ning ulashilgan runner'ida mobil o'lchov
    4× CPU throttle bilan haqiqiy qurilmadan ancha past chiqadi (bosh sahifa
    56–58, TBT ~1 s), garchi DESKTOP o'lchov o'sha runner'da 9/9 sahifada
    Perf ≥ 90 bo'lgan. A11y ≥ 95 va SEO = 100 CI'da QAT'IY qoldi. §0/§14.5
    mezoni (Perf ≥ 90 mobil) yo'qolmadi — u production deploy'dan keyin
    o'lchanadi: `BASE_URL=https://<domen> npm run lighthouse`
    (`docs/LAUNCH_CHECKLIST.md` §E3).

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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
