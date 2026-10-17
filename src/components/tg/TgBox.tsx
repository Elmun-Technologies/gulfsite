'use client';

/** MINI APP — NAMUNA QUTISI: tanlanganlar, hajm, o'chirish va rasmiylashtirish formasi */

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import type { SampleItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { TgLeadForm } from './TgLeadForm';

const SIZES = [25, 50, 100] as const;

export function TgBox({
  locale,
  regions,
  days,
}: {
  locale: string;
  regions: { id: string; label: string }[];
  days: number;
}) {
  const { t } = useI18n();
  const box = useSampleBox();
  // yuborilgandan keyin quti tozalanadi — ro'yxat formaga avval saqlab olinadi
  const [sentItems, setSentItems] = useState<SampleItem[] | null>(null);
  const items = sentItems ?? box.items;
  const L = (locale === 'ru' || locale === 'en' ? locale : 'uz') as 'uz' | 'ru' | 'en';

  return (
    <div className="flex flex-col gap-5 px-4 pb-8 pt-5">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="m-0 text-[26px] font-normal tracking-[-0.02em]">{t('samples.boxTitle')}</h1>
          <p className="m-0 mt-1 text-[14px] text-muted">{t('tg.boxHint', { days })}</p>
        </div>
        <span className="text-[15px] tabular-nums text-muted">
          {items.length} / {box.max}
        </span>
      </header>

      {!items.length ? (
        <div className="flex flex-col items-center gap-4 rounded-card bg-panel px-6 py-10 text-center">
          <p className="m-0 text-[15px] text-body">{t('samples.boxEmpty')}</p>
          <Link href={`/${locale}/tg`} className="btn btn--primary btn--md">
            {t('samples.addFromCatalog')}
          </Link>
        </div>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {items.map((it) => (
            <li key={it.sku} className="flex flex-col gap-3 rounded-[20px] bg-panel p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="flex flex-col">
                  <span className="text-[15px] font-medium">{it.name[L] || it.name.uz || it.sku}</span>
                  <span className="text-[12.5px] text-muted">{it.sku}</span>
                </span>
                {!sentItems ? (
                  <button
                    type="button"
                    onClick={() => box.remove(it.sku)}
                    aria-label={t('samples.removeItem', { name: it.name[L] || it.sku })}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border border-line bg-white"
                  >
                    <X size={16} aria-hidden />
                  </button>
                ) : null}
              </div>
              {!sentItems ? (
                <div className="flex gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => box.setQty(it.sku, s)}
                      className={cn(
                        'h-10 flex-1 rounded-pill border text-[14px]',
                        it.qty === s ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink',
                      )}
                    >
                      {s} g
                    </button>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {items.length ? (
        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-[20px] font-normal">{t('tg.formTitle')}</h2>
          <TgLeadForm
            locale={locale}
            mode="sample"
            products={items}
            regions={regions}
            onSent={() => {
              setSentItems(box.items);
              box.clear();
            }}
          />
        </section>
      ) : null}
    </div>
  );
}
