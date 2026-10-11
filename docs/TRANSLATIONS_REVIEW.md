# RU / EN tarjimalari — ko'rib chiqish ro'yxati (§10.6)

Brief talabi: *"RU nusxa `design/Main.ru.dc.html` dan olinadi; qolgan RU va
barcha EN nusxalar texnik tarjima qilinadi va mijozga **alohida review
ro'yxati** sifatida beriladi."*

Bu hujjat — o'sha ro'yxat. Ma'lumotlar ikkita CSV faylda (Excel/Google Sheets
da ochiladi, kirill uchun UTF-8 BOM bilan yozilgan):

| Fayl | Nima bor | Hajmi |
| --- | --- | --- |
| `docs/translations-review.csv` | Lug'atdagi barcha kalitlar: `key · screen · uz · ru · en · flags · note` | 1055 qator |
| `docs/taxonomy-review.csv` | Kategoriya / guruh / soha / shakl / mavjudlik / hudud / biznes turi nomlari: `id · turi · uz · ru · en · flags · note` | 151 qator |

Qayta generatsiya qilish: **`npm run i18n:export`** (lug'atlar o'zgarganda
yangilab turish kerak — fayllar qo'lda tahrirlanmaydi).

---

## 1. Nusxalar qayerdan kelgan (provenance)

| Til | Manba | Holat |
| --- | --- | --- |
| **UZ** | `design/*.dc.html` — 14 ta desktop sahifa, dizayner matni so'zma-so'z | **Asosiy (authoritative)**, o'zgartirilmagan |
| **RU** | `design/Main.ru.dc.html` — faqat bosh sahifa | Dizaynerdan **44** qiymat; qolgan **918** tasi UZ dan texnik tarjima |
| **EN** | Dizaynda EN sahifa yo'q | **Barchasi** UZ dan texnik tarjima |

Ya'ni: RU/EN dagi matnlarning katta qismi — texnik tarjima va **mijoz (yoki
professional tarjimon) tasdig'i kerak**. Sayt hozir ishlaydi, hech qanday
blok yo'q; bu faqat sifat tekshiruvi.

---

## 2. Ustuvorlik bo'yicha ko'rib chiqish

CSV'dagi `flags` ustuni nima tekshirishni aytadi. Tartib:

**P1 — yurist tasdig'i (29 kalit, flag `legal`).**
`privacy.*`, `legal.*`, `form.consent*`. Rozilik matni va maxfiylik siyosati
O'zbekiston qonunchiligiga mos bo'lishi kerak. Asosiy matn `src/lib/legal.ts` da
(Privacy 10 bo'lim + Terms 10 bo'lim, har biri 3 tilda) — CSV'da emas, alohida
faylda; uni ham yurist ko'radi.
⚠️ Hozirgi matn — texnik qoralama, **launch'dan oldin imzo qo'yilishi shart**.

**P2 — mijoz faktlari (58 kalit, flag `client`).**
`contact.*`, `site.*`, `stats.*`, `docs.*`, `certificate.*` — telefon,
Telegram, Instagram, e-mail, manzil, ish vaqti, raqamlar (2002, 4000+, 12,
14). Bular tarjima emas, **fakt**: noto'g'ri bo'lsa biznesga zarar.
Ayniqsa: **e-mail imlosi** — `info@gulfflavour.uz` ishlatilgan, mijoz bir
marta `info@gulfflovour.uz` deb yozgan edi. Tasdiqlash kerak.

**P3 — marketing nusxalari (qolgan ~950 kalit).**
Bosh sahifa, katalog, mahsulot, namuna qutisi, sohalar, kompaniya, aloqa,
RFQ, 404. Eng ko'p diqqat talab qiladigan joylar: `hero.*`, `home.box.*`,
`samples.*`, `quote.*` — bu konversiya matnlari (asosiy maqsad: bepul namuna
qutisi arizasi).

