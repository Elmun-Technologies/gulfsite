'use client';

/**
 * MAHSULOT SAHIFASI AMALLARI
 * ----------------------------------------------------------------
 * - Test boxga qo'shish (asosiy konversiya tugmasi)
 * - Havoladan nusxa olish (B2B: hamkasbga yuborish)
 * - Bosma versiya (texnik spetsifikatsiyani chop etish)
 * - Narx so'rash / qo'ng'iroq
 */

import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/config';
import type { Trilingual } from '@/lib/taxonomy';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useToast } from '@/components/ui/Overlay';
import { track } from '@/lib/analytics';
import { Icon } from '@/components/ui/Icon';
import { Button, ButtonLink, IconButton } from '@/components/ui/Button';

interface Props {
  sku: string;
  slug: string;
  name: Trilingual;
  locale: string;
  form: string;
  className?: string;
}

/** So'rov formasiga yumshoq o'tish (forma shu sahifaning o'zida) */
function scrollToRequest() {
  const el = document.getElementById('product-request');
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => el.querySelector<HTMLInputElement>('input,textarea,select')?.focus({ preventScroll: true }), 500);
}

export function ProductActions({ sku, slug, name, locale, form, className }: Props) {
  const { t } = useI18n();
  const toast = useToast();
  const { add, has, count } = useSampleBox();
  const inBox = has(sku);
  // "Qo'shildi" holati to'g'ridan-to'g'ri savatdan olinadi (alohida state keraksiz)
  const added = inBox;

  const onAdd = () => {
    const res = add({
      sku,
      slug,
      name,
      unit: form === 'oil' || form === 'liquid' || form === 'emulsion' ? 'ml' : 'g',
    });
    if (res === 'added') {
      track.addToBox(sku);
      toast.success(t('card.addedToBox'), `${name[locale as 'uz'] || name.en} · ${count + 1}/${siteConfig.business.sampleBoxMaxItems}`);
    } else if (res === 'exists') {
      toast.info(t('card.addedToBox'));
    } else {
      toast.error(t('samples.boxFull'), t('samples.itemsMax', { max: siteConfig.business.sampleBoxMaxItems }));
      track.formError('product_add_box', undefined, 'box_full');
    }
  };

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = (name[locale as 'uz'] || name.en || sku) as string;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        track.cta('share_native', 'product');
        return;
      }
    } catch {
      /* foydalanuvchi bekor qildi */
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t('common.copied'), url);
      track.cta('share_copy', 'product');
    } catch {
      toast.info(t('common.copy'), url);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={added ? 'secondary' : 'primary'}
          size="lg"
          full
          icon={added ? 'check' : 'plus'}
          onClick={onAdd}
          className={added ? 'bg-mint-100 text-teal-600 hover:bg-mint-200' : undefined}
        >
          {added ? t('card.addedToBox') : t('card.addToBox')}
        </Button>
        <Button variant="gold" size="lg" full icon="invoice" onClick={() => { track.cta('product_quote', 'product'); scrollToRequest(); }}>
          {t('card.requestPrice')}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ButtonLink href={siteConfig.contact.phonePrimaryHref} variant="outline" size="md" full icon="phone">
          {t('nav.call')}
        </ButtonLink>
        <ButtonLink href={`/${locale}/samples?from=${encodeURIComponent(slug)}`} variant="outline" size="md" full icon="box">
          {t('samples.yourBox')}
          {count > 0 ? ` (${count})` : ''}
        </ButtonLink>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <IconButton icon="share" label={t('product.share')} size="sm" onClick={share} />
        <IconButton
          icon="printer"
          label={t('product.print')}
          size="sm"
          onClick={() => {
            track.cta('print', 'product');
            window.print();
          }}
        />
        <span className="ml-auto flex items-center gap-1.5 text-[11.5px] text-slate-warm-500">
          <Icon name="lock" size={12} className="text-teal-600" />
          {t('form.secureNote')}
        </span>
      </div>
    </div>
  );
}

export default ProductActions;
