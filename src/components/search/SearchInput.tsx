'use client';

/**
 * QIDIRUV MAYDONI (§5, design/Search.dc.html · SEARCH HEAD · §12)
 * ----------------------------------------------------------------
 * Katta oq kapsula (min-height 88px, radius 999): ikonka · `type="search"`
 * input (clamp 22→40px) · navy "tozalash" tugmasi (64px).
 *
 * Natija SERVERDA hisoblanadi: maydon URL'ni yangilaydi (`?q=`), shuning
 * uchun havola ulashiladi va indekslanadi (§13). Debounce 320ms — har
 * harfda serverga so'rov ketmaydi.
 *
 * "Ko'p qidiriladi" chip'lari — eng ko'p mahsulotli guruh/soha nomlari
 * (server ma'lumotdan yig'ib beradi, §7.1).
 */

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const DEBOUNCE = 320;

export function SearchInput({
  initialQuery,
  resultsCount,
  labels,
  popular,
  className,
}: {
  initialQuery: string;
  /** analytics `search` hodisasi uchun natijalar soni (serverdan) */
  resultsCount: number;
  labels: {
    aria: string;
    placeholder: string;
    clear: string;
    popular: string;
  };
  popular: { label: string; q: string }[];
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const [value, setValue] = useState(initialQuery);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tracked = useRef(initialQuery);

  /**
   * Boshqa joydan (masalan header) kelganda maydonni yangilash.
   * Effect ichida `setState` (react-hooks/set-state-in-effect) o'rniga
   * React'ning "render paytida moslashtirish" patterni — natija bir xil,
   * kaskad render yo'q.
   */
  const [prevQuery, setPrevQuery] = useState(initialQuery);
  if (initialQuery !== prevQuery) {
    setPrevQuery(initialQuery);
    setValue(initialQuery);
  }

  // Analytics-dedupe ref'ini RENDER ichida yozib bo'lmaydi
  // (react-hooks/refs) — effect ichida yangilanadi.
  useEffect(() => {
    tracked.current = initialQuery;
  }, [initialQuery]);

  const push = useCallback(
    (q: string, immediate = false) => {
      const next = new URLSearchParams(params.toString());
      if (q.trim()) next.set('q', q.trim());
      else next.delete('q');
      next.delete('page');

      const run = () => startTransition(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
      if (immediate) run();
      else {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(run, DEBOUNCE);
      }
    },
    [params, pathname, router],
  );

  const onChange = useCallback(
    (q: string) => {
      setValue(q);
      push(q);
    },
    [push],
  );

  const onBlur = useCallback(() => {
    const q = value.trim();
    // analytics — faqat haqiqatan yangi so'rov (§12: `search`)
    if (q.length >= 2 && q !== tracked.current) {
      tracked.current = q;
      track.search(q, resultsCount);
    }
  }, [value, resultsCount]);

  const pick = useCallback(
    (q: string) => {
      setValue(q);
      tracked.current = q;
      track.search(q, resultsCount);
      push(q, true);
    },
    [push, resultsCount],
  );

  const clear = useCallback(() => {
    setValue('');
    tracked.current = '';
    push('', true);
  }, [push]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <div className={cn('flex flex-col gap-7', className)}>
      <label className="flex min-h-[88px] items-center gap-4 rounded-pill bg-white py-0 pl-[clamp(20px,2.2vw,32px)] pr-3">
        <Search size={28} strokeWidth={1.8} className="shrink-0 text-muted" aria-hidden />
        <span className="sr-only">{labels.aria}</span>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (timer.current) clearTimeout(timer.current);
              push(value, true);
            }
            if (e.key === 'Escape' && value) clear();
          }}
          placeholder={labels.placeholder}
          autoComplete="off"
          className="min-w-0 flex-grow border-0 bg-transparent text-[clamp(22px,2.6vw,40px)] font-normal tracking-[-0.02em] text-ink outline-none placeholder:text-muted/70 [&::-webkit-search-cancel-button]:hidden"
        />
        {value ? (
          <button
            type="button"
            onClick={clear}
            aria-label={labels.clear}
            className="btn-icon btn-icon--navy h-16 w-16 shrink-0"
          >
            <X size={20} strokeWidth={2} aria-hidden />
          </button>
        ) : null}
      </label>

      {popular.length ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1.5 text-[14px] text-muted">{labels.popular}</span>
          {popular.map((p) => (
            <button
              key={p.q}
              type="button"
              onClick={() => pick(p.q)}
              aria-pressed={value.trim().toLowerCase() === p.q.toLowerCase()}
              className={cn(
                'h-10 rounded-pill border bg-white px-4 text-[14px] font-medium transition-colors',
                value.trim().toLowerCase() === p.q.toLowerCase()
                  ? 'border-ink bg-navy text-white'
                  : 'border-line text-ink hover:border-ink',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