**P4 — TEGMAYDIGAN qiymatlar.**
- `vars:{…}` (125 kalit) — `{name}`, `{sku}`, `{count}` kabi joy tutgichlar.
  Tarjimada ular **saqlanishi shart**, tartibini almashtirish mumkin.
  Buzilsa `npm test` darhol xato beradi (placeholder testi).
- `keep-en` (6 kalit) — `slogan.joy/bliss/delight` ("A sense of Joy"),
  monogramma matnlari. Brief §10.4: **barcha tillarda inglizcha qoladi**.
- Bir xil qiymat qolishi tabiiy bo'lganlar: `E-mail`, `Telegram`, `WhatsApp`,
  `PDF`, `SKU`, `ISO 22000 / HACCP`, `Vegan`, `Kosher`, `1 kg`, `25–100 g`,
  `© {year} GFF Uzbekistan`. Audit ularni "tarjima qilinmagan" deb
  belgilaydi, lekin bu **xato emas** — qo'lda tekshirib, belgini e'tiborsiz
  qoldiring.

---

## 3. Qabul qilingan til qoidalari (o'zgartirishni xohlasangiz — ayting)

| Qoida | UZ | RU | EN |
| --- | --- | --- | --- |
| **Mahsulot nomlari** (§10.3) | inglizcha | inglizcha | inglizcha |
| **Sloganlar** (§10.4) | inglizcha | inglizcha | inglizcha |
| **Brit/imlo** | — | — | `Catalogue`, `Flavours`, `colour` — brend nomi (*Flavours & Fragrances*) bilan izchil |
| **Ko'plik shakllari** | 1 shakl | 3 shakl (`one\|few\|many`: 1 позиция / 2 позиции / 5 позиций) | 2 shakl (1 item / 5 items) |
| **Apostroflar** (§10.7) | `o‘` `g‘` = U+2018, tutuq `’` = U+2019 | — | `’` = U+2019 |
| **"Namuna qutisi"** | Namuna qutisi | Тест-бокс | Sample box |
| **Raqamlar** | `Intl.NumberFormat` (qo'lda yozilmaydi) | xuddi shunday | xuddi shunday |

Ko'plik kalitlari CSV'da `plural:` bayrog'i bilan ko'rinadi va qiymati
`bir|ikki|uch` ko'rinishida — **uchala qismni ham** to'ldirish kerak
(UZ faqat oxirgisini ishlatadi, lekin format yagona).

---

## 4. Qanday qilib qaytarasiz

Ikkalasi ham qulay:

1. **CSV'ni tahrirlab qaytaring** — `ru` va `en` ustunlarini o'zgartiring
   (`key` ustuniga tegmang), faylni yuboring. Men uni lug'atlarga
   ko'chiraman va `npm test` + `npm run audit:seo` bilan tekshiraman.
2. **Ro'yxat ko'rinishida** — `key` + to'g'ri matn:
   ```
   samples.hero.title   RU: Бесплатный тест-бокс   EN: Free sample box
   quote.submit         RU: Запросить цену
   ```

O'zgarishlar kiritilgach: `npm test` (1055 kalit × 3 til, joy tutgichlar) →
`npm run audit:seo` (title ≤ 60, desc ≤ 155, hreflang) → `npm run i18n:export`
(CSV'ni yangilash). Har bir kalit o'zgarishi bitta mantiqiy commit bo'ladi
(Conventional Commits, `fix(i18n): …`).

---

## 5. Hozirgi holat (2026-10-11, avtomatik o'lchov)

```
lug'at kalitlari          : 1055 × 3 til  (bo'sh qiymat YO'Q)
taksonomiya yozuvlari     : 151 × 3 til
tarjima qilinmagan RU     : 28  (hammasi brend/termin — yuqorida izohlangan)
tarjima qilinmagan EN     : 37  (hammasi birlik/brend — yuqorida izohlangan)
{var} li kalitlar         : 125 (tegilmaydi)
inglizcha qoladigan       : 6   (slogan/monogramma)
yurist tasdig'i kerak     : 29
mijoz tasdig'i kerak      : 58
ko'rinadigan {placeholder}: 0   (npm test tekshiradi)
```
