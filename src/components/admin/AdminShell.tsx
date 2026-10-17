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

  return (
    <div className="flex min-h-dvh flex-col bg-panel lg:flex-row">
      {/* ================= SIDEBAR ================= */}
      <aside className="flex shrink-0 flex-col border-b border-white/10 bg-navy text-white lg:min-h-dvh lg:w-[15.5rem] lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 px-4 py-5">
          {/* GFF monogrammasi — sayt header'i bilan bir xil identika */}
          <Image src="/images/monogram-copper.png" alt="" width={498} height={523} className="h-10 w-auto" priority />
          <span className="flex min-w-0 flex-col gap-[5px]">
            <span className="truncate text-[11px] font-semibold leading-none tracking-[0.14em] text-white">GULF FLAVOURS</span>
            <span className="truncate text-[9.5px] font-semibold leading-none tracking-[0.26em] text-copper-light">
              {t('admin.title').toUpperCase()}
            </span>
          </span>
        </div>

        {/* Mobil navigatsiya */}
        <nav className="flex gap-1.5 overflow-x-auto px-3 pb-3 no-scrollbar lg:flex-col lg:overflow-visible lg:px-2.5 lg:pb-0">
          {items.map((it) => {
            const active = isActive(it.href, it.exact);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  'group flex shrink-0 items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-[13px] font-semibold transition lg:w-full',
                  active ? 'bg-copper text-ink' : 'text-white/70 hover:bg-white/10 hover:text-white',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon name={it.icon} size={17} className={cn(active ? 'text-ink' : 'text-white/50 group-hover:text-copper-light')} />
                <span className="whitespace-nowrap">{it.label}</span>
                {it.badge ? (
                  <span
                    className={cn(
                      'ml-auto rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums',
                      active ? 'bg-navy text-white' : 'bg-copper text-ink',
                    )}
                  >
                    {it.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Pastki blok — faqat desktopda */}
        <div className="mt-auto hidden flex-col gap-3 px-3 py-4 lg:flex">
          <div className="rounded-[14px] border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-white/45">
              {locale === 'ru' ? 'Хранилище' : locale === 'en' ? 'Storage' : 'Saqlash'}
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 font-mono text-[11.5px] text-white/75">
              <span className={cn('h-1.5 w-1.5 rounded-full', storage.writable ? 'bg-ok' : 'bg-error')} />
              {storage.driver}
            </p>
            <p className="mt-1 font-mono text-[11px] text-white/45">
              {storage.months} {locale === 'ru' ? 'файл(ов)' : 'fayl'} · {storage.sizeKb} KB
            </p>
            {!storage.writable ? (
              <p className="mt-2 text-[11px] leading-snug text-copper-light">
                {locale === 'ru'
                  ? 'Папка недоступна для записи — заявки только в памяти.'
                  : locale === 'en'
                    ? 'Directory not writable — leads are kept in memory only.'
                    : 'Jild yozish uchun mavjud emas — arizalar faqat xotirada.'}
              </p>
            ) : null}
          </div>

          <div className="rounded-[14px] border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-white/45">
              {locale === 'ru' ? 'Каналы уведомлений' : locale === 'en' ? 'Notification channels' : 'Bildirishnoma kanallari'}
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {(['telegram', 'email', 'webhook'] as const).map((ch) => (
                <li key={ch} className="flex items-center gap-2 text-[11.5px] text-white/70">
                  <span className={cn('h-1.5 w-1.5 rounded-full', channels[ch] ? 'bg-ok' : 'bg-white/20')} />
                  <span className="capitalize">{ch}</span>
                  <span className="ml-auto font-mono text-[10px] text-white/40">
                    {channels[ch] ? 'ON' : 'OFF'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-1.5">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 rounded-[14px] px-3 py-2 text-[12.5px] font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <Icon name="arrow-up-right" size={15} />
              {t('legal.backToSite')}
            </Link>
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="flex items-center gap-2 rounded-[14px] px-3 py-2 text-left text-[12.5px] font-semibold text-white/60 transition hover:bg-white/10 hover:text-copper-light disabled:opacity-50"
            >
              <Icon name="logout" size={15} />
              {loggingOut ? t('common.loading') : t('admin.logout')}
            </button>
          </div>
        </div>
      </aside>

      {/* ================= KONTENT ================= */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobil yuqori panel */}
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-line-soft bg-white/95 px-4 py-2.5 backdrop-blur lg:hidden">
          <LocaleSwitcher />
          {/* CSV eksport — bu API endpoint (sahifa emas), shuning uchun oddiy <a> */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a
            href="/api/admin/leads/export?format=csv"
            className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-[14px] border border-line px-3 text-[12.5px] font-bold text-slate transition hover:border-copper hover:text-copper-dark"
          >
            <Icon name="download" size={14} />
            CSV
          </a>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="inline-flex h-9 items-center gap-1.5 rounded-[14px] bg-navy px-3 text-[12.5px] font-bold text-white transition hover:bg-error disabled:opacity-50"
          >
            <Icon name="logout" size={14} />
            {t('admin.logout')}
          </button>
        </header>

        <main id="main" className="min-w-0 flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
