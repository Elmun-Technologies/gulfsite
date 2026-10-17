/**
 * ADMIN — SAYT KONTENTI: kontaktlar (WhatsApp/Telegram), mijoz logotiplari, videolar
 */

import { redirect } from 'next/navigation';
import { normalizeLocale } from '@/i18n';
import { requireAdmin } from '@/lib/guard';
import { adminCopy } from '@/lib/admin-copy';
import { getContent } from '@/lib/content';
import { PageTitle } from '@/components/admin/AdminUi';
import { ContentEditor } from '@/components/admin/ContentEditor';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!(await requireAdmin())) redirect(`/${normalizeLocale(raw)}/admin/login`);
  const locale = normalizeLocale(raw);
  const c = adminCopy(locale);

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title={c.content.title} sub={c.content.hint} />
      <ContentEditor initial={getContent()} copy={c} locale={locale} />
    </div>
  );
}
