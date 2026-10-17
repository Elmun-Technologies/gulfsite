'use client';

/**
 * TELEGRAM MINI APP KONTEKSTI
 * ----------------------------------------------------------------
 * `telegram-web-app.js` (layout'da) `window.Telegram.WebApp` ni beradi.
 * Bu yerda: ready()/expand(), sarlavha ranglari, foydalanuvchi, initData
 * (serverda imzosi tekshiriladi), orqaga tugmasi va tebranish (haptic).
 * Oddiy brauzerda ochilsa ham sahifa ishlaydi (initData bo'sh).
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface TgWebApp {
  initData: string;
  initDataUnsafe?: { user?: { id: number; first_name?: string; last_name?: string; username?: string; language_code?: string } };
  version?: string;
  platform?: string;
  ready: () => void;
  expand: () => void;
  setHeaderColor?: (c: string) => void;
  setBackgroundColor?: (c: string) => void;
  setBottomBarColor?: (c: string) => void;
  BackButton?: { show: () => void; hide: () => void; onClick: (cb: () => void) => void; offClick: (cb: () => void) => void };
  HapticFeedback?: {
    impactOccurred: (s: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (s: 'error' | 'success' | 'warning') => void;
  };
  requestContact?: (cb: (ok: boolean, res?: { responseUnsafe?: { contact?: { phone_number?: string } } }) => void) => void;
  openLink?: (url: string) => void;
  close?: () => void;
  isVersionAtLeast?: (v: string) => boolean;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp };
  }
}

interface TgCtx {
  inTelegram: boolean;
  initData: string;
  user: { firstName: string; lastName: string; username: string } | null;
  haptic: (kind?: 'light' | 'success' | 'error') => void;
  requestPhone: () => Promise<string | null>;
  openLink: (url: string) => void;
}

const Ctx = createContext<TgCtx | null>(null);

function getWebApp(): TgWebApp | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window.Telegram?.WebApp;
  return w && w.initData ? w : undefined;
}

/* SDK skripti kech yuklanadi — paydo bo'lishini kutamiz (tashqi tizim) */
function subscribe(cb: () => void) {
  if (getWebApp()) return () => {};
  const id = window.setInterval(() => {
    if (getWebApp()) {
      window.clearInterval(id);
      cb();
    }
  }, 120);
  const stop = window.setTimeout(() => window.clearInterval(id), 6000);
  return () => {
    window.clearInterval(id);
    window.clearTimeout(stop);
  };
}

export function TgProvider({ children, homeHref }: { children: ReactNode; homeHref: string }) {
  const webApp = useSyncExternalStore(subscribe, getWebApp, () => undefined);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!webApp) return;
    webApp.ready();
    webApp.expand();
    try {
      webApp.setHeaderColor?.('#0B0A3A');
      webApp.setBackgroundColor?.('#FFFFFF');
      webApp.setBottomBarColor?.('#FFFFFF');
    } catch {
      /* eski Telegram versiyalari */
    }
  }, [webApp]);

  // Telegram'ning "Orqaga" tugmasi: bosh sahifadan boshqa joyda ko'rinadi
  useEffect(() => {
    const back = webApp?.BackButton;
    if (!back) return;
    const onBack = () => (window.history.length > 1 ? router.back() : router.push(homeHref));
    if (pathname === homeHref) back.hide();
    else back.show();
    back.onClick(onBack);
    return () => back.offClick(onBack);
  }, [webApp, pathname, homeHref, router]);

  const haptic = useCallback(
    (kind: 'light' | 'success' | 'error' = 'light') => {
      const h = webApp?.HapticFeedback;
      if (!h) return;
      if (kind === 'light') h.impactOccurred('light');
      else h.notificationOccurred(kind);
    },
    [webApp],
  );

  const requestPhone = useCallback(
    () =>
      new Promise<string | null>((resolve) => {
        if (!webApp?.requestContact) return resolve(null);
        webApp.requestContact((ok, res) => resolve(ok ? (res?.responseUnsafe?.contact?.phone_number ?? null) : null));
      }),
    [webApp],
  );

  const openLink = useCallback(
    (url: string) => {
      if (webApp?.openLink && /^https?:/.test(url)) webApp.openLink(url);
      else window.location.href = url;
    },
    [webApp],
  );

  const value = useMemo<TgCtx>(() => {
    const u = webApp?.initDataUnsafe?.user;
    return {
      inTelegram: Boolean(webApp),
      initData: webApp?.initData ?? '',
      user: u ? { firstName: u.first_name ?? '', lastName: u.last_name ?? '', username: u.username ?? '' } : null,
      haptic,
      requestPhone,
      openLink,
    };
  }, [webApp, haptic, requestPhone, openLink]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTg(): TgCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      inTelegram: false,
      initData: '',
      user: null,
      haptic: () => {},
      requestPhone: async () => null,
      openLink: (url) => {
        window.location.href = url;
      },
    };
  }
  return ctx;
}
