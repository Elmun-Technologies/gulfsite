# LAUNCH CHECKLIST — saytni ishga tushirish uchun nima kerak

Holat: **2026-10-12**. Kod tomoni tayyor va barcha avtomatik tekshiruvlar
yashil (build, TypeScript, ESLint, placeholder testi, SEO/A11y auditi, o'lik
havola auditi, lead API). Quyidagilar **tashqi kirish** talab qiladi — ular
bo'lmasa sayt ishlaydi, lekin qisman "jim" bo'ladi yoki noto'g'ri ma'lumot
ko'rsatadi.

Har bir band uchun: qaysi o'zgaruvchi, qayerdan olinadi, qanday tekshiriladi.

---

## A. LAUNCH'NI TO'SADIGAN BANDLAR (4 ta)

`npm run env:check` bularni avtomatik topadi va **exit 1** beradi.

### A1. Production domen

```bash
NEXT_PUBLIC_SITE_URL="https://<sizning-domen>"
```

- **Nima uchun:** canonical, `hreflang`, `sitemap.xml`, `og:url` va barcha
  JSON-LD shu domenga quriladi. Bo'sh bo'lsa — `localhost:3000` ga quriladi va
  Google saytni indekslay olmaydi.
- **Qayerdan:** mijoz/domen ro'yxatidan. Slash bilan tugamasin, `https` bo'lsin.
- **Tekshirish:** `curl -s https://<domen>/uz | grep -o 'rel="canonical"[^>]*'`

### A2. Arizalar qabul kanali (kamida bittasi)

Hozir arizalar **faqat serverdagi faylga** yoziladi
(`data/leads/leads-YYYY-MM.jsonl`) — hech kimga xabar ketmaydi.

Variant 1 — **Telegram bot** (tavsiya, eng tez):
```bash
TELEGRAM_BOT_TOKEN="123456:ABC-..."     # @BotFather → /newbot
TELEGRAM_CHAT_ID="-1001234567890"        # guruh/chat id (vergul bilan bir nechta)
TELEGRAM_TOPIC_ID=""                     # forum bo'lsa — mavzu id
```
Variant 2 — **e-mail (SMTP)**:
```bash
SMTP_HOST="smtp.<provayder>"  SMTP_PORT="587"  SMTP_SECURE="false"
SMTP_USER="..."  SMTP_PASSWORD="..."  LEAD_EMAIL_TO="info@gulfflavour.uz"
SMTP_FROM="GFF Uzbekistan <info@gulfflavour.uz>"   # SPF/DKIM sozlangan domen!
```
Variant 3 — **Resend** (serverless): `RESEND_API_KEY="re_..."`
Variant 4 — **CRM webhook** (amoCRM/Bitrix24/n8n):
```bash
LEAD_WEBHOOK_URL="https://..."  LEAD_WEBHOOK_SECRET="..."
```

- **Tekshirish:** saytda formani yuboring → javobdagi `notified` maydoni
  `"sozlanmagan"` bo'lmasligi kerak:
  ```bash
  curl -s -X POST https://<domen>/api/leads -H 'Content-Type: application/json' \
    --data @test-lead.json | jq '.data.notified'
  ```

### A3. Admin panel paroli

```bash
ADMIN_PASSWORD="<kuchli parol, ≥12 belgi>"
ADMIN_SECRET="$(openssl rand -hex 32)"
```

- **Nima uchun:** `/uz/admin` da barcha arizalar bazasi. Standart qiymat bilan
  panel **yopilmaydi** (`isConfigured` tekshiruvi bor), lekin parol bo'sh
  bo'lsa himoya yo'q.
- **Tekshirish:** `/uz/admin` → noto'g'ri parol bilan kirmasligi kerak.

### A4. Lead saqlash yo'li (Docker/VPS'da)

```bash
LEAD_STORAGE_PATH="/app/data/leads"     # MUTLAQ yo'l + volume
```

- **Nima uchun:** standalone server `process.chdir(__dirname)` qiladi — nisbiy
  yo'l `.next/standalone` ga nisbatan hisoblanadi va **keyingi build'da
  arizalar o'chib ketishi mumkin**.
