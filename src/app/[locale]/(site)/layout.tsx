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
 * Sticky CTA BU YERDA YO'Q: dizayn (§9) uni faqat katalog va mahsulot
 * sahifalarida, faqat <768px da talab qiladi. Suzuvchi WhatsApp/Telegram
 * tugmalari esa mijoz talabi bilan (2026-10-17) barcha sahifalarda.
 */

import type { ReactNode } from 'react';
import { getDictionary, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { buildNav } from '@/lib/nav';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieConsent';
import { MessengerFab } from '@/components/layout/MessengerFab';
import { SiteTracker } from '@/components/layout/SiteTracker';
import { contactPeople } from '@/lib/content';
import { ensureCatalog } from '@/lib/catalog-live';

/**
 * ISR: kontakt/logotip/video admin paneldan o'zgaradi. Saqlashda
 * `revalidatePath` darhol yangilaydi; bu oraliq esa zaxira (masalan
 * deploy'dan keyin build vaqtidagi standart kontent qolib ketmasligi uchun).
 */
export const revalidate = 600;

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function SiteLayout({ children, params }: Props) {
  await ensureCatalog();
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const t = makeT(locale);
  const nav = buildNav(locale, t);
  const dict = getDictionary(locale);
  // suzuvchi WhatsApp/Telegram — birinchi sotuv menejeri
  const fab = (await contactPeople()).managers[0] ?? null;

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
        openLabel={t('header.openMenu')}
        closeLabel={t('header.closeMenu')}
        boxAriaTemplate={dict['header.boxAria']}
      />

      <main id="main" className="flex-1 pb-16 tab:pb-0">
        {children}
      </main>

      <Footer locale={locale} t={t} />

      <SiteTracker />

      {fab ? (
        <MessengerFab
          phone={fab.phone}
          whatsapp={fab.whatsapp}
          telegram={fab.telegram}
          labels={{
            whatsapp: t('contact.writeWhatsapp'),
            telegram: t('contact.writeTelegram'),
            waGreeting: t('contact.waGreeting'),
            group: t('contact.messengers'),
          }}
        />
      ) : null}

      <CookieBanner
        locale={locale}
        title={t('cookie.title')}
        body={t('cookie.body')}
        accept={t('cookie.accept')}
        decline={t('cookie.decline')}
        moreLabel={t('cookie.more')}
        privacyHref={`/${locale}/privacy`}
      />

    </div>
  );
}
