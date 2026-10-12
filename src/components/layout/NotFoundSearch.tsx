'use client';

/**
 * 404 QIDIRUV MAYDONI (§5, design/NotFound.dc.html)
 * ----------------------------------------------------------------
 * Kichik klient komponenti: `q` ni yig'adi va `/<locale>/search?q=` ga
 * o'tadi. Bo'sh 404 = yo'qotilgan lead, shuning uchun qidiruv shu yerda.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Search } from 'lucide-react';
import type { AppLocale } from '@/i18n';
import { track } from '@/lib/analytics';

export function NotFoundSearch({
  locale,
  labels,
}: {
  locale: AppLocale;
  labels: { title: string; placeholder: string; cta: string };
}) {
  const router = useRouter();
  const [q, setQ] = useState('');

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const term = q.trim();
    if (!term) return;
    track.search(term, 0);
    router.push(`/${locale}/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <form onSubmit={submit} className="flex flex-wrap gap-2.5">
      <label className="flex h-14 min-w-0 flex-1 basis-[240px] items-center gap-3 rounded-pill bg-white px-6">
        <Search size={20} strokeWidth={1.8} className="shrink-0 text-muted" aria-hidden />
        <span className="sr-only">{labels.title}</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={labels.placeholder}
          className="min-w-0 flex-1 border-0 bg-transparent text-[16px] text-ink outline-none placeholder:text-muted/70 [&::-webkit-search-cancel-button]:hidden"
        />
      </label>
      <button type="submit" className="btn btn--accent btn--lg shrink-0">
        {labels.cta}
        <ArrowUpRight size={18} aria-hidden />
      </button>
    </form>
  );
}
