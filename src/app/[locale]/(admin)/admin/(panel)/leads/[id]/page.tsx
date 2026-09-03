/**
 * ADMIN — ARIZA TAFSILOTLARI
 * ----------------------------------------------------------------
 * Bir ariza haqidagi HAMMA ma'lumot bitta ekranda: kim, qaysi
 * kompaniyadan, nima so'radi, qayerdan keldi, qanday bildirishnoma
 * ketdi va nima qilindi.
 *
 * Ma'lumot `getLead(id)` orqali server tomonida olinadi (API chaqiruvi
 * yo'q). O'zgartirishlar esa `LeadActions` klient komponenti orqali
 * PATCH qilinadi va `router.refresh()` bilan sahifa yangilanadi.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { makeT, normalizeLocale } from '@/i18n';
import { getLead } from '@/lib/leads/store';
import { BUSINESS_TYPES, LEAD_STATUSES, LEAD_TYPES, UZ_REGIONS, tr, type Locale } from '@/lib/taxonomy';
import type { DictKey } from '@/i18n';
import { formatDateTime, timeAgo } from '@/lib/utils';
import { Icon, type IconName } from '@/components/ui/Icon';
import { LeadActions } from '@/components/admin/LeadActions';
import { LeadQuality, LeadStatusBadge, SpamScoreBadge, leadQuality } from '@/components/admin/LeadBits';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function AdminLeadDetailPage({ params }: PageProps) {
  const { locale: raw, id } = await params;
  const locale = normalizeLocale(raw);
  const L = locale as Locale;
  const t = makeT(locale);

  const lead = getLead(id);
  if (!lead) notFound();

  const quality = leadQuality(lead);
  const products = lead.request.products ?? [];
  const listHref = `/${locale}/admin/leads`;

  const typeMeta = LEAD_TYPES[lead.type as keyof typeof LEAD_TYPES];
  const statusMeta = LEAD_STATUSES[lead.status];
  const region = UZ_REGIONS.find((r) => r.id === lead.location.region);
  const bizType = BUSINESS_TYPES.find((b) => b.id === lead.company.type);


  return (
    <div className="flex flex-col gap-4">
      {/* ================= SARLAVHA ================= */}
      <header className="flex flex-col gap-3">
        <Link
          href={listHref}
          className="inline-flex w-fit items-center gap-1.5 text-[12.5px] font-bold text-slate-warm-600 transition hover:text-teal-600"
        >
          <Icon name="arrow-left" size={14} />
          {t('admin.lead.backToList')}
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-cream-200 bg-white p-4 shadow-soft">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-[clamp(1.1rem,2.4vw,1.45rem)] font-extrabold tracking-tight text-pine-900">
                {lead.ref}
              </h1>
              <LeadStatusBadge status={lead.status} locale={L} />
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold whitespace-nowrap text-white"
                style={{ backgroundColor: typeMeta?.color ?? '#0e7c6b' }}
              >
                <Icon name={(typeMeta?.icon ?? 'tag') as IconName} size={13} />
                {tr(typeMeta?.name, L, lead.type)}
              </span>
              <SpamScoreBadge score={lead.spamScore} />
            </div>

            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-warm-600">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="calendar" size={13} className="text-teal-600" />
                {formatDateTime(lead.createdAt, locale)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="clock" size={13} className="text-teal-600" />
                {timeAgo(lead.createdAt, locale)}
              </span>
              {lead.updatedAt !== lead.createdAt ? (
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="refresh" size={13} className="text-slate-warm-400" />
                  {formatDateTime(lead.updatedAt, locale)}
                </span>
              ) : null}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-warm-500">
              {t('admin.lead.quality')}
            </span>
            <span className="font-display text-[2rem] leading-none font-extrabold tracking-tight text-pine-900 tabular-nums">
              {quality.score}
            </span>
            <LeadQuality lead={lead} locale={L} />
          </div>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
        {/* ================= CHAP: MA'LUMOTLAR ================= */}
        <div className="flex min-w-0 flex-col gap-4">
          {/* Aloqa */}
          <section className="rounded-xl border border-cream-200 bg-white p-4 shadow-soft">
            <h2 className="flex items-center gap-2 font-display text-[13.5px] font-extrabold tracking-tight text-pine-900">
              <Icon name="phone" size={16} className="text-teal-600" />
              {t('admin.lead.contact')}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a
                href={`tel:${lead.contact.phone.replace(/\D/g, '')}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-teal-600 px-3 font-mono text-[12.5px] font-bold text-white transition hover:bg-pine-800"
              >
                <Icon name="phone" size={14} />
                {lead.contact.phone}
              </a>
              {lead.contact.email ? (
                <a
                  href={`mailto:${lead.contact.email}`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-cream-300 bg-white px-3 text-[12.5px] font-bold text-pine-800 transition hover:border-teal-500 hover:text-teal-600"
                >
                  <Icon name="mail" size={14} />
                  {lead.contact.email}
                </a>
              ) : null}
              {lead.contact.telegram ? (
                <a
                  href={lead.contact.telegram.startsWith('http') ? lead.contact.telegram : `https://t.me/${lead.contact.telegram.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#229ED9] px-3 text-[12.5px] font-bold text-white transition hover:brightness-110"
                >
                  <Icon name="telegram" size={14} />
                  {lead.contact.telegram}
                </a>
              ) : null}
            </div>

            <div className="mt-3">
              <Row label={t('form.fullName')} value={lead.contact.fullName} />
              <Row label={t('form.position')} value={lead.contact.position} />
              <Row label={t('form.phone')} value={lead.contact.phone} mono />
              <Row label={t('form.email')} value={lead.contact.email} mono href={lead.contact.email ? `mailto:${lead.contact.email}` : undefined} />
              <Row label="Telegram" value={lead.contact.telegram} mono />
              <Row
                label={t('form.preferredContact')}
                value={lead.request.preferredContact ? t(`form.preferredContact.${lead.request.preferredContact}` as DictKey) : null}
              />
            </div>
          </section>

          {/* Kompaniya */}
          <section className="rounded-xl border border-cream-200 bg-white p-4 shadow-soft">
            <h2 className="flex items-center gap-2 font-display text-[13.5px] font-extrabold tracking-tight text-pine-900">
              <Icon name="building" size={16} className="text-teal-600" />
              {t('admin.lead.company')}
            </h2>
            <div className="mt-3">
              <Row label={t('form.company')} value={lead.company.name} />
              <Row label={t('form.inn')} value={lead.company.inn} mono />
              <Row label={t('form.businessType')} value={bizType ? tr(bizType.name, L, lead.company.type ?? '') : lead.company.type} />
              <Row label={t('form.website')} value={lead.company.website} mono href={lead.company.website} />
              <Row label={t('form.employees')} value={lead.company.employees} />
              <Row label={t('form.region')} value={region ? tr(region.name, L, lead.location.region ?? '') : lead.location.region} />
              <Row label={t('form.city')} value={lead.location.city} />
              <Row label={t('form.address')} value={lead.location.address} />
            </div>
          </section>

          {/* So'rov */}
          <section className="rounded-xl border border-cream-200 bg-white p-4 shadow-soft">
            <h2 className="flex items-center gap-2 font-display text-[13.5px] font-extrabold tracking-tight text-pine-900">
              <Icon name="box" size={16} className="text-teal-600" />
              {t('admin.lead.request')}
            </h2>

            {products.length ? (
              <div className="mt-3 overflow-x-auto rounded-lg border border-cream-200">
                <table className="w-full min-w-[34rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-cream-200 bg-cream-50">
                      {['SKU', t('form.products'), t('samples.qtyLabel'), t('samples.noteLabel')].map((h, i) => (
                        <th key={i} scope="col" className="px-3 py-2 text-[10.5px] font-bold uppercase tracking-[0.1em] whitespace-nowrap text-slate-warm-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.sku} className="border-b border-cream-100 last:border-0">
                        <td className="px-3 py-2">
                          <Link
                            href={`/${locale}/product/${p.slug}`}
                            target="_blank"
                            className="font-mono text-[11.5px] font-bold text-teal-600 transition hover:underline"
                          >
                            {p.sku}
                          </Link>
                        </td>
                        <td className="px-3 py-2">
                          <Link
                            href={`/${locale}/product/${p.slug}`}
                            target="_blank"
                            className="block max-w-[18rem] truncate text-[12.5px] font-semibold text-pine-900 transition hover:text-teal-600"
                            title={tr(p.name, L, p.sku)}
                          >
                            {tr(p.name, L, p.sku)}
                          </Link>
                        </td>
                        <td className="px-3 py-2 font-mono text-[12px] whitespace-nowrap text-pine-800 tabular-nums">
                          {p.qty} {p.unit}
                        </td>
                        <td className="px-3 py-2 text-[11.5px] text-slate-warm-600">{p.note || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-3 text-[12.5px] text-slate-warm-500">
                {locale === 'ru' ? 'Продукты не выбраны.' : locale === 'en' ? 'No products selected.' : 'Mahsulot tanlanmagan.'}
              </p>
            )}

            <div className="mt-3">
              <Row
                label={t('form.volume')}
                value={lead.request.volume ? t(`form.volumeOptions.${lead.request.volume}` as DictKey) : null}
              />
              <Row
                label={t('form.frequency')}
                value={lead.request.frequency ? t(`form.frequency.${lead.request.frequency}` as DictKey) : null}
              />
              <Row label={t('form.budget')} value={lead.request.budget} />
              <Row label={t('form.deadline')} value={lead.request.deadline} mono />
              <Row
                label={t('form.interest')}
                value={lead.request.interest?.length
                  ? lead.request.interest.map((i) => t(`form.interest.${i}` as DictKey)).join(', ')
                  : null}
              />
            </div>

            {lead.request.message ? (
              <div className="mt-3 rounded-lg border border-cream-200 bg-cream-50 p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-warm-500">{t('form.message')}</p>
                <p className="mt-2 text-[13px] leading-relaxed whitespace-pre-wrap text-pine-900">{lead.request.message}</p>
              </div>
            ) : null}
          </section>

          {/* Manba */}
          <section className="rounded-xl border border-cream-200 bg-white p-4 shadow-soft">
            <h2 className="flex items-center gap-2 font-display text-[13.5px] font-extrabold tracking-tight text-pine-900">
              <Icon name="globe" size={16} className="text-teal-600" />
              {t('admin.lead.source')}
            </h2>
            <div className="mt-3">
              <Row label={t('common.selectLanguage')} value={lead.source.locale?.toUpperCase()} />
              <Row label={t('admin.lead.source')} value={lead.source.page} mono />
              <Row label="Referrer" value={lead.source.referrer} mono href={lead.source.referrer} />
              <Row label="IP" value={lead.source.ip} mono />
              <Row label={locale === 'ru' ? 'Страна' : locale === 'en' ? 'Country' : 'Davlat'} value={lead.source.country} />
              <Row label="User-Agent" value={lead.source.userAgent} mono />
              {lead.source.utm && Object.keys(lead.source.utm).length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {Object.entries(lead.source.utm).map(([k, v]) => (
                    <span key={k} className="rounded-md bg-mint-100 px-2 py-1 font-mono text-[11px] font-bold text-teal-700">
                      {k}={v}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          {/* Bildirishnomalar + tarix */}
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-cream-200 bg-white p-4 shadow-soft">
              <h2 className="flex items-center gap-2 font-display text-[13.5px] font-extrabold tracking-tight text-pine-900">
                <Icon name="send" size={16} className="text-teal-600" />
                {t('admin.lead.notifications')}
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {(['telegram', 'email', 'webhook'] as const).map((ch) => {
                  const v = lead.notifications?.[ch];
                  const ok = v === true;
                  return (
                    <li key={ch} className="flex items-center gap-2 text-[12.5px]">
                      <span className={`h-2 w-2 rounded-full ${ok ? 'bg-teal-500' : v ? 'bg-gold-500' : 'bg-cream-300'}`} aria-hidden />
                      <span className="font-semibold text-pine-800 capitalize">{ch}</span>
                      <span className="ml-auto truncate font-mono text-[11px] text-slate-warm-500">
                        {v === true ? 'OK' : v === false ? '—' : String(v).slice(0, 40)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 border-t border-cream-200 pt-2.5 text-[11.5px] leading-snug text-slate-warm-500">
                {lead.consent
                  ? t('form.consent')
                  : locale === 'ru'
                    ? 'Согласие на обработку данных не зафиксировано.'
                    : locale === 'en'
                      ? 'Data processing consent not recorded.'
                      : 'Ma\'lumotlarni qayta ishlashga rozilik qayd etilmagan.'}
              </p>
            </div>

            <div className="rounded-xl border border-cream-200 bg-white p-4 shadow-soft">
              <h2 className="flex items-center gap-2 font-display text-[13.5px] font-extrabold tracking-tight text-pine-900">
                <Icon name="refresh" size={16} className="text-teal-600" />
                {t('admin.lead.history')}
              </h2>
              {lead.history?.length ? (
                <ol className="mt-3 flex flex-col gap-2">
                  {lead.history.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-[12px]">
                      <span className="font-mono text-[11px] whitespace-nowrap text-slate-warm-500">
                        {formatDateTime(h.at, locale)}
                      </span>
                      <span className="truncate text-pine-800">
                        {tr(LEAD_STATUSES[h.from as keyof typeof LEAD_STATUSES]?.name, L, h.from)}
                        <Icon name="arrow-right" size={11} className="mx-1 inline text-slate-warm-400" />
                        <strong style={{ color: LEAD_STATUSES[h.to as keyof typeof LEAD_STATUSES]?.color }}>
                          {tr(LEAD_STATUSES[h.to as keyof typeof LEAD_STATUSES]?.name, L, h.to)}
                        </strong>
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-[12.5px] text-slate-warm-500">
                  {locale === 'ru' ? 'Изменений пока нет.' : locale === 'en' ? 'No changes yet.' : 'O‘zgarishlar yo‘q.'}
                </p>
              )}
            </div>
          </section>

          {/* Izohlar */}
          <section className="rounded-xl border border-cream-200 bg-white p-4 shadow-soft">
            <h2 className="flex items-center gap-2 font-display text-[13.5px] font-extrabold tracking-tight text-pine-900">
              <Icon name="quote" size={16} className="text-teal-600" />
              {t('admin.lead.notes')}
              <span className="ml-auto font-mono text-[11.5px] text-slate-warm-500">{lead.notes?.length ?? 0}</span>
            </h2>

            {lead.notes?.length ? (
              <ul className="mt-3 flex flex-col gap-2.5">
                {lead.notes.map((n, i) => (
                  <li key={i} className="rounded-lg border border-cream-200 bg-cream-50 p-3">
                    <p className="text-[12.5px] leading-relaxed whitespace-pre-wrap text-pine-900">{n.text}</p>
                    <p className="mt-1.5 flex items-center gap-2 font-mono text-[10.5px] text-slate-warm-500">
                      <Icon name="user" size={11} />
                      {n.author} · {formatDateTime(n.at, locale)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[12.5px] text-slate-warm-500">
                {locale === 'ru' ? 'Заметок пока нет — добавьте первую справа.' : locale === 'en' ? 'No notes yet — add the first one.' : 'Izoh yo‘q — o‘ngdagi formadan qo‘shing.'}
              </p>
            )}
          </section>
        </div>

        {/* ================= O'NG: AMALLAR ================= */}
        <aside className="flex flex-col gap-4 xl:sticky xl:top-4">
          <LeadActions id={lead.id} locale={L} status={lead.status} spamScore={lead.spamScore} />

          {/* Tezkor kontekst */}
          <section className="rounded-xl border border-cream-200 bg-white p-4 shadow-soft">
            <h2 className="font-display text-[13px] font-extrabold tracking-tight text-pine-900">
              {locale === 'ru' ? 'Быстрые действия' : locale === 'en' ? 'Quick actions' : 'Tezkor amallar'}
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              <li>
                <Link
                  href={`/${locale}/admin/leads?status=new`}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12.5px] font-semibold text-pine-800 transition hover:bg-mint-50 hover:text-teal-600"
                >
                  <Icon name="sparkles" size={15} className="text-teal-600" />
                  {t('admin.stats.new')}
                </Link>
              </li>
              <li>
                {/* CSV eksport — bu API endpoint (sahifa emas), shuning uchun oddiy <a> */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                                <a
                  href="/api/admin/leads/export?format=csv"
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12.5px] font-semibold text-pine-800 transition hover:bg-mint-50 hover:text-teal-600"
                >
                  <Icon name="download" size={15} className="text-teal-600" />
                  {t('admin.leads.export')}
                </a>
              </li>
              <li>
                <Link
                  href={`/${locale}/samples`}
                  target="_blank"
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12.5px] font-semibold text-pine-800 transition hover:bg-mint-50 hover:text-teal-600"
                >
                  <Icon name="box" size={15} className="text-teal-600" />
                  {t('box.title')}
                </Link>
              </li>
            </ul>

            <p className="mt-3 border-t border-cream-200 pt-3 text-[11.5px] leading-snug text-slate-warm-500">
              {statusMeta ? tr(statusMeta.name, L, lead.status) : lead.status} ·{' '}
              {locale === 'ru' ? 'качество' : locale === 'en' ? 'quality' : 'sifat'} {quality.score}/100
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   Kichik "label → qiymat" qatori (modul darajasida — har renderda
   qayta yaratilmasligi uchun)
   ------------------------------------------------------------ */

function Row({ label, value, mono, href }: { label: string; value?: string | null; mono?: boolean; href?: string }) {
  if (!value) return null;
  const body = (
    <span
      className={
        mono
          ? 'block truncate font-mono text-[12.5px] text-pine-900'
          : 'block truncate text-[12.5px] text-pine-900'
      }
      title={value}
    >
      {value}
    </span>
  );
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-cream-100 py-2 last:border-0">
      <span className="shrink-0 text-[11.5px] text-slate-warm-500">{label}</span>
      {href ? (
        <a
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="min-w-0 flex-1 text-right transition hover:text-teal-600"
        >
          {body}
        </a>
      ) : (
        <span className="min-w-0 flex-1 text-right">{body}</span>
      )}
    </div>
  );
}
