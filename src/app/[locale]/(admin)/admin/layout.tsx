/**
 * ADMIN LAYOUT (tashqi)
 * ----------------------------------------------------------------
 * Bu yerda faqat metadata: panel qidiruv tizimlariga kirmasligi kerak.
 * Asosiy qobiq `(panel)/layout.tsx` da — shunda `/admin/login` sahifasi
 * qobiqsiz, mustaqil ochiladi.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Admin — GFF Uzbekistan',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
