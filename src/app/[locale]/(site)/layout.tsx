/**
 * SAYT QOBIG'I — (site) route guruhi layout'i
 * ----------------------------------------------------------------
 * Umumiy `[locale]/layout.tsx` faqat <html>/<body> va provider'larni
 * beradi. Marketing qobig'i — Header, Footer, mobil CTA paneli,
 * suzuvchi aloqa tugmalari va cookie roziligi — SHU YERDA.
 *
 * Nega ajratilgan: admin panel sahifalari `(admin)` guruhida va bu
 * elementlarsiz ochiladi. Natijada panel toza, tez va ortiqcha
 * havolalarsiz ishlaydi.
 */

import { makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { buildMega, buildNav, popularGroupsFor, totalProducts } from '@/lib/nav';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileActionBar, ContactFab, CookieBanner } from '@/components/layout/StickyCta';
import { ScrollProgress } from '@/components/ui/Overlay';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function SiteLayout({ children, params }: Props) {
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const t = makeT(locale);

  const nav = buildNav(locale, t);
  const mega = buildMega(locale);
  const popularGroups = popularGroupsFor(locale, 10);
  const products = totalProducts();

  return (
    <div className="flex min-h-dvh flex-col pb-[3.75rem] md:pb-0">
      <ScrollProgress />

      <Header nav={nav} mega={mega} productCount={products} />

      <main id="main" className="flex-1">
        {children}
      </main>

      <Footer locale={locale} t={t} popularGroups={popularGroups} />

      <MobileActionBar />
      <ContactFab />
      <CookieBanner />
    </div>
  );
}