- **Tekshirish:** forma yuborib, fayl shu papkada paydo bo'lganini ko'ring.

---

## B. FUNKSIYA "JIM" BO'LADIGAN BANDLAR (ogohlantirish)

Sayt ishlaydi, lekin quyidagilar ishlamaydi:

| Band | O'zgaruvchi | Bo'sh bo'lsa nima bo'ladi |
| --- | --- | --- |
| **Analitika** (§12) | `NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"` | `dataLayer` hodisalari yoziladi, lekin hech qaerga ketmaydi — konversiyani ko'rmaysiz |
| GA4 to'g'ridan-to'g'ri | `NEXT_PUBLIC_GA4_ID="G-XXXX"` | (GTM orqali ham ulasa bo'ladi) |
| Yandex Metrika | `NEXT_PUBLIC_YANDEX_METRIKA_ID` | — |
| **Turnstile** bot himoyasi | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | Faqat ichki himoya ishlaydi: honeypot + 5 so'rov/10 min + min fill 3 s |
| **Katalog/hujjat PDF'lari** | `NEXT_PUBLIC_CATALOG_PDF="/docs/catalog.pdf"` | Hujjatlar bloki **umuman ko'rsatilmaydi** (o'lik havola yo'q) |
| **Ishlab chiqarish videosi** | `NEXT_PUBLIC_PRODUCTION_VIDEO="/video/production.mp4"` | Video bloki ko'rsatilmaydi |
| **MOQ** (§15 TODO) | `MIN_ORDER_KG="5"` | Hozir **5 kg joy tutgich** ko'rsatiladi — mijoz tasdiqlashi kerak |
| HQ e-mail | `NEXT_PUBLIC_HQ_EMAIL` | Maydon ko'rsatilmaydi (brief §15 da berilmagan) |

---

## C. KONTENT FAYLLARI (mijozdan kutilmoqda)

Bular kod bilan bog'liq emas — fayl berilsa, joylashtiriladi:

| # | Nima | Qayerga | Hozirgi holat |
| --- | --- | --- | --- |
| C1 | **Distribyutorlik sertifikati** (PDF/skan) | `public/docs/` | Yo'q — footer/hujjatlar bloki yashirin |
| C2 | **TDS/SDS/Halal/ISO** hujjatlari | `public/docs/` | `catalogPdf` bo'sh |
| C3 | **Ishlab chiqarish videosi** | `public/video/` yoki YouTube/Vimeo | Yo'q |
| C4 | **Har mahsulot uchun foto** | `public/images/products/` | Kategoriya/qadoq fotolari fallback sifatida ishlatilmoqda |
| C5 | **Monogrammalarning SVG versiyasi** | `public/images/` | PNG bor (ota kompaniyadan) — retina'da yumshoq ko'rinishi mumkin |
| C6 | **Aniq MOQ** (minimal buyurtma kg) | `MIN_ORDER_KG` | 5 kg — **taxmin** |

> ⚠ Fayl yo'q bo'lsa sayt **buzilmaydi**: `publicAssetExists()` tekshiradi va
> tugma/blok umuman render qilinmaydi. Buni `npm run audit:links` ham
> nazorat qiladi (o'lik havola topilsa — CI yiqiladi).

---

## D. TASDIQ (SIGN-OFF)

| # | Nima | Kim | Holat |
| --- | --- | --- | --- |
| D1 | **Maxfiylik siyosati va shartlar** — `src/lib/legal.ts` (Privacy 10 + Terms 10 bo'lim × 3 til, ZRU-547 asosida) | **Yurist** | Texnik qoralama; sahifada ochiq ogohlantirish bor. **Launch'dan oldin imzo shart** |
| D2 | **RU/EN nusxalar** — `docs/TRANSLATIONS_REVIEW.md` + 2 ta CSV (1055 kalit + 151 takson) | Mijoz / tarjimon | Ro'yxat tayyor; P1 yurist (29), P2 faktlar (58), P3 marketing (~950) |
| D3 | **E-mail imlosi** | Mijoz | ✔ **Tasdiqlandi** (2026-10-12): `info@gulfflavour.uz` |
| D4 | **`/uz` prefiksi** (brief "prefikssiz" degan edi) | Mijoz | ✔ **Tasdiqlandi** (2026-10-12): prefiks saqlanadi |
| D5 | **JS byudjeti** (§14.5 <180 KB gzip) | Mijoz | ✔ **Qabul qilindi** (2026-10-12): 293 KB, mezon — Lighthouse Perf ≥ 90 |
| D6 | **Dizayn vizual QA'si** (pixel-accuracy) | Dizayner | Token/qoidalar bo'yicha tekshirilgan (`/styleguide`), avtomatik piksel-diff qilinmagan |

---

## E. DEPLOY

### E1. Standalone (VPS/Docker — tavsiya)

```bash
npm ci
node scripts/copy-fonts.mjs
NEXT_PUBLIC_SITE_URL="https://<domen>" npm run build
npm start                     # 0.0.0.0:3000, .next/standalone
```

- Fayl almashinuvi: `data/leads` uchun **volume** bering (`LEAD_STORAGE_PATH`).
- Reverse proxy (nginx) namunasi: `README.md` §8.
- HTTPS majburiy (§13) — sertifikat Let's Encrypt bilan.

### E2. Vercel

- `NEXT_PUBLIC_SITE_URL` ni **o'rnating** (yoki `VERCEL_PROJECT_PRODUCTION_URL`
  avtomatik ishlatiladi — lekin production domen bilan almashtiring).
- `output: 'standalone'` Vercel'da **o'chadi** (`next.config.ts` buni
  `process.env.VERCEL` bo'yicha hal qiladi).
- Lead saqlash: Vercel'da fayl tizimi **vaqtinchalik** — `LEAD_WEBHOOK_URL`
  (CRM) yoki Telegram/e-mail kanalini ishlating.

### E3. Deploy'dan keyin MAJBURIY tekshiruvlar

```bash
# 1. Lighthouse (§0 mezonlari: Perf ≥ 90 mobile · A11y ≥ 95 · SEO 100)
BASE_URL=https://<domen> npm run lighthouse          # Chrome kerak
BASE_URL=https://<domen> npm run lighthouse -- --all

# 2. Auditlar (production domenida)
BASE_URL=https://<domen> npm run audit:seo
BASE_URL=https://<domen> npm run audit:links

# 3. HTTP semantikasi
curl -sI https://<domen>/ | head -1                          # 307 → /uz
curl -sI https://<domen>/uz/product/vanilla-premium | head -1 # 308 → /catalog/…
curl -s -o /dev/null -w '%{http_code}\n' https://<domen>/uz/catalog/yoq-mahsulot  # 404
curl -s -o /dev/null -w '%{http_code}\n' https://<domen>/styleguide              # 404

# 4. Forma — haqiqiy ariza yuborib, Telegram/e-mail'ga yetib borganini ko'ring
# 5. Analitika — GTM Debug mode'da hodisalarni tekshiring (§12 ro'yxati)
# 6. Search Console — sitemap.xml yuborish, indeksatsiya
```

CI bularning ko'pini har push'da o'zi bajaradi:
`.github/workflows/ci.yml` → build + testlar + `audit:seo` + `audit:links` +
HTTP semantikasi + lead API + **Lighthouse (mobile va desktop)**.

---

## F. XULOSA — "100%" ga yetish uchun minimal ro'yxat

```
1. NEXT_PUBLIC_SITE_URL                    (domen)
2. TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID   (yoki SMTP/Resend/Webhook)
3. ADMIN_PASSWORD + ADMIN_SECRET
4. LEAD_STORAGE_PATH                       (Docker/VPS'da)
5. NEXT_PUBLIC_GTM_ID                      (analitika)
6. MIN_ORDER_KG                            (aniq MOQ)
7. Sertifikat/hujjat PDF'lari + video + mahsulot fotolari
8. Yurist imzosi (legal.ts)
9. RU/EN nusxa tahriri (docs/*.csv)
10. Deploy + Lighthouse o'lchovi
```

1–4 bo'lmasa sayt **launch qilinmaydi**; 5–10 bo'lmasa sayt ishlaydi, lekin
to'liq emas. Barcha bandlar `npm run env:check` hisobotida ko'rinadi.
