'use client';

/**
 * FOOTER ALOQA HAVOLALARI (klient)
 * ----------------------------------------------------------------
 * Server komponentdan `onClick` uzatib bo'lmaydi — analitika hodisalari
 * (`phone_click`, `email_click`, `telegram_click`, `instagram_click`, §12)
 * shu kichik klient komponentida yuboriladi.
 */

import { Mail, MapPin, Phone } from 'lucide-react';
import { track } from '@/lib/analytics';

export function FooterAddress({ address }: { address: string }) {
  return (
    <span className="flex items-start gap-2 leading-[1.5]">
      <MapPin size={16} strokeWidth={1.8} className="mt-1 shrink-0 text-muted" aria-hidden />
      {address}
    </span>
  );
}

export function FooterPhone({ href, label, source }: { href: string; label: string; source: string }) {
  return (
    <a
      href={href}
      onClick={() => track.phoneClick(source, label)}
      className="foot-link flex items-center gap-2 font-semibold no-underline"
    >
      <Phone size={16} strokeWidth={1.8} aria-hidden />
      {label}
    </a>
  );
}

export function FooterEmail({ email, source }: { email: string; source: string }) {
  return (
    <a
      href={`mailto:${email}`}
      onClick={() => track.trackEmail(source)}
      className="foot-link flex items-center gap-2 no-underline"
    >
      <Mail size={16} strokeWidth={1.8} aria-hidden />
      {email}
    </a>
  );
}

export function FooterSocial({
  telegram,
  instagram,
  source,
}: {
  telegram?: string;
  instagram?: string;
  source: string;
}) {
  if (!telegram && !instagram) return null;
  return (
    <span className="flex flex-wrap gap-2 pt-1">
      {telegram ? (
        <a
          href={telegram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track.telegramClick(source)}
          className="cert-pill no-underline"
        >
          Telegram
        </a>
      ) : null}
      {instagram ? (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track.instagramClick(source)}
          className="cert-pill no-underline"
        >
          Instagram
        </a>
      ) : null}
    </span>
  );
}
