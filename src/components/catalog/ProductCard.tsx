'use client';

/**
 * MAHSULOT KARTOCHKASI
 * ----------------------------------------------------------------
 * B2B mijoz uchun muhim ma'lumotlar bir qarashda:
 *   SKU · guruh · shakl · doza · qadoq · xususiyatlar (halol va h.k.)
 * Harakatlar: "Test boxga qo'shish" (asosiy) va "Batafsil".
 *
 * Grid va List rejimlarida bitta komponent ishlatiladi.
 */

import Link from 'next/link';
import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { formatDosage, formatKg } from '@/lib/utils';
import {
  ALL_GROUPS,
  APPLICATIONS,
  CATEGORIES,
  FEATURES,
  FORMS,
  tr,
  type Locale,
} from '@/lib/taxonomy';
import type { ProductCard as Card } from '@/lib/types';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import { useI18n } from '@/components/i18n/I18nProvider';
import { track } from '@/lib/analytics';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Display';

const FEATURE_ICONS: Record<string, IconName> = {
  halal: 'halal',
  'gmo-free': 'gmo',
  'alcohol-free': 'no-alcohol',
  'heat-stable': 'thermo',
  vegan: 'vegan',
  kosher: 'kosher',
  'eac-certified': 'eac',
  'iso-certified': 'iso',
};

interface Props {
  card: Card;
  locale: Locale;
  view?: 'grid' | 'list';
  hrefBase: string;
}

