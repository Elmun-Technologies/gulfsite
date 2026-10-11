'use client';

/**
 * TAYYOR TO'PLAMLAR (§5, design/Samples.dc.html · SETS · §7.2)
 * ----------------------------------------------------------------
 * Har bir to'plam — ma'lumotdan yig'ilgan 5 ta eng ommabop SKU
 * (`lib/design.ts → readySets()`), hardcode EMAS.
 *
 * "To'plamni qo'shish": `box.addMany()` + `flyToBoxMany()` (bir nechta
 * mis nuqta header'dagi qutiga uchadi). Quti to'lib ketsa — qancha
 * joylashgani va qanchasi sig'magani toast'da aytiladi.
 */

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { Check } from 'lucide-react';
import type { Trilingual } from '@/lib/taxonomy';
import { tr, type Locale } from '@/lib/taxonomy';
import { dur, ease } from '@/lib/motion';
import { fillVars } from '@/i18n/translator';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import { useToast } from '@/components/ui/Overlay';
import { flyToBoxMany } from '@/components/motion';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export interface SetPayload {
  id: string;
  title: string;
  image: string;
  dark: boolean;
  chips: string[];
  items: { sku: string; slug: string; name: Trilingual; unit: 'g' | 'ml' | 'kg' }[];
}

export function SampleSets({
  sets,
  locale,
  labels,
  className,
}: {
  sets: SetPayload[];
  locale: Locale;
  labels: {
    add: string;
    added: string;
    /** "{added} ta qo'shildi, {skipped} tasi sig'madi" */
    partialTpl: string;
    fullTpl: string;
    sizeLabel: string;
  };
  className?: string;
}) {
  const box = useSampleBox();
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  const addedSets = useMemo(
    () => new Set(sets.filter((s) => s.items.every((i) => box.has(i.sku))).map((s) => s.id)),
    [box, sets],
  );

  const addSet = useCallback(
    (set: SetPayload, el: HTMLElement) => {
      if (box.full) {
        toast.warning(fillVars(labels.fullTpl, { max: box.max }));
        return;
      }

      const res = box.addMany(
        set.items.map((i) => ({
          sku: i.sku,
          slug: i.slug,
          name: i.name,
          defaultQty: 50,
          unit: i.unit,
        })),
      );

      if (res.added === 0) {
        toast.info(set.title, labels.added);
        return;
      }

      setBusy(set.id);
      flyToBoxMany(el, res.added, 'set');
      window.setTimeout(() => setBusy(null), 520);
      track.sampleSetAdd(set.id, res.added, 'samples');

      if (res.skipped > 0) {
        toast.warning(
          set.title,
          fillVars(labels.partialTpl, { added: res.added, skipped: res.skipped }),
        );
      } else {
        toast.success(set.title, labels.added);
      }
    },
    [box, labels, toast],
  );

  return (
    <div
      className={cn(
        'grid gap-3 pt-[clamp(24px,3.1vw,40px)] [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]',
        className,
      )}
    >
      {sets.map((set, i) => {
        const added = addedSets.has(set.id);
        return (
          <motion.article
            key={set.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: dur.reveal, ease: ease.out, delay: Math.min(i, 7) * 0.06 }}
            className={cn(
              'flex min-h-[380px] flex-col gap-5 rounded-card p-[clamp(24px,2.2vw,32px)]',
              set.dark ? 'bg-navy text-white' : 'bg-panel text-ink',
            )}
          >
            <Image
              src={set.image}
              alt=""
              aria-hidden
              width={120}
              height={126}
              className="h-[126px] w-[120px] object-contain"
            />

            <h3 className="m-0 text-[clamp(22px,1.8vw,26px)] font-medium tracking-[-0.02em]">{set.title}</h3>

            <div className="flex flex-grow flex-wrap content-start gap-1.5">
              {set.chips.map((c) => (
                <span
                  key={c}
                  className={cn(
                    'rounded-pill border px-3.5 py-[7px] text-[14px]',
                    set.dark ? 'border-[#4A4878] text-white' : 'border-line text-ink',
                  )}
                >
                  {c}
                </span>
              ))}
            </div>

            <motion.button
              type="button"
              onClick={(e) => addSet(set, e.currentTarget)}
              disabled={busy === set.id}
              aria-pressed={added}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: dur.fast, ease: ease.out }}
              className={cn(
                'btn btn--lg self-start',
                set.dark ? 'btn--accent' : added ? 'btn--outline' : 'btn--primary',
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
                  {added ? <Check size={17} strokeWidth={2.4} aria-hidden /> : null}
                  {added ? labels.added : labels.add}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </motion.article>
        );
      })}
    </div>
  );
}

/** Server tomoni uchun yordamchi: mahsulot nomi → chip matni */
export function chipName(name: Trilingual, locale: Locale): string {
  return tr(name, locale);
}
