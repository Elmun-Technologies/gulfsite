/**
 * TARJIMON YADROSI — hech qanday lug'atni import qilmaydi
 * ----------------------------------------------------------------
 * Nima uchun alohida fayl:
 *   - React Server Components funksiyani prop sifatida klient
 *     komponentiga uzata OLMAydi. Server faqat lug'atni (oddiy obyekt)
 *     yuboradi, klient esa `t` ni shu funksiya bilan tiklaydi.
 *   - Bu fayl `uz/ru/en` lug'atlarini import qilmagani uchun klient
 *     bundle'iga faqat bitta til tushadi, uchtasi emas.
 *
 * `{var}` ko'rinishidagi joy tutgichlar almashtiriladi:
 *   t('catalog.resultsCount', { count: 12 }) → "12 ta mahsulot topildi"
 *
 * ------------------------------------------------------------
 * ESKI SAYTDAGI `{count}` / `{days}` / `{from}–{to}` BUG'INING
 * ROOT CAUSE'I VA TUZATILISHI
 * ------------------------------------------------------------
 * Sabab 1 — joy tutgichli kalit `vars` siz chaqirilgan:
 *     t('categories.positions')            // '{count} pozitsiya'
 *     <span>{c.count} {t('categories.positions')}</span>  → "354 {count} pozitsiya"
 * Sabab 2 — noto'g'ri joy tutgich nomi (`.replace()` bilan qo'lda):
 *     t('catalog.showing').replace('{shown}', …)   // kalitda {from}/{to}/{total}
 *     → "{from}–{to} / 617" ekranga chiqib qolgan.
 * Sabab 3 — kalit topilmasa `t` sukut bilan kalitning o'zini qaytargan,
 *     xato hech qayerda ko'rinmagan.
 *
 * Tuzatish:
 *   1. `assertFilled()` — almashtirishdan keyin `{harf}` qolgan bo'lsa
 *      dev/test muhitida OVOSLI xato beradi (production'da bo'sh satrga
 *      almashtirilib, foydalanuvchiga hech qachon `{count}` ko'rsatilmaydi).
 *   2. `.replace()` bilan qo'lda ishlash TAQIQLANDI — faqat `t(key, vars)`.
 *   3. Ko'plik shakllari uchun `plural()` (ICU o'rniga `one|few|many`),
 *      chunki uz'da ko'plik o'zgarmaydi, ru'da 3 shakl bor.
 *   4. CI testi (`scripts/check-placeholders.mjs`) render qilingan HTML'da
 *      `{harf}` topilsa build'ni yiqitadi (§10).
 */

export type Vars = Record<string, string | number>;

export type TranslatorFn<K extends string = string> = (key: K, vars?: Vars) => string;

/**
 * Shablonni o'zgaruvchilar bilan to'ldiradi.
 *
 * Nima uchun kerak: React Server Components FUNKSIYAni klient komponentiga
 * prop sifatida yubora olmaydi. Shuning uchun server `{count}`/`{max}` joy
 * tutgichli XOM lug'at satrini (`t.raw(key)`) yuboradi, klient esa uni shu
 * funksiyasi bilan to'ldiradi. `.replace()` qo'lda ishlatilmaydi — joy
 * tutgich nomlari lug'atda qanday bo'lsa, shunday almashtiriladi.
 */
export function fillVars(tpl: string, vars: Vars): string {
  let out = tpl;
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{${k}}`).join(String(v));
  }
  return assertFilled(tpl, out);
}

/**
 * XOM lug'at satrini qaytaradi (joy tutgichlar saqlangan holda).
 * Faqat klient komponentiga shablon uzatish uchun — ekranga to'g'ridan-to'g'ri
 * chiqarish mumkin emas (`fillVars` chaqirilishi shart).
 */
export function rawFrom<K extends string = string>(
  dict: Record<string, string>,
  fallback?: Record<string, string>,
): (key: K) => string {
  return (key: K): string => dict[key as string] ?? fallback?.[key as string] ?? String(key);
}

/** `{harf...}` — to'ldirilmagan joy tutgich */
const UNFILLED = /\{[a-zA-Z_][a-zA-Z0-9_.]*\}/g;

const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';

/**
 * To'ldirilmagan joy tutgich qolganmi?
 * Dev/test — xato log'i; production — qoldiq o'chiriladi (foydalanuvchi
 * `{count}` ni hech qachon ko'rmasligi kerak).
 */
function assertFilled(key: string, out: string): string {
  const left = out.match(UNFILLED);
  if (!left) return out;

  if (isDev) {
    console.error(
      `[i18n] "${key}" — to'ldirilmagan joy tutgich: ${left.join(', ')}.\n` +
        `  t('${key}', { … }) ko'rinishida chaqiring; .replace() ishlatmang.`,
    );
  }
  return out.replace(UNFILLED, '').replace(/\s{2,}/g, ' ').trim();
}

