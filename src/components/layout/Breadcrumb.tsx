/**
 * BREADCRUMB (server komponent)
 * ----------------------------------------------------------------
 * Qidiruv tizimlari uchun muhim: yo'l ko'rsatiladi va JSON-LD
 * BreadcrumbList bilan bog'lanadi. Mobilda gorizontal scroll.
 */

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('no-scrollbar -mx-1 overflow-x-auto px-1', className)}>
      <ol className="flex items-center gap-1 text-[12px] whitespace-nowrap">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1">
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className="rounded text-slate-warm-600 transition hover:text-teal-600 hover:underline hover:decoration-teal-500/40 hover:underline-offset-2"
                >
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={cn(last ? 'font-semibold text-pine-800' : 'text-slate-warm-600')}>
                  {c.label}
                </span>
              )}
              {!last ? <Icon name="chevron-right" size={12} className="text-slate-warm-400" aria-hidden /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
