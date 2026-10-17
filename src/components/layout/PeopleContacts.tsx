'use client';

/**
 * KONTAKT SHAXSLAR — direktor + sotuv menejerlari (admin paneldan tahrirlanadi)
 * ----------------------------------------------------------------
 * Har bir raqam yonida uchta amal: qo'ng'iroq · WhatsApp · Telegram.
 * Klient komponent — bosilganda analitika hodisalari yuboriladi
 * (`phone_click`, `whatsapp_click`, `telegram_click`).
 *
 *   variant="cards" — /contact sahifasi (kulcha plitkalar)
 *   variant="list"  — footer (ixcham qatorlar)
 */

import { Phone } from 'lucide-react';
import { WhatsAppIcon, TelegramIcon } from '@/components/ui/BrandIcons';
import { track } from '@/lib/analytics';
import { telHref, telegramHref, whatsappHref, type ContactPerson } from '@/lib/contacts';
import { cn } from '@/lib/utils';

export interface PeopleLabels {
  director: string;
  sales: string;
  call: string;
  whatsapp: string;
  telegram: string;
  waGreeting: string;
}

function MessengerLinks({
  person,
  labels,
  source,
  size,
  tone,
}: {
  person: ContactPerson;
  labels: PeopleLabels;
  source: string;
  size: 'sm' | 'md';
  tone: 'light' | 'navy';
}) {
  const box = size === 'md' ? 'h-11 w-11' : 'h-9 w-9';
  const cls = cn(
    'inline-flex shrink-0 items-center justify-center rounded-pill border no-underline transition-colors',
    box,
    tone === 'navy'
      ? 'border-white/25 text-white hover:border-copper hover:text-copper-light'
      : 'border-line text-ink hover:border-ink',
  );
  return (
    <>
      {person.whatsapp ? (
        <a
          href={whatsappHref(person.phone, labels.waGreeting)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${labels.whatsapp}: ${person.phone}`}
          title={labels.whatsapp}
          onClick={() => track.whatsappClick(source, person.phone)}
          className={cls}
        >
          <WhatsAppIcon size={size === 'md' ? 19 : 16} />
        </a>
      ) : null}
      {person.telegram ? (
        <a
          href={telegramHref(person.phone)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${labels.telegram}: ${person.phone}`}
          title={labels.telegram}
          onClick={() => track.telegramClick(source)}
          className={cls}
        >
          <TelegramIcon size={size === 'md' ? 19 : 16} />
        </a>
      ) : null}
    </>
  );
}

export function PeopleContacts({
  people,
  labels,
  source,
  variant = 'cards',
  className,
}: {
  people: ContactPerson[];
  labels: PeopleLabels;
  source: string;
  variant?: 'cards' | 'list';
  className?: string;
}) {
  if (!people.length) return null;

  if (variant === 'list') {
    return (
      <ul className={cn('m-0 flex list-none flex-col gap-2.5 p-0', className)}>
        {people.map((p) => (
          <li key={`${p.role}-${p.phone}`} className="flex flex-wrap items-center gap-2">
            <span className="flex min-w-0 flex-col">
              <span className="text-[12px] text-muted">
                {p.role === 'director' ? labels.director : labels.sales}
                {p.name ? ` · ${p.name}` : ''}
              </span>
              <a
                href={telHref(p.phone)}
                onClick={() => track.phoneClick(source, p.phone)}
                className="foot-link flex items-center gap-2 font-semibold no-underline"
              >
                <Phone size={15} strokeWidth={1.8} aria-hidden />
                {p.phone}
              </a>
            </span>
            <span className="ml-auto flex gap-1.5">
              <MessengerLinks person={p} labels={labels} source={source} size="sm" tone="light" />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={className}>
      {people.map((p) => {
        const navy = p.role === 'director';
        return (
          <div
            key={`${p.role}-${p.phone}`}
            data-surface={navy ? 'navy' : undefined}
            className={cn(
              'flex flex-col gap-4 rounded-card px-[clamp(20px,2.1vw,30px)] py-7',
              navy ? 'bg-navy text-white' : 'bg-panel',
            )}
          >
            <span className={cn('flex flex-col gap-1', navy ? 'text-copper-light' : '')}>
              <span className={navy ? 'text-[14px]' : 'label'}>
                {p.role === 'director' ? labels.director : labels.sales}
              </span>
              {p.name ? <span className="text-[16px] font-medium">{p.name}</span> : null}
            </span>
            <a
              href={telHref(p.phone)}
              onClick={() => track.phoneClick(source, p.phone)}
              className={cn(
                'text-[clamp(22px,2vw,28px)] font-normal tracking-[-0.01em] no-underline',
                navy ? 'text-white hover:text-copper-light' : 'text-ink hover:text-copper-dark',
              )}
            >
              {p.phone}
            </a>
            <span className="flex flex-wrap items-center gap-2">
              <a
                href={telHref(p.phone)}
                onClick={() => track.phoneClick(source, p.phone)}
                className={cn('btn btn--sm', navy ? 'btn--accent' : 'btn--primary')}
              >
                <Phone size={16} strokeWidth={1.8} aria-hidden />
                {labels.call}
              </a>
              <MessengerLinks person={p} labels={labels} source={source} size="md" tone={navy ? 'navy' : 'light'} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
