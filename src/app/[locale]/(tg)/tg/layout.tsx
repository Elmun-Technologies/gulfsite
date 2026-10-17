/**
 * TELEGRAM MINI APP QOBIG'I — /[locale]/tg
 * ----------------------------------------------------------------
 * Bot "Do'konni ochish" tugmasi shu yerni Telegram ichida ochadi.
 * Sayt Header/Footer/cookie banneri YO'Q (Telegram o'z interfeysini
 * beradi); pastda — Katalog · Quti · Aloqa. Qidiruv tizimlari uchun
 * yopiq (noindex) — kanonik sahifalar asosiy saytda.
 */

import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import { makeT, normalizeLocale } from '@/i18n';
import { SiteTracker } from '@/components/layout/SiteTracker';
import { TgProvider } from '@/components/tg/TgProvider';
import { TgTabs } from '@/components/tg/TgTabs';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = makeT(normalizeLocale(locale));
  return { title: { absolute: t('tg.metaTitle') }, robots: { index: false, follow: false } };
}

export default async function TgLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);

  return (
    <TgProvider homeHref={`/${locale}/tg`}>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" />
      <div className="mx-auto flex min-h-dvh max-w-[640px] flex-col bg-white">
        <main className="flex-1 pb-[calc(72px+env(safe-area-inset-bottom))]">{children}</main>
        <TgTabs locale={locale} />
      </div>
      <SiteTracker />
    </TgProvider>
  );
}
