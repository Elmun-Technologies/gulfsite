# GFF Uzbekistan — saytni qayta qurish (Claude Code uchun to‘liq topshiriq)

> Bu faylni repozitoriy ildiziga qo‘ying va Claude Code’ga shunday deng:
> **"GFF_CLAUDE_CODE_PROMPT.md faylini to‘liq o‘qi va unga qat’iy amal qil. 0-bosqichdan boshla."**
> Dizayn manbasi: `design/` papkasi (ushbu fayl bilan birga berilgan arxiv).

---

## 0. Rol va natija

Sen — Senior Frontend / Full-stack muhandissan (Next.js, TypeScript, animatsiya, i18n, SEO).
Vazifa: **GFF Uzbekistan** (Gulf Flavours & Fragrances FZCO, Dubay — O‘zbekistondagi rasmiy va yagona distributor) saytining **UI qatlamini butunlay yangi dizaynga** o‘tkazish, mavjud ma’lumot va biznes-mantiqni saqlagan holda.

Natija:
- `design/` dagi 12 sahifa (desktop + mobil) piksel darajasida aniq, suyuq (fluid) va responsiv.
- Barcha animatsiyalar 8-bo‘limdagi spetsifikatsiya bo‘yicha.
- UZ (asosiy), RU, EN tillari.
- Formalar → Telegram bot (va keyin CRM), analytics hodisalari, SEO.
- Lighthouse: Performance ≥ 90 (mobil), Accessibility ≥ 95, SEO 100.

---

## 1. Biznes konteksti (qaror qabul qilishda shuni yodda tut)

- **B2B sayt.** Xaridor: oziq-ovqat, kosmetika, maishiy kimyo ishlab chiqaruvchilarining texnologi va xarid menejeri.
- **Asosiy konversiya:** "Bepul namuna qutisi" (8 tagacha namuna, 25/50/100 g, 3 ish kunida, bepul). Ikkinchi darajali: narx so‘rovi, qo‘ng‘iroq, Telegram.
- **Brend:** ota-brend Gulf Flavours & Fragrances (gulfflavours.ae). Navy + mis rang, GFF art-deco monogrammasi, "A sense of Joy / Bliss / Delight" sloganı. Alohida O‘zbekiston brendi **yaratilmaydi**.
- **Eski saytning muammolari (takrorlanmasin):** ochiq qolgan i18n placeholder’lar (`{count}`, `{days}`, `{from}–{to}`), har kategoriyaga alohida rang, kartochkada 15 ta element, hamma mahsulotda "Best-seller", dublikat bloklar, monospace shrift, foto yo‘qligi.

---

## 2. Ishni boshlash tartibi (majburiy)

1. Repozitoriyni o‘qi: `package.json`, `app/` yoki `pages/`, mavjud komponentlar, styling usuli, i18n, ma’lumot manbasi (DB / JSON / CMS), API route’lar, env namunasi.
2. **`CLAUDE.md` bo‘lmasa — yarat, bo‘lsa — yangila.** Ichida: loyiha maqsadi, biznes qoidalari (1-bo‘lim), stack, papka tuzilmasi, dizayn tokenlari, nomlash qoidalari, i18n qoidasi, env o‘zgaruvchilar (qiymatsiz), buyruqlar, ma’lum cheklovlar, TODO, glossariy (SKU, CoA, TDS, MSDS, MOQ, namuna qutisi).
3. **Reja tuz va menga ko‘rsat:** fayl-fayl o‘zgarishlar, yangi dependency’lar (har biri uchun sabab), xavflar. Tasdiqdan keyin boshla.
4. **Eski placeholder bug’ining root cause’ini top** (`{count}` va boshqalar nega render bo‘lyapti — interpolation parametrlari uzatilmayaptimi yoki kalitlar noto‘g‘rimi) va tushuntirib, keyin tuzat.
5. Mavjud ma’lumot modelini, katalog/filtr/namuna qutisi mantig‘ini **saqlab qol**. Faqat UI va kerakli kengaytmalarni o‘zgartir.
6. Kichik, mantiqiy commit’lar. Har bosqich oxirida commit xabari taklif qil (Conventional Commits: `feat(catalog): …`, `fix(i18n): …`).

---

## 3. Stack va texnik qoidalar

