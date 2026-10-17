/**
 * ADMIN — MIJOZLAR BAZASI (arizalar telefon bo'yicha birlashtirilgan)
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { normalizeLocale } from '@/i18n';
import { requireAdmin } from '@/lib/guard';
import { adminCopy } from '@/lib/admin-copy';
import { clientList } from '@/lib/leads/insights';
import { LEAD_TYPES, UZ_REGIONS, tr, type Locale, type Trilingual } from '@/lib/taxonomy';
import { formatDate } from '@/lib/utils';
import { telHref, telegramHref, whatsappHref } from '@/lib/contacts';
import { AdminCard, Kpi, PageTitle } from '@/components/admin/AdminUi';
import { LeadStatusBadge } from '@/components/admin/LeadBits';
import { WhatsAppIcon, TelegramIcon } from '@/components/ui/BrandIcons';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminClientsPage({ params, searchParams }: PageProps) {
  const { locale: raw } = await params;
  if (!(await requireAdmin())) redirect(`/${normalizeLocale(raw)}/admin/login`);
  const locale = normalizeLocale(raw);
  const L = locale as Locale;
  const c = adminCopy(locale);
  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q.slice(0, 80) : '';

  const all = clientList();
  const rows = q ? clientList({ q }) : all;

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title={c.clients.title} sub={c.clients.hint} />

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label={c.clients.total} value={all.length} />
        <Kpi label={c.clients.repeat} value={all.filter((r) => r.requests > 1).length} />
        <Kpi label={c.clients.withSamples} value={all.filter((r) => r.samples > 0).length} />
        <Kpi label={c.clients.won} value={all.filter((r) => r.won).length} />
      </section>

      <form method="get" className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder={c.clients.search}
          className="h-10 min-w-0 flex-1 rounded-xl border border-cream-300 bg-white px-3 text-[13.5px]"
        />
        <button type="submit" className="h-10 rounded-xl bg-teal-600 px-4 text-[13px] font-bold text-white">
          {c.period.apply}
        </button>
      </form>

      <AdminCard>
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-[13px]">
              <thead>
                <tr className="border-b border-cream-200 text-left text-[11.5px] text-slate-warm-500">
                  <th className="py-2 pr-3 font-semibold">{c.clients.name}</th>
                  <th className="px-3 py-2 font-semibold">{c.clients.company}</th>
                  <th className="px-3 py-2 text-right font-semibold">{c.clients.requests}</th>
                  <th className="px-3 py-2 text-right font-semibold">{c.clients.samples}</th>
                  <th className="px-3 py-2 font-semibold">{c.clients.first}</th>
                  <th className="px-3 py-2 font-semibold">{c.clients.last}</th>
                  <th className="py-2 pl-3 font-semibold">{c.clients.status}</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 300).map((r) => (
                  <tr key={r.key} className="border-b border-cream-100 align-top last:border-0">
                    <td className="py-2 pr-3">
                      <span className="block font-bold text-pine-900">{r.name || '—'}</span>
                      <span className="mt-0.5 flex items-center gap-2 text-slate-warm-600">
                        <a href={telHref(r.phone)} className="tabular-nums hover:text-teal-600">
                          {r.phone}
                        </a>
                        <a href={whatsappHref(r.phone)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-teal-600">
                          <WhatsAppIcon size={14} />
                        </a>
                        <a href={telegramHref(r.phone)} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="hover:text-teal-600">
                          <TelegramIcon size={14} />
                        </a>
                      </span>
                      {r.email ? <span className="block text-[12px] text-slate-warm-500">{r.email}</span> : null}
                    </td>
                    <td className="px-3 py-2">
                      <span className="block text-pine-800">{r.company || '—'}</span>
                      <span className="text-[12px] text-slate-warm-500">
                        {r.region ? tr(UZ_REGIONS.find((x) => x.id === r.region)?.name, L, r.region) : ''}
                      </span>
                      <span className="mt-1 flex flex-wrap gap-1">
                        {r.types.map((t) => (
                          <span key={t} className="rounded bg-cream-100 px-1.5 py-0.5 text-[11px] text-pine-800">
                            {tr((LEAD_TYPES as Record<string, { name: Trilingual }>)[t]?.name, L, t)}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">
                      <Link href={`/${locale}/admin/leads?q=${encodeURIComponent(r.phone.replace(/\D/g, '').slice(-9))}`} className="hover:text-teal-600" title={c.clients.open}>
                        {r.requests}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.samples}</td>
                    <td className="px-3 py-2 tabular-nums text-slate-warm-600">{formatDate(r.first, locale)}</td>
                    <td className="px-3 py-2 tabular-nums text-slate-warm-600">{formatDate(r.last, locale)}</td>
                    <td className="py-2 pl-3">
                      <LeadStatusBadge status={r.lastStatus} locale={L} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-8 text-center text-[13px] text-slate-warm-500">{c.tables.empty}</p>
        )}
      </AdminCard>
    </div>
  );
}
