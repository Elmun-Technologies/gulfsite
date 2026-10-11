'use client';

/**
 * COOKIE ROZILIGI (§12)
 * ----------------------------------------------------------------
 * · Minimal banner: "Kerakli cookie" + "Analitika" + "Qabul qilish"
 * · Rozilik `localStorage` (gff_cookie_consent) va cookie'da saqlanadi
 * · GTM konteyneri FAQAT rozilikdan keyin yuklanadi
 * · Roziliksiz sayt ishlashda davom etadi (faqat zaruriy cookie)
 */

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { dur, ease } from '@/lib/motion';

export const CONSENT_KEY = 'gff_cookie_consent';

export type ConsentValue = 'all' | 'necessary' | null;

function read(): ConsentValue {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === 'all' || v === 'necessary' ? v : null;
  } catch {
    return null;
  }
}

export function getConsent(): ConsentValue {
  return read();
}

export function setConsent(value: Exclude<ConsentValue, null>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
    document.cookie = `${CONSENT_KEY}=${value};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    window.dispatchEvent(new CustomEvent('gff:consent', { detail: { value } }));
  } catch {
    /* localStorage bloklangan bo'lishi mumkin — sayt ishlashda davom etadi */
  }
}

export function CookieBanner({
  locale,
  title,
  body,
  accept,
  decline,
  moreLabel,
  privacyHref,
}: {
  locale: string;
  title: string;
  body: string;
  accept: string;
  decline: string;
  moreLabel: string;
  privacyHref: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (read() === null) setOpen(true);
  }, []);

  const choose = useCallback((v: 'all' | 'necessary') => {
    setConsent(v);
    setOpen(false);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="cookie"
          role="region"
          aria-label={title}
          className="fixed inset-x-4 bottom-4 z-[110] flex flex-wrap items-center gap-4 rounded-card bg-navy p-6 text-white max-tab:inset-x-3 max-tab:bottom-3 max-tab:flex-col max-tab:items-stretch"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: dur.base, ease: ease.out }}
        >
          <div className="flex min-w-0 flex-1 basis-[280px] flex-col gap-1.5">
            <span className="text-[15px] font-semibold">{title}</span>
            <p className="m-0 text-[14px] leading-[1.5] text-on-navy">
              {body}{' '}
              <Link href={privacyHref} className="text-copper-light underline underline-offset-2">
                {moreLabel}
              </Link>
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button type="button" onClick={() => choose('necessary')} className="btn btn--on-navy btn--sm">
              {decline}
            </button>
            <button type="button" onClick={() => choose('all')} className="btn btn--accent btn--sm">
              {accept}
            </button>
          </div>
          <span className="sr-only" lang={locale}>
            {title}
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
