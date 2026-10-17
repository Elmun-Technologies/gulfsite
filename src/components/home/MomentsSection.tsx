/**
 * "…BU LAZZAT / BAXT / MUVAFFAQIYAT / ZAVQ" — katalog shiorlari bilan foto mozaika
 * ----------------------------------------------------------------
 * Fotolar mijoz katalogidagi dizaynerlik stok rasmlari (public/images/stock).
 * Har plitka tegishli bo'limga olib boradi. Matn rasm USTIDA emas, alohida
 * oq "caption" plitkasida (o'qiladigan kontrast, gradient/soya yo'q — §17).
 */

import Image from 'next/image';
import Link from 'next/link';
import type { AppLocale, Translator } from '@/i18n';
import { Reveal, RevealGroup } from '@/components/motion';
import { Section, SectionHeader, SectionInset } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';

export function MomentsSection({ locale, t }: { locale: AppLocale; t: Translator }) {
  const tiles = [
    { key: 'baxt', src: '/images/stock/perfume-hands.webp', href: `/${locale}/catalog?categories=fragrances`, cls: 'tab:col-span-2 tab:row-span-2', sizes: '(max-width: 768px) 100vw, 50vw' },
    { key: 'lazzat', src: '/images/stock/macarons.webp', href: `/${locale}/industries/confectionery`, cls: 'tab:row-span-2', sizes: '(max-width: 768px) 50vw, 25vw' },
    { key: 'muvaffaqiyat', src: '/images/stock/popsicles.webp', href: `/${locale}/industries/icecream`, cls: '', sizes: '(max-width: 768px) 50vw, 25vw' },
    { key: 'zavq', src: '/images/stock/smoothie.webp', href: `/${locale}/industries/beverages`, cls: '', sizes: '(max-width: 768px) 50vw, 25vw' },
  ] as const;

  return (
    <Section id="lazzat">
      <SectionInset>
        <SectionHeader title={t('moments.title')} />
        <p className="m-0 max-w-[560px] pb-8 text-body-l text-muted">{t('moments.text')}</p>
      </SectionInset>
      <RevealGroup className="grid grid-cols-2 gap-3 tab:h-[clamp(480px,46vw,660px)] tab:grid-cols-4 tab:grid-rows-2">
        {tiles.map((tile, i) => (
          <Reveal
            key={tile.key}
            index={i}
            className={cn('relative min-h-[220px] overflow-hidden rounded-media', i === 0 && 'col-span-2 aspect-[1.41] tab:aspect-auto', tile.cls)}
          >
            <Link href={tile.href} className="group absolute inset-0 block">
              <Image
                src={tile.src}
                alt={`${t('moments.pre')} ${t(`moments.${tile.key}` as never)}`}
                fill
                sizes={tile.sizes}
                className="media-zoom object-cover"
              />
              <span className="absolute bottom-3 left-3 flex flex-col rounded-caption bg-white px-4 py-2.5 leading-none text-ink">
                <span className="text-[15px]">{t('moments.pre')}</span>
                <span className="text-[clamp(20px,2vw,28px)] font-semibold tracking-[-0.01em]">
                  {t(`moments.${tile.key}` as never)}
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
      </RevealGroup>
    </Section>
  );
}
