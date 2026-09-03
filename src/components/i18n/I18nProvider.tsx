'use client';

/**
 * I18N PROVIDER (klient)
 * ----------------------------------------------------------------
 * Server layout lug'atni (oddiy JSON obyekt) bir marta uzatadi;
 * barcha klient komponentlari `useI18n()` / `useT()` orqali oladi.
 *
 * Nima uchun shunday:
 *   - Funksiyani (t) prop qilib uzatish RSC'da taqiqlangan
 *   - Prop drilling yo'q — istalgan chuqurlikdagi komponent oladi
 *   - Klient bundle'iga FAQAT joriy til lug'ati tushadi
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { translatorFrom, type TranslatorFn } from '@/i18n/translator';
import type { AppLocale, Dict, DictKey } from '@/i18n';

export interface I18nValue {
  locale: AppLocale;
  dict: Dict;
  t: TranslatorFn<DictKey>;
}

const I18nCtx = createContext<I18nValue | null>(null);

/** Provider bo'lmaganda ham qulamaslik uchun xavfsiz zaxira */
const EMPTY_T: TranslatorFn<DictKey> = (key) => String(key);

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: AppLocale;
  dict: Dict;
  children: ReactNode;
}) {
  const value = useMemo<I18nValue>(
    () => ({ locale, dict, t: translatorFrom<DictKey>(dict as unknown as Record<string, string>) }),
    [locale, dict],
  );
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nCtx);
  if (ctx) return ctx;
  return { locale: 'uz', dict: {} as Dict, t: EMPTY_T };
}

/** Faqat tarjimon kerak bo'lganda */
export function useT(): TranslatorFn<DictKey> {
  return useI18n().t;
}
