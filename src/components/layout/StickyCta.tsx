'use client';

/**
 * STICKY CTA — konversiya uchun eng muhim komponentlar
 * ----------------------------------------------------------------
 * 1) MobileActionBar — mobilda pastda doim yopishib turadigan panel:
 *    Qo'ng'iroq · Telegram · Test box (hisoblagich bilan) · Narx
 * 2) ContactFab — desktopda o'ng pastdagi suzuvchi tugmalar
 * 3) ScrollTop — yuqoriga qaytish
 *
 * B2B saytda telefon eng tez konversiya kanali, shuning uchun u
 * har doim bir teginish masofasida bo'lishi kerak.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/lib/config';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { Icon } from '@/components/ui/Icon';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import { useI18n } from '@/components/i18n/I18nProvider';

/* ============================================================
   MOBIL PASTKI PANEL
   ============================================================ */

export function MobileActionBar() {
  const { locale, t } = useI18n();
  const { count } = useSampleBox();

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-cream-200 bg-white/96 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_24px_-12px_rgba(7,17,15,0.25)] backdrop-blur-md md:hidden">
      <div className="grid grid-cols-4">
        <a
          href={siteConfig.contact.phonePrimaryHref}
          onClick={() => track.callClick('sticky_bar')}
          className="flex flex-col items-center gap-0.5 py-2 text-pine-800 transition active:bg-cream-100"
        >
          <Icon name="phone" size={19} />
          <span className="text-[10.5px] font-bold">{t('nav.call')}</span>
        </a>

        <Link
          href={`/${locale}/quote`}
          onClick={() => track.cta('sticky_quote', 'sticky_bar')}
          className="flex flex-col items-center gap-0.5 py-2 text-pine-800 transition active:bg-cream-100"
        >
          <Icon name="invoice" size={19} />
          <span className="text-[10.5px] font-bold">{t('nav.quote')}</span>
        </Link>

        <Link
          href={`/${locale}/catalog`}
          onClick={() => track.cta('sticky_catalog', 'sticky_bar')}
          className="flex flex-col items-center gap-0.5 py-2 text-pine-800 transition active:bg-cream-100"
        >
          <Icon name="search" size={19} />
          <span className="text-[10.5px] font-bold">{t('nav.catalog')}</span>
        </Link>

        <Link
          href={`/${locale}/samples`}
          onClick={() => track.cta('sticky_sample', 'sticky_bar')}
          className="relative flex flex-col items-center gap-0.5 bg-teal-600 py-2 text-white transition active:bg-pine-800"
        >
          <Icon name="box" size={19} />
          <span className="text-[10.5px] font-bold">{t('nav.getSample')}</span>
          {count > 0 ? (
            <span className="absolute right-[18%] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 font-mono text-[10px] font-extrabold text-pine-950 ring-2 ring-teal-600">
              {count}
            </span>
          ) : null}
        </Link>
      </div>
    </div>
  );
}

/* ============================================================
   SUZUVCHI ALOQA TUGMALARI (desktop)
   ============================================================ */