- **Next.js (App Router), TypeScript strict.** Agar loyiha Pages Router’da bo‘lsa — migratsiya qilma, mavjudida qol va menga ayt.
- **Styling:** loyihadagi mavjud usul (Tailwind bo‘lsa — tokenlarni `tailwind.config` + CSS variables orqali). Yangi CSS-in-JS kutubxona qo‘shma.
- **Animatsiya:** `motion` (Framer Motion, `motion/react`). Sabab: `layoutId` (tab/pill indikator), `AnimatePresence` (menyu, drawer, accordion, success holat), `whileInView`. Boshqa animatsiya kutubxonasi qo‘shma. Smooth-scroll kutubxonasi (Lenis) — **qo‘shma**.
- **Ikonkalar:** `lucide-react` (`ArrowUpRight`, `ArrowRight`, `Download`, `Search`, `X`, `Menu`, `Package`, `Phone`, `MapPin`, `Check`, `Plus`, `SlidersHorizontal`, `Play`). stroke 1.8–2. **Emoji yo‘q.**
- **Shrift:** `next/font/google` → **Urbanist** (300/400/500/600, italic 400) + **Onest** (300/400/500/600) kirill uchun. Stack: `var(--font-urbanist), var(--font-onest), system-ui, sans-serif`. Urbanist lotinni, Onest kirillni avtomatik qoplaydi. `display: swap`, faqat kerakli subset’lar.
- **Rasmlar:** `next/image`, AVIF/WebP, `sizes` majburiy, hero `priority`. Monogramma PNG’lari shaffof — `unoptimized` emas, sifat 90.
- **Holat:** namuna qutisi — mavjud store bo‘lsa shuni ishlat, bo‘lmasa yengil `zustand` + `persist` (localStorage, kalit `gff-sample-box-v1`). Maks. 8 element.
- **Validatsiya:** `zod` (forma va API).
- **Xavfsizlik:** hech qanday token/kalit klientga chiqmasin. `.env.example` da faqat nomlar.

---

## 4. Dizayn tokenlari (yagona manba — `design/Styleguide.dc.html`)

### 4.1 Ranglar (CSS variables)
| Token | Hex | Ishlatilishi |
|---|---|---|
| `--navy` | `#0B0A3A` | Brend fon, asosiy tugma, hero paneli, header CTA |
| `--ink` | `#14132E` | Asosiy matn, kontur, ikonkalar |
| `--copper` | `#D6A27C` | **Yagona aksent**: CTA, forma foni, faol pill |
| `--copper-light` | `#E8C3A3` | Navy ustidagi aksent matn, slogan |
| `--copper-dark` | `#94603E` | Oq fondagi kichik aksent matn ("UZBEKISTAN", raqamlar) |
| `--panel` | `#F4EEE7` | Iliq fon bloklari, kartochkalar |
| `--slate` | `#26254A` | Ikkinchi qorong‘i karta (Muammo/Vazifa) |
| `--body` | `#4C4A5E` | Paragraf |
| `--muted` | `#615E72` | Yordamchi matn, label |
| `--line` | `#DCD2C7` | Bo‘lim chiziqlari, pill kontur |
| `--line-soft` | `#ECE4DA` | Jadval/karta chegaralari |
| `--white` | `#FFFFFF` | Sahifa foni |
| `--ok` | `#2E8B57` | Faqat "Omborda" nuqtasi |
| `--error` | `#8E2B2B` | Forma xatosi |

Qoidalar: bir ekranda bitta aksent; gradient, soya (box-shadow), emoji yo‘q; kategoriyalarga alohida rang **berilmaydi**.

### 4.2 Tipografiya (fluid, `clamp`)
| Rol | O‘lcham | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| Display (hero H1) | `clamp(36px, 6.4vw, 104px)` (RU: `clamp(34px, 5.6vw, 88px)`) | 400 | -0.035em | 0.96 |
| Sahifa H1 | `clamp(42px, 7vw, 120px)` | 400 | -0.04em | 0.92 |
| H2 | `clamp(33px, 5vw, 80px)` | 400 | -0.03em | 1 |
| Bo‘lim raqami "01." | `clamp(36px, 7vw, 112px)` | 300 | -0.04em | 0.9 |
| H3 | `clamp(26px, 2.4vw, 36px)` | 400 | -0.02em | 1.15 |
| Karta sarlavha | 24–26px | 500 | -0.02em | 1.15 |
| Body L | 18–19px | 400 | 0 | 1.55 |
| Body | 16–17px | 400 | 0 | 1.55 |
| Kichik | 14–15px | 400/500 | 0 | 1.45 |
| Label | 13px CAPS | 600 | +0.12em | 1 |
| Stat label | 13–15px italic | 400 | 0 | 1.3 |

### 4.3 Shakl va joylashuv
- Radius: `40` (bo‘lim bloklari, hero) · `36` (kartochka) · `28` (ichki rasm, jadval qutisi) · `24` (textarea, kichik plitka) · `999` (tugma, pill, input, kapsula).
- Konteyner: `max-width: 1408px; padding-inline: 16px`. Bloklar orasi 12–16px. Bo‘lim oralig‘i `clamp(80px, 9vw, 128px)`.
- Bo‘lim sarlavhasi patterni: yuqori va pastki 1px `--line` chiziq, chapda H2, o‘ngda "0N." raqam.
- Breakpoint’lar: `390` mobil · `768` planshet · `1080` header gamburgerga o‘tadi · `1440` desktop. Grid’lar `repeat(auto-fit, minmax(240–300px, 1fr))`.
- Teginish nishoni ≥ 44px. Fokus: `outline: 2px solid var(--ink); outline-offset: 3px` (navy fonda `--copper-light`).

