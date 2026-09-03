/**
 * LEAD BILDIRISHNOMALARI
 * ----------------------------------------------------------------
 * Har bir yangi lead uchun uchta kanal (barchasi ixtiyoriy):
 *
 *   1. Telegram bot  — eng tez, tavsiya etiladi (TELEGRAM_BOT_TOKEN)
 *   2. E-mail        — SMTP (nodemailer) yoki Resend HTTP API
 *   3. Webhook       — amoCRM / Bitrix24 / n8n / Make uchun HMAC imzoli POST
 *
 * Kanallar bir-biriga bog'liq emas: bittasi ishlamasa ham qolganlari
 * ishlaydi (Promise.allSettled). Lead hech qachon yo'qolmaydi — u avval
 * saqlanadi, keyin bildirishnoma yuboriladi.
 */

import { createHmac } from 'node:crypto';
import type { LeadRecord } from '../types';
import { LEAD_STATUSES, LEAD_TYPES, UZ_REGIONS, BUSINESS_TYPES, tr } from '../taxonomy';
import { escapeHtml, sanitizeLog } from '../utils';
import { serverConfig, siteConfig, SITE_URL } from '../config';
import { qualityOf, scoreLead } from './schema';

export interface NotifyResult {
  channel: 'telegram' | 'email' | 'webhook';
  ok: boolean;
  detail?: string;
}

/* ============================================================
   1. TELEGRAM
   ============================================================ */

const TG_LIMIT = 4000; // 4096 dan ehtiyotkorlik bilan past

