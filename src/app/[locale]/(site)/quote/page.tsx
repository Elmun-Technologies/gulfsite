/**
 * NARX SO'RASH (ZAYVKA) SAHIFASI
 * ----------------------------------------------------------------
 * Eng "issiq" lead turi: mijoz aniq hajm va muddatni biladi.
 * Shuning uchun bu sahifada:
 *   - hajm/s chastota/muddat maydonlari (sifat bahosini oshiradi)
 *   - hajm chegirmasi va shartnoma narxi haqida aniq va'da
 *   - javob berish muddati (30 daqiqa) — konversiyani oshiradi
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { makeT, normalizeLocale, type AppLocale, type DictKey } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata, breadcrumbLd, faqLd } from '@/lib/seo';
import { productCount } from '@/lib/catalog';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { LeadForm } from '@/components/lead/LeadForm';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Stat } from '@/components/ui/Display';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  return buildMetadata({
    locale,
    title: t('quote.title'),
    description: `${t('quote.subtitle')} Ishchi vaqtda ${siteConfig.business.responseMinutes} daqiqada javob beramiz. Hajm chegirmasi, shartnoma narxi, to‘liq hujjatlar to‘plami. ${siteConfig.contact.phonePrimary}`,
    path: '/quote',
    keywords: ['aromatizator narxi', 'оптовая цена ароматизаторов', 'ingredientlar narxi Toshkent', 'wholesale flavours price Uzbekistan'],
  });
}

export default async function QuotePage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw) as AppLocale;
  const t = makeT(locale);

  const biz = siteConfig.business;
  const crumbs = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('nav.quote'), href: `/${locale}/quote` },
  ];

  const promises: { icon: IconName; title: string; text: string }[] = [
    { icon: 'clock', title: t('quote.fastResponse'), text: `${biz.responseMinutes} min · ${siteConfig.contact.hours}` },
    { icon: 'trend-up', title: t('quote.volumeDiscount'), text: `${biz.discountThresholdKg} kg+ → −${biz.volumeDiscountPct}%` },
    { icon: 'invoice', title: t('quote.contractPrice'), text: t('quote.docsIncluded') },
    { icon: 'truck', title: t('samples.deliveryFree'), text: `${biz.minOrderKg} kg ${locale === 'ru' ? 'мин. заказ' : locale === 'en' ? 'min. order' : 'min. buyurtma'}` },
  ];

  const faq = [
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q6'), a: t('faq.a6') },
    { q: t('faq.q7'), a: t('faq.a7') },
  ];

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-cream-200 bg-pine-950 text-white">
        <div className="pattern-uzbek pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden />
        <div className="pointer-events-none absolute -right-32 -top-20 h-96 w-96 rounded-full bg-gold-500/12 blur-3xl" aria-hidden />
        <div className="container-x relative py-10 lg:py-14">
          <Breadcrumb items={crumbs} className="[&_a]:text-white/60 [&_a:hover]:text-mint-200 [&_span:last-child]:text-white" />
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-400">
                <Icon name="invoice" size={12} />
                B2B · {productCount()}+ {locale === 'ru' ? 'позиций' : locale === 'en' ? 'items' : 'pozitsiya'}
              </span>
              <h1 className="mt-3 max-w-2xl font-display text-[clamp(1.7rem,4.6vw,2.7rem)] leading-[1.08] font-extrabold tracking-tight text-white">
                {t('quote.title')}
              </h1>
              <p className="mt-3.5 max-w-xl text-[15px] leading-relaxed text-white/70">{t('quote.subtitle')}</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {promises.map((p) => (
                <div key={p.title} className="rounded-xl border border-white/12 bg-white/[0.06] p-3.5">
                  <Icon name={p.icon} size={19} className="text-mint-200" />
                  <p className="mt-2 text-[13px] leading-snug font-bold text-white">{p.title}</p>
                  <p className="mt-1 text-[11.5px] leading-snug text-white/60">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FORMA ================= */}
      <section className="container-x py-9 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start">
          <LeadForm
            type="quote"
            locale={locale}
            title={t('quote.title')}
            subtitle={t('form.secureNote')}
            submitLabel={t('form.submitQuote')}
            nextHref={`/${locale}/catalog`}
            nextLabel={t('nav.catalog')}
          />

          {/* Yon panel: nima uchun biz */}
          <div className="flex flex-col gap-3.5 lg:sticky lg:top-[5.5rem]">
            <div className="rounded-2xl border border-cream-200 bg-white p-5 shadow-soft">
              <h2 className="font-display text-[16px] font-extrabold text-pine-900">{t('why.title')}</h2>
              <ul className="mt-3.5 flex flex-col gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-mint-100 text-teal-600" aria-hidden>
                      <Icon name="check" size={14} strokeWidth={2.6} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-bold leading-snug text-pine-900">
                        {t(`why.${i}.title` as DictKey)}
                      </span>
                      <span className="mt-0.5 block text-[12.5px] leading-snug text-slate-warm-600">
                        {t(`why.${i}.text` as DictKey)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Stat icon="package" value={`${productCount()}+`} label={t('stats.products')} />
              <Stat icon="globe" value={siteConfig.stats.exportCountries} label={t('stats.export')} />
              <Stat icon="map-pin" value={siteConfig.stats.uzRegions} label={t('stats.regions')} />
              <Stat icon="award" value={`${siteConfig.stats.yearsExperience}+`} label={t('stats.years')} />
            </div>

            <div className="rounded-2xl bg-pine-900 p-5 text-white">
              <p className="font-display text-[15px] font-bold text-mint-200">{t('cta.orCall')}</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/65">{t('cta.fast')}</p>
              <div className="mt-3.5 flex flex-col gap-2">
                <a
                  href={siteConfig.contact.phonePrimaryHref}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white font-mono text-[14px] font-extrabold text-pine-900 transition hover:bg-mint-200"
                >
                  <Icon name="phone" size={16} />
                  {siteConfig.contact.phonePrimary}
                </a>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/25 text-[13.5px] font-bold text-white transition hover:bg-white/10"
                >
                  <Icon name="users" size={16} />
                  {t('contact.departments')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="border-t border-cream-200 bg-cream-100/60 py-12 lg:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <div>
            <span className="eyebrow">{t('faq.eyebrow')}</span>
            <h2 className="mt-2 font-display text-[clamp(1.3rem,3vw,1.8rem)] font-extrabold tracking-tight text-pine-900">
              {t('faq.title')}
            </h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-slate-warm-600">{t('faq.more')}</p>
            <Link
              href={`/${locale}/contact`}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl border border-pine-800/20 bg-white px-4 text-[13.5px] font-bold text-pine-800 transition hover:border-teal-500 hover:text-teal-600"
            >
              <Icon name="phone" size={16} />
              {t('nav.contact')}
            </Link>
          </div>

          <ul className="flex flex-col gap-2.5">
            {faq.map((f, i) => (
              <li key={i} className="rounded-2xl border border-cream-200 bg-white p-5 shadow-soft">
                <h3 className="flex items-start gap-2.5 font-display text-[15px] font-bold leading-snug text-pine-900">
                  <Icon name="help" size={17} className="mt-0.5 shrink-0 text-teal-600" />
                  {f.q}
                </h3>
                <p className="mt-2 pl-7 text-[13.5px] leading-relaxed text-slate-warm-700">{f.a}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <JsonLdGroup items={[breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href })), locale), faqLd(faq)]} />
    </>
  );
}
