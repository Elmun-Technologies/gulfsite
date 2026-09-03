'use client';

/**
 * TEST BOX MUHARRIRI
 * ----------------------------------------------------------------
 * /samples sahifasidagi tanlangan mahsulotlar ro'yxati.
 * Har bir element uchun: miqdor (g/ml), izoh, o'chirish.
 * Hammasi localStorage'da — sahifa yangilansa ham saqlanadi.
 *
 * Bo'sh holatda: katalogdan tanlashga undash + taylov to'plamlar
 * ("tez boshlash" uchun 4–6 ta mashhur pozitsiya).
 */

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/config';
import type { Locale, Trilingual } from '@/lib/taxonomy';
import { useSampleBox } from './SampleBoxProvider';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useToast } from '@/components/ui/Overlay';
import { track } from '@/lib/analytics';
import { Icon } from '@/components/ui/Icon';
import { Button, ButtonLink, IconButton } from '@/components/ui/Button';
import { Badge, EmptyState, ProgressBar } from '@/components/ui/Display';

export interface QuickSet {
  id: string;
  label: string;
  hint: string;
  items: { sku: string; slug: string; name: Trilingual }[];
}

interface Props {
  locale: Locale;
  catalogHref: string;
  productHrefBase: string;
  /** Server tayyorlagan "tez to'plamlar" */
  quickSets: QuickSet[];
}

/** So'rov formasiga o'tish (forma shu sahifada, pastda joylashgan) */
function goToForm() {
  const el = document.getElementById('sample-request');
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => el.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true }), 550);
}

const QTY_PRESETS = [25, 50, 100, 250, 500];

