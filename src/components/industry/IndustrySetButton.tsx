'use client';

/**
 * "TO'PLAMNI OLISH" (§5, design/Industry.dc.html · 03 SET · §7.2)
 * ----------------------------------------------------------------
 * Soha uchun ma'lumotdan yig'ilgan 5 ta SKU'ni bir bosishda qutiga
 * qo'shadi (`addMany`) va `flyToBoxMany` bilan bir nechta mis nuqtani
 * header'dagi qutiga uchiradi. Quti to'lgan bo'lsa — toast.
 *
 * To'plam tarkibi HAR DOIM ma'lumotdan (`lib/design.ts → industrySet()`),
 * dizayndagi SKU'lar emas: ularning bir qismi real katalogda yo'q (§7.1).
 */

import { useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Check } from 'lucide-react';
import type { Trilingual } from '@/lib/taxonomy';
import { dur, ease } from '@/lib/motion';
import { fillVars } from '@/i18n/translator';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import { useToast } from '@/components/ui/Overlay';
import { flyToBoxMany } from '@/components/motion';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export interface IndustrySetItem {
  sku: string;
  slug: string;
  name: Trilingual;
  unit: 'g' | 'ml' | 'kg';
}

export function IndustrySetButton({
  setId,
  items,
  labels,
  className,
}: {
  setId: string;
  items: IndustrySetItem[];
  labels: {
    get: string;
    added: string;
    partialTpl: string;
    fullTpl: string;
  };
  className?: string;
}) {
  const box = useSampleBox();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const added = items.length > 0 && items.every((i) => box.has(i.sku));

  const onClick = useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      if (box.full && !added) {
        toast.warning(fillVars(labels.fullTpl, { max: box.max }));
        return;
      }

      const res = box.addMany(
        items.map((i) => ({ sku: i.sku, slug: i.slug, name: i.name, defaultQty: 50, unit: i.unit })),
      );

      if (res.added === 0) {
        toast.info(labels.added);
        return;
      }

      setBusy(true);
      flyToBoxMany(ev.currentTarget as HTMLElement, res.added, 'industry');
      window.setTimeout(() => setBusy(false), 520);
      track.sampleSetAdd(setId, res.added, 'industry');

      if (res.skipped > 0) {
        toast.warning(fillVars(labels.partialTpl, { added: res.added, skipped: res.skipped }));
      } else {
        toast.success(labels.added);
      }
    },
    [added, box, items, labels, setId, toast],
  );

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-pressed={added}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: dur.fast, ease: ease.out }}
      className={cn('btn btn--accent btn--xl shrink-0', className)}
    >
      {added ? <Check size={18} strokeWidth={2.4} aria-hidden /> : <ArrowUpRight size={18} aria-hidden />}
      {added ? labels.added : labels.get}
    </motion.button>
  );
}
