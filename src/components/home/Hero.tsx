import Link from 'next/link';
import type { AppLocale } from '@/i18n';
import type { Translator } from '@/i18n';
import { MonogramPanel } from '@/components/ui/MonogramPanel';
import { monogramCopy } from '@/lib/design';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal, SplitLines } from '@/components/motion';

/**
 * HERO (§5, design/Main.dc.html · HERO)
 * ----------------------------------------------------------------
 * Ikki panel:
 *   chap  — panel fon, chip, H1 (SplitLines), matn, 2 CTA
 *   o'ng  — navy monogramma paneli (Joy → Bliss → Delight),
 *           sertifikat pill'lari va katalog strelkasi
 *
 * Hero kontenti SSR'da to'liq ko'rinadi (globals.css §4b).
 * Mobil <768px: panellar ustun bo'lib joylashadi, monogramma paneli
 * `min-height: clamp(408px, 47vw, 680px)` (§9).
 */

const CERTS = ['Halal', 'ISO 22000', 'HACCP'];

export function Hero({
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
  return (
    <section className="container-page flex flex-wrap gap-4 pt-4">
      {/* ---------- CHAP ---------- */}
      <div className="flex min-h-[clamp(408px,47.2vw,680px)] min-w-0 flex-1 basis-[560px] flex-col justify-between gap-12 rounded-block bg-panel p-[clamp(28px,4vw,56px)]">
        <div className="flex flex-col gap-8">
          <Reveal
            as="span"
            trigger="mount"
            y={0}
            sx={0}
            origin="left"
            className="inline-flex w-fit items-center gap-2.5 rounded-pill border border-line px-[18px] py-2.5 text-[15px] font-medium"
          >
            <span className="h-2 w-2 rounded-pill bg-navy" aria-hidden />
            {t('home.hero.chip')}
          </Reveal>

          <SplitLines
            as="h1"
            text={t('home.hero.title')}
            trigger="mount"
            className="m-0 text-[clamp(36px,6.4vw,104px)] font-normal leading-[0.96] tracking-[-0.035em]"
          />
        </div>

        <div className="flex flex-col gap-7">
          <Reveal as="p" trigger="mount" delay={0.15} className="m-0 max-w-[520px] text-body-l text-body">
            {t('home.hero.text')}
          </Reveal>

          <Reveal className="flex flex-wrap gap-3" trigger="mount" delay={0.22}>
            <ButtonLink href={`/${locale}/samples`} variant="accent" size="lg" arrow>
              {t('home.hero.ctaSample')}
            </ButtonLink>
            <ButtonLink href={`/${locale}/catalog`} variant="outline" size="lg">
              {t('home.hero.ctaCatalog', { count: productCount })}
            </ButtonLink>
          </Reveal>

          <Reveal as="span" trigger="mount" delay={0.3} className="text-[14px] text-muted">
            {t('home.hero.since')}
          </Reveal>
        </div>
      </div>

      {/* ---------- O'NG ---------- */}
      <Reveal className="min-w-0 flex-1 basis-[420px]" trigger="mount" delay={0.08}>
        <MonogramPanel
          variant="joy"
          cycle
          copy={monogramCopy(t)}
          certs={CERTS}
          priority
          arrow={{ href: `/${locale}/catalog`, label: t('home.hero.toCatalog'), size: 80 }}
          className="h-full min-h-[clamp(408px,47.2vw,680px)]"
        />
      </Reveal>

      {/* Screen-reader uchun pozitsiyalar soni (hisob ma'lumotdan) */}
      <span className="sr-only">{tp('plural.positions', productCount)}</span>
      <Link href={`/${locale}/about`} className="sr-only focus:not-sr-only">
        {t('nav.about')}
      </Link>
    </section>
  );
}
