/** MINI APP — ALOQA: menejerlar, ish vaqti, qayta qo'ng'iroq, sayt */

import Link from 'next/link';
import { Phone } from 'lucide-react';
import { makeT, normalizeLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { contactPeople } from '@/lib/content';

export const revalidate = 600;

export default async function TgContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);
  const { director, managers } = await contactPeople();
  const people = [...managers, ...(director ? [director] : [])];
  const site = siteConfig.url.replace(/\/+$/, '');

  return (
    <div className="flex flex-col gap-5 px-4 pb-8 pt-5">
      <header>
        <h1 className="m-0 text-[26px] font-normal tracking-[-0.02em]">{t('tg.contactTitle')}</h1>
        <p className="m-0 mt-1 text-[15px] text-body">{t('tg.contactText', { hours: siteConfig.contact.hours })}</p>
      </header>

      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {people.map((p) => (
          <li key={p.phone}>
            <a
              href={`tel:${p.phone.replace(/[^\d+]/g, '')}`}
              className="flex items-center justify-between gap-3 rounded-[20px] bg-panel px-4 py-4 text-ink no-underline"
            >
              <span className="flex flex-col">
                <span className="text-[13px] text-muted">
                  {p.role === 'director' ? t('contact.roleDirector') : t('contact.roleSales')}
                  {p.name ? ` · ${p.name}` : ''}
                </span>
                <span className="text-[18px] tabular-nums">{p.phone}</span>
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-pill bg-navy text-white">
                <Phone size={18} aria-hidden />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <Link href={`/${locale}/tg/request?type=callback`} className="btn btn--primary btn--lg w-full">
        {t('tg.callbackCta')}
      </Link>
      <a href={`${site}/${locale}`} target="_blank" rel="noreferrer" className="btn btn--outline btn--lg w-full">
        {t('tg.openSite')}
      </a>
    </div>
  );
}
