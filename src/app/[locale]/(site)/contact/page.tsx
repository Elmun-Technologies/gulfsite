/**
 * ALOQA SAHIFASI
 * ----------------------------------------------------------------
 * B2B mijoz uchun muhimi: kimga qo'ng'iroq qilish, qayerga yozish,
 * qachon javob kelishi. Shuning uchun bu sahifada:
 *   - bo'limlar bo'yicha to'g'ridan-to'g'ri aloqalar
 *   - Toshkent ofisi/ombori + Dubay bosh ofisi
 *   - xarita
 *   - 2 ta forma: "qo'ng'iroq so'rash" (3 maydon) va "umumiy murojaat"
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata, breadcrumbLd, localBusinessLd } from '@/lib/seo';
import { formatUzPhone } from '@/lib/utils';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { LeadForm } from '@/components/lead/LeadForm';
import { Icon, type IconName } from '@/components/ui/Icon';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  return buildMetadata({
    locale,
    title: t('contact.title'),
    description: `${t('contact.subtitle')} ${siteConfig.contact.address}. ${formatUzPhone(siteConfig.contact.phonePrimary)}, ${siteConfig.contact.salesEmail}. ${siteConfig.contact.hours}`,
    path: '/contact',
    keywords: ['GFF O‘zbekiston aloqa', 'aromatizator yetkazib beruvchi Toshkent', 'контакты поставщика ароматизаторов Ташкент'],
  });
}

/** GFF bosh ofisi vakollari (gulfflavours.ae/contact dan) */
const HQ_REPS = [
  { name: 'Ghaybullah Boypochoev', role: { uz: 'Savdo direktori', ru: 'Директор по продажам', en: 'Sales Director' }, email: 'gaybul@gulfflavours.ae', phone: '+971505578721' },
  { name: 'Zokhir Nazarov', role: { uz: 'Savdo va marketing', ru: 'Продажи и маркетинг', en: 'Sales & Marketing' }, email: 'Sales@gff.co.ae', phone: '+971564089954' },
  { name: 'Mijgona Khaidarzoda', role: { uz: 'Savdo bo\'yicha mutaxassis', ru: 'Специалист по продажам', en: 'Sales Executive' }, email: 'mijgona@gff.co.ae', phone: '+971505525670' },
];

