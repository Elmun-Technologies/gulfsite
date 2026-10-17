/**
 * TELEGRAM BOT VA MINI-APP (server-only)
 * ----------------------------------------------------------------
 * Bitta bot ikki ishni bajaradi:
 *   1. xodimlar guruhiga arizalar (`leads/notify.ts`, TELEGRAM_CHAT_ID)
 *   2. mijozlar uchun do'kon: /start → "Do'konni ochish" tugmasi (Mini App),
 *      menyu tugmasi, ariza qabul qilinganda mijozga tasdiq xabari,
 *      admin paneldan mijozga javob yozish.
 *
 * Xavfsizlik:
 *   · Mini App `initData` — Telegram imzosi (HMAC-SHA256, bot tokeni bilan)
 *     tekshiriladi; imzosiz yoki 24 soatdan eski ma'lumot qabul qilinmaydi.
 *   · Webhook — `X-Telegram-Bot-Api-Secret-Token` sarlavhasi (setWebhook
 *     paytida beriladi) tekshiriladi.
 */

import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { serverConfig, siteConfig } from './config';

export interface TgUser {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
}

const API = 'https://api.telegram.org';

function token(): string {
  return serverConfig.telegram.botToken;
}

export function botEnabled(): boolean {
  return Boolean(token());
}

