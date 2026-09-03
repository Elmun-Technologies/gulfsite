/**
 * CHOP ETISH TUGMASI
 * ----------------------------------------------------------------
 * Server komponentlarda `onClick` ishlatib bo'lmaydi, shuning uchun
 * bu kichik klient komponent ajratib olingan. Huquqiy hujjatlar
 * (privacy/terms) va mahsulot sahifasida ishlatiladi — B2B mijozlar
 * hujjatni ichki jamoasiga yuborishi uchun qulay.
 */

'use client';

import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

interface PrintButtonProps {
  label: string;
  className?: string;
}

export function PrintButton({ label, className }: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-xl border border-pine-800/20 bg-white px-4 text-[13.5px] font-bold text-pine-800 transition hover:border-teal-500 hover:text-teal-600 print:hidden',
        className,
      )}
    >
      <Icon name="printer" size={16} />
      {label}
    </button>
  );
}
