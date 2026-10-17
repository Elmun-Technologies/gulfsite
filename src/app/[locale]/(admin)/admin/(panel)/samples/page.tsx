/**
 * ADMIN — NAMUNA (OBRAZETS) SO'ROVLARI
 * ----------------------------------------------------------------
 * Asosiy konversiya — bepul namuna qutisi. Bu sahifa: nechta ariza,
 * qaysi mahsulotlar eng ko'p so'ralmoqda, qaysi kategoriya va hajm,
 * so'nggi arizalar (mijoz + mahsulotlar ro'yxati).
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { normalizeLocale } from '@/i18n';
import { requireAdmin } from '@/lib/guard';
import { adminCopy } from '@/lib/admin-copy';
import { resolvePeriod, shortDay } from '@/lib/admin-period';
import { sampleReport } from '@/lib/leads/insights';
import { getProductBySku } from '@/lib/catalog';
import { CATEGORIES, tr, type Locale } from '@/lib/taxonomy';
import { formatDateTime } from '@/lib/utils';
import { AdminCard, Kpi, PageTitle, PeriodPicker } from '@/components/admin/AdminUi';
import { BarList } from '@/components/admin/charts';
import { LeadStatusBadge } from '@/components/admin/LeadBits';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminSamplesPage({ params, searchParams }: PageProps) {
  const { locale: raw } = await params;
  if (!(await requireAdmin())) redirect(`/${normalizeLocale(raw)}/admin/login`);
  const locale = normalizeLocale(raw);
  const L = locale as Locale;
  const c = adminCopy(locale);
  const sp = await searchParams;
  // standart — 30 kun (namunalar kamroq, qisqa davr bo'sh ko'rinadi)
  const period = resolvePeriod(sp.p || sp.from ? sp : { ...sp, p: '30d' });
  const r = sampleReport(period.from, period.to);
  const base = `/${locale}/admin/samples`;

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title={c.samples.title} sub={`${shortDay(period.from)} — ${shortDay(period.to)}`} />
      <PeriodPicker base={base} current={period.key} from={period.from} to={period.to} copy={c} />

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label={c.samples.requests} value={r.requests} />
        <Kpi label={c.samples.items} value={r.items} />
        <Kpi label={c.samples.unique} value={r.unique} />
        <Kpi label={c.samples.avg} value={r.avgBox} />
      </section>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <AdminCard title={c.samples.top}>
          <BarList
            limit={30}
            empty={c.tables.empty}
            rows={r.top.map((t) => {
              const prod = getProductBySku(t.sku);
              return {
                key: t.sku,
                label: prod ? tr(prod.name, L) : t.sku,
                sub: t.sku,
                value: t.count,
                href: prod ? `/${locale}/catalog/${prod.slug}` : undefined,
              };
            })}
          />
        </AdminCard>
        <div className="flex flex-col gap-4">
          <AdminCard title={c.samples.byCategory}>
            <BarList
              empty={c.tables.empty}
              showShare
              rows={r.byCategory.map((x) => ({
                key: x.key,
                label: tr(CATEGORIES.find((cat) => cat.id === x.key)?.name, L, x.key),
                value: x.value,
              }))}
            />
          </AdminCard>
          <AdminCard title={c.samples.bySize}>
            <BarList empty={c.tables.empty} showShare rows={r.bySize.map((x) => ({ key: x.key, label: x.key, value: x.value }))} />
          </AdminCard>
        </div>
      </div>

      <AdminCard title={c.samples.list}>
        {r.latest.length ? (
          <ul className="flex flex-col divide-y divide-cream-100">
            {r.latest.map((l) => (
              <li key={l.id} className="flex flex-wrap items-start gap-x-4 gap-y-2 py-3">
                <div className="min-w-[200px] flex-1">
                  <Link href={`/${locale}/admin/leads/${l.id}`} className="font-bold text-pine-900 hover:text-teal-600">
                    {l.contact.fullName} · {l.company.name || '—'}
                  </Link>
                  <span className="block text-[12px] tabular-nums text-slate-warm-500">
                    {l.ref} · {formatDateTime(l.createdAt, locale)} · {l.contact.phone}
                  </span>
                </div>
                <div className="flex flex-[2] flex-wrap gap-1.5">
                  {(l.request.products ?? []).map((p) => (
                    <span key={p.sku} className="rounded-md bg-cream-100 px-2 py-1 text-[12px] text-pine-800">
                      {tr(p.name, L, p.sku)} · {p.qty} {p.unit}
                    </span>
                  ))}
                </div>
                <LeadStatusBadge status={l.status} locale={L} size="sm" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-8 text-center text-[13px] text-slate-warm-500">{c.tables.empty}</p>
        )}
      </AdminCard>
    </div>
  );
}
