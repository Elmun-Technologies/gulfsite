'use client';

/** Ariza sahifasi: Telegram Mini App mijoziga bot orqali javob yozish */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const COPY = {
  uz: {
    title: 'Telegram orqali javob',
    hint: 'Mijoz arizani Telegram do‘kon orqali yubordi — xabar botdan unga boradi va izohlarga yoziladi.',
    ph: 'Masalan: Assalomu alaykum! Namunalar ertaga jo‘natiladi…',
    send: 'Yuborish',
    sending: 'Yuborilmoqda…',
    sent: 'Yuborildi',
    error: 'Yuborilmadi — mijoz botni bloklagan bo‘lishi mumkin',
    open: 'Chatni ochish',
  },
  ru: {
    title: 'Ответ в Telegram',
    hint: 'Клиент оставил заявку через Telegram-магазин — сообщение придёт ему от бота и сохранится в заметках.',
    ph: 'Например: Здравствуйте! Образцы отправим завтра…',
    send: 'Отправить',
    sending: 'Отправка…',
    sent: 'Отправлено',
    error: 'Не отправлено — возможно, клиент заблокировал бота',
    open: 'Открыть чат',
  },
  en: {
    title: 'Reply via Telegram',
    hint: 'The customer ordered via the Telegram shop — the bot delivers your message and it is saved to notes.',
    ph: 'E.g. Hello! Your samples ship tomorrow…',
    send: 'Send',
    sending: 'Sending…',
    sent: 'Sent',
    error: 'Not delivered — the customer may have blocked the bot',
    open: 'Open chat',
  },
};

export function TelegramReply({ leadId, username, locale }: { leadId: string; username?: string; locale: string }) {
  const c = COPY[(locale as keyof typeof COPY) in COPY ? (locale as keyof typeof COPY) : 'uz'];
  const router = useRouter();
  const [text, setText] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function send() {
    if (!text.trim() || state === 'sending') return;
    setState('sending');
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/telegram`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const json = (await res.json()) as { ok: boolean };
      if (!json.ok) throw new Error('fail');
      setText('');
      setState('sent');
      router.refresh();
    } catch {
      setState('error');
    }
  }

  return (
    <section className="rounded-[12px] border border-[#229ED9]/40 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-[13.5px] font-semibold tracking-tight text-ink">{c.title}</h2>
        {username ? (
          <a
            href={`https://t.me/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12.5px] font-medium text-[#229ED9] hover:underline"
          >
            @{username} · {c.open} ↗
          </a>
        ) : null}
      </div>
      <p className="mt-1 text-[12.5px] text-muted">{c.hint}</p>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (state !== 'sending') setState('idle');
        }}
        rows={3}
        placeholder={c.ph}
        className="mt-3 w-full rounded-[12px] border border-line bg-white px-3 py-2 text-[14px] leading-relaxed text-ink focus:border-navy focus:outline-none"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={send}
          disabled={!text.trim() || state === 'sending'}
          className="inline-flex h-9 items-center rounded-[10px] bg-[#229ED9] px-4 text-[13.5px] font-medium text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {state === 'sending' ? c.sending : c.send}
        </button>
        <span className={cn('text-[12.5px]', state === 'error' ? 'text-error' : 'text-ok')}>
          {state === 'sent' ? c.sent : state === 'error' ? c.error : ''}
        </span>
      </div>
    </section>
  );
}
