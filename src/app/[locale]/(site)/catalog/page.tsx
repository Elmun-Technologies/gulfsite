/**
 * KATALOG SAHIFASI
 * ----------------------------------------------------------------
 * Server komponent: filtrlar URL'dan o'qiladi, natijalar serverda
 * hisoblanadi va tayyor HTML qaytariladi. Bu SEO uchun hal qiluvchi —
 * qidiruv tizimlari filtrlangan ro'yxatlarni ham ko'radi.
 *
 * Klient komponenti (CatalogExplorer) faqat boshqaruvni o'z zimmasiga oladi.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { makeT, normalizeLocale, LOCALES, type AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata, breadcrumbLd, collectionPageLd } from '@/lib/seo';
import { activeChips, catalogStats, groupOverview, productCount, queryCatalog } from '@/lib/catalog';
import { searchParamsToFilters } from '@/lib/filters-url';
import { APPLICATIONS, CATEGORIES, ALL_GROUPS, tr } from '@/lib/taxonomy';
import { formatNumber } from '@/lib/utils';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { CatalogExplorer } from '@/components/catalog/CatalogExplorer';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { Icon, type IconName } from '@/components/ui/Icon';
import type { Locale } from '@/lib/taxonomy';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const sp = await searchParams;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  const filters = searchParamsToFilters(sp);

  const bits: string[] = [];
  for (const id of filters.categories) {
    const c = CATEGORIES.find((x) => x.id === id);
    if (c) bits.push(tr(c.name, locale));
  }
  for (const id of filters.groups) {
    const g = ALL_GROUPS.find((x) => x.id === id);
    if (g) bits.push(tr(g.name, locale));
  }
  if (filters.q.trim()) bits.push(`«${filters.q.trim()}»`);

  const title = bits.length
    ? `${bits.slice(0, 2).join(' · ')} — ${t('nav.catalog')}`
    : `${t('catalog.title')} · ${formatNumber(productCount(), locale)}+`;

  const description = bits.length
    ? `${bits.slice(0, 3).join(', ')} — O‘zbekistonda ombordan yetkazib beramiz. Bepul test box, halol sertifikati, texnolog maslahati. ${siteConfig.contact.phonePrimary}`
    : t('catalog.subtitle');

  return buildMetadata({
    locale,
    title,
    description: description.slice(0, 190),
    path: '/catalog',
    keywords: [
      t('catalog.title'),
      'aromatizatorlar katalogi',
      'пищевые ароматизаторы каталог',
      'ingredientlar O‘zbekiston',
      ...bits,
    ],
  });
}

export default async function CatalogPage({ params, searchParams }: PageProps) {
  const { locale: raw } = await params;
  const sp = await searchParams;
  const locale: Locale = normalizeLocale(raw);
  if (!(LOCALES as readonly string[]).includes(locale)) notFound();

  const t = makeT(locale as AppLocale);
  const filters = searchParamsToFilters(sp);
  const result = queryCatalog(filters, locale);
  const stats = catalogStats(locale);
  const chips = activeChips(result.appliedFilters, locale);
  const groups = groupOverview(locale);

  const basePath = `/${locale}/catalog`;
  const productBase = `/${locale}/product`;

  const quickLinks = [
    { label: t('nav.catalog'), href: basePath },
    { label: tr(CATEGORIES[0]?.name, locale, ''), href: `${basePath}?categories=${CATEGORIES[0]?.id ?? ''}` },
    { label: t('certs.halal'), href: `${basePath}?features=halal` },
    { label: t('catalog.newArrivals'), href: `${basePath}?availability=new` },
    { label: t('nav.getSample'), href: `/${locale}/samples` },
  ].filter((l) => l.label);

  const crumbs = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('nav.catalog'), href: basePath },
  ];

  const popularApps = APPLICATIONS.slice(0, 12);

  return (
    <>
      {/* ---- Sahifa sarlavhasi ---- */}
      <section className="relative overflow-hidden border-b border-cream-200 bg-pine-950 text-white">
        <div className="pattern-uzbek pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl"
          aria-hidden
        />
        <div className="container-x relative py-8 lg:py-10">
          <Breadcrumb
            items={crumbs}
            className="[&_a]:text-white/60 [&_a:hover]:text-mint-200 [&_span:last-child]:text-white"
          />

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-mint-200">
                <Icon name="grid" size={12} />
                {t('catalog.title')}
              </span>
              <h1 className="mt-3 font-display text-[clamp(1.7rem,4.6vw,2.6rem)] leading-[1.08] font-extrabold tracking-tight text-white">
                {stats.total > 0 ? (
                  <>
                    <span className="gradient-text">{formatNumber(stats.total, locale)}+</span>{' '}
                    {locale === 'ru' ? 'позиция на складе' : locale === 'en' ? 'items in stock' : 'pozitsiya omborda'}
                  </>
                ) : (
                  t('catalog.title')
                )}
              </h1>
              <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-white/70">{t('catalog.subtitle')}</p>
            </div>

            <dl className="grid shrink-0 grid-cols-3 gap-2 lg:gap-3">
              {[
                { k: t('categories.positions'), v: stats.total, icon: 'package' as IconName },
                { k: t('catalog.categoriesTitle'), v: stats.byCategory.length, icon: 'grid' as IconName },
                { k: t('catalog.groupsTitle'), v: groups.length, icon: 'tag' as IconName },
              ].map((s) => (
                <div
                  key={s.k}
                  className="flex flex-col items-center gap-1 rounded-xl border border-white/12 bg-white/[0.06] px-3 py-2.5 text-center lg:min-w-24"
                >
                  <Icon name={s.icon} size={16} className="text-mint-200" />
                  <dt className="font-display text-xl leading-none font-extrabold text-white tabular-nums">{s.v}</dt>
                  <dd className="text-[10.5px] leading-tight text-white/55">{s.k}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ---- Katalog ---- */}
      <section className="container-x py-6 lg:py-9">
        <CatalogExplorer
          locale={locale}
          cards={result.cards}
          total={result.total}
          page={result.page}
          pageSize={result.pageSize}
          totalPages={result.totalPages}
          facets={result.facets}
          filters={result.appliedFilters}
          activeCount={result.activeCount}
          chips={chips}
          suggestion={result.suggestion}
          basePath={basePath}
          productBase={productBase}
          quickLinks={quickLinks}
        />
      </section>

      {/* ---- Kategoriyalar (SEO + navigatsiya) ---- */}
      <section className="border-y border-cream-200 bg-cream-100/50 py-12 lg:py-16">
        <div className="container-x">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-[clamp(1.25rem,3vw,1.7rem)] font-extrabold tracking-tight text-pine-900">
                {t('catalog.categoriesTitle')}
              </h2>
              <p className="mt-1.5 text-[14px] text-slate-warm-600">{t('catalog.quickLinks')}</p>
            </div>
            <Link
              href={basePath}
              className="inline-flex h-9 items-center gap-1.5 self-start rounded-lg border border-pine-800/20 px-3 text-[13px] font-semibold text-pine-800 transition hover:border-teal-500 hover:text-teal-600 sm:self-auto"
            >
              {t('categories.viewAll')}
              <Icon name="arrow-right" size={14} />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {stats.byCategory.map((c) => (
              <Link
                key={c.id}
                href={`${basePath}?categories=${c.id}`}
                className="group flex flex-col gap-2 rounded-2xl border border-cream-200 bg-white p-4 shadow-soft transition hover:-translate-y-1 hover:border-teal-500/35 hover:shadow-lift"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition group-hover:scale-105"
                  style={{ backgroundColor: c.color ?? '#0e7c6b' }}
                  aria-hidden
                >
                  <Icon name={(c.icon ?? 'tag') as IconName} size={20} />
                </span>
                <span className="text-[13px] leading-snug font-bold text-pine-900 group-hover:text-teal-600">
                  {c.label}
                </span>
                <span className="mt-auto flex items-center gap-1 font-mono text-[11.5px] text-slate-warm-500">
                  {c.count} {t('categories.positions').toLowerCase()}
                  <Icon
                    name="arrow-up-right"
                    size={12}
                    className="text-slate-warm-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-500"
                  />
                </span>
              </Link>
            ))}
          </div>

          {/* ---- Qo'llash sohalariga tezkor kirish ---- */}
          <div className="mt-8">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-warm-500">
              {locale === 'ru' ? 'По отраслям' : locale === 'en' ? 'By industry' : 'Tarmoqlar bo‘yicha'}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {popularApps.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`${basePath}?applications=${a.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-cream-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-warm-700 transition hover:border-teal-500/50 hover:bg-mint-50 hover:text-teal-600"
                  >
                    {a.color ? (
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: a.color }} aria-hidden />
                    ) : null}
                    {tr(a.name, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---- Guruhlar (uzun dumli SEO) ---- */}
      <section className="container-x py-12 lg:py-16">
        <h2 className="font-display text-[clamp(1.25rem,3vw,1.7rem)] font-extrabold tracking-tight text-pine-900">
          {t('catalog.groupsTitle')}
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {groups.slice(0, 20).map((g) => (
            <Link
              key={g.id}
              href={`${basePath}?groups=${g.id}`}
              className="group rounded-xl border border-cream-200 bg-white p-3 transition hover:border-teal-500/35 hover:bg-mint-50/50"
            >
              <span className="flex items-center gap-2">
                <span className="h-6 w-1 rounded-full" style={{ backgroundColor: g.color }} aria-hidden />
                <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-pine-900 group-hover:text-teal-600">
                  {g.label}
                </span>
                <span className="font-mono text-[11px] text-slate-warm-500">{g.count}</span>
              </span>
              {g.examples.length ? (
                <span className="mt-1.5 block truncate pl-3 text-[11px] text-slate-warm-500">
                  {g.examples.map((e) => e.name).join(' · ')}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      </section>

      {/* ---- Qo'shimcha SEO matn ---- */}
      <section className="border-t border-cream-200 bg-white py-12">
        <div className="container-x grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-[clamp(1.15rem,2.6vw,1.5rem)] font-extrabold tracking-tight text-pine-900">
              {locale === 'ru'
                ? 'Как заказать ингредиенты в Узбекистане'
                : locale === 'en'
                  ? 'How to order ingredients in Uzbekistan'
                  : 'O‘zbekistonda ingredientlarni qanday buyurtma qilish mumkin'}
            </h2>
            <div className="legal-prose mt-4">
              <p>
                {locale === 'ru'
                  ? 'Мы — официальный и единственный дистрибьютор Gulf Flavours & Fragrances в Узбекистане. Все позиции каталога доступны со склада в Ташкенте либо под заказ напрямую с завода в Дубае (Jebel Ali Free Zone).'
                  : locale === 'en'
                    ? 'We are the official and sole distributor of Gulf Flavours & Fragrances in Uzbekistan. Every catalogue item is available from our Tashkent warehouse or made to order directly from the plant in Jebel Ali Free Zone, Dubai.'
                    : 'Biz Gulf Flavours & Fragrances kompaniyasining O‘zbekistondagi rasmiy va yagona distribyutorimiz. Katalogdagi barcha pozitsiyalar Toshkentdagi ombordan yoki Dubaydagi (Jebel Ali Free Zone) zavoddan buyurtma asosida yetkazib beriladi.'}
              </p>
              <ul>
                <li>
                  {locale === 'ru'
                    ? 'Бесплатный тест-бокс: до 8 образцов по 25–100 г для проработки рецептуры.'
                    : locale === 'en'
                      ? 'Free test box: up to 8 samples of 25–100 g for recipe development.'
                      : 'Bepul test box: retseptsurani ishlab chiqish uchun 8 tagacha, 25–100 g namunalar.'}
                </li>
                <li>
                  {locale === 'ru'
                    ? 'Полный пакет документов: сертификат Halal, декларация соответствия, CoA, TDS, MSDS.'
                    : locale === 'en'
                      ? 'Full document pack: Halal certificate, declaration of conformity, CoA, TDS, MSDS.'
                      : 'To‘liq hujjatlar to‘plami: Halol sertifikati, muvofiqlik deklaratsiyasi, CoA, TDS, MSDS.'}
                </li>
                <li>
                  {locale === 'ru'
                    ? 'Технолог подберёт дозировку и форму под ваш процесс — бесплатно.'
                    : locale === 'en'
                      ? 'Our technologist will match dosage and form to your process — free of charge.'
                      : 'Texnologimiz doza va shaklni jarayoningizga moslab beradi — bepul.'}
                </li>
              </ul>
            </div>
          </div>

          <aside className="rounded-2xl border border-cream-200 bg-cream-50 p-5">
            <h3 className="font-display text-[15px] font-bold text-pine-900">{t('cta.title')}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-slate-warm-600">{t('cta.subtitle')}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={`/${locale}/samples`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 text-[14px] font-bold text-white transition hover:bg-pine-800"
              >
                <Icon name="box" size={17} />
                {t('nav.getSample')}
              </Link>
              <Link
                href={`/${locale}/quote`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-pine-800/20 bg-white text-[14px] font-bold text-pine-800 transition hover:border-teal-500 hover:text-teal-600"
              >
                <Icon name="invoice" size={17} />
                {t('nav.quote')}
              </Link>
              <a
                href={siteConfig.contact.phonePrimaryHref}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-pine-900 font-mono text-[14px] font-bold text-white transition hover:bg-teal-600"
              >
                <Icon name="phone" size={16} />
                {siteConfig.contact.phonePrimary}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <JsonLdGroup
        items={[
          breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href ?? basePath })), locale as AppLocale),
          collectionPageLd(locale as AppLocale, t('catalog.title'), t('catalog.subtitle'), basePath, result.cards),
        ]}
      />
    </>
  );
}
