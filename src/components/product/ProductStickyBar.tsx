'use client';

/**
 * MAHSULOT SAHIFASI STICKY BAR (§9, §5)
 * ----------------------------------------------------------------
 * Server sahifasi callback bera olmaydi — shuning uchun `StickySampleBar`
 * bu yerda mijoz tomonida quti holati va toast bilan bog'lanadi.
 *
 * Faqat <768px, faqat mahsulot sahifasida ko'rinadi.
 */

import { useCallback } from 'react';
import { tr, type Locale } from '@/lib/taxonomy';
import { fillVars } from '@/i18n/translator';
import type { Trilingual } from '@/lib/taxonomy';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import { useToast } from '@/components/ui/Overlay';
import { flyToBox } from '@/components/motion';
import { track } from '@/lib/analytics';
import { StickySampleBar } from '@/components/layout/StickyCta';

export function ProductStickyBar({
  sku,
  slug,
  name,
  form,
  locale,
  boxHref,
  labels,
}: {
  sku: string;
  slug: string;
  name: Trilingual;
  form: string;
  locale: Locale;
  boxHref: string;
  labels: {
    /** `{count}` / `{max}` joy tutgichli xom shablonlar (RSC cheklovi) */
    countTpl: string;
    go: string;
    add: string;
    added: string;
    fullTpl: string;
  };
}) {
  const box = useSampleBox();
  const toast = useToast();
  const added = box.has(sku);

  const onAdd = useCallback(() => {
    if (added) {
      box.remove(sku);
      track.sampleRemove(sku, 'product-sticky');
      return;
    }
    if (box.full) {
      toast.warning(fillVars(labels.fullTpl, { max: box.max }));
      return;
    }
    const res = box.add({
      sku,
      slug,
      name,
      defaultQty: 50,
      unit: form === 'oil' ? 'ml' : 'g',
    });
    if (res === 'full') {
      toast.warning(fillVars(labels.fullTpl, { max: box.max }));
      return;
    }
    flyToBox(document.getElementById(`sample-cta-${sku}`), 'product');
    track.sampleAdd(sku, 'product-sticky', 50);
    toast.success(tr(name, locale), labels.added);
  }, [added, box, form, labels, locale, name, sku, slug, toast]);

  return (
    <StickySampleBar
      boxHref={boxHref}
      labels={labels}
      onAdd={onAdd}
      added={added}
    />
  );
}
