/**
 * KOMPANIYA HAQIDA
 * ----------------------------------------------------------------
 * B2B da "haqida" sahifasi — ishonch tekshiruvi. Mijoz uch savolga
 * javob izlaydi:
 *   1. Siz kimsiz va rasmiymisiz?  (distribyutor maqomi + ishlab chiqaruvchi)
 *   2. Sizga ishonish mumkinmi?    (yillar, sertifikatlar, ombor, jamoa)
 *   3. Menga qanday foyda bor?    (tez javob, namunalar, yetkazib berish)
 *
 * Shu tartibda qurilgan: zavod → distribyutor → sifat → jamoa → CTA.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { buildMetadata, breadcrumbLd, aboutLd } from '@/lib/seo';
import { catalogStats, productCount } from '@/lib/catalog';
import { tr, type Locale } from '@/lib/taxonomy';
import { formatUzPhone } from '@/lib/utils';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Badge, SectionHeading, Stat } from '@/components/ui/Display';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  return buildMetadata({
    locale,
    title: t('about.title'),
    description: t('about.subtitle'),
    path: '/about',
    keywords: [
      'GFF O‘zbekiston distribyutori',
      'Gulf Flavours Fragrances rasmiy vakolati',
      'официальный дистрибьютор Gulf Flavours Узбекистан',
    ],
    image: '/images/factory.jpg',
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw) as AppLocale;
  const L = locale as Locale;
  const t = makeT(locale);
  const stats = catalogStats(L);
  const products = productCount();
  const c = siteConfig.contact;

  const crumbs = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('nav.about'), href: `/${locale}/about` },
  ];

  const timeline: { year: string; icon: IconName; title: string; text: string }[] = [
    {
      year: '2002',
      icon: 'factory',
      title: locale === 'ru' ? 'Основание GFF в Дубае' : locale === 'en' ? 'GFF founded in Dubai' : 'GFF Dubayda tashkil etildi',
      text: locale === 'ru'
        ? 'Производство ароматизаторов и парфюмерных композиций в свободной зоне Jebel Ali.'
        : locale === 'en'
          ? 'Flavour and fragrance manufacturing starts in the Jebel Ali Free Zone.'
          : 'Jebel Ali erkin zonasida aromatizator va atir kompozitsiyalari ishlab chiqarish yo‘lga qo‘yildi.',
    },
    {
      year: '2010',
      icon: 'globe',
      title: locale === 'ru' ? 'Экспортные рынки' : locale === 'en' ? 'Export markets' : 'Eksport bozorlari',
      text: locale === 'ru'
        ? `Поставки более чем в ${siteConfig.stats.exportCountries} стран Ближнего Востока, Африки и Центральной Азии.`
        : locale === 'en'
          ? `Supply to more than ${siteConfig.stats.exportCountries} countries across the Middle East, Africa and Central Asia.`
          : `Yaqin Sharq, Afrika va Markaziy Osiyoning ${siteConfig.stats.exportCountries} dan ortiq davlatiga yetkazib berish.`,
    },
    {
      year: '2018',
      icon: 'certificate',
      title: locale === 'ru' ? 'Сертификация' : locale === 'en' ? 'Certification' : 'Sertifikatlash',
      text: locale === 'ru'
        ? 'HALAL, ISO 22000, HACCP, SGS, RACS и Trakhees — полный пакет для пищевой и парфюмерной отраслей.'
        : locale === 'en'
          ? 'HALAL, ISO 22000, HACCP, SGS, RACS and Trakhees — the full package for food and fragrance industries.'
          : 'HALAL, ISO 22000, HACCP, SGS, RACS va Trakhees — oziq-ovqat va parfumeriya uchun to‘liq to‘plam.',
    },
    {
      year: String(new Date().getFullYear()),
      icon: 'map-pin',
      title: locale === 'ru' ? 'Офис и склад в Ташкенте' : locale === 'en' ? 'Tashkent office and warehouse' : 'Toshkentda ofis va ombor',
      text: locale === 'ru'
        ? 'Официальный дистрибьютор в Узбекистане: локальный склад, доставка по всем регионам, техническая поддержка на узбекском и русском.'
        : locale === 'en'
          ? 'Official distributor in Uzbekistan: local warehouse, delivery to all regions, technical support in Uzbek and Russian.'
          : 'O‘zbekistondagi rasmiy distribyutor: mahalliy ombor, barcha hududlarga yetkazib berish, o‘zbek va rus tillarida texnik qo‘llab-quvvatlash.',
    },
  ];

  const team = [
    {
      name: 'Ghaybullah Boypochoev',
      role: { uz: 'Savdo direktori (GFF)', ru: 'Директор по продажам (GFF)', en: 'Sales Director (GFF)' },
      email: 'gaybul@gulfflavours.ae',
      phone: '+971505578721',
      icon: 'users' as IconName,
    },
    {
      name: 'Zokhir Nazarov',
      role: { uz: 'Savdo va marketing (GFF)', ru: 'Продажи и маркетинг (GFF)', en: 'Sales & Marketing (GFF)' },
      email: 'Sales@gff.co.ae',
      phone: '+971564089954',
      icon: 'trend-up' as IconName,
    },
    {
      name: 'Mijgona Khaidarzoda',
      role: { uz: 'Savdo mutaxassisi (GFF)', ru: 'Специалист по продажам (GFF)', en: 'Sales Executive (GFF)' },
      email: 'mijgona@gff.co.ae',
      phone: '+971505525670',
      icon: 'badge' as IconName,
    },
  ];

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-cream-200 bg-pine-950 text-white">
        <div className="absolute inset-0" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/factory.jpg" alt="" className="h-full w-full object-cover opacity-30" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-pine-950 via-pine-950/90 to-pine-900/70" />
        </div>
        <div className="pattern-uzbek pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden />

        <div className="container-x relative py-10 lg:py-16">
          <Breadcrumb items={crumbs} className="[&_a]:text-white/60 [&_a:hover]:text-mint-200 [&_span:last-child]:text-white" />

          <div className="mt-4 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/35 bg-gold-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-400">
              <Icon name="badge" size={12} />
              {t('brand.role')}
            </span>
            <h1 className="mt-4 font-display text-[clamp(1.9rem,5.2vw,3.1rem)] leading-[1.06] font-extrabold tracking-tight">
              {t('about.title')}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70">{t('about.subtitle')}</p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <Link
                href={`/${locale}/samples`}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-teal-500 px-6 text-[14.5px] font-bold text-white transition hover:bg-teal-400 active:scale-[0.98]"
              >
                <Icon name="box" size={18} />
                {t('nav.getSample')}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/25 px-5 text-[14px] font-bold text-white transition hover:bg-white/10"
              >
                <Icon name="mail" size={17} />
                {t('nav.contact')}
              </Link>
              <a
                href="https://gulfflavours.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-white/10 px-5 text-[14px] font-bold text-white transition hover:bg-white/20"
              >
                gulfflavours.ae
                <Icon name="arrow-up-right" size={16} />
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat tone="dark" icon="flask" value={`${products}+`} label={t('stats.products')} />
            <Stat tone="dark" icon="leaf-circle" value={`${siteConfig.stats.rawMaterials}+`} label={t('stats.rawMaterials')} />
            <Stat tone="dark" icon="award" value={`${siteConfig.stats.yearsExperience}+`} label={t('stats.years')} />
            <Stat tone="dark" icon="map-pin" value={String(siteConfig.stats.uzRegions)} label={t('stats.regions')} />
          </div>
        </div>
      </section>

      {/* ============ HIKOYA + MISSIYA ============ */}
      <section className="container-x py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow">{t('about.story')}</span>
            <h2 className="mt-2.5 font-display text-[clamp(1.35rem,3.2vw,2rem)] leading-[1.12] font-extrabold tracking-tight text-pine-900">
              {siteConfig.brand.full}
            </h2>
            <p className="mt-3.5 text-[15px] leading-relaxed text-slate-warm-600">{t('about.storyText')}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-warm-600">{t('about.missionText')}</p>

            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {stats.byCategory.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/catalog?categories=${cat.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-cream-200 bg-white p-3.5 shadow-soft transition hover:-translate-y-0.5 hover:border-teal-500/35 hover:shadow-lift"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: cat.color ?? '#0e7c6b' }}
                    aria-hidden
                  >
                    <Icon name={(cat.icon ?? 'tag') as IconName} size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-bold text-pine-900 group-hover:text-teal-600">
                      {cat.label}
                    </span>
                    <span className="mt-0.5 block font-mono text-[11px] text-slate-warm-500">
                      {cat.count} {t('categories.positions')}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Rasm kolonnasi */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 overflow-hidden rounded-2xl border border-cream-200 shadow-lift">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ingredients.jpg"
                alt={t('about.mission')}
                className="h-56 w-full object-cover transition duration-500 hover:scale-[1.03]"
                loading="lazy"
                width={900}
                height={600}
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-cream-200 shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/rnd.jpg" alt={t('about.rnd')} className="h-40 w-full object-cover" loading="lazy" width={600} height={500} />
            </div>
            <div className="overflow-hidden rounded-2xl border border-cream-200 shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/warehouse.jpg" alt={t('about.export')} className="h-40 w-full object-cover" loading="lazy" width={600} height={500} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ TARIX (TIMELINE) ============ */}
      <section className="border-y border-cream-200 bg-cream-100/60 py-12 lg:py-16">
        <div className="container-x">
          <SectionHeading eyebrow={t('about.story')} title={t('about.story')} />
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {timeline.map((s) => (
              <li key={s.year} className="relative rounded-2xl border border-cream-200 bg-white p-5 shadow-soft">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint-100 text-teal-600" aria-hidden>
                    <Icon name={s.icon} size={18} />
                  </span>
                  <span className="font-display text-[1.35rem] leading-none font-extrabold tracking-tight text-pine-900 tabular-nums">
                    {s.year}
                  </span>
                </div>
                <h3 className="mt-3.5 font-display text-[14.5px] leading-snug font-bold text-pine-900">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-warm-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ O'ZBEKISTON DISTRIBYUTORI ============ */}
      <section className="container-x py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div>
            <span className="eyebrow">{t('footer.distributor')}</span>
            <h2 className="mt-2.5 font-display text-[clamp(1.35rem,3.2vw,2rem)] leading-[1.12] font-extrabold tracking-tight text-pine-900">
              {t('about.uzTitle')}
            </h2>
            <p className="mt-3.5 text-[15px] leading-relaxed text-slate-warm-600">{t('about.uzText')}</p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[t('about.value1'), t('about.value2'), t('about.value3'), t('about.value4')].map((v, i) => (
                <li key={i} className="flex items-start gap-2.5 rounded-xl border border-cream-200 bg-white p-3.5 shadow-soft">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-mint-100 text-teal-600" aria-hidden>
                    <Icon name="check" size={14} strokeWidth={2.6} />
                  </span>
                  <span className="text-[13.5px] leading-snug text-slate-warm-700">{v}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-2">
              <Badge tone="mint" size="md" icon="truck">
                {t('stats.delivery')}
              </Badge>
              <Badge tone="cream" size="md" icon="box">
                {siteConfig.business.sampleBoxMaxItems} {t('stats.samples')}
              </Badge>
              <Badge tone="cream" size="md" icon="clock">
                {siteConfig.business.responseMinutes} min
              </Badge>
              <Badge tone="cream" size="md" icon="halal">
                {t('certs.halal')}
              </Badge>
            </div>
          </div>

          {/* Ofis kartasi */}
          <div className="rounded-2xl border border-cream-200 bg-white p-5 shadow-soft">
            <h3 className="flex items-center gap-2 font-display text-[14px] font-extrabold tracking-tight text-pine-900">
              <Icon name="building" size={17} className="text-teal-600" />
              {t('contact.office')}
            </h3>
            <p className="mt-2.5 text-[13.5px] leading-snug text-slate-warm-700">
              {tr({ uz: c.address, ru: c.addressRu, en: c.addressEn }, L, c.address)}
            </p>
            <p className="mt-1.5 text-[12.5px] text-slate-warm-600">{c.hours}</p>

            <div className="mt-4 flex flex-col gap-2 border-t border-cream-200 pt-4">
              <a href={c.phonePrimaryHref} className="inline-flex items-center gap-2 font-mono text-[13px] font-bold text-pine-900 transition hover:text-teal-600">
                <Icon name="phone" size={14} className="text-teal-600" />
                {formatUzPhone(c.phonePrimary)}
              </a>
              <a href={`mailto:${c.salesEmail}`} className="inline-flex items-center gap-2 truncate text-[13px] text-slate-warm-700 transition hover:text-teal-600">
                <Icon name="mail" size={14} className="text-teal-600" />
                {c.salesEmail}
              </a>
              <a href={`mailto:${c.email}`} className="inline-flex items-center gap-2 truncate text-[13px] text-slate-warm-700 transition hover:text-teal-600">
                <Icon name="mail" size={14} className="text-teal-600" />
                {c.email}
              </a>
            </div>

            <div className="mt-4 border-t border-cream-200 pt-4">
              <h4 className="flex items-center gap-2 text-[12.5px] font-bold text-pine-900">
                <Icon name="globe" size={14} className="text-teal-600" />
                {t('contact.headquarters')}
              </h4>
              <p className="mt-2 text-[12px] leading-relaxed text-slate-warm-600">{c.hqAddress}</p>
              <a
                href="https://gulfflavours.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-teal-600 transition hover:text-pine-800"
              >
                gulfflavours.ae
                <Icon name="arrow-up-right" size={12} />
              </a>
            </div>

            <Link
              href={`/${locale}/contact`}
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-pine-800 text-[13.5px] font-bold text-white transition hover:bg-teal-600"
            >
              <Icon name="map-pin" size={16} />
              {t('contact.title')}
            </Link>
          </div>
        </div>
      </section>

      {/* ============ SIFAT / R&D ============ */}
      <section className="border-y border-cream-200 bg-cream-100/60 py-12 lg:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <span className="eyebrow">{t('about.quality')}</span>
            <h2 className="mt-2.5 font-display text-[clamp(1.35rem,3.2vw,2rem)] leading-[1.12] font-extrabold tracking-tight text-pine-900">
              {t('about.quality')}
            </h2>
            <p className="mt-3.5 text-[15px] leading-relaxed text-slate-warm-600">{t('about.qualityText')}</p>

            <h3 className="mt-7 flex items-center gap-2 font-display text-[15px] font-extrabold tracking-tight text-pine-900">
              <Icon name="lab" size={18} className="text-teal-600" />
              {t('about.rnd')}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-slate-warm-600">{t('about.rndText')}</p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {['HALAL', 'ISO 22000', 'HACCP', 'SGS', 'RACS', 'TRAKHEES', 'EAC', 'NON-GMO'].map((cert) => (
                <li
                  key={cert}
                  className="rounded-lg border border-cream-200 bg-white px-2.5 py-1.5 font-mono text-[11px] font-bold tracking-wide text-pine-800 shadow-soft"
                >
                  {cert}
                </li>
              ))}
            </ul>
          </div>

          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-2xl border border-cream-200 shadow-lift">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/certificates.jpg"
                alt={t('certs.title')}
                className="h-full max-h-[26rem] w-full object-cover"
                loading="lazy"
                width={900}
                height={700}
              />
            </div>

            <div className="mt-3.5 grid gap-2.5 sm:grid-cols-3">
              <Stat icon="certificate" value={String(siteConfig.stats.yearsExperience)} label={t('stats.years')} />
              <Stat icon="globe" value={String(siteConfig.stats.exportCountries)} label={t('stats.export')} />
              <Stat icon="flask" value={`${siteConfig.stats.rawMaterials}+`} label={t('stats.rawMaterials')} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ JAMOA ============ */}
      <section className="container-x py-12 lg:py-16">
        <SectionHeading
          eyebrow={t('about.team')}
          title={t('about.team')}
          description={t('about.exportText')}
          action={
            <Link
              href={`/${locale}/contact`}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-pine-800/20 px-4 text-[13.5px] font-bold text-pine-800 transition hover:border-teal-500 hover:bg-mint-50 hover:text-teal-600"
            >
              {t('contact.departments')}
              <Icon name="arrow-right" size={15} />
            </Link>
          }
        />

        <ul className="mt-8 grid gap-3.5 md:grid-cols-3">
          {team.map((m) => (
            <li key={m.email} className="flex flex-col rounded-2xl border border-cream-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-teal-500/30 hover:shadow-lift">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint-100 text-teal-600" aria-hidden>
                <Icon name={m.icon} size={21} />
              </span>
              <h3 className="mt-3.5 font-display text-[15px] font-extrabold tracking-tight text-pine-900">{m.name}</h3>
              <p className="mt-1 text-[12px] font-semibold uppercase tracking-wide text-teal-600">
                {tr(m.role, L, '')}
              </p>
              <div className="mt-auto flex flex-col gap-1.5 pt-4">
                <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 truncate text-[12.5px] text-slate-warm-700 transition hover:text-teal-600">
                  <Icon name="mail" size={13} className="shrink-0 text-teal-600" />
                  {m.email}
                </a>
                <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1.5 font-mono text-[12.5px] text-slate-warm-700 transition hover:text-teal-600">
                  <Icon name="phone" size={13} className="shrink-0 text-teal-600" />
                  {m.phone}
                </a>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-6 rounded-2xl border border-cream-200 bg-cream-50 p-5 text-[13.5px] leading-relaxed text-slate-warm-700">
          {t('footer.distributor')}{' '}
          <Link href={`/${locale}/contact`} className="font-semibold text-teal-600 underline decoration-teal-500/40 underline-offset-2">
            {t('contact.departments')}
          </Link>{' '}
          — {t('contact.subtitle')}
        </p>
      </section>

      {/* ============ CTA ============ */}
      <section className="border-t border-cream-200 bg-pine-950 py-12 text-white lg:py-16">
        <div className="container-x flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(1.35rem,3.4vw,2rem)] leading-[1.12] font-extrabold tracking-tight text-white">
              {t('cta.title')}
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-white/70">{t('cta.subtitle')}</p>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-white/55">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="clock" size={13} className="text-mint-200" />
                {t('cta.fast')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="truck" size={13} className="text-mint-200" />
                {t('samples.deliveryFree')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="box" size={13} className="text-mint-200" />
                {siteConfig.business.sampleBoxMaxItems} {t('stats.samples')}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href={`/${locale}/samples`}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-gold-500 px-6 text-[14.5px] font-extrabold text-pine-950 transition hover:bg-gold-400 active:scale-[0.98]"
            >
              <Icon name="box" size={18} />
              {t('nav.getSample')}
            </Link>
            <a
              href={c.phonePrimaryHref}
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/25 px-5 font-mono text-[14px] font-bold text-white transition hover:bg-white/10"
            >
              <Icon name="phone" size={17} />
              {formatUzPhone(c.phonePrimary)}
            </a>
          </div>
        </div>
      </section>

      <JsonLdGroup items={[breadcrumbLd(crumbs.map((x) => ({ name: x.label, path: x.href })), locale), aboutLd(locale)]} />
    </>
  );
}
