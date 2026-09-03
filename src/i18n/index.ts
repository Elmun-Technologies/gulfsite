/**
 * I18N — ko'p tillilik yadrosi
 * ----------------------------------------------------------------
 * 3 til: uz (standart), ru, en.
 * Lug'at serverda yuklanadi; faqat kerakli kalitlar komponentlarga uzatiladi.
 */

import { uz, type Dict, type DictKey } from './uz';
import { translatorFrom, type TranslatorFn } from './translator';
import { ru } from './ru';
import { en } from './en';

export const LOCALES = ['uz', 'ru', 'en'] as const;
export type AppLocale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = 'uz';

export const LOCALE_META: Record<
  AppLocale,
  { label: string; shortLabel: string; lang: string; dir: 'ltr' | 'rtl'; htmlLang: string; flag: string; nativeName: string }
> = {
  uz: { label: "O‘zbekcha", shortLabel: 'UZ', lang: 'uz-Latn-UZ', dir: 'ltr', htmlLang: 'uz', flag: '🇺🇿', nativeName: "O‘zbek tili" },
  ru: { label: 'Русский', shortLabel: 'RU', lang: 'ru-RU', dir: 'ltr', htmlLang: 'ru', flag: '🇷🇺', nativeName: 'Русский язык' },
  en: { label: 'English', shortLabel: 'EN', lang: 'en-US', dir: 'ltr', htmlLang: 'en', flag: '🇬🇧', nativeName: 'English' },
};

const DICTIONARIES: Record<AppLocale, Dict> = { uz, ru, en };

export function isLocale(value: unknown): value is AppLocale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

export function normalizeLocale(value: string | null | undefined): AppLocale {
  if (!value) return DEFAULT_LOCALE;
  const v = value.toLowerCase().split(/[-_]/)[0];
  if (isLocale(v)) return v;
  return DEFAULT_LOCALE;
}

export function getDictionary(locale: AppLocale | string): Dict {
  return DICTIONARIES[normalizeLocale(locale)] ?? DICTIONARIES[DEFAULT_LOCALE];
}

export type Translator = TranslatorFn<DictKey>;
export { translatorFrom };

/**
 * Tarjimon yaratadi. Kalit topilmasa yoki joy tutgich to'ldirilmasa —
 * xato bermaydi, balki kalitning o'zini qaytaradi (ishonchlilik).
 */
/**
 * Server komponentlari uchun tarjimon.
 * Kalit topilmasa — o'zbek lug'ati zaxira, u ham bo'lmasa kalitning o'zi
 * qaytariladi (sahifa hech qachon xato bilan qulamasligi uchun).
 */
export function makeT(locale: AppLocale | string): Translator {
  return translatorFrom<DictKey>(
    getDictionary(locale) as Record<string, string>,
    uz as unknown as Record<string, string>,
  );
}

export type Dictionary = { t: Translator } & Dict;

/** Server komponentlarida qulay: `const { t } = await getLocaleBundle(locale)` */
export function getLocaleBundle(locale: AppLocale | string): Dictionary {
  const loc = normalizeLocale(locale);
  const dict = getDictionary(loc);
  const t = makeT(loc);
  return new Proxy(
    { t, ...dict } as Dictionary,
    {
      get(target, prop: string) {
        if (prop === 't') return t;
        return (target as Record<string, unknown>)[prop];
      },
    },
  );
}

/**
 * Accept-Language sarlavhasidan tilni aniqlaydi.
 * Faqat uz/ru/en ni qaytaradi; topilmasa DEFAULT_LOCALE.
 */
export function localeFromAcceptLanguage(header: string | null): AppLocale {
  if (!header) return DEFAULT_LOCALE;
  const parts = header
    .split(',')
    .map((p) => {
      const [tag, ...params] = p.trim().split(';');
      const qParam = params.find((x) => x.trim().startsWith('q='));
      const q = qParam ? Number(qParam.trim().slice(2)) : 1;
      return { tag: (tag ?? '').toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of parts) {
    const base = tag.split('-')[0];
    if (base === 'uz') return 'uz';
    if (base === 'ru') return 'ru';
    if (base === 'en') return 'en';
  }
  return DEFAULT_LOCALE;
}

export { uz, ru, en };
export type { Dict, DictKey };
