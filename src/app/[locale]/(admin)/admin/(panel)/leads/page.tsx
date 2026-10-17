/**
 * ADMIN — ARIZALAR RO'YXATI
 * ----------------------------------------------------------------
 * Server komponent: filtrlar URL'dan o'qiladi va `listLeads()` ga
 * uzatiladi (API chaqiruvi yo'q — ma'lumot to'g'ridan-to'g'ri store'dan).
 * Filtr paneli esa klient komponent: u URL'ni yangilaydi, sahifa esa
 * server tomonida qayta render bo'ladi. Bu yondashuv:
 *   - havola almashish/xatcho'p imkonini beradi
 *   - JS ishlamasa ham filtr ishlaydi (form fallback)
 *   - katta ro'yxatlar uchun klient bundle'ni kichik saqlaydi
 */

import { requireAdmin } from '@/lib/guard';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { makeT, normalizeLocale } from '@/i18n';
import { listLeads } from '@/lib/leads/store';
import { LEAD_TYPES, tr, type Locale } from '@/lib/taxonomy';
import type { LeadStatusId } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { LeadsFilterBar } from '@/components/admin/LeadsFilterBar';
import { LeadQuality, LeadStatusBadge } from '@/components/admin/LeadBits';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = 'force-dynamic';

const VALID_STATUSES: LeadStatusId[] = [
  'new', 'contacted', 'qualified', 'sample_sent', 'proposal', 'won', 'lost', 'spam',
];

/** searchParams qiymatini string[] ga aylantirish (yagona mantiq) */
function toList(v: string | string[] | undefined): string[] {
  if (!v) return [];
  const arr = Array.isArray(v) ? v : v.split(',');
  return arr.map((s) => s.trim()).filter(Boolean);
}

function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? '') : (v ?? '');
}