export function translatorFrom<K extends string = string>(
  dict: Record<string, string>,
  fallback?: Record<string, string>,
): TranslatorFn<K> {
  return (key: K, vars?: Vars): string => {
    let out: string | undefined = dict[key as string];

    if (out === undefined && fallback) out = fallback[key as string];
    if (out === undefined) {
      if (isDev) {
        console.error(`[i18n] "${String(key)}" kaliti lug'atda yo'q.`);
      }
      return String(key);
    }

    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        out = out.split(`{${k}}`).join(String(v));
      }
    }

    return assertFilled(String(key), out);
  };
}

/* ------------------------------------------------------------
   KO'PLIK SHAKLLARI (ICU plural o'rniga — §10)
   ------------------------------------------------------------
   Lug'atdagi qiymat: 'one|few|many'
     uz → har doim bitta shakl ("617 pozitsiya")
     ru → позиция / позиции / позиций
     en → item / items
   ------------------------------------------------------------ */

export type PluralLocale = 'uz' | 'ru' | 'en';

/** CLDR ko'plik indeksi: 0 = one, 1 = few, 2 = many/other */
export function pluralIndex(locale: PluralLocale, n: number): 0 | 1 | 2 {
  const abs = Math.abs(n);
  if (locale === 'ru') {
    const m10 = abs % 10;
    const m100 = abs % 100;
    if (m10 === 1 && m100 !== 11) return 0;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 1;
    return 2;
  }
  if (locale === 'en') return abs === 1 ? 0 : 2;
  return 2; // uz — o'zgarmaydi
}

/**
 * `pluralFrom('plural.positions', 617, 'ru')` → "617 позиций"
 * Kalit qiymati `one|few|many` ko'rinishida bo'lishi kerak.
 */
export function pluralFrom(
  raw: string | undefined,
  count: number,
  locale: PluralLocale,
): string {
  const forms = (raw ?? '').split('|');
  const idx = pluralIndex(locale, count);
  const word = (forms[idx] ?? forms[forms.length - 1] ?? '').trim();
  const formatted = new Intl.NumberFormat(localeTag(locale)).format(count);
  return word ? `${formatted} ${word}` : formatted;
}

export function localeTag(locale: PluralLocale): string {
  return locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uz-UZ';
}

/** `t` + `tp` (ko'plik) juftligi — server va klient uchun bir xil imzo */
export interface Translator {
  t: TranslatorFn<string>;
  /** ko'plik: tp('plural.positions', 617) → "617 pozitsiya" */
  tp: (key: string, count: number, vars?: Vars) => string;
}

export function makeTranslator<K extends string = string>(
  dict: Record<string, string>,
  locale: PluralLocale,
  fallback?: Record<string, string>,
): TranslatorFn<K> & {
  tp: (key: K, count: number, vars?: Vars) => string;
  raw: (key: K) => string;
} {
  const t = translatorFrom<K>(dict, fallback);
  const raw = rawFrom<K>(dict, fallback);
  const tp = (key: K, count: number, vars?: Vars) => {
    const raw = dict[key as string] ?? fallback?.[key as string];
    const out = pluralFrom(raw, count, locale);
    if (!vars) return out;
    // qo'shimcha joy tutgichlar (masalan {days}) ham almashtiriladi
    let s = out;
    for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
    return assertFilled(String(key), s);
  };
  return Object.assign(t, { tp, raw });
}
