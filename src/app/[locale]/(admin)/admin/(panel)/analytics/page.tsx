/**
 * ADMIN — ANALITIKA (o'z serverimizdagi ma'lumotlar, GA/Metrika'siz)
 * ----------------------------------------------------------------
 * Davr tanlovi → KPI (oldingi davrga nisbatan) → dinamika → real vaqt →
 * soat/hafta kuni → sahifalar, kirish/chiqish → manbalar, UTM →
 * qurilma/brauzer/OT/til/mamlakat → hodisalar → voronka →
 * mahsulotlar, qutiga qo'shilganlar, qidiruvlar.
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { normalizeLocale } from '@/i18n';
import { requireAdmin } from '@/lib/guard';
import { adminCopy, fmtDuration } from '@/lib/admin-copy';
import { resolvePeriod, shortDay } from '@/lib/admin-period';
import { buildReport, realtime, type Row } from '@/lib/analytics-store';
import { getProductBySku, getProductBySlug } from '@/lib/catalog';
import { tr, type Locale } from '@/lib/taxonomy';
import { AdminCard, Kpi, PageTitle, PeriodPicker, pctDelta } from '@/components/admin/AdminUi';
import { BarList, ColumnBars, TrendChart, type BarRow } from '@/components/admin/charts';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const METRICS = ['visitors', 'sessions', 'pageviews', 'conversions'] as const;
type Metric = (typeof METRICS)[number];

export default async function AdminAnalyticsPage({ params, searchParams }: PageProps) {
  const { locale: raw } = await params;
  if (!(await requireAdmin())) redirect(`/${normalizeLocale(raw)}/admin/login`);
  const locale = normalizeLocale(raw);
  const L = locale as Locale;
  const c = adminCopy(locale);
  const sp = await searchParams;
  const period = resolvePeriod(sp);
  const metric: Metric = METRICS.includes(sp.m as Metric) ? (sp.m as Metric) : 'visitors';

  const r = buildReport(period.from, period.to, { sessionsLimit: 0 });
  const live = realtime(5);
  const base = `/${locale}/admin/analytics`;
  const periodQs: Record<string, string> = period.key === 'custom' ? { from: period.from, to: period.to } : { p: period.key };

  const rows = (list: Row[], label: (k: string) => string = (k) => k, href?: (k: string) => string): BarRow[] =>
    list.map((x) => ({ key: x.key, label: label(x.key), value: x.value, href: href?.(x.key) }));

  const pageLabel = (p: string) => {
    const slug = p.match(/^\/catalog\/([\w-]+)$/)?.[1];
    const prod = slug ? getProductBySlug(slug) : undefined;
    return prod ? `${tr(prod.name, L)} · ${p}` : p;
  };
  const productLabel = (slug: string) => {
    const prod = getProductBySlug(slug);
    return prod ? tr(prod.name, L) : slug;
  };
  const skuLabel = (sku: string) => {
    const prod = getProductBySku(sku);
    return prod ? `${tr(prod.name, L)} · ${sku}` : sku;
  };

  const kpiLabel: Record<Metric, string> = {
    visitors: c.kpi.visitors,
    sessions: c.kpi.sessions,
    pageviews: c.kpi.pageviews,
    conversions: c.kpi.conversions,
  };
  const funnelTop = Math.max(1, r.funnel[0]?.value ?? 0);

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title={c.nav.analytics}
        sub={`${shortDay(period.from)} — ${shortDay(period.to)}`}
        actions={
          <Link
            href={`${base}/sessions?${new URLSearchParams(periodQs).toString()}`}
            className="inline-flex h-10 items-center rounded-xl border border-pine-800/20 bg-white px-4 text-[13px] font-bold text-pine-800 shadow-soft hover:border-teal-500 hover:text-teal-600"
          >
            {c.nav.sessions}
          </Link>
        }
      />
      <PeriodPicker base={base} current={period.key} from={period.from} to={period.to} copy={c} extra={{ m: metric }} />

      {/* ============ KPI ============ */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Kpi label={c.kpi.visitors} value={r.totals.visitors} delta={pctDelta(r.totals.visitors, r.previous.visitors)} hint={c.kpi.vsPrev} />
        <Kpi label={c.kpi.newVisitors} value={r.totals.newVisitors} />
        <Kpi label={c.kpi.sessions} value={r.totals.sessions} delta={pctDelta(r.totals.sessions, r.previous.sessions)} hint={c.kpi.vsPrev} />
        <Kpi label={c.kpi.pageviews} value={r.totals.pageviews} delta={pctDelta(r.totals.pageviews, r.previous.pageviews)} hint={c.kpi.vsPrev} />
        <Kpi label={c.kpi.pagesPerSession} value={r.totals.pagesPerSession} />
        <Kpi label={c.kpi.avgSession} value={fmtDuration(r.totals.avgSessionSec)} />
        <Kpi label={c.kpi.bounce} value={`${r.totals.bounceRate}%`} />
        <Kpi label={c.kpi.conversions} value={r.totals.conversions} delta={pctDelta(r.totals.conversions, r.previous.conversions)} hint={c.kpi.vsPrev} />
        <Kpi label={c.kpi.conversionRate} value={`${r.totals.conversionRate}%`} />
        <Kpi label={c.realtime.title} value={live.active} />
      </section>

      {/* ============ DINAMIKA + REAL VAQT ============ */}
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <AdminCard
          title={c.chart.title}
          aside={
            <nav className="flex flex-wrap gap-1">
              {METRICS.map((m) => (
                <Link
                  key={m}
                  href={`${base}?${new URLSearchParams({ ...periodQs, m }).toString()}`}
                  className={cn(
                    'rounded-lg px-2.5 py-1 text-[12px] font-bold',
                    metric === m ? 'bg-teal-600 text-white' : 'text-pine-800 hover:bg-cream-100',
                  )}
                >
                  {kpiLabel[m]}
                </Link>
              ))}
            </nav>
          }
        >
          <TrendChart label={kpiLabel[metric]} points={r.series.map((d) => ({ x: shortDay(d.day), y: d[metric] }))} />
        </AdminCard>

        <AdminCard title={c.realtime.title}>
          <p className="font-display text-[2.4rem] font-extrabold leading-none text-pine-900 tabular-nums">{live.active}</p>
          <p className="mb-3 mt-1 text-[12px] text-slate-warm-600">{c.realtime.active}</p>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-warm-500">{c.realtime.pages}</p>
          <BarList rows={rows(live.pages, pageLabel)} empty={c.realtime.none} />
        </AdminCard>
      </div>

      {/* ============ SOAT / HAFTA KUNI ============ */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard title={c.chart.hours}>
          <ColumnBars values={r.hours} labels={r.hours.map((_, i) => String(i))} unit={c.tables.views.toLowerCase()} />
        </AdminCard>
        <AdminCard title={c.chart.weekdays}>
          <ColumnBars values={r.weekdays} labels={c.chart.weekdayNames} unit={c.tables.views.toLowerCase()} />
        </AdminCard>
      </div>

      {/* ============ SAHIFALAR ============ */}
      <AdminCard title={c.tables.pages}>
        {r.pages.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-[13px]">
              <thead>
                <tr className="border-b border-cream-200 text-left text-[11.5px] text-slate-warm-500">
                  <th className="py-2 pr-3 font-semibold">{c.tables.page}</th>
                  <th className="px-3 py-2 text-right font-semibold">{c.tables.views}</th>
                  <th className="px-3 py-2 text-right font-semibold">{c.tables.uniq}</th>
                  <th className="py-2 pl-3 text-right font-semibold">{c.tables.avgTime}</th>
                </tr>
              </thead>
              <tbody>
                {r.pages.slice(0, 25).map((p) => (
                  <tr key={p.key} className="border-b border-cream-100 last:border-0">
                    <td className="max-w-[420px] truncate py-1.5 pr-3 text-pine-800" title={p.key}>
                      <a href={`/${locale}${p.key === '/' ? '' : p.key}`} target="_blank" rel="noopener noreferrer" className="hover:text-teal-600">
                        {pageLabel(p.key)}
                      </a>
                    </td>
                    <td className="px-3 py-1.5 text-right font-bold tabular-nums">{p.value}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{p.visitors}</td>
                    <td className="py-1.5 pl-3 text-right tabular-nums">{fmtDuration(p.avgSec)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-6 text-center text-[13px] text-slate-warm-500">{c.tables.empty}</p>
        )}
      </AdminCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard title={c.tables.entries}>
          <BarList rows={rows(r.entries, pageLabel)} empty={c.tables.empty} />
        </AdminCard>
        <AdminCard title={c.tables.exits}>
          <BarList rows={rows(r.exits, pageLabel)} empty={c.tables.empty} />
        </AdminCard>
      </div>

      {/* ============ MANBALAR ============ */}
      <div className="grid gap-4 lg:grid-cols-3">
        <AdminCard title={c.tables.sources}>
          <BarList rows={rows(r.sources, (k) => c.sources[k] ?? k)} empty={c.tables.empty} showShare />
        </AdminCard>
        <AdminCard title={c.tables.referrers}>
          <BarList rows={rows(r.referrers)} empty={c.tables.empty} showShare />
        </AdminCard>
        <AdminCard title={c.tables.campaigns}>
          <BarList rows={rows(r.campaigns)} empty={c.tables.empty} showShare />
        </AdminCard>
      </div>

      {/* ============ AUDITORIYA ============ */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <AdminCard title={c.tables.devices}>
          <BarList rows={rows(r.devices, (k) => c.devices[k] ?? k)} empty={c.tables.empty} showShare />
        </AdminCard>
        <AdminCard title={c.tables.browsers}>
          <BarList rows={rows(r.browsers)} empty={c.tables.empty} showShare />
        </AdminCard>
        <AdminCard title={c.tables.os}>
          <BarList rows={rows(r.os)} empty={c.tables.empty} showShare />
        </AdminCard>
        <AdminCard title={c.tables.langs}>
          <BarList rows={rows(r.langs, (k) => k.toUpperCase())} empty={c.tables.empty} showShare />
        </AdminCard>
        <AdminCard title={c.tables.countries}>
          <BarList rows={rows(r.countries)} empty={c.tables.empty} showShare />
        </AdminCard>
      </div>

      {/* ============ HODISALAR + VORONKA ============ */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard title={c.tables.events}>
          <BarList rows={rows(r.events, (k) => c.events[k] ?? k)} empty={c.tables.empty} limit={20} />
        </AdminCard>
        <AdminCard title={c.tables.funnel}>
          <ol className="flex flex-col gap-2.5">
            {r.funnel.map((f, i) => {
              const prev = i ? r.funnel[i - 1].value : f.value;
              const step = prev ? Math.round((f.value / prev) * 100) : 0;
              return (
                <li key={f.key} className="flex flex-col gap-1">
                  <span className="flex items-baseline justify-between text-[13px] text-pine-800">
                    <span>
                      {i + 1}. {c.funnel[f.key] ?? f.key}
                    </span>
                    <span className="font-bold tabular-nums">
                      {f.value}
                      {i ? <span className="ml-2 font-normal text-slate-warm-500">{step}%</span> : null}
                    </span>
                  </span>
                  <span className="h-2.5 overflow-hidden rounded-full bg-cream-100">
                    <span className="block h-full rounded-full bg-teal-600" style={{ width: `${(f.value / funnelTop) * 100}%` }} />
                  </span>
                </li>
              );
            })}
          </ol>
        </AdminCard>
      </div>

      {/* ============ MAHSULOTLAR + QIDIRUV ============ */}
      <div className="grid gap-4 lg:grid-cols-3">
        <AdminCard title={c.tables.products}>
          <BarList rows={rows(r.products, productLabel, (k) => `/${locale}/catalog/${k}`)} empty={c.tables.empty} />
        </AdminCard>
        <AdminCard title={c.tables.sampleAdds}>
          <BarList rows={rows(r.sampleAdds, skuLabel)} empty={c.tables.empty} />
        </AdminCard>
        <AdminCard title={c.tables.searches}>
          <BarList rows={rows(r.searches, (k) => k, (k) => `/${locale}/search?q=${encodeURIComponent(k)}`)} empty={c.tables.empty} />
        </AdminCard>
      </div>
    </div>
  );
}
