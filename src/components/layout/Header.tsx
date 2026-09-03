'use client';

/**
 * HEADER
 * ----------------------------------------------------------------
 * 3 qatlam:
 *   1. Yupqa yuqori panel — telefon, "rasmiy distribyutor" isboti, til
 *   2. Asosiy panel — logotip, navigatsiya, 2 ta CTA (Narx so'rash / Test box)
 *   3. "Katalog" ustiga borganda — mega-menü (6 kategoriya + sonlar)
 *
 * Scroll paytida panel ixchamlashadi va soyasi kuchayadi.
 * Mobil: to'liq ekranli menyü + sticky telefon tugmasi.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/config';
import { track } from '@/lib/analytics';
import { Icon, type IconName } from '@/components/ui/Icon';
import { LocaleSwitcher } from './LocaleSwitcher';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import { formatUzPhone } from '@/lib/utils';

export interface NavItem {
  href: string;
  label: string;
  icon?: IconName;
}

export interface MegaCategory {
  id: string;
  label: string;
  count: number;
  icon: IconName;
  color: string;
  groups: { id: string; label: string }[];
}

interface HeaderProps {
  nav: NavItem[];
  mega: MegaCategory[];
  productCount: number;
}

export function Header({ nav, mega, productCount }: HeaderProps) {
  const { locale, t } = useI18n();
  const pathname = usePathname() ?? `/${locale}`;
  /** Test boxdagi mahsulotlar soni — CTA tugmasidagi hisoblagich */
  const { count: boxCount } = useSampleBox();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Yo'nalish o'zgarsa menyuni yopamiz (render paytida moslash naqshi)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMobileOpen(false);
    setMegaOpen(false);
    setMobileSub(null);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href || (href !== `/${locale}` && pathname.startsWith(href));
  const catalogHref = `/${locale}/catalog`;
  const phone = siteConfig.contact.phonePrimary;

  return (
    <>
      {/* ============ YUQORI PANEL ============ */}
      <div
        className={cn(
          'relative z-40 hidden bg-pine-950 text-white/85 transition-all duration-300 lg:block',
          scrolled && 'pointer-events-none max-h-0 overflow-hidden opacity-0',
        )}
      >
        <div className="container-x flex h-9 items-center gap-5 text-[12.5px]">
          <span className="inline-flex items-center gap-1.5 font-semibold text-mint-200">
            <Icon name="badge" size={14} />
            {t('brand.role')}
          </span>
          <span className="h-3 w-px bg-white/15" aria-hidden />
          <span className="inline-flex items-center gap-1.5">
            <Icon name="map-pin" size={13} className="text-mint-200" />
            {locale === 'ru' ? siteConfig.contact.addressRu : locale === 'en' ? siteConfig.contact.addressEn : siteConfig.contact.address}
          </span>
          <span className="h-3 w-px bg-white/15" aria-hidden />
          <span className="inline-flex items-center gap-1.5">
            <Icon name="clock" size={13} className="text-mint-200" />
            {siteConfig.contact.hours}
          </span>

          <div className="ml-auto flex items-center gap-4">
            <a
              href={siteConfig.contact.phonePrimaryHref}
              onClick={() => track.callClick('header_top')}
              className="inline-flex items-center gap-1.5 font-semibold text-white transition hover:text-mint-200"
            >
              <Icon name="phone" size={13} />
              {formatUzPhone(phone)}
            </a>
            <span className="h-3 w-px bg-white/15" aria-hidden />
            <a
              href={`mailto:${siteConfig.contact.salesEmail}`}
              className="inline-flex items-center gap-1.5 transition hover:text-mint-200"
            >
              <Icon name="mail" size={13} />
              {siteConfig.contact.salesEmail}
            </a>
            <span className="h-3 w-px bg-white/15" aria-hidden />
            <LocaleSwitcher variant="dark" />
          </div>
        </div>
      </div>

      {/* ============ ASOSIY PANEL ============ */}
      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-[height,box-shadow,background-color] duration-300',
          scrolled
            ? 'h-14 border-cream-200 bg-white/92 shadow-soft backdrop-blur-md lg:h-16'
            : 'h-16 border-cream-200/80 bg-cream-50/95 backdrop-blur-sm lg:h-[4.5rem]',
        )}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <div className="container-x flex h-full items-center gap-3 lg:gap-6">
          {/* ---- Logotip ---- */}
          <Link
            href={`/${locale}`}
            className="group flex shrink-0 items-center gap-2.5"
            aria-label={siteConfig.brand.full}
            onClick={() => track.cta('logo', 'header')}
          >
            <span
              className={cn(
                'relative flex items-center justify-center rounded-xl bg-pine-800 text-mint-200 transition-all duration-300',
                scrolled ? 'h-9 w-9' : 'h-10 w-10 lg:h-11 lg:w-11',
                'group-hover:bg-teal-600 group-hover:text-white',
              )}
              aria-hidden
            >
              <Icon name="flavour" size={scrolled ? 19 : 22} strokeWidth={1.7} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold-400 ring-2 ring-cream-50" />
            </span>
            <span className="flex flex-col leading-none">
              <span
                className={cn(
                  'font-display font-extrabold tracking-tight text-pine-900 transition-all duration-300',
                  scrolled ? 'text-[15px]' : 'text-[16px] lg:text-[17px]',
                )}
              >
                GFF<span className="text-teal-600">{' '}Uzbekistan</span>
              </span>
              <span className="mt-0.5 hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-warm-500 sm:block">
                Flavours · Fragrances · Ingredients
              </span>
            </span>
          </Link>

          {/* ---- Desktop navigatsiya ---- */}
          <nav className="ml-2 hidden items-center gap-0.5 lg:flex" aria-label={t('common.menu')}>
            {nav.map((item) => {
              const isCatalog = item.href === catalogHref;
              const active = isActive(item.href);
              return (
                <div key={item.href} className="relative" onMouseEnter={() => setMegaOpen(isCatalog)}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    aria-expanded={isCatalog ? megaOpen : undefined}
                    onClick={() => isCatalog && track.cta('nav_catalog', 'header')}
                    className={cn(
                      'relative inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13.5px] font-semibold transition',
                      active ? 'text-teal-600' : 'text-slate-warm-700 hover:bg-cream-100 hover:text-pine-900',
                    )}
                  >
                    {item.label}
                    {isCatalog ? (
                      <>
                        <span className="rounded bg-mint-100 px-1.5 py-px font-mono text-[10.5px] font-bold text-teal-600">
                          {productCount}
                        </span>
                        <Icon name="chevron-down" size={13} className={cn('transition-transform', megaOpen && 'rotate-180')} />
                      </>
                    ) : null}
                    {active ? (
                      <span className="absolute inset-x-2.5 -bottom-px h-0.5 rounded-full bg-teal-500" aria-hidden />
                    ) : null}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* ---- O'ng tomon ---- */}
          <div className="ml-auto flex items-center gap-2">
            <a
              href={siteConfig.contact.phonePrimaryHref}
              onClick={() => track.callClick('header_main')}
              className="hidden items-center gap-2 rounded-lg px-2.5 py-1.5 transition hover:bg-cream-100 xl:flex"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint-100 text-teal-600">
                <Icon name="phone" size={16} />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-mono text-[14px] font-bold text-pine-900">{formatUzPhone(phone)}</span>
                <span className="text-[10.5px] font-medium text-slate-warm-500">{t('contact.callBack')}</span>
              </span>
            </a>

            <Link
              href={`/${locale}/quote`}
              onClick={() => track.cta('header_quote', 'header')}
              className="hidden h-10 items-center gap-1.5 rounded-xl border border-pine-800/20 px-4 text-[13.5px] font-semibold text-pine-800 transition hover:border-teal-500 hover:bg-mint-100 hover:text-teal-600 md:inline-flex"
            >
              <Icon name="invoice" size={16} />
              {t('nav.quote')}
            </Link>

            <Link
              href={`/${locale}/samples`}
              onClick={() => track.cta('header_sample', 'header')}
              className="relative inline-flex h-10 items-center gap-1.5 rounded-xl bg-teal-600 px-4 text-[13.5px] font-bold text-white shadow-soft transition hover:bg-pine-800 hover:shadow-lift active:scale-[0.98] sm:px-5"
            >
              <Icon name="box" size={16} />
              <span className="hidden sm:inline">{t('nav.getSample')}</span>
              <span className="sm:hidden">{t('nav.samples')}</span>
              {boxCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 font-mono text-[10px] font-extrabold text-pine-950 ring-2 ring-cream-50">
                  {boxCount}
                </span>
              ) : null}
            </Link>

            <LocaleSwitcher variant="light" className="lg:hidden" />

            {/* ---- Mobil menyü tugmasi ---- */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={t('common.menu')}
              aria-expanded={mobileOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cream-300 text-pine-800 transition hover:bg-cream-100 lg:hidden"
            >
              <Icon name="menu" size={20} />
            </button>
          </div>
        </div>

        {/* ============ MEGA-MENÜ ============ */}
        {megaOpen ? (
          <div
            className="animate-in-down absolute inset-x-0 top-full hidden border-b border-cream-200 bg-white shadow-lift lg:block"
            onMouseEnter={() => setMegaOpen(true)}
          >
            <div className="container-x grid grid-cols-12 gap-6 py-6">
              <div className="col-span-8 grid grid-cols-3 gap-3">
                {mega.map((c) => (
                  <Link
                    key={c.id}
                    href={`${catalogHref}?categories=${encodeURIComponent(c.id)}`}
                    onClick={() => track.cta(`mega_${c.id}`, 'header')}
                    className="group flex flex-col rounded-xl border border-cream-200 p-3 transition hover:-translate-y-0.5 hover:border-teal-500/40 hover:bg-mint-50/60 hover:shadow-soft"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: c.color }}
                        aria-hidden
                      >
                        <Icon name={c.icon} size={17} />
                      </span>
                      <span className="flex-1 text-[13px] leading-tight font-bold text-pine-900">{c.label}</span>
                      <span className="font-mono text-[11px] font-bold text-slate-warm-500">{c.count}</span>
                    </span>
                    <span className="mt-2.5 flex flex-wrap gap-1">
                      {c.groups.slice(0, 5).map((g) => (
                        <span
                          key={g.id}
                          className="rounded bg-cream-100 px-1.5 py-0.5 text-[10.5px] font-medium text-slate-warm-600 transition group-hover:bg-white"
                        >
                          {g.label}
                        </span>
                      ))}
                      {c.groups.length > 5 ? (
                        <span className="rounded bg-cream-100 px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-teal-600">
                          +{c.groups.length - 5}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="col-span-4 flex flex-col gap-3">
                <div className="rounded-xl bg-pine-900 p-4 text-white">
                  <p className="font-display text-[15px] leading-snug font-bold text-mint-200">{t('box.title')}</p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/70">{t('box.subtitle')}</p>
                  <Link
                    href={`/${locale}/samples`}
                    onClick={() => track.cta('mega_sample', 'header')}
                    className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-3.5 text-[13px] font-bold text-pine-900 transition hover:bg-mint-200"
                  >
                    <Icon name="box" size={15} />
                    {t('box.cta')}
                  </Link>
                </div>
                <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
                  <p className="text-[12px] font-bold uppercase tracking-wide text-teal-600">{t('catalog.quickLinks')}</p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    <li>
                      <Link href={`${catalogHref}?features=halal`} className="text-[13px] text-slate-warm-700 transition hover:text-teal-600">
                        {t('certs.halal')} →
                      </Link>
                    </li>
                    <li>
                      <Link href={`${catalogHref}?availability=new`} className="text-[13px] text-slate-warm-700 transition hover:text-teal-600">
                        {t('catalog.newArrivals')} →
                      </Link>
                    </li>
                    <li>
                      <Link href={`${catalogHref}?applications=bakery`} className="text-[13px] text-slate-warm-700 transition hover:text-teal-600">
                        {t('industries.title')} →
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {/* ============ MOBIL MENYÜ ============ */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label={t('common.menu')}>
          <div className="absolute inset-0 bg-pine-950/60 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="animate-slide-in-left absolute inset-y-0 left-0 flex w-[min(21rem,90vw)] flex-col bg-white shadow-float">
            <div className="flex items-center gap-3 border-b border-cream-200 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pine-800 text-mint-200" aria-hidden>
                <Icon name="flavour" size={19} />
              </span>
              <span className="flex-1 font-display text-[15px] font-extrabold text-pine-900">GFF Uzbekistan</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label={t('common.close')}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-cream-200 text-pine-700 transition hover:bg-cream-100"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
              {mobileSub === null ? (
                <>
                  <button
                    type="button"
                    onClick={() => setMobileSub('catalog')}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-cream-100"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint-100 text-teal-600">
                      <Icon name="grid" size={18} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[15px] font-bold text-pine-900">{t('nav.catalog')}</span>
                      <span className="block text-[12px] text-slate-warm-500">{productCount}+ {t('common.results').toLowerCase()}</span>
                    </span>
                    <Icon name="chevron-right" size={16} className="text-slate-warm-500" />
                  </button>

                  <div className="my-1 h-px bg-cream-200" aria-hidden />

                  <nav className="flex flex-col">
                    {nav.filter((n) => n.href !== catalogHref).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 transition',
                          isActive(item.href) ? 'bg-mint-100 text-teal-600' : 'text-slate-warm-700 hover:bg-cream-100',
                        )}
                      >
                        {item.icon ? <Icon name={item.icon} size={17} /> : null}
                        <span className="text-[14.5px] font-semibold">{item.label}</span>
                      </Link>
                    ))}
                  </nav>

                  <div className="my-2 h-px bg-cream-200" aria-hidden />

                  <div className="flex items-center justify-between px-3 py-1">
                    <span className="text-[12.5px] font-semibold text-slate-warm-600">{t('common.selectLanguage')}</span>
                    <LocaleSwitcher variant="light" />
                  </div>

                  <div className="mt-2 rounded-xl bg-cream-50 p-3">
                    <p className="text-[11.5px] font-semibold uppercase tracking-wide text-slate-warm-500">{t('contact.address')}</p>
                    <p className="mt-1 text-[13px] leading-snug text-pine-800">
                      {locale === 'ru' ? siteConfig.contact.addressRu : locale === 'en' ? siteConfig.contact.addressEn : siteConfig.contact.address}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-slate-warm-600">
                      <Icon name="clock" size={13} className="text-teal-600" />
                      {siteConfig.contact.hours}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setMobileSub(null)}
                    className="mb-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-semibold text-slate-warm-600 transition hover:bg-cream-100 hover:text-pine-800"
                  >
                    <Icon name="chevron-left" size={15} />
                    {t('common.back')}
                  </button>
                  <Link
                    href={catalogHref}
                    className="mb-3 flex items-center justify-between rounded-xl bg-pine-800 px-3.5 py-3 text-white transition hover:bg-teal-600"
                  >
                    <span className="text-[14px] font-bold">{t('common.all')}</span>
                    <Icon name="arrow-right" size={17} />
                  </Link>
                  <div className="flex flex-col gap-2">
                    {mega.map((c) => (
                      <Link
                        key={c.id}
                        href={`${catalogHref}?categories=${encodeURIComponent(c.id)}`}
                        className="flex items-center gap-3 rounded-xl border border-cream-200 px-3 py-2.5 transition hover:border-teal-500/40 hover:bg-mint-50"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white" style={{ backgroundColor: c.color }} aria-hidden>
                          <Icon name={c.icon} size={16} />
                        </span>
                        <span className="flex-1 text-[13.5px] font-semibold text-pine-900">{c.label}</span>
                        <span className="font-mono text-[11.5px] font-bold text-slate-warm-500">{c.count}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-cream-200 bg-cream-50 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <a
                href={siteConfig.contact.phonePrimaryHref}
                onClick={() => track.callClick('mobile_menu')}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-pine-800/20 bg-white text-[13.5px] font-bold text-pine-800"
              >
                <Icon name="phone" size={16} />
                {t('nav.call')}
              </a>
              <Link
                href={`/${locale}/samples`}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-teal-600 text-[13.5px] font-bold text-white"
              >
                <Icon name="box" size={16} />
                {t('nav.getSample')}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Header;
