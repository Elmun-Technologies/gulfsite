/**
 * KONTAKT HAVOLALARI (klient uchun xavfsiz — node:fs yo'q)
 * ----------------------------------------------------------------
 * Har bir telefon raqamidan uchta havola yasaladi:
 *   tel:+998975707760           — qo'ng'iroq
 *   https://wa.me/998975707760  — WhatsApp (faqat raqamlar, + siz)
 *   https://t.me/+998975707760  — Telegram (raqam bo'yicha profil)
 */

export interface ContactPerson {
  /** 'director' — rahbariyat, 'sales' — sotuv menejeri */
  role: 'director' | 'sales';
  /** ixtiyoriy ism (bo'sh bo'lsa faqat lavozim ko'rsatiladi) */
  name: string;
  /** ko'rinadigan format: +998 97 570 77 60 */
  phone: string;
  whatsapp: boolean;
  telegram: boolean;
}

export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function telHref(phone: string): string {
  return `tel:+${phoneDigits(phone)}`;
}

export function whatsappHref(phone: string, text?: string): string {
  const q = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${phoneDigits(phone)}${q}`;
}

export function telegramHref(phone: string): string {
  return `https://t.me/+${phoneDigits(phone)}`;
}

/** +998975707760 → +998 97 570 77 60 (O'zbekiston formati; boshqasi o'zgarmaydi) */
export function formatPhone(phone: string): string {
  const d = phoneDigits(phone);
  if (d.length === 12 && d.startsWith('998')) {
    return `+998 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10, 12)}`;
  }
  return phone.trim();
}
