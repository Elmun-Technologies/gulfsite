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
import { Analytics, AnalyticsNoScript } from '@/components/layout/Analytics';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { organizationLd } from '@/lib/seo';

/**
 * `dynamicParams` bu yerda ISHLATILMAYDI: Next.js segment konfiguratsiyasi
 * jadvaliga ko'ra bu opsiya FAQAT `page`/`route` uchun amal qiladi —
 * `layout` da eksport qilish build'ni "Invalid segment configuration
 * export" bilan to'xtatadi. Noma'lum til prefiksini ushlash vazifasi
 * `src/proxy.ts` da (u standart tilga yo'naltiradi) va sahifalardagi
 * `dynamicParams = false` da.
 */
export function generateStaticParams() {
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
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const meta = LOCALE_META[locale];

  return {
    ...buildMetadata({ locale, title: siteConfig.seo.defaultTitle, description: siteConfig.seo.defaultDescription, path: '' }),
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [LOCALE_META[l].lang, `${siteConfig.url}/${l}`])),
        'x-default': `${siteConfig.url}/uz`,
      },
    },
    other: { 'og:locale': meta.tag },
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
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const dict = getDictionary(locale);
  const meta = LOCALE_META[locale];
  const gtmId = siteConfig.analytics.gtmId;

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
        <AnalyticsNoScript gtmId={gtmId} />

        <I18nProvider locale={locale} dict={dict}>
          <SampleBoxProvider>
            <ToastProvider>
              {children}
              <Analytics gtmId={gtmId} siteUrl={siteConfig.url} />
              <JsonLdGroup items={[organizationLd(locale)]} />
            </ToastProvider>
          </SampleBoxProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
