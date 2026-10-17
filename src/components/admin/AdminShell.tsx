/**
 * ADMIN PANEL QOBIG'I
 * ----------------------------------------------------------------
 * Chap tomonda navigatsiya, yuqorida — joriy bo'lim va tezkor
 * amallar (eksport, saytga qaytish, chiqish). Mobilda navigatsiya
 * yuqoridagi tanlov (select) ko'rinishiga o'tadi — bu ichki panel
 * uchun eng tezkor va ishonchli yechim.
 *
 * Panel marketing qobig'isiz ishlaydi: `(admin)` route guruhi
 * sayt Header/Footer'ini o'z ichiga olmaydi.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useToast } from '@/components/ui/Overlay';
import { Icon, type IconName } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { adminCopy } from '@/lib/admin-copy';

interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  badge?: number;
  /** faqat aniq mos kelganda faol (masalan /analytics va /analytics/sessions) */
  exact?: boolean;
}

interface Props {
  locale: string;
  children: ReactNode;
  /** Ko'rib chiqilmagan (yangi) arizalar soni */
  unseen: number;
  storage: { driver: string; writable: boolean; months: number; sizeKb: number };
  channels: { telegram: boolean; email: boolean; webhook: boolean };
}

export function AdminShell({ locale, children, unseen, storage, channels }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname() ?? `/${locale}/admin`;
  const toast = useToast();
  const [loggingOut, setLoggingOut] = useState(false);

  const base = `/${locale}/admin`;
  const c = adminCopy(locale);
  const items: NavItem[] = [
    { href: base, label: t('admin.dashboard'), icon: 'target', badge: unseen },
    { href: `${base}/analytics`, label: c.nav.analytics, icon: 'chart', exact: true },
    { href: `${base}/analytics/sessions`, label: c.nav.sessions, icon: 'eye' },
    { href: `${base}/leads`, label: t('admin.leads'), icon: 'invoice' },
    { href: `${base}/products`, label: t('admin.products'), icon: 'grid' },
    { href: `${base}/samples`, label: c.nav.samples, icon: 'box' },
    { href: `${base}/clients`, label: c.nav.clients, icon: 'users' },
    { href: `${base}/content`, label: c.nav.content, icon: 'edit' },
    { href: `${base}/integrations`, label: locale === 'ru' ? 'Интеграции' : locale === 'en' ? 'Integrations' : 'Integratsiyalar', icon: 'link' },
    { href: `${base}/settings`, label: c.nav.settings, icon: 'settings' },
  ];

  const isActive = (href: string, exact?: boolean) =>
    href === base || exact ? pathname === href || pathname === `${href}/` : pathname.startsWith(href);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      toast.success(t('admin.logout'));
      router.replace(`${base}/login`);
      router.refresh();
    } catch {
      toast.error(t('common.error'));
      setLoggingOut(false);
    }
  }

  const groups: { title: string; items: NavItem[] }[] = [
    { title: locale === 'ru' ? 'Продажи' : locale === 'en' ? 'Sales' : 'Savdo', items: [items[0], items[3], items[5], items[6]] },
    { title: locale === 'ru' ? 'Аналитика' : locale === 'en' ? 'Analytics' : 'Analitika', items: [items[1], items[2]] },
    { title: locale === 'ru' ? 'Сайт и бот' : locale === 'en' ? 'Site & bot' : 'Sayt va bot', items: [items[4], items[7], items[8], items[9]] },
  ];
  const statusOk = storage.writable && channels.telegram;

  return (
    <div className="admin-ui flex min-h-dvh flex-col lg:flex-row">
      {/* ================= SIDEBAR ================= */}
      <aside className="flex shrink-0 flex-col border-b border-line bg-white lg:sticky lg:top-0 lg:h-dvh lg:w-[248px] lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 px-5 py-5">
          {/* GFF monogrammasi — brend belgisi */}
          <Image src="/images/monogram-copper.png" alt="" width={498} height={523} className="h-9 w-auto" priority />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[14px] font-semibold leading-tight text-ink">GFF Uzbekistan</span>
            <span className="truncate text-[12px] leading-tight text-muted">{t('admin.title')}</span>
          </span>
        </div>

        {/* mobil: gorizontal; desktop: guruhlangan ro'yxat */}
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 no-scrollbar lg:flex-1 lg:flex-col lg:gap-5 lg:overflow-y-auto lg:pb-4">
          {groups.map((g) => (
            <div key={g.title} className="flex gap-1 lg:flex-col">
              <p className="hidden px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted/80 lg:block">{g.title}</p>
              {g.items.map((it) => {
                const active = isActive(it.href, it.exact);
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={cn(
                      'group flex shrink-0 items-center gap-3 rounded-[10px] px-3 py-2 text-[14px] font-medium transition lg:w-full',
                      active ? 'bg-copper/10 text-copper-dark' : 'text-slate hover:bg-panel hover:text-ink',
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon name={it.icon} size={18} className={cn(active ? 'text-copper-dark' : 'text-muted group-hover:text-ink')} />
                    <span className="whitespace-nowrap">{it.label}</span>
                    {it.badge ? (
                      <span className="ml-auto rounded-full bg-copper px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white tabular-nums">
                        {it.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* tizim holati + chiqish — faqat desktopda */}
        <div className="hidden flex-col gap-1 border-t border-line px-3 py-3 lg:flex">
          <Link
            href={`${base}/settings`}
            className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13px] text-slate hover:bg-panel"
            title={`${storage.driver} · ${storage.sizeKb} KB · Telegram ${channels.telegram ? 'ON' : 'OFF'}`}
          >
            <span className={cn('h-2 w-2 rounded-full', statusOk ? 'bg-ok' : 'bg-error')} aria-hidden />
            {statusOk
              ? locale === 'ru' ? 'Система работает' : locale === 'en' ? 'All systems OK' : 'Tizim ishlayapti'
              : locale === 'ru' ? 'Проверьте настройки' : locale === 'en' ? 'Check settings' : 'Sozlamalarni tekshiring'}
          </Link>
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13px] text-slate hover:bg-panel"
          >
            <Icon name="arrow-up-right" size={16} className="text-muted" />
            {t('legal.backToSite')}
          </Link>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-left text-[13px] text-slate hover:bg-panel hover:text-error disabled:opacity-50"
          >
            <Icon name="logout" size={16} className="text-muted" />
            {loggingOut ? t('common.loading') : t('admin.logout')}
          </button>
        </div>
      </aside>

      {/* ================= KONTENT ================= */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-line bg-white/90 px-4 py-2.5 backdrop-blur lg:px-8">
          <LocaleSwitcher />
          <span className="flex-1" />
          {/* CSV eksport — bu API endpoint (sahifa emas), shuning uchun oddiy <a> */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/admin/leads/export?format=csv"
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-line bg-white px-3 text-[13px] font-medium text-slate transition hover:bg-panel"
          >
            <Icon name="download" size={15} />
            CSV
          </a>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-line bg-white px-3 text-[13px] font-medium text-slate transition hover:text-error disabled:opacity-50 lg:hidden"
          >
            <Icon name="logout" size={15} />
            {t('admin.logout')}
          </button>
        </header>

        <main id="main" className="mx-auto w-full min-w-0 max-w-[1440px] flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