function buildTelegramText(lead: LeadRecord): string {
  const type = LEAD_TYPES[lead.type as keyof typeof LEAD_TYPES];
  const status = LEAD_STATUSES[lead.status];
  const region = UZ_REGIONS.find((r) => r.id === lead.location.region);
  const biz = BUSINESS_TYPES.find((b) => b.id === lead.company.type);
  const score = scoreLead({
    type: lead.type,
    contact: lead.contact,
    company: lead.company,
    location: lead.location,
    request: lead.request,
    consent: lead.consent,
  } as Parameters<typeof scoreLead>[0]);
  const quality = qualityOf(score);

  const emoji = lead.spamScore >= 80 ? '🚫' : quality === 'high' ? '🔥' : quality === 'medium' ? '✅' : 'ℹ️';
  const typeEmoji =
    { sample: '📦', quote: '💰', product: '🏷', callback: '📞', contact: '✉️', catalog: '📄' }[lead.type] ?? '📌';

  const L: string[] = [];
  L.push(`${emoji} <b>YANGI ARIZA ${typeEmoji}</b>  ·  <code>${escapeHtml(lead.ref)}</code>`);
  L.push('');
  L.push(`<b>Turi:</b> ${escapeHtml(tr(type?.name, 'uz', lead.type))}`);
  L.push(`<b>Sifati:</b> ${quality === 'high' ? 'Yuqori' : quality === 'medium' ? 'O‘rta' : 'Past'} (${score}/100)`);
  L.push('');

  L.push('👤 <b>Aloqa</b>');
  L.push(`   ${escapeHtml(lead.contact.fullName)}${lead.contact.position ? ` — ${escapeHtml(lead.contact.position)}` : ''}`);
  L.push(`   📱 <a href="tel:${escapeHtml(lead.contact.phone)}">${escapeHtml(lead.contact.phone)}</a>`);
  if (lead.contact.email) L.push(`   ✉️ ${escapeHtml(lead.contact.email)}`);
  if (lead.contact.telegram) L.push(`   💬 Telegram: ${escapeHtml(lead.contact.telegram)}`);
  L.push('');

  L.push('🏢 <b>Kompaniya</b>');
  L.push(`   ${escapeHtml(lead.company.name || '—')}`);
  if (lead.company.inn) L.push(`   STIR: <code>${escapeHtml(lead.company.inn)}</code>`);
  if (biz) L.push(`   Turi: ${escapeHtml(tr(biz.name, 'uz'))}`);
  if (lead.company.website) L.push(`   🌐 ${escapeHtml(lead.company.website)}`);
  L.push('');

  if (region || lead.location.city) {
    L.push('📍 <b>Manzil</b>');
    L.push(`   ${escapeHtml(tr(region?.name, 'uz', ''))}${lead.location.city ? `, ${escapeHtml(lead.location.city)}` : ''}`);
    if (lead.location.address) L.push(`   ${escapeHtml(lead.location.address)}`);
    L.push('');
  }

  const products = lead.request.products ?? [];
  if (products.length) {
    L.push(`🧪 <b>Mahsulotlar (${products.length})</b>`);
    for (const p of products.slice(0, 25)) {
      const nm = p.name.uz || p.name.ru || p.name.en || p.sku;
      L.push(`   • ${escapeHtml(nm)} <code>${escapeHtml(p.sku)}</code> — ${p.qty} ${escapeHtml(p.unit)}${p.note ? ` <i>(${escapeHtml(p.note.slice(0, 60))})</i>` : ''}`);
    }
    if (products.length > 25) L.push(`   … va yana ${products.length - 25} ta`);
    L.push('');
  }

  const details: string[] = [];
  if (lead.request.volume) details.push(`Hajm: ${escapeHtml(lead.request.volume)}`);
  if (lead.request.frequency) details.push(`Chastota: ${escapeHtml(lead.request.frequency)}`);
  if (lead.request.budget) details.push(`Byudjet: ${escapeHtml(lead.request.budget)}`);
  if (lead.request.preferredContact) details.push(`Aloqa: ${escapeHtml(lead.request.preferredContact)}`);
  if (lead.request.deadline) details.push(`Muddat: ${escapeHtml(lead.request.deadline)}`);
  if (details.length) {
    L.push('📋 <b>Tafsilotlar</b>');
    for (const d of details) L.push(`   ${d}`);
    L.push('');
  }

  if (lead.request.interest?.length) {
    L.push(`🎯 <b>Qiziqish:</b> ${escapeHtml(lead.request.interest.join(', '))}`);
    L.push('');
  }

  if (lead.request.message) {
    L.push('💬 <b>Xabar</b>');
    L.push(`<i>${escapeHtml(lead.request.message.slice(0, 900))}${lead.request.message.length > 900 ? '…' : ''}</i>`);
    L.push('');
  }

  L.push('🌍 <b>Manba</b>');
  L.push(`   ${escapeHtml(lead.source.locale)} · ${escapeHtml(lead.source.page)}`);
  if (lead.source.referrer) L.push(`   ref: ${escapeHtml(lead.source.referrer.slice(0, 120))}`);
  if (lead.source.utm && Object.keys(lead.source.utm).length) {
    L.push(`   utm: ${escapeHtml(Object.entries(lead.source.utm).map(([k, v]) => `${k}=${v}`).join(' '))}`);
  }
  if (lead.source.country) L.push(`   davlat: ${escapeHtml(lead.source.country)}`);
  L.push('');

  if (lead.spamScore > 0) L.push(`⚠️ Spam bahosi: ${lead.spamScore}/100 · Holat: ${escapeHtml(tr(status.name, 'uz'))}`);

  const adminUrl = `${SITE_URL}/uz/admin/leads/${lead.id}`;
  L.push('');
  L.push(`👉 <a href="${escapeHtml(adminUrl)}">Admin panelda ochish</a>`);

  return L.join('\n');
}

/** Telegram 4096 belgi chegarasi — xabarni bo'laklarga ajratamiz */
function chunkTelegram(text: string, limit = TG_LIMIT): string[] {
  if (text.length <= limit) return [text];
  const lines = text.split('\n');
  const chunks: string[] = [];
  let cur = '';
  for (const line of lines) {
    if (cur.length + line.length + 1 > limit) {
      if (cur) chunks.push(cur);
      // Bitta qator chegaradan uzun bo'lsa — majburan kesamiz
      if (line.length > limit) {
        for (let i = 0; i < line.length; i += limit) chunks.push(line.slice(i, i + limit));
        cur = '';
        continue;
      }
      cur = line;
    } else {
      cur = cur ? `${cur}\n${line}` : line;
    }
  }
  if (cur) chunks.push(cur);
  return chunks;
}

