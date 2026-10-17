'use client';

/** MINI APP — MAHSULOT: rasm, nom, faktlar, namuna hajmi, qutiga / narx so'rash */

import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import type { Trilingual } from '@/lib/taxonomy';
import { cn } from '@/lib/utils';
import { useTg } from './TgProvider';

const SIZES = [25, 50, 100] as const;

export function TgProductView({
  locale,
  sku,
  slug,
  name,
  title,
  image,
  category,
  description,
  facts,
  applications,
}: {
  locale: string;
  sku: string;
  slug: string;
  name: Trilingual;
  title: string;
  image: string;
  category: string;
  description: string;
  facts: { label: string; value: string }[];
  applications: string[];
}) {
  const { t } = useI18n();
  const box = useSampleBox();
  const tg = useTg();
  const item = box.items.find((i) => i.sku === sku);
  const inBox = Boolean(item);

  function toggle() {
    if (inBox) {
      box.remove(sku);
      tg.haptic('light');
      return;
    }
    const r = box.add({ sku, slug, name });
    tg.haptic(r === 'full' ? 'error' : 'success');
  }

  return (
    <article className="flex flex-col gap-5 pb-28">
      <div className="relative aspect-square w-full overflow-hidden bg-panel">
        <Image src={image} alt={title} fill priority sizes="100vw" className="object-cover" unoptimized={image.includes('/api/media/')} />
      </div>

      <div className="flex flex-col gap-2 px-4">
        <span className="text-[13px] text-muted">
          {sku} · {category}
        </span>
        <h1 className="m-0 text-[26px] font-normal leading-tight tracking-[-0.02em]">{title}</h1>
        <p className="m-0 text-[15px] leading-relaxed text-body">{description}</p>
      </div>

      <dl className="mx-4 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-line-soft bg-line-soft">
        {facts.map((f) => (
          <div key={f.label} className="bg-white px-4 py-3">
            <dt className="text-[12px] uppercase tracking-[0.04em] text-muted">{f.label}</dt>
            <dd className="m-0 mt-1 text-[15px] font-medium">{f.value}</dd>
          </div>
        ))}
      </dl>

      {applications.length ? (
        <div className="flex flex-wrap gap-2 px-4">
          {applications.map((a) => (
            <span key={a} className="rounded-pill border border-line px-3 py-1.5 text-[13px] text-body">
              {a}
            </span>
          ))}
        </div>
      ) : null}

      {inBox ? (
        <div className="mx-4 flex flex-col gap-2">
          <span className="text-[14px] font-medium">{t('tg.sizeLabel')}</span>
          <div className="flex gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => box.setQty(sku, s)}
                className={cn(
                  'h-11 flex-1 rounded-pill border text-[15px]',
                  item?.qty === s ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink',
                )}
              >
                {s} g
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-30 flex gap-2 border-t border-line-soft bg-white px-4 py-3">
        <button
          type="button"
          onClick={toggle}
          className={cn('btn btn--lg flex-1', inBox ? 'btn--outline' : 'btn--primary')}
          aria-pressed={inBox}
        >
          {inBox ? `✓ ${t('tg.inBox')}` : `+ ${t('tg.add')}`}
        </button>
        <Link href={`/${locale}/tg/request?type=quote&product=${encodeURIComponent(sku)}`} className="btn btn--accent btn--lg flex-1">
          {t('tg.askPrice')}
        </Link>
      </div>
    </article>
  );
}
