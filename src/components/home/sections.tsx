import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowRight, Play } from 'lucide-react';
import type { AppLocale, Translator } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { tr, type Locale } from '@/lib/taxonomy';
import { categoriesWithData, industriesWithData, monogramCopy, publicAssetExists } from '@/lib/design';
import { CountUp, Reveal, RevealGroup, SplitLines } from '@/components/motion';
import { ButtonLink, IconButton } from '@/components/ui/Button';
import { CertGrid, CertPill, Pill } from '@/components/ui/Pill';
import { MonogramPanel } from '@/components/ui/MonogramPanel';
import { Section, SectionHeader, SectionInset } from '@/components/ui/SectionHeader';
import { GffLeadForm } from '@/components/lead/GffLeadForm';
import { UZ_REGIONS } from '@/lib/taxonomy';
import { categoryHref } from '@/lib/category-pages';

/**
 * BOSH SAHIFA BO'LIMLARI (§5, design/Main.dc.html)
 * ----------------------------------------------------------------
 * 01 Kompaniya · 02 Kategoriyalar · 03 Namuna qutisi ·
 * 04 Jarayon · 05 Sohalar · 06 Aloqa
 *
 * Barcha sonlar MA'LUMOTDAN hisoblanadi (§7.1). Har bo'lim CTA ga olib boradi.
 */

const CERT_NAMES = ['HALAL', 'ISO 22000', 'HACCP', 'SGS', 'RACS', 'TRAKHEES'];
/** Bosh sahifa industry pill'larining burilish burchaklari (dizayn) */
const PILL_ROTATE = ['-4deg', '0deg', '0deg', '3deg', '0deg', '0deg', '0deg', '-3deg', '0deg', '4deg', '0deg', '0deg', '-2deg'];

/* ============================================================
   01 · KOMPANIYA
   ============================================================ */

export function AboutSection({
  locale,
  t,
  tp,
  productCount,
}: {
  locale: AppLocale;
  t: Translator;
  tp: Translator['tp'];
  productCount: number;
}) {
  const biz = siteConfig.business;
  const video = siteConfig.productionVideo && publicAssetExists(siteConfig.productionVideo)
    ? siteConfig.productionVideo
    : siteConfig.productionVideo || '';

  const stats = [
    { key: 'home.stat.positions', value: productCount, plain: false },
    // §7.1 — qo'lda yozilgan raqam emas: ma'lumotli kategoriyalar soni
    { key: 'home.stat.directions', value: categoriesWithData(locale as Locale).length, plain: false },
    { key: 'home.stat.since', value: siteConfig.stats.founded, plain: true },
    { key: 'home.stat.samples', value: biz.sampleBoxMaxItems, plain: false },
  ] as const;

  return (
    <Section id="kompaniya" bleed className="mt-4 bg-panel pb-4 pt-[clamp(64px,8vw,112px)]">
      <div className="container-page">
        <SectionInset className="flex flex-wrap items-start gap-x-12 gap-y-8">
          <div className="flex flex-1 basis-[320px] flex-col gap-9">
            <SplitLines
              as="h2"
              text={t('home.about.title')}
              className="m-0 text-[clamp(32px,4.6vw,72px)] font-normal leading-none tracking-[-0.03em]"
            />
            {video ? (
              <a
                href={video}
                target={video.startsWith('http') ? '_blank' : undefined}
                rel={video.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group inline-flex w-fit items-center gap-3.5 text-[17px] text-body underline underline-offset-4"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-pill border-[1.5px] border-ink text-ink transition-colors group-hover:bg-ink group-hover:text-white">
                  <Play size={16} fill="currentColor" aria-hidden />
                </span>
                <span className="underline underline-offset-4">{t('home.about.video')}</span>
              </a>
            ) : null}
          </div>

          <Reveal className="flex flex-1 basis-[280px] flex-col gap-3.5">
            <h3 className="m-0 text-[18px] font-semibold">{t('home.about.whoTitle')}</h3>
            <p className="m-0 text-body text-body">{t('home.about.whoText')}</p>
          </Reveal>

          <Reveal className="flex flex-1 basis-[280px] flex-col gap-3.5">
            <h3 className="m-0 text-[18px] font-semibold">{t('home.about.whyTitle')}</h3>
            <p className="m-0 text-body text-body">{t('home.about.whyText')}</p>
          </Reveal>

          <Reveal y="40%" delay={0.1} className="shrink-0 text-section-num font-light" aria-hidden>
            01.
          </Reveal>
        </SectionInset>

        {/* ---- Sertifikatlar bloki ---- */}
        <Reveal className="mt-[clamp(48px,6vw,80px)] flex flex-wrap items-stretch gap-x-12 gap-y-4 rounded-block bg-white p-4">
          <div className="media-frame relative min-h-[clamp(252px,29.2vw,420px)] min-w-0 flex-1 basis-[380px] overflow-hidden rounded-media">
            <Image
              src="/images/spices.jpg"
              alt={t('home.about.certsImgAlt')}
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              className="media-zoom object-cover"
            />
            <span className="absolute inset-x-5 bottom-5 rounded-caption bg-white px-[22px] py-[18px] text-[clamp(22px,2.2vw,30px)] font-normal leading-[1.15] tracking-[-0.02em]">
              {t('home.about.quote')}
            </span>
          </div>

          <div className="flex min-w-0 flex-[1.3] basis-[480px] flex-col justify-between gap-8 p-[clamp(8px,2vw,32px)] max-lg:px-[clamp(8px,2vw,32px)] lg:pl-0">
            <SplitLines
              as="h3"
              text={t('home.about.certsTitle')}
              className="m-0 text-h3 font-normal"
            />
            <CertGrid items={CERT_NAMES} />
            <p className="m-0 text-[16px] text-muted">{t('home.about.certsText')}</p>
          </div>
        </Reveal>

        {/* ---- Raqamlar ---- */}
        <RevealGroup className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.key}
              index={i}
              className="flex flex-col gap-1.5 rounded-pill bg-white px-10 py-[26px]"
            >
              <span className="text-stat-label italic text-muted">{t(s.key)}</span>
              <span className="self-end text-[40px] font-semibold leading-none tracking-[-0.02em]">
                <CountUp value={s.value} locale={locale} plain={'plain' in s ? Boolean(s.plain) : false} />
              </span>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
      <span className="sr-only">{tp('plural.positions', productCount)}</span>
    </Section>
  );
}

