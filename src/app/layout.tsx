/**
 * ILDIZ LAYOUT (texnik)
 * ----------------------------------------------------------------
 * Barcha sahifalar `app/[locale]/` segmenti ostida joylashgan, shuning
 * uchun haqiqiy <html>/<body> `app/[locale]/layout.tsx` da aniqlanadi —
 * bu `lang` atributini til bo'yicha to'g'ri qo'yish imkonini beradi
 * (SEO va ekran o'quvchilari uchun muhim).
 *
 * Bu fayl faqat bolalarni uzatadi.
 */

import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return children as React.JSX.Element;
}
