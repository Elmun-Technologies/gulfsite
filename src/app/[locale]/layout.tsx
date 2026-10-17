/**
 * ILDIZ LAYOUT (barcha tillar)
 * ----------------------------------------------------------------
 * `src/app/layout.tsx` pass-through; haqiqiy <html> va <body> shu yerda.
 *
 * Nima qiladi:
 *   1. html lang / dir ni o'rnatadi
 *   2. shriftlarni OLDINDAN yuklaydi (preconnect + preload)
 *   3. `data-motion-ready` — reveal tizimini birinchi paint'dan OLDIN
 *      yoqadi (globals.css §4b izohini o'qing)
 *   4. I18nProvider (lug'at) → SampleBoxProvider → ToastProvider
 *   5. GTM analitika va JSON-LD
 */

import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';
import { getDictionary, LOCALES, LOCALE_META, normalizeLocale, type AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata } from '@/lib/seo';
import { I18nProvider } from '@/components/i18n/I18nProvider';
import { SampleBoxProvider } from '@/components/sample/SampleBoxProvider';
import { ToastProvider } from '@/components/ui/Overlay';
import { Analytics } from '@/components/layout/Analytics';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { organizationLd } from '@/lib/seo';
import { ensureCatalog } from '@/lib/catalog-live';
import { effectiveIntegrations, loadContent } from '@/lib/content';

/**
 * `dynamicParams` bu yerda ISHLATILMAYDI: Next.js segment konfiguratsiyasi
 * jadvaliga ko'ra bu opsiya FAQAT `page`/`route` uchun amal qiladi —
 * `layout` da eksport qilish build'ni "Invalid segment configuration
 * export" bilan to'xtatadi. Noma'lum til prefiksini ushlash vazifasi
 * `src/proxy.ts` da (u standart tilga yo'naltiradi) va sahifalardagi
 * `dynamicParams = false` da.
 */
export async function generateStaticParams() {
  await ensureCatalog();
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0B0A3A',
  colorScheme: 'light',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  await ensureCatalog();
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const integ = effectiveIntegrations((await loadContent()).integrations);

  return {
    ...buildMetadata({ locale, title: siteConfig.seo.defaultTitle, description: siteConfig.seo.defaultDescription, path: '' }),
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        // hreflang — faqat til kodi (uz/ru/en): 'ru-RU' Google'ga "Rossiya uchun" deydi,
        // bizning auditoriya esa O'zbekiston va Markaziy Osiyo
        ...Object.fromEntries(LOCALES.map((l) => [l, `${siteConfig.url}/${l}`])),
        'x-default': `${siteConfig.url}/uz`,
      },
    },
    // Search Console / Yandex / Bing / Facebook egalik tasdig'i — admin → Integratsiyalar (zaxira: env)
    verification: {
      ...(integ.googleVerification ? { google: integ.googleVerification } : {}),
      ...(integ.yandexVerification ? { yandex: integ.yandexVerification } : {}),
      other: {
        ...(integ.bingVerification ? { 'msvalidate.01': integ.bingVerification } : {}),
        ...(integ.facebookVerification ? { 'facebook-domain-verification': integ.facebookVerification } : {}),
      },
    },
    title: {
      default: siteConfig.seo.defaultTitle,
      template: '%s — GFF Uzbekistan',
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  await ensureCatalog();
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const dict = getDictionary(locale);
  const meta = LOCALE_META[locale];
  const integ = effectiveIntegrations((await loadContent()).integrations);

  return (
    <html lang={meta.htmlLang} dir={meta.dir} suppressHydrationWarning>
      <head>
        {/*
          data-motion-ready: <head> ichidagi INLINE (bloklash) skript.
          Birinchi paint'dan oldin ishlaydi, shuning uchun reveal
          elementlari "avval ko'rinib, keyin g'oyib bo'lish" (flash)
          holati yuz bermaydi. JS ishlamasa — atribut yo'q, kontent
          ko'rinadigan qoladi.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute('data-motion-ready','')`,
          }}
        />

        {/* Self-hosted shriftlar (public/fonts) — tashqi so'rov yo'q */}
        <link rel="preload" as="font" type="font/woff2" href="/fonts/urbanist-latin.woff2" crossOrigin="anonymous" />
        {locale === 'ru' ? (
          <link rel="preload" as="font" type="font/woff2" href="/fonts/onest-cyrillic.woff2" crossOrigin="anonymous" />
        ) : null}
      </head>

      <body className="bg-white text-ink antialiased">

        <I18nProvider locale={locale} dict={dict}>
          <SampleBoxProvider>
            <ToastProvider>
              {children}
              <Analytics
                siteUrl={siteConfig.url}
                ids={{
                  gtm: integ.gtmId,
                  ga4: integ.ga4Id,
                  metrika: integ.yandexMetrikaId,
                  metaPixel: integ.metaPixelId,
                  tiktok: integ.tiktokPixelId,
                }}
              />
              {/* admin → Integratsiyalar → qo'shimcha kod (boshqa xizmatlar); SSR HTML'da — skriptlar ishga tushadi */}
              {integ.customCode ? (
                <div hidden data-gff-custom-code dangerouslySetInnerHTML={{ __html: integ.customCode }} />
              ) : null}
              <JsonLdGroup items={[organizationLd(locale)]} />
            </ToastProvider>
          </SampleBoxProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
