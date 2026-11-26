# SEO/GEO holati — jurnal

Kundalik avtomatik SEO monitoring (gulfflavours.uz) qisqa jurnali. Faqat muhim o'zgarishlar.
Search Console ma'lumotlari bu yerda YO'Q (sessiyada kirish yo'q) — faqat curl/qidiruv natijalari.

## 2026-11-26 (ertalabki run)

**Raqamlar (jonli):** sitemap **2185** (3 so'rovda bir xil) · 60 ta tasodifiy URL: 0 muammo · `/` → `/uz` 307 ·
www/http → 301 · robots/sitemap/llms.txt 200 · `/uz/catalog/yoq-mahsulot`, `/foo.txt` → 404 · IndexNow kalit 200 ·
TTFB `/uz` ≈ 0.45–0.9 s · CI/IndexNow yashil.

**Muammo — deploy yana to'xtagan:** jonli sayt #50 holatida. #51 (11-25 17:50 UTC merge, E151 va boshqalar tavsifi)
va #52 (11-26 00:58 UTC, sport/halol maqolalari — 4 URL 404) jonli emas; aralash versiya yo'q (10/10 bir xil javob).
Coolify webhook ishlamagan yoki deploy yiqilgan → qo'lda **Redeploy** kerak.

**Qilingan:** `product-facts.ts` — qolgan 27 pozitsiya: shirinlashtirgichlar (glyukoza, fruktoza, steviya, glyukoza siropi
80 DE, invert sirop), sut asoslari (kokos suti, paxta, chedder kukuni), umami asoslar (xamirturush ekstrakti, HVP),
oqsillar (kleykovina, soya va no'xat izolyati), kakao kukuni (alkalizatsiyalangan/tabiiy farqi), glazurlar (compound ≠ shokolad),
tuz, yog'lar (kungaboqar, RBD palma, MCT) + komoditi (tuz, un, kakao massasi, quruq sut, zardob navalom).
**"Oziq-ovqat qo'shimchalari" 95/95, "Komoditi" 24/24.** Yog'lilik/oqsil foizlari — "spetsifikatsiya bo'yicha".
"Техническая соль" — oziq-ovqatga yaroqliligini tekshirish haqida ogohlantirish.

**Topildi (texnik qarz):** katalogda qo'shimcha/komoditi dozasi shablon (0.05–2% / 0.5–20%) — un, tuz, yog', kakao uchun
ma'nosiz, lekin meta description va JSON-LD'da chiqadi. Admin'da haqiqiy qiymat yoki bu guruhlar uchun dozani yashirish kerak.

**Raqobat/AI:** 8 so'rovda gulfflavours.uz hali chiqmadi (prom.uz, goldenpages, yellowpages, glotr, top.uz, uzum, olx).
yellowpages "Пищевые ароматизаторы / Ташкент" rubrikasida atigi 8 kompaniya (7 tasida sayt: aromaprem.uz, balerom.uz,
aromaclassic.uz, csca.uz, Döhler, elephantgroup.uz, tortodel.uz) — kartochkalar faqat kontakt (mahsulot, namuna, sertifikat yo'q).
Raqobatchilarning o'z saytlari ham bu so'rovlarda chiqmaydi — SERP faqat kataloglar → GFF kartochkasi u yerda bo'lishi asosiy.

## 2026-11-25 (kechki run)

**Raqamlar (jonli):** sitemap **2185** (o'zgarmagan, 3 so'rovda bir xil) · 60 ta tasodifiy URL: 0 muammo ·
`/` → `/uz` 307 · www/http → 301 · robots/sitemap/llms.txt 200 · `/uz/catalog/yoq-mahsulot`, `/foo.txt` → 404 ·
IndexNow kalit 200 · TTFB `/uz` ≈ 0.45–0.9 s · CI/IndexNow yashil. #50 (aroma kimyosi) jonli.

**Qilingan:** `product-facts.ts` — oziq-ovqat qo'shimchalaridan yana 30 ta pozitsiya (bo'yoqlar E151/E155/E163/E150d/E141/E162,
sirka kislotasi, eritorbat, nitrit, TBHQ, askorbat, B3/B5/D3/A/B9, rux va temir sulfat, CaCO₃, TCP, pektin NH, jelatin,
qabartuvchilar, SSL, DATEM, SHMP) + `skimmed-milk-powder-bulk` aliasi. "Oziq-ovqat qo'shimchalari" endi 74/95.
Ruxsat/doza — "texnik reglament bo'yicha" (E151/E155 AQShda ruxsat etilmaganligi — umumiy fakt).

**Topildi (egasi):** katalogda natriy nitriti dozasi "0.05–2%" — sof nitrit uchun xavfli darajada yuqori
(odatda nitritli tuz aralashmasi orqali, mg/kg darajasida). Admin → Mahsulotlar orqali tuzatish kerak.

**Raqobat/AI:** 6 so'rovda gulfflavours.uz hali chiqmadi (prom.uz, goldenpages, yellowpages, glotr, top.uz, uzum, olx).

## 2026-11-25

**Raqamlar (jonli):** sitemap **2185** (+4: #49 maqolalari) · 64 ta URL (60 tasodifiy + 4 yangi maqola): 0 muammo ·
`/` → `/uz` 307 · www/http → 301 · robots/sitemap/llms.txt 200 · `/uz/catalog/yoq-mahsulot`, `/foo.txt` → 404 ·
IndexNow kalit 200 · TTFB `/uz` ≈ 0.9–1.3 s (oldingidan sekinroq) · CI/IndexNow yashil.

**Qilingan:** `product-facts.ts` — aroma kimyosining qolgan 30 ta pozitsiyasi uchun texnik tavsif (CAS, hid profili,
qaysi tabiiy moyda uchraydi, qo'llanish) — "Aroma kimyosi" kategoriyasi endi 40/40. Mushk keton va Tonalide uchun
"qo'llanish reglamentlar bilan cheklangan" (umumiy fakt), 1,4-sineol ≠ evkaliptol. Fizik shakl yozilmadi
(katalogda hammasi "suyuq").

**Raqobat/AI:** 8 so'rovda gulfflavours.uz hali chiqmadi (prom.uz, goldenpages, yellowpages, glotr, top.uz, uzum).
prom.uz "Ароматизаторы" bo'limi: 56 taklif / 20 sotuvchi, ko'pi diffuzor va propilenglikol; Grand Flavour (prom.uz) —
~24 e'lon, ko'pi "нет в наличии", tavsifsiz. Hech birida texnik tavsif (CAS, doza) yoki namuna va'dasi yo'q.

## 2026-11-24 (kechki run)

**Raqamlar (jonli):** sitemap **2181** (o'zgarmagan) · 60 ta tasodifiy URL: 0 muammo · `/` → `/uz` 307 ·
www/http → 301 · robots/sitemap/llms.txt 200 · `/uz/catalog/yoq-mahsulot`, `/foo.txt` → 404 · IndexNow kalit 200 ·
TTFB `/uz` ≈ 0.45–0.9 s · CI/IndexNow yashil.

**Qilingan:** `product-facts.ts` — 40 ta efir moyi uchun (butun "Efir moylari" kategoriyasi) texnik tavsif:
lotincha botanik nom, umumiy olinish usuli, asosiy komponentlar, qo'llanish sohasi (katalogdagi `applications`
bilan mos). Foydali farqlar: zanjabil/qora murch moyi achchiqlik bermaydi (oleorezinda qoladi), zardachob moyi
rang bermaydi (kurkumin), rozmarin moyi ≠ antioksidant ekstrakti, RU "кедровое масло" ≠ yong'oq yog'i.
Tijoriy da'vo, foiz, sertifikat YO'Q.

**Raqobat/AI:** 8 so'rovda gulfflavours.uz hali chiqmadi (prom.uz, goldenpages, yellowpages, glotr, top.uz).
Brend so'rovi "Gulf Flavours Uzbekistan" ham US indeksda saytni ko'rsatmadi — brend kartochkalari (CITATIONS) muhim.

## 2026-11-24

**Raqamlar (jonli):** sitemap **2181** URL (+8: #41 maqolalari) · 60 ta tasodifiy URL: 0 muammo
(200, canonical o'ziga, localhost/noindex yo'q, h1 = 1, title ≤ 60, hreflang) · `/` → `/uz` 307 ·
www/http → 301 · robots/sitemap/llms.txt 200 · `/uz/catalog/yoq-mahsulot`, `/foo.txt` → 404 ·
IndexNow kalit 200 · TTFB `/uz` ≈ 0.5–0.65 s · CI/IndexNow yashil.

**Qilingan:** soha sahifalari (18 × 3 til) meta description noyob qilindi — shablon o'rniga
sahifa jadvalidagi birinchi 3 ta haqiqiy pozitsiya; RU ko'plik xatosi tuzatildi ("2 рекомендованных
позиций" → "2 позиции"); xomashyo sohalari (flavour-base, fragrance-base) uchun alohida tavsif
("термостабильные формы" ma'nosiz edi); personal-care title "Отдушки для мыла, шампуней и косметики"
("отдушка для мыла" so'rovi uchun).

**Raqobat/AI:** 8 so'rovda gulfflavours.uz hali chiqmadi; SERP — prom.uz, goldenpages, yellowpages,
glotr.uz, top.uz, uzum.uz. Yangi nomlar: VANILIN PLUS (yellowpages, mahsulot ro'yxatisiz),
TC Tashkent Chemicals (glotr, ~22 ta lok-bo'yoq xomashyosi, aromatizator emas).

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

## 2026-11-24 — ruscha so'rovlar

**SERP (RU):** "ароматизаторы пищевые оптом Ташкент", "ванилин оптом Узбекистан", "отдушки для мыла
оптом Ташкент" — birinchi sahifani yellowpages.uz, prom.uz, goldenpages.uz, glotr.uz, olx.uz egallagan;
goldenpages'dagi "отдушки" rubrikalarida 1–4 ta kompaniya (o'z saytlari yo'q) — bo'sh joy bor.
**GSC (11/19–11/21):** yagona bosish — `/ru/catalog/caster-sugar-fine` (o'rin 4); `/ru/blog/vanilin-va-vanil-ekstrakti-farqi`
("экстракт ванили и ванилин", o'rin ~10–14). Xulosa: tovar-xomashyo nomli so'rovlar (shakar, limon kislotasi,
E171, quruq sut) yetakchi katalog saytlarisiz yengilroq chiqadi — shu sahifalarga texnik tavsif qo'shildi.

**Qilingan:** `product-facts.ts` ga yana 37 ta xomashyo (shakar, kislotalar, konservantlar, quyultiruvchilar,
shirinlashtirgichlar, bo'yoqlar, kraxmal, emulgatorlar) — faqat CAS/E-raqam/vazifasi, tijoriy da'vo yo'q.
E'tibor: RU matnlar katalogdagi rus nomlariga mos (ограничений: dozalar va ruxsat — "texnik reglamentlar bo'yicha").
