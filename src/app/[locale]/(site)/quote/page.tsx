/**
 * NARX SO'RASH (RFQ) — §5 (Contact/Samples tuzilmasi asosida)
 * ----------------------------------------------------------------
 * Dizayn paketida alohida "Quote" sahifasi YO'Q — bu mavjud biznes
 * yo'nalishi (eng "issiq" lead turi: mijoz hajm va muddatni biladi).
 * Shuning uchun u Contact sahifasi bilan bir xil qurilish bloklari
 * (PageHead + aside, GffLeadForm, Faq) da yangi dizaynga o'tkazildi;
 * mantiq va ma'lumot saqlangan (§2).
 *
 * Nima saqlangan:
 *   · lead turi `quote` (§11.1) — shu turi bilan /api/leads ga ketadi
 *   · va'dalar `siteConfig.business` dan HISOBLANADI (§7.1):
 *     javob muddati, chegirma ostona/p foizi, min. buyurtma
 *   · FAQ va JSON-LD (`BreadcrumbList` + `FAQPage`, §13.4)
 */

import type { Metadata } from 'next';
import { LOCALES, makeT, normalizeLocale, type AppLocale, type DictKey } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata, breadcrumbLd, faqLd } from '@/lib/seo';
import { productCount } from '@/lib/catalog';
import { Clock, FileText, Percent, Truck } from 'lucide-react';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { PageHead } from '@/components/ui/PageHead';
import { Section, SectionHeader } from '@/components/ui/SectionHeader';
import { Faq } from '@/components/ui/Faq';
import { CountUp, Reveal } from '@/components/motion';
import { GffLeadForm } from '@/components/lead/GffLeadForm';
import { ensureCatalog } from '@/lib/catalog-live';

interface Props {
  params: Promise<{ locale: string }>;
}

