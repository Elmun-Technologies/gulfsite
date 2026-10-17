/**
 * POST /api/telegram/webhook — bot yangilanishlari (faqat fly/backend)
 * ----------------------------------------------------------------
 * Shaxsiy chatdagi har qanday xabar (/start ham) → salomlashish +
 * "Do'konni ochish" (Mini App) tugmasi. Guruh xabarlari e'tiborsiz
 * (bot xodimlar guruhida ham turadi). Mijoz yozgan matn admin panelga
 * tegishli arizaning izohiga qo'shiladi (oxirgi ariza bo'yicha).
 */

import { NextResponse } from 'next/server';
import { sendWelcome, webhookAuthorized } from '@/lib/telegram';
import { appendCustomerMessage } from '@/lib/leads/telegram-link';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Update {
  message?: {
    text?: string;
    chat?: { id: number; type?: string };
    from?: { id: number; language_code?: string; username?: string; first_name?: string };
  };
}

export async function POST(req: Request) {
  if (!webhookAuthorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  let update: Update;
  try {
    update = (await req.json()) as Update;
  } catch {
    return NextResponse.json({ ok: true });
  }
  const msg = update.message;
  if (!msg?.chat || msg.chat.type !== 'private' || !msg.from) return NextResponse.json({ ok: true });

  const text = (msg.text ?? '').trim();
  if (!text || text.startsWith('/start') || text.startsWith('/shop') || text.startsWith('/menu')) {
    await sendWelcome(msg.chat.id, msg.from.language_code);
    return NextResponse.json({ ok: true });
  }

  // mijoz yozgan savol — oxirgi arizasiga izoh sifatida (admin panelda ko'rinadi)
  const linked = await appendCustomerMessage(msg.from.id, text.slice(0, 2000));
  if (!linked) await sendWelcome(msg.chat.id, msg.from.language_code);
  return NextResponse.json({ ok: true });
}
