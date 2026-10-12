'use client';

/**
 * STICKY CTA — mobil pastki panel (§9)
 * ----------------------------------------------------------------
 * FAQAT mahsulot va katalog sahifalarida, FAQAT <768px, balandlik 56px,
 * `safe-area-inset-bottom` hisobga olinadi.
 *
 * Holatlar: "Qo'shish" → "Qo'shildi ✓" (320ms), quti to'lganda
 * toast: "Qutida 8 ta joy bor" (§7.2).
 */

import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { Check } from 'lucide-react';
import { dur, ease } from '@/lib/motion';
import { fillVars } from '@/i18n/translator';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import { cn } from '@/lib/utils';

export function StickySampleBar({
  boxHref,
  labels,
  onAdd,
  added,
  addDisabled = false,
}: {
  boxHref: string;
  /** `countTpl` — `{count}` va `{max}` joy tutgichli xom shablon (RSC cheklovi) */
  labels: { countTpl: string; go: string; add: string; added: string };
  /** mahsulot sahifasida — qo'shish tugmasi ko'rinadi */
  onAdd?: () => void;
  added?: boolean;
  addDisabled?: boolean;
}) {
  const { count, max } = useSampleBox();

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-[95] hidden max-tab:block',
        'border-t border-line-soft bg-white/95 backdrop-blur-sm',
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex h-14 items-center gap-2 px-4">
        <span className="min-w-0 flex-1 truncate text-[14px] text-body">
          {fillVars(labels.countTpl, { count, max })}
        </span>

        <AnimatePresence initial={false} mode="wait">
          {onAdd ? (
            <motion.button
              key={added ? 'added' : 'add'}
              type="button"
              onClick={onAdd}
              disabled={addDisabled}
              aria-pressed={added}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: dur.fast, ease: ease.out }}
              className={cn('btn h-11 shrink-0 px-4 text-[15px]', added ? 'btn--outline' : 'btn--accent')}
            >
              {added ? <Check size={16} strokeWidth={2.4} aria-hidden /> : null}
              {added ? labels.added : labels.add}
            </motion.button>
          ) : null}
        </AnimatePresence>

        <Link href={boxHref} className="btn btn--primary h-11 shrink-0 px-4 text-[15px]">
          {labels.go}
        </Link>
      </div>
    </div>
  );
}
