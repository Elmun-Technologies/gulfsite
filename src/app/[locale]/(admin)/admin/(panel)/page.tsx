/**
 * ADMIN — BOSHQARUV PANELI
 * ----------------------------------------------------------------
 * Bitta maqsad: savdo bo'limi ochishi bilan "bugun nima qilish kerak"
 * degan savolga javob olishi.
 *   - yuqorida: bugun / 7 kun / ko'rilmagan / yopilgan / spam
 *   - keyin: turlar, holatlar va hududlar taqsimoti
 *   - 14 kunlik dinamika (bar chart)
 *   - eng ko'p so'ralgan mahsulotlar (nima sotilishini ko'rsatadi)
 *   - so'nggi arizalar jadvali — bir bosishda ochiladi
 *
 * Ma'lumot `getStats()` dan to'g'ridan-to'g'ri olinadi (API chaqiruvi
 * yo'q) — panel server komponent, shuning uchun tez va xavfsiz.
 */

import { adminCopy } from '@/lib/admin-copy';
import { buildReport, realtime, shiftDay, todayKey } from '@/lib/analytics-store';
import { requireAdmin } from '@/lib/guard';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { makeT, normalizeLocale } from '@/i18n';
import { getStats, listLeads } from '@/lib/leads/store';
import { LEAD_STATUSES, LEAD_TYPES, UZ_REGIONS, tr, type Locale } from '@/lib/taxonomy';
import { productCount } from '@/lib/catalog';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Icon, type IconName } from '@/components/ui/Icon';
import { LeadStatusBadge, LeadQuality } from '@/components/admin/LeadBits';
import { ensureCatalog } from '@/lib/catalog-live';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage({ params }: PageProps) {
  await ensureCatalog();
  const { locale: raw } = await params;
  // Layout qisman (RSC) navigatsiyada qayta render bo'lmaydi — himoya sahifaning o'zida ham
  if (!(await requireAdmin())) redirect(`/${normalizeLocale(raw)}/admin/login`);
  const locale = normalizeLocale(raw);
  const L = locale as Locale;
  const t = makeT(locale);

  const stats = getStats();
  const recent = listLeads({ page: 1, pageSize: 8, sort: 'newest' });
  const products = productCount();

  const cards: { label: string; value: number; icon: IconName; tone: string; href?: string }[] = [
    { label: t('admin.stats.today'), value: stats.today, icon: 'clock', tone: 'teal' },
    { label: t('admin.stats.week'), value: stats.last7, icon: 'chart', tone: 'pine' },
    { label: t('admin.stats.new'), value: stats.unseen, icon: 'sparkles', tone: 'gold', href: `/${locale}/admin/leads?status=new` },
    { label: t('admin.stats.won'), value: stats.won, icon: 'award', tone: 'green', href: `/${locale}/admin/leads?status=won` },
    { label: t('admin.stats.total'), value: stats.total, icon: 'users', tone: 'slate', href: `/${locale}/admin/leads` },
    { label: 'Spam', value: stats.spam, icon: 'alert', tone: 'clay', href: `/${locale}/admin/leads?status=spam` },
  ];

  const toneClass: Record<string, string> = {
    teal: 'bg-panel text-copper-dark',
    pine: 'bg-navy/10 text-slate',
    gold: 'bg-copper/20 text-copper-dark',
    green: 'bg-ok/10 text-copper-dark',
    slate: 'bg-line-soft text-body',
    clay: 'bg-error/10 text-error',
  };

  // Taqsimotlar: tur / holat / hudud
  const maxType = Math.max(1, ...Object.values(stats.byType));
  const maxStatus = Math.max(1, ...Object.values(stats.byStatus));
  const maxRegion = Math.max(1, ...Object.values(stats.byRegion));

  const byTypeRows = Object.entries(stats.byType).sort((a, b) => b[1] - a[1]);
  const byStatusRows = Object.entries(stats.byStatus).sort((a, b) => b[1] - a[1]);
  const byRegionRows = Object.entries(stats.byRegion)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const timelineMax = Math.max(1, ...stats.timeline.map((d) => d.count));

  // o'z analitikamiz — qisqa ko'rinish (to'liq hisobot: /admin/analytics)
  const ac = adminCopy(locale);
  const today = todayKey();
  const traffic7 = buildReport(shiftDay(today, -6), today, { sessionsLimit: 0 });
  const trafficToday = traffic7.series[traffic7.series.length - 1];
  const live = realtime(5);

  return (
    <div className="flex flex-col gap-5">
      {/* ================= SARLAVHA ================= */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[clamp(1.6rem,3vw,2.2rem)] font-normal tracking-[-0.02em] text-ink">
            {t('admin.dashboard')}
          </h1>
          <p className="mt-1 text-[13px] text-muted">
            {formatDate(new Date().toISOString(), locale)} · {products} {t('admin.products').toLowerCase()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* CSV eksport — bu API endpoint (sahifa emas), shuning uchun oddiy <a> */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a
            href="/api/admin/leads/export?format=csv"
            className="inline-flex h-10 items-center gap-2 rounded-[20px] border border-line bg-white px-4 text-[13px] font-bold text-slate transition hover:border-copper hover:text-copper-dark"
          >
            <Icon name="download" size={16} />
            {t('admin.leads.export')}
          </a>
          <Link
            href={`/${locale}/admin/leads`}
            className="inline-flex h-10 items-center gap-2 rounded-[20px] bg-navy px-4 text-[13px] font-bold text-white transition hover:bg-ink"
          >
            <Icon name="users" size={16} />
            {t('admin.leads')}
          </Link>
        </div>
      </header>

      {/* ================= SAYT TRAFIGI ================= */}
      <Link
        href={`/${locale}/admin/analytics`}
        className="grid grid-cols-2 gap-3 rounded-[20px] border border-line-soft bg-white p-3.5 transition hover:border-copper md:grid-cols-5"
      >
        {[
          { label: ac.realtime.title, value: live.active },
          { label: `${ac.kpi.visitors} · ${ac.period.today}`, value: trafficToday?.visitors ?? 0 },
          { label: `${ac.kpi.visitors} · ${ac.period['7d']}`, value: traffic7.totals.visitors },
          { label: `${ac.kpi.pageviews} · ${ac.period['7d']}`, value: traffic7.totals.pageviews },
          { label: `${ac.kpi.conversionRate} · ${ac.period['7d']}`, value: `${traffic7.totals.conversionRate}%` },
        ].map((k) => (
          <span key={k.label} className="flex flex-col">
            <span className="text-[11.5px] text-muted">{k.label}</span>
            <span className="mt-1 font-display text-[1.4rem] font-semibold leading-none text-ink tabular-nums">{k.value}</span>
          </span>
        ))}
      </Link>

      {/* ================= RAQAMLAR ================= */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => {
          const inner = (
            <>
              <span className={`flex h-9 w-9 items-center justify-center rounded-[14px] ${toneClass[c.tone] ?? toneClass.slate}`} aria-hidden>
                <Icon name={c.icon} size={18} />
              </span>
              <span className="mt-2.5 block font-display text-[1.7rem] leading-none font-semibold tracking-tight text-ink tabular-nums">
                {c.value}
              </span>
              <span className="mt-1.5 block text-[11.5px] leading-snug text-muted">{c.label}</span>
            </>
          );
          return c.href ? (
            <Link
              key={c.label}
              href={c.href}
              className="rounded-[20px] border border-line-soft bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-copper/60 hover:"
            >
              {inner}
            </Link>
          ) : (
            <div key={c.label} className="rounded-[20px] border border-line-soft bg-white p-3.5">
              {inner}
            </div>
          );
        })}
      </section>

      {/* ================= DINAMIKA ================= */}
      <section className="rounded-[20px] border border-line-soft bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-[14px] font-semibold tracking-tight text-ink">
            {locale === 'ru' ? 'Динамика за 14 дней' : locale === 'en' ? 'Last 14 days' : '14 kunlik dinamika'}
          </h2>
          <span className="font-mono text-[11.5px] text-muted">
            30 {locale === 'ru' ? 'дн' : locale === 'en' ? 'd' : 'kun'}: {stats.last30}
          </span>
        </div>

        <div className="mt-4 flex h-28 items-end gap-1">
          {stats.timeline.slice(-14).map((d) => (
            <div key={d.date} className="group flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <span className="font-mono text-[9.5px] text-muted opacity-0 transition group-hover:opacity-100">
                {d.count}
              </span>
              <span
                className="w-full rounded-t bg-navy transition group-hover:bg-copper"
                style={{ height: `${Math.max(3, (d.count / timelineMax) * 100)}%` }}
                title={`${d.date}: ${d.count}`}
              />
              <span className="truncate font-mono text-[9px] text-muted/70">{d.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TAQSIMOTLAR ================= */}
      <section className="grid gap-3 lg:grid-cols-3">
        {/* Tur bo'yicha */}
        <div className="rounded-[20px] border border-line-soft bg-white p-4">
          <h2 className="font-display text-[14px] font-semibold tracking-tight text-ink">{t('admin.stats.byType')}</h2>
          <ul className="mt-3.5 flex flex-col gap-2.5">
            {byTypeRows.length === 0 ? (
              <li className="text-[12.5px] text-muted">—</li>
            ) : (
              byTypeRows.map(([id, count]) => {
                const meta = LEAD_TYPES[id as keyof typeof LEAD_TYPES];
                return (
                  <li key={id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[12.5px] font-semibold text-slate">
                        {tr(meta?.name, L, id)}
                      </span>
                      <span className="font-mono text-[12px] font-bold text-ink tabular-nums">{count}</span>
                    </div>
                    <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-line-soft">
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${(count / maxType) * 100}%`, backgroundColor: meta?.color ?? '#0e7c6b' }}
                      />
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* Holat bo'yicha */}
        <div className="rounded-[20px] border border-line-soft bg-white p-4">
          <h2 className="font-display text-[14px] font-semibold tracking-tight text-ink">{t('admin.stats.byStatus')}</h2>
          <ul className="mt-3.5 flex flex-col gap-2.5">
            {byStatusRows.length === 0 ? (
              <li className="text-[12.5px] text-muted">—</li>
            ) : (
              byStatusRows.map(([id, count]) => {
                const meta = LEAD_STATUSES[id as keyof typeof LEAD_STATUSES];
                return (
                  <li key={id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[12.5px] font-semibold text-slate">{tr(meta?.name, L, id)}</span>
                      <span className="font-mono text-[12px] font-bold text-ink tabular-nums">{count}</span>
                    </div>
                    <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-line-soft">
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${(count / maxStatus) * 100}%`, backgroundColor: meta?.color ?? '#0e7c6b' }}
                      />
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* Hudud bo'yicha */}
        <div className="rounded-[20px] border border-line-soft bg-white p-4">
          <h2 className="font-display text-[14px] font-semibold tracking-tight text-ink">{t('admin.stats.byRegion')}</h2>
          <ul className="mt-3.5 flex flex-col gap-2.5">
            {byRegionRows.length === 0 ? (
              <li className="text-[12.5px] text-muted">—</li>
            ) : (
              byRegionRows.map(([id, count]) => {
                const region = UZ_REGIONS.find((r) => r.id === id);
                return (
                  <li key={id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[12.5px] font-semibold text-slate">{tr(region?.name, L, id)}</span>
                      <span className="font-mono text-[12px] font-bold text-ink tabular-nums">{count}</span>
                    </div>
                    <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-line-soft">
                      <span
                        className="block h-full rounded-full bg-navy/70"
                        style={{ width: `${(count / maxRegion) * 100}%` }}
                      />
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </section>

      {/* ================= TOP MAHSULOTLAR ================= */}
      <section className="rounded-[20px] border border-line-soft bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-[14px] font-semibold tracking-tight text-ink">
            {t('admin.stats.topProducts')}
          </h2>
          <Link href={`/${locale}/catalog`} className="text-[12px] font-bold text-copper-dark transition hover:text-ink">
            {t('admin.products')}
          </Link>
        </div>

        {stats.topProducts.length === 0 ? (
          <p className="mt-3 text-[12.5px] text-muted">
            {locale === 'ru'
              ? 'Пока нет данных — продукты появятся после первых заявок с образцами.'
              : locale === 'en'
                ? 'No data yet — products appear after the first sample requests.'
                : 'Hozircha ma\'lumot yo‘q — namunali arizalardan keyin paydo bo‘ladi.'}
          </p>
        ) : (
          <ul className="mt-3.5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {stats.topProducts.slice(0, 9).map((p) => (
              <li key={p.sku} className="flex items-center gap-2.5 rounded-[14px] border border-line-soft bg-panel/50 px-3 py-2">
                <span className="font-mono text-[11px] font-bold text-copper-dark">{p.sku}</span>
                <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-slate">{p.name}</span>
                <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[11px] font-bold text-ink tabular-nums">
                  {p.count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ================= SO'NGGI ARIZALAR ================= */}
      <section className="rounded-[20px] border border-line-soft bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-line-soft px-4 py-3">
          <h2 className="font-display text-[14px] font-semibold tracking-tight text-ink">{t('admin.stats.recent')}</h2>
          <Link
            href={`/${locale}/admin/leads`}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-copper-dark transition hover:text-ink"
          >
            {t('admin.leads')}
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>

        {recent.items.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-[20px] bg-panel text-muted" aria-hidden>
              <Icon name="users" size={20} />
            </span>
            <p className="mt-3 text-[13.5px] font-bold text-ink">{t('admin.leads.noResults')}</p>
            <p className="mt-1 text-[12.5px] text-muted">{t('admin.leads.noResultsHint')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line-soft bg-panel/50">
                  {['ref', 'date', 'type', 'contact', 'company', 'status'].map((k) => (
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
                {recent.items.map((l) => (
                  <tr key={l.id} className="border-b border-line-soft transition last:border-0 hover:bg-panel/60">
                    <td className="px-3 py-2.5">
                      <Link
                        href={`/${locale}/admin/leads/${l.id}`}
                        className="font-mono text-[11.5px] font-bold text-copper-dark transition hover:text-ink hover:underline"
                      >
                        {l.ref}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11.5px] whitespace-nowrap text-muted">
                      {formatDateTime(l.createdAt, locale)}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold whitespace-nowrap text-slate">
                        <Icon
                          name={(LEAD_TYPES[l.type as keyof typeof LEAD_TYPES]?.icon ?? 'tag') as IconName}
                          size={13}
                          className="text-muted"
                        />
                        {tr(LEAD_TYPES[l.type as keyof typeof LEAD_TYPES]?.name, L, l.type)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="block max-w-[12rem] truncate text-[12.5px] font-semibold text-ink">
                        {l.contact.fullName}
                      </span>
                      <span className="block font-mono text-[11px] whitespace-nowrap text-muted">{l.contact.phone}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="block max-w-[12rem] truncate text-[12.5px] text-slate">{l.company.name || '—'}</span>
                      <LeadQuality lead={l} locale={L} />
                    </td>
                    <td className="px-3 py-2.5">
                      <LeadStatusBadge status={l.status} locale={L} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
