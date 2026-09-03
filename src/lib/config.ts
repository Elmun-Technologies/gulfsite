/**
 * SAYT KONFIGURATSIYASI
 * ----------------------------------------------------------------
 * Barcha qiymatlar .env dan o'qiladi; yo'q bo'lsa — oqilona standart.
 * Hech qachon maxfiy kalitlarni NEXT_PUBLIC_ orqali ochmang.
 */

function str(key: string, fallback = ''): string {
  const v = process.env[key];
  return v && v.trim() ? v.trim() : fallback;
}

function num(key: string, fallback: number): number {
  const v = Number(process.env[key]);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

function bool(key: string, fallback = false): boolean {
  const v = process.env[key];
  if (v == null || v === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(v.toLowerCase());
}

function trimSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

const rawUrl = str('NEXT_PUBLIC_SITE_URL', process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000');

export const SITE_URL = trimSlash(rawUrl);

export const siteConfig = {
  url: SITE_URL,
  name: str('NEXT_PUBLIC_SITE_NAME', 'GFF Uzbekistan'),
  brand: {
    short: 'GFF',
    full: 'Gulf Flavours & Fragrances',
    legal: 'Gulf Flavours & Fragrances FZCO',
    distributor: 'GFF Uzbekistan',
    since: 2002,
  },

  contact: {
    phonePrimary: str('NEXT_PUBLIC_PHONE_PRIMARY', '+998712000000'),
    phoneSecondary: str('NEXT_PUBLIC_PHONE_SECONDARY', '+998901234567'),
    phonePrimaryHref: `tel:${str('NEXT_PUBLIC_PHONE_PRIMARY', '+998712000000').replace(/[^\d+]/g, '')}`,
    phoneSecondaryHref: `tel:${str('NEXT_PUBLIC_PHONE_SECONDARY', '+998901234567').replace(/[^\d+]/g, '')}`,
    email: str('NEXT_PUBLIC_EMAIL', 'info@gff.uz'),
    salesEmail: str('NEXT_PUBLIC_SALES_EMAIL', 'sales@gff.uz'),
    address: str(
      'NEXT_PUBLIC_ADDRESS',
      'Toshkent sh., Mirzo Ulug‘bek tumani, Mustaqillik shoh ko‘chasi 128',
    ),
    addressRu: str(
      'NEXT_PUBLIC_ADDRESS_RU',
      'г. Ташкент, Мирзо-Улугбекский район, проспект Мустакиллик 128',
    ),
    addressEn: str(
      'NEXT_PUBLIC_ADDRESS_EN',
      '128 Mustaqillik Ave., Mirzo Ulugbek district, Tashkent, Uzbekistan',
    ),
    hours: str('NEXT_PUBLIC_WORK_HOURS', 'Du–Ju 09:00–18:00, Sha 10:00–15:00'),
    hqAddress: 'P.O. Box 18129, Jebel Ali Free Zone, Dubai, United Arab Emirates',
    hqPhone: '+97148833923',
    hqEmail: 'enquiry@gff.co.ae',
    mapsQuery: encodeURIComponent(str('NEXT_PUBLIC_ADDRESS', 'Tashkent, Mustaqillik 128')),
    lat: 41.3111,
    lng: 69.3404,
  },

  social: {
    telegram: str('NEXT_PUBLIC_TELEGRAM_CHANNEL'),
    instagram: str('NEXT_PUBLIC_INSTAGRAM'),
    linkedin: str('NEXT_PUBLIC_LINKEDIN'),
    facebook: str('NEXT_PUBLIC_FACEBOOK'),
  },

  business: {
    /** Client komponentlar uchun NEXT_PUBLIC_ orqali ham o'qiladi */
    sampleBoxMaxItems: num('NEXT_PUBLIC_SAMPLE_BOX_MAX', num('SAMPLE_BOX_MAX_ITEMS', 8)),
    sampleMaxVolume: num('SAMPLE_MAX_VOLUME', 100),
    sampleMinVolume: num('SAMPLE_MIN_VOLUME', 25),
    sampleDeliveryDays: num('SAMPLE_DELIVERY_DAYS', 3),
    minOrderKg: num('MIN_ORDER_KG', 5),
    discountThresholdKg: num('DISCOUNT_THRESHOLD_KG', 100),
    responseMinutes: num('RESPONSE_MINUTES', 30),
    volumeDiscountPct: num('VOLUME_DISCOUNT_PCT', 10),
  },

  stats: {
    yearsExperience: new Date().getFullYear() - 2002,
    rawMaterials: 4000,
    exportCountries: 12,
    uzRegions: 14,
  },

  analytics: {
    ga4Id: str('NEXT_PUBLIC_GA4_ID'),
    yandexMetrikaId: str('NEXT_PUBLIC_YANDEX_METRIKA_ID'),
    turnstileSiteKey: str('NEXT_PUBLIC_TURNSTILE_SITE_KEY'),
  },

  /** Katalog PDF (agar bo'lmasa — tugma yashiriladi) */
  catalogPdf: str('NEXT_PUBLIC_CATALOG_PDF', '/files/GFF-catalog-2026.pdf'),

  seo: {
    defaultTitle: "GFF O‘zbekiston — oziq-ovqat aromatizatorlari va ingredientlar | Rasmiy distribyutor",
    titleTemplate: '%s — GFF O‘zbekiston',
    defaultDescription:
      'Gulf Flavours & Fragrances ning O‘zbekistondagi rasmiy va yagona distribyutori. 600+ oziq-ovqat aromatizatorlari, atir kompozitsiyalari, ingredientlar. Bepul test box, halol sertifikati, Toshkentdagi ombor.',
    ogImage: '/images/hero-lab.jpg',
    twitterHandle: str('NEXT_PUBLIC_TWITTER_HANDLE'),
    keywords: [
      'aromatizatorlar', 'oziq-ovqat aromatizatorlari', 'пищевые ароматизаторы',
      'GFF', 'Gulf Flavours', 'ingredientlar', 'пищевые добавки', 'atir kompozitsiyalari',
      'efir moylari', 'эссенциальные масла', 'halol aromatizator', 'vanil', 'Toshkent',
      'B2B yetkazib berish', 'test box', 'namuna',
    ],
  },
} as const;

/* ------------------------------------------------------------
   Server tomonidagi maxfiy sozlamalar
   ------------------------------------------------------------ */

export const serverConfig = {
  admin: {
    password: str('ADMIN_PASSWORD'),
    secret: str('ADMIN_SECRET'),
    cookieName: str('ADMIN_COOKIE_NAME', 'gff_admin'),
    sessionHours: num('ADMIN_SESSION_HOURS', 12),
    /** Standart parol o'rnatilmagan bo'lsa — panel bloklangan */
    get isConfigured(): boolean {
      return Boolean(this.password && this.secret && this.password !== "o'zgartiring-kuchli-parol");
    },
  },

  telegram: {
    botToken: str('TELEGRAM_BOT_TOKEN'),
    chatIds: str('TELEGRAM_CHAT_ID')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    topicId: str('TELEGRAM_TOPIC_ID'),
    get isEnabled(): boolean {
      return Boolean(this.botToken && this.chatIds.length);
    },
  },

  smtp: {
    host: str('SMTP_HOST'),
    port: num('SMTP_PORT', 587),
    secure: bool('SMTP_SECURE', false),
    user: str('SMTP_USER'),
    password: str('SMTP_PASSWORD'),
    from: str('SMTP_FROM', 'GFF Uzbekistan <no-reply@gff.uz>'),
    to: str('LEAD_EMAIL_TO')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    get isEnabled(): boolean {
      return Boolean(this.host && this.user && this.password && this.to.length);
    },
  },

  webhook: {
    url: str('LEAD_WEBHOOK_URL'),
    secret: str('LEAD_WEBHOOK_SECRET'),
    get isEnabled(): boolean {
      return Boolean(this.url);
    },
  },

  antispam: {
    turnstileSecret: str('TURNSTILE_SECRET_KEY'),
    get turnstileEnabled(): boolean {
      return Boolean(this.turnstileSecret && siteConfig.analytics.turnstileSiteKey);
    },
    rateLimitMax: num('RATE_LIMIT_MAX', 8),
    rateLimitWindowSec: num('RATE_LIMIT_WINDOW_SECONDS', 600),
    duplicateGuardSec: num('DUPLICATE_GUARD_SECONDS', 120),
  },

  storage: {
    driver: str('LEAD_STORAGE_DRIVER', 'file'),
    path: str('LEAD_STORAGE_PATH', './data/leads'),
  },

  isProduction: process.env.NODE_ENV === 'production',
} as const;

/** Lead yig'ish kanallari sozlanganmi (admin panelida ogohlantirish uchun) */
export function notificationChannels(): { telegram: boolean; email: boolean; webhook: boolean } {
  return {
    telegram: serverConfig.telegram.isEnabled,
    email: serverConfig.smtp.isEnabled,
    webhook: serverConfig.webhook.isEnabled,
  };
}
