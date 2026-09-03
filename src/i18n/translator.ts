/**
 * TARJIMON YADROSI — hech qanday lug'atni import qilmaydi
 * ----------------------------------------------------------------
 * Nima uchun alohida fayl:
 *   - React Server Components funksiyani prop sifatida klient
 *     komponentiga uzata OLMAydi. Server faqat lug'atni (oddiy obyekt)
 *     yuboradi, klient esa `t` ni shu funksiya bilan tiklaydi.
 *   - Bu fayl `uz/ru/en` lug'atlarini import qilmagani uchun klient
 *     bundle'iga faqat bitta til (~18 KB) tushadi, uchtasi emas.
 *
 * `{var}` ko'rinishidagi joy tutgichlar almashtiriladi:
 *   t('catalog.resultsCount', { n: 12 }) → "12 ta natija"
 */

export type TranslatorFn<K extends string = string> = (
  key: K,
  vars?: Record<string, string | number>,
) => string;

export function translatorFrom<K extends string = string>(
  dict: Record<string, string>,
  fallback?: Record<string, string>,
): TranslatorFn<K> {
  return (key: K, vars?: Record<string, string | number>): string => {
    let out: string | undefined = dict[key];
    if (out === undefined && fallback) out = fallback[key];
    if (out === undefined) return String(key);

    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        out = out.split(`{${k}}`).join(String(v));
      }
    }
    return out;
  };
}
