/**
 * ANALITIKA SKRIPTLARI
 * ----------------------------------------------------------------
 * Faqat sozlangan bo'lsa yuklanadi (NEXT_PUBLIC_GA4_ID / METRIKA).
 * `afterInteractive` — LCP'ni sekinlashtirmaydi.
 * Cookie roziligi bo'lmasa ham skript yuklanadi, lekin shaxsiy
 * ma'lumot yuborilmaydi (faqat anonim hodisalar).
 */

import Script from 'next/script';
import { siteConfig } from '@/lib/config';

export function Analytics() {
  const ga = siteConfig.analytics.ga4Id;
  const ym = siteConfig.analytics.yandexMetrikaId;
  if (!ga && !ym) return null;

  return (
    <>
      {ga ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="gff-ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true,transport_type:'beacon'});`}
          </Script>
        </>
      ) : null}

      {ym ? (
        <Script id="gff-metrika" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${ym},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false,triggerEvent:true});`}
        </Script>
      ) : null}
    </>
  );
}

export default Analytics;
