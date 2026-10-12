/**
 * I18N — ko'p tillilik yadrosi
 * ----------------------------------------------------------------
 * 3 til: uz (standart, prefiksiz), ru (/ru), en (/en).
 * Lug'at serverda yuklanadi; faqat kerakli kalitlar komponentlarga uzatiladi.
 *
 * `t(key, vars)`  — oddiy tarjima, `{var}` joy tutgichlari bilan
 * `tp(key, n)`    — ko'plik shakli ('plural.positions' → "617 pozitsiya")
 *
 * MUHIM: joy tutgichli kalitlarni `.replace()` bilan qo'lda to'ldirmang —
 * eski saytdagi `{from}–{to}` bug'i aynan shundan chiqqan (translator.ts).
 */

import { uz, type Dict, type DictKey } from './uz';
import {
  makeTranslator,
  localeTag,
  pluralFrom,
  pluralIndex,
  translatorFrom,
  type PluralLocale,
  type TranslatorFn,
  type Vars,
} from './translator';
import { ru } from './ru';
import { en } from './en';

/* Meta (tillar, normalizatsiya, Accept-Language) `./meta` da — u
   lug'atlarni import QILMAYDI, shuning uchun klient komponentlari uni
   xavfsiz ishlatadi (§14.5: birinchi sahifa JS og'irligi). Bu modul
   ularni qayta eksport qiladi — server kodi uchun API o'zgarmadi. */
export {
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_META,
  isLocale,
  normalizeLocale,
  localeFromAcceptLanguage,
  type AppLocale,
} from './meta';

import { DEFAULT_LOCALE, normalizeLocale, type AppLocale } from './meta';


const DICTIONARIES: Record<AppLocale, Dict> = { uz, ru, en };



export function getDictionary(locale: AppLocale | string): Dict {
  return DICTIONARIES[normalizeLocale(locale)] ?? DICTIONARIES[DEFAULT_LOCALE];
}

/** `t` + `tp` — server komponentlari va lug'at bundle'i uchun */
export type Translator = TranslatorFn<DictKey> & {
  tp: (key: DictKey, count: number, vars?: Vars) => string;
  /**
   * XOM shablon — joy tutgichlar saqlangan holda.
   * Faqat klient komponentiga uzatish uchun: RSC funksiyani prop sifatida
   * yubora olmaydi, shuning uchun server shablonni beradi, klient esa
   * `fillVars(tpl, { … })` bilan to'ldiradi.
   */
  raw: (key: DictKey) => string;
};

/**
 * Server komponentlari uchun tarjimon.
 * Kalit topilmasa — o'zbek lug'ati zaxira, u ham bo'lmasa kalitning o'zi
 * qaytariladi (sahifa hech qachon xato bilan qulamasligi uchun).
 */
export function makeT(locale: AppLocale | string): Translator {
  const loc = normalizeLocale(locale);
  return makeTranslator<DictKey>(
    getDictionary(loc) as unknown as Record<string, string>,
    loc,
    uz as unknown as Record<string, string>,
  );
}

/** Faqat oddiy `t` kerak bo'lganda (eski chaqiruvlar uchun mos) */
export function makeSimpleT(locale: AppLocale | string): TranslatorFn<DictKey> {
  return translatorFrom<DictKey>(
    getDictionary(locale) as unknown as Record<string, string>,
    uz as unknown as Record<string, string>,
  );
}

export type Dictionary = { t: Translator } & Dict;

/** Server komponentlarida qulay: `const { t } = getLocaleBundle(locale)` */
export function getLocaleBundle(locale: AppLocale | string): Dictionary {
  const loc = normalizeLocale(locale);
  const dict = getDictionary(loc);
  const t = makeT(loc);
  return new Proxy({ t, ...dict } as Dictionary, {
    get(target, prop: string) {
      if (prop === 't') return t;
      return (target as Record<string, unknown>)[prop];
    },
  });
}


export { uz, ru, en, translatorFrom, makeTranslator, pluralFrom, pluralIndex, localeTag };
export type { Dict, DictKey, PluralLocale, Vars };
