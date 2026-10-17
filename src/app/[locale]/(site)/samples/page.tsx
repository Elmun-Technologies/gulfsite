/**
 * NAMUNA QUTISI (§5, design/Samples.dc.html) — ASOSIY KONVERSIYA MAQSADI
 * ----------------------------------------------------------------
 * Bo'limlar:
 *   HEAD  — breadcrumb · H1 · matn · 4 ta pill · 01/02/03 qadam kapsulasi
 *   BOX + FORM — chapda quti muharriri, o'ngda lead formasi (`samples`)
 *   SETS  — tayyor to'plamlar (ma'lumotdan, 5 SKU har birida)
 *   FAQ   — tabiiy <details> akkordeon + FAQPage JSON-LD
 *
 * Barcha sonlar (8 · 25–100 g · 3 ish kuni · to'plam tarkibi) ma'lumot
 * va `siteConfig`dan olinadi — komponentlarda hardcode yo'q (§7.1).
 */

import type { Metadata } from 'next';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata, breadcrumbLd, faqLd } from '@/lib/seo';
import { allProducts } from '@/lib/catalog';
import { FORMS, PACKAGING, UZ_REGIONS, tr, type Locale } from '@/lib/taxonomy';
import { readySets } from '@/lib/design';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { PageHead } from '@/components/ui/PageHead';
import { Section, SectionHeader } from '@/components/ui/SectionHeader';
import { Faq } from '@/components/ui/Faq';
import { SampleBoxEditor } from '@/components/sample/SampleBoxEditor';
import { SampleSets, type SetPayload } from '@/components/sample/SampleSets';
import { SamplesFormBridge } from '@/components/sample/SamplesFormBridge';
import { ensureCatalog } from '@/lib/catalog-live';

