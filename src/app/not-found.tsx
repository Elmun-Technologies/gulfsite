/**
 * ILDIZ 404 (§5, design/NotFound.dc.html · §13)
 * ----------------------------------------------------------------
 * NEGA BU FAYL KERAK
 * ------------------
 * Barcha sahifalar `app/[locale]/…` ostida, `app/layout.tsx` esa
 * pass-through (haqiqiy <html>/<body> `[locale]/layout.tsx` da — `lang`
 * ni til bo'yicha to'g'ri qo'yish uchun).
 *
 * `app/[locale]/not-found.tsx` faqat sahifa ichidan `notFound()`
 * chaqirilganda ishlaydi. Ammo katalog/mahsulot/soha segmentlarida
 * `dynamicParams = false` + `generateStaticParams` ishlatilgan: noma'lum
 * slug uchun Next ROUTER darajasida 404 qaytaradi va hech qanday
 * `[locale]` layout'iga tushmaydi. Natijada foydalanuvchi Next'ning oq
 * "This page could not be found" ekranini ko'rardi — yo'qotilgan lead.
 *
 * Shuning uchun bu fayl TO'LIQ sayt qobig'ini (provider'lar + Header +
 * Footer + cookie banner) o'zi bilan olib keladi va standart til `uz`
 * bo'yicha render qiladi (§10 — O'zbekcha default).
 */

import type { Metadata } from 'next';
import { getDictionary, makeT, type AppLocale } from '@/i18n';
import { buildNav } from '@/lib/nav';
import { NotFoundContent, notFoundLabels } from '@/components/layout/NotFoundContent';
import { I18nProvider } from '@/components/i18n/I18nProvider';
import { SampleBoxProvider } from '@/components/sample/SampleBoxProvider';
import { ToastProvider } from '@/components/ui/Overlay';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieConsent';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: '404',
  robots: { index: false, follow: true },
};

const LOCALE: AppLocale = 'uz';

export default function RootNotFound() {
  const t = makeT(LOCALE);
  const dict = getDictionary(LOCALE);

  return (
    <html lang="uz" dir="ltr" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute('data-motion-ready','')`,
          }}
        />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/urbanist-latin.woff2" crossOrigin="anonymous" />
      </head>

      <body className="bg-white text-ink antialiased">
        <I18nProvider locale={LOCALE} dict={dict}>
          <SampleBoxProvider>
            <ToastProvider>
              <div className="flex min-h-dvh flex-col">
                <a href="#main" className="skip-link">
                  {t('common.skipToContent')}
                </a>

                <Header
                  locale={LOCALE}
                  nav={buildNav(LOCALE, t)}
                  samplesHref={`/${LOCALE}/samples`}
                  ctaLabel={t('nav.samples')}
                  freeLabel={t('header.freeSample')}
                  openLabel={t('header.openMenu')}
                  closeLabel={t('header.closeMenu')}
                  boxAriaTemplate={dict['header.boxAria']}
                />

                <main id="main" className="flex-1">
                  <NotFoundContent locale={LOCALE} labels={notFoundLabels(t)} />
                </main>

                <Footer locale={LOCALE} t={t} />

                <CookieBanner
                  locale={LOCALE}
                  title={t('cookie.title')}
                  body={t('cookie.body')}
                  accept={t('cookie.accept')}
                  decline={t('cookie.decline')}
                  moreLabel={t('cookie.more')}
                  privacyHref={`/${LOCALE}/privacy`}
                />
              </div>
            </ToastProvider>
          </SampleBoxProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
