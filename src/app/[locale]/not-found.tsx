/**
 * 404 — server o'rovchi
 * ----------------------------------------------------------------
 * `not-found.tsx` ichida `params` ISHLATILMAYDI (Next.js uni bu faylga
 * uzatmaydi). Metadata (noIndex) eksport qilinishi uchun bu fayl server
 * komponent bo'lib qoladi, ko'rinish esa klient `NotFoundView` da.
 */

import type { Metadata } from 'next';
import { NotFoundView } from '@/components/layout/NotFoundView';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundView />;
}
