/**
 * Sayt alohida joyda (Vercel) bo'lsa — admin saqlaganda uni yangilash.
 * FRONTEND_URL + REVALIDATE_SECRET (ikkala tomonda bir xil) kerak.
 */
export async function notifyFrontend(): Promise<void> {
  const url = (process.env.FRONTEND_URL ?? '').trim().replace(/\/+$/, '');
  const secret = (process.env.REVALIDATE_SECRET ?? '').trim();
  if (!url || !secret) return;
  try {
    const res = await fetch(`${url}/api/revalidate`, {
      method: 'POST',
      headers: { 'x-revalidate-secret': secret },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error('[frontend-sync] sayt yangilanmadi:', res.status);
  } catch (err) {
    console.error('[frontend-sync] sayt yangilanmadi:', String(err).slice(0, 200));
  }
}
