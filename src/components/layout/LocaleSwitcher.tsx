'use client';

/**
 * TIL ALMASHTIRGICH
 * ----------------------------------------------------------------
 * Joriy yo'ldagi til prefiksini saqlab qolgan holda boshqa tilga o'tadi.
 * Tanlov cookie'ga yoziladi → keyingi tashrifda avtomatik qo'llanadi (proxy.ts).
 */

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LOCALES, LOCALE_META, type AppLocale } from '@/i18n';
import { useI18n } from '@/components/i18n/I18nProvider';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { Icon } from '@/components/ui/Icon';

function swapLocale(pathname: string, next: AppLocale): string {
  const segs = pathname.split('/').filter(Boolean);
  if (segs.length && (LOCALES as readonly string[]).includes(segs[0])) segs[0] = next;
  else segs.unshift(next);
  return `/${segs.join('/')}`;
}

export function LocaleSwitcher({
  variant = 'dark',
  className,
}: {
  variant?: 'dark' | 'light';
  className?: string;
}) {
  const { locale, t } = useI18n();
  const label = t('common.selectLanguage');
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (next: AppLocale) => {
    setOpen(false);
    if (next === locale) return;
    track.localeChange(locale, next);
    // Cookie — proxy keyingi safar avtomatik shu tilda ochadi
    try {
      // Bu render qiymati emas, DOM'ga yozish (event handler ichida) — xavfsiz.
      // eslint-disable-next-line react-hooks/immutability
      document.cookie = `gff_locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    } catch {
      /* ignore */
    }
    router.push(swapLocale(pathname ?? '/', next));
    router.refresh();
  };

  const current = LOCALE_META[locale];

  return (
    <div ref={box} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        title={label}
        className={cn(
          'inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[12.5px] font-semibold transition',
          variant === 'dark'
            ? 'text-white/80 hover:bg-white/10 hover:text-white'
            : 'text-pine-700 hover:bg-cream-100',
          open && (variant === 'dark' ? 'bg-white/12 text-white' : 'bg-cream-100'),
        )}
      >
        <Icon name="globe" size={14} />
        <span className="font-mono tracking-wide">{current.shortLabel}</span>
        <Icon name="chevron-down" size={12} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={label}
          className={cn(
            'animate-in-down absolute right-0 top-full z-50 mt-1.5 min-w-[10.5rem] overflow-hidden rounded-xl border p-1 shadow-float',
            variant === 'dark' ? 'border-white/12 bg-pine-900 text-white' : 'border-cream-200 bg-white',
          )}
        >
          {LOCALES.map((l) => {
            const meta = LOCALE_META[l];
            const active = l === locale;
            return (
              <button
                key={l}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => go(l)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition',
                  variant === 'dark'
                    ? active
                      ? 'bg-white/12 font-bold text-white'
                      : 'text-white/75 hover:bg-white/8 hover:text-white'
                    : active
                      ? 'bg-mint-100 font-bold text-teal-600'
                      : 'text-slate-warm-700 hover:bg-cream-100',
                )}
              >
                <span aria-hidden className="text-base leading-none">
                  {meta.flag}
                </span>
                <span className="flex-1">{meta.nativeName}</span>
                <span className={cn('font-mono text-[11px]', variant === 'dark' ? 'text-white/50' : 'text-slate-warm-500')}>
                  {meta.shortLabel}
                </span>
                {active ? <Icon name="check" size={13} strokeWidth={2.6} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default LocaleSwitcher;
