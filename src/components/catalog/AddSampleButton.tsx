'use client';

/**
 * "+ NAMUNAGA" TUGMASI (§5, §7.2, §8.2)
 * ----------------------------------------------------------------
 * · Qutiga qo'shadi (bitta store — header, katalog bar, mahsulot sahifasi)
 * · Holat: "Qo'shildi" (check ikonkasi bilan)
 * · Quti to'lganda (9-element): toast "Qutida 8 ta joy bor"
 * · FlyToBox: mis nuqta tugmadan header'dagi quti ikonkasiga uchadi
 * · analytics: `sample_add` / `sample_remove` (§12)
 */

import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Plus } from 'lucide-react';
import type { ProductCard } from '@/lib/types';
import type { Locale } from '@/lib/taxonomy';
import { tr } from '@/lib/taxonomy';
import { dur, ease } from '@/lib/motion';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import { useToast } from '@/components/ui/Overlay';
import { flyToBox } from '@/components/motion';
import { fillVars } from '@/i18n/translator';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export interface AddSampleLabels {
  add: string;
  added: string;
  remove: string;
  /**
   * XOM shablon (`{max}` joy tutgichi bilan) — RSC funksiyani prop sifatida
   * yubora olmaydi, shuning uchun server `t.raw(…)` ni beradi (§10).
   */
  fullTpl: string;
}

export function AddSampleButton({
  product,
  locale,
  labels,
  source,
  variant = 'row',
  className,
}: {
  product: Pick<ProductCard, 'sku' | 'slug' | 'name' | 'form'>;
  locale: Locale;
  labels: AddSampleLabels;
  /** analytics `source`: catalog | product | industry | search */
  source: string;
  /** `row` — jadval/kartochka (kichik), `cta` — mahsulot sahifasi (xl) */
  variant?: 'row' | 'cta';
  className?: string;
}) {
  const box = useSampleBox();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const added = box.has(product.sku);

  const toggle = useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      const el = ev.currentTarget as HTMLElement;

      if (added) {
        box.remove(product.sku);
        track.sampleRemove(product.sku, source);
        return;
      }

      if (box.full) {
        toast.warning(fillVars(labels.fullTpl, { max: box.max }));
        return;
      }

      const res = box.add({
        sku: product.sku,
        slug: product.slug,
        name: product.name,
        defaultQty: 50,
        unit: product.form === 'oil' ? 'ml' : 'g',
      });

      if (res === 'full') {
        toast.warning(fillVars(labels.fullTpl, { max: box.max }));
        return;
      }
      if (res === 'exists') return;

      // Mis nuqta header'dagi qutiga uchadi (§8.2)
      setBusy(true);
      flyToBox(el, source);
      window.setTimeout(() => setBusy(false), 520);
      track.sampleAdd(product.sku, source, 50);
      toast.success(tr(product.name, locale), labels.added);
    },
    [added, box, labels, locale, product, source, toast],
  );

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={added}
      disabled={busy}
      className={cn(
        'btn relative shrink-0',
        variant === 'cta' ? 'btn--accent btn--xl min-w-[220px]' : added ? 'btn--outline btn--sm' : 'btn--primary btn--sm',
        className,
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={added ? 'added' : 'add'}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: dur.fast, ease: ease.out }}
          className="flex items-center gap-2"
        >
          {variant === 'row' ? (
            added ? <Check size={15} strokeWidth={2.4} aria-hidden /> : <Plus size={15} strokeWidth={2.2} aria-hidden />
          ) : null}
          {added ? labels.added : labels.add}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