export function ContactFab() {
  const { locale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const { count } = useSampleBox();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const whatsapp = `https://wa.me/${siteConfig.contact.phoneSecondary.replace(/\D/g, '')}`;
  const telegram = siteConfig.social.telegram;

  const links = [
    telegram
      ? { href: telegram, icon: 'telegram' as const, label: 'Telegram', tone: 'bg-[#229ED9] text-white', external: true }
      : null,
    { href: whatsapp, icon: 'whatsapp' as const, label: 'WhatsApp', tone: 'bg-[#25D366] text-white', external: true },
    {
      href: siteConfig.contact.phonePrimaryHref,
      icon: 'phone' as const,
      label: t('nav.call'),
      tone: 'bg-pine-800 text-white',
      external: false,
    },
    {
      href: `mailto:${siteConfig.contact.salesEmail}`,
      icon: 'mail' as const,
      label: siteConfig.contact.salesEmail,
      tone: 'bg-cream-100 text-pine-800',
      external: false,
    },
  ].filter(Boolean) as { href: string; icon: 'telegram' | 'whatsapp' | 'phone' | 'mail'; label: string; tone: string; external: boolean }[];

  return (
    <div className="pointer-events-none fixed right-4 z-[65] flex flex-col items-end gap-2.5 max-md:bottom-[4.5rem] md:bottom-6">
      {/* Yuqoriga */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Yuqoriga"
        className={cn(
          'pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-cream-300 bg-white/90 text-pine-700 shadow-soft backdrop-blur transition',
          'hover:bg-white hover:text-teal-600',
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
        )}
      >
        <Icon name="chevron-up" size={17} strokeWidth={2.2} />
      </button>

      {/* Test box tugmasi — tanlov bor bo'lsa */}
      {count > 0 ? (
        <Link
          href={`/${locale}/samples`}
          onClick={() => track.cta('fab_box', 'fab')}
          className="animate-in-up pointer-events-auto flex h-12 items-center gap-2 rounded-full bg-gold-500 pr-4 pl-3.5 font-bold text-pine-950 shadow-float transition hover:bg-gold-400 active:scale-95 max-md:hidden"
        >
          <Icon name="box" size={19} />
          <span className="text-[13px]">{t('nav.getSample')}</span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-pine-950/85 px-1 font-mono text-[11px] text-gold-400">
            {count}
          </span>
        </Link>
      ) : null}

      {/* Ochiladigan ro'yxat */}
      {open ? (
        <div className="animate-in-up pointer-events-auto flex flex-col items-end gap-2">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track.messengerClick(l.label, 'fab')}
                className="group flex items-center gap-2"
              >
                <span className="rounded-full bg-pine-950/85 px-2.5 py-1 text-[12px] font-semibold text-white opacity-0 shadow-soft transition group-hover:opacity-100">
                  {l.label}
                </span>
                <span className={cn('flex h-11 w-11 items-center justify-center rounded-full shadow-lift transition hover:scale-105', l.tone)}>
                  <Icon name={l.icon} size={20} />
                </span>
              </a>
            ) : (
              <a
                key={l.label}
                href={l.href}
                onClick={() => (l.icon === 'phone' ? track.callClick('fab') : track.cta(`fab_${l.icon}`, 'fab'))}
                className="group flex items-center gap-2"
              >
                <span className="rounded-full bg-pine-950/85 px-2.5 py-1 text-[12px] font-semibold text-white opacity-0 shadow-soft transition group-hover:opacity-100">
                  {l.label}
                </span>
                <span className={cn('flex h-11 w-11 items-center justify-center rounded-full shadow-lift transition hover:scale-105', l.tone)}>
                  <Icon name={l.icon} size={20} />
                </span>
              </a>
            ),
          )}
        </div>
      ) : null}

      {/* Asosiy tugma */}
      <button
        type="button"
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) track.cta('fab_open', 'fab');
        }}
        aria-expanded={open}
        aria-label={t('widget.openChat')}
        title={t('widget.openChat')}
        className={cn(
          'pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-float transition hover:scale-105 active:scale-95',
          open ? 'bg-pine-800' : 'bg-teal-600',
        )}
      >
        {!open ? <span className="animate-pulse-ring absolute inset-0 rounded-full" aria-hidden /> : null}
        <Icon name={open ? 'close' : 'telegram'} size={24} className="relative" strokeWidth={open ? 2.2 : 1.6} />
      </button>
    </div>
  );
}

/* ============================================================
   COOKIE BANNER — O'zbekiston qonunchiligi talabi
   ============================================================ */

const COOKIE_KEY = 'gff_cookie_consent';

export function CookieBanner() {
  const { locale, t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(COOKIE_KEY)) {
        const timer = setTimeout(() => setVisible(true), 900);
        return () => clearTimeout(timer);
      }
    } catch {
      /* localStorage bloklangan */
    }
  }, []);

  if (!visible) return null;

  const decide = (choice: 'accepted' | 'declined') => {
    try {
      window.localStorage.setItem(COOKIE_KEY, JSON.stringify({ choice, at: new Date().toISOString() }));
      document.cookie = `gff_consent=${choice}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    } catch {
      /* ignore */
    }
    trackEventSafe(choice);
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie"
      className="animate-in-up fixed inset-x-3 bottom-3 z-[85] md:inset-x-auto md:bottom-5 md:left-5 md:max-w-md"
    >
      <div className="overflow-hidden rounded-2xl border border-cream-200 bg-white/97 shadow-float backdrop-blur">
        <div className="flex items-start gap-3 p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mint-100 text-teal-600" aria-hidden>
            <Icon name="info" size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-bold text-pine-900">{t('cookie.text')}</p>
            <p className="mt-1 text-[12px] leading-snug text-slate-warm-600">
              {t('cookie.more')}{' '}
              <Link href={`/${locale}/privacy`} className="font-semibold text-teal-600 underline decoration-teal-500/40 underline-offset-2 hover:decoration-teal-600">
                {t('footer.privacy')}
              </Link>
            </p>
          </div>
        </div>
        <div className="flex gap-2 border-t border-cream-200 bg-cream-50/70 px-4 py-3">
          <button
            type="button"
            onClick={() => decide('declined')}
            className="h-9 flex-1 rounded-lg border border-cream-300 bg-white text-[13px] font-semibold text-slate-warm-700 transition hover:border-clay-400 hover:text-clay-600"
          >
            {t('cookie.decline')}
          </button>
          <button
            type="button"
            onClick={() => decide('accepted')}
            className="h-9 flex-[1.3] rounded-lg bg-teal-600 text-[13px] font-bold text-white transition hover:bg-pine-800 active:scale-[0.98]"
          >
            {t('cookie.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}

function trackEventSafe(choice: string) {
  try {
    track.cta(`cookie_${choice}`, 'cookie_banner');
  } catch {
    /* ignore */
  }
}