/**
 * `true`: `false` bo'lganda admin saqlagan paytdagi revalidatsiyadan keyin
 * (revalidatePath / ISR) sahifa qayta yaratilmay `NoFallbackError` → 404
 * bo'lib qolardi (standalone, 2026-10-17 tekshirilgan). Noma'lum slug uchun
 * haqiqiy 404 — `proxy.ts` da (`catalogPathMissing`).
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  await ensureCatalog();
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await ensureCatalog();
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);

  return buildMetadata({
    locale,
    title: t('quote.title'),
    description: t('seo.quote.description', {
      minutes: siteConfig.business.responseMinutes,
      count: productCount(),
    }),
    path: '/quote',
    keywords: [
      'aromatizator narxi',
      'оптовая цена ароматизаторов',
      'ingredientlar narxi Toshkent',
      'wholesale flavours price Uzbekistan',
    ],
  });
}

export default async function QuotePage({ params }: Props) {
  await ensureCatalog();
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const t = makeT(locale);

  const biz = siteConfig.business;
  const crumbs = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('quote.title') },
  ];

  /* ---- va'dalar: SONLAR CONFIG'DAN (§7.1) ---- */
  const promises = [
    {
      Icon: Clock,
      title: t('quote.fastResponse'),
      text: t('quote.responseValue', { minutes: biz.responseMinutes, hours: siteConfig.contact.hours }),
    },
    {
      Icon: Percent,
      title: t('quote.volumeDiscount'),
      text: t('quote.discountValue', {
        kg: biz.discountThresholdKg,
        pct: biz.volumeDiscountPct,
      }),
    },
    {
      Icon: FileText,
      title: t('quote.contractPrice'),
      text: t('quote.docsIncluded'),
    },
    {
      Icon: Truck,
      title: t('samples.deliveryFree'),
      text: t('quote.minOrderValue', { kg: biz.minOrderKg }),
    },
  ];

  /* ---- nima uchun biz (§15) ---- */
  const why = [1, 2, 3, 4, 5].map((i) => ({
    title: t(`why.${i}.title` as DictKey),
    text: t(`why.${i}.text` as DictKey),
  }));

  /* ---- FAQ ---- */
  const faq = [2, 4, 6, 7].map((i) => ({
    q: t(`faq.q${i}` as DictKey),
    a: t(`faq.a${i}` as DictKey, i === 2 ? { min: biz.minOrderKg } : undefined),
  }));

  const stats = [
    { value: productCount(), suffix: '+', label: t('stats.products') },
    { value: siteConfig.stats.exportCountries, label: t('stats.export') },
    { value: siteConfig.stats.uzRegions, label: t('stats.regions') },
    { value: siteConfig.stats.yearsExperience, suffix: '+', label: t('stats.years') },
  ];

  return (
    <>
      <JsonLdGroup
        items={[
          breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href ?? '/quote' })), locale),
          faqLd(faq),
        ]}
      />

      {/* ============ HEAD + VA'DALAR ============ */}
      <PageHead
        title={t('quote.title')}
        text={t('quote.subtitle')}
        count={t('catalog.positionsShort', { count: productCount() })}
        crumbs={crumbs}
        crumbLabel={t('quote.title')}
        aside={
          <div className="grid grid-cols-2 gap-3">
            {promises.map((p, i) => (
              <Reveal
                key={p.title}
                delay={i * 0.06}
                className="flex flex-col gap-2.5 rounded-card border border-line bg-white px-5 py-5"
              >
                <p.Icon size={20} strokeWidth={1.8} className="text-copper-dark" aria-hidden />
                <span className="text-[14px] font-semibold leading-snug text-ink">{p.title}</span>
                <span className="text-[13px] leading-snug text-muted">{p.text}</span>
              </Reveal>
            ))}
          </div>
        }
      />

      {/* ============ FORMA + "NEGA BIZ" ============ */}
      <Section className="flex flex-wrap items-start gap-3">
        <div className="flex min-w-0 flex-[1.6_1_560px] flex-col gap-3">
          <GffLeadForm
            type="quote"
            locale={locale}
            variant="contact"
            defaultType="quote"
            thanksVars={{ minutes: biz.responseMinutes }}
            submitHint={t('quote.submitHint', { minutes: biz.responseMinutes })}
            successLinks={[
              { href: `/${locale}/catalog`, label: t('contact.viewCatalog') },
              { href: `/${locale}/samples`, label: t('nav.getSample') },
            ]}
            labels={{
              title: t('quote.title'),
              text: t('form.secureNote'),
              submit: t('form.submitQuote'),
              typeLabel: t('contact.typeLabel'),
              types: [],
              name: t('form.fullName'),
              namePh: t('form.fullNamePh'),
              position: t('form.position'),
              positionPh: t('form.positionPh'),
              company: t('form.company'),
              companyPh: t('form.companyPh'),
              phone: t('form.phone'),
              email: t('form.email'),
              industry: t('contact.fIndustry'),
              message: t('form.message'),
              messagePh: t('quote.messagePh'),
              consent: t('form.consentShort'),
              privacy: t('form.consentLink'),
              thanks: t('contact.thanks'),
              thanksText: t.raw('contact.thanksText'),
              required: t('form.required'),
              errPhone: t('form.errPhone'),
              errName: t('form.errName'),
              errCompany: t('form.errCompany'),
              errConsent: t('form.errConsent'),
              errServer: t('form.errServer'),
            }}
          />
          {/* yuborishdan keyingi `{type}` va `{minutes}` — shablon klientda to'ldiriladi */}
        </div>

        <div className="flex min-w-0 flex-1 basis-[320px] flex-col gap-3">
          <Reveal className="flex flex-col gap-4 rounded-card bg-panel p-[clamp(24px,3vw,32px)]">
            <h2 className="m-0 text-h4">{t('why.title')}</h2>
            <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
              {why.map((w) => (
                <li key={w.title} className="flex flex-col gap-1">
                  <span className="text-[14px] font-semibold leading-snug text-ink">{w.title}</span>
                  <span className="text-[13.5px] leading-snug text-muted">{w.text}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.06} className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col gap-1 rounded-card border border-line bg-white px-5 py-4"
              >
                <span className="font-display text-[clamp(26px,2.6vw,36px)] font-light leading-none text-ink">
                  <CountUp value={s.value} suffix={s.suffix ?? ''} />
                </span>
                <span className="text-[13px] leading-snug text-muted">{s.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* ============ FAQ ============ */}
      <Section gap={false} className="flex flex-wrap items-start gap-8 pb-6">
        <div className="flex min-w-0 flex-1 basis-[280px] flex-col gap-4">
          <SectionHeader title={t('faq.title')} rules="top" />
          <p className="m-0 max-w-[340px] text-body-l text-muted">{t('faq.more')}</p>
        </div>

        <Faq
          className="min-w-0 flex-[1.6_1_560px]"
          title=""
          items={faq}
          moreLabel={t('nav.contact')}
          moreHref={`/${locale}/contact`}
          firstOpen
        />
      </Section>
    </>
  );
}
