/**
 * LEAD VALIDATSIYA SXEMASI (Zod)
 * ----------------------------------------------------------------
 * MUHIM: xato xabarlari — bu lug'at KALITLARI (masalan "err.phone").
 * Klient `t(key)` orqali ularni o'z tiliga tarjima qiladi.
 * Server va klient bitta sxemadan foydalanadi → hech qachon
 * validatsiya qoidalari sinxronizatsiyadan chiqmaydi.
 */

import { z } from 'zod';
import { BUSINESS_TYPES, LEAD_TYPES, UZ_REGIONS } from '../taxonomy';
import {
  isValidEmail,
  isValidInn,
  isValidInternationalPhone,
  isValidUzPhone,
  normalizeInn,
} from '../utils';

const LEAD_TYPE_IDS = Object.keys(LEAD_TYPES);
const REGION_IDS = UZ_REGIONS.map((r) => r.id);
const BUSINESS_TYPE_IDS = BUSINESS_TYPES.map((b) => b.id);
const INTEREST_IDS = ['flavours', 'fragrances', 'ingredients', 'oils', 'chemicals', 'commodities', 'custom'];
const VOLUME_IDS = ['1', '2', '3', '4', '5'];
const FREQUENCY_IDS = ['once', 'monthly', 'quarterly', 'regular'];
const CONTACT_PREF_IDS = ['phone', 'telegram', 'email'];

/* ------------------------------------------------------------
   Aloqa bloki
   ------------------------------------------------------------ */

const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { error: 'err.nameShort' })
    .max(80, { error: 'err.nameLong' }),

  position: z.string().trim().max(80).optional().or(z.literal('')),

  phone: z
    .string()
    .trim()
    .min(9, { error: 'err.phoneShort' })
    .max(32, { error: 'err.phone' })
    .refine((v) => isValidUzPhone(v) || isValidInternationalPhone(v), { error: 'err.phone' }),

  email: z
    .string()
    .trim()
    .max(254)
    .optional()
    .or(z.literal(''))
    .refine((v) => !v || isValidEmail(v), { error: 'err.email' }),

  telegram: z
    .string()
    .trim()
    .max(64)
    .optional()
    .or(z.literal(''))
    .refine((v) => !v || /^@?[A-Za-z0-9_]{3,32}$/.test(v), { error: 'err.required' }),
});

/* ------------------------------------------------------------
   Kompaniya bloki
   ------------------------------------------------------------ */

const companySchema = z.object({
  name: z
    .string()
    .trim()
    .max(120, { error: 'err.companyLong' })
    .optional()
    .or(z.literal('')),

  inn: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal(''))
    .refine((v) => !v || isValidInn(v), { error: 'err.inn' })
    .transform((v) => (v ? normalizeInn(v) : undefined)),

  type: z
    .enum(BUSINESS_TYPE_IDS as [string, ...string[]])
    .optional()
    .or(z.literal('')),

  website: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal(''))
    .refine((v) => !v || /^https?:\/\/[^\s]+\.[^\s]{2,}$/i.test(v) || /^[^\s]+\.[^\s]{2,}$/i.test(v), {
      error: 'err.required',
    }),

  employees: z.string().trim().max(40).optional().or(z.literal('')),
});

/* ------------------------------------------------------------
   Joylashuv bloki
   ------------------------------------------------------------ */

const locationSchema = z.object({
  region: z
    .enum(REGION_IDS as [string, ...string[]])
    .optional()
    .or(z.literal('')),
  city: z.string().trim().max(120).optional().or(z.literal('')),
  address: z.string().trim().max(400).optional().or(z.literal('')),
});

/* ------------------------------------------------------------
   Namuna (test box) elementi
   ------------------------------------------------------------ */

export const sampleItemSchema = z.object({
  sku: z.string().trim().min(3).max(24),
  name: z
    .object({
      uz: z.string().max(200),
      ru: z.string().max(200),
      en: z.string().max(200),
    })
    .partial()
    .catchall(z.string().max(200)),
  slug: z.string().trim().max(120).optional().or(z.literal('')),
  qty: z.coerce.number().min(0.001).max(100000).default(50),
  unit: z.enum(['g', 'ml', 'kg']).default('g'),
  note: z.string().trim().max(500).optional().or(z.literal('')),
});

