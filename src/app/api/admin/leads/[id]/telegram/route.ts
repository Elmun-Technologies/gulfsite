/**
 * POST /api/admin/leads/[id]/telegram — mijozga bot orqali javob yozish
 * (faqat Telegram Mini App orqali kelgan arizalar). Javob ariza izohiga ham yoziladi.
 */

import { NextResponse } from 'next/server';
import { adminGuard } from '@/lib/admin-api';
import { getLead, updateLead } from '@/lib/leads/store';
import { sendReplyToCustomer } from '@/lib/telegram';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminGuard(req, { mutating: true });
  if (denied) return denied;
  const { id } = await params;
  const lead = getLead(id);
  if (!lead) return NextResponse.json({ ok: false, error: { code: 'not_found' } }, { status: 404 });
  if (!lead.telegram?.id) return NextResponse.json({ ok: false, error: { code: 'no_telegram' } }, { status: 400 });

  let text = '';
  try {
    text = String(((await req.json()) as { text?: unknown }).text ?? '').trim();
  } catch {
    /* bo'sh */
  }
  if (!text) return NextResponse.json({ ok: false, error: { code: 'empty' } }, { status: 400 });

  const sent = await sendReplyToCustomer(lead.telegram.id, text.slice(0, 3500), lead.source.locale);
  if (!sent.ok) {
    return NextResponse.json({ ok: false, error: { code: 'telegram_failed', message: sent.description } }, { status: 502 });
  }
  const updated = await updateLead(id, { note: { text: `Telegram javob: ${text.slice(0, 1900)}`, author: 'admin' } });
  return NextResponse.json({ ok: true, data: updated });
}
