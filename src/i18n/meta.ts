/**
 * I18N META — KLIENT UCHUN XAVFSIZ QISM (§14.5)
 * ----------------------------------------------------------------
 * Nega ajratilgan: `@/i18n` (index.ts) uchala lug'atni (`uz`, `ru`, `en`)
 * import qiladi. Klient komponenti shu moduldan bitta QIYMAT (masalan
 * `normalizeLocale`) olsa ham, bundler butun modulni — ya'ni UCH TILDAGI
 * ~1055 kalitli lug'atni (~165 KB xom / ~45 KB gzip) birinchi sahifa
 * bundle'iga tortadi. Bu §14.5 dagi "birinchi sahifa JS < 180 KB gzip"
 * talabini buzardi.
 *
 * Shuning uchun: lug'atsiz, faqat meta (tillar ro'yxati, holati,
 * normalizatsiya, Accept-Language) shu yerda. Klient komponentlari
 * FAQAT shu moduldan import qiladi; server kodi `@/i18n` dan
 * foydalanishda davom etadi (u bu yerdagi hammasini qayta eksport qiladi).
 *
 * Turlar (`AppLocale`, `Dict`, `DictKey`) `import type` bilan olinadi —
 * ular compile paytida o'chiriladi, bundle'ga tushmaydi.
 */

export const LOCALES = ['uz', 'ru', 'en'] as const;
export type AppLocale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = 'uz';

export const LOCALE_META: Record<
  AppLocale,
  {
    label: string;
    shortLabel: string;
    lang: string;
    dir: 'ltr' | 'rtl';
    htmlLang: string;
    nativeName: string;
    tag: string;
  }
> = {
  uz: { label: 'O‘zbekcha', shortLabel: 'UZ', lang: 'uz-Latn-UZ', dir: 'ltr', htmlLang: 'uz', nativeName: 'O‘zbek tili', tag: 'uz_UZ' },
  ru: { label: 'Русский', shortLabel: 'RU', lang: 'ru-RU', dir: 'ltr', htmlLang: 'ru', nativeName: 'Русский язык', tag: 'ru_RU' },
  en: { label: 'English', shortLabel: 'EN', lang: 'en-US', dir: 'ltr', htmlLang: 'en', nativeName: 'English', tag: 'en_US' },
};

export function isLocale(value: unknown): value is AppLocale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

export function normalizeLocale(value: string | null | undefined): AppLocale {
  if (!value) return DEFAULT_LOCALE;
  const v = value.toLowerCase().split(/[-_]/)[0];
  if (isLocale(v)) return v;
  return DEFAULT_LOCALE;
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
