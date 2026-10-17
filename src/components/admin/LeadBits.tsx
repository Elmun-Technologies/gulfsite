/**
 * ADMIN — ARIZA BELGILARI (server-safe, 'use client' yo'q)
 * ----------------------------------------------------------------
 * Panelning uch xil sahifasida (dashboard, ro'yxat, tafsilot) bir xil
 * belgilar kerak: holat, tur, sifat bali va spam bahosi. Shuning uchun
 * ular bitta faylda — ranglar `LEAD_STATUSES`/`LEAD_TYPES` dan olinadi,
 * ya'ni taksonomiya o'zgarsa panel avtomatik moslashadi.
 *
 * Sifat bali `scoreLead()` bilan hisoblanadi (0–100): telefon, STIR,
 * hajm, mahsulotlar soni va h.k. Savdo bo'limi shu ball bo'yicha
 * ustuvorlikni belgilaydi.
 */

import { LEAD_STATUSES, LEAD_TYPES, tr, type Locale } from '@/lib/taxonomy';
import type { LeadRecord, LeadStatusId } from '@/lib/types';
import { scoreLead, qualityOf, type LeadQuality as QualityLevel } from '@/lib/leads/schema';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------
   Sifat bali
   ------------------------------------------------------------ */

export function leadQuality(lead: LeadRecord): { score: number; level: QualityLevel } {
  const score = scoreLead({
    type: lead.type,
    contact: lead.contact,
    company: lead.company,
    location: lead.location,
    request: lead.request,
    consent: lead.consent,
  } as Parameters<typeof scoreLead>[0]);
  return { score, level: qualityOf(score) };
}

/** Sifat balli — raqam + rangli daraja */
export function LeadQuality({ lead, locale }: { lead: LeadRecord; locale: Locale }) {
  const { score, level } = leadQuality(lead);
  const label =
    level === 'high'
      ? tr({ uz: 'Yuqori', ru: 'Высокое', en: 'High' }, locale)
      : level === 'medium'
        ? tr({ uz: 'O‘rta', ru: 'Среднее', en: 'Medium' }, locale)
        : tr({ uz: 'Past', ru: 'Низкое', en: 'Low' }, locale);

  return (
    <span className="inline-flex items-center gap-1.5" title={`${label}: ${score}/100`}>
      <span className="relative flex h-1.5 w-10 overflow-hidden rounded-full bg-line-soft">
        <span
          className={cn('absolute inset-y-0 left-0 rounded-full', level === 'high' ? 'bg-ok' : level === 'medium' ? 'bg-copper' : 'bg-muted/50')}
          style={{ width: `${score}%` }}
        />
      </span>
      <span className="font-mono text-[10.5px] font-bold text-muted tabular-nums">{score}</span>
    </span>
  );
}

/* ------------------------------------------------------------
   Holat belgisi
   ------------------------------------------------------------ */

export function LeadStatusBadge({
  status,
  locale,
  size = 'md',
}: {
  status: LeadStatusId;
  locale: Locale;
  size?: 'sm' | 'md';
}) {
  const meta = LEAD_STATUSES[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-bold whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-[10.5px]' : 'px-2.5 py-1 text-[11.5px]',
      )}
      style={{
        color: meta.color,
        borderColor: `${meta.color}55`,
        backgroundColor: `${meta.color}14`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} aria-hidden />
      {tr(meta.name, locale, status)}
    </span>
  );
}

/* ------------------------------------------------------------
   Tur belgisi
   ------------------------------------------------------------ */

export function LeadTypeBadge({ type, locale }: { type: string; locale: Locale }) {
  const meta = LEAD_TYPES[type as keyof typeof LEAD_TYPES];
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold whitespace-nowrap text-slate">
      <span
        className="flex h-6 w-6 items-center justify-center rounded-md text-white"
        style={{ backgroundColor: meta?.color ?? '#0e7c6b' }}
        aria-hidden
      >
        <Icon name={(meta?.icon ?? 'tag') as 'tag'} size={13} />
      </span>
      {tr(meta?.name, locale, type)}
    </span>
  );
}

/* ------------------------------------------------------------
   Spam bahosi
   ------------------------------------------------------------ */

export function SpamScoreBadge({ score }: { score: number }) {
  const danger = score >= 60;
  const warn = score >= 30 && score < 60;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11.5px] font-bold tabular-nums',
        danger
          ? 'border-error/40 bg-error/50/10 text-error'
          : warn
            ? 'border-copper/50 bg-copper/15 text-copper-dark'
            : 'border-line bg-panel text-muted',
      )}
      title={danger ? 'Spam ehtimoli yuqori' : warn ? 'Shubhali belgilar bor' : 'Toza ariza'}
    >
      <Icon name={danger ? 'alert' : 'shield'} size={13} />
      {score}
    </span>
  );
}
