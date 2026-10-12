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

  /**
   * ALOQA — GFF_CLAUDE_CODE_PROMPT.md §15 dagi qiymatlar.
   * .env orqali o'zgartirish mumkin, lekin standart qiymatlar mijoz
   * bergan rasmiy kontaktlar.
   *
   * ✔ E-mail tasdiqlandi (mijoz qarori, 2026-10-12): "info@gulfflavour.uz".
   *   Avvalgi "info@gulfflovour.uz" yozuvi xato bo'lgan — TODO yopildi.
   */
  contact: {
    phonePrimary: str('NEXT_PUBLIC_PHONE_PRIMARY', '+998 97 570 77 60'),
    phoneSecondary: str('NEXT_PUBLIC_PHONE_SECONDARY', ''),
    phonePrimaryHref: `tel:${str('NEXT_PUBLIC_PHONE_PRIMARY', '+998 97 570 77 60').replace(/[^\d+]/g, '')}`,
    phoneSecondaryHref: `tel:${str('NEXT_PUBLIC_PHONE_SECONDARY', '').replace(/[^\d+]/g, '')}`,
    email: str('NEXT_PUBLIC_EMAIL', 'info@gulfflavour.uz'),
    salesEmail: str('NEXT_PUBLIC_SALES_EMAIL', 'info@gulfflavour.uz'),
    address: str(
      'NEXT_PUBLIC_ADDRESS',
      'Toshkent, Mirzo Ulug‘bek tumani, Mustaqillik shoh ko‘chasi, 128',
    ),
    addressRu: str(
      'NEXT_PUBLIC_ADDRESS_RU',
      'Ташкент, Мирзо-Улугбекский район, проспект Мустакиллик, 128',
    ),
    addressEn: str(
      'NEXT_PUBLIC_ADDRESS_EN',
      '128 Mustaqillik Ave., Mirzo Ulugbek district, Tashkent',
    ),
    /** Ish vaqti alohida qismlarda — formatlash dictionary orqali */
    hoursWeekFrom: str('NEXT_PUBLIC_HOURS_WEEK_FROM', '09:00'),
    hoursWeekTo: str('NEXT_PUBLIC_HOURS_WEEK_TO', '18:00'),
    hoursSatFrom: str('NEXT_PUBLIC_HOURS_SAT_FROM', '10:00'),
    hoursSatTo: str('NEXT_PUBLIC_HOURS_SAT_TO', '15:00'),
    hours: str('NEXT_PUBLIC_WORK_HOURS', 'Du–Ju 09:00–18:00, Sha 10:00–15:00'),
    hqAddress: 'P.O. Box 18129, Jebel Ali Free Zone, Dubai, United Arab Emirates',
    hqAddressShort: 'P.O. Box 18129, Jebel Ali Free Zone, Dubay, BAA',
    hqPhone: '+97148833923',
    hqPhoneLabel: '+971 4 883 3923',
    /**
     * ⚠ Brief §15 da HQ e-maili BERILMAGAN (faqat manzil va +971 4 883 3923).
     * Shuning uchun standart qiymat BO'SH — to'qilgan manzil ko'rsatilmaydi.
     * Mijoz bergach `NEXT_PUBLIC_HQ_EMAIL` orqali yoqiladi.
     */
    hqEmail: str('NEXT_PUBLIC_HQ_EMAIL', ''),
    mapsQuery: encodeURIComponent(
      str('NEXT_PUBLIC_ADDRESS', 'Tashkent, Mirzo Ulugbek district, Mustaqillik 128'),
    ),
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      str('NEXT_PUBLIC_ADDRESS', 'Tashkent, Mirzo Ulugbek district, Mustaqillik 128'),
    )}`,
    lat: 41.3111,
    lng: 69.3404,
  },

  social: {
    telegram: str('NEXT_PUBLIC_TELEGRAM', 'https://t.me/GFF_uzb'),
    telegramHandle: str('NEXT_PUBLIC_TELEGRAM_HANDLE', '@GFF_uzb'),
    instagram: str('NEXT_PUBLIC_INSTAGRAM', 'https://instagram.com/gulfflavour.uz'),
    instagramHandle: str('NEXT_PUBLIC_INSTAGRAM_HANDLE', '@gulfflavour.uz'),
    linkedin: str('NEXT_PUBLIC_LINKEDIN'),
    facebook: str('NEXT_PUBLIC_FACEBOOK'),
    /** Ota-brend sayti (sameAs, JSON-LD) */
    parent: str('NEXT_PUBLIC_PARENT_SITE', 'https://gulfflavours.ae'),
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
    founded: 2002,
    yearsExperience: new Date().getFullYear() - 2002,
    /** dizayn: "4000+ xomashyo bazasi" */
    rawMaterials: 4000,
    exportCountries: 12,
    uzRegions: 14,
    /**
     * ⚠ Soha yo'nalishlari soni BU YERDA saqlanmaydi: dizayn "14" deb
     * yozgan, ammo haqiqiy katalogda 18 ta yo'nalishda mahsulot bor.
     * §7.1 — sonlar MA'LUMOTDAN hisoblanadi:
     * `lib/design.ts → industriesWithData(locale).length`.
     */
  },

  analytics: {
    /** GTM konteyneri — GA4 va Meta Pixel shu orqali ulanadi (§12) */
    gtmId: str('NEXT_PUBLIC_GTM_ID'),
    ga4Id: str('NEXT_PUBLIC_GA4_ID'),
    yandexMetrikaId: str('NEXT_PUBLIC_YANDEX_METRIKA_ID'),
    turnstileSiteKey: str('NEXT_PUBLIC_TURNSTILE_SITE_KEY'),
  },

  /**
   * Katalog PDF va ishlab chiqarish videosi (§15 TODO).
   * Bo'sh yoki fayl mavjud bo'lmasa — tugma UMUMAN ko'rsatilmaydi
   * (`publicAssetExists` orqali tekshiriladi). O'lik havola yo'q.
   */
  catalogPdf: str('NEXT_PUBLIC_CATALOG_PDF', ''),
  productionVideo: str('NEXT_PUBLIC_PRODUCTION_VIDEO', ''),

  seo: {
    defaultTitle: "GFF O‘zbekiston — oziq-ovqat aromatizatorlari va ingredientlar | Rasmiy distribyutor",
    titleTemplate: '%s — GFF O‘zbekiston',
    defaultDescription:
      'Gulf Flavours & Fragrances ning O‘zbekistondagi rasmiy va yagona distribyutori. 600+ oziq-ovqat aromatizatorlari, atir kompozitsiyalari, ingredientlar. Bepul test box, halol sertifikati, Toshkentdagi ombor.',
    ogImage: '/images/og-home.jpg', // 1200×630 — buildMetadata shu o'lchamni e'lon qiladi
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
    /**
     * Yuboruvchi manzili. Standart — tasdiqlangan kontakt e-maili (§15);
     * to'qilgan domen (no-reply@gff.uz) ISHLATILMAYDI, chunki SPF/DKIM
     * bo'lmasa xatlar spam'ga tushadi. Real domen bilan almashtiring.
     */
    from: str('SMTP_FROM', `GFF Uzbekistan <${str('NEXT_PUBLIC_EMAIL', 'info@gulfflavour.uz')}>`),
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
    /** §11.2: bir IP dan 5 ta so'rov / 10 minut (600 s). */
    rateLimitMax: num('RATE_LIMIT_MAX', 5),
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
