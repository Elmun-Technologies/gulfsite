/**
 * HUQUQIY HUJJAT KO'RINISHI (§5, design/Privacy.dc.html · §2 — mavjud
 * ma'lumot modeli saqlanadi)
 * ----------------------------------------------------------------
 * Matn manbai — `lib/legal.ts` (`PRIVACY` / `TERMS`): uch tilda,
 * bo'limlar ankor (fragment) bilan. Bu BIRDONA manba: i18n lug'atida
 * huquqiy matn saqlanmaydi, shuning uchun ikki xil tahrir paydo
 * bo'lmaydi.
 *
 * Tuzilma (dizayn bo'yicha):
 *   HEAD    — breadcrumb · H1 · intro · "Oxirgi yangilanish: {sana}"
 *   MUNDARIJA — bo'limlar ro'yxati (ankor), chap ustun (sticky)
 *   BO'LIMLAR — raqam · sarlavha · paragraf · ro'yxat · juftlik jadvali
 *   ALOQA  — navy blok: savol uchun e-mail + "Aloqa" tugmasi
 */

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { AppLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { tr, type Locale } from '@/lib/taxonomy';
import type { LegalDoc } from '@/lib/legal';
import { Section } from '@/components/ui/SectionHeader';
import { Breadcrumbs } from '@/components/ui/PageHead';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/motion';

export interface LegalPageLabels {
  toc: string;
  updated: (date: string) => string;
  question: string;
  contactCta: string;
  homeCrumb: string;
  /** faqat privacy uchun: "matn yurist tasdig'ida" ogohlantirishi */
  draftNote?: string;
  /** qarama-qarshi hujjat havolasi matni (Privacy ↔ Terms) */
  otherDoc: { href: string; label: string };
}

export function LegalPage({
  doc,
  locale,
  title,
  labels,
  crumbs,
}: {
  doc: LegalDoc;
  locale: AppLocale;
  title: string;
  labels: LegalPageLabels;
  crumbs: { label: string; href?: string }[];
}) {
  const L = locale as Locale;
  const c = siteConfig.contact;

  const dateLabel = new Intl.DateTimeFormat(
    locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-GB' : 'uz-Latn-UZ',
    { year: 'numeric', month: 'long', day: 'numeric' },
  ).format(new Date(doc.updated));

  return (
    <>
      {/* ============ HEAD ============ */}
      <Section gap={false} className="pt-2">
        <Reveal className="flex flex-col gap-6 rounded-block bg-panel p-[clamp(28px,4vw,56px)]">
          <Breadcrumbs label={title} items={crumbs} />

          <h1 className="m-0 max-w-[900px] text-page-title font-normal">{title}</h1>

          <p className="m-0 max-w-[760px] text-body-l leading-relaxed text-body">{tr(doc.intro, L, '')}</p>

          <span className="text-[15px] text-muted">{labels.updated(dateLabel)}</span>

          {labels.draftNote ? (
            <p className="m-0 max-w-[720px] rounded-card border border-line bg-white px-6 py-5 text-[15px] leading-relaxed text-body">
              {labels.draftNote}
            </p>
          ) : null}
        </Reveal>
      </Section>

      {/* ============ MUNDARIJA + BO'LIMLAR ============ */}
      <Section className="flex flex-wrap gap-8 md:gap-12">
        <nav
          aria-label={labels.toc}
          className="flex flex-1 basis-[280px] flex-col gap-4 self-start md:sticky md:top-28 md:px-[clamp(0px,3vw,48px)]"
        >
          <span className="label">{labels.toc}</span>
          <ol className="m-0 flex list-none flex-col gap-1 p-0">
            {doc.sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-baseline gap-3 py-1.5 text-[15px] leading-snug text-body no-underline transition-colors hover:text-ink"
                >
                  <span className="w-6 shrink-0 text-[13px] text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {tr(s.title, L, s.id).replace(/^\d+\.\s*/, '')}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="legal-prose flex min-w-0 flex-[1.6_1_560px] flex-col">
          {doc.sections.map((s, i) => (
            <Reveal
              key={s.id}
              as="section"
              sx={12}
              id={s.id}
              className="scroll-mt-28 border-t border-line py-7 first:border-t-0"
            >
              <h2 className="m-0 flex items-baseline gap-4 text-h4">
                <span className="font-display text-[clamp(24px,2.4vw,36px)] font-light text-copper-dark">
                  {String(i + 1).padStart(2, '0')}.
                </span>
                {tr(s.title, L, s.id).replace(/^\d+\.\s*/, '')}
              </h2>

              {s.body.map((p, pi) => (
                <p key={pi} className="m-0 mt-3 max-w-[720px] text-body-l leading-relaxed text-body">
                  {tr(p, L, '')}
                </p>
              ))}

              {s.list ? (
                <ul className="mt-4 flex max-w-[720px] list-none flex-col gap-2 p-0">
                  {s.list.map((li, ii) => (
                    <li key={ii} className="flex gap-3 text-body-l leading-relaxed text-body">
                      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-pill bg-copper" />
                      {tr(li, L, '')}
                    </li>
                  ))}
                </ul>
              ) : null}

              {s.pairs ? (
                <div className="mt-5 overflow-x-auto rounded-media border border-line">
                  <table className="spec-table min-w-[420px]">
                    <tbody>
                      {s.pairs.map((pr, pi) => (
                        <tr key={pi}>
                          <th scope="row">{tr(pr.label, L, '')}</th>
                          <td>{tr(pr.value, L, '')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </Reveal>
          ))}
        </article>
      </Section>

      {/* ============ ALOQA BLOKI ============ */}
      <Section
        gap={false}
        className="flex flex-wrap items-center justify-between gap-4 rounded-block bg-navy p-[clamp(24px,3vw,40px)] pb-6 text-white"
      >
        <span className="flex flex-col gap-1.5">
          <span className="text-[15px] text-copper-light">{labels.question}</span>
          <a
            href={`mailto:${c.email}`}
            className="text-[clamp(20px,2vw,28px)] font-medium text-white no-underline hover:text-copper-light"
          >
            {c.email}
          </a>
        </span>
        <ButtonLink href={`/${locale}/contact`} variant="accent" size="lg" className="shrink-0">
          {labels.contactCta}
          <ArrowUpRight size={18} aria-hidden />
        </ButtonLink>
      </Section>

      <p className="container-page py-6 text-[13px]">
        <Link href={labels.otherDoc.href} className="text-muted underline underline-offset-4 hover:text-ink">
          {labels.otherDoc.label}
        </Link>
      </p>
    </>
  );
}
