/**
 * KATALOG YUKLANISH HOLATI (§4.4, §8.8 — CLS 0)
 * ----------------------------------------------------------------
 * Filtr/sahifa o'zgarishi serverga so'rov yuboradi. Bu skeleton
 * haqiqiy sahifa tuzilishiga mos (head panel · yon ustun · kartochka
 * grid'i), shuning uchun kontent siljimaydi.
 *
 * Rang/animatsiya: `.skeleton` — tekis panel foni + opacity puls
 * (§17: gradient yo'q; §8.9: reduced-motion'da animatsiya o'chadi).
 */

function Bar({ className }: { className: string }) {
  return <span aria-hidden className={`skeleton block rounded-pill ${className}`} />;
}

export default function CatalogLoading() {
  return (
    <div className="flex flex-col" role="status" aria-busy="true">
      <span className="sr-only">Yuklanmoqda…</span>

      {/* ---- HEAD panel ---- */}
      <div className="container-page pt-2">
        <div className="flex flex-col gap-5 rounded-block bg-panel p-[clamp(28px,4vw,56px)]">
          <Bar className="h-3 w-40" />
          <Bar className="h-[clamp(32px,4vw,56px)] w-full max-w-[560px]" />
          <Bar className="h-4 w-full max-w-[720px]" />
          <div className="flex flex-wrap gap-2">
            <Bar className="h-10 w-32" />
            <Bar className="h-10 w-44" />
            <Bar className="h-10 w-24" />
          </div>
        </div>
      </div>

      {/* ---- FILTER + GRID ---- */}
      <div className="container-page flex flex-wrap items-start gap-3 py-3">
        <aside className="hidden min-w-0 flex-1 basis-[260px] flex-col gap-4 rounded-card border border-line bg-white p-5 tab:flex">
          <Bar className="h-4 w-24" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Bar key={i} className="h-4" />
          ))}
          <Bar className="mt-3 h-4 w-28" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Bar key={`g${i}`} className="h-4" />
          ))}
        </aside>

        <div className="flex min-w-0 flex-[3_1_640px] flex-col gap-3">
          {/* kategoriya tab'lari */}
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <Bar key={i} className="h-12 w-[168px] shrink-0" />
            ))}
          </div>

          {/* kartochkalar */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-3" aria-hidden>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-card border border-line bg-white p-0">
                <span className="skeleton media-frame block aspect-[4/3] w-full rounded-card" />
                <span className="flex flex-col gap-2 px-5 pb-5">
                  <Bar className="h-3 w-20" />
                  <Bar className="h-5 w-4/5" />
                  <Bar className="h-4 w-3/5" />
                  <div className="mt-1 flex gap-2">
                    <Bar className="h-8 w-20" />
                    <Bar className="h-8 w-24" />
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
