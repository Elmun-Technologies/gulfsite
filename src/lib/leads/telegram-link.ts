/**
 * Telegram mijozi ↔ ariza bog'lanishi (server-only)
 * Mijoz botga yozgan savol uning OXIRGI arizasiga izoh bo'lib tushadi va
 * xodimlar guruhiga ham yuboriladi — hech bir xabar yo'qolmaydi.
 */

import { serverConfig, SITE_URL } from '../config';
import { tgApi } from '../telegram';
import { escapeHtml } from '../utils';
import { readAllLeads, updateLead } from './store';

export async function appendCustomerMessage(userId: number, text: string): Promise<boolean> {
  const lead = readAllLeads()
    .filter((l) => l.telegram?.id === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];
  if (!lead) return false;

  await updateLead(lead.id, { note: { text: `Telegram: ${text}`, author: 'mijoz' } });

  const who = lead.telegram?.username ? `@${lead.telegram.username}` : lead.contact.fullName;
  const body = [
    `💬 <b>Mijoz yozdi</b> · <code>${escapeHtml(lead.ref)}</code>`,
    `${escapeHtml(who)} · ${escapeHtml(lead.contact.phone)}`,
    '',
    `<i>${escapeHtml(text.slice(0, 1500))}</i>`,
    '',
    `👉 <a href="${escapeHtml(`${SITE_URL}/uz/admin/leads/${lead.id}`)}">Javob yozish (admin panel)</a>`,
  ].join('\n');
  for (const chatId of serverConfig.telegram.chatIds) {
    await tgApi('sendMessage', {
      chat_id: chatId,
      text: body,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...(serverConfig.telegram.topicId ? { message_thread_id: Number(serverConfig.telegram.topicId) } : {}),
    });
  }
  return true;
}
