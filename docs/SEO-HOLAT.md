# SEO/GEO holati — jurnal

Kundalik avtomatik SEO monitoring (gulfflavours.uz) qisqa jurnali. Faqat muhim o'zgarishlar.
Search Console ma'lumotlari bu yerda YO'Q (sessiyada kirish yo'q) — faqat curl/qidiruv natijalari.

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
