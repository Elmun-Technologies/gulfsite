/**
 * POST /api/leads — LEAD QABUL QILISH
 * ----------------------------------------------------------------
 * Oqim:
 *   1. Tezlik cheklovi (IP bo'yicha)
 *   2. JSON tahlili + hajm cheklovi
 *   3. Zod validatsiyasi (server — yagona ishonchli manba)
 *   4. Turnstile (agar yoqilgan bo'lsa)
 *   5. Spam bahosi
 *   6. Takroriy ariza tekshiruvi
 *   7. SAQLASH (har doim birinchi)
 *   8. Bildirishnomalar (Telegram / e-mail / webhook)
 *   9. Javob: ref + keyingi qadamlar
 *
 * Xato holatlari boshqariladi: 400 (validatsiya), 429 (cheklov),
 * 413 (katta hajm), 500 (server). Lead hech qachon jim yo'qolmaydi.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { leadInputSchema, issuesToFieldErrors, scoreLead } from '@/lib/leads/schema';
import { createLead, findRecentDuplicate } from '@/lib/leads/store';
import { notifyAll } from '@/lib/leads/notify';
import { checkRateLimit, clientCountry, clientIp, spamScore, verifyTurnstile } from '@/lib/leads/antispam';
import { serverConfig, siteConfig } from '@/lib/config';
import { makeT, normalizeLocale } from '@/i18n';
import { parseUtm, sanitizeLog } from '@/lib/utils';
import type { LeadRecord } from '@/lib/types';
import { getProductBySku } from '@/lib/catalog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 256 * 1024; // 256 KB — test box ham bemalol sig'adi

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const ip = clientIp(req.headers);

  /* ---- Til aniqlash ----
     1) so'rov tanasidagi `locale` (forma qaysi tilda ochilganini aniq biladi),
     2) `?lang=` parametri,
     3) Accept-Language sarlavhasi.
     Shu tartib muhim: aks holda rus tilidagi foydalanuvchiga o'zbekcha
     tasdiq xabari qaytadi. */
  const headerLocale = normalizeLocale(
    req.nextUrl.searchParams.get('lang') ?? req.headers.get('accept-language')?.split(',')[0]?.split('-')[0],
  );
  let locale = headerLocale;
  let t = makeT(locale);

  /* ---- 1. Tezlik cheklovi ---- */
  const limit = checkRateLimit(`lead:${ip}`);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'rate_limit',
          message: t('err.rateLimit', { minutes: Math.ceil(limit.retryAfterSec / 60) }),
        },
      },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  /* ---- 2. Tanani o'qish ---- */
  const contentLength = Number(req.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: { code: 'payload_too_large', message: t('err.server') } },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) throw new Error('too large');
    body = text ? JSON.parse(text) : {};
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: 'bad_json', message: t('err.spam') } },
      { status: 400 },
    );
  }

  /* ---- 2b. Tanadan tilni olamiz (validatsiya xatolari ham shu tilda bo'lsin) ---- */
  const bodyLocale = (body as { locale?: unknown } | null)?.locale;
  if (bodyLocale === 'uz' || bodyLocale === 'ru' || bodyLocale === 'en') {
    locale = bodyLocale;
    t = makeT(locale);
  }

  /* ---- 3. Validatsiya ---- */
  const parsed = leadInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'validation',
          message: t('err.required'),
          fields: issuesToFieldErrors(parsed.error),
        },
      },
      { status: 400 },
    );
  }
  const data = parsed.data;

  /* ---- 4. Honeypot (tez rad etish) ---- */
  if (data.website_url && data.website_url.trim()) {
    // Bot: 200 qaytaramiz (bloklanganini bildirish uchun emas)
    return NextResponse.json({ ok: true, data: { ref: 'GFF-HONEYPOT', suppressed: true } }, { status: 200 });
  }

  /* ---- 5. Turnstile ---- */
  let turnstilePassed: boolean | undefined;
  if (serverConfig.antispam.turnstileEnabled) {
    turnstilePassed = await verifyTurnstile(data.turnstileToken, ip);
    if (!turnstilePassed) {
      return NextResponse.json(
        { ok: false, error: { code: 'captcha', message: t('err.spam') } },
        { status: 400 },
      );
    }
  }

  /* ---- 6. Spam bahosi ---- */
  const spam = spamScore({
    honeypot: data.website_url,
    formStartedAt: data.formStartedAt,
    turnstilePassed,
    message: data.request.message ?? '',
    email: data.contact.email ?? '',
    userAgent: req.headers.get('user-agent') ?? '',
    ip,
  });

  /* ---- 7. Takroriy ariza ---- */
  const duplicate = findRecentDuplicate(data.contact.phone, serverConfig.antispam.duplicateGuardSec);
  if (duplicate && spam < 80) {
    return NextResponse.json(
      {
        ok: true,
        data: {
          ref: duplicate.ref,
          duplicate: true,
          message: t('form.duplicate'),
        },
      },
      { status: 200 },
    );
  }

  /* ---- 8. Mahsulot nomlarini katalogdan to'ldirish ----
     Klient faqat SKU yuborgan bo'lsa ham, admin panelda to'liq nom ko'rinishi kerak. */
  const products = (data.request.products ?? []).slice(0, siteConfig.business.sampleBoxMaxItems * 3).map((p) => {
    const real = getProductBySku(p.sku);
    if (!real) {
      return {
        ...p,
        slug: p.slug ?? '',
        name: { uz: p.name?.uz ?? p.sku, ru: p.name?.ru ?? p.sku, en: p.name?.en ?? p.sku },
      };
    }
    return { ...p, slug: real.slug, name: real.name };
  });

  /* ---- 9. Manba ma'lumotlari ---- */
  const url = new URL(req.url);
  const referer = req.headers.get('referer') ?? '';
  const utmFromQuery = parseUtm(url.search);
  const utmFromRef = referer ? parseUtm(safeSearch(referer)) : {};

  const leadScore = scoreLead({ ...data, request: { ...data.request, products } });

  /* ---- 10. SAQLASH ---- */
  let lead: LeadRecord;
  try {
    lead = createLead({
      type: data.type,
      contact: {
        fullName: data.contact.fullName,
        position: data.contact.position || undefined,
        phone: normalizePhoneDisplay(data.contact.phone),
        phoneRaw: data.contact.phone,
        email: data.contact.email || undefined,
        telegram: data.contact.telegram || undefined,
      },
      company: {
        name: data.company.name || '',
        inn: data.company.inn,
        type: data.company.type || undefined,
        website: data.company.website || undefined,
        employees: data.company.employees || undefined,
      },
      location: {
        region: data.location.region || undefined,
        city: data.location.city || undefined,
        address: data.location.address || undefined,
      },
      request: {
        products,
        volume: data.request.volume || undefined,
        frequency: data.request.frequency || undefined,
        budget: data.request.budget || data.request.volumeText || undefined,
        message: data.request.message || undefined,
        interest: data.request.interest,
        preferredContact: data.request.preferredContact || undefined,
        deadline: data.request.deadline || undefined,
      },
      source: {
        locale,
        page: safeUrlPath(referer) || url.pathname || '/',
        referrer: referer ? referer.slice(0, 600) : undefined,
        utm: { ...utmFromRef, ...utmFromQuery, ...(data.source?.utm ?? {}) },
        userAgent: (req.headers.get('user-agent') ?? '').slice(0, 500),
        ip,
        country: clientCountry(req.headers),
      },
      consent: data.consent,
      spamScore: spam,
      notes: [
        {
          at: new Date().toISOString(),
          text: `Lead sifati: ${leadScore}/100 · spam: ${spam}/100 · mahsulotlar: ${products.length}`,
          author: 'system',
        },
      ],
      notifications: {},
    });
  } catch (err) {
    console.error('[api/leads] saqlashda xato:', sanitizeLog(String(err)));
    return NextResponse.json(
      { ok: false, error: { code: 'storage_error', message: t('err.server') } },
      { status: 500 },
    );
  }

  /* ---- 11. Bildirishnomalar ---- */
  const results = await notifyAll(lead);
  const notifyMap: Record<string, boolean | string> = {};
  for (const r of results) notifyMap[r.channel] = r.ok ? true : (r.detail ?? false);

  // Bildirishnoma natijalarini leadga yozib qo'yamiz (admin panelda ko'rinadi)
  try {
    const { updateLead } = await import('@/lib/leads/store');
    await updateLead(lead.id, { notifications: notifyMap });
  } catch (err) {
    console.error('[api/leads] bildirishnoma holatini yozishda xato:', sanitizeLog(String(err)));
  }

  const anyNotified = results.some((r) => r.ok);
  if (!anyNotified && results.length) {
    // Hech bir kanal ishlamadi — lead saqlangan, ammo menejer bilmaydi.
    console.warn(
      `[api/leads] OGOHLANTIRISH: ${lead.ref} saqlandi, lekin hech qanday bildirishnoma kanali ishlamadi.`,
    );
  }

  /* ---- 12. Javob ---- */
  return NextResponse.json(
    {
      ok: true,
      data: {
        ref: lead.ref,
        id: lead.id,
        quality: leadScore,
        spamScore: spam,
        status: lead.status,
        responseMinutes: siteConfig.business.responseMinutes,
        sampleDeliveryDays: siteConfig.business.sampleDeliveryDays,
        message: t('form.successText', { ref: lead.ref }),
        notified: notifyMap,
      },
    },
    {
      status: 201,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Response-Time-Ms': String(Date.now() - startedAt),
      },
    },
  );
}

/** GET — servis holatini tekshirish (monitoring uchun) */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'leads',
    channels: {
      telegram: serverConfig.telegram.isEnabled,
      email: serverConfig.smtp.isEnabled || Boolean(process.env.RESEND_API_KEY),
      webhook: serverConfig.webhook.isEnabled,
    },
  });
}

/* ------------------------------------------------------------ */

function safeSearch(referer: string): string {
  try {
    return new URL(referer).search;
  } catch {
    return '';
  }
}

function safeUrlPath(referer: string): string {
  try {
    const u = new URL(referer);
    return `${u.pathname}${u.search}`.slice(0, 400);
  } catch {
    return '';
  }
}

function normalizePhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('998') && digits.length === 12) {
    const d = digits.slice(3);
    return `+998 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
  }
  return raw;
}
