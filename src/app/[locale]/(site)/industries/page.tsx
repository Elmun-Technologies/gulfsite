/**
 * SOHALAR — RO'YXAT (§5, design/Industries.dc.html)
 * ----------------------------------------------------------------
 * HERO — panel (breadcrumb · H1 · matn) + navy monogramma paneli
 *          ("A sense of Bliss" — slogan tarjima qilinmaydi, §10.4)
 * GRID — "Qaysi soha uchun ishlaysiz?" + yo'nalishlar soni (MA'LUMOTDAN)
 *          va 14 ta kartochka: 0N · rasm (agar bor bo'lsa) · nom · chip'lar
 * CTA  — 3 ta kapsula: "soha" · navy strelka · mis "Sohangiz yo'qmi?"
 *
 * Kartochka ohanglari (navy / copper / panel) `lib/design.ts →
 * industryTone()` dan; chip'lar esa har soha uchun MA'LUMOTDAN eng ko'p
 * uchraydigan guruhlar (`industryChips()`), hardcode emas (§7.1).
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { LOCALES, makeT, normalizeLocale, type AppLocale } from '@/i18n';
import { buildMetadata, breadcrumbLd, linkListLd } from '@/lib/seo';
import { industriesWithData, monogramCopy, publicAssetExists } from '@/lib/design';
import type { Locale } from '@/lib/taxonomy';
import { JsonLdGroup } from '@/components/seo/JsonLd';
import { PageHead } from '@/components/ui/PageHead';
import { Section, SectionHeader } from '@/components/ui/SectionHeader';
import { MonogramPanel } from '@/components/ui/MonogramPanel';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/motion';
import { cn } from '@/lib/utils';

interface Props {
  params: Promise<{ locale: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  const count = industriesWithData(locale as Locale).length;

  return buildMetadata({
    locale,
    title: t('seo.industries.title', { count }),
    description: t('seo.industries.description'),
    path: '/industries',
    image: '/images/industries.jpg',
  });
}

export default async function IndustriesPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: AppLocale = normalizeLocale(raw);
  const L = locale as Locale;
  const t = makeT(locale);

  // Faqat haqiqatan mahsuloti bor yo'nalishlar (§7.1 — son ma'lumotdan)
  const industries = industriesWithData(L);

  return (
    <>
      <JsonLdGroup
        items={[
          breadcrumbLd(
            [
              { name: t('nav.home'), path: '/' },
              { name: t('nav.industries'), path: '/industries' },
            ],
            locale,
          ),
          linkListLd(
            industries.map((i) => ({ path: `/industries/${i.id}`, name: i.label })),
            locale,
            t('nav.industries'),
          ),
        ]}
      />

      {/* ============ HERO ============ */}
      <PageHead
        title={t('nav.industries')}
        text={t('industries.head.text')}
        crumbs={[{ label: t('nav.home'), href: `/${locale}` }, { label: t('nav.industries') }]}
        crumbLabel={t('nav.industries')}
        aside={
          <MonogramPanel
            variant="bliss"
            cycle={false}
            copy={monogramCopy(t)}
            minHeight="clamp(312px, 36.1vw, 520px)"
            className="px-10 pb-24 pt-16"
          />
        }
        className="[&>div:first-child]:min-h-[clamp(312px,36.1vw,520px)]"
      />

      {/* ============ GRID ============ */}
      <Section gap={false} className="pt-[clamp(64px,7vw,96px)]">
        <SectionHeader
          title={t('industries.question')}
          rules="none"
          className="pb-8"
          aside={
            <span className="text-[16px] text-muted">
              {t('industries.directions', { count: industries.length })}
            </span>
          }
        />

        <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]">
          {industries.map((ind, i) => (
            <Reveal
              key={ind.id}
              sx={20}
              delay={Math.min(i, 7) * 0.06}
              className="min-h-[280px]"
            >
              {/* `aria-label` yo'q — WCAG 2.5.3: nom ko'rinadigan matnni
                  o'z ichiga olishi kerak (karte raqami + soha nomi + hisob). */}
              <Link
                href={`/${locale}/industries/${ind.id}`}
                className={cn(
                  'flex h-full min-h-[280px] flex-col gap-1 rounded-card p-3 text-ink no-underline',
                  ind.tone === 'navy' && 'bg-navy text-white',
                  ind.tone === 'copper' && 'bg-copper text-ink',
                  ind.tone === 'panel' && 'bg-panel',
                )}
              >
                {ind.image && publicAssetExists(ind.image) ? (
                  <span className="media-frame relative block aspect-16/9 overflow-hidden rounded-[26px]">
                    <Image
                      src={ind.image}
                      alt={t('industries.cardAlt', { name: ind.label })}
                      fill
                      sizes="(max-width: 700px) 100vw, 31vw"
                      className="media-zoom object-cover"
                    />
                  </span>
                ) : null}

                <span className="flex flex-grow flex-col justify-between gap-4 px-4 py-[18px] pb-4">
                  <span className="flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        'font-display text-[40px] font-light leading-none tracking-[-0.04em]',
                        ind.tone === 'navy' && 'text-copper-light',
                        ind.tone === 'copper' && 'text-ink',
                        ind.tone === 'panel' && 'text-copper-dark',
                      )}
                    >
                      {ind.num}
                    </span>
                    <span
                      className={cn(
                        'btn-icon btn-icon--44 shrink-0',
                        ind.tone === 'navy' ? 'btn-icon--white' : 'btn-icon--navy',
                      )}
                    >
                      <ArrowUpRight size={18} strokeWidth={2} aria-hidden />
                    </span>
                  </span>

                  <span className="text-[clamp(21px,1.8vw,26px)] font-medium leading-[1.15] tracking-[-0.02em]">
                    {ind.label}
                  </span>

                  <span className="flex flex-wrap gap-1.5">
                    {ind.chips.map((c) => (
                      <span
                        key={c}
                        className={cn(
                          'rounded-pill border px-3 py-1.5 text-[13px]',
                          ind.tone === 'navy' && 'border-[#4A4878] text-white',
                          ind.tone === 'copper' && 'border-copper-dark text-ink',
                          ind.tone === 'panel' && 'border-line text-ink',
                        )}
                      >
                        {c}
                      </span>
                    ))}
                    <span
                      className={cn(
                        'rounded-pill border px-3 py-1.5 text-[13px]',
                        ind.tone === 'navy' ? 'border-[#4A4878] text-copper-light' : 'border-line text-muted',
                      )}
                    >
                      {t('industries.products', { count: ind.count })}
                    </span>
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============ CTA — 3 ta kapsula ============ */}
      <Section gap={false} className="flex flex-wrap gap-3 pb-4 pt-[clamp(64px,7vw,96px)]">
        <Reveal className="flex min-h-[200px] flex-[1_1_260px] items-center justify-center rounded-pill bg-panel text-[clamp(32px,4vw,64px)] font-normal tracking-[-0.03em]">
          {t('industries.chipLabel')}
        </Reveal>

        <Reveal
          delay={0.06}
          sx={20}
          className="flex min-h-[200px] flex-[0_1_200px] items-center justify-center rounded-pill bg-navy text-copper-light"
        >
          <ArrowRight size={96} strokeWidth={2.4} aria-hidden />
        </Reveal>

        <Reveal
          delay={0.12}
          sx={20}
          className="flex min-h-[200px] flex-[2_1_480px] flex-wrap items-center justify-between gap-4 rounded-pill bg-copper py-6 pl-[clamp(24px,3.3vw,48px)] pr-6"
        >
          <span className="flex flex-col gap-1.5">
            <span className="text-[clamp(24px,2.4vw,36px)] font-normal leading-tight tracking-[-0.025em]">
              {t('industries.missing')}
            </span>
            <span className="text-body-l text-ink">{t('industries.missingText')}</span>
          </span>
          <ButtonLink href={`/${locale}/contact`} variant="primary" size="lg" className="shrink-0">
            {t('industries.writeTech')}
            <ArrowUpRight size={18} aria-hidden />
          </ButtonLink>
        </Reveal>
      </Section>
    </>
  );
}
