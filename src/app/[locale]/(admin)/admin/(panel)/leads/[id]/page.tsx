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

import { adminCopy } from '@/lib/admin-copy';
import { journey } from '@/lib/analytics-store';
import { SessionCard } from '@/components/admin/SessionCard';
import { requireAdmin } from '@/lib/guard';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
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
  // Layout qisman (RSC) navigatsiyada qayta render bo'lmaydi — himoya sahifaning o'zida ham
  if (!(await requireAdmin())) redirect(`/${normalizeLocale(raw)}/admin/login`);
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
  // o'z analitikamiz: ariza yuborgan tashrif buyuruvchining saytdagi yo'li (30 kun)
  const ac = adminCopy(locale);
  const visits = lead.source.visitorId ? journey({ vid: lead.source.visitorId, days: 30 }).slice(0, 5) : [];


  return (
    <div className="flex flex-col gap-4">
      {/* ================= SARLAVHA ================= */}
      <header className="flex flex-col gap-3">
        <Link
          href={listHref}
          className="inline-flex w-fit items-center gap-1.5 text-[12.5px] font-bold text-muted transition hover:text-copper-dark"
        >
          <Icon name="arrow-left" size={14} />
          {t('admin.lead.backToList')}
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3 rounded-[20px] border border-line-soft bg-white p-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-[clamp(1.1rem,2.4vw,1.45rem)] font-semibold tracking-tight text-ink">
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

            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="calendar" size={13} className="text-copper-dark" />
                {formatDateTime(lead.createdAt, locale)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="clock" size={13} className="text-copper-dark" />
                {timeAgo(lead.createdAt, locale)}
              </span>
              {lead.updatedAt !== lead.createdAt ? (
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="refresh" size={13} className="text-muted/70" />
                  {formatDateTime(lead.updatedAt, locale)}
                </span>
              ) : null}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
              {t('admin.lead.quality')}
            </span>
            <span className="font-display text-[2rem] leading-none font-semibold tracking-tight text-ink tabular-nums">
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
          <section className="rounded-[20px] border border-line-soft bg-white p-4">
            <h2 className="flex items-center gap-2 font-display text-[13.5px] font-semibold tracking-tight text-ink">
              <Icon name="phone" size={16} className="text-copper-dark" />
              {t('admin.lead.contact')}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a
                href={`tel:${lead.contact.phone.replace(/\D/g, '')}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-[14px] bg-navy px-3 font-mono text-[12.5px] font-bold text-white transition hover:bg-ink"
              >
                <Icon name="phone" size={14} />
                {lead.contact.phone}
              </a>
              {lead.contact.email ? (
                <a
                  href={`mailto:${lead.contact.email}`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-[14px] border border-line bg-white px-3 text-[12.5px] font-bold text-slate transition hover:border-copper hover:text-copper-dark"
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
                  className="inline-flex h-9 items-center gap-1.5 rounded-[14px] bg-[#229ED9] px-3 text-[12.5px] font-bold text-white transition hover:brightness-110"
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
          <section className="rounded-[20px] border border-line-soft bg-white p-4">
            <h2 className="flex items-center gap-2 font-display text-[13.5px] font-semibold tracking-tight text-ink">
              <Icon name="building" size={16} className="text-copper-dark" />
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
          <section className="rounded-[20px] border border-line-soft bg-white p-4">
            <h2 className="flex items-center gap-2 font-display text-[13.5px] font-semibold tracking-tight text-ink">
              <Icon name="box" size={16} className="text-copper-dark" />
              {t('admin.lead.request')}
            </h2>

            {products.length ? (
              <div className="mt-3 overflow-x-auto rounded-[14px] border border-line-soft">
                <table className="w-full min-w-[34rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line-soft bg-panel/50">
                      {['SKU', t('form.products'), t('samples.qtyLabel'), t('samples.noteLabel')].map((h, i) => (
                        <th key={i} scope="col" className="px-3 py-2 text-[10.5px] font-bold uppercase tracking-[0.1em] whitespace-nowrap text-muted">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.sku} className="border-b border-line-soft last:border-0">
                        <td className="px-3 py-2">
                          <Link
                            href={`/${locale}/product/${p.slug}`}
                            target="_blank"
                            className="font-mono text-[11.5px] font-bold text-copper-dark transition hover:underline"
                          >
                            {p.sku}
                          </Link>
                        </td>
                        <td className="px-3 py-2">
                          <Link
                            href={`/${locale}/product/${p.slug}`}
                            target="_blank"
                            className="block max-w-[18rem] truncate text-[12.5px] font-semibold text-ink transition hover:text-copper-dark"
                            title={tr(p.name, L, p.sku)}
                          >
                            {tr(p.name, L, p.sku)}
                          </Link>
                        </td>
                        <td className="px-3 py-2 font-mono text-[12px] whitespace-nowrap text-slate tabular-nums">
                          {p.qty} {p.unit}
                        </td>
                        <td className="px-3 py-2 text-[11.5px] text-muted">{p.note || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-3 text-[12.5px] text-muted">
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
              <div className="mt-3 rounded-[14px] border border-line-soft bg-panel/50 p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">{t('form.message')}</p>
                <p className="mt-2 text-[13px] leading-relaxed whitespace-pre-wrap text-ink">{lead.request.message}</p>
              </div>
            ) : null}
          </section>

          {/* Manba */}
          <section className="rounded-[20px] border border-line-soft bg-white p-4">
            <h2 className="flex items-center gap-2 font-display text-[13.5px] font-semibold tracking-tight text-ink">
              <Icon name="globe" size={16} className="text-copper-dark" />
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
                    <span key={k} className="rounded-md bg-panel px-2 py-1 font-mono text-[11px] font-bold text-copper-dark">
                      {k}={v}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          {/* Tashrif yo'li — qaysi sahifalardan o'tib ariza qoldirdi */}
          <section className="rounded-[20px] border border-line-soft bg-white p-4">
            <h2 className="mb-3 font-display text-[14px] font-semibold text-ink">{ac.session.journey}</h2>
            {visits.length ? (
              <div className="flex flex-col gap-3">
                {visits.map((s) => (
                  <SessionCard key={s.sid} session={s} locale={locale} copy={ac} />
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-muted">{ac.session.noJourney}</p>
            )}
          </section>

          {/* Bildirishnomalar + tarix */}
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[20px] border border-line-soft bg-white p-4">
              <h2 className="flex items-center gap-2 font-display text-[13.5px] font-semibold tracking-tight text-ink">
                <Icon name="send" size={16} className="text-copper-dark" />
                {t('admin.lead.notifications')}
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {(['telegram', 'email', 'webhook'] as const).map((ch) => {
                  const v = lead.notifications?.[ch];
                  const ok = v === true;
                  return (
                    <li key={ch} className="flex items-center gap-2 text-[12.5px]">
                      <span className={`h-2 w-2 rounded-full ${ok ? 'bg-ok' : v ? 'bg-copper' : 'bg-line'}`} aria-hidden />
                      <span className="font-semibold text-slate capitalize">{ch}</span>
                      <span className="ml-auto truncate font-mono text-[11px] text-muted">
                        {v === true ? 'OK' : v === false ? '—' : String(v).slice(0, 40)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 border-t border-line-soft pt-2.5 text-[11.5px] leading-snug text-muted">
                {lead.consent
                  ? t('form.consent')
                  : locale === 'ru'
                    ? 'Согласие на обработку данных не зафиксировано.'
                    : locale === 'en'
                      ? 'Data processing consent not recorded.'
                      : 'Ma\'lumotlarni qayta ishlashga rozilik qayd etilmagan.'}
              </p>
            </div>

            <div className="rounded-[20px] border border-line-soft bg-white p-4">
              <h2 className="flex items-center gap-2 font-display text-[13.5px] font-semibold tracking-tight text-ink">
                <Icon name="refresh" size={16} className="text-copper-dark" />
                {t('admin.lead.history')}
              </h2>
              {lead.history?.length ? (
                <ol className="mt-3 flex flex-col gap-2">
                  {lead.history.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-[12px]">
                      <span className="font-mono text-[11px] whitespace-nowrap text-muted">
                        {formatDateTime(h.at, locale)}
                      </span>
                      <span className="truncate text-slate">
                        {tr(LEAD_STATUSES[h.from as keyof typeof LEAD_STATUSES]?.name, L, h.from)}
                        <Icon name="arrow-right" size={11} className="mx-1 inline text-muted/70" />
                        <strong style={{ color: LEAD_STATUSES[h.to as keyof typeof LEAD_STATUSES]?.color }}>
                          {tr(LEAD_STATUSES[h.to as keyof typeof LEAD_STATUSES]?.name, L, h.to)}
                        </strong>
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-[12.5px] text-muted">
                  {locale === 'ru' ? 'Изменений пока нет.' : locale === 'en' ? 'No changes yet.' : 'O‘zgarishlar yo‘q.'}
                </p>
              )}
            </div>
          </section>

          {/* Izohlar */}
          <section className="rounded-[20px] border border-line-soft bg-white p-4">
            <h2 className="flex items-center gap-2 font-display text-[13.5px] font-semibold tracking-tight text-ink">
              <Icon name="quote" size={16} className="text-copper-dark" />
              {t('admin.lead.notes')}
              <span className="ml-auto font-mono text-[11.5px] text-muted">{lead.notes?.length ?? 0}</span>
            </h2>

            {lead.notes?.length ? (
              <ul className="mt-3 flex flex-col gap-2.5">
                {lead.notes.map((n, i) => (
                  <li key={i} className="rounded-[14px] border border-line-soft bg-panel/50 p-3">
                    <p className="text-[12.5px] leading-relaxed whitespace-pre-wrap text-ink">{n.text}</p>
                    <p className="mt-1.5 flex items-center gap-2 font-mono text-[10.5px] text-muted">
                      <Icon name="user" size={11} />
                      {n.author} · {formatDateTime(n.at, locale)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[12.5px] text-muted">
                {locale === 'ru' ? 'Заметок пока нет — добавьте первую справа.' : locale === 'en' ? 'No notes yet — add the first one.' : 'Izoh yo‘q — o‘ngdagi formadan qo‘shing.'}
              </p>
            )}
          </section>
        </div>

        {/* ================= O'NG: AMALLAR ================= */}
        <aside className="flex flex-col gap-4 xl:sticky xl:top-4">
          <LeadActions id={lead.id} locale={L} status={lead.status} spamScore={lead.spamScore} />

          {/* Tezkor kontekst */}
          <section className="rounded-[20px] border border-line-soft bg-white p-4">
            <h2 className="font-display text-[13px] font-semibold tracking-tight text-ink">
              {locale === 'ru' ? 'Быстрые действия' : locale === 'en' ? 'Quick actions' : 'Tezkor amallar'}
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              <li>
                <Link
                  href={`/${locale}/admin/leads?status=new`}
                  className="flex items-center gap-2 rounded-[14px] px-2.5 py-2 text-[12.5px] font-semibold text-slate transition hover:bg-panel hover:text-copper-dark"
                >
                  <Icon name="sparkles" size={15} className="text-copper-dark" />
                  {t('admin.stats.new')}
                </Link>
              </li>
              <li>
                {/* CSV eksport — bu API endpoint (sahifa emas), shuning uchun oddiy <a> */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                                <a
                  href="/api/admin/leads/export?format=csv"
                  className="flex items-center gap-2 rounded-[14px] px-2.5 py-2 text-[12.5px] font-semibold text-slate transition hover:bg-panel hover:text-copper-dark"
                >
                  <Icon name="download" size={15} className="text-copper-dark" />
                  {t('admin.leads.export')}
                </a>
              </li>
              <li>
                <Link
                  href={`/${locale}/samples`}
                  target="_blank"
                  className="flex items-center gap-2 rounded-[14px] px-2.5 py-2 text-[12.5px] font-semibold text-slate transition hover:bg-panel hover:text-copper-dark"
                >
                  <Icon name="box" size={15} className="text-copper-dark" />
                  {t('box.title')}
                </Link>
              </li>
            </ul>

            <p className="mt-3 border-t border-line-soft pt-3 text-[11.5px] leading-snug text-muted">
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
          ? 'block truncate font-mono text-[12.5px] text-ink'
          : 'block truncate text-[12.5px] text-ink'
      }
      title={value}
    >
      {value}
    </span>
  );
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line-soft py-2 last:border-0">
      <span className="shrink-0 text-[11.5px] text-muted">{label}</span>
      {href ? (
        <a
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="min-w-0 flex-1 text-right transition hover:text-copper-dark"
        >
          {body}
        </a>
      ) : (
        <span className="min-w-0 flex-1 text-right">{body}</span>
      )}
    </div>
  );
}
