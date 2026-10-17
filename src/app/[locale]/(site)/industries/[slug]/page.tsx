/**
 * SOHA SAHIFASI (§5, design/Industry.dc.html)
 * ----------------------------------------------------------------
 * HERO   — chapda soha fotosi (+ "0N · Soha" ustbelgisi), o'ngda panel:
 *          breadcrumb · H1 · intro · 2 ta CTA · 2 ta stat kapsulasi
 *          (stat sonlari MA'LUMOTDAN: tavsiya etilgan pozitsiyalar va
 *           to'plamdagi namunalar soni — §7.1)
 * 01     — Vazifa → yechim: har qator 2 ta kartochka (slate + navy)
 * 02     — Tavsiya etilgan mahsulotlar jadvali (+ Namunaga)
 * 03     — Tayyor to'plam (navy panel, monogramma, 5 chip, "To'plamni olish")
 * OTHERS — boshqa sohalar chip'lari + "Barcha sohalar"
 *
 * Vazifa matnlari `lib/industry-copy.ts`dan (tayyor 3 tilli kontent),
 * YECHIM esa ma'lumotdan yig'iladi (`lib/design.ts → taskSolutions()`) —
 * texnik da'vo to'qilmaymiz, faqat katalogdagi haqiqat.
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata, breadcrumbLd, collectionPageLd } from '@/lib/seo';
import { applicationCounts, applicationProducts, queryCatalog } from '@/lib/catalog';
import { DUBAI_BESTSELLERS } from '@/lib/dubai-bestsellers';
import {
  APPLICATIONS,
  FEATURES,
  FORMS,
  tr,
  type Locale,
} from '@/lib/taxonomy';
import {
  APPLICATION_IMAGE,
  FALLBACK_IMAGE,
  industriesWithData,
  industrySet,
  monogramCopy,
  publicAssetExists,
  taskSolutions,
} from '@/lib/design';
import { industryCopy, industryIds } from '@/lib/industry-copy';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/PageHead';
import { Section, SectionHeader } from '@/components/ui/SectionHeader';
import { ButtonLink } from '@/components/ui/Button';
import { MonogramStatic, Reveal } from '@/components/motion';
import { IndustryProductsTable } from '@/components/industry/IndustryProducts';
import { IndustrySetButton } from '@/components/industry/IndustrySetButton';
import { ensureCatalog } from '@/lib/catalog-live';

const TABLE_LIMIT = 10;
const SET_SIZE = 5;

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  await ensureCatalog();
  // mahsuloti yo'q soha (masalan pet-food: matn bor, 0 pozitsiya) bo'sh sahifa
  // bo'lib qolmasin — router darajasida 404 (dynamicParams = false)
  const counts = applicationCounts();
  const ids = industryIds().filter((id) => (counts[id] ?? 0) > 0);
  return LOCALES.flatMap((locale) => ids.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await ensureCatalog();
  const { locale: raw, slug } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  const taxon = APPLICATIONS.find((a) => a.id === slug);

  if (!taxon) {
    return buildMetadata({ locale, title: t('industry.notFound'), path: '/404', noIndex: true });
  }

  const name = tr(taxon.name, locale as Locale);
  const count = applicationProducts(slug, TABLE_LIMIT, locale as Locale).length;

  return buildMetadata({
    locale,
    title: industryTitle(name, t('seo.industry.title', { name })),
    description: t('seo.industry.description', { name, count }),
    path: `/industries/${slug}`,
    image: publicAssetExists(APPLICATION_IMAGE[slug] ?? '') ? APPLICATION_IMAGE[slug] : FALLBACK_IMAGE,
  });
}

export default async function IndustryPage({ params }: Props) {
  await ensureCatalog();
  const { locale: raw, slug } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const L = locale as Locale;
  const t = makeT(locale);

  const taxon = APPLICATIONS.find((a) => a.id === slug);
  if (!taxon) notFound();

  const name = tr(taxon.name, L);
  const copy = industryCopy(slug);
  if (!copy) notFound();

  /* ---- ma'lumotdan ---- */
  const cards = applicationProducts(slug, TABLE_LIMIT, L);
  const setProducts = industrySet(slug, SET_SIZE);
  const solutions = taskSolutions(copy, L, 3);
  // raqam indeks sahifasidagi bilan bir xil (u faqat mahsuloti bor sohalarni sanaydi)
  const num = industriesWithData(L).find((a) => a.id === slug)?.num ?? '—';

  const formLabels = Object.fromEntries(FORMS.map((f) => [f.id, tr(f.name, L)]));
  const featureLabels = Object.fromEntries(FEATURES.map((f) => [f.id, tr(f.name, L)]));

  const heroImage = publicAssetExists(APPLICATION_IMAGE[slug] ?? '')
    ? (APPLICATION_IMAGE[slug] as string)
    : FALLBACK_IMAGE;

  // Dubay "Top Selling" — har nom katalogdagi mos aromatizatorlar soni bilan (0 bo'lsa chiqmaydi)
  const dubaiChips = (names: string[]) =>
    [...new Set(names)]
      .map((name) => ({ name, count: queryCatalog({ q: name, categories: ['flavours'] }, L).total }))
      .filter((x) => x.count > 0);
  const dubai = DUBAI_BESTSELLERS[slug];
  const dubaiTop = dubai ? dubaiChips(dubai.top) : [];
  const dubaiNew = dubai ? dubaiChips(dubai.fresh) : [];

  // faqat HAQIQATAN mahsuloti bor boshqa sohalar (§7.1)
  const others = industriesWithData(L)
    .filter((a) => a.id !== slug)
    .slice(0, 5);

  return (
    <>
      <JsonLdGroup
        items={[
          breadcrumbLd(
            [
              { name: t('nav.home'), path: '/' },
              { name: t('nav.industries'), path: '/industries' },
              { name, path: `/industries/${slug}` },
            ],
            locale,
          ),
          collectionPageLd(
            locale,
            name,
            tr(copy.intro, L),
            `/industries/${slug}`,
            cards.map((c) => ({ slug: c.slug, name: c.name })),
          ),
        ]}
      />

      {/* ============ HERO ============ */}
      <Section gap={false} className="flex flex-wrap gap-3 pt-2">
        <Reveal className="media-frame relative min-h-[clamp(384px,44.4vw,640px)] min-w-0 flex-1 basis-[480px] overflow-hidden rounded-block bg-line">
          <Image
            src={heroImage}
            alt={t('industry.heroAlt', { name })}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 46vw"
            className="object-cover"
          />
          <span className="absolute bottom-6 left-6 rounded-pill bg-white px-[18px] py-2.5 text-[15px] font-medium">
            {num} · {t('industry.eyebrow')}
          </span>
        </Reveal>

        <Reveal
          delay={0.08}
          y={24}
          className="flex min-w-0 flex-[1.1_1_520px] flex-col justify-between gap-10 rounded-block bg-panel p-[clamp(28px,4vw,56px)]"
        >
          <Breadcrumbs
            label={t('nav.industries')}
            items={[
              { label: t('nav.home'), href: `/${locale}` },
              { label: t('nav.industries'), href: `/${locale}/industries` },
              { label: name },
            ]}
          />

          <div className="flex flex-col gap-6">
            <h1 className="m-0 text-[clamp(39px,6vw,100px)] font-normal leading-[0.94] tracking-[-0.04em]">
              {name}
            </h1>
            <p className="m-0 max-w-[520px] text-body-l text-body">{tr(copy.intro, L)}</p>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href={`/${locale}/samples`} variant="accent" size="lg">
                {t('industry.getSet', { name })}
                <ArrowUpRight size={18} aria-hidden />
              </ButtonLink>
              <ButtonLink href={`/${locale}/contact`} variant="outline" size="lg">
                {t('industry.talkTech')}
              </ButtonLink>
            </div>
          </div>

          {/* stat kapsulasi — sonlar MA'LUMOTDAN (§7.1) */}
          <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(min(180px,100%),1fr))]">
            <Stat label={t('industry.statPositions')} value={cards.length} />
            <Stat label={t('industry.statSet')} value={setProducts.length} />
          </div>
        </Reveal>
      </Section>

      {/* ============ 01 · VAZIFA → YECHIM ============ */}
      <Section>
        <SectionHeader title={t('industry.taskSolution')} num="01" />

        <div className="flex flex-col gap-3 pt-[clamp(24px,3.1vw,40px)]">
          {solutions.map((s) => (
            <div
              key={s.task}
              className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]"
            >
              <Reveal className="flex flex-col gap-3.5 rounded-card bg-slate p-[clamp(24px,2.5vw,32px)] px-[clamp(24px,2.5vw,36px)] text-white">
                <span className="text-[14px] text-[#CAC8DA]">{t('industry.task')}</span>
                <span className="text-[clamp(24px,2.2vw,32px)] font-normal leading-[1.15] tracking-[-0.02em]">
                  {s.task}
                </span>
              </Reveal>

              <Reveal
                y={16}
                className="flex flex-col gap-3.5 rounded-card bg-navy p-[clamp(24px,2.5vw,32px)] px-[clamp(24px,2.5vw,36px)] text-white"
              >
                <span className="text-[14px] text-copper-light">{t('industry.solution')}</span>
                <span className="text-[18px] leading-normal">{s.solution}</span>
              </Reveal>
            </div>
          ))}
        </div>
      </Section>

      {/* ============ DUBAY XITLARI (gulfflavours.ae) ============ */}
      {dubaiTop.length ? (
        <Section>
          <SectionHeader title={t('industry.dubaiTopTitle')} rules="top" />
          <p className="m-0 max-w-[640px] pb-6 text-body-l text-muted">{t('industry.dubaiTopText')}</p>
          <div className="flex flex-wrap gap-2">
            {dubaiTop.map((x) => (
              <Link
                key={x.name}
                href={`/${locale}/catalog?q=${encodeURIComponent(x.name)}&categories=flavours`}
                className="cert-pill no-underline hover:border-ink"
              >
                {x.name} <span className="text-muted">· {x.count}</span>
              </Link>
            ))}
          </div>
          {dubaiNew.length ? (
            <div className="flex flex-col gap-3 pt-6">
              <span className="label">{t('industry.dubaiNew')}</span>
              <div className="flex flex-wrap gap-2">
                {dubaiNew.map((x) => (
                  <Link
                    key={x.name}
                    href={`/${locale}/catalog?q=${encodeURIComponent(x.name)}&categories=flavours`}
                    className="cert-pill no-underline hover:border-ink"
                  >
                    {x.name} <span className="text-muted">· {x.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </Section>
      ) : null}

      {/* ============ 02 · TAVSIYA ETILGAN MAHSULOTLAR ============ */}
      {cards.length ? (
        <Section>
          <SectionHeader title={t('industry.productsTitle')} num="02" rules="none" className="pb-8" />

          <IndustryProductsTable
            cards={cards}
            locale={L}
            productHrefBase={`/${locale}/catalog`}
            formLabels={formLabels}
            featureLabels={featureLabels}
            labels={{
              colProduct: t('catalog.col.product'),
              colForm: t('catalog.col.form'),
              colDose: t('catalog.col.dose'),
              colFeature: t('catalog.facet.feature'),
              colSample: t('catalog.col.sample'),
              openProduct: t('catalog.openProduct'),
              tableCaption: t('industry.productsTitle'),
              add: t('catalog.addSample'),
              added: t('catalog.addedSample'),
              remove: t('catalog.removeSample'),
              fullTpl: t.raw('samples.boxFullToast'),
            }}
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-pill bg-panel py-[18px] pl-[clamp(20px,2.5vw,36px)] pr-[18px] max-tab:rounded-card max-tab:p-6">
            <span className="text-body-l">{t('industry.allProductsHint', { name })}</span>
            <ButtonLink
              href={`/${locale}/catalog?applications=${slug}`}
              variant="outline"
              size="md"
              className="shrink-0"
            >
              {t('industries.seeProducts')}
              <ArrowUpRight size={18} aria-hidden />
            </ButtonLink>
          </div>
        </Section>
      ) : null}

      {/* ============ 03 · TAYYOR TO'PLAM ============ */}
      {setProducts.length ? (
        <Section>
          <Reveal
            data-surface="navy"
            className="flex flex-wrap items-center gap-10 rounded-block bg-navy p-[clamp(28px,4vw,56px)] text-white md:gap-16"
          >
            <MonogramStatic
              variant="joy"
              alt={monogramCopy(t).alt.joy}
              width={220}
              sizes="220px"
              className="w-[220px] shrink-0"
            />

            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
              <span className="text-[14px] text-copper-light">
                03 · {t('industry.setTitle')}
              </span>
              <span className="text-[clamp(36px,3.8vw,60px)] font-normal leading-none tracking-[-0.03em]">
                {t('industry.setName', { name })}
              </span>

              <div className="flex flex-wrap gap-2">
                {setProducts.map((p) => (
                  <span
                    key={p.sku}
                    className="rounded-pill border border-[#4A4878] px-4 py-2 text-[15px]"
                  >
                    {tr(p.name, L)}
                  </span>
                ))}
              </div>

              <span className="text-[16px] text-[#CAC8DA]">
                {t('industry.setMeta', {
                  count: setProducts.length,
                  days: siteConfig.business.sampleDeliveryDays,
                })}
              </span>
            </div>

            <IndustrySetButton
              setId={slug}
              items={setProducts.map((p) => ({
                sku: p.sku,
                slug: p.slug,
                name: p.name,
                unit: p.form === 'oil' ? ('ml' as const) : ('g' as const),
              }))}
              labels={{
                get: t('industry.setGet'),
                added: t('samples.setsAdded'),
                partialTpl: t.raw('samples.setsPartial'),
                fullTpl: t.raw('samples.boxFullToast'),
              }}
            />
          </Reveal>
        </Section>
      ) : null}

      {/* ============ BOSHQA SOHALAR ============ */}
      <Section className="pb-6">
        <span className="label">{t('industry.others')}</span>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {others.map((o) => (
            <Link
              key={o.id}
              href={`/${locale}/industries/${o.id}`}
              className="rounded-pill border border-line px-4 py-2.5 text-[15px] text-ink no-underline transition-colors hover:border-ink"
            >
              {o.label}
            </Link>
          ))}
          <Link href={`/${locale}/industries`} className="btn btn--primary btn--md">
            {t('industry.all')}
            <ArrowUpRight size={18} aria-hidden />
          </Link>
        </div>
      </Section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1 rounded-pill bg-white px-7 py-[18px]">
      <span className="text-[13px] italic text-muted">{label}</span>
      <span className="self-end text-[30px] font-semibold leading-none">{value}</span>
    </div>
  );
}

/**
 * Soha title'i: "{name}: aromatizatorlar". Nomning o'zida kalit so'z bo'lsa
 * ("Production of flavours") takrorlanmaydi; shablon + " — GFF Uzbekistan"
 * (17) 60 belgidan oshsa ham faqat nom qoladi (§13.1).
 */
function industryTitle(name: string, full: string): string {
  if (/aromatiz|ароматиз|flavour/i.test(name)) return name;
  return full.length <= 43 ? full : name;
}
