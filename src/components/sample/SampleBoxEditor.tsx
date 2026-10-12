'use client';

/**
 * NAMUNA QUTISI MUHARRIRI (§5, design/Samples.dc.html · BOX)
 * ----------------------------------------------------------------
 * Chap ustun: "Sizning qutingiz" + hisoblagich + progress bar (navy) +
 * element qatorlari (nom · meta · 25/50/100 g radiogroup · o'chirish) +
 * "Katalogdan qo'shish" (dashed) + "Qutini buyurtma qilish".
 *
 * Holat BITTA store'da (`SampleBoxProvider`) — header, katalog paneli,
 * mahsulot sahifasi va bu muharrir bir xil qutini ko'radi (§7.2).
 * 9-element qo'shilganda toast: "Qutida {max} ta joy bor".
 */

import { useCallback } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, Trash2, X } from 'lucide-react';
import type { SampleItem } from '@/lib/types';
import type { Locale } from '@/lib/taxonomy';
import { tr } from '@/lib/taxonomy';
import { dur, ease } from '@/lib/motion';
import { fillVars } from '@/i18n/translator';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export const SAMPLE_QTY_OPTIONS = [25, 50, 100] as const;

export interface SampleBoxLabels {
  title: string;
  /** `{count}` / `{max}` — progress bar uchun aria */
  progressLabel: string;
  emptyTitle: string;
  emptyHint: string;
  addFromCatalog: string;
  orderBox: string;
  removeItem: string;
  sizeLabel: string;
  gram: string;
  fullTpl: string;
  clear: string;
  clearConfirm: string;
  noteLabel: string;
  notePlaceholder: string;
}

