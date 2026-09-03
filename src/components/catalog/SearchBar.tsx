'use client';

/**
 * QIDIRUV MAYDONI + AVTOTO'LDIRISH
 * ----------------------------------------------------------------
 * - 220 ms debounce → har bir belgi uchun so'rov yuborilmaydi
 * - Takliflar `/api/suggest` dan (server katalog bo'yicha izlaydi)
 * - Klaviatura bilan boshqarish: ↑ ↓ Enter Esc (to'liq a11y)
 * - Bo'sh natijada "balki shu so'zmi?" taklifi ko'rsatiladi
 * - Kirill harflarida yozsa ham ishlaydi (search.ts transliteratsiya qiladi)
 */

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { cn, debounce } from '@/lib/utils';
import { useI18n } from '@/components/i18n/I18nProvider';
import { track } from '@/lib/analytics';
import { Icon } from '@/components/ui/Icon';
import { Spinner } from '@/components/ui/Button';

interface Suggestion {
  sku: string;
  slug: string;
  name: string;
  category: string;
  group: string;
  color: string;
}

interface Props {
  value: string;
  locale: string;
  /** So'rov yuborilganda (URL yangilanadi) */
  onSubmit: (q: string) => void;
  placeholder: string;
  productHrefBase: string;
  /** "Balki shu so'z?" taklifi (server hisoblagan) */
  correction?: string | null;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  locale,
  onSubmit,
  placeholder,
  productHrefBase,
  correction,
  className,
  autoFocus,
}: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [draft, setDraft] = useState(value);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const [, startTransition] = useTransition();

  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const reqId = useRef(0);

  // Tashqi qiymat o'zgarsa (mas. "tozalash") — maydonni RENDER paytida
  // moslaymiz (React'ning "adjusting state when props change" naqshi).
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    setDraft(value);
  }

  /* ---- Avtoto'ldirish so'rovi ---- */
  // debounce() render paytida chaqiriladi, lekin ref faqat ASYNC callback
  // ichida o'qiladi (so'rovlar tartibini nazorat qilish uchun) — xavfsiz.
  // eslint-disable-next-line react-hooks/refs
  const fetchSuggestions = debounce((q: string) => {
    const id = ++reqId.current;
    if (q.trim().length < 2) {
      setItems([]);
      setBusy(false);
      return;
    }
    setBusy(true);
    fetch(`/api/suggest?q=${encodeURIComponent(q)}&lang=${locale}&limit=7`, {
      headers: { Accept: 'application/json' },
    })
      .then((r) => (r.ok ? r.json() : { ok: false }))
      .then((json) => {
        if (id !== reqId.current) return; // eskirgan javob
        setItems(Array.isArray(json?.data) ? json.data : []);
        setBusy(false);
      })
      .catch(() => {
        if (id !== reqId.current) return;
        setItems([]);
        setBusy(false);
      });
  }, 220);

  useEffect(() => {
    if (open) fetchSuggestions(draft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, open]);

  /* ---- Tashqariga bosilganda yopish ---- */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const commit = (q: string) => {
    setOpen(false);
    setCursor(-1);
    if (q.trim().length >= 2) {
      track.search(q, items.length);
    }
    startTransition(() => onSubmit(q.trim()));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (open) {
        e.stopPropagation();
        setOpen(false);
      }
      return;
    }
    if (e.key === 'ArrowDown' && items.length) {
      e.preventDefault();
      setOpen(true);
      setCursor((c) => (c + 1) % items.length);
      return;
    }
    if (e.key === 'ArrowUp' && items.length) {
      e.preventDefault();
      setCursor((c) => (c <= 0 ? items.length - 1 : c - 1));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (open && cursor >= 0 && items[cursor]) {
        const s = items[cursor];
        track.search(draft, 1);
        setOpen(false);
        router.push(`${productHrefBase}/${s.slug}`);
        return;
      }
      commit(draft);
    }
  };

  return (
    <div ref={box} className={cn('relative', className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          commit(draft);
        }}
        className="relative"
      >
        <Icon
          name="search"
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-warm-500"
        />
        <input
          ref={input}
          type="search"
          value={draft}
          autoFocus={autoFocus}
          autoComplete="off"
          role="combobox"
          aria-expanded={open && items.length > 0}
          aria-controls="catalog-suggestions"
          aria-autocomplete="list"
          aria-label={placeholder}
          placeholder={placeholder}
          maxLength={120}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setDraft(e.target.value);
            setOpen(true);
            setCursor(-1);
          }}
          onKeyDown={onKeyDown}
          className={cn(
            'h-12 w-full rounded-xl border border-cream-300 bg-white pr-24 pl-10 text-[15px] text-ink shadow-soft',
            'placeholder:text-slate-warm-500/70 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15',
          )}
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
          {busy ? <Spinner size={15} className="text-teal-600" /> : null}
          {draft ? (
            <button
              type="button"
              onClick={() => {
                setDraft('');
                setItems([]);
                input.current?.focus();
                commit('');
              }}
              aria-label={t('common.close')}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-warm-500 transition hover:bg-cream-100 hover:text-clay-600"
            >
              <Icon name="close" size={15} strokeWidth={2.2} />
            </button>
          ) : null}
          <button
            type="submit"
            className="hidden h-9 items-center rounded-lg bg-pine-800 px-3.5 text-[13px] font-bold text-white transition hover:bg-teal-600 sm:inline-flex"
          >
            {t('common.search')}
          </button>
        </div>
      </form>

      {/* ---- Takliflar ---- */}
      {open && (items.length > 0 || correction) ? (
        <div
          id="catalog-suggestions"
          role="listbox"
          className="animate-in-down absolute inset-x-0 top-full z-40 mt-1.5 overflow-hidden rounded-xl border border-cream-200 bg-white shadow-float"
        >
          {items.length > 0 ? (
            <ul className="max-h-[19rem] overflow-y-auto py-1">
              {items.map((s, i) => (
                <li key={s.sku} role="option" aria-selected={i === cursor}>
                  <a
                    href={`${productHrefBase}/${s.slug}`}
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 transition',
                      i === cursor ? 'bg-mint-50' : 'hover:bg-cream-50',
                    )}
                  >
                    <span className="h-8 w-1 shrink-0 rounded-full" style={{ backgroundColor: s.color }} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold text-pine-900">{s.name}</span>
                      <span className="block truncate text-[11.5px] text-slate-warm-500">
                        <span className="font-mono">{s.sku}</span> · {s.group.replace(/-/g, ' ')}
                      </span>
                    </span>
                    <Icon name="arrow-right" size={15} className="shrink-0 text-slate-warm-500" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

          {correction && correction.toLowerCase() !== draft.trim().toLowerCase() ? (
            <button
              type="button"
              onClick={() => {
                setDraft(correction);
                commit(correction);
              }}
              className="flex w-full items-center gap-2 border-t border-cream-200 bg-cream-50 px-3 py-2.5 text-left text-[13px] text-slate-warm-600 transition hover:bg-mint-50"
            >
              <Icon name="help" size={15} className="text-teal-600" />
              {t('catalog.didYouMean')}{' '}
              <span className="font-bold text-teal-600 underline decoration-teal-500/40 underline-offset-2">
                {correction}
              </span>
              ?
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default SearchBar;
