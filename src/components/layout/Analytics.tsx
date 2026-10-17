'use client';

/**
 * TASHQI ANALITIKA VA REKLAMA PIKSELLARI (§12)
 * ----------------------------------------------------------------
 * Identifikatorlar admin → Integratsiyalar'dan (zaxira: NEXT_PUBLIC_* env):
 *   · Google Tag Manager, Google Analytics 4 (gtag.js)
 *   · Yandex Metrika (webvisor, clickmap)
 *   · Meta (Facebook) Pixel, TikTok Pixel
 * Hammasi FAQAT cookie roziligidan keyin ("Qabul qilish") yuklanadi;
 * `window.dataLayer` esa rozilikdan oldin ham to'ladi (Consent Mode) —
 * GTM ulangan zahoti yig'ilgan hodisalarni oladi. Admin panelda yuklanmaydi.
 */

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getConsent } from './CookieConsent';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    google_tag_manager?: Record<string, unknown>;
    gtag?: (...args: unknown[]) => void;
    ym?: YmFn;
    fbq?: FbqFn;
    _fbq?: unknown;
    ttq?: { page: () => void; load: (id: string) => void; [k: string]: unknown };
    TiktokAnalyticsObject?: string;
  }
}

type YmFn = ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };
type FbqFn = ((...args: unknown[]) => void) & {
  queue?: unknown[][];
  loaded?: boolean;
  version?: string;
  callMethod?: (...a: unknown[]) => void;
  push?: unknown;
};

export interface AnalyticsIds {
  gtm: string;
  ga4: string;
  metrika: string;
  metaPixel: string;
  tiktok: string;
}

function addScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.id = id;
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

/** Barcha vositalarni yuklash (bir marta) */
function loadAll(ids: AnalyticsIds) {
  const w = window;
  w.dataLayer = w.dataLayer ?? [];

  if (ids.gtm && !document.getElementById('gff-gtm')) {
    // GTM'ning standart start hodisasi — usiz "All Pages" trigger'lari rozilik bosilgan sahifada ishlamaydi
    w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    addScript('gff-gtm', `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(ids.gtm)}`);
  }

  if (ids.ga4 && !w.gtag) {
    w.gtag = function gtag() {
      // gtag rasmiy shakli: `arguments` obyekti dataLayer'ga (massiv emas — gtag.js shuni kutadi)
      w.dataLayer!.push(arguments as unknown as Record<string, unknown>);
    };
    w.gtag('js', new Date());
    w.gtag('config', ids.ga4, { anonymize_ip: true });
    addScript('gff-ga4', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids.ga4)}`);
  }

  if (ids.metrika && !w.ym) {
    const ym: YmFn = (...args: unknown[]) => {
      (ym.a = ym.a || []).push(args);
    };
    ym.l = Date.now();
    w.ym = ym;
    addScript('gff-metrika', 'https://mc.yandex.ru/metrika/tag.js');
    w.ym(Number(ids.metrika), 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
      defer: true,
    });
  }

  if (ids.metaPixel && !w.fbq) {
    const fbq: FbqFn = (...args: unknown[]) => {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue!.push(args);
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    w.fbq = fbq;
    w._fbq = fbq;
    addScript('gff-fbq', 'https://connect.facebook.net/en_US/fbevents.js');
    w.fbq('init', ids.metaPixel);
  }

  if (ids.tiktok && !w.ttq && /^[A-Z0-9]+$/.test(ids.tiktok)) {
    // TikTok rasmiy yuklovchisi (ID faqat [A-Z0-9] — sanitizeIntegrations tekshirgan)
    const s = document.createElement('script');
    s.id = 'gff-ttq';
    s.textContent = `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=d.createElement("script");o.async=!0,o.src=r+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load("${ids.tiktok}");ttq.page()}(window,document,"ttq");`;
    document.head.appendChild(s);
  }
}

/** Klient navigatsiyasida sahifa ko'rishini yuborish (GTM o'zi kuzatadi) */
function trackPage(ids: AnalyticsIds, url: string) {
  const w = window;
  if (ids.ga4 && w.gtag) w.gtag('event', 'page_view', { page_location: url });
  if (ids.metrika && w.ym) w.ym(Number(ids.metrika), 'hit', url);
  if (ids.metaPixel && w.fbq) w.fbq('track', 'PageView');
  if (ids.tiktok && w.ttq) w.ttq.page();
}

export function Analytics({ ids, siteUrl }: { ids: AnalyticsIds; siteUrl: string }) {
  const pathname = usePathname() ?? '';
  const isAdmin = /^\/[a-z]{2}\/admin(\/|$)/.test(pathname);
  const loaded = useRef(false);
  const any = Boolean(ids.gtm || ids.ga4 || ids.metrika || ids.metaPixel || ids.tiktok);

  /* dataLayer + rozilik — har doim; vositalar faqat roziligdan keyin */
  useEffect(() => {
    window.dataLayer = window.dataLayer ?? [];
    const grant = getConsent() === 'all';
    window.dataLayer.push({
      event: 'consent',
      analytics_storage: grant ? 'granted' : 'denied',
      ad_storage: grant ? 'granted' : 'denied',
      site_url: siteUrl,
    });
    if (isAdmin || !any) return;

    const start = () => {
      if (loaded.current) return;
      loaded.current = true;
      loadAll(ids);
    };
    const onConsent = (e: Event) => {
      const ok = (e as CustomEvent<{ value: string }>).detail?.value === 'all';
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({
        event: 'consent_update',
        analytics_storage: ok ? 'granted' : 'denied',
        ad_storage: ok ? 'granted' : 'denied',
      });
      if (ok) start();
    };
    window.addEventListener('gff:consent', onConsent);
    if (grant) start();
    return () => window.removeEventListener('gff:consent', onConsent);
  }, [ids, siteUrl, isAdmin, any]);

  /* SPA navigatsiya — birinchi sahifani skriptlar o'zi yozadi */
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (loaded.current) trackPage(ids, window.location.href);
  }, [pathname, ids]);

  return null;
}
