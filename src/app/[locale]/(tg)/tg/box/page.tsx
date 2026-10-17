/** MINI APP — NAMUNA QUTISI va rasmiylashtirish */

import { normalizeLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { UZ_REGIONS, tr, type Locale } from '@/lib/taxonomy';
import { TgBox } from '@/components/tg/TgBox';

export default async function TgBoxPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  return (
    <TgBox
      locale={locale}
      regions={UZ_REGIONS.map((r) => ({ id: r.id, label: tr(r.name, locale as Locale) }))}
      days={siteConfig.business.sampleDeliveryDays}
    />
  );
}
