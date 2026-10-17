'use client';

/**
 * NAMUNA FORMASI KO'PRIGI (§5, §7.2, §11)
 * ----------------------------------------------------------------
 * Server sahifasi quti holatini bilmaydi (u localStorage'da) — shuning
 * uchun `GffLeadForm` mijoz tomonida quti bilan shu ko'prik orqali bog'lanadi:
 *
 *   · qutidagi mahsulotlar lead payload'iga tushadi (`request.products`)
 *   · quti BO'SH bo'lsa yuborish bloklanadi + ogohlantirish ko'rsatiladi
 *     (server sxemasi `type: 'sample'` uchun kamida 1 ta mahsulot talab
 *      qiladi — `src/lib/leads/schema.ts`)
 *   · muvaffaqiyatdan keyin quti tozalanadi (`sample_submit` — GffLeadForm'da)
 *   · "rahmat" matnidagi `{count}` / `{minutes}` joy tutgichlari to'ldiriladi
 */

import { useCallback, useMemo, useState } from 'react';
import { ArrowRight, Package } from 'lucide-react';
import type { AppLocale } from '@/i18n';
import type { LeadLabels } from '@/components/lead/GffLeadForm';
import { GffLeadForm } from '@/components/lead/GffLeadForm';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import { fillVars } from '@/i18n/translator';

export function SamplesFormBridge({
  locale,
  labels,
  regions,
  successLinks,
  submitHint,
  emptyWarning,
  emptyWarningHint,
  catalogCta,
  catalogHref,
  responseMinutes,
  className,
}: {
  locale: AppLocale;
  /** `thanksText` — `{count}` va `{minutes}` joy tutgichli XOM shablon */
  labels: Omit<LeadLabels, 'thanksText'> & { thanksText: string };
  regions: { id: string; label: string }[];
  successLinks: { href: string; label: string }[];
  submitHint: string;
  emptyWarning: string;
  emptyWarningHint: string;
  catalogCta: string;
  catalogHref: string;
  responseMinutes: number;
  className?: string;
}) {
  const box = useSampleBox();
  // yuborilgan paytdagi son — `clear()` dan keyin "rahmat" matni 0 ko'rsatmasin
  const [sentCount, setSentCount] = useState<number | null>(null);
  const submittedCount = sentCount ?? box.count;

  const products = useMemo(
    () =>
      box.items.map((it) => ({
        sku: it.sku,
        slug: it.slug,
        name: it.name,
        qty: it.qty,
        unit: it.unit,
        note: it.note,
      })),
    [box.items],
  );

  const onSubmitted = useCallback(
    // `sample_submit` hodisasini GffLeadForm o'zi yuboradi (ikki marta sanalmasin)
    () => {
      setSentCount(box.count);
      box.clear();
    },
    [box],
  );

  const resolved: LeadLabels = {
    ...labels,
    thanksText: fillVars(labels.thanksText, {
      count: submittedCount,
      minutes: responseMinutes,
    }),
  };

  return (
    <div className={className}>
      {/* quti bo'sh — nima qilishni aytamiz (server bu arizani qabul qilmaydi) */}
      {box.ready && box.count === 0 && sentCount === null ? (
        <div className="mb-3 flex flex-col gap-2 rounded-card border border-dashed border-line bg-panel p-5">
          <span className="flex items-center gap-2.5 text-body-l font-medium">
            <Package size={18} strokeWidth={1.8} aria-hidden />
            {emptyWarning}
          </span>
          <span className="text-[15px] leading-snug text-muted">{emptyWarningHint}</span>
          <a href={catalogHref} className="btn btn--outline btn--sm mt-1 self-start">
            {catalogCta}
            <ArrowRight size={16} strokeWidth={2} aria-hidden />
          </a>
        </div>
      ) : null}

      <GffLeadForm
        type="sample"
        locale={locale}
        variant="samples"
        labels={resolved}
        products={products}
        regions={regions}
        successLinks={successLinks}
        onSubmitted={onSubmitted}
        disabled={box.ready && box.count === 0}
        submitHint={submitHint}
      />
    </div>
  );
}