/* ------------------------------------------------------------
   So'rov bloki
   ------------------------------------------------------------ */

const requestSchema = z.object({
  products: z.array(sampleItemSchema).max(40).optional(),
  volume: z.enum(VOLUME_IDS as [string, ...string[]]).optional().or(z.literal('')),
  volumeText: z.string().trim().max(120).optional().or(z.literal('')),
  frequency: z.enum(FREQUENCY_IDS as [string, ...string[]]).optional().or(z.literal('')),
  budget: z.string().trim().max(120).optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .max(2000, { error: 'err.messageLong' })
    .optional()
    .or(z.literal('')),
  interest: z.array(z.enum(INTEREST_IDS as [string, ...string[]])).max(7).optional(),
  preferredContact: z.enum(CONTACT_PREF_IDS as [string, ...string[]]).optional().or(z.literal('')),
  deadline: z
    .string()
    .trim()
    .max(16)
    .optional()
    .or(z.literal(''))
    .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), { error: 'err.required' }),
  /** Mahsulot sahifasidan kelgan so'rov uchun */
  productSlug: z.string().trim().max(120).optional().or(z.literal('')),
  productSku: z.string().trim().max(24).optional().or(z.literal('')),
});

/* ------------------------------------------------------------
   Manba bloki (server tomonida to'ldiriladi)
   ------------------------------------------------------------ */

const sourceSchema = z.object({
  locale: z.enum(['uz', 'ru', 'en']).default('uz'),
  page: z.string().max(400).default('/'),
  referrer: z.string().max(600).optional().or(z.literal('')),
  utm: z.record(z.string(), z.string().max(200)).optional(),
  userAgent: z.string().max(500).optional(),
  ip: z.string().max(64).optional(),
  country: z.string().max(64).optional(),
});

/* ------------------------------------------------------------
   YAKUNIY LEAD SXEMASI
   ------------------------------------------------------------ */

export const leadInputSchema = z
  .object({
    type: z.enum(LEAD_TYPE_IDS as [string, ...string[]], { error: 'err.required' }),
    contact: contactSchema,
    company: companySchema,
    location: locationSchema,
    request: requestSchema,
    source: sourceSchema.partial().optional(),
    consent: z.boolean().refine((v) => v === true, { error: 'err.consent' }),

    /* ---- Antispam ---- */
    /** Honeypot — odam ko'rmaydi, botlar to'ldiradi. Bo'sh bo'lishi kerak. */
    website_url: z.string().max(200).optional().or(z.literal('')),
    /** Sahifa yuklangan vaqt (ms). Juda tez yuborilgan bo'lsa — bot. */
    formStartedAt: z.coerce.number().int().positive().optional(),
    /** Cloudflare Turnstile tokeni */
    turnstileToken: z.string().max(2000).optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    // Kompaniya nomi: qo'ng'iroq so'rovidan tashqari barcha turlarda majburiy
    if (data.type !== 'callback' && (data.company.name ?? '').trim().length < 2) {
      ctx.addIssue({ code: 'custom', path: ['company', 'name'], message: 'err.companyShort' });
    }

    // Umumiy murojaat uchun kamida xabar yoki qiziqish kerak
    if (data.type === 'contact' || data.type === 'catalog') {
      const hasMessage = (data.request.message ?? '').trim().length >= 1;
      const hasInterest = (data.request.interest ?? []).length > 0;
      if (!hasMessage && !hasInterest) {
        ctx.addIssue({ code: 'custom', path: ['request', 'message'], message: 'err.message' });
      }
    }

    // Test box uchun kamida bitta mahsulot kerak
    if (data.type === 'sample' && (data.request.products ?? []).length === 0) {
      ctx.addIssue({ code: 'custom', path: ['request', 'products'], message: 'err.products' });
    }

    // Hudud: namunа yetkazish uchun majburiy
    if ((data.type === 'sample' || data.type === 'quote') && !data.location.region) {
      ctx.addIssue({ code: 'custom', path: ['location', 'region'], message: 'err.region' });
    }
  });

export type LeadInput = z.input<typeof leadInputSchema>;
export type LeadData = z.output<typeof leadInputSchema>;

/* ------------------------------------------------------------
   Xatolarni maydon xaritasiga aylantirish
   ------------------------------------------------------------ */

