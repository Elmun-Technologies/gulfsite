/**
 * Server tomonida admin himoyasi — barcha admin sahifa va API'lar uchun.
 */

import { cookies } from 'next/headers';
import { AUTH_COOKIE, isAdminConfigured, verifySessionToken } from './auth';

export async function requireAdmin(): Promise<boolean> {
  if (!isAdminConfigured()) return false;
  const store = await cookies();
  return verifySessionToken(store.get(AUTH_COOKIE.name)?.value);
}

export { AUTH_COOKIE };
