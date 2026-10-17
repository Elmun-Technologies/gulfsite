'use client';

/** PDF yuklab olish havolasi — `brochure_download` hodisasi bilan (server komponentdan onClick uzatib bo'lmaydi) */

import type { ReactNode } from 'react';
import { track } from '@/lib/analytics';

export function BrochureDownload({
  href,
  lang,
  source,
  className,
  children,
}: {
  href: string;
  lang: string;
  source: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} download onClick={() => track.brochureDownload(lang, source)} className={className}>
      {children}
    </a>
  );
}