async function sendTelegram(chatId: string, text: string, token: string): Promise<void> {
  const body: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };
  if (serverConfig.telegram.topicId) body.message_thread_id = Number(serverConfig.telegram.topicId);

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    // HTML parse xatosi bo'lsa — parse_mode siz qayta yuboramiz
    if (res.status === 400 && /can't parse|parse entities/i.test(errText)) {
      const plain = text.replace(/<[^>]+>/g, '');
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: plain, disable_web_page_preview: true }),
        signal: AbortSignal.timeout(8000),
      });
      return;
    }
    throw new Error(`Telegram ${res.status}: ${errText.slice(0, 200)}`);
  }
}

export async function notifyTelegram(lead: LeadRecord): Promise<NotifyResult> {
  const cfg = serverConfig.telegram;
  if (!cfg.isEnabled) return { channel: 'telegram', ok: false, detail: 'sozlanmagan' };

  const full = buildTelegramText(lead);
  const chunks = chunkTelegram(full);

  try {
    for (const chatId of cfg.chatIds) {
      for (const chunk of chunks) {
        await sendTelegram(chatId, chunk, cfg.botToken);
      }
    }
    return { channel: 'telegram', ok: true, detail: `${cfg.chatIds.length} chat × ${chunks.length} bo'lak` };
  } catch (err) {
    console.error('[notify:telegram]', sanitizeLog(String(err)));
    return { channel: 'telegram', ok: false, detail: String(err).slice(0, 200) };
  }
}

/* ============================================================
   2. E-MAIL
   ============================================================ */