### 4.4 Tugmalar
- Variantlar: `accent` (copper fon, ink matn, 600), `primary` (navy, oq), `outline` (1px ink), `ghost`, `icon` (doira 44/48/80/120).
- Balandlik: `sm 44` · `md 52` · `lg 56` · `xl 60`. Ichida `ArrowUpRight` (18px) ixtiyoriy.
- Holatlar: hover — fon 8% to‘qroq + strelka 45° burilib `ArrowRight` holatiga keladi; active — `scale(0.98)`; disabled — `--line-soft` fon, `#8A8796` matn; loading — matn o‘rnida spinner, kenglik saqlanadi.

---

## 5. Komponentlar (`components/`)

| Komponent | Tavsif |
|---|---|
| `Header` | Logo (mis monogramma + "GULF FLAVOURS & FRAGRANCES / UZBEKISTAN"), nav (5 ta), til switch (UZ·RU·EN segmented), "Namuna qutisi" CTA + hisoblagich. `<1080px` → logo + quti ikonkasi + gamburger. Props: `active`. |
| `MobileMenu` | Navy panel header ostida (radius 32, 16px chet): katta linklar (30px), til tugmalari, "Bepul namuna" copper CTA. |
| `Footer` | Panel fon, 4 ustun: brend+tagline+sertifikat pill’lari / Katalog / Kompaniya / Aloqa (manzil, telefon, email, Telegram, Instagram, ish vaqti). Pastki qator: ©, bosh ofis, maxfiylik. |
| `SectionHeader` | H2 + "0N." raqam + chiziqlar (ixtiyoriy: o‘ngda 2 ta doira rasm). |
| `Button`, `IconButton` | 4.4 bo‘yicha. |
| `Pill`, `Tag`, `CertPill`, `StockDot` | Kontur/fon variantlar. |
| `Tabs` | Pill tab’lar, faol fon `layoutId` bilan suriladi; mobil — gorizontal scroll, `flex-shrink: 0`. |
| `MonogramPanel` | Navy blok, markazda foto-monogramma, burchakda slogan, ixtiyoriy pill’lar va doira strelka. Props: `variant: joy|bliss|delight`, `cycle?: boolean`. |
| `CategoryCard` | Panel fon, 4:3 rasm (radius 28), nom, tavsif, "N pozitsiya" pill, navy doira strelka. |
| `ProductRow` (jadval) / `ProductCard` (grid) | Nom + SKU, guruh, shakl, dozirovka, holat, "+ Namunaga" toggle. **Kartochkada maks. 6 ta ma’lumot.** |
| `StatPill` | Oq/panel kapsula: italic label yuqorida, raqam o‘ngda pastda (count-up). |
| `ProblemSolution` | Slate "Muammo/Vazifa" + navy/copper "Yechim" juftligi. |
| `ProcessCapsules` | 4 kapsula: navy matn · foto · strelka · copper matn + ostida 4 qadam. |
| `SampleBoxBar` | Katalogda navy kapsula: "Namuna qutisi: N / 8" + copper "Qutiga o‘tish". |
| `SampleItemRow` | Nom, SKU · shakl, hajm segmented (25/50/100 g), o‘chirish. |
| `LeadForm` | Copper fon, oq pill input’lar, navy submit. Variantlar: `short` (bosh sahifa), `sample` (namuna qutisi), `contact` (so‘rov turi pill’lari bilan). Success holati — navy panel + mis monogramma. |
| `Accordion` (FAQ) | `<details>`-ga o‘xshash, lekin animatsiyali (8-bo‘lim). |
| `Breadcrumbs`, `SearchBox`, `EmptyState`, `DocRow` (yuklab olish) | — |

---

## 6. Sahifalar, route’lar va tarkib

Route’lar (`[locale]` segmenti: `uz` default prefiksiz, `/ru`, `/en`):

