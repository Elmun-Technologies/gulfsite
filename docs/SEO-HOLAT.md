# SEO/GEO holati — jurnal

Kundalik avtomatik SEO monitoring (gulfflavours.uz) qisqa jurnali. Faqat muhim o'zgarishlar.
Search Console ma'lumotlari bu yerda YO'Q (sessiyada kirish yo'q) — faqat curl/qidiruv natijalari.

## 2026-11-23 (kechki run)

**Raqamlar (jonli):** sitemap **2173** URL, barqaror (6 so‘rovda bir xil — aralash versiya muammosi yo‘q) ·
66 ta URL (60 tasodifiy + 6 ta yangi maqola): 0 muammo · `/` → `/uz` 307 · www/http → 301 ·
robots/sitemap/llms.txt 200 · `/uz/catalog/yoq-mahsulot` va `/foo.txt` → 404 · IndexNow kalit 200 ·
TTFB `/uz` ≈ 0.7 s · CI/IndexNow yashil. #39 (snack/sous maqolalari) deploy kutilmoqda.

**Qilingan:** `product-facts.ts` — yana 12 ta xomashyo uchun texnik tavsif (CAS/E-raqam/vazifa):
vanilin, maltodekstrin, dekstroza, natriy tripolifosfati (E451), limon kislotasi, benzil spirti,
triatsetin, trietilsitrat, IPM, linalool, kumarin, gedion + `FACT_ALIASES` (bir modda ikki
kategoriyada: vanillin-crystalline, ethyl-vanillin-2, ethyl-maltol-2, maltodextrin-bulk,
sodium-tripolyphosphate) — jami 17 sahifa × 3 til shablon matn o‘rniga noyob tavsif oldi.

**Raqobat/AI:** 7 so‘rovda gulfflavours.uz hali chiqmadi (prom.uz, goldenpages, yellowpages, top.uz,
glotr.uz). Yangi nomlar: VANILIN PLUS MChJ (yellowpages), TC Tashkent Chemicals (glotr vitrina).

## 2026-11-23

**Raqamlar (jonli):** sitemap navbatma-navbat **2169 / 2165** URL — production'da IKKI versiya
aralash (§4.17 hodisasi takrorlandi): #28/#29 maqolalari (go‘sht, sut mahsulotlari) 200/404 almashib
javob beradi. Egasiga xabar berildi (Coolify: Stop → Deploy). Qolgani OK: 60 ta tasodifiy URL — 0 muammo ·
`/` → `/uz` 307 · www/http → 301 · robots/sitemap/llms.txt 200 · `/uz/catalog/yoq-mahsulot` va
`/foo.txt` → 404 · IndexNow kalit fayli 200 · TTFB `/uz` ≈ 0.5–1.0 s · CI va IndexNow yashil.

**Qilingan:** blogga teskari ichki havola — soha (`/industries/<id>`), kategoriya va guruh
landinglarida "Статьи по теме / Mavzu bo‘yicha maqolalar" bloki (`components/blog/RelatedArticles.tsx`,
`articlesLinkingTo()`): maqola o‘zi havola bergan sahifadan maqolaga qaytish havolasi (maks. 3, faqat uz/ru).
Avval 11 ta maqolaga faqat blog ro‘yxati va footer'dan havola bor edi.

**Raqobat/AI:** 8 so‘rovda gulfflavours.uz hali chiqmadi; SERP — prom.uz, goldenpages.uz, yellowpages.uz,
top.uz, glotr.uz. Kartochkalar yupqa: LTZ (ltz.uz — mahalliy ziravor/aromatizator ishlab chiqaruvchi,
goldenpages'da mahsulot yo‘q), AROMA-KOLOR (kolbasa ishlab chiqaruvchi bilan aralash kartochka),
HERCULES/prom.uz (bitta e'lon, tavsif boshqa kompaniyalardan ko‘chirilgan). Hech birida namuna,
TDS/SDS, MOQ va'dasi yo‘q.

**Ochiq:** Coolify — eski konteynerni o‘chirish · katalog saytlarida GFF kartochkasi (`docs/CITATIONS.md`).

## 2026-11-22

**Raqamlar (jonli):** sitemap **2165** URL (+10: #16 va #18 maqolalari jonli) · 60 ta tasodifiy URL:
0 muammo (200, canonical o'ziga, localhost/noindex yo'q, h1 = 1, title ≤ 60, hreflang) ·
`/` → `/uz` 307 · www → non-www 301 · http → https 301 · robots/sitemap/llms.txt 200 ·
`/uz/catalog/yoq-mahsulot` va `/foo.txt` → **404** · IndexNow kalit fayli 200 text/plain · TTFB `/uz` ≈ 0.65 s.
**Deploy muammosi hal bo'ldi** (11-20 dagi #15–#21 jonli), IndexNow workflow yashil.

**Qilingan:** mahsulot sahifalari (617 × 3 til) title/description tijoriy so'rovga moslandi —
"Ванилин кристаллический оптом в Ташкенте", "Vanilin (kristall) — Toshkentda ulgurji",
"… wholesale in Tashkent" (sig'masa "<nom> оптом", keyin kategoriya). Meta description endi
sahifadagi mavjudlik belgisi bilan bir xil: avval 56 ta "Под заказ"/"Новое поступление" mahsulot
snippet'ida ham "На складе в Ташкенте" yozilardi (noto'g'ri da'vo).

**Raqobat/AI:** 7 so'rovda gulfflavours.uz hali chiqmadi; SERP — prom.uz, goldenpages.uz,
yellowpages.uz, top.uz, glotr.uz (yangi: B2B marketplace, "vanilin", "эфирные масла" so'rovlarida).

**Ochiq:** katalog saytlarida GFF kartochkasi (`docs/CITATIONS.md`; glotr.uz ham qo'shildi) ·
fly.io invoys.

## 2026-11-20

**Raqamlar (jonli):** sitemap 2155 URL (baseline bilan bir xil) · 60 ta tasodifiy URL: 200,
canonical o'ziga, localhost yo'q, noindex yo'q, h1 = 1, title ≤ 60 — 0 muammo ·
`/` → `/uz` 307 · www → non-www 301 · http → https 301 · robots/sitemap/llms.txt 200 ·
`/uz/catalog/yoq-mahsulot` 404 · TTFB `/uz` ≈ 0.8 s (kesh HIT).

**Muammo — production deploy to'xtab qolgan:** jonli sayt hali #14 holatida.
#15 (soft-404 tuzatish, IndexNow, llms.txt) va #16 (2 ta yangi maqola) main'da, lekin jonli emas:
`/foo.txt` → 200 (404 bo'lishi kerak), yangi maqolalar → 404, IndexNow kalit fayli bosh sahifa
HTML'ini qaytaradi → IndexNow workflow har safar yiqiladi. "Fly deploy" workflow'i fly.io
hisobidagi to'lanmagan invoys tufayli yiqiladi (depot builder 403). Coolify'da qo'lda deploy kerak.

**Qilingan:** guruh landing sahifalari (65 × 3 til) title'lari qidiruv so'roviga moslandi —
avval 34 ta sahifada title faqat guruh nomi edi ("Non va pishiriq — GFF Uzbekistan"),
endi "Ароматизаторы «Хлеб и выпечка» оптом", "«Non va pishiriq» aromatizatorlari ulgurji",
"Bakery flavours wholesale". Kalitlar: `catseo.<kategoriya>.groupTitle` / `groupTitleShort`.

**Raqobat/AI:** 8 so'rovda (US indeks) gulfflavours.uz chiqmadi; SERP'ni prom.uz, goldenpages.uz,
yellowpages.uz, top.uz, uzum.uz (chakana) egallagan. Raqobatchi kartochkalari yupqa
(BEST AROMA-TECH — mahsulot ro'yxati yo'q; Balero — ~21 pozitsiya, ko'pi "нет в наличии",
"цена договорная"); hech birida namuna/MOQ/yetkazish/sertifikat va'dasi yo'q.

**Ochiq:** Coolify deploy · fly.io invoys yoki fly workflow'ni o'chirish · katalog
saytlarida (prom.uz, goldenpages, yellowpages, 2GIS, Yandex Business, GBP) GFF kartochkasi.

**Qo'shimcha (egasi so'rovi bilan, shu kun):** 3 ta yangi maqola (uz + ru, FAQPage bilan):
`ichimliklar-uchun-aromatizator`, `efir-moylari-ishlab-chiqarish-uchun`, `yuvish-vositalari-uchun-otdushka` —
"kimlar uchun" bo'limi, katalogdagi haqiqiy pozitsiyalar, kategoriya/soha sahifalariga ichki havolalar.
Katalog/xaritalarga joylash uchun tayyor matnlar: `docs/CITATIONS.md` (egasi ro'yxatdan o'tadi).
Mahsulot bo'yicha alohida maqola YOZILMAYDI (617 ta shablon maqola = yupqa/dublikat kontent);
mahsulot kartochkasida "Применение" (kimlar uchun) bo'limi allaqachon bor.

## 2026-11-22 — 2026-11-23

**Deploy:** GitHub webhook → Coolify avtomatik deploy ishlaydi (har main'ga merge ~11–14 daqiqa).
Deploy paytida bir necha daqiqa 404/502 aralash javoblar bo'lishi mumkin — tugagach barqaror.
Tekshiruv: `for i in $(seq 10); do curl -s -o /dev/null -w '%{http_code} ' <URL>; done` — hammasi 200.

**Qilingan:** Bing Webmaster (gulfflavours.uz, sitemap yuborilgan) · kategoriya/guruh sahifalari
yengillashtirildi (jadval uchun `TableRow` + `AddSampleLabelsContext`, payload 1,07 MB → 669 KB) ·
kategoriya/guruh sahifalarida FAQ + FAQPage JSON-LD (`categoryFaq`) · GSC so'rovlariga qarab
mahsulot faktlari kengaytirildi (`product-facts.ts`: citral, E1442, E171, quruq sut, zardob —
faqat CAS/E-raqam/vazifa, tijoriy da'vo yo'q; RU "сыворотка в порошке") · maqolalar:
`quruq-sut-yogli-va-yogsiz-farqi`, `qandolat-uchun-aromatizator-tanlash` (katalogdagi 178 ta
qandolat aromatizatori, dozalash 0,05–0,3% — ma'lumotdan), `snack-va-chips-uchun-aromatizator` (59 ta),
`sous-va-mayonez-uchun-aromatizator` (73 ta).

**Ochiq (egasi):** katalog saytlarida kartochkalar (`docs/CITATIONS.md`) · GitHub'da Vercel
ilovasini o'chirish (har PR'da befoyda qizil "Vercel" status) · MOQ va hujjat PDF'lari
tasdiqlanmaguncha FAQ'ga yozilmaydi.
