/**
 * ADMIN — TASHRIFLAR YO'LI (Metrika "Vebvizor"ning matnli muqobili)
 * ----------------------------------------------------------------
 * Har bir sessiya: qachon, qaysi qurilma, qayerdan keldi, qaysi
 * sahifalarni qaysi tartibda ko'rdi, nima bosdi, ariza yubordimi.
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { normalizeLocale } from '@/i18n';
import { requireAdmin } from '@/lib/guard';
import { adminCopy } from '@/lib/admin-copy';
import { resolvePeriod, shortDay } from '@/lib/admin-period';
import { buildReport, normPath } from '@/lib/analytics-store';
import { AdminCard, PageTitle, PeriodPicker } from '@/components/admin/AdminUi';
import { SessionCard } from '@/components/admin/SessionCard';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const PAGE_SIZE = 30;

export default async function AdminSessionsPage({ params, searchParams }: PageProps) {
  const { locale: raw } = await params;
  if (!(await requireAdmin())) redirect(`/${normalizeLocale(raw)}/admin/login`);
  const locale = normalizeLocale(raw);
  const c = adminCopy(locale);
  const sp = await searchParams;
  const period = resolvePeriod(sp);
  const onlyConverted = sp.c === '1';
  const src = typeof sp.src === 'string' ? sp.src : '';
  const pathFilter = typeof sp.path === 'string' ? sp.path : '';
  const page = Math.max(1, Math.floor(Number(sp.page) || 1));

  const r = buildReport(period.from, period.to, { sessionsLimit: 5000 });
  const filtered = r.sessionsList.filter(
    (s) =>
      (!onlyConverted || s.converted) &&
      (!src || s.source === src) &&
      (!pathFilter || s.pages.some((p) => normPath(p.path) === pathFilter)),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const list = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const base = `/${locale}/admin/analytics/sessions`;
  const periodQs: Record<string, string> = period.key === 'custom' ? { from: period.from, to: period.to } : { p: period.key };
  const keep = { ...periodQs, ...(onlyConverted ? { c: '1' } : {}), ...(src ? { src } : {}), ...(pathFilter ? { path: pathFilter } : {}) };
  const link = (patch: Record<string, string | null>) => {
    const q = new URLSearchParams(keep);
    for (const [k, v] of Object.entries(patch)) {
      if (v == null) q.delete(k);
      else q.set(k, v);
    }
    q.delete('page');
    if (patch.page) q.set('page', patch.page);
    return `${base}?${q.toString()}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title={c.tables.sessionsTitle} sub={`${shortDay(period.from)} — ${shortDay(period.to)} · ${filtered.length}`} />
      <PeriodPicker base={base} current={period.key} from={period.from} to={period.to} copy={c} extra={{ ...(onlyConverted ? { c: '1' } : {}), ...(src ? { src } : {}) }} />

      <div className="flex flex-wrap gap-1.5">
        <Link href={link({ c: null })} className={cn('rounded-[10px] border px-3 py-1.5 text-[12.5px] font-semibold', !onlyConverted ? 'border-navy bg-navy text-white' : 'border-line bg-white text-slate')}>
          {c.session.all}
        </Link>
        <Link href={link({ c: '1' })} className={cn('rounded-[10px] border px-3 py-1.5 text-[12.5px] font-semibold', onlyConverted ? 'border-navy bg-navy text-white' : 'border-line bg-white text-slate')}>
          {c.session.onlyConverted}
        </Link>
        <span className="mx-1 w-px bg-line" />
        {Object.entries(c.sources).map(([k, label]) => (
          <Link
            key={k}
            href={link({ src: src === k ? null : k })}
            className={cn('rounded-[10px] border px-3 py-1.5 text-[12.5px] font-semibold', src === k ? 'border-navy bg-navy text-white' : 'border-line bg-white text-slate')}
          >
            {label}
          </Link>
        ))}
        {pathFilter ? (
          <Link href={link({ path: null })} className="rounded-[10px] border border-navy bg-navy px-3 py-1.5 text-[12.5px] font-semibold text-white">
            {pathFilter} ✕
          </Link>
        ) : null}
      </div>

      {list.length ? (
        <div className="flex flex-col gap-3">
          {list.map((s) => (
            <SessionCard key={s.sid} session={s} locale={locale} copy={c} />
          ))}
        </div>
      ) : (
        <AdminCard>
          <p className="py-8 text-center text-[13px] text-muted">{c.tables.empty}</p>
        </AdminCard>
      )}

      {totalPages > 1 ? (
        <nav className="flex items-center justify-center gap-2 text-[13px]">
          {page > 1 ? (
            <Link href={link({ page: String(page - 1) })} className="rounded-[10px] border border-line bg-white px-3 py-1.5 font-semibold">
              ←
            </Link>
          ) : null}
          <span className="tabular-nums text-muted">
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={link({ page: String(page + 1) })} className="rounded-[10px] border border-line bg-white px-3 py-1.5 font-semibold">
              →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