| Route | Dizayn fayli | Asosiy bloklar |
|---|---|---|
| `/` | `Main.dc.html`, `Main.ru.dc.html` | Hero (chap panel + navy MonogramPanel), 01 Biz haqimizda + sertifikatlar to‘ri + 4 StatPill, 02 Kategoriyalar (6), 03 Namuna qutisi (foto + Muammo/Yechim + 4 plitka), 04 Jarayon (kapsulalar + 4 qadam), 05 Sohalar (pill bulut), 06 Aloqa (ombor fotosi + "KERAKLI TA’MNI / BIRGA TOPAMIZ" + LeadForm) |
| `/catalog` | `Catalog.dc.html` | Sarlavha paneli (617), kategoriya Tabs, qidiruv + saralash + Jadval/Kartochka toggle, chapda filtrlar (Guruh, Shakl, Xususiyat), SampleBoxBar, natija qatori, jadval/grid, paginatsiya + "Yana ko‘rsatish", texnolog CTA |
| `/catalog/[slug]` | `Product.dc.html` | Breadcrumbs, galereya (asosiy + 3 qadoq fotosi: 1 kg flakon / 5 kg chelak / 10 kg kanistr), info panel (teglar, nom, SKU, holat, tavsif, 4 spec plitka, xususiyat pill’lari, namuna hajmi, CTA’lar), 01 Qo‘llanilishi, 02 Texnik hujjatlar, 03 Birga tanlanadi |
| `/samples` | `Samples.dc.html` | Sarlavha + 3 qadam kapsula, quti ro‘yxati + progress, buyurtma formasi → success, tayyor to‘plamlar, FAQ |
| `/industries` | `Industries.dc.html` | Hero + MonogramPanel(bliss), 14 soha kartochkasi, CTA kapsulalar |
| `/industries/[slug]` | `Industry.dc.html` | Hero (foto + matn + 2 stat), 01 Vazifa → yechim (3 juft), 02 Tavsiya etilgan mahsulotlar jadvali, 03 Tayyor to‘plam, boshqa sohalar |
| `/about` | `About.dc.html` | Hero + mis monogramma, 01 Bizning tarix (ombor fotosi + matn + 3 stat), 02 Sertifikatlar (6), 03 O‘zbekistondagi ofis + 4 afzallik, CTA triptix |
| `/contact` | `Contact.dc.html` | Kontakt kartalari, xarita bloki (Google Maps link; iframe faqat cookie roziligidan keyin), LeadForm(contact) |
| `/search?q=` | `Search.dc.html` | Katta qidiruv input, ommabop so‘rovlar, Hammasi/Mahsulotlar/Sohalar tab, natijalar, EmptyState |
| `/privacy` | `Privacy.dc.html` | Mundarija + 8 bo‘lim (matn yurist tasdig‘idan keyin) |
| `not-found` | `NotFound.dc.html` | Navy panel "404" + kofe monogramma, qidiruv, 3 link |

Mobil ko‘rinish: `*.mobile.dc.html` (390px) — xuddi shu sahifalar tor ekranda; ular **alohida layout emas**, responsiv CSS natijasi.

---

## 7. Ma’lumotlar

### 7.1 Mahsulot modeli (mavjud modelga moslashtir, maydonlar yo‘q bo‘lsa — qo‘sh)
```ts
type Product = {
  sku: string;            // "GFFD6832"
  slug: string;           // "vanilla-premium-flavour-gffd6832"
  name: string;           // ingliz nomi (barcha tillarda bir xil)
  category: 'flavours' | 'fragrances' | 'ingredients' | 'essential-oils' | 'aroma-chemicals' | 'commodities';
  group: string;          // i18n kaliti: 'sweet-dessert', 'fruit', 'berry', ...
  form: 'liquid' | 'powder' | 'oil-based';
  dosage: { min: number; max: number; unit: '%' };
  packs: number[];        // [1, 5, 10, 25] kg
  stock: 'in_stock' | 'made_to_order';
  badges: ('halal' | 'gmo_free' | 'alcohol_free' | 'heat_stable' | 'natural')[];
  applications: string[]; // soha slug’lari
  documents: { type: 'spec' | 'coa' | 'tds' | 'msds' | 'halal'; url: string }[];
  isFeatured?: boolean;   // faqat haqiqiy top-10 — "Best-seller" hammaga emas
};
```
- Kategoriya soni (617 / 354 / 64 / 95 / 40 / 40 / 24) — **hardcode qilinmaydi**, ma’lumotdan hisoblanadi.
- Dizayndagi SKU’lar eski sayt skrinshotidan olingan — haqiqiy bazadan tekshir.

### 7.2 Namuna qutisi
- Element: `{ sku, size: 25 | 50 | 100 }`, default `50`. Maks. 8; 9-chisi qo‘shilmaydi → toast "Qutida 8 ta joy bor".
- Header hisoblagichi, katalog bar’i, mahsulot sahifasi tugmasi — bitta store’dan.
- Tayyor to‘plamlar (`Samples`): ma’lumotdan (sohaga bog‘langan 5 SKU), hardcode emas.

---

## 8. Animatsiyalar — qayerda va qanday

### 8.1 Global tokenlar
```ts
export const ease = {
  out: [0.16, 1, 0.3, 1],      // out-expo — barcha kirishlar
  inOut: [0.65, 0, 0.35, 1],   // almashinuvlar
};
export const dur = { fast: 0.16, base: 0.32, slow: 0.6, reveal: 0.7 }; // soniya
export const stagger = 0.06;   // maks. 8 element, keyingilari darhol
```
**Qoidalar:**
- Faqat `transform` va `opacity` animatsiya qilinadi (layout, width, height emas — accordion bundan mustasno, u `height: auto` + motion).
- Kirish animatsiyalari **bir marta** (`viewport={{ once: true, amount: 0.2 }}`).
- `prefers-reduced-motion: reduce` → barcha harakat o‘chadi, faqat 200ms opacity qoladi; monogramma almashinuvi va count-up to‘xtaydi (yakuniy qiymat darhol ko‘rinadi).
- Sahifa yuklanishida hero kontenti **SSR’da ko‘rinadigan** bo‘lsin (FOUC/CLS bo‘lmasin). Boshlang‘ich `opacity: 0` faqat JS yuklangandan keyin qo‘llanadi (`data-motion-ready` yoki `useReducedMotion` + mount flag).
- Mobil (<768px): stagger 40ms, masofa 16px, parallax yo‘q.

