'use client';

/**
 * ANALITIKA — GTM konteyneri (§12)
 * ----------------------------------------------------------------
 * · `NEXT_PUBLIC_GTM_ID` bo'lsa → Google Tag Manager yuklanadi
 *   (GA4 va Meta Pixel GTM ichida ulanadi; sayt kodida ular yo'q)
 * · Konteyner FAQAT cookie roziligidan keyin ishga tushadi
 * · `window.dataLayer` rozilikdan oldin ham push qiladi — GTM ulangan
 *   zahoti to'planib qolgan hodisalarni oladi
 * · `consent` hodisasi GTM'ga yuboriladi ( Consent Mode )
 */

import { useEffect } from 'react';
import Script from 'next/script';
import { CONSENT_KEY, getConsent } from './CookieConsent';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    google_tag_manager?: Record<string, unknown>;
  }
}

export function Analytics({ gtmId, siteUrl }: { gtmId: string; siteUrl: string }) {
  /* dataLayer har doim tayyor — GTM yuklanmasa ham hodisalar yo'qolmaydi */
  useEffect(() => {
    window.dataLayer = window.dataLayer ?? [];

    const consent = getConsent();
    const grant = consent === 'all';

    window.dataLayer.push({
      event: 'consent',
      analytics_storage: grant ? 'granted' : 'denied',
      ad_storage: grant ? 'granted' : 'denied',
      site_url: siteUrl,
    });

    const onConsent = (e: Event) => {
      const value = (e as CustomEvent<{ value: string }>).detail?.value;
      const ok = value === 'all';
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({
        event: 'consent_update',
        analytics_storage: ok ? 'granted' : 'denied',
        ad_storage: ok ? 'granted' : 'denied',
      });
      if (ok) loadGtm();
    };

    window.addEventListener('gff:consent', onConsent);
    if (grant) loadGtm();

    return () => window.removeEventListener('gff:consent', onConsent);
  }, [gtmId, siteUrl]);

  const loadGtm = () => {
    if (!gtmId || typeof document === 'undefined') return;
    if (document.getElementById('gff-gtm')) return;
    const s = document.createElement('script');
    s.id = 'gff-gtm';
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
    document.head.appendChild(s);
  };

  if (!gtmId) return null;

  return (
    /* Roziliksiz yuklanmaydigan zaxira: gtmId bo'lsa-yu, consent 'all' bo'lsa */
    <Script id="gff-gtm-bootstrap" strategy="afterInteractive">
      {`
        (function () {
          try {
            if (localStorage.getItem('${CONSENT_KEY}') !== 'all') return;
            window.dataLayer = window.dataLayer || [];
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            if(document.getElementById('gff-gtm'))return; j.id='gff-gtm';
            f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');
          } catch (e) {}
        })();
      `}
    </Script>
  );
}

/** GTM `<noscript>` ramkasi — konteyner yuklangan bo'lsa */
export function AnalyticsNoScript({ gtmId }: { gtmId: string }) {
  if (!gtmId) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="GTM"
      />
    </noscript>
  );
}
