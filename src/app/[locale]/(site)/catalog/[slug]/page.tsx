/**
 * MAHSULOT SAHIFASI (§5, design/Product.dc.html)
 * ----------------------------------------------------------------
 * Kanonik URL — `/catalog/<slug>` (katalog ichidagi detal, §13.3).
 * Eski `/product/<slug>` havolalari shu yerga 301 bilan yo'naltiriladi.
 *
 * Bo'limlar:
 *   breadcrumb + galereya + ma'lumot paneli + afzalliklar/saqlash
 *   01 · Qo'llanilishi  (ilova kartalari + navy dozirovka kapsulasi)
 *   02 · Texnik hujjatlar (chapda sarlavha, o'ngda hujjat qatorlari)
 *   03 · Birga tanlanadi (4 ta matnli kartochka)
 *
 * Hamma matn lug'atdan, hamma son ma'lumotdan (§7.1, §10.1).
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Download } from 'lucide-react';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata, clipText, breadcrumbLd, productLd } from '@/lib/seo';
import { allProducts, getProductBySlug, relatedProducts } from '@/lib/catalog';
import {
  ALL_GROUPS,
  APPLICATIONS,
  CATEGORIES,
  FEATURES,
  FORMS,
  tr,
  type Locale,
} from '@/lib/taxonomy';
import { BENEFITS, applicationLabel, productDescription, storageText } from '@/lib/catalog-copy';
import {
  APPLICATION_IMAGE,
  CATEGORY_IMAGE,
  FALLBACK_IMAGE,
  PACK_IMAGES,
  publicAssetExists,
} from '@/lib/design';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/PageHead';
import { Section, SectionHeader } from '@/components/ui/SectionHeader';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/motion';
import { ProductGallery, type GallerySlide } from '@/components/product/ProductGallery';
import { ProductInfoPanel } from '@/components/product/ProductInfoPanel';
import { ProductStickyBar } from '@/components/product/ProductStickyBar';

const MAX_RELATED = 4;

/**
 * `false` — barcha 617 slug `generateStaticParams` da oldindan
 * yaratiladi, shuning uchun noma'lum slug ROUTER darajasida 404 bo'ladi.
 *
 * Nega bu muhim: `dynamicParams = true` bo'lganda production'da noma'lum
 * slug uchun javob **200 + `loading.tsx` skeleti** edi (soft-404) —
 * `notFound()` Suspense chegarasi ichida otildi, javob allaqachon
 * flush bo'lgan shell bilan 200 sifatida keshlangandi (`x-nextjs-cache:
 * HIT`). Qidiruv tizimi bunday sahifani haqiqiy 404 deb hisoblamaydi
 * (§13). `industries/[slug]` va `product/[slug]` da shu sababli `false`.
 */
export const dynamicParams = false;
/**
 * 24 soat (86400 s). Next.js segment konfiguratsiyasi FAQAT literal
 * qiymatni qabul qiladi — `60 * 60 * 24` kabi ifoda build'ni
 * "Invalid segment configuration export" bilan to'xtatadi.
 */
export const revalidate = 86400;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => allProducts().map((p) => ({ locale, slug: p.slug })));
}

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  const product = getProductBySlug(slug);

  if (!product) {
    return buildMetadata({ locale, title: t('product.notFound'), path: '/404', noIndex: true });
  }

  const name = tr(product.name, locale as Locale);
  const cat = CATEGORIES.find((c) => c.id === product.category);
  const category = cat ? tr(cat.name, locale as Locale) : t('nav.catalog');
  const description = clipText(
    productDescription(product.category, name, product.applications, product.copyVariant, locale as Locale),
    150,
  );

  return buildMetadata({
    locale,
    // 42 belgi + layout shabloni qo'shadigan " — GFF Uzbekistan" (17) ≤ 59 (§13.1)
    title: clipText(`${name} — ${category}`, 42),
    description,
    path: `/catalog/${product.slug}`,
    type: 'product',
    keywords: [name, category, product.sku, 'GFF'],
  });
}