/* ============================================================
   02 · KATEGORIYALAR
   ============================================================ */

export function CategoriesSection({
  locale,
  t,
  productCount,
}: {
  locale: AppLocale;
  t: Translator;
  productCount: number;
}) {
  const cats = categoriesWithData(locale as Locale);
  /** Dizayndagi qisqa izohlar (kategoriya hint'i emas — sahifa uchun) */
  const hints: Record<string, string> = {
    flavours: t('home.cat.flavours'),
    fragrances: t('home.cat.fragrances'),
    'food-ingredients': t('home.cat.ingredients'),
    'essential-oils': t('home.cat.oils'),
    'aroma-chemicals': t('home.cat.aroma'),
    commodities: t('home.cat.commodities'),
  };

  return (
    <Section id="katalog">
      <SectionInset>
        <SectionHeader
          title={t('home.cat.title')}
          num="02"
          images={[
            { src: '/images/berries.jpg', alt: '' },
            { src: '/images/cat-flavours.jpg', alt: '' },
          ]}
        />

        <div className="flex flex-wrap items-end justify-between gap-6 py-10">
          <div className="flex max-w-[460px] flex-col gap-2.5">
            <Reveal as="h3" className="m-0 text-[28px] font-normal tracking-[-0.02em]">
              {t('home.cat.lead')}
            </Reveal>
            <Reveal as="p" delay={0.06} className="m-0 text-body leading-[1.55] text-muted">
              {t('home.cat.text')}
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <ButtonLink href={`/${locale}/catalog`} variant="outline" size="md" arrow>
              {t('home.cat.all', { count: productCount })}
            </ButtonLink>
          </Reveal>
        </div>
      </SectionInset>

      <RevealGroup className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {cats.map((c, i) => (
          <Reveal key={c.id} index={i}>
            <Link
              href={categoryHref(c.id, locale)}
              className="group card flex h-full flex-col gap-[22px] p-3 pb-7 no-underline"
            >
              <span className="media-frame block aspect-4/3 w-full overflow-hidden rounded-media">
                <Image
                  src={c.image}
                  alt={t('home.cat.imgAlt', { name: c.label })}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="media-zoom object-cover"
                />
              </span>

              <span className="flex flex-col gap-2.5 px-4">
                <span className="text-card-title">{c.label}</span>
                <span className="text-[16px] leading-[1.5] text-muted">{hints[c.id] ?? c.hint}</span>
              </span>

              <span className="flex items-center justify-between px-4">
                <Pill>{t('common.items', { count: c.count })}</Pill>
                <span className="btn-icon btn-icon--48 btn-icon__arrow-wrap" aria-hidden>
                  <span className="btn-icon__arrow">
                    <ArrowRight size={18} strokeWidth={2} />
                  </span>
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ============================================================
   03 · NAMUNA QUTISI
   ============================================================ */

export function SampleBoxSection({
  locale,
  t,
}: {
  locale: AppLocale;
  t: Translator;
}) {
  const biz = siteConfig.business;
  const tiles = [
    { title: t('home.box.tile1Title'), text: t('home.box.tile1Text') },
    { title: t('home.box.tile2Title', { days: biz.sampleDeliveryDays }), text: t('home.box.tile2Text') },
    { title: t('home.box.tile3Title'), text: t('home.box.tile3Text') },
    { title: t('home.box.tile4Title'), text: t('home.box.tile4Text') },
  ];

  return (
    <Section id="namuna">
      <SectionInset className="flex flex-wrap items-end justify-between gap-6 pb-10">
        <div className="flex flex-col gap-4">
          <Reveal as="span" className="w-fit">
            <Pill className="text-[14px]">{t('home.box.chip')}</Pill>
          </Reveal>
          <SplitLines
            as="h2"
            text={t('home.box.title')}
            className="m-0 text-h2 font-normal"
          />
        </div>
        <Reveal y="40%" delay={0.1} className="text-section-num font-light" aria-hidden>
          03.
        </Reveal>
      </SectionInset>

      <div className="flex flex-wrap gap-4">
        {/* Foto — clip-path bilan ochiladi (§8.3) */}
        <Reveal
          clip
          className="media-frame relative min-h-[clamp(336px,38.9vw,560px)] min-w-0 flex-1 basis-[380px] overflow-hidden rounded-block bg-panel"
        >
          <Image
            src="/images/sample-pod.jpg"
            alt={t('home.box.problemImgAlt')}
            fill
            priority={false}
            sizes="(max-width: 900px) 100vw, 40vw"
            className="object-cover"
          />
        </Reveal>

        <div className="flex min-w-0 flex-[1.6] basis-[520px] flex-col gap-4">
          <RevealGroup className="grid flex-grow grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
            {/* Muammo */}
            <Reveal index={0} className="flex min-h-[300px] flex-col justify-between gap-10 rounded-block bg-slate p-10 text-white">
              <SplitLines as="span" text={t('home.box.problem')} className="text-[clamp(32px,4vw,60px)] font-normal leading-none tracking-[-0.03em]" />
              <p className="m-0 text-body leading-[1.6] text-on-navy">{t('home.box.problemText')}</p>
            </Reveal>

            {/* Yechim */}
            <Reveal index={1} className="flex min-h-[300px] flex-col justify-between gap-10 rounded-block bg-navy p-10 text-white">
              <SplitLines as="span" text={t('home.box.solution')} className="text-[clamp(32px,4vw,60px)] font-normal leading-none tracking-[-0.03em]" />
              <div className="flex flex-col gap-6">
                <p className="m-0 text-body leading-[1.6] text-on-navy-soft">
                  {t('home.box.solutionText', { max: biz.sampleBoxMaxItems })}
                </p>
                <ButtonLink href={`/${locale}/samples`} variant="accent" size="md" arrow className="self-start">
                  {t('home.box.cta')}
                </ButtonLink>
              </div>
            </Reveal>
          </RevealGroup>

          <RevealGroup className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            {tiles.map((tile, i) => (
              <Reveal key={tile.title} index={i} className="flex flex-col gap-2 rounded-media bg-panel px-[26px] py-6">
                <span className="text-[28px] font-medium leading-none tracking-[-0.02em]">{tile.title}</span>
                <span className="text-small leading-[1.45] text-muted">{tile.text}</span>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}

/* ============================================================
   04 · JARAYON
   ============================================================ */

export function ProcessSection({ t }: { t: Translator }) {
  const biz = siteConfig.business;
  const steps = [
    { n: '01', title: t('home.process.1Title'), text: t('home.process.1Text') },
    { n: '02', title: t('home.process.2Title'), text: t('home.process.2Text', { minutes: biz.responseMinutes }) },
    { n: '03', title: t('home.process.3Title'), text: t('home.process.3Text', { days: biz.sampleDeliveryDays }) },
    { n: '04', title: t('home.process.4Title'), text: t('home.process.4Text') },
  ];

  return (
    <Section>
      <SectionInset>
        {/* Kapsulalar */}
        <RevealGroup className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
          <Reveal index={0} className="flex h-[clamp(120px,14vw,200px)] items-center justify-center rounded-pill bg-navy text-[clamp(33px,4.6vw,72px)] font-normal tracking-[-0.03em] text-white">
            {t('home.process.cap1')}
          </Reveal>

          <Reveal index={1} className="media-frame h-[clamp(120px,14vw,200px)] overflow-hidden rounded-pill">
            <Image
              src="/images/berries.jpg"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="media-zoom object-cover"
            />
          </Reveal>

          <Reveal index={2} className="flex h-[clamp(120px,14vw,200px)] items-center justify-center rounded-pill bg-panel text-ink">
            <ArrowRight size={72} strokeWidth={3} aria-label={t('home.process.arrowAlt')} />
          </Reveal>

          <Reveal index={3} className="flex h-[clamp(120px,14vw,200px)] items-center justify-center rounded-pill bg-copper text-[clamp(33px,4.6vw,72px)] font-normal tracking-[-0.03em] text-ink">
            {t('home.process.cap2')}
          </Reveal>
        </RevealGroup>

        <SectionHeader title={t('home.process.title')} num="04" className="mt-10" />

        <RevealGroup className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8 pt-10">
          {steps.map((s, i) => (
            <Reveal key={s.n} index={i} className="flex flex-col gap-3">
              <span className="text-[15px] text-muted">{s.n}</span>
              <span className="text-[24px] font-medium tracking-[-0.01em]">{s.title}</span>
              <span className="text-[16px] leading-[1.55] text-muted">{s.text}</span>
            </Reveal>
          ))}
        </RevealGroup>
      </SectionInset>
    </Section>
  );
}

/* ============================================================
   05 · SOHALAR
   ============================================================ */

export function IndustriesSection({ locale, t }: { locale: AppLocale; t: Translator }) {
  const industries = industriesWithData(locale as Locale);

  return (
    <Section id="sohalar">
      <div className="flex flex-wrap gap-4">
        {/* Chap: monogramma + "Sohalar" plitkasi */}
        <Reveal className="flex min-w-0 flex-1 basis-[380px] flex-col gap-4">
          <MonogramPanel
            variant="delight"
            cycle
            copy={monogramCopy(t)}
            className="min-h-[clamp(252px,29.2vw,420px)] flex-grow px-12 pb-12 pt-12"
          />
          <Link
            href={`/${locale}/industries`}
            className="group flex items-center justify-between gap-4 rounded-block bg-panel px-10 py-7 no-underline"
          >
            <span className="text-[clamp(36px,3.6vw,56px)] font-normal leading-none tracking-[-0.03em]">
              {t('home.ind.title')}
            </span>
            <span className="btn-icon__arrow text-ink transition-transform group-hover:rotate-0" aria-hidden>
              <ArrowDownRight size={56} strokeWidth={2.4} />
            </span>
          </Link>
        </Reveal>

        {/* O'ng: savol + soha pill'lari */}
        <Reveal
          delay={0.08}
          className="flex min-w-0 flex-[1.5] basis-[520px] flex-col gap-10 rounded-block border border-line-soft bg-white p-[clamp(28px,4vw,56px)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <SplitLines
              as="h2"
              text={t('home.ind.question')}
              className="m-0 text-[clamp(32px,4.4vw,68px)] font-normal leading-none tracking-[-0.03em]"
            />
            <Reveal delay={0.14} as="span" className="max-w-[280px] text-[16px] leading-[1.5] text-muted">
              {t('home.ind.text')}
            </Reveal>
          </div>

          <div className="flex flex-wrap gap-3 py-3">
            {industries.map((ind, i) => {
              const rotate = PILL_ROTATE[i % PILL_ROTATE.length] ?? '0deg';
              const filled = i === 2;
              const accent = i === 7;
              return (
                <Reveal key={ind.id} y={0} sx={0.94} sy={0.94} delay={i * 0.02}>
                  {/* `aria-label` yo'q — WCAG 2.5.3 (nom ko'rinadigan matndan) */}
                  <Link
                    href={`/${locale}/industries/${ind.id}`}
                    className="inline-block rounded-pill px-7 py-4 text-[clamp(20px,1.8vw,26px)] font-normal no-underline transition-colors"
                    style={{
                      transform: `rotate(${rotate})`,
                      background: accent ? 'var(--copper)' : filled ? 'var(--navy)' : 'transparent',
                      color: accent || filled ? (accent ? 'var(--ink)' : '#fff') : 'var(--ink)',
                      border: accent || filled ? '1.5px solid transparent' : '1.5px solid var(--ink)',
                    }}
                  >
                    {ind.label}
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ============================================================
   06 · ALOQA
   ============================================================ */

export function ContactSection({
  locale,
  t,
}: {
  locale: AppLocale;
  t: Translator;
}) {
  const biz = siteConfig.business;
  const c = siteConfig.contact;

  return (
    <Section id="aloqa" className="flex flex-wrap gap-3 pb-4">
      {/* Ombor fotosi */}
      <Reveal className="media-frame relative min-h-[clamp(360px,41.7vw,600px)] min-w-0 flex-1 basis-[300px] overflow-hidden rounded-block">
        <Image
          src="/images/warehouse.jpg"
          alt={t('home.contact.warehouseAlt')}
          fill
          sizes="(max-width: 900px) 100vw, 33vw"
          className="media-zoom object-cover"
        />
        <span className="absolute bottom-5 left-5 rounded-pill bg-white px-[18px] py-2.5 text-[15px] font-medium">
          {t('home.contact.warehouse')}
        </span>
      </Reveal>

      {/* "Kerakli ta'mni birga topamiz" */}
      <Reveal
        delay={0.08}
        data-surface="ink"
        className="flex min-h-[clamp(360px,41.7vw,600px)] min-w-0 flex-1 basis-[300px] flex-col justify-between gap-12 rounded-block bg-ink p-[clamp(28px,3vw,44px)] text-white"
      >
        <SplitLines
          as="span"
          text={t('home.contact.left')}
          className="text-[clamp(33px,4.4vw,68px)] font-normal leading-none tracking-[-0.03em]"
        />
        <IconButton href="#forma" label={t('home.contact.toForm')} size={120} tone="accent" arrow className="self-start" />
        <SplitLines
          as="span"
          text={t('home.contact.right')}
          delay={0.12}
          className="self-end text-right text-[clamp(33px,4.4vw,68px)] font-normal leading-none tracking-[-0.03em]"
        />
      </Reveal>

      {/* Forma */}
      <GffLeadForm
        id="forma"
        type="callback"
        locale={locale}
        variant="home"
        className="min-w-0 flex-[1.2] basis-[380px]"
        labels={{
          title: t('home.form.title'),
          text: t('home.form.text', { minutes: biz.responseMinutes }),
          submit: t('home.form.submit'),
          name: t('home.form.name'),
          namePh: t('home.form.namePh'),
          company: t('home.form.company'),
          companyPh: t('home.form.companyPh'),
          phone: t('home.form.phone'),
          message: t('home.form.message'),
          messagePh: t('home.form.messagePh'),
          consent: t('form.consentShort'),
          privacy: t('footer.privacy'),
          thanks: t('contact.thanks'),
          thanksText: t('contact.thanksText', { type: t('contact.type.callback'), minutes: biz.responseMinutes }),
          errName: t('err.nameShort'),
          errCompany: t('err.companyShort'),
          errPhone: t('err.phone'),
          errConsent: t('err.consent'),
          errServer: t('err.server'),
        }}
        successLinks={[{ href: `/${locale}/catalog`, label: t('contact.viewCatalog') }]}
      />

      {/* Manzil ma'lumotlari (screen-reader + SEO) */}
      <div className="sr-only">
        <address>
          {c.address} · {c.phonePrimary} · {c.email}
        </address>
        <ul>
          {UZ_REGIONS.map((r) => (
            <li key={r.id}>{tr(r.name, locale as Locale)}</li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/** Kichik yordamchi: sertifikat pill'i (About/Footer'da ham ishlatiladi) */
export { CertPill };
