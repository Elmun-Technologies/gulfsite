'use client';

/** MINI APP — pastki navigatsiya: Katalog · Quti (son) · Aloqa */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, MessageCircle, Package } from 'lucide-react';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import { cn } from '@/lib/utils';

export function TgTabs({ locale }: { locale: string }) {
  const { t } = useI18n();
  const box = useSampleBox();
  const pathname = usePathname() ?? '';
  const base = `/${locale}/tg`;
  const tabs = [
    { href: base, label: t('tg.tabCatalog'), Icon: LayoutGrid, active: pathname === base || pathname.startsWith(`${base}/p/`) },
    { href: `${base}/box`, label: t('tg.tabBox'), Icon: Package, active: pathname.startsWith(`${base}/box`), badge: box.count },
    {
      href: `${base}/contact`,
      label: t('tg.tabContact'),
      Icon: MessageCircle,
      active: pathname.startsWith(`${base}/contact`) || pathname.startsWith(`${base}/request`),
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line-soft bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      aria-label={t('tg.brand')}
    >
      <ul className="mx-auto flex max-w-[640px] list-none p-0">
        {tabs.map(({ href, label, Icon, active, badge }) => (
          <li key={href} className="flex-1">
            <Link
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex h-[64px] flex-col items-center justify-center gap-1 text-[12px] no-underline',
                active ? 'text-ink' : 'text-muted',
              )}
            >
              <span className="relative">
                <Icon size={22} strokeWidth={active ? 2 : 1.8} aria-hidden />
                {badge ? (
                  <span className="absolute -right-2.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-pill bg-copper px-1 text-[11px] font-semibold text-ink">
                    {badge}
                  </span>
                ) : null}
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