function ProductCardBase({ card, locale, view = 'grid', hrefBase }: Props) {
  const { t } = useI18n();
  const { add, has } = useSampleBox();
  const [justAdded, setJustAdded] = useState(false);

  const href = `${hrefBase}/${card.slug}`;
  const inBox = has(card.sku);
  const name = card.name[locale] || card.name.en || card.sku;
  const groupLabel = tr(ALL_GROUPS.find((g) => g.id === card.group)?.name, locale, card.group);
  const categoryLabel = tr(CATEGORIES.find((c) => c.id === card.category)?.name, locale, card.category);
  const formLabel = tr(FORMS.find((f) => f.id === card.form)?.name, locale, card.form);

  const apps = card.applications
    .slice(0, view === 'list' ? 6 : 3)
    .map((a) => tr(APPLICATIONS.find((x) => x.id === a)?.name, locale, a));

  const features = card.features.slice(0, view === 'list' ? 6 : 4);

  const onAdd = () => {
    const res = add({ sku: card.sku, slug: card.slug, name: card.name, unit: card.form === 'oil' || card.form === 'liquid' ? 'ml' : 'g' });
    if (res === 'added') {
      track.addToBox(card.sku);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1600);
    } else if (res === 'full') {
      track.formError('sample_box', undefined, 'box_full');
    }
  };

  const isList = view === 'list';

  return (
    <article
      className={cn(
        'group relative flex overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-soft transition duration-300',
        'hover:-translate-y-0.5 hover:border-teal-500/35 hover:shadow-lift',
        isList ? 'flex-row' : 'flex-col',
      )}
    >
      {/* Rangli chap/yuqori chiziq — kategoriya identifikatori */}
      <span
        className={cn('shrink-0 transition-all duration-300 group-hover:brightness-110', isList ? 'w-1.5' : 'h-1.5 w-full')}
        style={{ backgroundColor: card.color }}
        aria-hidden
      />

      <div className={cn('flex min-w-0 flex-1 flex-col', isList ? 'p-4 sm:flex-row sm:gap-4' : 'p-4')}>
        {/* ---- Yuqori qator ---- */}
        <div className={cn('flex items-start gap-2', isList && 'sm:w-64 sm:shrink-0 sm:flex-col')}>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded bg-cream-100 px-1.5 py-0.5 font-mono text-[10.5px] font-bold text-slate-warm-600">
                {card.sku}
              </span>
              {card.isNew ? <Badge tone="mint" size="xs">{t('card.new')}</Badge> : null}
              {card.isTop ? <Badge tone="gold" size="xs" icon="star">{t('card.top')}</Badge> : null}
            </div>

            <h3 className="mt-1.5">
              <Link
                href={href}
                className="font-display text-[15px] leading-snug font-bold tracking-tight text-pine-900 transition group-hover:text-teal-600"
              >
                <span className="line-clamp-2">{name}</span>
              </Link>
            </h3>

            <p className="mt-1 flex items-center gap-1.5 text-[11.5px] font-medium text-slate-warm-500">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: card.color }} aria-hidden />
              <span className="truncate">{groupLabel}</span>
            </p>
          </div>
        </div>

        {/* ---- O'rta: tafsilotlar ---- */}
        <div className={cn('min-w-0 flex-1', isList && 'sm:border-l sm:border-cream-200 sm:pl-4')}>
          {isList ? (
            <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-slate-warm-600 sm:mt-0">{card.blurb}</p>
          ) : null}

          <dl className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px]">
            <div className="flex items-center gap-1.5">
              <Icon name="drop" size={13} className="text-teal-600" />
              <dt className="sr-only">{t('card.dosage')}</dt>
              <dd className="font-semibold text-pine-800">{formatDosage(card.dosageMin, card.dosageMax)}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="flask" size={13} className="text-teal-600" />
              <dt className="sr-only">{t('card.form')}</dt>
              <dd className="font-medium text-slate-warm-700">{formLabel}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="package" size={13} className="text-teal-600" />
              <dt className="sr-only">{t('product.packaging')}</dt>
              <dd className="font-mono text-[11.5px] text-slate-warm-600">{card.packaging.map(formatKg).join(' · ')}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon
                name={card.availability === 'on-order' ? 'truck' : 'check'}
                size={13}
                className={card.availability === 'on-order' ? 'text-gold-600' : 'text-teal-600'}
              />
              <dd className="font-medium text-slate-warm-600">
                {card.availability === 'on-order' ? t('card.onOrder') : t('card.inStock')}
              </dd>
            </div>
          </dl>

          {/* Ilovalar */}
          {apps.length ? (
            <ul className="mt-2.5 flex flex-wrap gap-1">
              {apps.map((a) => (
                <li key={a} className="rounded border border-cream-200 bg-cream-50 px-1.5 py-0.5 text-[10.5px] font-medium text-slate-warm-600">
                  {a}
                </li>
              ))}
              {card.applications.length > apps.length ? (
                <li className="rounded bg-cream-50 px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-teal-600">
                  +{card.applications.length - apps.length}
                </li>
              ) : null}
            </ul>
          ) : null}

          {/* Xususiyatlar */}
          {features.length ? (
            <ul className="mt-2.5 flex flex-wrap gap-1">
              {features.map((f) => (
                <li key={f}>
                  <Badge tone="mint" size="xs" icon={FEATURE_ICONS[f] ?? 'badge'}>
                    {tr(FEATURES.find((x) => x.id === f)?.name, locale, f)}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* ---- Amallar ---- */}
        <div
          className={cn(
            'mt-3.5 flex items-center gap-2',
            isList && 'mt-0 sm:ml-auto sm:w-44 sm:shrink-0 sm:flex-col sm:items-stretch sm:justify-center',
          )}
        >
          <button
            type="button"
            onClick={onAdd}
            disabled={inBox}
            aria-pressed={inBox}
            className={cn(
              'inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg px-3 text-[12.5px] font-bold transition active:scale-[0.97]',
              inBox
                ? 'cursor-default bg-mint-100 text-teal-600'
                : justAdded
                  ? 'bg-teal-600 text-white'
                  : 'border border-teal-600/35 bg-white text-teal-600 hover:bg-teal-600 hover:text-white',
            )}
            title={inBox ? t('card.addedToBox') : t('card.addToBox')}
          >
            <Icon name={inBox || justAdded ? 'check' : 'plus'} size={14} strokeWidth={2.4} />
            <span className="truncate">{inBox || justAdded ? t('card.addedToBox') : t('card.addToBox')}</span>
          </button>

          <Link
            href={href}
            className={cn(
              'inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-[12.5px] font-semibold transition',
              isList ? 'bg-pine-800 text-white hover:bg-teal-600' : 'border border-cream-300 text-pine-800 hover:border-pine-800/40 hover:bg-cream-50',
            )}
          >
            {t('card.details')}
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      </div>

      {/* Kategoriya yorlig'i (faqat grid) */}
      {!isList ? (
        <span className="pointer-events-none absolute right-3 top-3 rounded bg-white/85 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-slate-warm-500 opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100">
          {categoryLabel}
        </span>
      ) : null}
    </article>
  );
}

/** Katta ro'yxatlarda qayta render'ni kamaytirish uchun memo */
export const ProductCard = memo(ProductCardBase);
export default ProductCard;