export interface FieldErrors {
  [path: string]: string;
}

/** Matn allaqachon i18n kalitimi? (`err.required`, `form.x` kabi) */
const I18N_KEY_RE = /^[a-z][a-zA-Z0-9]*\.[a-zA-Z0-9]+$/;

/**
 * Zod xatosini foydalanuvchiga ko'rsatish uchun I18N KALITIGA aylantirish.
 *
 * Nega bu kerak? Zod'ning standart xabarlari inglizcha va texnik
 * ("Invalid input", "Expected string, received number"). Klient
 * `t(key)` orqali tarjima qiladi, shuning uchun server har doim
 * kalit qaytarishi kerak — aks holda formada inglizcha matn chiqadi.
 *
 * Tartib: (1) schema'da yozilgan aniq xabar/kalit → (2) maydon bo'yicha
 * moslashtirish → (3) issue.code bo'yicha umumiy kalit.
 */
function issueToKey(issue: z.ZodIssue, path: string): string {
  const raw = String(issue.message ?? '');
  if (I18N_KEY_RE.test(raw)) return raw;

  const code = issue.code as string;
  const leaf = path.split('.').pop() ?? '';

  /* ---- Maydon bo'yicha aniq moslashtirish ---- */
  if (leaf === 'phone') return code === 'too_small' ? 'err.phoneShort' : 'err.phone';
  if (leaf === 'email') return 'err.email';
  if (leaf === 'inn') return 'err.inn';
  if (leaf === 'region') return 'err.region';
  if (leaf === 'consent') return 'err.consent';
  if (leaf === 'message') return code === 'too_big' ? 'err.messageLong' : 'err.message';
  if (leaf === 'fullName' || leaf === 'name') {
    if (code === 'too_big') return path.includes('company') ? 'err.companyLong' : 'err.nameLong';
    if (code === 'too_small') return path.includes('company') ? 'err.companyShort' : 'err.nameShort';
  }
  if (path.startsWith('request.products')) {
    return code === 'too_big' ? 'err.productsMax' : 'err.products';
  }

  /* ---- Umumiy (code bo'yicha) ---- */
  switch (code) {
    case 'too_big':
      return 'err.tooLong';
    case 'invalid_enum_value':
    case 'invalid_value':
    case 'unrecognized_keys':
    case 'invalid_union':
      return 'err.invalid';
    case 'too_small':
    case 'invalid_type':
      return 'err.required';
    default:
      return 'err.required';
  }
}

export function issuesToFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const path = issue.path.map(String).join('.') || '_form';
    if (!out[path]) out[path] = issueToKey(issue, path);
  }
  return out;
}

/**
 * Lead sifatini baholash (0–100).
 * Admin panelda ustuvorlikni belgilash uchun ishlatiladi.
 */
export function scoreLead(data: LeadData): number {
  let score = 0;

  if (data.contact.phone) score += 20;
  if (data.contact.email) score += 10;
  if (data.contact.position) score += 8;
  if (data.company.name) score += 15;
  if (data.company.inn) score += 12; // STIR bor = haqiqiy yuridik shaxs
  if (data.company.type && data.company.type !== 'other') score += 8;
  if (data.location.region) score += 5;
  if (data.location.city) score += 3;

  const products = data.request.products ?? [];
  if (products.length > 0) score += Math.min(20, products.length * 4);
  if (data.request.volume) score += 8;
  if (data.request.volume === '4' || data.request.volume === '5') score += 7;
  if (data.request.frequency === 'regular') score += 6;
  if ((data.request.message ?? '').length > 80) score += 5;
  if (data.type === 'sample') score += 6;
  if (data.type === 'quote') score += 10;

  // Bepul pochta — biroz pasaytiramiz (B2B da korporativ domen yaxshiroq signal)
  const email = (data.contact.email ?? '').toLowerCase();
  if (email && /@(gmail|mail\.ru|yandex|list\.ru|bk\.ru|inbox\.ru|hotmail|outlook|yahoo|icloud)\./.test(email)) {
    score -= 6;
  }

  return Math.max(0, Math.min(100, score));
}

export type LeadQuality = 'high' | 'medium' | 'low';

export function qualityOf(score: number): LeadQuality {
  if (score >= 65) return 'high';
  if (score >= 35) return 'medium';
  return 'low';
}
