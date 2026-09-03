/**
 * TIL LAYOUT'I — haqiqiy <html>/<body> shu yerda
 * ----------------------------------------------------------------
 * Bu UMUMIY layout: til, shriftlar, provider'lar va global JSON-LD.
 *
 * Sayt "qobig'i" (Header, Footer, mobil CTA paneli, cookie roziligi)
 * `(site)/layout.tsx` da, admin panel qobig'i esa `(admin)/admin/layout.tsx`
 * da. Shunday qilib admin sahifalari marketing elementlarisiz ochiladi —
 * bu ham toza, ham xavfsiz (panelda ortiqcha havolalar yo'q).
 *
 * Provider'lar bu yerda, chunki ular ikkala guruhga ham kerak:
 * I18nProvider (tarjima), ToastProvider (bildirishnomalar),
 * SampleBoxProvider (test box holati).
 */

// Global stillar (Tailwind v4 + @font-face + dizayn tokenlari).
// ILDIZ layout pass-through bo'lgani uchun CSS shu yerda ulanadi —
// haqiqiy <html>/<body> ham shu faylda.
import '../globals.css';

import type { Metadata, Viewport } from 'next';
import { getDictionary, LOCALES, LOCALE_META, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata, localBusinessLd, organizationLd, websiteLd } from '@/lib/seo';
import { totalProducts } from '@/lib/nav';

import { Analytics } from '@/components/layout/Analytics';
import { SampleBoxProvider } from '@/components/sample/SampleBoxProvider';
import { I18nProvider } from '@/components/i18n/I18nProvider';
import { ToastProvider } from '@/components/ui/Overlay';
import { JsonLdGroup } from '@/components/seo/JsonLd';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const base = buildMetadata({
    locale,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    path: '',
  });
  return {
    ...base,
    title: {
      default: siteConfig.seo.defaultTitle,
      template: '%s — GFF Uzbekistan',
    },
    applicationName: siteConfig.name,
    category: 'B2B, oziq-ovqat ingredientlari, aromatizatorlar',
    formatDetection: { telephone: true, address: false, email: false },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfbf7' },
    { media: '(prefers-color-scheme: dark)', color: '#03201c' },
  ],
  colorScheme: 'light',
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const t = makeT(locale);
  const dict = getDictionary(locale);
  const meta = LOCALE_META[locale];
  const products = totalProducts();

  const address =
    locale === 'ru' ? siteConfig.contact.addressRu : locale === 'en' ? siteConfig.contact.addressEn : siteConfig.contact.address;

  return (
    <html lang={meta.htmlLang} dir={meta.dir} suppressHydrationWarning>
      <head>
        {/* Shriftlarni oldindan yuklash — LCP ni yaxshilaydi */}
        <link rel="preload" href="/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/unbounded-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {locale === 'ru' ? (
          <>
            <link rel="preload" href="/fonts/manrope-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
            <link rel="preload" href="/fonts/unbounded-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          </>
        ) : null}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" type="image/png" href="/images/apple-touch-icon.png" sizes="180x180" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="yandex-verification" content={process.env.YANDEX_VERIFICATION ?? ''} />
      </head>

      <body className="min-h-dvh bg-cream-50 font-sans text-ink antialiased">
        {/* Klaviatura foydalanuvchilari uchun o'tkazib yuborish havolasi */}
        <a href="#main" className="skip-link">
          {t('common.skipToContent')}
        </a>

        <I18nProvider locale={locale} dict={dict}>
          <SampleBoxProvider>
            <ToastProvider>{children}</ToastProvider>
          </SampleBoxProvider>
        </I18nProvider>

        <Analytics />

        {/* Strukturali ma'lumot — har sahifada mavjud */}
        <JsonLdGroup items={[organizationLd(locale), localBusinessLd(), websiteLd(locale)]} />

        {/* Manzil matni qidiruv tizimlari uchun (footer'da ham bor) */}
        <span className="sr-only">
          {siteConfig.brand.full} — {t('brand.role')} — {address} — {siteConfig.contact.phonePrimary} — {products}+
        </span>
      </body>
    </html>
  );
}