export default async function ProductPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const L = locale as Locale;
  const t = makeT(locale);

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const name = tr(product.name, L);
  const category = CATEGORIES.find((c) => c.id === product.category);
  const group = ALL_GROUPS.find((g) => g.id === product.group);
  const form = FORMS.find((f) => f.id === product.form);
  const catLabel = category ? tr(category.name, L) : t('nav.catalog');
  const description = productDescription(product.category, name, product.applications, product.copyVariant, L);

  const apps = product.applications
    .map((id) => {
      const taxon = APPLICATIONS.find((a) => a.id === id);
      return {
        id,
        label: taxon ? tr(taxon.name, L) : applicationLabel(id, L),
        blurb: t(`applicationBlurb.${id}` as never),
      };
    })
    .filter((a) => a.label !== a.id);

  const related = relatedProducts(product, MAX_RELATED, L);
  const benefits = BENEFITS[product.category][L];
  const storage = storageText(product.category, L);
  const gallery = buildGallery(product.category, product.applications, name, t);

  const availabilityTone =
    product.availability === 'in-stock'
      ? 'var(--ok)'
      : product.availability === 'on-order'
        ? 'var(--copper-dark)'
        : 'var(--navy)';

  const docs: { key: string; title: string; sub: string }[] = [
    { key: 'spec', title: t('product.docSpec'), sub: t('product.docSpecSub') },
    { key: 'coa', title: t('product.docCoA'), sub: t('product.docCoASub') },
    { key: 'tds', title: t('product.docTds'), sub: t('product.docPdf') },
    { key: 'msds', title: t('product.docMsds'), sub: t('product.docPdf') },
    // Halol sertifikati faqat `halal` belgili mahsulotlarda (128 ta mahsulotda yo'q)
    ...(product.features.includes('halal')
      ? [{ key: 'halal', title: t('product.docHalal'), sub: t('product.docPdf') }]
      : []),
  ];

  const askHref = `/${locale}/contact?type=quote&product=${encodeURIComponent(product.sku)}`;

  return (
    <>
      <JsonLdGroup
        items={[
          productLd(product, locale, catLabel),
          breadcrumbLd(
            [
              { name: t('nav.home'), path: '/' },
              { name: t('nav.catalog'), path: '/catalog' },
              { name, path: `/catalog/${product.slug}` },
            ],
            locale,
          ),
        ]}
      />

      {/* ============ MAHSULOT BOSHI ============ */}
      <Section gap={false} className="flex flex-col gap-6 pt-[clamp(24px,3vw,48px)]">
        <Breadcrumbs
          label={t('nav.catalog')}
          items={[
            { label: t('nav.home'), href: `/${locale}` },
            { label: t('nav.catalog'), href: `/${locale}/catalog` },
            { label: catLabel, href: `/${locale}/catalog?categories=${product.category}` },
            { label: name },
          ]}
        />

        <div className="flex flex-wrap gap-3">
          <ProductGallery
            main={gallery.main}
            slides={gallery.slides}
            sku={product.sku}
            badge={product.isNew ? t('product.badgeNew') : product.isTop ? t('product.badgeTop') : undefined}
          />

          <ProductInfoPanel
            id={`sample-cta-${product.sku}`}
            product={product}
            locale={L}
            categoryLabel={catLabel}
            groupLabel={group ? tr(group.name, L) : catLabel}
            formValue={form ? tr(form.name, L) : product.form}
            packValue={`${product.packaging.join(' · ')} kg`}
            availabilityLabel={availabilityLabel(product.availability, t)}
            availabilityTone={availabilityTone}
            description={description}
            features={product.features.map((f) => tr(FEATURES.find((x) => x.id === f)?.name, L, f))}
            badge={product.isNew ? t('product.badgeNew') : product.isTop ? t('product.badgeTop') : undefined}
            askPriceHref={askHref}
            labels={{
              sampleSize: t('product.sampleSize'),
              gram: t('product.gram'),
              add: t('product.addToBox'),
              added: t('product.inBox'),
              askPrice: t('product.askPrice'),
              note: t('product.sampleNote', { days: siteConfig.business.sampleDeliveryDays }),
              fullTpl: t.raw('samples.boxFullToast'),
              form: t('product.formLabel'),
              dosage: t('product.dosageLabel'),
              packaging: t('product.packLabel'),
              maker: t('product.makerLabel'),
              makerValue: t('product.manufacturerShort'),
            }}
          />
        </div>

        {/* afzalliklar + saqlash shartlari */}
        <div className="grid gap-3 md:grid-cols-2">
          <Reveal className="flex flex-col gap-4 rounded-card bg-panel p-[clamp(20px,2.4vw,32px)]">
            <span className="label">{t('product.benefits')}</span>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {benefits.map((b) => (
                <li key={b} className="flex gap-3 text-[15px] leading-snug">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-pill bg-copper-dark" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal y={16} className="flex flex-col gap-4 rounded-card border border-line p-[clamp(20px,2.4vw,32px)]">
            <span className="label">{t('product.storage')}</span>
            <p className="m-0 text-body-l text-body">{storage}</p>
            <span className="label mt-1">{t('product.shelfLife')}</span>
            <p className="m-0 text-body-l font-medium">
              {t('product.shelfLifeValue', { months: product.shelfLifeMonths })}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ============ 01 · QO'LLANILISHI ============ */}
      <Section>
        <SectionHeader title={t('product.applications')} num="01" />

        {apps.length ? (
          <div className="grid gap-3 pt-[clamp(24px,3.1vw,40px)] [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]">
            {apps.slice(0, 6).map((a) => (
              <Reveal key={a.id} y={20} className="flex flex-col gap-5 rounded-card bg-panel p-3 pb-7">
                <div className="media-frame relative aspect-16/10 overflow-hidden rounded-media">
                  <AppImage id={a.id} alt={a.label} />
                </div>
                <div className="flex flex-col gap-2 px-4">
                  <span className="text-h5">{a.label}</span>
                  <span className="text-[15px] leading-snug text-muted">{a.blurb}</span>
                </div>
              </Reveal>
            ))}
          </div>
        ) : null}

        {/* dozirovka tavsiyasi — navy kapsula */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-pill bg-navy py-[18px] pl-[clamp(20px,2.5vw,36px)] pr-[18px] max-tab:rounded-card max-tab:p-6 text-white">
          <span className="max-w-[620px] text-body-l">
            {t('product.dosageAdvice', {
              dosage: `${product.dosage.min}–${product.dosage.max}${product.dosage.unit}`,
            })}
          </span>
          <ButtonLink
            href={`/${locale}/contact?type=product&product=${encodeURIComponent(product.sku)}`}
            variant="accent"
            size="md"
            className="shrink-0"
          >
            {t('product.consult')}
          </ButtonLink>
        </div>
      </Section>

      {/* ============ 02 · TEXNIK HUJJATLAR ============ */}
      <Section className="flex flex-wrap gap-8 md:gap-12">
        <div className="flex flex-1 basis-[300px] flex-col gap-5 md:px-[clamp(0px,3vw,48px)]">
          <span className="font-display text-[clamp(36px,5vw,80px)] font-light leading-none tracking-[-0.04em]">
            02.
          </span>
          <h2 className="m-0 text-h2">{t('product.docs')}</h2>
          <p className="m-0 max-w-[380px] text-body-l text-muted">{t('product.docsNote')}</p>
        </div>

        <div className="flex min-w-0 flex-[2_1_560px] flex-col overflow-hidden rounded-card border border-line-soft">
          {docs.map((d, i) => (
            <div
              key={d.key}
              className={`flex items-center justify-between gap-4 px-[clamp(20px,2vw,28px)] py-[22px] ${
                i < docs.length - 1 ? 'border-b border-line-soft' : ''
              }`}
            >
              <span className="flex flex-col gap-1">
                <span className="text-[18px] font-medium">{d.title}</span>
                <span className="text-[14px] text-muted">{d.sub}</span>
              </span>
              <a
                href={`/${locale}/contact?type=catalog&doc=${d.key}&product=${encodeURIComponent(product.sku)}`}
                aria-label={t('product.docDownloadAria', { doc: d.title })}
                className="btn-icon btn-icon--48 btn-icon--outline shrink-0"
                data-ga={`cta_doc_${d.key}`}
              >
                <Download size={18} strokeWidth={1.8} aria-hidden />
              </a>
            </div>
          ))}
        </div>

        <p className="w-full text-[14px] text-muted">{t('product.docsHint')}</p>
      </Section>

      {/* ============ 03 · BIRGA TANLANADI ============ */}
      {related.length ? (
        <Section className="pb-4">
          <SectionHeader title={t('product.related')} num="03" rules="none" className="pb-8" />

          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))]">
            {related.map((c, i) => (
              <Reveal
                key={c.sku}
                y={20}
                delay={i * 0.06}
                className="flex min-h-[220px] flex-col gap-8 rounded-card bg-panel p-[26px]"
              >
                <Link
                  href={`/${locale}/catalog/${c.slug}`}
                  className="flex min-h-0 flex-1 flex-col gap-8 text-ink no-underline"
                >
                  <span className="text-[13px] tracking-[0.04em] text-muted">
                    {c.sku} · {tr(ALL_GROUPS.find((g) => g.id === c.group)?.name, L, catLabel)}
                  </span>
                  <span className="flex-grow text-h5">{tr(c.name, L)}</span>
                  <span className="flex items-center justify-between gap-3 text-[15px] text-body">
                    {tr(FORMS.find((f) => f.id === c.form)?.name, L, c.form)} · {c.dosageMin}–{c.dosageMax}%
                    <span className="btn-icon btn-icon--44 btn-icon--navy shrink-0">
                      <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-pill bg-panel py-[18px] pl-[clamp(20px,2.5vw,36px)] pr-[18px] max-tab:rounded-card max-tab:p-6">
            <span className="text-body-l">{t('product.boxCta')}</span>
            <ButtonLink href={`/${locale}/samples`} variant="outline" size="md" className="shrink-0">
              {t('nav.samples')}
              <ArrowRight size={18} aria-hidden />
            </ButtonLink>
          </div>
        </Section>
      ) : null}

      <ProductStickyBar
        sku={product.sku}
        slug={product.slug}
        name={product.name}
        form={product.form}
        locale={L}
        boxHref={`/${locale}/samples`}
        labels={{
          countTpl: t.raw('sticky.boxLine'),
          go: t('sticky.openBox'),
          add: t('catalog.addSample'),
          added: t('catalog.addedSample'),
          fullTpl: t.raw('samples.boxFullToast'),
        }}
      />
    </>
  );
}

/* ---------------- galereya ---------------- */

function imageFor(src: string | undefined, fallback = FALLBACK_IMAGE): string {
  if (src && publicAssetExists(src)) return src;
  if (publicAssetExists(fallback)) return fallback;
  return '/images/hero-vanilla.jpg';
}

function AppImage({ id, alt }: { id: string; alt: string }) {
  const src = imageFor(APPLICATION_IMAGE[id], '/images/ingredients.jpg');
  return (
    <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 31vw" className="media-zoom object-cover" />
  );
}

/** Galereya: asosiy rasm (ilova/kategoriya fotosi) + qadoq rasmlari (§15). */
function buildGallery(
  categoryId: string,
  applications: string[],
  name: string,
  t: ReturnType<typeof makeT>,
): { main: GallerySlide; slides: GallerySlide[] } {
  const app = applications.find((a) => APPLICATION_IMAGE[a]);
  const mainSrc = imageFor(
    app ? APPLICATION_IMAGE[app] : CATEGORY_IMAGE[categoryId],
    imageFor(CATEGORY_IMAGE[categoryId]),
  );

  const slides: GallerySlide[] = [];
  for (const pk of PACK_IMAGES) {
    if (!publicAssetExists(pk.src)) continue;
    slides.push({ src: pk.src, caption: t(pk.labelKey), alt: t('product.packAlt', { pack: `${pk.kg} kg` }) });
  }

  return {
    main: { src: mainSrc, alt: t('product.galleryAlt', { name }) },
    slides,
  };
}

function availabilityLabel(id: string, t: ReturnType<typeof makeT>): string {
  if (id === 'in-stock') return t('product.inStock');
  if (id === 'on-order') return t('product.onOrder');
  return t('product.availNew');
}
