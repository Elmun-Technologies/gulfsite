'use client';

/**
 * XATO CHEGARASI (§14.2, §10.1 — matn lug'atda)
 * ----------------------------------------------------------------
 * Sahifada kutilmagan xato bo'lsa foydalanuvchi oq ekranni ko'rmaydi:
 * xabar · "qayta urinish" · muqobil aloqa kanallari (lead yo'qolmasin).
 *
 * Til: `not-found.tsx` kabi `error.tsx` ga ham `params` KELMAYDI,
 * shuning uchun lug'at `useI18n()` (layout provider'i) dan olinadi,
 * zaxira — `usePathname()` ning birinchi segmenti.
 *
 * Dizayn: yangi tizim (§4) — panel blok, mis aksent, `.btn` klasslari.
 * Xato tafsiloti (digest) faqat brauzer konsoliga yoziladi.
 */

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Phone, RotateCw } from 'lucide-react';
import { useI18n } from '@/components/i18n/I18nProvider';
import { normalizeLocale } from '@/i18n/meta';
import { siteConfig } from '@/lib/config';
import { track } from '@/lib/analytics';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const i18n = useI18n();
  const pathname = usePathname() ?? '/uz';
  const fromPath = normalizeLocale(pathname.split('/')[1] ?? 'uz');
  const locale = (i18n.dict && Object.keys(i18n.dict).length ? i18n.locale : fromPath) as typeof fromPath;
  const t = i18n.t;

  useEffect(() => {
    console.error('[page-error]', error?.message, error?.digest);
  }, [error]);

  return (
    <section className="container-page flex flex-wrap gap-3 py-3">
      <div
        data-surface="navy"
        className="media-frame relative flex min-h-[280px] min-w-0 flex-1 basis-[320px] items-center justify-center overflow-hidden rounded-block bg-navy px-10 py-14"
      >
        <span
          aria-hidden
          className="font-display text-[clamp(72px,10vw,160px)] font-light leading-none tracking-[-0.05em] text-[#2A2850]"
        >
          !
        </span>
      </div>

      <div className="flex min-w-0 flex-[1.4_1_480px] flex-col justify-center gap-6 rounded-block bg-panel p-[clamp(28px,4vw,56px)]">
        <h1 className="m-0 text-[clamp(28px,3.6vw,52px)] font-normal leading-[1.05] tracking-[-0.03em]">
          {t('error.title')}
        </h1>

        <p className="m-0 max-w-[560px] text-body-l leading-relaxed text-body">{t('error.text')}</p>

        {error?.digest ? (
          <p className="m-0 font-mono text-[12px] text-muted">
            {t('error.support')}: {error.digest}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => {
              track.cta('error_retry', pathname);
              reset();
            }}
            className="btn btn--accent btn--lg"
          >
            <RotateCw size={18} aria-hidden />
            {t('error.reset')}
          </button>

          <a
            href={siteConfig.contact.phonePrimaryHref}
            onClick={() => track.phoneClick('error', siteConfig.contact.phonePrimary)}
            className="btn btn--primary btn--lg"
          >
            <Phone size={18} aria-hidden />
            {siteConfig.contact.phonePrimary}
          </a>

          <Link href={`/${locale}`} className="btn btn--outline btn--lg">
            {t('nf.home')}
            <ArrowUpRight size={18} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
