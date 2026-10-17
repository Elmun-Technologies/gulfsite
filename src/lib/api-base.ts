/**
 * API MANZILI (klient va server uchun xavfsiz)
 * ----------------------------------------------------------------
 * Ikki xil joylashtirish:
 *   · bitta server (fly/Docker) — NEXT_PUBLIC_API_URL bo'sh, so'rovlar
 *     shu domenga (`/api/...`);
 *   · Vercel (sayt) + fly (backend) — NEXT_PUBLIC_API_URL=https://<fly>,
 *     brauzer arizalar va analitikani to'g'ridan-to'g'ri fly'ga yuboradi
 *     (CORS ruxsat etilgan). Shunda fly mijozning HAQIQIY IP manzilini
 *     ko'radi (rate limit to'g'ri ishlaydi) va ma'lumot fly volume'ida qoladi.
 */
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? '').trim().replace(/\/+$/, '');

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}
