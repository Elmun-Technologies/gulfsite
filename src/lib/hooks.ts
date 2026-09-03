'use client';

/**
 * UMUMIY HOOKLAR
 * ----------------------------------------------------------------
 * `useHydrated()` — "komponent brauzerda gidratsiya bo'ldimi?" bayrog'i.
 *
 * Nega oddiy `useState(false) + useEffect(() => setMounted(true))` emas?
 * React 19 + yangi react-hooks qoidalari effect ichida SINXRON setState ni
 * "cascading render" deb hisoblaydi. useSyncExternalStore esa aynan shu
 * vazifa uchun mo'ljallangan: server snapshot = false, client snapshot = true.
 * Gidratsiya paytida mos kelmaslik (hydration mismatch) bo'lmaydi.
 */

import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};
const getServerSnapshot = () => false;
const getClientSnapshot = () => true;

export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, getClientSnapshot, getServerSnapshot);
}
