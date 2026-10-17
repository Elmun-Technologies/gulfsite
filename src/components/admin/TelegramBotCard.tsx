'use client';

/**
 * Sozlamalar → Telegram do'kon: bot holati va bir tugmada sozlash
 * (webhook, "Do'kon" menyu tugmasi, /start, tavsif).
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Status {
  enabled: boolean;
  username?: string;
  webhookUrl?: string;
  webhookError?: string;
  pending?: number;
}

const COPY = {
  uz: {
    title: 'Telegram do‘kon (Mini App)',
    noToken: 'TELEGRAM_BOT_TOKEN sozlanmagan — fly secrets set TELEGRAM_BOT_TOKEN=…',
    bot: 'Bot',
    webhook: 'Webhook',
    notSet: 'sozlanmagan',
    lastError: 'Oxirgi xato',
    shop: 'Do‘kon manzili',
    setup: 'Botni sozlash',
    working: 'Sozlanmoqda…',
    done: 'Tayyor: mijozlar botda “Do‘kon” tugmasini ko‘radi',
    failed: 'Sozlanmadi',
    hint: 'Tugma botga do‘kon menyusini, /start javobini va webhook’ni o‘rnatadi. Domen o‘zgarsa qayta bosing.',
  },
  ru: {
    title: 'Telegram-магазин (Mini App)',
    noToken: 'TELEGRAM_BOT_TOKEN не задан — fly secrets set TELEGRAM_BOT_TOKEN=…',
    bot: 'Бот',
    webhook: 'Webhook',
    notSet: 'не настроен',
    lastError: 'Последняя ошибка',
    shop: 'Адрес магазина',
    setup: 'Настроить бота',
    working: 'Настройка…',
    done: 'Готово: клиенты видят кнопку «Магазин» в боте',
    failed: 'Не настроено',
    hint: 'Кнопка устанавливает меню магазина, ответ на /start и webhook. При смене домена нажмите снова.',
  },
  en: {
    title: 'Telegram shop (Mini App)',
    noToken: 'TELEGRAM_BOT_TOKEN is not set — fly secrets set TELEGRAM_BOT_TOKEN=…',
    bot: 'Bot',
    webhook: 'Webhook',
    notSet: 'not set',
    lastError: 'Last error',
    shop: 'Shop URL',
    setup: 'Set up bot',
    working: 'Setting up…',
    done: 'Done: customers see the “Shop” button in the bot',
    failed: 'Setup failed',
    hint: 'Sets the shop menu button, /start reply and webhook. Run again if the domain changes.',
  },
};

export function TelegramBotCard({ initial, shopUrl, locale }: { initial: Status; shopUrl: string; locale: string }) {
  const c = COPY[(locale as keyof typeof COPY) in COPY ? (locale as keyof typeof COPY) : 'uz'];
  const [status, setStatus] = useState<Status>(initial);
  const [state, setState] = useState<'idle' | 'working' | 'done' | 'failed'>('idle');
  const [detail, setDetail] = useState('');

  async function setup() {
    setState('working');
    setDetail('');
    try {
      const res = await fetch('/api/admin/telegram/setup', { method: 'POST' });
      const json = (await res.json()) as {
        ok: boolean;
        data?: { status?: Status; steps?: { name: string; ok: boolean; detail?: string }[] };
        error?: { code?: string };
      };
      if (json.data?.status) setStatus(json.data.status);
      const bad = json.data?.steps?.filter((s) => !s.ok) ?? [];
      setDetail(bad.map((s) => `${s.name}: ${s.detail ?? ''}`).join(' · ') || json.error?.code || '');
      setState(json.ok ? 'done' : 'failed');
    } catch {
      setState('failed');
    }
  }

  return (
    <section className="admin-card p-4 lg:col-span-2">
      <h2 className="mb-3 font-display text-[14px] font-semibold tracking-tight text-ink">{c.title}</h2>
      {!status.enabled ? (
        <p className="text-[13px] text-error">{c.noToken}</p>
      ) : (
        <ul className="grid gap-1.5 text-[13px]">
          <li>
            <span className="text-muted">{c.bot}:</span>{' '}
            <a href={`https://t.me/${status.username}`} target="_blank" rel="noreferrer" className="font-medium text-ink hover:underline">
              @{status.username}
            </a>
          </li>
          <li>
            <span className="text-muted">{c.webhook}:</span>{' '}
            <span className={cn('font-mono text-[12px]', status.webhookUrl ? 'text-ink' : 'text-error')}>
              {status.webhookUrl ?? c.notSet}
            </span>
          </li>
          {status.webhookError ? (
            <li className="text-error">
              {c.lastError}: {status.webhookError}
            </li>
          ) : null}
          <li>
            <span className="text-muted">{c.shop}:</span> <span className="font-mono text-[12px] text-ink">{shopUrl}</span>
          </li>
        </ul>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={setup}
          disabled={!status.enabled || state === 'working'}
          className="inline-flex h-10 items-center rounded-[10px] bg-navy px-4 text-[13.5px] font-medium text-white disabled:opacity-50"
        >
          {state === 'working' ? c.working : c.setup}
        </button>
        <span className={cn('text-[12.5px]', state === 'failed' ? 'text-error' : 'text-ok')}>
          {state === 'done' ? c.done : state === 'failed' ? `${c.failed}${detail ? ` — ${detail}` : ''}` : ''}
        </span>
      </div>
      <p className="mt-2 text-[12px] text-muted">{c.hint}</p>
    </section>
  );
}