### 8.2 Asosiy primitivlar (`components/motion/`)
| Primitiv | Xatti-harakat |
|---|---|
| `<Reveal>` | `y: 24 → 0`, `opacity: 0 → 1`, `dur.reveal`, `ease.out`, `delay` prop. |
| `<RevealGroup>` | Bolalarga `stagger` bilan Reveal. |
| `<SplitLines>` | Sarlavha satrlari: har satr `overflow: hidden` ichida, matn `y: 100% → 0`, 700ms, satrlar orasi 80ms. `<br>` bo‘yicha bo‘linadi (so‘z bo‘yicha emas). |
| `<CountUp>` | Ko‘rinishga kirganda 0 → qiymat, 1.2s, `ease.out`, `Intl.NumberFormat` (lokal). "2002" kabi yillar **count-up qilinmaydi**. |
| `<MonogramCycle>` | 3 foto-monogramma (berries → citrus → coffee) va slogan (Joy → Bliss → Delight) har 4.5s: eskisi `opacity 1→0, scale 1→0.96`, yangisi `opacity 0→1, scale 1.04→1`, 900ms `ease.inOut`. Hover’da va tab ko‘rinmaganda (`visibilitychange`) pauza. |
| `<FlyToBox>` | "+ Namunaga" bosilganda tugmadan header’dagi quti ikonkasiga 10px copper nuqta parabola bo‘ylab uchadi (500ms), keyin hisoblagich `scale 1 → 1.25 → 1` (300ms). |

