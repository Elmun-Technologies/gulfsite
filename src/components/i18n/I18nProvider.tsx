'use client';

/**
 * I18N PROVIDER (klient)
 * ----------------------------------------------------------------
 * Server layout lug'atni (oddiy JSON obyekt) bir marta uzatadi;
 * barcha klient komponentlari `useI18n()` / `useT()` / `useTp()` orqali oladi.
 *
 * Nima uchun shunday:
 *   - Funksiyani (t) prop qilib uzatish RSC'da taqiqlangan
 *   - Prop drilling yo'q — istalgan chuqurlikdagi komponent oladi
 *   - Klient bundle'iga FAQAT joriy til lug'ati tushadi
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { makeTranslator, type TranslatorFn, type Vars } from '@/i18n/translator';
import type { AppLocale, Dict, DictKey } from '@/i18n';

export interface I18nValue {
  locale: AppLocale;
  dict: Dict;
  t: TranslatorFn<DictKey>;
  /** ko'plik: tp('plural.positions', 617) → "617 pozitsiya" */
  tp: (key: DictKey, count: number, vars?: Vars) => string;
}

const I18nCtx = createContext<I18nValue | null>(null);

/** Provider bo'lmaganda ham qulamaslik uchun xavfsiz zaxira */
const EMPTY_T: TranslatorFn<DictKey> = (key) => String(key);
const EMPTY_TP: I18nValue['tp'] = (_key, count) => String(count);

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: AppLocale;
  dict: Dict;
  children: ReactNode;
}) {
  const value = useMemo<I18nValue>(() => {
    const tr = makeTranslator<DictKey>(dict as unknown as Record<string, string>, locale);
    return { locale, dict, t: tr, tp: tr.tp };
  }, [locale, dict]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nCtx);
  if (ctx) return ctx;
  return { locale: 'uz', dict: {} as Dict, t: EMPTY_T, tp: EMPTY_TP };
}

/** Faqat tarjimon kerak bo'lganda */
export function useT(): TranslatorFn<DictKey> {
  return useI18n().t;
}

/** Ko'plik shakli bilan tarjimon */
export function useTp(): I18nValue['tp'] {
  return useI18n().tp;
}

/** Joriy til */
export function useLocale(): AppLocale {
  return useI18n().locale;
}