function buildEmailHtml(lead: LeadRecord): string {
  const type = LEAD_TYPES[lead.type as keyof typeof LEAD_TYPES];
  const region = UZ_REGIONS.find((r) => r.id === lead.location.region);
  const biz = BUSINESS_TYPES.find((b) => b.id === lead.company.type);
  const products = lead.request.products ?? [];

  const row = (label: string, value: string) =>
    value ? `<tr><td style="padding:6px 12px 6px 0;color:#6b7a76;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;font-size:14px;color:#07110f">${value}</td></tr>` : '';

  const productsHtml = products.length
    ? `<table style="border-collapse:collapse;width:100%;margin:12px 0">${products
        .slice(0, 40)
        .map(
          (p) => `<tr>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;font-size:13px">${escapeHtml(p.name.uz || p.name.en || p.sku)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;font-size:12px;color:#6b7a76;font-family:monospace">${escapeHtml(p.sku)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;font-size:13px;text-align:right">${p.qty} ${escapeHtml(p.unit)}</td>
      </tr>`,
        )
        .join('')}</table>`
    : '';

  const interestLabels: Record<string, string> = {
    flavours: 'Oziq-ovqat aromatizatorlari',
    fragrances: 'Atir kompozitsiyalari',
    ingredients: "Oziq-ovqat qo'shimchalari",
    oils: 'Efir moylari',
    chemicals: 'Aroma kimyoviy moddalari',
    commodities: 'Baza xom-ashyosi',
    custom: 'Individual retseptura',
  };

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f5f2ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
<div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e4d8c1">
  <div style="background:#06302b;padding:20px 24px">
    <div style="color:#7fd8c4;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:700">Yangi ariza · ${escapeHtml(lead.ref)}</div>
    <div style="color:#fff;font-size:20px;font-weight:800;margin-top:6px">${escapeHtml(tr(type?.name, 'uz', lead.type))}</div>
    <div style="color:#b6ebde;font-size:13px;margin-top:4px">${escapeHtml(new Date(lead.createdAt).toLocaleString('uz-Latn-UZ'))} · ${escapeHtml(tr(region?.name, 'uz', '—'))}</div>
  </div>
  <div style="padding:24px">
    <h3 style="margin:0 0 8px;font-size:13px;color:#0e7c6b;text-transform:uppercase;letter-spacing:.08em">Aloqa</h3>
    <table style="border-collapse:collapse">
      ${row('Ism', escapeHtml(lead.contact.fullName))}
      ${row('Lavozim', escapeHtml(lead.contact.position ?? ''))}
      ${row('Telefon', `<a href="tel:${escapeHtml(lead.contact.phone)}" style="color:#0e7c6b;font-weight:700">${escapeHtml(lead.contact.phone)}</a>`)}
      ${row('E-mail', lead.contact.email ? `<a href="mailto:${escapeHtml(lead.contact.email)}" style="color:#0e7c6b">${escapeHtml(lead.contact.email)}</a>` : '')}
      ${row('Telegram', escapeHtml(lead.contact.telegram ?? ''))}
    </table>

    <h3 style="margin:20px 0 8px;font-size:13px;color:#0e7c6b;text-transform:uppercase;letter-spacing:.08em">Kompaniya</h3>
    <table style="border-collapse:collapse">
      ${row('Nomi', `<b>${escapeHtml(lead.company.name || '—')}</b>`)}
      ${row('STIR', escapeHtml(lead.company.inn ?? ''))}
      ${row('Biznes turi', escapeHtml(biz ? tr(biz.name, 'uz') : ''))}
      ${row('Sayt', lead.company.website ? escapeHtml(lead.company.website) : '')}
    </table>

    ${products.length ? `<h3 style="margin:20px 0 8px;font-size:13px;color:#0e7c6b;text-transform:uppercase;letter-spacing:.08em">Mahsulotlar (${products.length})</h3>${productsHtml}` : ''}

    <h3 style="margin:20px 0 8px;font-size:13px;color:#0e7c6b;text-transform:uppercase;letter-spacing:.08em">So‘rov</h3>
    <table style="border-collapse:collapse">
      ${row('Qiziqish', escapeHtml((lead.request.interest ?? []).map((i) => interestLabels[i] ?? i).join(', ')))}
      ${row('Hajm', escapeHtml(lead.request.volume ?? ''))}
      ${row('Chastota', escapeHtml(lead.request.frequency ?? ''))}
      ${row('Muddat', escapeHtml(lead.request.deadline ?? ''))}
      ${row('Aloqa usuli', escapeHtml(lead.request.preferredContact ?? ''))}
    </table>
    ${lead.request.message ? `<p style="margin:12px 0;padding:12px;background:#f9f4ea;border-left:3px solid #d4a63c;font-size:14px;line-height:1.5;color:#38443f">${escapeHtml(lead.request.message)}</p>` : ''}

    <h3 style="margin:20px 0 8px;font-size:13px;color:#0e7c6b;text-transform:uppercase;letter-spacing:.08em">Manba</h3>
    <table style="border-collapse:collapse">
      ${row('Sahifa', escapeHtml(lead.source.page))}
      ${row('Til', escapeHtml(lead.source.locale))}
      ${row('Referrer', escapeHtml(lead.source.referrer ?? ''))}
      ${row('UTM', escapeHtml(Object.entries(lead.source.utm ?? {}).map(([k, v]) => `${k}=${v}`).join(' ')))}
      ${row('Davlat', escapeHtml(lead.source.country ?? ''))}
      ${row('Spam bahosi', `${lead.spamScore}/100`)}
    </table>

    <a href="${escapeHtml(`${SITE_URL}/uz/admin/leads/${lead.id}`)}" style="display:inline-block;margin-top:20px;background:#0e7c6b;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700;font-size:14px">Admin panelda ochish →</a>
  </div>
  <div style="padding:14px 24px;background:#f9f4ea;color:#6b7a76;font-size:12px">
    ${escapeHtml(siteConfig.brand.distributor)} · ${escapeHtml(siteConfig.brand.full)}
  </div>
</div></body></html>`;
}

function emailSubject(lead: LeadRecord): string {
  const type = LEAD_TYPES[lead.type as keyof typeof LEAD_TYPES];
  const label = tr(type?.name, 'ru', lead.type);
  const score = lead.spamScore >= 80 ? '[SPAM?] ' : '';
  return `${score}[${lead.ref}] ${label} — ${lead.company.name || lead.contact.fullName} · ${lead.contact.phone}`;
}

async function sendViaResend(lead: LeadRecord, apiKey: string): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: process.env.SMTP_FROM || 'GFF Uzbekistan <onboarding@resend.dev>',
      to: serverConfig.smtp.to.length ? serverConfig.smtp.to : [siteConfig.contact.salesEmail],
      subject: emailSubject(lead),
      html: buildEmailHtml(lead),
      reply_to: lead.contact.email || undefined,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text().catch(() => '')).slice(0, 200)}`);
}