### 8.3 Sahifa va komponentlar bo‘yicha
| Joy | Trigger | Animatsiya |
|---|---|---|
| **Header** | scroll > 24px | Fon shaffofdan oqqa, pastki 1px `--line-soft` chiziq paydo bo‘ladi (200ms). |
| Header | pastga scroll > 120px / tepaga scroll | Header `y: -100%` yashirinadi / qaytadi (320ms `ease.out`). Menyu ochiq bo‘lsa yashirinmaydi. |
| Nav link | hover | Pastki 2px chiziq `scaleX 0 → 1` chapdan (200ms). Faol sahifada doim ko‘rinadi. |
| Til switch | bosish | Faol fon `layoutId="lang"` bilan suriladi (320ms). |
| **MobileMenu** | ochish/yopish | Panel `y: -12, opacity 0 → 0/1` (320ms), linklar 40ms stagger bilan `y: 12 → 0`. Gamburger ikonka X ga 180ms rotate bilan almashadi. Body scroll lock. ESC va tashqariga bosish yopadi. |
| **Hero (bosh sahifa)** | sahifa yuklanishi | Chap panel `opacity 0→1` (400ms) → chip (100ms delay) → H1 `SplitLines` (200ms delay) → paragraf va tugmalar `Reveal` (600ms delay, stagger). O‘ng navy panel: `scale 0.97 → 1, opacity 0 → 1` (700ms), monogramma 300ms keyin. Sertifikat pill’lari o‘ngdan `x: 12 → 0`, 60ms stagger. |
| Hero monogramma | doimiy | `MonogramCycle` (8.2). |
| Hero doira strelka (80px) | hover | Fon `--copper`, strelka 45° buriladi (160ms). |
| **Bo‘lim sarlavhasi** (`SectionHeader`) | ko‘rinishga kirish | Yuqori chiziq `scaleX 0 → 1` chapdan (700ms), H2 `SplitLines`, "0N." raqam `y: 40% → 0` + opacity (100ms delay). |
| **StatPill** | ko‘rinish | `RevealGroup` + raqamlar `CountUp` (617, 6, 8). |
| Sertifikat to‘ri | ko‘rinish | Kataklar 40ms stagger bilan `opacity 0 → 1` (harakatsiz). |
| **CategoryCard** | ko‘rinish | `RevealGroup` (3 ustun → qator bo‘yicha). |
| CategoryCard | hover | Rasm `scale 1 → 1.04` (600ms `ease.out`, rasm konteyner ichida). Fon `--panel` → 4% to‘qroq. Doira strelka −45° → 0° va `x: 0 → 4px`. Kursor: pointer, butun karta link. |
| **Namuna bloki** | ko‘rinish | Foto bloki `clip-path: inset(0 0 100% 0) → inset(0)` (900ms `ease.out`) — clip-path GPU’da ishlaydi; Muammo/Yechim kartalari 120ms farq bilan Reveal; 4 plitka stagger. |
| **ProcessCapsules** | ko‘rinish | Kapsulalar chapdan `x: -32 → 0`, 80ms stagger. Strelka kapsulasida strelka `x: 0 → 8px → 0` cheksiz (2.4s, `ease.inOut`) — faqat ko‘rinib turganda. |
| **Soha pill’lari** (bosh sahifa) | ko‘rinish | Pill’lar `rotate: 0 → o‘z burchagi`, `y: 16 → 0`, 30ms stagger. Hover — fon navy, matn oq (160ms), burchak 0° ga qaytadi. |
| **Aloqa triptixi** | ko‘rinish | 3 panel 100ms stagger bilan Reveal; copper doira (120px) `scale 0.8 → 1` (ease.out, biroz overshoot `[0.34,1.56,0.64,1]`). |
| Forma input | fokus | Halqa `--navy` 2px (160ms). Xato — input chegarasi `--error`, xabar `y: -4 → 0` paydo bo‘ladi; birinchi xato maydoniga fokus o‘tadi. |
| Forma submit | yuborish | Tugma: spinner (kenglik saqlanadi) → success: forma `opacity 1 → 0` (200ms), navy success paneli `y: 16 → 0` (500ms) + mis monogramma `scale 0.9 → 1`. |
| **Katalog tabs** | bosish | Faol fon `layoutId="cat-tab"` bilan suriladi (320ms). Ro‘yxat: eski elementlar `opacity → 0` (120ms), yangilari 30ms stagger bilan (faqat birinchi 12 tasi). URL `?category=` yangilanadi. |
| Jadval/Kartochka toggle | bosish | Segmented fon `layoutId="view"`; kontent `AnimatePresence mode="wait"` crossfade 200ms. |
| Filtrlar (mobil) | "Filtrlar" tugmasi | Pastdan bottom-sheet: `y: 100% → 0` (400ms `ease.out`), orqa fon `rgba(11,10,58,0.4)` fade. Yopish — swipe down yoki X. Desktop’da sidebar animatsiyasiz. |
| Checkbox filtr | bosish | Natija soni qatorida raqam `CountUp` (300ms). |
| "+ Namunaga" | bosish | Tugma kenglikni saqlab "Qo‘shildi ✓" ga crossfade (200ms) + `FlyToBox`. Qayta bosish — olib tashlaydi (uchish yo‘q). |
| SampleBoxBar | qo‘shilganda | Raqam `y: 100% → 0` almashadi (odometer effekti, 300ms). |
| **Mahsulot galereyasi** | thumbnail bosish | Asosiy rasm crossfade 300ms; faol thumbnail 2px navy halqa. Mobil — gorizontal swipe (scroll-snap). |
| Namuna hajmi (25/50/100) | bosish | Faol fon `layoutId="size"` (320ms). |
| Hujjat qatori | hover | Yuklab olish doirasi navy bo‘ladi, ikonka `y: 0 → 2px → 0` (400ms). |
| **Namuna qutisi sahifasi** | element o‘chirish | Qator `opacity 1 → 0, x: 0 → -24` (250ms), keyin qolganlar `layout` bilan joyiga suriladi. Progress bar `scaleX` (originX 0) 400ms. |
| Tayyor to‘plam | "To‘plamni qo‘shish" | Kartadan 5 ta nuqta ketma-ket (60ms) `FlyToBox`; ro‘yxatga yangi qatorlar stagger bilan kiradi. |
| **FAQ** | ochish | Balandlik `0 → auto` (320ms `ease.out`), matn `opacity` 100ms kechikib; "+" ikonka 45° → "×". Bir vaqtda bitta ochiq. |
| **Sohalar sahifasi** | ko‘rinish | 14 karta `RevealGroup` (maks. 8 stagger). Karta hover: rasm zoom 1.04, strelka −45° → 0°. Navy/copper kartalar hover’da 4% to‘qroq. |
| **Qidiruv** | yozish | 200ms debounce; natijalar `AnimatePresence` (ro‘yxat, 30ms stagger, maks. 10). Bo‘sh holat — navy panel Reveal. Mos qism `<mark>` (copper-light fon) bilan ajratiladi. |
| **404** | yuklanish | "404" raqami `SplitLines`; kofe monogramma sekin `y: 0 → -6px → 0` "nafas" (4s, cheksiz, ease.inOut). |
| Sahifa o‘tishi | route change | `template.tsx` da kontent `opacity 0 → 1` (200ms). Header/footer qayta animatsiya qilinmaydi. |
| Barcha tugmalar | hover / active | 4.4 bo‘yicha (160ms). |
| Footer linklar | hover | Pastki chiziq chapdan o‘sadi (200ms). |

### 8.4 Performance qoidalari
- `will-change` faqat animatsiya vaqtida.
- Cheksiz animatsiyalar (`MonogramCycle`, strelka, 404 nafas) — `IntersectionObserver` bilan faqat ekranda ishlaydi.
- Rasmlar `clip-path` va `scale` bilan — ota konteyner `overflow: hidden`, `contain: paint`.
- CLS = 0: barcha rasm konteynerlarida `aspect-ratio` yoki aniq balandlik.

---

