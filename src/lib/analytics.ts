'use client';

/**
 * ANALITIKA — lead konversiyasini kuzatish
 * ----------------------------------------------------------------
 * GA4 (gtag/dataLayer) va Yandex.Metrika bir vaqtda qo'llab-quvvatlanadi.
 * Skript yo'q bo'lsa (dev yoki sozlanmagan) — hech narsa qilmaydi, xato bermaydi.
 *
 * Muhim: shaxsiy ma'lumot (telefon, e-mail, ism) hech qachon yuborilmaydi —
 * faqat hodisa nomi va agregat parametrlar. Bu "Shaxsiy ma'lumotlar to'g'risida"gi
 * O'zbekiston Respublikasi Qonuniga muvofiq.
 */

type Win = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  ym?: (id: number, action: string, ...args: unknown[]) => void;
};

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID ?? '';
const YM_ID = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID ?? 0) || 0;

function win(): Win | null {
  return typeof window === 'undefined' ? null : (window as Win);
}

/** Umumiy hodisa yuborish */
export function trackEvent(name: string, params: Record<string, string | number | boolean | undefined> = {}) {
  const w = win();
  if (!w) return;

  // Noma'lum qiymatlarni tozalaymiz
  const clean: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') clean[k] = v;
  }

  try {
    if (GA_ID) {
      w.dataLayer = w.dataLayer ?? [];
      w.dataLayer.push({ event: name, ...clean });
      w.gtag?.('event', name, clean);
    }
    if (YM_ID) {
      w.ym?.(YM_ID, 'reachGoal', name, clean);
    }
  } catch {
    /* analitika hech qachon asosiy oqimni buzmasligi kerak */
  }
}

/* ---------- Standart B2B lead hodisalari ---------- */

export const track = {
  /** Lead formasi muvaffaqiyatli yuborildi */
  leadSubmit: (type: string, ref?: string, extra: Record<string, string | number | boolean | undefined> = {}) =>
    trackEvent('generate_lead', { lead_type: type, lead_ref: ref, value: 1, currency: 'UZS', ...extra }),

  /** Test box yuborildi — eng issiq lead */
  sampleRequest: (count: number, ref?: string) =>
    trackEvent('request_sample', { items: count, lead_ref: ref, value: 2, currency: 'UZS' }),

  /** Narx so'rovi */
  quoteRequest: (ref?: string) => trackEvent('request_quote', { lead_ref: ref, value: 3, currency: 'UZS' }),

  /** Qo'ng'iroq qilindi */
  callClick: (source: string) => trackEvent('click_call', { source }),

  /** Telegram/WhatsApp ochildi */
  messengerClick: (channel: string, source: string) => trackEvent('click_messenger', { channel, source }),

  /** Katalog filtri qo'llandi (§12: `catalog_filter`, filtrlar JSON'da) */
  filterApply: (filters: Record<string, string | number | boolean | undefined>) =>
    trackEvent('catalog_filter', { filters: JSON.stringify(filters).slice(0, 500) }),

  /** Qidiruv so'rovi (§12: `search`) */
  search: (term: string, results: number) =>
    trackEvent('search', { query: term.slice(0, 60), results }),

  /** Mahsulot sahifasi ko'rildi */
  viewProduct: (sku: string, category: string) => trackEvent('view_item', { item_id: sku, item_category: category }),

  /** Test boxga qo'shildi */
  addToBox: (sku: string) => trackEvent('add_to_sample_box', { item_id: sku }),

  /** Box tozalandi */
  clearBox: (count: number) => trackEvent('clear_sample_box', { items: count }),

  /** PDF/hujjat so'rovi */
  docRequest: (doc: string, sku?: string) => trackEvent('request_document', { document: doc, item_id: sku }),

  /** Til almashtirildi (§12: `lang_switch`) */
  localeChange: (from: string, to: string) => trackEvent('lang_switch', { from, to }),

  /** Tashqi havola (gulfflavours.ae va h.k.) */
  outbound: (url: string) => trackEvent('click_outbound', { url: url.slice(0, 120) }),

  /** CTA bosildi */
  cta: (id: string, location: string) => trackEvent('click_cta', { cta_id: id, location }),

  /** Forma xatosi — konversiyani yo'qotish nuqtalarini topish uchun */
  formError: (form: string, field?: string, code?: string) =>
    trackEvent('form_error', { form, field, code }),

  /* ------------------------------------------------------------
     §12 TALAB QILINGAN dataLayer HODISALARI
     ------------------------------------------------------------
     Nomlar brief'dagidek — GTM trigger'lari shu nomlarga bog'lanadi.
     Eski metodlar yuqorida saqlangan (admin/eski chaqiruvlar uchun).
     ------------------------------------------------------------ */

  /** Namuna qutisiga qo'shildi */
  sampleAdd: (sku: string, source: string, size?: number) =>
    trackEvent('sample_add', { sku, source, size }),

  /** Namuna qutisidan olindi */
  sampleRemove: (sku: string, source: string) =>
    trackEvent('sample_remove', { sku, source }),

  /** Namuna hajmi o'zgartirildi (25/50/100 g) */
  sampleSize: (sku: string, size: number) => trackEvent('sample_size', { sku, size }),

  /** Tayyor to'plam qo'shildi */
  sampleSetAdd: (setId: string, count: number, source: string) =>
    trackEvent('sample_set_add', { set_id: setId, count, source }),

  /** Namuna qutisi arizasi yuborildi */
  sampleSubmit: (count: number, ref?: string) =>
    trackEvent('sample_submit', { count, lead_ref: ref, value: 2, currency: 'UZS' }),

  /** Har qanday lead formasi yuborildi */
  leadSubmitEvent: (type: string, ref?: string) =>
    trackEvent('lead_submit', { lead_type: type, lead_ref: ref, value: 1, currency: 'UZS' }),

  /** Telefon bosildi */
  phoneClick: (source: string, phone: string) =>
    trackEvent('phone_click', { source, phone }),

  /** Telegram bosildi */
  telegramClick: (source: string) => trackEvent('telegram_click', { source }),

  /** Instagram bosildi */
  instagramClick: (source: string) => trackEvent('instagram_click', { source }),

  /** E-mail bosildi */
  trackEmail: (source: string) => trackEvent('email_click', { source }),

  /** Hujjat yuklab olindi */
  docDownload: (doc: string, sku: string) =>
    trackEvent('doc_download', { document: doc, sku }),

  /** Ko'rinish almashdi: jadval ↔ kartochka */
  viewToggle: (view: 'table' | 'cards') => trackEvent('catalog_view_toggle', { view }),

  /** Sahifa almashdi (pagination) */
  pageChange: (page: number) => trackEvent('catalog_page', { page }),

  /** Til almashtirildi (§12 nomi) */
  langSwitch: (to: string, from: string) => trackEvent('lang_switch', { from, to }),

  /** Mahsulot ko'rinishi almashtirildi (gallery thumbs) */
  productGallery: (sku: string, index: number) =>
    trackEvent('product_gallery', { sku, index }),
};

/** Sahifa ko'rinishi (client navigatsiya uchun) */
export function trackPageView(url: string, title: string) {
  const w = win();
  if (!w) return;
  try {
    if (GA_ID) {
      w.dataLayer = w.dataLayer ?? [];
      w.dataLayer.push({ event: 'page_view', page_location: url, page_title: title });
    }
  } catch {
    /* ignore */
  }
}
