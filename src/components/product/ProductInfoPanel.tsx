'use client';

/**
 * MAHSULOT MA'LUMOT PANELI (§5, design/Product.dc.html · INFO)
 * ----------------------------------------------------------------
 * Kategoriya/guruh pill'lari · H1 · SKU + ombor holati · tavsif ·
 * 4 ta spec plitkasi (shakli / dozirovka / qadoq / ishlab chiqaruvchi) ·
 * xususiyat teg'lari · NAMUNA HAJMI radiogroup (25/50/100 g) ·
 * "+ Namunaga" (xl) va "Narx so'rash".
 *
 * Namuna hajmi BITTA store'da (`SampleBoxProvider`) — header hisoblagichi,
 * katalog paneli va bu tugma bir xil holatni ko'radi (§7.2).
 */

import { useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import type { CatalogProduct } from '@/lib/types';
import type { Locale } from '@/lib/taxonomy';
import { tr } from '@/lib/taxonomy';
import { dur, ease } from '@/lib/motion';
import { fillVars } from '@/i18n/translator';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import { useToast } from '@/components/ui/Overlay';
import { flyToBox } from '@/components/motion';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export const SAMPLE_SIZES = [25, 50, 100] as const;
export type SampleSize = (typeof SAMPLE_SIZES)[number];

export interface ProductInfoLabels {
  /** "Namuna hajmi" */
  sampleSize: string;
  /** gramm birligi ("g" / "г") */
  gram: string;
  add: string;
  added: string;
  askPrice: string;
  /** "Namuna bepul. Toshkent bo'ylab 3 ish kunida…" */
  note: string;
  /** quti to'lganda: "Qutida {max} ta joy bor" (xom shablon) */
  fullTpl: string;
  form: string;
  dosage: string;
  packaging: string;
  maker: string;
  makerValue: string;
}

export function ProductInfoPanel({
  id,
  product,
  locale,
  labels,
  categoryLabel,
  groupLabel,
  formValue,
  packValue,
  availabilityLabel,
  availabilityTone,
  description,
  features,
  badge,
  askPriceHref,
  className,
}: {
  /** FlyToBox nishoni uchun DOM id */
  id?: string;
  product: CatalogProduct;
  locale: Locale;
  labels: ProductInfoLabels;
  categoryLabel: string;
  groupLabel: string;
  formValue: string;
  packValue: string;
  availabilityLabel: string;
  availabilityTone: string;
  description: string;
  features: string[];
  badge?: string;
  askPriceHref: string;
  className?: string;
}) {
  const box = useSampleBox();
  const toast = useToast();
  const [size, setSize] = useState<SampleSize>(50);
  const added = box.has(product.sku);

  const changeSize = useCallback(
    (next: SampleSize) => {
      setSize(next);
      // allaqachon qutida bo'lsa — hajmni darhol yangilaymiz
      if (box.has(product.sku)) box.setQty(product.sku, next);
    },
    [box, product.sku],
  );

  const toggle = useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      if (added) {
        box.remove(product.sku);
        track.sampleRemove(product.sku, 'product');
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
        defaultQty: size,
        unit: product.form === 'oil' ? 'ml' : 'g',
      });
      if (res === 'full') {
        toast.warning(fillVars(labels.fullTpl, { max: box.max }));
        return;
      }
      if (res === 'exists') return;
      flyToBox(ev.currentTarget as HTMLElement, 'product');
      track.sampleAdd(product.sku, 'product', size);
      toast.success(tr(product.name, locale), labels.added);
    },
    [added, box, labels, locale, product, size, toast],
  );

  const specs = [
    { label: labels.form, value: formValue },
    {
      label: labels.dosage,
      value: `${product.dosage.min}–${product.dosage.max}${product.dosage.unit}`,
    },
    { label: labels.packaging, value: packValue },
    { label: labels.maker, value: labels.makerValue },
  ];

  return (
    <div
      id={id}
      className={cn(
        'flex min-w-0 flex-1 basis-[480px] flex-col gap-7 rounded-block bg-panel p-[clamp(24px,3.6vw,52px)]',
        className,
      )}
    >
      {/* ---- pill'lar ---- */}
      <div className="flex flex-wrap gap-2">
        <span className="rounded-pill bg-white px-4 py-2 text-[14px] font-medium">{categoryLabel}</span>
        <span className="rounded-pill border border-line px-4 py-2 text-[14px] font-medium">{groupLabel}</span>
        {badge ? (
          <span className="rounded-pill border border-line px-4 py-2 text-[14px] font-medium">{badge}</span>
        ) : null}
      </div>

      {/* ---- nom + SKU + ombor ---- */}
      <div className="flex flex-col gap-3.5">
        <h1 className="m-0 text-[clamp(33px,4.8vw,76px)] font-normal leading-[0.98] tracking-[-0.035em]">
          {tr(product.name, locale)}
        </h1>
        <span className="flex flex-wrap items-center gap-3.5 text-[15px] text-muted">
          <span>
            SKU <span className="tracking-[0.04em] text-ink">{product.sku}</span>
          </span>
          <span className="inline-flex items-center gap-2 text-ink">
            <span
              className="h-2 w-2 rounded-pill"
              style={{ background: availabilityTone }}
              aria-hidden
            />
            {availabilityLabel}
          </span>
        </span>
      </div>

      {/* ---- tavsif ---- */}
      <p className="m-0 text-body-l text-body">{description}</p>

      {/* ---- 4 ta spec plitkasi ---- */}
      <div className="grid grid-cols-2 gap-2.5">
        {specs.map((s) => (
          <div key={s.label} className="flex flex-col gap-1.5 rounded-tile bg-white px-[22px] py-[18px]">
            <span className="text-[13px] italic text-muted">{s.label}</span>
            <span className="text-[clamp(17px,1.5vw,22px)] font-medium leading-snug">{s.value}</span>
          </div>
        ))}
      </div>

      {/* ---- xususiyatlar ---- */}
      {features.length ? (
        <div className="flex flex-wrap gap-2">
          {features.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-2 rounded-pill border border-line px-3.5 py-2 text-[14px]"
            >
              <Check size={14} strokeWidth={2.4} aria-hidden />
              {f}
            </span>
          ))}
        </div>
      ) : null}

      {/* ---- NAMUNA HAJMI (§7.2: 25/50/100 g, standart 50) ---- */}
      <div className="flex flex-col gap-3">
        <span className="label">{labels.sampleSize}</span>
        <div role="radiogroup" aria-label={labels.sampleSize} className="flex flex-wrap gap-2">
          {SAMPLE_SIZES.map((s) => {
            const on = s === size;
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => changeSize(s)}
                className={cn(
                  'relative h-11 rounded-pill px-5 text-[15px] font-medium transition-colors',
                  on ? 'text-white' : 'border border-line text-ink hover:border-ink',
                )}
              >
                {on ? (
                  <motion.span
                    layoutId="product-size-bg"
                    className="absolute inset-0 -z-10 rounded-pill bg-navy"
                    transition={{ duration: dur.base, ease: ease.out }}
                  />
                ) : null}
                <span className="relative">
                  {s} {labels.gram}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---- CTA ---- */}
      <div className="flex flex-wrap gap-3">
        <motion.button
          type="button"
          onClick={toggle}
          aria-pressed={added}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: dur.fast, ease: ease.out }}
          className={cn('btn min-w-[200px] flex-1', added ? 'btn--outline btn--xl' : 'btn--accent btn--xl')}
        >
          {added ? <Check size={18} strokeWidth={2.4} aria-hidden /> : null}
          {added ? labels.added : labels.add}
        </motion.button>

        <a href={askPriceHref} className="btn btn--outline btn--xl" data-ga="cta_price_request">
          {labels.askPrice}
        </a>
      </div>

      <span className="text-[14px] leading-snug text-muted">{labels.note}</span>
    </div>
  );
}