export function SampleBoxEditor({
  locale,
  labels,
  catalogHref,
  formHref,
  metaBySku,
  className,
}: {
  locale: Locale;
  labels: SampleBoxLabels;
  catalogHref: string;
  /** "Qutini buyurtma qilish" — formaga o'tadi */
  formHref: string;
  /** element meta qatori: `SKU · forma` (server ma'lumotdan yig'adi) */
  metaBySku: Record<string, string>;
  className?: string;
}) {
  const box = useSampleBox();
  const pct = Math.round((box.count / box.max) * 100);

  const setQty = useCallback(
    (sku: string, qty: number) => {
      box.setQty(sku, qty);
      track.sampleSize(sku, qty);
    },
    [box],
  );

  const remove = useCallback(
    (sku: string) => {
      box.remove(sku);
      track.sampleRemove(sku, 'box');
    },
    [box],
  );

  const clear = useCallback(() => {
    if (!window.confirm(labels.clearConfirm)) return;
    box.clear();
    track.clearBox(box.count);
  }, [box, labels.clearConfirm]);

  return (
    <div
      className={cn(
        'flex min-w-0 flex-[1.4_1_560px] flex-col gap-6 rounded-block border border-line-soft p-[clamp(24px,3vw,40px)]',
        className,
      )}
    >
      {/* ---- sarlavha + hisoblagich + progress ---- */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="m-0 text-[clamp(30px,3vw,44px)] font-normal tracking-[-0.03em]">{labels.title}</h2>
          <span className="text-[17px] font-semibold">
            {box.count} <span className="font-normal text-muted">/ {box.max}</span>
          </span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-pill bg-panel"
          role="progressbar"
          aria-valuenow={box.count}
          aria-valuemin={0}
          aria-valuemax={box.max}
          aria-label={fillVars(labels.progressLabel, { count: box.count, max: box.max })}
        >
          <motion.div
            className="h-full rounded-pill bg-navy"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: dur.base, ease: ease.out }}
          />
        </div>
      </div>

      {/* ---- bo'sh holat ---- */}
      <AnimatePresence initial={false}>
        {box.count === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur.base, ease: ease.out }}
            className="flex flex-col items-center gap-3.5 rounded-media border border-dashed border-line px-6 py-12 text-center"
          >
            <span className="text-h5 font-normal">{labels.emptyTitle}</span>
            <span className="max-w-[420px] text-[15px] leading-snug text-muted">{labels.emptyHint}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ---- elementlar ---- */}
      {box.items.length ? (
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          <AnimatePresence initial={false}>
            {box.items.map((it) => (
              <SampleItemRow
                key={it.sku}
                item={it}
                locale={locale}
                labels={labels}
                meta={metaBySku[it.sku] ?? it.sku}
                onQty={setQty}
                onRemove={remove}
                onNote={box.setNote}
              />
            ))}
          </AnimatePresence>
        </ul>
      ) : null}

      {/* ---- amallar ---- */}
      <div className="flex flex-col gap-3">
        <Link
          href={catalogHref}
          className="flex items-center justify-center gap-2.5 rounded-media border-[1.5px] border-dashed border-line px-5 py-[22px] text-[16px] font-medium text-ink no-underline transition-colors hover:border-ink"
        >
          <Plus size={18} strokeWidth={2} aria-hidden />
          {labels.addFromCatalog}
        </Link>

        <div className="flex flex-wrap gap-3">
          <a href={formHref} className="btn btn--accent btn--lg flex-1" data-ga="cta_sample_box_submit">
            {labels.orderBox}
          </a>
          {box.count ? (
            <button type="button" onClick={clear} className="btn btn--ghost btn--lg">
              <Trash2 size={16} strokeWidth={1.8} aria-hidden />
              {labels.clear}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ---------------- element qatori ---------------- */

function SampleItemRow({
  item,
  meta,
  locale,
  labels,
  onQty,
  onRemove,
  onNote,
}: {
  item: SampleItem;
  meta: string;
  locale: Locale;
  labels: SampleBoxLabels;
  onQty: (sku: string, qty: number) => void;
  onRemove: (sku: string) => void;
  onNote: (sku: string, note: string) => void;
}) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: dur.base, ease: ease.out }}
      className="flex flex-wrap items-center justify-between gap-3.5 rounded-media bg-panel py-[18px] pl-[26px] pr-[18px]"
    >
      <span className="flex min-w-0 flex-[1_1_220px] flex-col gap-1">
        <span className="truncate text-[18px] font-semibold">{tr(item.name, locale)}</span>
        <span className="text-[14px] text-muted">{meta}</span>
      </span>

      <span className="flex items-center gap-2">
        {/* namuna hajmi — radiogroup (§7.2) */}
        <span
          role="radiogroup"
          aria-label={labels.sizeLabel}
          className="flex gap-0.5 rounded-pill bg-white p-1"
        >
          {SAMPLE_QTY_OPTIONS.map((q) => {
            const on = item.qty === q;
            return (
              <button
                key={q}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => onQty(item.sku, q)}
                className={cn(
                  'relative h-9 rounded-pill px-3.5 text-[14px] font-medium transition-colors',
                  on ? 'text-white' : 'text-ink hover:text-copper-dark',
                )}
              >
                {on ? (
                  <motion.span
                    layoutId={`qty-${item.sku}`}
                    className="absolute inset-0 rounded-pill bg-navy"
                    transition={{ duration: dur.base, ease: ease.out }}
                  />
                ) : null}
                <span className="relative">
                  {q} {labels.gram}
                </span>
              </button>
            );
          })}
        </span>

        <button
          type="button"
          onClick={() => onRemove(item.sku)}
          aria-label={fillVars(labels.removeItem, { name: tr(item.name, locale) })}
          className="btn-icon btn-icon--44 btn-icon--outline shrink-0"
        >
          <X size={16} strokeWidth={2} aria-hidden />
        </button>
      </span>

      {/* izoh — ixtiyoriy, texnologga yordam beradi */}
      <label className="flex w-full flex-col gap-1.5">
        <span className="label">{labels.noteLabel}</span>
        <input
          type="text"
          value={item.note ?? ''}
          maxLength={300}
          placeholder={labels.notePlaceholder}
          onChange={(e) => onNote(item.sku, e.target.value)}
          className="field-input h-11"
        />
      </label>
    </motion.li>
  );
}

/** Bitta element allaqachon qutidami (to'plam tugmasi uchun) */
export function setAddedState(items: SampleItem[], skus: string[]): boolean {
  return skus.length > 0 && skus.every((s) => items.some((i) => i.sku === s));
}

