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

  /** Katalog filtri qo'llandi */
  filterApply: (filters: Record<string, string | number | boolean | undefined>) => trackEvent('catalog_filter', filters),

  /** Qidiruv so'rovi */
  search: (term: string, results: number) => trackEvent('catalog_search', { search_term: term.slice(0, 60), results }),

  /** Mahsulot sahifasi ko'rildi */
  viewProduct: (sku: string, category: string) => trackEvent('view_item', { item_id: sku, item_category: category }),

  /** Test boxga qo'shildi */
  addToBox: (sku: string) => trackEvent('add_to_sample_box', { item_id: sku }),

  /** Box tozalandi */
  clearBox: (count: number) => trackEvent('clear_sample_box', { items: count }),

  /** PDF/hujjat so'rovi */
  docRequest: (doc: string, sku?: string) => trackEvent('request_document', { document: doc, item_id: sku }),

  /** Til almashtirildi */
  localeChange: (from: string, to: string) => trackEvent('change_locale', { from, to }),

  /** Tashqi havola (gulfflavours.ae va h.k.) */
  outbound: (url: string) => trackEvent('click_outbound', { url: url.slice(0, 120) }),

  /** CTA bosildi */
  cta: (id: string, location: string) => trackEvent('click_cta', { cta_id: id, location }),

  /** Forma xatosi — konversiyani yo'qotish nuqtalarini topish uchun */
  formError: (form: string, field?: string, code?: string) =>
    trackEvent('form_error', { form, field, code }),
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
