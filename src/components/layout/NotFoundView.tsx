/**
 * 404 KO'RINISHI (klient komponent)
 * ----------------------------------------------------------------
 * MUHIM TEXNIK JIHAT: Next.js `not-found.tsx` fayliga `params`
 * UZATMAYDI — prerender paytida `undefined` keladi va build buziladi.
 * Shuning uchun til bu yerda ikki manbadan aniqlanadi:
 *   - `useI18n()` — layout'dagi I18nProvider (not-found eng yaqin
 *     layout ichida render qilinadi, shuning uchun dict mavjud);
 *   - zaxira: `usePathname()` dan olingan til kodi.
 *
 * Bo'sh 404 sahifa = yo'qotilgan lead. Shu sababli bu yerda:
 *   - qidiruv maydoni (katalogga olib boradi)
 *   - barcha asosiy bo'limlar
 *   - kategoriyalar bo'yicha tezkor havolalar
 *   - to'g'ridan-to'g'ri telefon va test box taklifi
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/components/i18n/I18nProvider';
import { normalizeLocale } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { CATEGORIES, tr, type Locale } from '@/lib/taxonomy';
import { Icon, type IconName } from '@/components/ui/Icon';
import { JsonLd } from '@/components/seo/JsonLd';

export function NotFoundView() {
  const i18n = useI18n();
  const pathname = usePathname() ?? '/uz';

  // Til: avval provider'dan, u bo'sh bo'lsa — URL dan
  const fromPath = normalizeLocale(pathname.split('/')[1] ?? 'uz');
  const locale = (i18n.dict && Object.keys(i18n.dict).length ? i18n.locale : fromPath) as Locale;
  const t = i18n.t;

  const links: { href: string; label: string; icon: IconName; hint: string }[] = [
    { href: `/${locale}`, label: t('notfound.home'), icon: 'house', hint: t('nav.home') },
    { href: `/${locale}/catalog`, label: t('notfound.catalog'), icon: 'grid', hint: t('nav.catalog') },
    { href: `/${locale}/samples`, label: t('nav.getSample'), icon: 'box', hint: t('box.title') },
    { href: `/${locale}/quote`, label: t('nav.quote'), icon: 'invoice', hint: t('quote.title') },
    { href: `/${locale}/industries`, label: t('nav.industries'), icon: 'factory', hint: t('industries.title') },
    { href: `/${locale}/contact`, label: t('notfound.contact'), icon: 'phone', hint: siteConfig.contact.phonePrimary },
  ];

  return (
    <div className="container-x py-12 lg:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-cream-300 bg-white px-3 py-1 font-mono text-[12px] font-bold text-clay-600">
          <Icon name="alert" size={13} />
          404
        </span>
        <h1 className="mt-4 font-display text-[clamp(1.6rem,5vw,2.6rem)] leading-tight font-extrabold tracking-tight text-pine-900">
          {t('notfound.title')}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-warm-600">{t('notfound.text')}</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <Link
            href={`/${locale}`}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-teal-600 px-5 text-[14px] font-bold text-white transition hover:bg-pine-800"
          >
            <Icon name="house" size={17} />
            {t('notfound.home')}
          </Link>
          <Link
            href={`/${locale}/catalog`}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-pine-800/20 bg-white px-5 text-[14px] font-bold text-pine-800 transition hover:border-teal-500 hover:text-teal-600"
          >
            <Icon name="grid" size={17} />
            {t('notfound.catalog')}
          </Link>
          <a
            href={siteConfig.contact.phonePrimaryHref}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-pine-900 px-5 font-mono text-[14px] font-bold text-white transition hover:bg-teal-600"
          >
            <Icon name="phone" size={16} />
            {siteConfig.contact.phonePrimary}
          </a>
        </div>
      </div>

      {/* Qidiruv — 404 dan chiqishning eng tez yo'li */}
      <div className="mx-auto mt-10 max-w-xl">
        <form action={`/${locale}/catalog`} method="GET" role="search" className="relative">
          <Icon
            name="search"
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-warm-500"
          />
          <input
            type="search"
            name="q"
            placeholder={t('catalog.searchPlaceholder')}
            maxLength={120}
            aria-label={t('catalog.searchPlaceholder')}
            className="h-12 w-full rounded-xl border border-cream-300 bg-white pr-28 pl-10 text-[15px] shadow-soft focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 h-9 -translate-y-1/2 rounded-lg bg-pine-800 px-4 text-[13px] font-bold text-white transition hover:bg-teal-600"
          >
            {t('common.search')}
          </button>
        </form>
      </div>

      {/* Bo'limlar */}
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex flex-col gap-2 rounded-2xl border border-cream-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-teal-500/35 hover:shadow-lift"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint-100 text-teal-600 transition group-hover:bg-teal-600 group-hover:text-white">
              <Icon name={l.icon} size={18} />
            </span>
            <span className="text-[13px] leading-snug font-bold text-pine-900 group-hover:text-teal-600">
              {l.label}
            </span>
            <span className="mt-auto truncate text-[11px] text-slate-warm-500">{l.hint}</span>
          </Link>
        ))}
      </div>

      {/* Kategoriyalar — aniq yo'nalish beradi */}
      <div className="mt-10">
        <h2 className="text-center text-[12px] font-bold uppercase tracking-[0.12em] text-slate-warm-500">
          {t('categories.title')}
        </h2>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <Link
                href={`/${locale}/catalog?categories=${c.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-cream-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-pine-800 shadow-soft transition hover:-translate-y-0.5 hover:border-teal-500 hover:text-teal-600"
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} aria-hidden />
                {tr(c.name, locale, c.id)}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Yakuniy taklif — 404 ham leadga aylanishi mumkin */}
      <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-teal-500/25 bg-mint-50 p-6 text-center">
        <h2 className="font-display text-[17px] font-extrabold tracking-tight text-pine-900">
          {t('cta.title')}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-slate-warm-600">
          {t('cta.subtitle')}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          <Link
            href={`/${locale}/samples`}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-gold-500 px-5 text-[14px] font-extrabold text-pine-950 transition hover:bg-gold-400"
          >
            <Icon name="box" size={17} />
            {t('hero.ctaSample')}
          </Link>
          <a
            href={siteConfig.contact.phonePrimaryHref}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-pine-800/20 bg-white px-5 text-[14px] font-bold text-pine-800 transition hover:border-teal-500 hover:text-teal-600"
          >
            <Icon name="phone" size={16} />
            {siteConfig.contact.phonePrimary}
          </a>
        </div>
      </div>

      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebPage', name: t('notfound.title') }} />
    </div>
  );
}
