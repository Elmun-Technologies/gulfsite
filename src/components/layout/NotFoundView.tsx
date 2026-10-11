'use client';

/**
 * 404 KO'RINISHI (klient o'rovchi)
 * ----------------------------------------------------------------
 * Next.js `not-found.tsx` fayliga `params` UZATMAYDI — shuning uchun til
 * bu yerda ikki manbadan aniqlanadi:
 *   · `useI18n()` — layout'dagi I18nProvider (eng yaqin layout ichida
 *     render qilingani uchun lug'at mavjud);
 *   · zaxira: `usePathname()` ning birinchi segmenti.
 *
 * Vizual `NotFoundContent` da — u ildiz `app/not-found.tsx` bilan umumiy.
 */

import { usePathname } from 'next/navigation';
import { useI18n } from '@/components/i18n/I18nProvider';
import { normalizeLocale } from '@/i18n/meta';
import { NotFoundContent, notFoundLabels } from '@/components/layout/NotFoundContent';

export function NotFoundView() {
  const i18n = useI18n();
  const pathname = usePathname() ?? '/uz';

  const fromPath = normalizeLocale(pathname.split('/')[1] ?? 'uz');
  const locale = (i18n.dict && Object.keys(i18n.dict).length ? i18n.locale : fromPath) as typeof fromPath;

  return <NotFoundContent locale={locale} labels={notFoundLabels(i18n.t)} />;
}
