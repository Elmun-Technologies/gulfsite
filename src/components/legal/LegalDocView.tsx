/**
 * HUQUQIY HUJJAT KO'RINISHI
 * ----------------------------------------------------------------
 * /privacy va /terms sahifalari bir xil tuzilmani ishlatadi:
 *   - yon panelda mundarija (ankorlar — cookie banner havolalari
 *     masalan /privacy#rozilik ga to'g'ri kelishi uchun barqaror)
 *   - har bir bo'lim: sarlavha, paragraflar, ro'yxatlar, jadval
 *   - chop etish tugmasi (B2B mijozlar hujjatni ichki jamoasiga
 *     yuborishi uchun qulay)
 *
 * `tr()` yordamida til tanlanadi; matnlar `src/lib/legal.ts` da.
 */

import Link from 'next/link';
import type { Locale } from '@/lib/taxonomy';
import { tr } from '@/lib/taxonomy';
import { siteConfig } from '@/lib/config';
import type { LegalDoc } from '@/lib/legal';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Icon } from '@/components/ui/Icon';
import { PrintButton } from '@/components/ui/PrintButton';

interface Props {
  doc: LegalDoc;
  locale: Locale;
  title: string;
  updatedLabel: string;
  backLabel: string;
  crumbs: { label: string; href: string }[];
}

export function LegalDocView({ doc, locale, title, updatedLabel, backLabel, crumbs }: Props) {
  const l = locale;

  return (
    <>
      {/* ============ HEADER ============ */}
      <section className="border-b border-cream-200 bg-cream-100/60">
        <div className="container-x py-8 lg:py-10">
          <Breadcrumb items={crumbs} />
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h1 className="font-display text-[clamp(1.6rem,4.4vw,2.4rem)] leading-[1.1] font-extrabold tracking-tight text-pine-900">
                {title}
              </h1>
              <p className="mt-2.5 text-[14px] leading-relaxed text-slate-warm-600">{tr(doc.intro, l, '')}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-cream-200 bg-white px-2.5 py-1 font-mono text-[11.5px] font-bold text-slate-warm-600">
                <Icon name="calendar" size={13} className="text-teal-600" />
                {updatedLabel}: {doc.updated}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 print:hidden">
              <PrintButton
                label={locale === 'ru' ? 'Печать' : locale === 'en' ? 'Print' : 'Chop etish'}
              />
              <Link
                href={`/${locale}`}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-pine-800 px-4 text-[13.5px] font-bold text-white transition hover:bg-teal-600"
              >
                <Icon name="house" size={16} />
                {backLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MATN ============ */}
      <div className="container-x py-9 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
          {/* Mundarija */}
          <nav
            aria-label={locale === 'ru' ? 'Содержание' : locale === 'en' ? 'Contents' : 'Mundarija'}
            className="lg:sticky lg:top-[5.5rem] print:hidden"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-warm-500">
              {locale === 'ru' ? 'Содержание' : locale === 'en' ? 'Contents' : 'Mundarija'}
            </p>
            <ul className="mt-3 flex flex-col gap-0.5 border-l border-cream-200">
              {doc.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ml-px block border-l-2 border-transparent py-1.5 pl-3.5 text-[12.5px] leading-snug text-slate-warm-600 transition hover:border-teal-500 hover:text-teal-600"
                  >
                    {tr(s.title, l, s.id)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bo'limlar */}
          <article className="legal-prose max-w-3xl">
            {doc.sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-[5.5rem]">
                <h2 className="font-display text-[17px] font-extrabold tracking-tight text-pine-900">
                  {tr(s.title, l, s.id)}
                </h2>

                {s.body.map((p, i) => (
                  <p key={i}>{tr(p, l, '')}</p>
                ))}

                {s.list ? (
                  <ul>
                    {s.list.map((li, i) => (
                      <li key={i}>{tr(li, l, '')}</li>
                    ))}
                  </ul>
                ) : null}

                {s.pairs ? (
                  <table className="spec-table">
                    <tbody>
                      {s.pairs.map((pr, i) => (
                        <tr key={i}>
                          <th scope="row">{tr(pr.label, l, '')}</th>
                          <td>{tr(pr.value, l, '')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : null}
              </section>
            ))}

            {/* Yakuniy aloqa bloki */}
            <section className="mt-8 rounded-2xl border border-cream-200 bg-cream-50 p-5">
              <h2 className="font-display text-[15px] font-extrabold tracking-tight text-pine-900">
                {locale === 'ru' ? 'Вопросы?' : locale === 'en' ? 'Questions?' : 'Savollaringiz bormi?'}
              </h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-warm-600">
                {locale === 'ru'
                  ? 'Напишите нам — мы ответим в рабочее время и при необходимости предоставим письменное разъяснение.'
                  : locale === 'en'
                    ? 'Write to us — we reply during business hours and can provide a written clarification if needed.'
                    : 'Bizga yozing — ish vaqtida javob beramiz va zarur bo\'lsa yozma izoh taqdim etamiz.'}
              </p>
              <div className="mt-3.5 flex flex-wrap gap-2.5">
                <a
                  href={`mailto:${siteConfig.contact.salesEmail}`}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-[13.5px] font-bold text-pine-800 shadow-soft transition hover:text-teal-600"
                >
                  <Icon name="mail" size={16} className="text-teal-600" />
                  {siteConfig.contact.salesEmail}
                </a>
                <a
                  href={siteConfig.contact.phonePrimaryHref}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 font-mono text-[13.5px] font-bold text-pine-800 shadow-soft transition hover:text-teal-600"
                >
                  <Icon name="phone" size={16} className="text-teal-600" />
                  {siteConfig.contact.phonePrimary}
                </a>
              </div>
            </section>
          </article>
        </div>
      </div>
    </>
  );
}
