/**
 * ADMIN — BOSHQARUV PANELI (dashboard)
 * ----------------------------------------------------------------
 * Savdo bo'limi ochishi bilan "bugun nima qilish kerak" degan savolga javob:
 *   1. asosiy ko'rsatkichlar — o'zgarish foizi va 14 kunlik mini-grafik bilan
 *   2. 30 kunlik dinamika: tashriflar + arizalar bitta grafikda
 *   3. konversiya voronkasi va trafik manbalari
 *   4. so'nggi arizalar (bir bosishda ochiladi) va eng ko'p so'ralgan mahsulotlar
 *   5. tur / holat / hudud taqsimoti
 * Hamma ma'lumot server tomonida (getStats + o'z analitikamiz) — API chaqiruvi yo'q.
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { makeT, normalizeLocale } from '@/i18n';
import { adminCopy } from '@/lib/admin-copy';
import { shortDay } from '@/lib/admin-period';
import { buildReport, realtime, shiftDay, todayKey } from '@/lib/analytics-store';
import { productCount } from '@/lib/catalog';
import { ensureCatalog } from '@/lib/catalog-live';
import { requireAdmin } from '@/lib/guard';
import { getStats, listLeads } from '@/lib/leads/store';
import { LEAD_STATUSES, LEAD_TYPES, UZ_REGIONS, tr, type Locale } from '@/lib/taxonomy';
import { cn, formatDate, timeAgo } from '@/lib/utils';
import { Icon, type IconName } from '@/components/ui/Icon';
import { LeadStatusBadge } from '@/components/admin/LeadBits';
import { DualChart } from '@/components/admin/charts';
import { pctDelta } from '@/components/admin/AdminUi';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

const WORDS = {
  uz: {
    hello: 'Xush kelibsiz',
    visitors7: 'Tashrif buyuruvchilar · 7 kun',
    leads7: 'Arizalar · 7 kun',
    conv7: 'Konversiya · 7 kun',
    unseen: 'Ko‘rilmagan arizalar',
    liveNow: 'hozir saytda',
    openLeads: 'Ko‘rib chiqish',
    traffic30: 'Trafik va arizalar — 30 kun',
    visitors: 'Tashriflar',
    leads: 'Arizalar',
    vsPrev: 'oldingi 7 kunga nisbatan',
    noData: 'Hozircha ma’lumot yo‘q',
    all: 'Hammasi',
    products: 'mahsulot',
    viaTg: 'Telegram',
  },
  ru: {
    hello: 'Добро пожаловать',
    visitors7: 'Посетители · 7 дней',
    leads7: 'Заявки · 7 дней',
    conv7: 'Конверсия · 7 дней',
    unseen: 'Непросмотренные заявки',
    liveNow: 'сейчас на сайте',
    openLeads: 'Посмотреть',
    traffic30: 'Трафик и заявки — 30 дней',
    visitors: 'Посетители',
    leads: 'Заявки',
    vsPrev: 'к предыдущим 7 дням',
    noData: 'Пока нет данных',
    all: 'Все',
    products: 'товаров',
    viaTg: 'Telegram',
  },
  en: {
    hello: 'Welcome back',
    visitors7: 'Visitors · 7 days',
    leads7: 'Leads · 7 days',
    conv7: 'Conversion · 7 days',
    unseen: 'Unreviewed leads',
    liveNow: 'on site now',
    openLeads: 'Review',
    traffic30: 'Traffic & leads — 30 days',
    visitors: 'Visitors',
    leads: 'Leads',
    vsPrev: 'vs previous 7 days',
    noData: 'No data yet',
    all: 'All',
    products: 'products',
    viaTg: 'Telegram',
  },
};

export default async function AdminDashboardPage({ params }: PageProps) {
  await ensureCatalog();
  const { locale: raw } = await params;
  // Layout qisman (RSC) navigatsiyada qayta render bo'lmaydi — himoya sahifaning o'zida ham
  if (!(await requireAdmin())) redirect(`/${normalizeLocale(raw)}/admin/login`);
  const locale = normalizeLocale(raw);
  const L = locale as Locale;
  const t = makeT(locale);
  const ac = adminCopy(locale);
  const w = WORDS[L] ?? WORDS.uz;

  const stats = getStats();
  const recent = listLeads({ page: 1, pageSize: 7, sort: 'newest' });
  const today = todayKey();
  const r30 = buildReport(shiftDay(today, -29), today, { sessionsLimit: 0 });
  const r7 = buildReport(shiftDay(today, -6), today, { sessionsLimit: 0 });
  const live = realtime(5);

  const series = r30.series;
  const last14 = series.slice(-14);
  const leadsPrev7 = stats.timeline.slice(0, 7).reduce((n, d) => n + d.count, 0);
  const leadsLast7 = stats.timeline.slice(-7).reduce((n, d) => n + d.count, 0);
  const prevRate = r7.previous.visitors ? Math.round((r7.previous.conversions / r7.previous.visitors) * 1000) / 10 : 0;

  const funnel = r30.funnel;
  const funnelTop = Math.max(1, funnel[0]?.value ?? 0);
  const sourcesTotal = Math.max(1, r30.sources.reduce((n, s) => n + s.value, 0));

  const byType = Object.entries(stats.byType).sort((a, b) => b[1] - a[1]);
  const byStatus = Object.entries(stats.byStatus).sort((a, b) => b[1] - a[1]);
  const byRegion = Object.entries(stats.byRegion).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      {/* ================= SARLAVHA ================= */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[13px] text-muted">
            {formatDate(new Date().toISOString(), locale)} · {productCount()} {w.products}
          </p>
          <h1 className="mt-1 text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-[-0.02em] text-ink">{w.hello}</h1>
        </div>
        <Link
          href={`/${locale}/admin/leads`}
          className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-navy px-4 text-[14px] font-medium text-white transition hover:bg-copper-dark"
        >
          <Icon name="invoice" size={16} />
          {t('admin.leads')}
        </Link>
      </header>

      {/* ================= ASOSIY KO'RSATKICHLAR ================= */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={w.visitors7}
          value={r7.totals.visitors}
          delta={pctDelta(r7.totals.visitors, r7.previous.visitors)}
          hint={w.vsPrev}
          spark={last14.map((d) => d.visitors)}
          href={`/${locale}/admin/analytics`}
        />
        <StatCard
          label={w.leads7}
          value={leadsLast7}
          delta={pctDelta(leadsLast7, leadsPrev7)}
          hint={w.vsPrev}
          spark={stats.timeline.map((d) => d.count)}
          tone="ok"
          href={`/${locale}/admin/leads`}
        />
        <StatCard
          label={w.conv7}
          value={`${r7.totals.conversionRate}%`}
          delta={prevRate ? pctDelta(r7.totals.conversionRate, prevRate) : null}
          hint={w.vsPrev}
          spark={last14.map((d) => (d.visitors ? d.conversions / d.visitors : 0))}
        />
        <Link
          href={`/${locale}/admin/leads?status=new`}
          className={cn(
            'admin-card flex flex-col justify-between gap-4 p-5 transition hover:border-copper',
            stats.unseen ? 'border-copper/40 bg-copper/5' : '',
          )}
        >
          <span className="text-[13px] text-muted">{w.unseen}</span>
          <span className="flex items-end justify-between gap-3">
            <span className="text-[34px] font-semibold leading-none tracking-[-0.02em] text-ink tabular-nums">{stats.unseen}</span>
            <span className="inline-flex items-center gap-1 text-[13px] font-medium text-copper-dark">
              {w.openLeads}
              <Icon name="arrow-right" size={14} />
            </span>
          </span>
          <span className="flex items-center gap-2 text-[12.5px] text-muted">
            <span className={cn('h-2 w-2 rounded-full', live.active ? 'animate-pulse bg-ok' : 'bg-line')} aria-hidden />
            {live.active} {w.liveNow}
          </span>
        </Link>
      </section>

      {/* ================= DINAMIKA + VORONKA ================= */}
      <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card title={w.traffic30} aside={<Link href={`/${locale}/admin/analytics?p=30d`} className="text-[13px] font-medium text-copper-dark hover:underline">{ac.nav.analytics} →</Link>}>
          <DualChart
            points={series.map((d) => ({ x: shortDay(d.day), a: d.visitors, b: d.conversions }))}
            labelA={w.visitors}
            labelB={w.leads}
          />
        </Card>

        <Card title={ac.tables.funnel}>
          <ol className="m-0 flex list-none flex-col gap-3 p-0">
            {funnel.map((f, i) => {
              const pct = Math.round((f.value / funnelTop) * 100);
              const prev = i ? funnel[i - 1].value : 0;
              const step = i && prev ? Math.round((f.value / prev) * 100) : null;
              return (
                <li key={f.key}>
                  <div className="flex items-baseline justify-between gap-2 text-[13px]">
                    <span className="text-slate">{ac.funnel[f.key] ?? f.key}</span>
                    <span className="tabular-nums text-ink">
                      <b className="font-semibold">{f.value}</b>
                      {step != null ? <span className="ml-1.5 text-[12px] text-muted">{step}%</span> : null}
                    </span>
                  </div>
                  <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-panel">
                    <span
                      className={cn('block h-full rounded-full', f.key === 'converted' ? 'bg-ok' : 'bg-navy')}
                      style={{ width: `${Math.max(f.value ? 3 : 0, pct)}%`, opacity: 1 - i * 0.12 }}
                    />
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 border-t border-line pt-4">
            <h3 className="mb-3 text-[13px] font-semibold text-ink">{ac.tables.sources}</h3>
            {r30.sources.length ? (
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {r30.sources.slice(0, 5).map((s) => (
                  <li key={s.key} className="flex items-center gap-3 text-[13px]">
                    <span className="w-[42%] truncate text-slate">{ac.sources[s.key] ?? s.key}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-panel">
                      <span className="block h-full rounded-full bg-copper" style={{ width: `${(s.value / sourcesTotal) * 100}%` }} />
                    </span>
                    <span className="w-10 text-right tabular-nums text-muted">{Math.round((s.value / sourcesTotal) * 100)}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-muted">{w.noData}</p>
            )}
          </div>
        </Card>
      </section>

      {/* ================= SO'NGGI ARIZALAR + TOP MAHSULOTLAR ================= */}
      <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card
          title={t('admin.stats.recent')}
          aside={<Link href={`/${locale}/admin/leads`} className="text-[13px] font-medium text-copper-dark hover:underline">{w.all} →</Link>}
          flush
        >
          {recent.items.length ? (
            <ul className="m-0 list-none divide-y divide-line p-0">
              {recent.items.map((l) => {
                const type = LEAD_TYPES[l.type as keyof typeof LEAD_TYPES];
                return (
                  <li key={l.id}>
                    <Link href={`/${locale}/admin/leads/${l.id}`} className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-panel/60">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-panel text-[14px] font-semibold text-slate">
                        {(l.contact.fullName || '?').slice(0, 1).toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-[14px] font-medium text-ink">{l.contact.fullName}</span>
                          {l.source.channel === 'telegram' ? (
                            <span className="rounded-full bg-[#229ED9]/10 px-1.5 py-0.5 text-[11px] font-medium text-[#1a86b9]">{w.viaTg}</span>
                          ) : null}
                        </span>
                        <span className="block truncate text-[12.5px] text-muted">
                          {l.company.name || l.contact.phone} · {tr(type?.name, L, l.type)}
                          {l.request.products?.length ? ` · ${l.request.products.length}` : ''}
                        </span>
                      </span>
                      <span className="hidden shrink-0 text-right sm:block">
                        <LeadStatusBadge status={l.status} locale={L} size="sm" />
                        <span className="mt-1 block text-[12px] text-muted">{timeAgo(l.createdAt, locale)}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty icon="invoice" title={t('admin.leads.noResults')} hint={t('admin.leads.noResultsHint')} />
          )}
        </Card>

        <Card
          title={t('admin.stats.topProducts')}
          aside={<Link href={`/${locale}/admin/samples`} className="text-[13px] font-medium text-copper-dark hover:underline">{ac.nav.samples} →</Link>}
        >
          {stats.topProducts.length ? (
            <ol className="m-0 flex list-none flex-col gap-3 p-0">
              {stats.topProducts.slice(0, 7).map((p, i) => (
                <li key={p.sku} className="flex items-center gap-3">
                  <span className="w-5 text-[13px] tabular-nums text-muted">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] text-ink">{p.name}</span>
                    <span className="text-[12px] text-muted">{p.sku}</span>
                  </span>
                  <span className="rounded-full bg-panel px-2 py-0.5 text-[12.5px] font-medium tabular-nums text-slate">{p.count}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-[13px] text-muted">{w.noData}</p>
          )}
        </Card>
      </section>

      {/* ================= TAQSIMOTLAR ================= */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Distribution
          title={t('admin.stats.byType')}
          rows={byType.map(([id, n]) => ({ key: id, label: tr(LEAD_TYPES[id as keyof typeof LEAD_TYPES]?.name, L, id), value: n }))}
          empty={w.noData}
        />
        <Distribution
          title={t('admin.stats.byStatus')}
          rows={byStatus.map(([id, n]) => ({ key: id, label: tr(LEAD_STATUSES[id as keyof typeof LEAD_STATUSES]?.name, L, id), value: n }))}
          empty={w.noData}
        />
        <Distribution
          title={t('admin.stats.byRegion')}
          rows={byRegion.map(([id, n]) => ({ key: id, label: tr(UZ_REGIONS.find((r) => r.id === id)?.name, L, id), value: n }))}
          empty={w.noData}
        />
      </section>
    </div>
  );
}

/* ------------------------------------------------------------
   Bloklar
   ------------------------------------------------------------ */

function Card({ title, aside, children, flush }: { title: string; aside?: ReactNode; children: ReactNode; flush?: boolean }) {
  return (
    <section className="admin-card min-w-0">
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
        {aside}
      </header>
      <div className={flush ? '' : 'p-5'}>{children}</div>
    </section>
  );
}

function StatCard({
  label,
  value,
  delta,
  hint,
  spark,
  tone = 'primary',
  href,
}: {
  label: string;
  value: number | string;
  delta: number | null;
  hint: string;
  spark: number[];
  tone?: 'primary' | 'ok';
  href?: string;
}) {
  const inner = (
    <>
      <span className="text-[13px] text-muted">{label}</span>
      <span className="flex items-end justify-between gap-3">
        <span className="text-[34px] font-semibold leading-none tracking-[-0.02em] text-ink tabular-nums">{value}</span>
        <Sparkline values={spark} tone={tone} />
      </span>
      <span className="flex items-center gap-2 text-[12.5px]">
        {delta == null ? (
          <span className="text-muted">—</span>
        ) : (
          <span
            className={cn(
              'inline-flex items-center rounded-full px-1.5 py-0.5 font-medium tabular-nums',
              delta >= 0 ? 'bg-ok/10 text-ok' : 'bg-error/10 text-error',
            )}
          >
            {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%
          </span>
        )}
        <span className="truncate text-muted">{hint}</span>
      </span>
    </>
  );
  const cls = 'admin-card flex flex-col justify-between gap-4 p-5';
  return href ? (
    <Link href={href} className={cn(cls, 'transition hover:border-copper')}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/** 14 kunlik mini-grafik — server SVG (JS yo'q) */
function Sparkline({ values, tone }: { values: number[]; tone: 'primary' | 'ok' }) {
  const w = 96;
  const h = 32;
  if (values.length < 2) return <span className="h-8 w-24" />;
  const max = Math.max(...values, 0.0001);
  const pts = values.map((v, i) => `${((i / (values.length - 1)) * w).toFixed(1)},${(h - 2 - (v / max) * (h - 4)).toFixed(1)}`);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden className="shrink-0">
      <polygon points={`0,${h} ${pts.join(' ')} ${w},${h}`} className={tone === 'ok' ? 'fill-ok/10' : 'fill-navy/10'} />
      <polyline points={pts.join(' ')} fill="none" strokeWidth={1.8} strokeLinejoin="round" className={tone === 'ok' ? 'stroke-ok' : 'stroke-navy'} />
    </svg>
  );
}

function Distribution({ title, rows, empty }: { title: string; rows: { key: string; label: string; value: number }[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <Card title={title}>
      {rows.length ? (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {rows.map((r) => (
            <li key={r.key}>
              <div className="flex items-baseline justify-between gap-2 text-[13px]">
                <span className="truncate text-slate">{r.label}</span>
                <span className="font-semibold tabular-nums text-ink">{r.value}</span>
              </div>
              <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-panel">
                <span className="block h-full rounded-full bg-navy" style={{ width: `${(r.value / max) * 100}%` }} />
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px] text-muted">{empty}</p>
      )}
    </Card>
  );
}

function Empty({ icon, title, hint }: { icon: IconName; title: string; hint: string }) {
  return (
    <div className="px-5 py-12 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-panel text-muted" aria-hidden>
        <Icon name={icon} size={22} />
      </span>
      <p className="mt-3 text-[14px] font-medium text-ink">{title}</p>
      <p className="mt-1 text-[13px] text-muted">{hint}</p>
    </div>
  );
}