export function SampleBoxEditor({ locale, catalogHref, productHrefBase, quickSets }: Props) {
  const { t } = useI18n();
  const toast = useToast();
  const { items, count, max, full, remove, setQty, setNote, clear, addMany } = useSampleBox();
  const [confirmClear, setConfirmClear] = useState(false);
  const [justAddedSet, setJustAddedSet] = useState<string | null>(null);

  const applySet = (setId: string) => {
    const setItem = quickSets.find((s) => s.id === setId);
    if (!setItem) return;
    const res = addMany(setItem.items.map((i) => ({ sku: i.sku, slug: i.slug, name: i.name })));
    setJustAddedSet(setId);
    setTimeout(() => setJustAddedSet(null), 1800);
    if (res.added > 0) {
      toast.success(t('card.addedToBox'), `${setItem.label}: +${res.added}`);
      track.addToBox(`set:${setId}`);
    }
    if (res.skipped > 0) {
      toast.info(t('samples.itemsMax', { max }), `−${res.skipped}`);
    }
  };

  const totalGrams = items.reduce((s, i) => s + (i.unit === 'kg' ? i.qty * 1000 : i.qty), 0);

  return (
    <div className="flex flex-col gap-5">
      {/* ---- Sarlavha + hisoblagich ---- */}
      <div className="rounded-2xl border border-cream-200 bg-white p-4 shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint-100 text-teal-600" aria-hidden>
            <Icon name="box" size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[16px] font-extrabold tracking-tight text-pine-900">{t('samples.yourBox')}</h2>
            <p className="mt-0.5 text-[12.5px] text-slate-warm-600">
              {t('samples.itemsCount', { count })} · {t('samples.itemsMax', { max })}
            </p>
          </div>
          {count > 0 ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon="trash"
                onClick={() => {
                  if (confirmClear) {
                    track.clearBox(count);
                    clear();
                    setConfirmClear(false);
                    toast.info(t('samples.clear'));
                  } else {
                    setConfirmClear(true);
                    setTimeout(() => setConfirmClear(false), 3500);
                  }
                }}
                className={cn(confirmClear && 'border-clay-400 bg-clay-100 text-clay-600')}
              >
                {confirmClear ? t('samples.clearConfirm') : t('samples.clear')}
              </Button>
            </div>
          ) : null}
        </div>

        <div className="mt-3.5">
          <ProgressBar value={count} max={max} tone={full ? 'gold' : 'teal'} />
          <p className="mt-1.5 text-[11.5px] text-slate-warm-500">
            {full ? t('samples.boxFull') : t('samples.step1Hint')}
            {totalGrams > 0 ? ` · ~${totalGrams >= 1000 ? `${(totalGrams / 1000).toFixed(1)} kg` : `${totalGrams} g`}` : ''}
          </p>
        </div>
      </div>

      {/* ---- Elementlar ---- */}
      {count === 0 ? (
        <>
          <EmptyState
            icon="box"
            title={t('samples.boxEmpty')}
            description={t('samples.boxEmptyHint')}
            action={
              <>
                <ButtonLink href={catalogHref} variant="primary" size="md" icon="grid">
                  {t('samples.goToCatalog')}
                </ButtonLink>
                <Button variant="outline" size="md" icon="invoice" onClick={goToForm}>
                  {t('nav.quote')}
                </Button>
              </>
            }
          />

          {/* Tayyor to'plamlar — tanlashni osonlashtiradi */}
          {quickSets.length ? (
            <div>
              <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-warm-500">
                {t('samples.popularPick')}
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {quickSets.map((s) => (
                  <div key={s.id} className="flex flex-col rounded-2xl border border-cream-200 bg-white p-4 shadow-soft">
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-[14px] font-bold text-pine-900">{s.label}</p>
                        <p className="mt-1 text-[12.5px] leading-snug text-slate-warm-600">{s.hint}</p>
                      </div>
                      <Badge tone="cream" size="xs">{s.items.length}</Badge>
                    </div>
                    <ul className="mt-2.5 flex flex-wrap gap-1">
                      {s.items.slice(0, 6).map((i) => (
                        <li key={i.sku}>
                          <Link
                            href={`${productHrefBase}/${i.slug}`}
                            className="inline-block rounded bg-cream-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-warm-700 transition hover:bg-mint-100 hover:text-teal-600"
                          >
                            {i.name[locale] || i.name.en || i.sku}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={justAddedSet === s.id ? 'secondary' : 'outline'}
                      size="sm"
                      icon={justAddedSet === s.id ? 'check' : 'plus'}
                      className="mt-3.5"
                      onClick={() => applySet(s.id)}
                    >
                      {justAddedSet === s.id ? t('card.addedToBox') : t('samples.addPopular')}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.map((item, idx) => (
            <li
              key={item.sku}
              className="animate-fade-up rounded-2xl border border-cream-200 bg-white p-3.5 shadow-soft transition hover:border-teal-500/30"
              style={{ animationDelay: `${Math.min(idx * 40, 240)}ms` }}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cream-100 font-mono text-[12px] font-bold text-slate-warm-600">
                  {idx + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`${productHrefBase}/${item.slug}`}
                    className="font-display text-[14.5px] leading-snug font-bold text-pine-900 transition hover:text-teal-600"
                  >
                    <span className="line-clamp-2">{(item.name[locale] || item.name.en || item.sku) as string}</span>
                  </Link>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px] text-slate-warm-500">
                    <span>{item.sku}</span>
                    {item.slug ? (
                      <Link href={`${productHrefBase}/${item.slug}`} className="text-teal-600 hover:underline">
                        {t('card.details')}
                      </Link>
                    ) : null}
                  </p>
                </div>

                <IconButton
                  icon="trash"
                  label={`${t('samples.remove')}: ${item.name[locale] || item.name.en || item.sku}`}
                  size="sm"
                  tone="danger"
                  onClick={() => {
                    remove(item.sku);
                    toast.info(t('samples.remove'), item.sku);
                  }}
                />
              </div>

              {/* Miqdor */}
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-cream-200 pt-3">
                <span className="text-[12px] font-semibold text-slate-warm-600">{t('samples.qtyLabel')}</span>
                <div className="flex items-center gap-1">
                  <IconButton
                    icon="minus"
                    label="−"
                    size="sm"
                    onClick={() => setQty(item.sku, Math.max(1, item.qty - (item.qty > 100 ? 50 : 10)))}
                  />
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={5000}
                      step={item.qty >= 100 ? 50 : 5}
                      value={item.qty}
                      onChange={(e) => setQty(item.sku, Number(e.target.value))}
                      aria-label={`${t('samples.qtyLabel')} — ${item.sku}`}
                      className="h-8 w-[4.5rem] rounded-lg border border-cream-300 bg-white pr-7 text-center font-mono text-[13px] font-bold text-pine-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                    <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-warm-500">
                      {item.unit}
                    </span>
                  </div>
                  <IconButton
                    icon="plus"
                    label="+"
                    size="sm"
                    onClick={() => setQty(item.sku, item.qty + (item.qty >= 100 ? 50 : 10))}
                  />
                </div>

                <div className="flex flex-wrap gap-1">
                  {QTY_PRESETS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQty(item.sku, q)}
                      className={cn(
                        'rounded-full border px-2 py-0.5 font-mono text-[11px] font-semibold transition',
                        item.qty === q
                          ? 'border-teal-600 bg-teal-600 text-white'
                          : 'border-cream-300 text-slate-warm-600 hover:border-teal-500/50 hover:text-teal-600',
                      )}
                    >
                      {q}
                      {item.unit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Izoh */}
              <div className="mt-2.5">
                <label htmlFor={`note-${item.sku}`} className="text-[12px] font-semibold text-slate-warm-600">
                  {t('samples.noteLabel')}
                </label>
                <textarea
                  id={`note-${item.sku}`}
                  rows={2}
                  maxLength={300}
                  value={item.note ?? ''}
                  placeholder={t('samples.notePlaceholder')}
                  onChange={(e) => setNote(item.sku, e.target.value)}
                  className="mt-1 w-full resize-y rounded-lg border border-cream-300 bg-white px-3 py-2 text-[13px] text-ink placeholder:text-slate-warm-500/70 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ---- Yetkazib berish ma'lumoti ---- */}
      <div className="rounded-2xl border border-teal-500/25 bg-mint-50 p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white" aria-hidden>
            <Icon name="truck" size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-bold text-pine-900">
              {t('samples.deliveryFree')} · {t('samples.deliveryTime').replace('{days}', String(siteConfig.business.sampleDeliveryDays))}
            </p>
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {[t('samples.inside1'), t('samples.inside2'), t('samples.inside3'), t('samples.inside4')].map((x, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12.5px] leading-snug text-slate-warm-700">
                  <Icon name="check" size={13} strokeWidth={2.6} className="mt-0.5 shrink-0 text-teal-600" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {count > 0 ? (
        <div className="flex flex-wrap gap-2">
          <ButtonLink href={catalogHref} variant="outline" size="md" icon="plus" className="flex-1">
            {t('samples.continueBrowsing')}
          </ButtonLink>
          <Button variant="primary" size="lg" icon="send" onClick={goToForm} className="flex-[1.4]">
            {t('samples.submit')}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default SampleBoxEditor;
