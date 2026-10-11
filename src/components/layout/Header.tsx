'use client';

/**
 * HEADER (§5, §8.3, design/Header.dc.html)
 * ----------------------------------------------------------------
 * Logo (mis monogramma + "GULF FLAVOURS & FRAGRANCES / UZBEKISTAN")
 * nav (5 ta) · til switch (UZ·RU·EN segmented) · "Namuna qutisi" CTA + hisoblagich
 * <1080px → logo + quti ikonkasi + gamburger
 *
 * Animatsiya:
 *   scroll > 24px        fon shaffofdan oqqa + pastki 1px chiziq (200ms)
 *   pastga > 120px       header `y: -100%` yashirinadi (320ms ease.out)
 *   tepaga scroll        qaytadi; menyu ochiq bo'lsa yashirinmaydi
 *   nav link hover       pastki 2px chiziq scaleX 0→1 chapdan (200ms)
 *   til switch           layoutId="lang" (LocaleSwitcher)
 *   hisoblagich          FlyToBox tugagach scale 1 → 1.25 → 1 (300ms)
 */

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Package, X } from 'lucide-react';
import { motion } from 'motion/react';
import type { AppLocale } from '@/i18n';
import { dur, ease } from '@/lib/motion';
import { useSampleBox } from '@/components/sample/SampleBoxProvider';
import { BOX_PULSE_EVENT } from '@/components/motion';
import { fillVars } from '@/i18n/translator';
import { LocaleSwitcher } from './LocaleSwitcher';
import { MobileMenu, type MobileNavItem } from './MobileMenu';
import { cn } from '@/lib/utils';

const SCROLL_BG = 24;
const SCROLL_HIDE = 120;
/** <1080px → gamburger (§4.3) */
const NARROW = 1080;

export interface HeaderProps {
  locale: AppLocale;
  nav: MobileNavItem[];
  samplesHref: string;
  ctaLabel: string;
  freeLabel: string;
  logoAlt: string;
  openLabel: string;
  closeLabel: string;
  /** `header.boxAria` shabloni — `{count}` joy tutgichi bilan */
  boxAriaTemplate: string;
  search?: string;
}

export function Header({
  locale,
  nav,
  samplesHref,
  ctaLabel,
  freeLabel,
  logoAlt,
  openLabel,
  closeLabel,
  boxAriaTemplate,
  search,
}: HeaderProps) {
  const pathname = usePathname();
  const { count } = useSampleBox();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);

  /* ---- scroll holati ---- */
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        setScrolled(y > SCROLL_BG);
        setHidden(y > SCROLL_HIDE && y > last + 2);
        if (y < last - 2) setHidden(false);
        last = y;
      });
    };

    const onResize = () => {
      const n = window.innerWidth < NARROW;
      setNarrow(n);
      // kengayganda menyu ochiq qolmasin
      if (!n) setOpen(false);
    };

    onScroll();
    onResize();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  /* ---- hisoblagich pulsatsiyasi (FlyToBox tugagach) ---- */
  useEffect(() => {
    const onPulse = () => setPulse((p) => p + 1);
    window.addEventListener(BOX_PULSE_EVENT, onPulse);
    return () => window.removeEventListener(BOX_PULSE_EVENT, onPulse);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  useEffect(() => close(), [pathname, close]);

  const active = nav.find((n) => n.href !== `/${locale}` && pathname.startsWith(n.href))?.id ??
    (pathname === `/${locale}` ? 'home' : 'none');

  const logo = (
    <Link href={`/${locale}`} aria-label={logoAlt} className="flex shrink-0 items-center gap-3 no-underline">
      <Image
        src="/images/monogram-copper.png"
        alt=""
        width={498}
        height={523}
        priority
        quality={90}
        sizes="48px"
        className={cn('block h-10 w-auto lg:h-12')}
      />
      <span className="flex flex-col gap-[5px]">
        <span className="text-[10px] font-semibold leading-none tracking-[0.12em] lg:text-[13px] lg:tracking-[0.16em]">
          GULF FLAVOURS &amp; FRAGRANCES
        </span>
        <span className="text-[9px] font-semibold leading-none tracking-[0.28em] text-copper-dark lg:text-[11px] lg:tracking-[0.32em]">
          UZBEKISTAN
        </span>
      </span>
    </Link>
  );

  const counter = (
    <motion.span
      key={pulse}
      initial={{ scale: 1 }}
      animate={pulse ? { scale: [1, 1.25, 1] } : { scale: 1 }}
      transition={{ duration: 0.3, ease: ease.out }}
      className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-pill bg-copper px-1.5 text-[13px] font-semibold text-ink"
    >
      {count}
    </motion.span>
  );

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? '-100%' : 0 }}
        transition={{ duration: dur.base, ease: ease.out }}
        className={cn(
          'sticky top-0 z-[100] w-full transition-[background-color,border-color] duration-200',
          scrolled ? 'border-b border-line-soft bg-white' : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="container-page flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-4">
          {logo}

          {/* ---------- >=1080px: nav + til + CTA ---------- */}
          <nav
            aria-label="Menu"
            className="hidden flex-wrap items-center gap-x-7 gap-y-1 nav:flex"
          >
            {nav.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                data-active={item.id === active ? 'true' : undefined}
                aria-current={item.id === active ? 'page' : undefined}
                className="nav-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 nav:flex">
            <LocaleSwitcher locale={locale} search={search} />
            <Link
              href={samplesHref}
              data-box-target=""
              className="btn btn--primary btn--sm gap-2.5"
            >
              {ctaLabel}
              {counter}
            </Link>
          </div>

          {/* ---------- <1080px: quti ikonkasi + gamburger ---------- */}
          <div className="flex items-center gap-2 nav:hidden">
            <Link
              href={samplesHref}
              data-box-target=""
              aria-label={fillVars(boxAriaTemplate, { count })}
              className="btn btn--primary btn--sm gap-2 px-3.5"
            >
              <Package size={18} strokeWidth={1.8} aria-hidden />
              {counter}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="gff-mobile-menu"
              aria-label={open ? closeLabel : openLabel}
              className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-line-warm bg-white text-ink transition-colors hover:border-ink"
            >
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: dur.fast + 0.02, ease: ease.out }}
                className="inline-flex"
              >
                {open ? <X size={18} strokeWidth={2} aria-hidden /> : <Menu size={18} strokeWidth={2} aria-hidden />}
              </motion.span>
            </button>
          </div>
        </div>
      </motion.header>

      <div id="gff-mobile-menu">
        <MobileMenu
          open={open}
          onClose={close}
          items={nav}
          active={active}
          locale={locale}
          search={search}
          freeLabel={freeLabel}
          samplesHref={samplesHref}
        />
      </div>

    </>
  );
}
