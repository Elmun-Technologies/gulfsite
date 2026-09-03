'use client';

/**
 * TEST BOX SO'ROVI FORMASI
 * ----------------------------------------------------------------
 * Kichik o'ram komponent: localStorage'dagi test box elementlarini
 * o'qib, LeadForm'ga uzatadi. Server komponenti localStorage'ni
 * ko'ra olmaydi, shuning uchun bu qadam klientda bajariladi.
 *
 * Box bo'sh bo'lsa — forma ko'rsatilmaydi, o'rniga katalogga
 * yo'naltiruvchi taklif chiqadi (foydalanuvchi adashmasligi uchun).
 */

import { useEffect, useState } from 'react';
import { LeadForm } from '@/components/lead/LeadForm';
import { useSampleBox } from './SampleBoxProvider';
import { useI18n } from '@/components/i18n/I18nProvider';
import type { Locale } from '@/lib/taxonomy';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export function SampleRequestForm({
  locale,
  catalogHref,
  onSent,
}: {
  locale: Locale;
  catalogHref: string;
  onSent?: () => void;
}) {
  const { items, ready, clear } = useSampleBox();
  const { t } = useI18n();
  const [sent, setSent] = useState(false);

  // Muvaffaqiyatli yuborilgach boxni tozalaymiz (bir xil arizani ikki marta yubormaslik uchun)
  useEffect(() => {
    if (sent) clear();
  }, [sent, clear]);

  if (!ready) {
    // Gidratsiyagacha skelet — SSR/klient mos kelmasligining oldini oladi
    return (
      <div className="rounded-2xl border border-cream-200 bg-white p-6 shadow-soft">
        <div className="h-16 w-full animate-pulse rounded-xl bg-cream-200/70" />
        <div className="mt-4 h-11 w-full animate-pulse rounded-xl bg-cream-200/70" />
        <div className="mt-3 h-11 w-2/3 animate-pulse rounded-xl bg-cream-200/70" />
      </div>
    );
  }

  if (items.length === 0 && !sent) {
    return (
      <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-50/70 p-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint-100 text-teal-600" aria-hidden>
          <Icon name="box" size={24} />
        </span>
        <p className="mt-3 font-display text-[15px] font-bold text-pine-900">{t('samples.boxEmpty')}</p>
        <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-relaxed text-slate-warm-600">
          {t('samples.boxEmptyHint')}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <ButtonLink href={catalogHref} variant="primary" size="md" icon="grid">
            {t('samples.goToCatalog')}
          </ButtonLink>
          <ButtonLink href={`/${locale}/quote`} variant="outline" size="md" icon="invoice">
            {t('nav.quote')}
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <LeadForm
      type="sample"
      locale={locale}
      products={items}
      title={t('samples.submit')}
      subtitle={t('samples.submitHint')}
      submitLabel={t('form.submitSample')}
      nextHref={catalogHref}
      nextLabel={t('samples.continueBrowsing')}
      onDone={() => {
        // LeadForm analitikani o'zi yuboradi; bu yerda faqat boxni tozalaymiz
        setSent(true);
        onSent?.();
      }}
    />
  );
}

export default SampleRequestForm;