export default async function ContactPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw) as AppLocale;
  const t = makeT(locale);
  const c = siteConfig.contact;

  const address = locale === 'ru' ? c.addressRu : locale === 'en' ? c.addressEn : c.address;
  const crumbs = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('nav.contact'), href: `/${locale}/contact` },
  ];

  const departments: { icon: IconName; title: string; text: string; email: string; phone?: string }[] = [
    {
      icon: 'users',
      title: t('contact.sales'),
      text: locale === 'ru'
        ? 'Цены, наличие, коммерческие предложения, договоры.'
        : locale === 'en'
          ? 'Pricing, availability, quotations and contracts.'
          : 'Narxlar, mavjudlik, tijorat takliflari va shartnomalar.',
      email: c.salesEmail,
      phone: c.phonePrimary,
    },
    {
      icon: 'lab',
      title: t('contact.tech'),
      text: locale === 'ru'
        ? 'Подбор ароматизатора, дозировка, стабильность в вашем продукте.'
        : locale === 'en'
          ? 'Flavour selection, dosage and stability in your product.'
          : 'Aromatizator tanlash, doza va mahsulotdagi barqarorlik.',
      email: c.salesEmail,
    },
    {
      icon: 'truck',
      title: t('contact.logistics'),
      text: locale === 'ru'
        ? 'Доставка по Узбекистану, сроки, отгрузка со склада.'
        : locale === 'en'
          ? 'Delivery across Uzbekistan, lead times, warehouse dispatch.'
          : 'O‘zbekiston bo‘ylab yetkazish, muddatlar, ombordan jo‘natish.',
      email: c.email,
      phone: c.phoneSecondary,
    },
    {
      icon: 'invoice',
      title: t('contact.accounts'),
      text: locale === 'ru'
        ? 'Счета, закрывающие документы, сверка, оплата.'
        : locale === 'en'
          ? 'Invoices, closing documents, reconciliation and payment.'
          : 'Hisob-fakturalar, yopish hujjatlari, to‘lov.',
      email: c.email,
    },
  ];

  const places: { icon: IconName; title: string; lines: string[]; href?: string; hrefLabel?: string }[] = [
    {
      icon: 'building',
      title: t('contact.office'),
      lines: [address, c.hours],
      href: `https://www.google.com/maps/search/?api=1&query=${c.mapsQuery}`,
      hrefLabel: t('contact.mapHint'),
    },
    {
      icon: 'package',
      title: t('contact.warehouse'),
      lines: [
        locale === 'ru'
          ? 'Склад в Ташкенте — отгрузка в день заказа при наличии.'
          : locale === 'en'
            ? 'Tashkent warehouse — same-day dispatch when in stock.'
            : 'Toshkentdagi ombor — mavjud bo‘lsa buyurtma kuni jo‘natiladi.',
        `${siteConfig.business.minOrderKg} kg+ · ${t('samples.deliveryFree')}`,
      ],
    },
    {
      icon: 'globe',
      title: t('contact.headquarters'),
      lines: [c.hqAddress, 'Dubai, UAE · +971 4 883 3923', c.hqEmail],
      href: 'https://gulfflavours.ae/contact',
      hrefLabel: 'gulfflavours.ae',
    },
  ];

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-cream-200 bg-pine-950 text-white">
        <div className="pattern-uzbek pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden />
        <div className="container-x relative py-10 lg:py-14">
          <Breadcrumb items={crumbs} className="[&_a]:text-white/60 [&_a:hover]:text-mint-200 [&_span:last-child]:text-white" />
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end">
            <div>
              <h1 className="max-w-2xl font-display text-[clamp(1.7rem,4.6vw,2.7rem)] leading-[1.08] font-extrabold tracking-tight text-white">
                {t('contact.title')}
              </h1>
              <p className="mt-3.5 max-w-xl text-[15px] leading-relaxed text-white/70">{t('contact.subtitle')}</p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <a
                  href={c.phonePrimaryHref}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-teal-500 px-5 font-mono text-[15px] font-extrabold text-white transition hover:bg-teal-400"
                >
                  <Icon name="phone" size={18} />
                  {formatUzPhone(c.phonePrimary)}
                </a>
                <a
                  href={`mailto:${c.salesEmail}`}
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/25 px-5 text-[14px] font-bold text-white transition hover:bg-white/10"
                >
                  <Icon name="mail" size={17} />
                  {c.salesEmail}
                </a>
                {siteConfig.social.telegram ? (
                  <a
                    href={siteConfig.social.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#229ED9] px-5 text-[14px] font-bold text-white transition hover:brightness-110"
                  >
                    <Icon name="telegram" size={17} />
                    Telegram
                  </a>
                ) : null}
                <a
                  href={`https://wa.me/${c.phoneSecondary.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#25D366] px-5 text-[14px] font-bold text-white transition hover:brightness-110"
                >
                  <Icon name="whatsapp" size={17} />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Ish vaqti + tezkor raqamlar */}
            <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-5">
              <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-mint-200">
                <Icon name="clock" size={14} />
                {t('contact.hours')}
              </p>
              <p className="mt-2 text-[14px] font-semibold text-white">{c.hours}</p>
              <div className="mt-4 flex flex-col gap-2 border-t border-white/12 pt-4">
                <a href={c.phonePrimaryHref} className="flex items-center gap-2.5 text-[13.5px] text-white/75 transition hover:text-mint-200">
                  <Icon name="phone" size={14} className="text-teal-400" />
                  <span className="font-mono">{formatUzPhone(c.phonePrimary)}</span>
                  <span className="text-[11.5px] text-white/45">{t('contact.sales')}</span>
                </a>
                <a href={c.phoneSecondaryHref} className="flex items-center gap-2.5 text-[13.5px] text-white/75 transition hover:text-mint-200">
                  <Icon name="truck" size={14} className="text-teal-400" />
                  <span className="font-mono">{formatUzPhone(c.phoneSecondary)}</span>
                  <span className="text-[11.5px] text-white/45">{t('contact.logistics')}</span>
                </a>
                <a href={`mailto:${c.email}`} className="flex items-center gap-2.5 text-[13.5px] text-white/75 transition hover:text-mint-200">
                  <Icon name="mail" size={14} className="text-teal-400" />
                  <span>{c.email}</span>
                </a>
              </div>
              <p className="mt-4 rounded-lg bg-white/5 px-3 py-2 text-[11.5px] leading-snug text-white/55">
                {t('cta.fast').replace('{minutes}', String(siteConfig.business.responseMinutes))}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MANZILLAR + XARITA ================= */}
      <section className="container-x py-9 lg:py-14">
        <div className="grid gap-4 lg:grid-cols-3">
          {places.map((p) => (
            <div key={p.title} className="flex flex-col rounded-2xl border border-cream-200 bg-white p-5 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-100 text-teal-600" aria-hidden>
                <Icon name={p.icon} size={20} />
              </span>
              <h2 className="mt-3 font-display text-[15px] font-bold text-pine-900">{p.title}</h2>
              <div className="mt-2 flex flex-col gap-1.5">
                {p.lines.map((l, i) => (
                  <p key={i} className={i === 0 ? 'text-[13.5px] font-semibold leading-snug text-pine-800' : 'text-[12.5px] leading-snug text-slate-warm-600'}>
                    {l}
                  </p>
                ))}
              </div>
              {p.href ? (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1.5 pt-3.5 text-[12.5px] font-bold text-teal-600 transition hover:text-pine-800"
                >
                  <Icon name="map-pin" size={14} />
                  {p.hrefLabel}
                  <Icon name="arrow-up-right" size={12} />
                </a>
              ) : null}
            </div>
          ))}
        </div>

        {/* Xarita */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-soft">
          <div className="flex items-center justify-between gap-3 border-b border-cream-200 px-4 py-3">
            <p className="flex items-center gap-2 text-[13px] font-bold text-pine-900">
              <Icon name="map-pin" size={15} className="text-teal-600" />
              {t('contact.address')}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${c.mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-teal-600 transition hover:text-pine-800"
            >
              {t('contact.mapHint')}
              <Icon name="arrow-up-right" size={12} />
            </a>
          </div>
          <iframe
            title={t('contact.address')}
            src={`https://maps.google.com/maps?q=${c.mapsQuery}&z=14&output=embed`}
            width="100%"
            height="320"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full border-0 bg-cream-100"
          />
        </div>
      </section>

      {/* ================= FORMALAR ================= */}
      <section className="border-y border-cream-200 bg-cream-100/60 py-10 lg:py-14">
        <div className="container-x grid gap-6 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="font-display text-[clamp(1.2rem,2.8vw,1.6rem)] font-extrabold tracking-tight text-pine-900">
              {t('contact.callBack')}
            </h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-slate-warm-600">{t('contact.callBackHint')}</p>
            <LeadForm
              type="callback"
              locale={locale}
              className="mt-4"
              title={t('contact.callBack')}
              subtitle={t('contact.callBackHint')}
              submitLabel={t('form.submitCallback')}
            />
          </div>

          <div>
            <h2 className="font-display text-[clamp(1.2rem,2.8vw,1.6rem)] font-extrabold tracking-tight text-pine-900">
              {t('contact.writeUs')}
            </h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-slate-warm-600">{t('contact.subtitle')}</p>
            <LeadForm
              type="contact"
              locale={locale}
              className="mt-4"
              title={t('contact.writeUs')}
              subtitle={t('form.secureNote')}
              submitLabel={t('form.submit')}
            />
          </div>
        </div>
      </section>

      {/* ================= BO'LIMLAR ================= */}
      <section className="container-x py-10 lg:py-14">
        <h2 className="font-display text-[clamp(1.25rem,3vw,1.7rem)] font-extrabold tracking-tight text-pine-900">
          {t('contact.departments')}
        </h2>
        <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {departments.map((d) => (
            <div key={d.title} className="flex flex-col rounded-2xl border border-cream-200 bg-white p-4 shadow-soft transition hover:border-teal-500/30 hover:shadow-lift">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream-100 text-teal-600" aria-hidden>
                <Icon name={d.icon} size={19} />
              </span>
              <h3 className="mt-3 font-display text-[14px] font-bold text-pine-900">{d.title}</h3>
              <p className="mt-1.5 flex-1 text-[12.5px] leading-snug text-slate-warm-600">{d.text}</p>
              <div className="mt-3 flex flex-col gap-1.5 border-t border-cream-200 pt-3">
                {d.phone ? (
                  <a href={`tel:${d.phone.replace(/\D/g, '')}`} className="inline-flex items-center gap-1.5 font-mono text-[12.5px] font-bold text-pine-900 transition hover:text-teal-600">
                    <Icon name="phone" size={13} className="text-teal-600" />
                    {formatUzPhone(d.phone)}
                  </a>
                ) : null}
                <a href={`mailto:${d.email}`} className="inline-flex items-center gap-1.5 truncate text-[12.5px] text-slate-warm-600 transition hover:text-teal-600">
                  <Icon name="mail" size={13} className="text-teal-600" />
                  {d.email}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bosh ofis vakollari */}
        <div className="mt-10 rounded-2xl border border-cream-200 bg-white p-5 shadow-soft lg:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-[17px] font-extrabold tracking-tight text-pine-900">
                {t('contact.headquarters')} — {siteConfig.brand.full}
              </h2>
              <p className="mt-1.5 text-[13px] text-slate-warm-600">
                {locale === 'ru'
                  ? 'Прямые контакты отдела продаж завода в Дубае — для крупных и экспортных заказов.'
                  : locale === 'en'
                    ? 'Direct contacts of the Dubai plant sales team — for large and export orders.'
                    : 'Dubaydagi zavod savdo bo‘limining to‘g‘ridan-to‘g‘ri aloqalari — yirik va eksport buyurtmalari uchun.'}
              </p>
            </div>
            <a
              href="https://gulfflavours.ae/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-pine-800/20 px-3 text-[13px] font-semibold text-pine-800 transition hover:border-teal-500 hover:text-teal-600"
            >
              gulfflavours.ae
              <Icon name="arrow-up-right" size={13} />
            </a>
          </div>

          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {HQ_REPS.map((r) => (
              <li key={r.email} className="rounded-xl border border-cream-200 bg-cream-50 p-4">
                <p className="text-[13.5px] font-bold text-pine-900">{r.name}</p>
                <p className="mt-0.5 text-[11.5px] font-semibold uppercase tracking-wide text-teal-600">
                  {r.role[locale === 'en' ? 'en' : locale === 'ru' ? 'ru' : 'uz']}
                </p>
                <div className="mt-2.5 flex flex-col gap-1.5">
                  <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 truncate text-[12px] text-slate-warm-700 transition hover:text-teal-600">
                    <Icon name="mail" size={13} className="shrink-0 text-teal-600" />
                    {r.email}
                  </a>
                  <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1.5 font-mono text-[12px] text-slate-warm-700 transition hover:text-teal-600">
                    <Icon name="phone" size={13} className="shrink-0 text-teal-600" />
                    {r.phone}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-[13px] text-slate-warm-600">
          {t('footer.distributor')}{' '}
          <Link href={`/${locale}/about`} className="font-semibold text-teal-600 underline decoration-teal-500/40 underline-offset-2">
            {t('nav.about')}
          </Link>
        </p>
      </section>

      <JsonLdGroup items={[breadcrumbLd(crumbs.map((x) => ({ name: x.label, path: x.href })), locale), localBusinessLd()]} />
    </>
  );
}