interface Props {
  params: Promise<{ locale: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  await ensureCatalog();
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await ensureCatalog();
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  const biz = siteConfig.business;

  return buildMetadata({
    locale,
    title: t('seo.samples.title', { max: biz.sampleBoxMaxItems }),
    description: t('seo.samples.description', {
      max: biz.sampleBoxMaxItems,
      days: biz.sampleDeliveryDays,
    }),
    path: '/samples',
    image: '/images/sample-box.jpg',
    keywords: ['bepul namuna', 'namuna qutisi', 'test box', 'бесплатные образцы', 'free samples'],
  });
}

export default async function SamplesPage({ params }: Props) {
  await ensureCatalog();
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const L = locale as Locale;
  const t = makeT(locale);

  const biz = siteConfig.business;
  const products = allProducts();

  /* ---- element meta qatori: "GFFD6832 · Suyuq" ---- */
  const formLabels = Object.fromEntries(FORMS.map((f) => [f.id, tr(f.name, L)]));
  const metaBySku: Record<string, string> = {};
  for (const p of products) {
    metaBySku[p.sku] = `${p.sku} · ${formLabels[p.form] ?? p.form}`;
  }

  /* ---- tayyor to'plamlar (§7.2 — ma'lumotdan) ---- */
  const sets: SetPayload[] = readySets(5).map((s) => ({
    id: s.id,
    title: t(s.titleKey as never),
    image: s.image,
    dark: s.dark,
    chips: s.products.map((p) => tr(p.name, L)),
    items: s.products.map((p) => ({
      sku: p.sku,
      slug: p.slug,
      name: p.name,
      unit: p.form === 'oil' ? ('ml' as const) : ('g' as const),
    })),
  }));

  /* ---- FAQ (§13.4 FAQPage bilan bir xil matn) ---- */
  const packs = PACKAGING.filter((p) => [1, 5, 10, 25].includes(p.kg))
    .map((p) => p.kg)
    .join(', ');

  const faqItems = [
    { q: t('samples.faq1Q'), a: t('samples.faq1A') },
    { q: t('samples.faq2Q'), a: t('samples.faq2A', { days: biz.sampleDeliveryDays }) },
    {
      q: t('samples.faq3Q'),
      a: t('samples.faq3A', {
        moq: t('samples.moqValue', { kg: biz.minOrderKg }),
        packs: `${packs} kg`,
      }),
    },
    { q: t('samples.faq4Q'), a: t('samples.faq4A') },
    {
      q: t('samples.faq5Q'),
      a: t('samples.faq5A', { raw: siteConfig.stats.rawMaterials }),
    },
  ];

  const regions = UZ_REGIONS.map((r) => ({ id: r.id, label: tr(r.name, L) }));

  return (
    <>
      <JsonLdGroup
        items={[
          breadcrumbLd(
            [
              { name: t('nav.home'), path: '/' },
              { name: t('nav.samples'), path: '/samples' },
            ],
            locale,
          ),
          faqLd(faqItems),
        ]}
      />

      {/* ============ HEAD ============ */}
      <PageHead
        title={t('nav.samples')}
        text={t('samples.headText', { max: biz.sampleBoxMaxItems })}
        crumbs={[{ label: t('nav.home'), href: `/${locale}` }, { label: t('nav.samples') }]}
        crumbLabel={t('nav.samples')}
        aside={
          <>
            <StepCapsule num="01" label={t('samples.step1')} tone="navy" />
            <StepCapsule num="02" label={t('samples.step2Short')} tone="panel" />
            <StepCapsule num="03" label={t('samples.step3Short')} tone="copper" />
          </>
        }
      >
        <div className="flex flex-wrap gap-2">
          <HeadPill>{t('samples.pillItems', { max: biz.sampleBoxMaxItems })}</HeadPill>
          <HeadPill>
            {t('samples.pillSizes', { min: biz.sampleMinVolume, max: biz.sampleMaxVolume })}
          </HeadPill>
          <HeadPill>{t('samples.pillDays', { days: biz.sampleDeliveryDays })}</HeadPill>
          <HeadPill>{t('samples.pillFree')}</HeadPill>
        </div>
      </PageHead>

      {/* ============ BOX + FORM ============ */}
      <Section gap={false} className="flex flex-wrap items-start gap-3 pt-3">
        <SampleBoxEditor
          locale={L}
          catalogHref={`/${locale}/catalog`}
          formHref="#sample-form"
          metaBySku={metaBySku}
          labels={{
            title: t('samples.boxTitle'),
            progressLabel: t.raw('samples.progressLine'),
            emptyTitle: t('samples.boxEmpty'),
            emptyHint: t('samples.boxEmptyHint'),
            addFromCatalog: t('samples.addFromCatalog'),
            orderBox: t('samples.orderBox'),
            removeItem: t.raw('samples.removeItem'),
            sizeLabel: t('product.sampleSize'),
            gram: t('product.gram'),
            fullTpl: t.raw('samples.boxFullToast'),
            clear: t('samples.clear'),
            clearConfirm: t('samples.clearConfirm'),
            noteLabel: t('samples.noteLabel'),
            notePlaceholder: t('samples.notePlaceholder'),
          }}
        />

        <div id="sample-form" className="min-w-0 flex-1 basis-[420px] scroll-mt-28">
          <SamplesFormBridge
            locale={locale}
            catalogHref={`/${locale}/catalog`}
            responseMinutes={biz.responseMinutes}
            regions={regions}
            labels={{
              title: t('samples.orderBox'),
              text: t('samples.formText', { days: biz.sampleDeliveryDays }),
              submit: t('samples.submit'),
              name: t('form.fullName'),
              namePh: t('form.fullNamePh'),
              position: t('samples.formPosition'),
              positionPh: t('form.positionPh'),
              company: t('form.company'),
              companyPh: t('form.companyPh'),
              phone: t('form.phone'),
              email: t('form.email'),
              message: t('samples.formProduce'),
              messagePh: t('form.messagePh'),
              region: t('samples.formRegion'),
              address: t('samples.formAddress'),
              addressPh: t('form.addressPh'),
              consent: t('form.consentShort'),
              privacy: t('form.consentLink'),
              thanks: t('samples.successTitle'),
              thanksText: t.raw('samples.successText'),
              required: t('form.required'),
              errPhone: t('form.errPhone'),
              errName: t('form.errName'),
              errCompany: t('form.errCompany'),
              errConsent: t('form.errConsent'),
              errServer: t('form.errServer'),
            }}
            successLinks={[
              { href: `/${locale}/catalog`, label: t('samples.backToCatalog') },
            ]}
            submitHint={t('samples.submitHint', { minutes: biz.responseMinutes })}
            emptyWarning={t('samples.boxEmptyWarn')}
            emptyWarningHint={t('samples.boxEmptyHint')}
            catalogCta={t('samples.goToCatalog')}
          />
        </div>
      </Section>

      {/* ============ SETS ============ */}
      <Section>
        <SectionHeader
          title={t('samples.setsTitle')}
          rules="both"
          aside={
            <span className="max-w-[360px] text-[16px] leading-snug text-muted">
              {t('samples.setsText', { count: sets[0]?.items.length ?? 5 })}
            </span>
          }
        />

        <SampleSets
          sets={sets}
          labels={{
            add: t('samples.setsAdd'),
            added: t('samples.setsAdded'),
            partialTpl: t.raw('samples.setsPartial'),
            fullTpl: t.raw('samples.boxFullToast'),
            sizeLabel: t('product.sampleSize'),
          }}
        />
      </Section>

      {/* ============ FAQ ============ */}
      <Section>
        <Faq
          title={t('samples.faqTitle')}
          items={faqItems}
          moreLabel={t('samples.faqMore')}
          moreHref={`/${locale}/contact`}
        />
      </Section>
    </>
  );
}

/* ---------------- head yordamchilari ---------------- */

function HeadPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-pill bg-white px-4 py-[9px] text-[15px] font-medium">{children}</span>
  );
}

/** 01/02/03 qadam kapsulasi — radius 999, min-height 120px */
function StepCapsule({ num, label, tone }: { num: string; label: string; tone: 'navy' | 'panel' | 'copper' }) {
  const bg = tone === 'navy' ? 'bg-navy text-white' : tone === 'copper' ? 'bg-copper text-ink' : 'bg-panel text-ink';
  const numColor = tone === 'navy' ? 'text-copper-light' : tone === 'copper' ? 'text-ink' : 'text-copper-dark';

  return (
    <div
      className={`flex min-h-[120px] flex-1 items-center gap-5 rounded-pill px-[clamp(24px,2.5vw,36px)] ${bg}`}
    >
      <span className={`text-[15px] ${numColor}`}>{num}</span>
      <span className="text-[clamp(22px,2.4vw,36px)] font-normal tracking-[-0.02em]">{label}</span>
    </div>
  );
}
