'use client';

/**
 * MOBILE MENU (§5, §8.3)
 * ----------------------------------------------------------------
 * Navy panel header ostida (radius 32, 16px chet):
 *   · katta linklar (30px)
 *   · til tugmalari
 *   · "Bepul namuna" copper CTA
 *
 * Animatsiya: panel `y: -12, opacity 0 → 0/1` (320ms),
 * linklar 40ms stagger bilan `y: 12 → 0`.
 * Body scroll lock · ESC · tashqariga bosish · fokus tuzog'i (§14).
 */

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import type { AppLocale } from '@/i18n';
import { dur, ease, staggerMobile } from '@/lib/motion';
import { LocaleSwitcher } from './LocaleSwitcher';
import { cn } from '@/lib/utils';

export interface MobileNavItem {
  id: string;
  href: string;
  label: string;
  wideOnly?: boolean;
}

const FOCUSABLE = 'a[href], button:not([disabled])';

export function MobileMenu({
  open,
  onClose,
  items,
  active,
  locale,
  search,
  freeLabel,
  samplesHref,
}: {
  open: boolean;
  onClose: () => void;
  items: MobileNavItem[];
  active: string;
  locale: AppLocale;
  search?: string;
  freeLabel: string;
  samplesHref: string;
}) {
  const panelRef = useRef<HTMLElement | null>(null);

  /* Body scroll lock + ESC + fokus tuzog'i */
  useEffect(() => {
    if (!open) return;

    // yopilganda fokus ochgan tugmaga (burger) qaytadi — <body> ga tushmasin
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey, true);
    // Ochilganda birinchi havolaga fokus
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus(), 60);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey, true);
      window.clearTimeout(t);
      opener?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          {/* Tashqariga bosish — yopadi */}
          <motion.div
            key="mobile-menu-backdrop"
            className="fixed inset-0 z-[98] bg-navy/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur.base, ease: ease.out }}
            onClick={onClose}
            aria-hidden
          />

          <motion.nav
            key="mobile-menu"
            ref={panelRef}
            aria-label="Menu"
            data-surface="navy"
            className="fixed inset-x-4 top-[84px] z-[99] flex flex-col gap-1 rounded-menu bg-navy p-7 text-white"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: dur.base, ease: ease.out }}
          >
            {items.map((item, i) => {
              const isActive = item.id === active;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: dur.base, delay: i * staggerMobile, ease: ease.out }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'block border-b border-on-navy-line/60 py-3 text-[30px] font-normal tracking-[-0.02em]',
                      isActive ? 'text-copper-light' : 'text-white',
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}

            <LocaleSwitcher locale={locale} search={search} variant="menu" />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur.base, delay: items.length * staggerMobile, ease: ease.out }}
            >
              <Link
                href={samplesHref}
                onClick={onClose}
                className="btn btn--accent btn--md mt-3 w-full"
              >
                {freeLabel}
              </Link>
            </motion.div>
          </motion.nav>
        </>
      ) : null}
    </AnimatePresence>
  );
}