/** Bot API chaqiruvi — xato bo'lsa `{ ok: false, description }` */
export async function tgApi<T = unknown>(
  method: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; result?: T; description?: string }> {
  if (!token()) return { ok: false, description: 'TELEGRAM_BOT_TOKEN sozlanmagan' };
  try {
    const res = await fetch(`${API}/bot${token()}/${method}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    return (await res.json()) as { ok: boolean; result?: T; description?: string };
  } catch (err) {
    return { ok: false, description: String(err).slice(0, 200) };
  }
}

/* ------------------------------------------------------------
   Mini App initData tekshiruvi
   https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
   ------------------------------------------------------------ */

const INIT_DATA_MAX_AGE_SEC = 24 * 3600;

export function verifyInitData(initData: string): TgUser | null {
  const botToken = token();
  if (!botToken || !initData || initData.length > 4096) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get('hash') ?? '';
  if (!/^[a-f0-9]{64}$/.test(hash)) return null;
  params.delete('hash');
  const check = [...params.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');
  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const expected = createHmac('sha256', secret).update(check).digest('hex');
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(hash))) return null;

  const authDate = Number(params.get('auth_date') ?? 0);
  if (!authDate || Date.now() / 1000 - authDate > INIT_DATA_MAX_AGE_SEC) return null;

  try {
    const u = JSON.parse(params.get('user') ?? 'null') as {
      id?: number;
      username?: string;
      first_name?: string;
      last_name?: string;
      language_code?: string;
    } | null;
    if (!u || typeof u.id !== 'number') return null;
    return {
      id: u.id,
      username: u.username?.slice(0, 64),
      firstName: u.first_name?.slice(0, 64),
      lastName: u.last_name?.slice(0, 64),
      languageCode: u.language_code?.slice(0, 8),
    };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------
   Webhook maxfiy kaliti
   ------------------------------------------------------------ */

/** TELEGRAM_WEBHOOK_SECRET bo'lmasa — bot tokenidan hosil qilinadi (barqaror) */
export function webhookSecret(): string {
  const explicit = (process.env.TELEGRAM_WEBHOOK_SECRET ?? '').trim();
  if (explicit) return explicit.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 256);
  return createHash('sha256').update(`gff-webhook:${token()}`).digest('hex').slice(0, 48);
}

export function webhookAuthorized(req: Request): boolean {
  const given = req.headers.get('x-telegram-bot-api-secret-token') ?? '';
  const expected = webhookSecret();
  return given.length === expected.length && timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

/* ------------------------------------------------------------
   Manzillar
   ------------------------------------------------------------ */

/** Mini App manzili — sayt (Vercel) domenida; til Telegram tilidan */
export function miniAppUrl(lang?: string): string {
  const site = ((process.env.FRONTEND_URL ?? '').trim() || siteConfig.url).replace(/\/+$/, '');
  const l = lang === 'ru' || lang === 'en' ? lang : 'uz';
  return `${site}/${l}/tg`;
}

/** Telegram tilidan sayt tili (uz/ru/en) */
export function tgLocale(code?: string): 'uz' | 'ru' | 'en' {
  if (!code) return 'uz';
  if (code.startsWith('ru') || code.startsWith('kk') || code.startsWith('ky') || code.startsWith('tg')) return 'ru';
  if (code.startsWith('uz')) return 'uz';
  if (code.startsWith('en')) return 'en';
  return 'ru';
}

/* ------------------------------------------------------------
   Bot matnlari (mijozga)
   ------------------------------------------------------------ */

const TEXT = {
  uz: {
    welcome:
      '<b>Gulf Flavours &amp; Fragrances — O‘zbekiston</b>\n\nAromatizatorlar, atir kompozitsiyalari, efir moylari va oziq-ovqat ingrediyentlari — 600+ pozitsiya.\n\nDo‘konni oching: katalogni ko‘ring, <b>bepul namuna qutisi</b>ni yig‘ing yoki narx so‘rang. Arizangiz darhol menejerga yetadi.',
    open: 'Do‘konni ochish',
    menu: 'Do‘kon',
    call: 'Qo‘ng‘iroq qilish',
    received: (ref: string) =>
      `✅ <b>Arizangiz qabul qilindi</b>\nRaqam: <code>${ref}</code>\n\nMenejer ish vaqtida tez orada bog‘lanadi. Savollar bo‘lsa, shu chatga yozing.`,
    reply: 'Menejer javobi',
  },
  ru: {
    welcome:
      '<b>Gulf Flavours &amp; Fragrances — Узбекистан</b>\n\nАроматизаторы, парфюмерные композиции, эфирные масла и пищевые ингредиенты — более 600 позиций.\n\nОткройте магазин: смотрите каталог, соберите <b>бесплатный тест-бокс</b> или запросите цену. Заявка сразу попадёт к менеджеру.',
    open: 'Открыть магазин',
    menu: 'Магазин',
    call: 'Позвонить',
    received: (ref: string) =>
      `✅ <b>Заявка принята</b>\nНомер: <code>${ref}</code>\n\nМенеджер свяжется с вами в рабочее время. Если есть вопросы — пишите в этот чат.`,
    reply: 'Ответ менеджера',
  },
  en: {
    welcome:
      '<b>Gulf Flavours &amp; Fragrances — Uzbekistan</b>\n\nFlavours, fragrances, essential oils and food ingredients — 600+ items.\n\nOpen the shop to browse the catalogue, build a <b>free sample box</b> or request a price. Your request goes straight to a manager.',
    open: 'Open the shop',
    menu: 'Shop',
    call: 'Call us',
    received: (ref: string) =>
      `✅ <b>Request received</b>\nNumber: <code>${ref}</code>\n\nA manager will contact you during business hours. Questions? Just reply in this chat.`,
    reply: 'Manager’s reply',
  },
} as const;

export function botText(locale: 'uz' | 'ru' | 'en') {
  return TEXT[locale];
}

/** /start javobi — Mini App tugmasi bilan */
export async function sendWelcome(chatId: number, lang?: string) {
  const l = tgLocale(lang);
  const t = TEXT[l];
  return tgApi('sendMessage', {
    chat_id: chatId,
    text: t.welcome,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [[{ text: t.open, web_app: { url: miniAppUrl(l) } }]],
    },
  });
}

/** Ariza qabul qilinganda mijozga tasdiq */
export async function sendLeadReceived(user: TgUser, ref: string, locale: 'uz' | 'ru' | 'en') {
  const t = TEXT[locale];
  return tgApi('sendMessage', {
    chat_id: user.id,
    text: t.received(ref.replace(/[<>&]/g, '')),
    parse_mode: 'HTML',
    reply_markup: { inline_keyboard: [[{ text: t.open, web_app: { url: miniAppUrl(locale) } }]] },
  });
}

/** Admin paneldan mijozga javob */
export async function sendReplyToCustomer(userId: number, text: string, locale: 'uz' | 'ru' | 'en') {
  const t = TEXT[locale];
  const safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').slice(0, 3500);
  return tgApi('sendMessage', {
    chat_id: userId,
    text: `<b>${t.reply}</b>\n\n${safe}`,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });
}

/* ------------------------------------------------------------
   Botni sozlash (admin → Sozlamalar)
   ------------------------------------------------------------ */

export interface BotSetupResult {
  bot?: { username?: string; firstName?: string };
  steps: { name: string; ok: boolean; detail?: string }[];
}

export async function setupBot(backendOrigin: string): Promise<BotSetupResult> {
  const steps: BotSetupResult['steps'] = [];
  const me = await tgApi<{ username?: string; first_name?: string }>('getMe', {});
  steps.push({ name: 'getMe', ok: me.ok, detail: me.description });
  if (!me.ok) return { steps };

  const hook = await tgApi('setWebhook', {
    url: `${backendOrigin.replace(/\/+$/, '')}/api/telegram/webhook`,
    secret_token: webhookSecret(),
    allowed_updates: ['message'],
    drop_pending_updates: true,
  });
  steps.push({ name: 'setWebhook', ok: hook.ok, detail: hook.description });

  const menu = await tgApi('setChatMenuButton', {
    menu_button: { type: 'web_app', text: TEXT.uz.menu, web_app: { url: miniAppUrl('uz') } },
  });
  steps.push({ name: 'setChatMenuButton', ok: menu.ok, detail: menu.description });

  for (const l of ['uz', 'ru', 'en'] as const) {
    const cmds = await tgApi('setMyCommands', {
      commands: [{ command: 'start', description: TEXT[l].open }],
      ...(l === 'uz' ? {} : { language_code: l }),
    });
    if (l === 'uz') steps.push({ name: 'setMyCommands', ok: cmds.ok, detail: cmds.description });
  }
  await tgApi('setMyDescription', { description: TEXT.uz.welcome.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').slice(0, 512) });
  await tgApi('setMyDescription', {
    description: TEXT.ru.welcome.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').slice(0, 512),
    language_code: 'ru',
  });

  return { bot: { username: me.result?.username, firstName: me.result?.first_name }, steps };
}

export async function botStatus(): Promise<{
  enabled: boolean;
  username?: string;
  webhookUrl?: string;
  webhookError?: string;
  pending?: number;
}> {
  if (!botEnabled()) return { enabled: false };
  const [me, hook] = await Promise.all([
    tgApi<{ username?: string }>('getMe', {}),
    tgApi<{ url?: string; last_error_message?: string; pending_update_count?: number }>('getWebhookInfo', {}),
  ]);
  return {
    enabled: me.ok,
    username: me.result?.username,
    webhookUrl: hook.result?.url || undefined,
    webhookError: hook.result?.last_error_message,
    pending: hook.result?.pending_update_count,
  };
}
