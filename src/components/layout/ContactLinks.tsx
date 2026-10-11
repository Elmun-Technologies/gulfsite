'use client';

/**
 * ALOQA KARTOCHKALARI (§5, design/Contact.dc.html · CONTACTS · §12)
 * ----------------------------------------------------------------
 * Server komponentdan `onClick` uzatib bo'lmaydi (RSC cheklovi) — shuning
 * uchun kontakt kartochkalari shu klient komponentida render qilinadi va
 * bosilganda analitika hodisalari yuboriladi:
 *   `phone_click` · `email_click` · `telegram_click` · `instagram_click`
 *
 * Vizual: kulcha plitka (radius 32), kichik caps label, 20px havola,
 * izoh matn. Birinchi (telefon) kapsula navy — `phoneCard` slot'i.
 */

import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { AppLocale } from '@/i18n';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export interface ContactCard {
  label: string;
  value: string;
  /** asosiy havola (mailto/tel/telegram) */
  href?: string;
  /** ikkinchi havola (masalan Instagram) */
  extra?: { href: string; label: string; external?: boolean };
  /** izoh matni */
  text?: string;
  icon?: ReactNode;
  /** analytics hodisasi turi */
  track?: 'phone' | 'email' | 'telegram' | 'map';
}

function fire(kind: ContactCard['track'], locale: AppLocale, value: string) {
  if (kind === 'phone') track.phoneClick('contact', value);
  else if (kind === 'email') track.trackEmail('contact');
  else if (kind === 'telegram') track.telegramClick('contact');
  else if (kind === 'map') track.outbound(value);
  void locale;
}

export function ContactLinks({
  cards,
  phoneCard,
  locale,
  className,
}: {
  cards: ContactCard[];
  /** navy telefon kapsulasi (grid ustidan to'liq eniga) */
  phoneCard?: ReactNode;
  locale: AppLocale;
  className?: string;
}) {
  return (
    <div className={className}>
      {phoneCard}

      {cards.map((card) => (
        <div
          key={card.label}
          className="flex flex-col gap-2.5 rounded-card bg-panel px-[clamp(20px,2.1vw,30px)] py-7"
        >
          <span className="label">{card.label}</span>

          {card.href ? (
            <a
              href={card.href}
              onClick={() => fire(card.track, locale, card.value)}
              target={card.href.startsWith('http') ? '_blank' : undefined}
              rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-[20px] font-medium text-ink no-underline hover:text-copper-dark"
            >
              {card.value}
            </a>
          ) : (
            <span className="flex items-start gap-2 text-[17px] font-medium leading-snug">
              {card.icon ? <span className="mt-0.5 shrink-0 text-muted">{card.icon}</span> : null}
              {card.value}
            </span>
          )}

          {card.text ? <span className="text-[15px] leading-snug text-muted">{card.text}</span> : null}

          {card.extra ? (
            <a
              href={card.extra.href}
              onClick={() => {
                const extra = card.extra;
                if (!extra) return;
                if (extra.label.startsWith('@gulf')) track.instagramClick('contact');
                else fire(card.track, locale, extra.label);
              }}
              target={card.extra.external || card.extra.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-1.5 text-[17px] text-body no-underline hover:text-ink',
                card.extra.external && 'text-copper-dark underline underline-offset-4',
              )}
            >
              {card.extra.label}
              {card.extra.external ? <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden /> : null}
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}
