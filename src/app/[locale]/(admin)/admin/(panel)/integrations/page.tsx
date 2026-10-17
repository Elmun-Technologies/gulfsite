/**
 * ADMIN — INTEGRATSIYALAR: analitika, piksellar va qidiruv tizimlari tasdig'i
 * (kod yozmasdan; saqlash — sayt kontenti bilan bir faylda, fly volume).
 */

import { redirect } from 'next/navigation';
import { normalizeLocale } from '@/i18n';
import { requireAdmin } from '@/lib/guard';
import { effectiveIntegrations, getContent } from '@/lib/content';
import { IntegrationsEditor } from '@/components/admin/IntegrationsEditor';

export const dynamic = 'force-dynamic';

export default async function AdminIntegrationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!(await requireAdmin())) redirect(`/${normalizeLocale(raw)}/admin/login`);
  const locale = normalizeLocale(raw);
  const own = getContent().integrations;
  return <IntegrationsEditor initial={own} effective={effectiveIntegrations(own)} locale={locale} />;
}