## 9. Responsiv qoidalar
- Barcha `flex` qatorlar `flex-wrap: wrap`, ustunlar `flex: 1 1 <basis>px; min-width: 0`.
- **<1080px:** header → gamburger.
- **<900px:** katalog filtrlar → "Filtrlar" tugmasi + bottom-sheet; default ko‘rinish — kartochka.
- **<768px:** hero ikki panel ustma-ust; monogramma paneli `min-height: clamp(408px, 47vw, 680px)`; kapsulalar balandligi `clamp(120px, 14vw, 200px)`; jadvallar o‘z qutisida gorizontal scroll (`overflow-x: auto`, `min-width: 820–920px`).
- Kategoriya tab’lari hamma o‘lchamda bitta qator, gorizontal scroll, scrollbar yashirin, chetida 24px fade-mask.
- Mobil uchun **sticky pastki CTA** (faqat mahsulot va katalog sahifalarida, <768px): "+ Namunaga" / "Qutiga o‘tish (N)" — 56px, safe-area inset bilan.
- Shrift o‘lchamlari faqat `clamp` (media query’siz).

---

## 10. i18n
- Tillar: `uz` (default, prefiksiz `/`), `ru` (`/ru`), `en` (`/en`). Mavjud i18n kutubxonasi bo‘lsa — o‘sha; yo‘q bo‘lsa `next-intl`.
- **Barcha matnlar dictionary’da**, komponentda hardcode matn yo‘q. Mahsulot nomlari (inglizcha) tarjima qilinmaydi.
- Ko‘plik: ICU plural (`ru`: позиция / позиции / позиций; `uz`: "617 pozitsiya" — o‘zgarmaydi).
- **Placeholder testi:** CI’da render qilingan HTML’da `{` + harf + `}` patterni topilsa test yiqilsin.
- Slogan "A sense of Joy / Bliss / Delight" barcha tillarda inglizcha qoladi.
- O‘zbek matnida apostrof: `o‘`, `g‘` (U+2018), tutuq belgisi `’` (U+2019).
- `hreflang` va `alternate` link’lar, til switch joriy sahifaning o‘sha tildagi versiyasiga olib boradi.
- RU uchun tayyor matnlar: `design/Main.ru.dc.html`, Header/Footer `lang` dictionary’lari. Qolgan RU/EN matnlarni tarjima qil va menga tekshirish uchun alohida ro‘yxat ber.

---

## 11. Formalar va lead’lar
- Formalar: `short` (bosh sahifa), `sample` (namuna qutisi + tanlangan SKU va hajmlar), `contact` (so‘rov turi: Namuna / Narx so‘rovi / Texnik savol / Hamkorlik).
- `POST /api/leads` → `zod` validatsiya → **Telegram bot** xabari (formatlangan: tur, ism, kompaniya, telefon, hudud, SKU ro‘yxati, UTM, sahifa URL, til) → muvaffaqiyat javobi.
- Env: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (faqat serverda). Keyinchalik CRM webhook uchun `LEAD_WEBHOOK_URL` (ixtiyoriy).
- Spam himoyasi: honeypot maydon, IP bo‘yicha rate limit (5/10 daqiqa), minimal to‘ldirish vaqti 3s.
- Telefon: `+998` maska, 12 raqam tekshiruvi.
- UTM parametrlari (`utm_*`, `gclid`, `fbclid`) birinchi tashrifda sessionStorage’ga saqlanadi va lead bilan yuboriladi.
- Rozilik checkbox’i majburiy (Privacy sahifasiga link).

---

## 12. Analytics
- GTM konteyner (`NEXT_PUBLIC_GTM_ID`), GA4 va Meta Pixel GTM orqali. Cookie banner (minimal, panel uslubida) — roziliksiz faqat zarur cookie’lar.
- `dataLayer` hodisalari:
  `sample_add` {sku, size, source} · `sample_remove` · `sample_set_add` {industry} · `sample_submit` {count} · `lead_submit` {type} · `phone_click` · `telegram_click` · `instagram_click` · `email_click` · `doc_download` {sku, type} · `catalog_filter` {key, value} · `catalog_view_toggle` · `search` {q, results} · `lang_switch` {from, to}.
- Asosiy konversiyalar: `sample_submit`, `lead_submit`, `phone_click`.

---

## 13. SEO
- Har sahifada `generateMetadata`: title (≤ 60), description (≤ 155), OG rasm (navy fon + monogramma + sarlavha, `next/og` bilan generatsiya).
- `sitemap.xml` (barcha til versiyalari, mahsulot va soha sahifalari), `robots.txt`.
- JSON-LD: `Organization` (logo, kontaktlar, `sameAs`: Telegram, Instagram, gulfflavours.ae), `Product` (narxsiz: `sku`, `brand: Gulf Flavours & Fragrances`, `category`), `BreadcrumbList`, `FAQPage` (namuna qutisi FAQ).
- Slug: `kebab-case`, SKU bilan (`vanilla-premium-flavour-gffd6832`), barcha tillarda bir xil slug.
- Canonical va `hreflang` (uz, ru, en, x-default → uz).
- Rasm `alt` matnlari dictionary’dan.

---

