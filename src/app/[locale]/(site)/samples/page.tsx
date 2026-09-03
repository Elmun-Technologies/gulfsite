/**
 * TEST BOX (NAMUNA) SAHIFASI
 * ----------------------------------------------------------------
 * Saytning eng kuchli lead-magniti: BEPUL namuna to'plami.
 * Oqim:
 *   1. Katalogda mahsulotlarni tanlash (localStorage)
 *   2. Bu sahifada miqdor/izohni sozlash
 *   3. Bitta zayvka yuborish → Telegram/e-mail'ga darhol tushadi
 *
 * Sahifa serverda generatsiya qilinadi; tanlov faqat klientda.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { makeT, normalizeLocale, LOCALES, type AppLocale, type DictKey } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata, breadcrumbLd, faqLd } from '@/lib/seo';
import { allProducts, popularProducts, productCount } from '@/lib/catalog';
import { CATEGORIES, tr, type Locale, type Trilingual } from '@/lib/taxonomy';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Accordion, Badge } from '@/components/ui/Display';
import { SampleBoxEditor, type QuickSet } from '@/components/sample/SampleBoxEditor';
import { SampleRequestForm } from '@/components/sample/SampleRequestForm';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  return buildMetadata({
    locale,
    title: t('samples.title'),
    description: `${t('samples.subtitle')} ${siteConfig.business.sampleBoxMaxItems} tagacha namunani bepul yuboramiz — ${siteConfig.business.sampleDeliveryDays} ish kunida, O‘zbekiston bo‘ylab. ${siteConfig.contact.phonePrimary}`,
    path: '/samples',
    keywords: [
      'bepul namuna',
      'test box',
      'aromatizator namunasi',
      'бесплатные образцы ароматизаторов',
      'free samples Uzbekistan',
    ],
  });
}

/** Tanlovni osonlashtirish uchun tayyor to'plamlar */
function buildQuickSets(locale: Locale): QuickSet[] {
  const products = allProducts();
  const pick = (
    id: string,
    label: string,
    hint: string,
    filter: (p: (typeof products)[number]) => boolean,
    limit = 5,
  ): QuickSet => ({
    id,
    label,
    hint,
    items: products
      .filter(filter)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit)
      .map((p) => ({ sku: p.sku, slug: p.slug, name: p.name as Trilingual })),
  });

  const sets = [
    pick(
      'bakery',
      locale === 'ru' ? 'Выпечка и кондитерка' : locale === 'en' ? 'Bakery & confectionery' : 'Non va qandolat',
      locale === 'ru'
        ? 'Ваниль, масло, шоколад, карамель — базовый набор для теста и кремов.'
        : locale === 'en'
          ? 'Vanilla, butter, chocolate, caramel — the starter set for dough and creams.'
          : 'Vanil, sariyog‘, shokolad, karamel — xamir va kremlar uchun boshlang‘ich to‘plam.',
      (p) => p.category === 'flavours' && (p.applications.includes('bakery') || p.applications.includes('confectionery')),
    ),
    pick(
      'dairy-beverage',
      locale === 'ru' ? 'Молочка и напитки' : locale === 'en' ? 'Dairy & beverages' : 'Sut va ichimliklar',
      locale === 'ru'
        ? 'Фруктовые и сливочные вкусы для йогуртов, мороженого и лимонадов.'
        : locale === 'en'
          ? 'Fruit and creamy flavours for yoghurts, ice cream and soft drinks.'
          : 'Qatiq, muzqaymoq va limonadlar uchun mevali va sutli ta’mlar.',
      (p) => p.category === 'flavours' && (p.applications.includes('dairy') || p.applications.includes('beverages')),
    ),
    pick(
      'fragrance',
      locale === 'ru' ? 'Парфюмерия и косметика' : locale === 'en' ? 'Fragrance & personal care' : 'Parfyumeriya va kosmetika',
      locale === 'ru'
        ? 'Тонкие ароматы и композиции для бытовой химии и ухода за телом.'
        : locale === 'en'
          ? 'Fine fragrances and compositions for home care and personal care.'
          : 'Nozik atirlar va uy-parvarish vositalari uchun kompozitsiyalar.',
      (p) => p.category === 'fragrances',
    ),
    pick(
      'ingredients',
      locale === 'ru' ? 'Ингредиенты и добавки' : locale === 'en' ? 'Ingredients & additives' : 'Ingredientlar va qo‘shimchalar',
      locale === 'ru'
        ? 'Ванилин, лимонная кислота, красители, консерванты — со склада.'
        : locale === 'en'
          ? 'Vanillin, citric acid, colourants, preservatives — from stock.'
          : 'Vanilin, limon kislotasi, bo‘yoqlar, konservantlar — ombordan.',
      (p) => p.category === 'food-ingredients' || p.category === 'essential-oils',
    ),
    pick(
      'savoury',
      locale === 'ru' ? 'Мясо и соусы' : locale === 'en' ? 'Meat & savoury' : 'Go‘sht va souslar',
      locale === 'ru'
        ? 'Ароматизаторы для колбас, соусов, снеков и консервов.'
        : locale === 'en'
          ? 'Flavours for sausages, sauces, snacks and canned food.'
          : 'Kolbasa, sous, snaks va konservlar uchun aromatizatorlar.',
      (p) => p.applications.some((a) => ['meat', 'sauces', 'snacks', 'canning', 'seasonings'].includes(a)),
    ),
  ];

  return sets.filter((s) => s.items.length >= 3);
}