export default async function AdminLeadsPage({ params, searchParams }: PageProps) {
  const { locale: raw } = await params;
  // Layout qisman (RSC) navigatsiyada qayta render bo'lmaydi — himoya sahifaning o'zida ham
  if (!(await requireAdmin())) redirect(`/${normalizeLocale(raw)}/admin/login`);
  const locale = normalizeLocale(raw);
  const L = locale as Locale;
  const t = makeT(locale);
  const sp = await searchParams;

  const q = toStr(sp.q).slice(0, 120);
  const status = toList(sp.status).filter((s) => VALID_STATUSES.includes(s as LeadStatusId)) as LeadStatusId[];
  const type = toList(sp.type);
  const region = toList(sp.region);
  const period = ['today', '7d', '30d'].includes(toStr(sp.period)) ? toStr(sp.period) : '';
  const sortRaw = toStr(sp.sort);
  const sort = (['newest', 'oldest', 'quality'] as const).includes(sortRaw as 'newest')
    ? (sortRaw as 'newest' | 'oldest' | 'quality')
    : 'newest';
  const page = Math.max(1, Number(toStr(sp.page)) || 1);
  const pageSize = 25;

  // Server komponent: davr oynasi (bugun/7 kun/30 kun) so'rov vaqtida hisoblanadi.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const from =
    period === 'today'
      ? new Date(now - 86400000).toISOString()
      : period === '7d'
        ? new Date(now - 7 * 86400000).toISOString()
        : period === '30d'
          ? new Date(now - 30 * 86400000).toISOString()
          : undefined;

  const result = listLeads({ q, status, type, region, from, sort, page, pageSize });
  const basePath = `/${locale}/admin/leads`;

  /** Sahifa havolasi — joriy filtrlarni saqlab qoladi */
  const pageHref = (p: number) => {
    const usp = new URLSearchParams();
    if (q) usp.set('q', q);
    if (status.length) usp.set('status', status.join(','));
    if (type.length) usp.set('type', type.join(','));
    if (region.length) usp.set('region', region.join(','));
    if (period) usp.set('period', period);
    if (sort !== 'newest') usp.set('sort', sort);
    if (p > 1) usp.set('page', String(p));
    const s = usp.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[clamp(1.6rem,3vw,2.2rem)] font-normal tracking-[-0.02em] text-ink">
            {t('admin.leads.title')}
          </h1>
          <p className="mt-1 text-[13px] text-muted">
            {result.total} {t('common.results')} · {t(`admin.leads.period.${period || 'all'}` as 'admin.leads.period.all')}
          </p>
        </div>
      </header>

      <LeadsFilterBar locale={L} total={result.total} />

      {/* ================= JADVAL ================= */}
      <section className="overflow-hidden rounded-[20px] border border-line-soft bg-white">
        {result.items.length === 0 ? (
          <div className="px-4 py-14 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[20px] bg-panel text-muted" aria-hidden>
              <Icon name="search" size={22} />
            </span>
            <p className="mt-3.5 text-[14px] font-bold text-ink">{t('admin.leads.noResults')}</p>
            <p className="mx-auto mt-1 max-w-sm text-[12.5px] text-muted">{t('admin.leads.noResultsHint')}</p>
            <Link
              href={basePath}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-[20px] bg-navy px-4 text-[13px] font-bold text-white transition hover:bg-ink"
            >
              <Icon name="refresh" size={15} />
              {t('catalog.resetAll')}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line-soft bg-panel/50">
                  {(['ref', 'date', 'type', 'contact', 'company', 'region', 'products', 'status'] as const).map((k) => (
                    <th
                      key={k}
                      scope="col"
                      className="px-3 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.1em] whitespace-nowrap text-muted"
                    >
                      {t(`admin.leads.columns.${k}` as 'admin.leads.columns.ref')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.items.map((l) => {
                  const products = l.request.products ?? [];
                  return (
                    <tr key={l.id} className="border-b border-line-soft align-top transition last:border-0 hover:bg-panel/60">
                      <td className="px-3 py-3">
                        <Link
                          href={`/${locale}/admin/leads/${l.id}`}
                          className="font-mono text-[11.5px] font-bold text-copper-dark transition hover:text-ink hover:underline"
                        >
                          {l.ref}
                        </Link>
                        <span className="mt-1 block">
                          <LeadQuality lead={l} locale={L} />
                        </span>
                      </td>
                      <td className="px-3 py-3 font-mono text-[11.5px] whitespace-nowrap text-muted">
                        {formatDateTime(l.createdAt, locale)}
                      </td>
                      <td className="px-3 py-3 text-[12px] font-semibold whitespace-nowrap text-slate">
                        {tr(LEAD_TYPES[l.type as keyof typeof LEAD_TYPES]?.name, L, l.type)}
                      </td>
                      <td className="px-3 py-3">
                        <span className="block max-w-[13rem] truncate text-[12.5px] font-bold text-ink">
                          {l.contact.fullName}
                        </span>
                        <a
                          href={`tel:${l.contact.phone.replace(/\D/g, '')}`}
                          className="block font-mono text-[11.5px] whitespace-nowrap text-copper-dark transition hover:underline"
                        >
                          {l.contact.phone}
                        </a>
                        {l.contact.email ? (
                          <a
                            href={`mailto:${l.contact.email}`}
                            className="block max-w-[13rem] truncate text-[11px] text-muted transition hover:text-copper-dark hover:underline"
                          >
                            {l.contact.email}
                          </a>
                        ) : null}
                      </td>
                      <td className="px-3 py-3">
                        <span className="block max-w-[13rem] truncate text-[12.5px] text-slate">
                          {l.company.name || '—'}
                        </span>
                        {l.company.inn ? (
                          <span className="block font-mono text-[10.5px] text-muted">STIR {l.company.inn}</span>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 text-[12px] whitespace-nowrap text-muted">
                        {l.location.region ? l.location.region : '—'}
                        {l.location.city ? <span className="block text-[11px] text-muted">{l.location.city}</span> : null}
                      </td>
                      <td className="px-3 py-3">
                        {products.length ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-panel px-2 py-0.5 font-mono text-[11px] font-bold text-copper-dark">
                            <Icon name="box" size={12} />
                            {products.length}
                          </span>
                        ) : (
                          <span className="text-[11.5px] text-muted/70">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <LeadStatusBadge status={l.status} locale={L} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ================= SAHIFALASH ================= */}
      {result.totalPages > 1 ? (
        <nav className="flex flex-wrap items-center justify-center gap-1.5" aria-label={t('common.page')}>
          <Link
            href={pageHref(Math.max(1, result.page - 1))}
            aria-disabled={result.page <= 1}
            className={
              result.page <= 1
                ? 'pointer-events-none inline-flex h-9 items-center gap-1.5 rounded-[14px] border border-line-soft bg-white px-3 text-[12.5px] font-bold text-muted/70'
                : 'inline-flex h-9 items-center gap-1.5 rounded-[14px] border border-line bg-white px-3 text-[12.5px] font-bold text-slate transition hover:border-copper hover:text-copper-dark'
            }
          >
            <Icon name="chevron-left" size={14} />
            {t('common.prev')}
          </Link>

          {Array.from({ length: result.totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === result.totalPages || Math.abs(p - result.page) <= 2)
            .map((p, i, arr) => (
              <span key={p} className="flex items-center gap-1.5">
                {i > 0 && arr[i - 1] !== p - 1 ? (
                  <span className="px-1 text-[12px] text-muted/70">…</span>
                ) : null}
                <Link
                  href={pageHref(p)}
                  aria-current={p === result.page ? 'page' : undefined}
                  className={
                    p === result.page
                      ? 'inline-flex h-9 min-w-9 items-center justify-center rounded-[14px] bg-navy px-3 font-mono text-[12.5px] font-bold text-white'
                      : 'inline-flex h-9 min-w-9 items-center justify-center rounded-[14px] border border-line bg-white px-3 font-mono text-[12.5px] font-bold text-slate transition hover:border-copper hover:text-copper-dark'
                  }
                >
                  {p}
                </Link>
              </span>
            ))}

          <Link
            href={pageHref(Math.min(result.totalPages, result.page + 1))}
            aria-disabled={result.page >= result.totalPages}
            className={
              result.page >= result.totalPages
                ? 'pointer-events-none inline-flex h-9 items-center gap-1.5 rounded-[14px] border border-line-soft bg-white px-3 text-[12.5px] font-bold text-muted/70'
                : 'inline-flex h-9 items-center gap-1.5 rounded-[14px] border border-line bg-white px-3 text-[12.5px] font-bold text-slate transition hover:border-copper hover:text-copper-dark'
            }
          >
            {t('common.next')}
            <Icon name="chevron-right" size={14} />
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