## 14. Kirish imkoniyati va sifat
- Semantik HTML: `header/nav/main/section/footer`, bitta `h1`, tartibli sarlavhalar.
- Haqiqiy `<button>`, `<a>`, `<label>`; ikonka-tugmalarda `aria-label`; tab’lar `role="tablist"`; segmented `role="radiogroup"`.
- Kontrast: matn ≥ 4.5:1 (copper fon ustida faqat `--ink` / `#2A2850` matn).
- Klaviatura: menyu, bottom-sheet, accordion — fokus tuzog‘i va ESC.
- Performance byudjeti: LCP < 2.5s (4G mobil), CLS < 0.05, JS (birinchi sahifa) < 180 KB gzip.

---

## 15. Kontent va aktivlar

**Kontaktlar (hamma joyda shular):**
- Telefon: **+998 97 570 77 60** (`tel:+998975707760`)
- Telegram: **@GFF_uzb** (`https://t.me/GFF_uzb`)
- Instagram: **@gulfflavour.uz** (`https://instagram.com/gulfflavour.uz`)
- Email: **info@gulfflavour.uz** ⚠️ *mijoz "info@gulfflovour.uz" deb yozgan — ishga tushirishdan oldin to‘g‘ri yozilishini tasdiqlash shart*
- Manzil: Toshkent, Mirzo Ulug‘bek tumani, Mustaqillik shoh ko‘chasi, 128
- Ish vaqti: Du–Ju 09:00–18:00, Sha 10:00–15:00
- Bosh ofis: Gulf Flavours & Fragrances FZCO, P.O. Box 18129, Jebel Ali Free Zone, Dubay, BAA · +971 4 883 3923

**Aktivlar (`design/assets/` → `public/images/`):**
- Brend: `monogram-copper.png` (logo), `monogram-berries.png` (Joy), `monogram-citrus.png` (Bliss), `monogram-coffee.png` (Delight). ⚠️ Vaqtinchalik — ota-kompaniyadan vektor (SVG) olinadi.
- Mijozning haqiqiy fotolari: `warehouse.jpg` (Toshkent ombori), `pack-1kg.jpg`, `pack-5kg.jpg`, `pack-10kg.jpg` — ustunlik shularga.
- Stock (Unsplash, bepul litsenziya): kategoriya va soha fotolari — keyin GFF fotolari bilan almashtiriladi.
- Ombor fotosini bosh sahifa "Aloqa" bloki va "Kompaniya" tarix blokida ishlat.

**Hali yo‘q (placeholder qoldir va `CLAUDE.md` TODO’ga yoz):** minimal buyurtma hajmi (MOQ), distributorlik sertifikati PDF, maxfiylik siyosatining yuridik matni, hujjatlar PDF’lari, ishlab chiqarish videosi.

---

## 16. Bosqichlar va qabul mezonlari

| # | Bosqich | Qabul mezoni |
|---|---|---|
| 0 | Audit + `CLAUDE.md` + reja | Reja tasdiqlandi; placeholder bug’ining sababi yozildi |
| 1 | Tokenlar, shriftlar, `Button`/`Pill`/`Tabs`/`SectionHeader`, motion primitivlari | `/styleguide` (faqat dev) sahifasi `design/Styleguide.dc.html` bilan mos |
| 2 | Header (desktop + mobil menyu), Footer, layout, i18n skeleti | 3 tilda navigatsiya ishlaydi; 390/768/1080/1440 da tekshirildi |
| 3 | Katalog + mahsulot sahifasi + namuna qutisi store | Filtr/tab URL’da; "+ Namunaga" → header hisoblagichi; 617 ma’lumotdan |
| 4 | Namuna qutisi sahifasi + `/api/leads` + Telegram | Test lead Telegram’ga keldi (SKU, hajm, UTM bilan) |
| 5 | Bosh sahifa | Barcha 8.3 animatsiyalari; Lighthouse mobil ≥ 90 |
| 6 | Sohalar, soha, kompaniya, aloqa, qidiruv, 404, maxfiylik | Har biri dizayn bilan mos |
| 7 | SEO, analytics, cookie banner | Sitemap, JSON-LD validatsiyadan o‘tdi; dataLayer hodisalari GTM Preview’da ko‘rinadi |
| 8 | QA | Placeholder testi yashil; a11y ≥ 95; reduced-motion tekshirildi; Safari iOS va Android Chrome’da tekshirildi |

Har bosqich oxirida: nima qilinganini, qolgan savollarni va commit xabarini qisqa yoz.

---

## 17. Qilinmasin
- Yangi rang, gradient, soya, emoji, kategoriya ranglari.
- Hamma mahsulotga "Best-seller".
- Komponentlarda hardcode matn yoki son (617 va hokazo).
- Klientda token/kalit.
- So‘ralmagan refaktoring yoki arxitekturani almashtirish.
- Lenis, GSAP yoki boshqa ikkinchi animatsiya kutubxonasi.
- Monogrammani cho‘zish, rangini o‘zgartirish yoki oq fonda foto-monogramma ishlatish.
