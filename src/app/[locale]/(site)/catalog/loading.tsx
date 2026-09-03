/**
 * KATALOG YUKLANISH HOLATI
 * ----------------------------------------------------------------
 * Filtr o'zgarishi serverga so'rov yuboradi. Bu skeleton foydalanuvchi
 * kutayotganini ko'rsatadi va "sahifa qotib qoldi" hissini yo'qotadi.
 * Tuzilishi haqiqiy sahifaga mos → kontent siljimaydi (CLS = 0).
 */

import { Skeleton, CardSkeleton } from '@/components/ui/Display';

export default function CatalogLoading() {
  return (
    <>
      <section className="border-b border-cream-200 bg-pine-950">
        <div className="container-x py-8 lg:py-10">
          <Skeleton className="h-3 w-40 bg-white/15" />
          <Skeleton className="mt-4 h-9 w-2/3 max-w-md bg-white/15" />
          <Skeleton className="mt-3 h-4 w-full max-w-xl bg-white/10" />
        </div>
      </section>

      <section className="container-x py-6 lg:py-9">
        <div className="flex flex-col gap-5 lg:flex-row lg:gap-7">
          {/* Yon ustun skeleti */}
          <aside className="hidden w-[17.5rem] shrink-0 lg:block">
            <div className="rounded-2xl border border-cream-200 bg-white p-3.5 shadow-soft">
              <Skeleton className="h-4 w-24" />
              <div className="mt-4 flex flex-col gap-2.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-4" />
                ))}
              </div>
              <Skeleton className="mt-5 h-4 w-28" />
              <div className="mt-3 flex flex-col gap-2.5">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-4" />
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <Skeleton className="h-12 w-full" rounded="lg" />
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-10 w-32" rounded="lg" />
              <Skeleton className="h-10 w-44" rounded="lg" />
              <Skeleton className="h-10 w-20" rounded="lg" />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3" aria-hidden>
              {Array.from({ length: 9 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
