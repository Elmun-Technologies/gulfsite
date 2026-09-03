'use client';

/**
 * CLOUDFLARE TURNSTILE — ixtiyoriy bot tekshiruvi
 * ----------------------------------------------------------------
 * Faqat NEXT_PUBLIC_TURNSTILE_SITE_KEY sozlangan bo'lsa ishlaydi.
 * Sozlanmagan bo'lsa — komponent hech narsa ko'rsatmaydi va
 * token bo'sh qaytadi (forma ishlayveradi).
 *
 * Skript yuklanmasa (tarmoq yo'q) — forma baribir yuboriladi:
 * server tomonida Turnstile o'chirilgan bo'lsa tekshiruv o'tkazilmaydi,
 * yoqilgan bo'lsa — server rad etadi va foydalanuvchi xabar ko'radi.
 * Hech qachon mijozni yo'qotmaymiz.
 */

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: Record<string, unknown>,
      ) => string;
      remove: (id: string) => void;
      reset: (id?: string) => void;
      getResponse: (id?: string) => string | undefined;
    };
  }
}

const SCRIPT_ID = 'cf-turnstile-script';
const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.turnstile) return resolve(true);

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(Boolean(window.turnstile)), { once: true });
      existing.addEventListener('error', () => resolve(false), { once: true });
      // Ba'zan load hodisasi oldinroq sodir bo'lgan bo'ladi
      setTimeout(() => resolve(Boolean(window.turnstile)), 2500);
      return;
    }

    const s = document.createElement('script');
    s.id = SCRIPT_ID;
    s.src = SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve(Boolean(window.turnstile));
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
    // Zaxira: skript yuklangan, lekin hodisa yo'qolgan bo'lishi mumkin
    setTimeout(() => resolve(Boolean(window.turnstile)), 8000);
  });
}

interface Props {
  siteKey: string;
  /** Token olganda (bo'sh = tekshiruv yo'q yoki muvaffaqiyatsiz) */
  onToken: (token: string) => void;
  action?: string;
  className?: string;
  lang?: string;
}

export function Turnstile({ siteKey, onToken, action = 'lead_form', className, lang = 'auto' }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!siteKey) {
      onToken('');
      return;
    }
    let cancelled = false;

    loadScript().then((ok) => {
      if (cancelled) return;
      if (!ok || !window.turnstile || !host.current) {
        setFailed(true);
        return;
      }
      try {
        widgetId.current = window.turnstile.render(host.current, {
          sitekey: siteKey,
          action,
          appearance: 'interaction-only',
          theme: 'light',
          language: lang,
          callback: (token: string) => {
            setReady(true);
            onToken(typeof token === 'string' ? token : '');
          },
          'expired-callback': () => {
            setReady(false);
            onToken('');
          },
          'error-callback': () => {
            setFailed(true);
            onToken('');
          },
        });
      } catch {
        setFailed(true);
      }
    });

    return () => {
      cancelled = true;
      try {
        if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      } catch {
        /* ignore */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey, action, lang]);

  if (!siteKey) return null;

  return (
    <div className={className}>
      <div ref={host} className="flex min-h-[65px] items-center justify-center" />
      {ready ? (
        <p className="mt-1 text-[11.5px] text-teal-600">✓ verified</p>
      ) : failed ? (
        <p className="mt-1 text-[11.5px] text-slate-warm-500">
          {lang === 'ru'
            ? 'Проверка недоступна — заявку всё равно можно отправить.'
            : lang === 'en'
              ? 'Verification unavailable — you can still submit the request.'
              : 'Tekshiruv mavjud emas — baribir yuborishingiz mumkin.'}
        </p>
      ) : null}
    </div>
  );
}

export default Turnstile;
