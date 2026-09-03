/**
 * ADMIN PANEL QOBIG'I — (panel) route guruhi
 * ----------------------------------------------------------------
 * Ikki qatlamli himoya:
 *   1. `src/proxy.ts` — so'rov darajasida cookie tekshiruvi va redirect;
 *   2. SHU layout — server tomonida `requireAdmin()`.
 *
 * Proxy'ni aylanib o'tish holatida (masalan to'g'ridan-to'g'ri render)
 * panel baribir ochilmaydi.
 *
 * `getStats()` bu yerda bir marta chaqiriladi va qobiqqa (unseen badge,
 * saqlash holati, bildirishnoma kanallari) uzatiladi — har bir sahifa
 * uchun qayta hisoblash shart emas.
 */

import { redirect } from 'next/navigation';
import { normalizeLocale } from '@/i18n';
import { requireAdmin } from '@/lib/guard';
import { getStats } from '@/lib/leads/store';
import { notificationChannels } from '@/lib/config';
import { AdminShell } from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AdminPanelLayout({ children, params }: Props) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);

  if (!(await requireAdmin())) {
    redirect(`/${locale}/admin/login`);
  }

  const stats = getStats();

  return (
    <AdminShell
      locale={locale}
      unseen={stats.unseen}
      storage={stats.storage}
      channels={notificationChannels()}
    >
      {children}
    </AdminShell>
  );
}