export default async function SamplesPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  if (!(LOCALES as readonly string[]).includes(locale)) notFound();
  const loc = locale as AppLocale;
  const t = makeT(loc);

  const quickSets = buildQuickSets(locale as Locale);
  const catalogHref = `/${locale}/catalog`;
  const productBase = `/${locale}/product`;
  const maxItems = siteConfig.business.sampleBoxMaxItems;
  const days = siteConfig.business.sampleDeliveryDays;

  const steps: { n: number; title: string; text: string; icon: IconName }[] = [
    { n: 1, title: t('samples.step1'), text: t('samples.step1Hint'), icon: 'grid' },
    { n: 2, title: t('samples.step2'), text: t('samples.step2Hint'), icon: 'box' },
    { n: 3, title: t('samples.step3'), text: t('samples.step3Hint'), icon: 'send' },
  ];

  const faq = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q5'), a: t('faq.a5') },
  ];

  const crumbs = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('nav.samples'), href: `/${locale}/samples` },
  ];

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-cream-200 bg-pine-950 text-white">
        <div className="pattern-uzbek pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden />
        <div
          className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl"
          aria-hidden
        />
        <div className="container-x relative grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center lg:py-14">
          <div>
            <Breadcrumb
              items={crumbs}
              className="[&_a]:text-white/60 [&_a:hover]:text-mint-200 [&_span:last-child]:text-white"
            />
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-400">
              <Icon name="box" size={12} />
              {t('box.eyebrow')}
            </span>
            <h1 className="mt-3 max-w-2xl font-display text-[clamp(1.7rem,4.6vw,2.7rem)] leading-[1.08] font-extrabold tracking-tight text-white">
              {t('samples.title')}
            </h1>
            <p className="mt-3.5 max-w-xl text-[15px] leading-relaxed text-white/70">{t('samples.subtitle')}</p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {[
                { icon: 'check' as IconName, label: `${maxItems} ${locale === 'ru' ? 'образцов' : locale === 'en' ? 'samples' : 'ta namuna'}` },
                { icon: 'truck' as IconName, label: t('samples.deliveryFree') },
                { icon: 'clock' as IconName, label: t('samples.deliveryTime').replace('{days}', String(days)) },
                { icon: 'badge' as IconName, label: t('brand.role') },
              ].map((b, i) => (
                <li
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/[0.06] px-2.5 py-1.5 text-[12.5px] font-semibold text-white/80"
                >
                  <Icon name={b.icon} size={14} className="text-mint-200" />
                  {b.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Qadamlar */}
          <ol className="flex flex-col gap-2.5">
            {steps.map((s) => (
              <li key={s.n} className="flex items-start gap-3 rounded-xl border border-white/12 bg-white/[0.05] p-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-600 font-mono text-[13px] font-extrabold text-white">
                  {s.n}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-[13.5px] font-bold text-white">
                    <Icon name={s.icon} size={14} className="text-mint-200" />
                    {s.title}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-white/60">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= BOX + FORMA ================= */}
      <section className="container-x py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <SampleBoxEditor locale={locale as Locale} catalogHref={catalogHref} productHrefBase={productBase} quickSets={quickSets} />
          </div>

          <div id="sample-request" className="scroll-mt-24 lg:sticky lg:top-[5.5rem]">
            <SampleRequestForm locale={locale as Locale} catalogHref={catalogHref} />

            {/* Qo'shimcha ishonch bloklari */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-cream-200 bg-white p-4">
                <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-teal-600">
                  <Icon name="certificate" size={14} />
                  {t('certs.title')}
                </p>
                <p className="mt-1.5 text-[12.5px] leading-snug text-slate-warm-600">{t('certs.subtitle')}</p>
              </div>
              <div className="rounded-xl border border-cream-200 bg-white p-4">
                <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-teal-600">
                  <Icon name="lab" size={14} />
                  {t('product.askTechnologist')}
                </p>
                <p className="mt-1.5 text-[12.5px] leading-snug text-slate-warm-600">{t('product.askTechnologistHint')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOX TARKIBI ================= */}
      <section className="border-y border-cream-200 bg-cream-100/60 py-12 lg:py-16">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">{t('box.eyebrow')}</span>
            <h2 className="mt-2 font-display text-[clamp(1.35rem,3.4vw,2rem)] font-extrabold tracking-tight text-pine-900">
              {t('samples.whatsInside')}
            </h2>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-slate-warm-600">{t('box.subtitle')}</p>
          </div>

          <div className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: 'box.what1', icon: 'flask' as IconName },
              { k: 'box.what2', icon: 'file' as IconName },
              { k: 'box.what3', icon: 'users' as IconName },
              { k: 'box.what4', icon: 'truck' as IconName },
            ].map((b) => (
              <div key={b.k} className="flex flex-col gap-2.5 rounded-2xl border border-cream-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint-100 text-teal-600" aria-hidden>
                  <Icon name={b.icon} size={22} />
                </span>
                <h3 className="font-display text-[15px] font-bold leading-snug text-pine-900">
                  {t(`${b.k}.title` as DictKey)}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-warm-600">{t(`${b.k}.text` as DictKey)}</p>
              </div>
            ))}
          </div>

          {/* Kategoriyalar bo'yicha tezkor havolalar */}
          <div className="mt-8">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-warm-500">
              {t('catalog.categoriesTitle')}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`${catalogHref}?categories=${c.id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-cream-300 bg-white px-3 py-2 text-[13px] font-semibold text-slate-warm-700 transition hover:border-teal-500/50 hover:text-teal-600"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} aria-hidden />
                    {tr(c.name, locale as Locale, c.id)}
                    <span className="font-mono text-[11px] text-slate-warm-500">
                      {allProducts().filter((p) => p.category === c.id).length}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= MASHHURLAR ================= */}
      <section className="container-x py-12 lg:py-16">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-[clamp(1.25rem,3vw,1.7rem)] font-extrabold tracking-tight text-pine-900">
              {t('samples.popularPick')}
            </h2>
            <p className="mt-1.5 text-[13.5px] text-slate-warm-600">
              {t('catalog.resultsCount', { count: productCount() })}
            </p>
          </div>
          <Link
            href={catalogHref}
            className="inline-flex h-9 items-center gap-1.5 self-start rounded-lg border border-pine-800/20 px-3 text-[13px] font-semibold text-pine-800 transition hover:border-teal-500 hover:text-teal-600 sm:self-auto"
          >
            {t('categories.viewAll')}
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>

        <div className="mt-5 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {popularProducts(8, locale as Locale).map((c) => (
            <Link
              key={c.sku}
              href={`${productBase}/${c.slug}`}
              className="group flex w-[15rem] shrink-0 flex-col gap-2 rounded-2xl border border-cream-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-teal-500/35 hover:shadow-lift"
            >
              <div className="flex items-center gap-2">
                <span className="h-7 w-1 rounded-full" style={{ backgroundColor: c.color }} aria-hidden />
                <span className="font-mono text-[11px] font-bold text-slate-warm-500">{c.sku}</span>
                {c.isTop ? <Badge tone="gold" size="xs" icon="star">{t('card.top')}</Badge> : null}
              </div>
              <span className="line-clamp-2 font-display text-[14px] leading-snug font-bold text-pine-900 group-hover:text-teal-600">
                {(c.name[locale as Locale] || c.name.en) as string}
              </span>
              <span className="mt-auto line-clamp-2 text-[12px] leading-snug text-slate-warm-600">{c.blurb}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="border-t border-cream-200 bg-white py-12 lg:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <div>
            <span className="eyebrow">{t('faq.eyebrow')}</span>
            <h2 className="mt-2 font-display text-[clamp(1.3rem,3vw,1.8rem)] font-extrabold tracking-tight text-pine-900">
              {t('faq.title')}
            </h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-slate-warm-600">{t('faq.more')}</p>
            <Link
              href={`/${locale}/contact`}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-teal-600 px-4 text-[13.5px] font-bold text-white transition hover:bg-pine-800"
            >
              <Icon name="phone" size={16} />
              {t('nav.contact')}
            </Link>
          </div>
          <Accordion items={faq.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} allowMultiple />
        </div>
      </section>

      <JsonLdGroup
        items={[
          breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href })), loc),
          faqLd(faq),
        ]}
      />
    </>
  );
}
