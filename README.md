# GFF Uzbekistan — Gulf Flavours & Fragrances rasmiy sayti

**Gulf Flavours & Fragrances FZCO** (Jebel Ali, Dubay) mahsulotlarining **O‘zbekistondagi rasmiy va yagona distribyutori** uchun B2B veb-sayt.

Saytning asosiy maqsadi — **lead (zayvka) yig‘ish**: har bir sahifa, har bir blok va har bir filtr mijozni ariza yuborishga olib boradi. Ikkinchi maqsad — katalogni **ko‘rish va filtrlash**: 617 ta mahsulot, 49 guruh, 6 kategoriya, 19 qo‘llash sohasi, 3 tilda (uz / ru / en).

> Ishlab chiqaruvchi haqida: [gulfflavours.ae](https://gulfflavours.ae) · Sertifikatlar: HALAL, ISO 22000, HACCP, SGS, RACS, Trakhees, EAC.

---

## 1. Tez boshlash

Talab: **Node.js ≥ 20.9**, npm.

```bash
npm install            # postinstall shriftlarni public/fonts ga nusxalaydi
cp .env.example .env.local   # keyin kerakli qiymatlarni to'ldiring
npm run dev            # http://localhost:3000  → /uz ga yo'naltiradi
```

Production:

```bash
npm run build          # prepare:assets (shrift + katalog) + next build (standalone)
npm start              # scripts/start.mjs → .next/standalone/server.js (0.0.0.0:3000)
```

> **Nega `next start` emas?** `next.config.ts` da `output: 'standalone'` yoqilgan
> (Docker uchun zarur). Next'ning o'zi bu rejimda `next start` ishlamasligini
> ogohlantiradi, shuning uchun `npm start` standalone serverni ishga tushiradi va
> oldindan `.next/static` + `public` fayllarini nusxalaydi.
>
> **MUHIM — lead papkasi.** Standalone `server.js` ichida `process.chdir(__dirname)`
> bor, ya'ni `process.cwd()` → `.next/standalone`. Agar lead yo'li nisbiy bo'lsa,
> arizalar BUILD papkasiga yoziladi va keyingi `next build` ularni o'chiradi.
> `scripts/start.mjs` shuning uchun `LEAD_STORAGE_PATH` ni avtomatik
> `<loyiha>/data/leads` (mutlaq yo'l) qilib o'rnatadi; Docker'da esa
> `LEAD_STORAGE_PATH=/app/data/leads` va volume shu nuqtaga ulanadi.

Foydali skriptlar:

| Skript | Vazifasi |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Shriftlar + katalog JSON + production build |
| `npm start` | Production server (standalone + statik fayllarni tayyorlaydi) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run catalog:build` | `data/source/*.json` → `src/data/catalog.json` |

---

## 2. Arxitektura

**Next.js 16 (App Router) + TypeScript + Tailwind CSS v4.** Hech qanday CMS, ORM yoki tashqi baza yo‘q — katalog build vaqtida statik JSON’dan yig‘iladi, leadlar esa fayl tizimida (JSONL) saqlanadi. Bu saytni istalgan joyda (VPS, Vercel, Docker) bir xil ishlatish imkonini beradi.

```
src/
├── app/
│   ├── [locale]/                 # til segmenti: html/body, provider'lar
│   │   ├── (site)/               # SAYT qobig'i: Header/Footer + barcha ochiq sahifalar
│   │   │   ├── page.tsx          #   bosh sahifa
│   │   │   ├── catalog/          #   katalog + filtrlar (URL-sync)
│   │   │   ├── product/[slug]/   #   mahsulot sahifasi + inline zayvka
│   │   │   ├── samples/          #   TEST BOX: savat + zayvka
│   │   │   ├── quote/            #   narx so'rovi (RFQ)
│   │   │   ├── industries/       #   19 ta tarmoq "yechim" sahifalari
│   │   │   ├── about|contact|privacy|terms/
│   │   ├── (admin)/admin/        # ADMIN PANEL (marketing qobig'isiz)
│   │   │   ├── login/            #   parol bilan kirish
│   │   │   └── (panel)/          #   dashboard, leads, leads/[id]
│   │   ├── layout.tsx            #   html/body + I18n/Toast/SampleBox provider'lar
│   │   ├── not-found.tsx         #   404 (lead yo'qotmaslik uchun to'liq CTA bilan)
│   │   └── error.tsx             #   xato chegarasi (3 tilda)
│   ├── api/
│   │   ├── leads/                #   POST zayvka qabul qilish pipeline
│   │   ├── admin/{login,logout,stats,leads,leads/[id],leads/export}/
│   │   └── {catalog,suggest,health}/
│   ├── sitemap.ts  robots.ts  manifest.ts
│   └── layout.tsx                # pass-through ildiz layout
├── components/
│   ├── ui/                       # dizayn tizim: Button, Field, Badge, Modal, Toast…
│   ├── layout/                   # Header, Footer, StickyCta, LocaleSwitcher, Breadcrumb
│   ├── catalog/                  # CatalogExplorer, FilterPanel, FacetGroup, ProductCard
│   ├── lead/                     # LeadForm (sehrgar), PhoneInput, Turnstile
│   ├── sample/                   # SampleBoxProvider + Editor + RequestForm
│   ├── product/ home/ admin/ legal/ i18n/ seo/
├── i18n/                         # uz / ru / en lug'atlari (530+ kalit) + tiplar
├── lib/
│   ├── catalog.ts                # SERVER-ONLY: queryCatalog, facetlar, statistika
│   ├── filters-url.ts            # klient-xavfsiz URL⇄filtr konvertori (0 import)
│   ├── taxonomy.ts               # 3 tilli taksonomiya: kategoriya/guruh/ilova/shakl
│   ├── catalog-copy.ts           # mahsulot tavsiflari generatori (3 tilda)
│   ├── search.ts                 # kirill→lotin, tokenizatsiya, Levenshtein, "balki:"
│   ├── leads/{schema,store,antispam,notify}.ts
│   ├── {auth,guard,seo,config,utils,nav,legal,industry-copy}.ts
├── proxy.ts                      # Next 16 middleware: til aniqlash + admin himoyasi
data/
├── source/*.json                 # xom ma'lumot (gulfflavours.ae/.ru dan yig'ilgan)
└── leads/                        # RUNTIME: oylik JSONL lead jurnallari (git'da yo'q)
scripts/
├── build-catalog.mjs             # xom → src/data/catalog.json (617 mahsulot)
└── copy-fonts.mjs                # fontsource → public/fonts (o'z-o'zi host)
```

### Nega shunday qarorlar?

- **Route group `(site)` / `(admin)`.** Admin panel marketing Header/Footer’isiz ochiladi — toza, tez va xavfsizroq. URL’lar o‘zgarmaydi (`/uz/admin`).
- **`src/lib/filters-url.ts` alohida.** U **hech narsa import qilmaydi**, shuning uchun klient bundle’ga kiradi; `catalog.ts` esa `catalog.json` (305 KB) yuklaydi va faqat serverda qoladi. Bu qoidani buzish birinchi navbatda bundle hajmini portlatadi.
- **Shriftlar o‘zimizda host qilinadi** (`@fontsource-variable` + `copy-fonts.mjs` + qo‘lda `@font-face`). Google Fonts’ga bog‘liqlik yo‘q — O‘zbekistonda tezroq va GDPR-xavfsiz.
- **`data/leads` fayl bazasi.** JSONL, oylik fayllar, atomar yozuv. Baza o‘rnatish shart emas; Docker’da volume bilan uzluksiz. Yo‘l `LEAD_STORAGE_PATH` orqali sozlanadi (bo‘sh bo‘lsa `<cwd>/data/leads`) — **mutlaq yo‘l tavsiya etiladi**, chunki standalone server `chdir` qiladi.

---

## 3. Lead yig‘ish (saytning yuragi)

### Zayvka turlari

`sample` (test box) · `quote` (RFQ) · `product` (mahsulot bo‘yicha) · `callback` · `contact` · `catalog`

### Pipeline — `POST /api/leads`

1. **IP rate limit** (sliding window) → 429
2. Hajm chegarasi **256 KB**
3. **Zod v4 validatsiya** — xatolar maydon-xaritasi sifatida qaytadi (`err.*` kalitlari, 3 tilda)
4. **Honeypot** (`website_url`) — botlar javobni "muvaffaqiyatli" deb oladi (silent 200)
5. **Cloudflare Turnstile** (sozlangan bo‘lsa)
6. **Spam bali** (0–100): bepul pochta, umumiy xabar, INN yo‘qligi va h.k. ≥80 → avtomatik `spam`
7. **Dublikat himoyasi** (bir xil telefon+tip qisqa vaqt ichida)
8. **SKU boyitish** (test box mahsulotlari nom/slug bilan)
9. `createLead` → `GFF-YYYY-DDD-####` raqami, JSONL yozuv
10. **notifyAll**: Telegram bot + SMTP e-mail + webhook (qaysi biri sozlangan bo‘lsa)
11. `201 { ref, quality, spamScore, status, notified }`

### Sifat bali (lead scoring)

Telefon +20, e-mail +10, lavozim +8, kompaniya +15, **STIR/INN +12**, biznes turi +8, hudud +5, shahar +3, mahsulotlar +4/ta (max 20), hajm +8, katta hajm +7, muntazam +6, uzun xabar +5, `sample` +6, `quote` +10; bepul pochta domeni −6. Admin panel ustuvorlikni shu ball bo‘yicha ko‘rsatadi.

### Test box (namuna qutisi)

- Katalogdagi har bir mahsulot kartasida **"boxga qo‘shish"** — holat `localStorage`’da (`gff_sample_box_v2`), sahifalar orasida saqlanadi.
- `/samples` sahifasida: miqdor stepper’i (25/50/100/250/500 g), izoh, o‘chirish, tozalash, **tayyor to‘plamlar** (novvoyxona, sut, ichimlik…), yetkazib berish muddati.
- Bitta zayvka = bitta lead, ichida butun SKU ro‘yxati. Muvaffaqiyatdan keyin box tozalanadi.

### Antispam va xavfsizlik

- Honeypot + minimal vaqt chegarasi + IP rate limit + spam bali + Turnstile.
- Admin: **HMAC-imzolangan httpOnly cookie**, parol `timingSafeEqual`, 6 urinish / 15 daqiqa blok.
- Javob sarlavhalari: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`; API’da `Cache-Control: no-store`.

---

## 4. Katalog va filtrlar

`queryCatalog()` — yagona filtr mantiqi; sahifa ham, `GET /api/catalog` ham shundan foydalanadi (natijalar har doim bir xil).

- **Filtr o‘lchovlari:** qidiruv (kirill/lotin, "balki: vanil" taklifi), kategoriya, guruh (49), qo‘llash sohasi (19), shakl, xususiyat (halol, issiqlikka chidamli, spirtsiz, GMO’siz, vegan…), qadoq (1/5/10/25 kg…), mavjudlik, maksimal doza, faqat yangi/top.
- **Saralash:** mashhurlik, yangilik, nom (A–Z / Z–A), doza (↑/↓), SKU.
- **Holat URL’da:** `?categories=bakery&groups=vanilla&dose=0.5&sort=pop&page=2` — havola almashish, xatcho‘p va "orqaga" tugmasi to‘g‘ri ishlaydi.
- **Facet hisobi:** har bir filtr qiymati yonida *joriy tanlov asosida* nechta mahsulot borligi ko‘rsatiladi.
- Ko‘rinishlar: grid / ro‘yxat; "Yana ko‘rsatish" — `/api/catalog` orqali (sahifa qayta yuklanmaydi).

---

## 5. Admin panel — `/admin`

Kirish: `/{til}/admin/login` (proxy `/admin*` ni himoya qiladi). Panel marketing qobig‘isiz, 3 tilda.

- **Dashboard:** bugun / 7 kun / ko‘rilmagan / yopilgan / spam; tur-holat-hudud taqsimoti; 14 kunlik dinamika; eng ko‘p so‘ralgan mahsulotlar; so‘nggi arizalar.
- **Arizalar:** qidiruv, holat/tur/davr filtrlari (URL’da), saralash, sahifalash, **CSV eksport** (Excel uchun UTF-8 BOM, `;` ajratgich).
- **Ariza tafsiloti:** to‘liq ma’lumot + mahsulotlar jadvali + manba/UTM + bildirishnoma holati + tarix + izohlar; holatni o‘zgartirish, izoh qo‘shish, spam belgisi — barchasi `PATCH /api/admin/leads/[id]`.
- Saqlash holati va bildirishnoma kanallari (Telegram/SMTP/webhook) yon panelda jonli ko‘rinadi.

### Sozlash

```bash
ADMIN_PASSWORD="kuchli-parol"          # bo'lmasa panel UMUMAN ochilmaydi
ADMIN_SECRET="$(openssl rand -hex 32)" # HMAC kalit — ALMASHTIRISH SHART
```

---

## 6. Muhit o‘zgaruvchilari

To‘liq ro‘yxat va izohlar: **`.env.example`**. Asosiylari:

| Guruh | O‘zgaruvchilar |
| --- | --- |
| Sayt | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`, ijtimoiy tarmoqlar |
| Aloqa | `NEXT_PUBLIC_PHONE_*`, `NEXT_PUBLIC_*EMAIL`, `NEXT_PUBLIC_ADDRESS*`, `NEXT_PUBLIC_WORK_HOURS` |
| Biznes | `SAMPLE_BOX_MAX_ITEMS`, `SAMPLE_DELIVERY_DAYS`, `MIN_ORDER_KG`, `DISCOUNT_THRESHOLD_KG`, `RESPONSE_MINUTES`, `VOLUME_DISCOUNT_PCT` |
| Bildirishnoma | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SMTP_*`, `LEAD_WEBHOOK_URL` |
| Xavfsizlik | `ADMIN_PASSWORD`, `ADMIN_SECRET`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` |
| SEO | `YANDEX_VERIFICATION`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_YANDEX_METRIKA_ID` |

---

## 7. SEO

- **3 til, hreflang + canonical** har sahifada; til `proxy.ts` da cookie/Accept-Language bo‘yicha aniqlanadi va cookie’da eslab qolinadi.
- **SSG:** bosh, katalog emas (dinamik), lekin 617 mahsulot × 3 til va 19 tarmoq sahifasi build vaqtida prerender qilinadi (≈550 statik sahifa).
- **JSON-LD:** Organization, LocalBusiness, WebSite (+SearchAction), BreadcrumbList, CollectionPage, ItemList, Product, FAQPage, AboutPage.
- **sitemap.xml** (≈2100 URL, har birida `xhtml:alternate`), **robots.txt** (`/admin`, `/api/`, chuqur sahifalash yopiq), **manifest.webmanifest**.
- Meta: OG/Twitter kartalari, tilga mos title/description, `noIndex` faqat xizmat sahifalarida.

---

## 8. Deploy

### Docker (tavsiya)

```bash
docker build -t gff-uz .
docker run -d -p 3000:3000 \
  --name gff-uz \
  -e NEXT_PUBLIC_SITE_URL=https://gff.uz \
  -e ADMIN_PASSWORD=... -e ADMIN_SECRET=... \
  -e TELEGRAM_BOT_TOKEN=... -e TELEGRAM_CHAT_ID=... \
  -v gff-leads:/app/data/leads \
  gff-uz
```

Image `output: 'standalone'` asosida (~kichik), root emas (`gff` foydalanuvchisi), `/api/health` bilan healthcheck. **Leadlar uchun volume majburiy** — aks holda konteyner qayta yaratilganda jurnal yo‘qoladi.

### Vercel / boshqa serverless

Fayl yozuv serverless’da vaqtincha, shuning uchun `.env` da `STORAGE_DRIVER=memory` qoldirmang — buning o‘rniga `LEAD_WEBHOOK_URL` yoki Telegram kanalini sozlang (leadlar darhol tashqariga uzatiladi), yoki VPS/Docker tanlang.

### Reverse proxy (nginx) misoli

```nginx
server {
  listen 443 ssl http2;
  server_name gff.uz www.gff.uz;
  location / { proxy_pass http://127.0.0.1:3000; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; proxy_set_header X-Forwarded-Proto $scheme; }
}
```

---

## 9. Ma’lumotlar oqimi

```
gulfflavours.ae / .ru  →  data/source/*.json  →  scripts/build-catalog.mjs
                        →  src/data/catalog.json (617 mahsulot, 3 til)
                        →  build: statik sahifalar + sitemap
```

Katalog yangilansa: `data/source` fayllarini tahrirlang → `npm run catalog:build` → `npm run build`.

---

## 10. Litsenziya va huquq

Kontent va belgilar **Gulf Flavours & Fragrances FZCO** ga tegishli. Sayt rasmiy distribyutor vakolati doirasida ishlaydi; texnik tafsilotlar `/terms` va `/privacy` sahifalarida (3 tilda).