async function sendViaSmtp(lead: LeadRecord): Promise<void> {
  // nodemailer ixtiyoriy: o'rnatilmagan bo'lsa — aniq xabar bilan o'tkazib yuboramiz
  let nodemailer: typeof import('nodemailer') | null = null;
  try {
    nodemailer = await import('nodemailer');
  } catch {
    throw new Error('nodemailer o‘rnatilmagan: npm i nodemailer (yoki RESEND_API_KEY ishlating)');
  }

  const cfg = serverConfig.smtp;
  const mod = (nodemailer as unknown as { default?: typeof import('nodemailer') }).default ?? nodemailer;
  const transporter = mod.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure || cfg.port === 465,
    auth: cfg.user ? { user: cfg.user, pass: cfg.password } : undefined,
  });

  await transporter.sendMail({
    from: cfg.from,
    to: cfg.to.join(', '),
    replyTo: lead.contact.email || undefined,
    subject: emailSubject(lead),
    html: buildEmailHtml(lead),
    text: `${lead.ref} | ${lead.contact.fullName} | ${lead.contact.phone} | ${lead.company.name}`,
  });
}

export async function notifyEmail(lead: LeadRecord): Promise<NotifyResult> {
  const resendKey = process.env.RESEND_API_KEY;
  const smtpReady = serverConfig.smtp.isEnabled;

  if (!resendKey && !smtpReady) return { channel: 'email', ok: false, detail: 'sozlanmagan' };

  try {
    if (smtpReady) {
      await sendViaSmtp(lead);
      return { channel: 'email', ok: true, detail: `SMTP → ${serverConfig.smtp.to.join(', ')}` };
    }
    await sendViaResend(lead, resendKey!);
    return { channel: 'email', ok: true, detail: 'Resend API' };
  } catch (err) {
    console.error('[notify:email]', sanitizeLog(String(err)));
    return { channel: 'email', ok: false, detail: String(err).slice(0, 200) };
  }
}

/* ============================================================
   3. WEBHOOK (CRM / avtomatlashtirish)
   ============================================================ */

export async function notifyWebhook(lead: LeadRecord): Promise<NotifyResult> {
  const cfg = serverConfig.webhook;
  if (!cfg.isEnabled) return { channel: 'webhook', ok: false, detail: 'sozlanmagan' };

  try {
    const payload = JSON.stringify({
      event: 'lead.created',
      sentAt: new Date().toISOString(),
      signature: cfg.secret
        ? createHmac('sha256', cfg.secret).update(JSON.stringify({ ref: lead.ref, id: lead.id })).digest('hex')
        : undefined,
      lead,
    });

    const res = await fetch(cfg.url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'GFF-Uzbekistan-LeadHook/1.0',
        ...(cfg.secret ? { 'x-gff-signature': createHmac('sha256', cfg.secret).update(payload).digest('hex') } : {}),
      },
      body: payload,
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`Webhook ${res.status}`);
    return { channel: 'webhook', ok: true, detail: `HTTP ${res.status}` };
  } catch (err) {
    console.error('[notify:webhook]', sanitizeLog(String(err)));
    return { channel: 'webhook', ok: false, detail: String(err).slice(0, 200) };
  }
}

/* ============================================================
   BARCHA KANALLAR
   ============================================================ */

export async function notifyAll(lead: LeadRecord): Promise<NotifyResult[]> {
  const results = await Promise.allSettled([notifyTelegram(lead), notifyEmail(lead), notifyWebhook(lead)]);
  return results.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : { channel: (['telegram', 'email', 'webhook'] as const)[i]!, ok: false, detail: String(r.reason).slice(0, 200) },
  );
}

/** Lead saqlangach, javobni kechiktirmasdan bildirishnoma yuborish */
export function notifyInBackground(lead: LeadRecord): Promise<NotifyResult[]> {
  return notifyAll(lead).catch((err) => {
    console.error('[notify] kutilmagan xato:', sanitizeLog(String(err)));
    return [] as NotifyResult[];
  });
}
