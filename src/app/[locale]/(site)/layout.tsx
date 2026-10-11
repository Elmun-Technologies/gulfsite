/**
 * SAYT QOBIG'I — (site) route guruhi layout'i
 * ----------------------------------------------------------------
 * Umumiy `[locale]/layout.tsx` faqat <html>/<body> va provider'larni
 * beradi. Marketing qobig'i — Header, Footer va cookie roziligi — SHU YERDA.
 *
 * Nega ajratilgan: admin panel sahifalari `(admin)` guruhida va bu
 * elementlarsiz ochiladi. Natijada panel toza, tez va ortiqcha
 * havolalarsiz ishlaydi.
 *
 * Sticky CTA va "yuzuvchi" aloqa tugmalari BU YERDA YO'Q: dizayn (§9)
 * ularni faqat katalog va mahsulot sahifalarida, faqat <768px da talab
 * qiladi — shuning uchun ularni o'sha sahifalarning o'zi qo'shadi.
 */

import type { ReactNode } from 'react';
import { getDictionary, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { buildNav } from '@/lib/nav';
import { siteConfig } from '@/lib/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieConsent';

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function SiteLayout({ children, params }: Props) {
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const t = makeT(locale);
  const nav = buildNav(locale, t);
  const dict = getDictionary(locale);

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="skip-link">
        {t('common.skipToContent')}
      </a>

      <Header
        locale={locale}
        nav={nav}
        samplesHref={`/${locale}/samples`}
        ctaLabel={t('nav.samples')}
        freeLabel={t('header.freeSample')}
        logoAlt={t('header.logoAlt')}
        openLabel={t('header.openMenu')}
        closeLabel={t('header.closeMenu')}
        boxAriaTemplate={dict['header.boxAria']}
      />

      <main id="main" className="flex-1 pb-16 tab:pb-0">
        {children}
      </main>

      <Footer locale={locale} t={t} />

      <CookieBanner
        locale={locale}
        title={t('cookie.title')}
        body={t('cookie.body')}
        accept={t('cookie.accept')}
        decline={t('cookie.decline')}
        moreLabel={t('cookie.more')}
        privacyHref={`/${locale}/privacy`}
      />

      {/* Eski GA/Yandex identifikatorlari .env'da qolgan bo'lishi mumkin */}
      <span className="hidden" aria-hidden data-gtm={siteConfig.analytics.gtmId || undefined} />
    </div>
  );
}
