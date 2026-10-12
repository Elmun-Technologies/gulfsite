'use client';

/**
 * TIL SWITCH — UZ · RU · EN segmented (§5)
 * ----------------------------------------------------------------
 * · Faol fon `layoutId="lang"` bilan suriladi (320ms, ease.out) (§8.3)
 * · Joriy sahifaning O'SHA tildagi versiyasiga olib boradi (§10)
 * · `lang_switch` analytics hodisasi (§12)
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { LOCALES, LOCALE_META, normalizeLocale, type AppLocale } from '@/i18n/meta';
import { dur, ease } from '@/lib/motion';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/** `/uz/catalog?q=1` → `/ru/catalog?q=1` */
export function localizePath(pathname: string, from: AppLocale, to: AppLocale, search = ''): string {
  // 404 sahifasida `usePathname()` Next'ning ICHKI yo'lini qaytaradi
  // (`/uz/_not-found`) — bu haqiqiy URL emas, shuning uchun til almashtirish
  // o'lik havola yasardi (`/ru/_not-found` → 404). Bunday holatda o'sha
  // tilning bosh sahifasiga o'tamiz (§10.8: til almashtirish sahifada qoladi,
  // lekin sahifa mavjud bo'lmasa — bosh sahifa eng to'g'ri zaxira).
  const clean = pathname.replace(/\/_not-found\/?$/, '') || `/${from}`;
  const prefix = `/${from}`;
  const rest = clean.startsWith(prefix) ? clean.slice(prefix.length) : clean;
  return `/${to}${rest === '' ? '' : rest}${search}`;
}

export function LocaleSwitcher({
  locale: localeProp,
  search,
  variant = 'header',
  className,
}: {
  /** berilmasa — joriy yo'ldan aniqlanadi (admin panel uchun qulay) */
  locale?: AppLocale;
  /** `useSearchParams()` qiymati — server komponentdan uzatiladi */
  search?: string;
  variant?: 'header' | 'menu';
  className?: string;
}) {
  const pathname = usePathname();
  const locale = localeProp ?? normalizeLocale(pathname.split('/')[1]);

  return (
    <div
      role="group"
      aria-label={variant === 'menu' ? undefined : 'Til'}
      className={cn(
        'flex shrink-0',
        variant === 'header' ? 'gap-0 rounded-pill border border-line-warm p-[3px]' : 'gap-2 pt-5',
        className,
      )}
    >
      {LOCALES.map((l) => {
        const active = l === locale;
        const href = localizePath(pathname, locale, l, search ?? '');
        const meta = LOCALE_META[l];

        return (
          <Link
            key={l}
            href={href}
            lang={meta.htmlLang}
            hrefLang={meta.lang}
            aria-current={active ? 'true' : undefined}
            onClick={() => {
              if (!active) track.localeChange(locale, l);
            }}
            className={cn(
              'relative inline-flex items-center justify-center rounded-pill font-semibold transition-colors',
              variant === 'header'
                ? 'h-[38px] min-w-11 px-2.5 text-[14px]'
                : 'h-12 flex-1 border text-[15px]',
              variant === 'menu' && !active && 'border-on-navy-line text-white',
              variant === 'menu' && active && 'border-transparent',
              variant === 'header' && !active && 'text-muted hover:text-ink',
            )}
          >
            {active ? (
              <motion.span
                layoutId={`lang-${variant}`}
                className={cn(
                  'absolute inset-0 -z-10 rounded-pill',
                  variant === 'header' ? 'bg-ink' : 'bg-white',
                )}
                transition={{ duration: dur.base, ease: ease.out }}
              />
            ) : null}
            <span className={cn('relative', variant === 'header' && active && 'text-white', variant === 'menu' && active && 'text-ink')}>
              {meta.shortLabel}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
