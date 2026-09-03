/**
 * FOOTER — server komponent (JavaScript ishlamasa ham to'liq ko'rinadi)
 * ----------------------------------------------------------------
 * B2B sayt uchun footer = ishonch bloki: yuridik nom, sertifikatlar,
 * manzil, to'g'ridan-to'g'ri aloqa, katalog bo'limlari.
 */

import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import type { AppLocale, Translator } from '@/i18n';
import { CATEGORIES, tr } from '@/lib/taxonomy';
import { formatUzPhone } from '@/lib/utils';
import { Icon, type IconName } from '@/components/ui/Icon';

interface FooterProps {
  locale: AppLocale;
  t: Translator;
  popularGroups: { id: string; label: string }[];
}

export function Footer({ locale, t, popularGroups }: FooterProps) {
  const year = new Date().getFullYear();
  const address = locale === 'ru' ? siteConfig.contact.addressRu : locale === 'en' ? siteConfig.contact.addressEn : siteConfig.contact.address;
  const catalogHref = `/${locale}/catalog`;

  const socials: { key: keyof typeof siteConfig.social; icon: IconName; label: string }[] = [
    { key: 'telegram', icon: 'telegram', label: 'Telegram' },
    { key: 'instagram', icon: 'heart', label: 'Instagram' },
    { key: 'linkedin', icon: 'building', label: 'LinkedIn' },
    { key: 'facebook', icon: 'users', label: 'Facebook' },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden bg-pine-950 text-white/75">
      {/* Dekorativ naqsh */}
      <div className="pattern-uzbek pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/60 to-transparent"
        aria-hidden
      />

      {/* ---- CTA lentasi ---- */}
      <div className="relative border-b border-white/10">
        <div className="container-x flex flex-col items-start gap-4 py-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="font-display text-[19px] leading-tight font-extrabold text-white sm:text-[22px]">
              {t('cta.title')}
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/65">{t('cta.subtitle')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={`/${locale}/samples`}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-teal-500 px-5 text-[14px] font-bold text-white transition hover:bg-teal-400 hover:shadow-glow active:scale-[0.98]"
            >
              <Icon name="box" size={17} />
              {t('nav.getSample')}
            </Link>
            <Link
              href={`/${locale}/quote`}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/25 px-5 text-[14px] font-bold text-white transition hover:border-white/60 hover:bg-white/10"
            >
              <Icon name="invoice" size={17} />
              {t('nav.quote')}
            </Link>
            <a
              href={siteConfig.contact.phonePrimaryHref}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white/10 px-5 font-mono text-[14px] font-bold text-white transition hover:bg-white/20"
            >
              <Icon name="phone" size={16} />
              {formatUzPhone(siteConfig.contact.phonePrimary)}
            </a>
          </div>
        </div>
      </div>

      {/* ---- Asosiy ustunlar ---- */}
      <div className="relative container-x grid grid-cols-2 gap-x-6 gap-y-9 py-11 md:grid-cols-4 lg:grid-cols-12">
        {/* Brend */}
        <div className="col-span-2 lg:col-span-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white" aria-hidden>
              <Icon name="flavour" size={21} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[16px] font-extrabold text-white">GFF Uzbekistan</span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-mint-200/70">
                Flavours · Fragrances · Ingredients
              </span>
            </span>
          </div>

          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/60">
            {t('footer.aboutText')}
          </p>

          <p className="mt-4 inline-flex items-start gap-2 rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-[11.5px] leading-snug text-mint-200/85">
            <Icon name="badge" size={14} className="mt-px shrink-0" />
            <span>{t('footer.distributor')}</span>
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            {['halal', 'iso', 'haccp', 'sgs'].map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1 rounded-md border border-white/12 bg-white/5 px-2 py-1 text-[10.5px] font-bold uppercase tracking-wide text-white/70"
              >
                <Icon name="certificate" size={11} className="text-mint-200" />
                {c}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2">
            {socials.map((s) => {
              const url = siteConfig.social[s.key];
              if (!url) return null;
              return (
                <a
                  key={s.key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 bg-white/5 text-white/70 transition hover:border-teal-500 hover:bg-teal-600 hover:text-white"
                >
                  <Icon name={s.icon} size={16} />
                </a>
              );
            })}
            <a
              href="https://gulfflavours.ae"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={siteConfig.brand.full}
              title={siteConfig.brand.full}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 bg-white/5 text-white/70 transition hover:border-gold-500 hover:bg-gold-500 hover:text-pine-950"
            >
              <Icon name="globe" size={16} />
            </a>
          </div>
        </div>

        {/* Katalog */}
        <div className="lg:col-span-3">
          <h3 className="font-display text-[12px] font-extrabold uppercase tracking-[0.14em] text-mint-200/80">
            {t('footer.catalog')}
          </h3>
          <ul className="mt-3.5 flex flex-col gap-2">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  href={`${catalogHref}?categories=${c.id}`}
                  className="group inline-flex items-center gap-1.5 text-[13px] text-white/65 transition hover:text-mint-200"
                >
                  <span className="h-1 w-1 rounded-full bg-teal-500/60 transition group-hover:w-3" aria-hidden />
                  {tr(c.name, locale, c.id)}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="mt-6 font-display text-[12px] font-extrabold uppercase tracking-[0.14em] text-mint-200/80">
            {t('catalog.popular')}
          </h3>
          <ul className="mt-3.5 flex flex-wrap gap-1.5">
            {popularGroups.slice(0, 8).map((g) => (
              <li key={g.id}>
                <Link
                  href={`${catalogHref}?groups=${encodeURIComponent(g.id)}`}
                  className="inline-block rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11.5px] text-white/65 transition hover:border-teal-500/50 hover:bg-teal-600/20 hover:text-mint-200"
                >
                  {g.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kompaniya */}
        <div>
          <h3 className="font-display text-[12px] font-extrabold uppercase tracking-[0.14em] text-mint-200/80">
            {t('footer.company')}
          </h3>
          <ul className="mt-3.5 flex flex-col gap-2 text-[13px]">
            {[
              { href: `/${locale}/about`, label: t('nav.about') },
              { href: `/${locale}/industries`, label: t('nav.industries') },
              { href: `/${locale}/samples`, label: t('footer.samples') },
              { href: `/${locale}/quote`, label: t('nav.quote') },
              { href: `/${locale}/contact`, label: t('nav.contact') },
              { href: `/${locale}/privacy`, label: t('footer.privacy') },
              { href: `/${locale}/terms`, label: t('footer.terms') },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/65 transition hover:text-mint-200">
                  {l.label}
                </Link>
              </li>
            ))}
            {siteConfig.catalogPdf ? (
              <li>
                <a
                  href={siteConfig.catalogPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white/65 transition hover:text-mint-200"
                >
                  <Icon name="download" size={13} />
                  {t('footer.catalogPdf')}
                </a>
              </li>
            ) : null}
          </ul>
        </div>

        {/* Aloqa */}
        <div className="col-span-2 md:col-span-1 lg:col-span-3">
          <h3 className="font-display text-[12px] font-extrabold uppercase tracking-[0.14em] text-mint-200/80">
            {t('footer.contacts')}
          </h3>
          <ul className="mt-3.5 flex flex-col gap-3 text-[13px]">
            <li className="flex items-start gap-2.5">
              <Icon name="map-pin" size={15} className="mt-0.5 shrink-0 text-teal-500" />
              <span className="text-white/70">{address}</span>
            </li>
            <li className="flex flex-col gap-1.5">
              <a href={siteConfig.contact.phonePrimaryHref} className="inline-flex items-center gap-2.5 font-mono text-[14px] font-bold text-white transition hover:text-mint-200">
                <Icon name="phone" size={15} className="text-teal-500" />
                {formatUzPhone(siteConfig.contact.phonePrimary)}
              </a>
              <a href={siteConfig.contact.phoneSecondaryHref} className="inline-flex items-center gap-2.5 font-mono text-[13px] text-white/60 transition hover:text-mint-200">
                <span className="w-[15px]" aria-hidden />
                {formatUzPhone(siteConfig.contact.phoneSecondary)}
              </a>
            </li>
            <li className="flex flex-col gap-1.5">
              <a href={`mailto:${siteConfig.contact.salesEmail}`} className="inline-flex items-center gap-2.5 text-white/75 transition hover:text-mint-200">
                <Icon name="mail" size={15} className="text-teal-500" />
                {siteConfig.contact.salesEmail}
              </a>
              <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex items-center gap-2.5 text-white/55 transition hover:text-mint-200">
                <span className="w-[15px]" aria-hidden />
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Icon name="clock" size={15} className="mt-0.5 shrink-0 text-teal-500" />
              <span className="text-white/70">{siteConfig.contact.hours}</span>
            </li>
          </ul>

          {/* Bosh ofis */}
          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10.5px] font-bold uppercase tracking-wide text-white/45">{t('contact.headquarters')}</p>
            <p className="mt-1 text-[12px] leading-snug text-white/65">{siteConfig.contact.hqAddress}</p>
            <a
              href={`tel:${siteConfig.contact.hqPhone}`}
              className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[12px] text-white/60 transition hover:text-mint-200"
            >
              <Icon name="phone" size={12} />
              +971 4 883 3923
            </a>
          </div>
        </div>
      </div>

      {/* ---- Pastki qator ---- */}
      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-5 text-[11.5px] text-white/45 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {year} {siteConfig.brand.legal}. {t('footer.rights')}
          </p>
          <p className="max-w-2xl leading-relaxed lg:text-right">{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
