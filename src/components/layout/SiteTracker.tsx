'use client';

/**
 * SAHIFA KO'RISHLARINI YOZISH — o'z analitikamiz (admin panel → Analitika)
 * Klient navigatsiyasida ham ishlaydi (usePathname). Render qilmaydi.
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { fpInit, fpPageview } from '@/lib/fp-tracker';

export function SiteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    fpInit();
  }, []);

  useEffect(() => {
    if (!pathname) return;
    // sarlavha yangi sahifa metadata'si bilan yangilanishi uchun bir kadr kutamiz
    const id = window.setTimeout(() => fpPageview(pathname, document.title), 50);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
