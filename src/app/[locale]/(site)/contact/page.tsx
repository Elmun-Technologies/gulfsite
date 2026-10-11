/**
 * ALOQA (§5, design/Contact.dc.html)
 * ----------------------------------------------------------------
 * HEAD     — panel: breadcrumb · H1 · matn (o'ngda, pastga tekislangan)
 * CONTACTS — chap ustun: navy "Sotuv bo'limi" kapsulasi (telefon +
 *            "Qo'ng'iroq qilish") · EMAIL · TELEGRAM/INSTAGRAM ·
 *            ISH VAQTI · MANZIL (+ "Xaritada ochish") · BOSH OFIS VA ZAVOD
 * FORM     — o'ng ustun: so'rov turi pill'lari + maydonlar + rozilik
 *
 * `?type=` va `?product=` parametrlari formani oldindan to'ldiradi —
 * mahsulot sahifasidagi "Narx so'rash" / "Texnolog bilan maslahat"
 * tugmalari shu yerga olib keladi (§5).
 *
 * Telefon/e-mail/Telegram bosilganda analytics hodisasi yuboriladi (§12) —
 * bu client komponent (`FooterContact` usulida) `ContactLinks` da.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata, breadcrumbLd, localBusinessLd } from '@/lib/seo';
import { APPLICATIONS, sortTaxons, tr, type Locale } from '@/lib/taxonomy';
import { getProductBySku } from '@/lib/catalog';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { PageHead } from '@/components/ui/PageHead';
import { Section } from '@/components/ui/SectionHeader';
import { GffLeadForm } from '@/components/lead/GffLeadForm';
import { ContactLinks } from '@/components/layout/ContactLinks';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);

  return buildMetadata({
    locale,
    title: t('seo.contact.title'),
    description: t('seo.contact.description', { minutes: siteConfig.business.responseMinutes }),
    path: '/contact',
    image: '/images/warehouse.jpg',
  });
}

export default async function ContactPage({ params, searchParams }: Props) {
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const L = locale as Locale;
  const t = makeT(locale);

  const sp = await searchParams;
  const c = siteConfig.contact;
  const biz = siteConfig.business;

  const typeParam = typeof sp.type === 'string' ? sp.type : undefined;
  const productParam = typeof sp.product === 'string' ? sp.product : undefined;
  const docParam = typeof sp.doc === 'string' ? sp.doc : undefined;

  /* ---- ?product= / ?doc= → xabar matni oldindan to'ldiriladi ---- */
  const product = productParam ? getProductBySku(productParam) : undefined;
  const DOC_KEYS: Record<string, Parameters<typeof t>[0]> = {
    spec: 'product.docSpec',
    coa: 'product.docCoA',
    tds: 'product.docTds',
    msds: 'product.docMsds',
    halal: 'product.docHalal',
  };
  const prefill = [
    product ? `${tr(product.name, L)} (${product.sku})` : '',
    docParam && DOC_KEYS[docParam] ? t(DOC_KEYS[docParam]) : '',
  ]
    .filter(Boolean)
    .join(' · ');
  const defaultMessage = prefill ? t('contact.prefillMessage', { subject: prefill }) : '';

  const address =
    locale === 'ru' ? c.addressRu : locale === 'en' ? c.addressEn : c.address;

  const types = [
    { id: 'sample', label: t('contact.type.sample') },
    { id: 'price', label: t('contact.type.price') },
    { id: 'tech', label: t('contact.type.tech') },
    { id: 'partner', label: t('contact.type.partner') },
  ];

  const industries = sortTaxons([...APPLICATIONS]).map((a) => ({
    id: a.id,
    label: tr(a.name, L),
  }));

  return (
    <>
      <JsonLdGroup
        items={[
          localBusinessLd(),
          breadcrumbLd(
            [
              { name: t('nav.home'), path: '/' },
              { name: t('nav.contact'), path: '/contact' },
            ],
            locale,
          ),
        ]}
      />

      {/* ============ HEAD ============ */}
      <PageHead
        title={t('nav.contact')}
        crumbs={[{ label: t('nav.home'), href: `/${locale}` }, { label: t('nav.contact') }]}
        crumbLabel={t('nav.contact')}
        actions={
          <p className="m-0 max-w-[460px] text-body-l text-body">
            {t('contact.headText', { minutes: biz.responseMinutes })}
          </p>
        }
      />

      {/* ============ CONTACTS + FORM ============ */}
      <Section gap={false} className="flex flex-wrap items-start gap-3 pt-3">
        {/* ---- chap: kontakt kartochkalari ---- */}
        <ContactLinks
          locale={locale}
          className="grid min-w-0 flex-1 basis-[480px] gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))]"
          phoneCard={
            <div
              data-surface="navy"
              className="col-span-full flex flex-wrap items-center justify-between gap-5 rounded-card bg-navy px-[clamp(24px,2.5vw,36px)] py-8 text-white"
            >
              <span className="flex flex-col gap-2">
                <span className="text-[14px] text-copper-light">{t('contact.salesDept')}</span>
                <span className="text-[clamp(28px,2.8vw,40px)] font-normal tracking-[-0.02em]">
                  {c.phonePrimary}
                </span>
              </span>
              <a
                href={c.phonePrimaryHref}
                className="btn btn--accent btn--lg shrink-0"
                data-ga="cta_phone_call"
                data-track="phone"
              >
                <Phone size={18} strokeWidth={1.8} aria-hidden />
                {t('contact.callUs')}
              </a>
            </div>
          }
          cards={[
            {
              label: t('contact.emailLabel'),
              href: `mailto:${c.email}`,
              value: c.email,
              text: t('contact.emailText'),
              track: 'email',
              icon: <Mail size={18} strokeWidth={1.8} aria-hidden />,
            },
            {
              label: t('contact.socialLabel'),
              href: siteConfig.social.telegram,
              value: siteConfig.social.telegramHandle,
              extra: { href: siteConfig.social.instagram, label: siteConfig.social.instagramHandle },
              track: 'telegram',
            },
            {
              label: t('contact.hoursLabel'),
              value: t('contact.hoursWeek', { from: c.hoursWeekFrom, to: c.hoursWeekTo }),
              text: t('contact.hoursSat', { from: c.hoursSatFrom, to: c.hoursSatTo }),
            },
            {
              label: t('contact.addressLabel'),
              value: address,
              icon: <MapPin size={18} strokeWidth={1.8} aria-hidden />,
              extra: { href: c.mapsUrl, label: t('contact.openMap'), external: true },
            },
            {
              label: t('contact.hqLabel'),
              value: t('contact.hqValue', { phone: c.hqPhoneLabel }),
              href: `tel:${c.hqPhone}`,
            },
          ]}
        />

        {/* ---- o'ng: forma ---- */}
        <div className="min-w-0 flex-1 basis-[440px]">
          <div className="flex flex-col gap-6 rounded-block border border-line-soft p-[clamp(24px,3vw,40px)]">
            {/* sarlavha va matn GffLeadForm'ning o'zida (ikkilamchi <h2> yo'q) */}
            <GffLeadForm
              type="contact"
              locale={locale}
              variant="contact"
              defaultType={typeParam}
              defaultMessage={defaultMessage}
              thanksVars={{ minutes: biz.responseMinutes }}
              industries={industries}
              successLinks={[{ href: `/${locale}/catalog`, label: t('contact.viewCatalog') }]}
              labels={{
                title: t('contact.formTitle'),
                text: t('contact.formText', { minutes: biz.responseMinutes }),
                submit: t('form.submit'),
                typeLabel: t('contact.typeLabel'),
                types,
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
                messagePh: t('form.messagePh'),
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
          </div>

          {/* tez aloqa — Telegram */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-card bg-panel px-6 py-5">
            <span className="text-body-l">{t('contact.telegramHint')}</span>
            <Link
              href={siteConfig.social.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary btn--md shrink-0"
            >
              {siteConfig.social.telegramHandle}
              <ArrowUpRight size={18} aria-hidden />
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
