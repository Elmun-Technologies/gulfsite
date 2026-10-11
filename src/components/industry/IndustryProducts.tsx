'use client';

/**
 * SOHA MAHSULOTLARI JADVALI (§5, design/Industry.dc.html · 02 PRODUCTS)
 * ----------------------------------------------------------------
 * `.data-table` (§4.3): radius 28 konteyner, `overflow-x:auto`,
 * `min-width:820px` — kichik ekranda jadval O'Z QUTISIDA gorizontal
 * aylanadi, sahifa emas (§9.4).
 *
 * Har qatorda "+ Namunaga" — bitta store (§7.2).
 */

import Link from 'next/link';
import type { ProductCard } from '@/lib/types';
import type { Locale } from '@/lib/taxonomy';
import { tr } from '@/lib/taxonomy';
import { AddSampleButton, type AddSampleLabels } from '@/components/catalog/AddSampleButton';

export interface IndustryTableLabels extends AddSampleLabels {
  colProduct: string;
  colForm: string;
  colDose: string;
  colFeature: string;
  colSample: string;
  openProduct: string;
  tableCaption: string;
}

export function IndustryProductsTable({
  cards,
  locale,
  labels,
  productHrefBase,
  formLabels,
  featureLabels,
}: {
  cards: ProductCard[];
  locale: Locale;
  labels: IndustryTableLabels;
  productHrefBase: string;
  formLabels: Record<string, string>;
  featureLabels: Record<string, string>;
}) {
  return (
    <div className="overflow-x-auto rounded-media border border-line-soft">
      <table className="data-table w-full min-w-[820px]">
        <caption className="sr-only">{labels.tableCaption}</caption>
        <thead>
          <tr>
            <th scope="col">{labels.colProduct}</th>
            <th scope="col">{labels.colForm}</th>
            <th scope="col">{labels.colDose}</th>
            <th scope="col">{labels.colFeature}</th>
            <th scope="col" className="text-right">
              {labels.colSample}
            </th>
          </tr>
        </thead>
        <tbody>
          {cards.map((c) => (
            <tr key={c.sku}>
              <td>
                <Link
                  href={`${productHrefBase}/${c.slug}`}
                  className="flex flex-col gap-1 text-ink no-underline hover:text-copper-dark"
                >
                  <span className="text-[16px] font-medium">{tr(c.name, locale)}</span>
                  <span className="text-[13px] tracking-[0.04em] text-muted">{c.sku}</span>
                  <span className="sr-only">{labels.openProduct}</span>
                </Link>
              </td>
              <td>{formLabels[c.form] ?? c.form}</td>
              <td className="whitespace-nowrap">
                {c.dosageMin}–{c.dosageMax}%
              </td>
              <td>
                <span className="flex flex-wrap gap-1.5">
                  {c.features.slice(0, 2).map((f) => (
                    <span key={f} className="rounded-pill border border-line px-3 py-1 text-[13px]">
                      {featureLabels[f] ?? f}
                    </span>
                  ))}
                </span>
              </td>
              <td className="text-right">
                <AddSampleButton
                  product={c}
                  locale={locale}
                  labels={labels}
                  source="industry"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
