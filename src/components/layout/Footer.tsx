import Image from 'next/image';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import type { AppLocale } from '@/i18n';
import type { Translator } from '@/i18n';
import { siteConfig } from '@/lib/config';
import { CATEGORIES, tr, type Locale } from '@/lib/taxonomy';
import { allProducts } from '@/lib/catalog';
import { Reveal } from '@/components/motion';
import { contactPeople } from '@/lib/content';
import { peopleLabels } from '@/lib/people-labels';
import { FooterAddress, FooterEmail, FooterSocial } from './FooterContact';
import { PeopleContacts } from './PeopleContacts';

/**
 * FOOTER (§5, design/Footer.dc.html)
 * ----------------------------------------------------------------
 * Panel fon (#F4EEE7, radius 40), 4 ustun:
 *   1. brend + tagline + sertifikat pill'lari
 *   2. KATALOG  — 6 kategoriya (soni ma'lumotdan hisoblanadi, §7.1)
 *   3. KOMPANIYA — 5 havola
 *   4. ALOQA     — manzil, telefon, email, Telegram, Instagram, ish vaqti
 * Pastki qator: © · bosh ofis · maxfiylik.
 */

const CERTS = ['Halal', 'ISO 22000', 'HACCP', 'SGS'];

export async function Footer({
  locale,
  t,
  year = new Date().getFullYear(),
}: {
  locale: AppLocale;
  t: Translator;
  year?: number;
}) {
  const L = locale as Locale;
  const products = allProducts();
  const c = siteConfig.contact;
  const s = siteConfig.social;
  // direktor + sotuv menejerlari — admin paneldagi "Kontent" bo'limidan
  const people = await contactPeople();

  const cats = CATEGORIES.map((cat) => ({
    id: cat.id,
    label: tr(cat.name, L, cat.id),
    count: products.filter((p) => p.category === cat.id).length,
  }));

  const address = locale === 'ru' ? c.addressRu : locale === 'en' ? c.addressEn : c.address;

  return (
    <footer className="container-page pb-4 pt-4">
      <div className="block block--panel flex flex-col gap-12 p-[clamp(28px,4vw,56px)]">
        <div className="flex flex-wrap justify-between gap-x-16 gap-y-10">
          {/* ---------- 1. BREND ---------- */}
          <div className="flex max-w-[420px] flex-1 basis-[300px] flex-col gap-[18px]">
            <Link href={`/${locale}`} className="flex items-center gap-3.5 no-underline">
              <Image
                src="/images/monogram-copper.png"
                alt=""
                width={498}
                height={523}
                quality={90}
                sizes="56px"
                className="block h-14 w-auto"
              />
              <span className="flex flex-col gap-[5px]">
                <span className="text-[13px] font-semibold leading-none tracking-[0.16em]">
                  GULF FLAVOURS &amp; FRAGRANCES
                </span>
                <span className="text-[11px] font-semibold leading-none tracking-[0.32em] text-copper-dark">
                  UZBEKISTAN
                </span>
              </span>
            </Link>

            <p className="m-0 text-[15px] leading-[1.6] text-muted">{t('footer.tagline')}</p>

            <div className="flex flex-wrap gap-2">
              {CERTS.map((cert) => (
                <span key={cert} className="cert-pill">
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* ---------- 2. KATALOG ---------- */}
          <nav aria-label={t('footer.colCatalog')} className="flex flex-col gap-2.5 text-[15px]">
            <span className="label">{t('footer.colCatalog')}</span>
            {cats.map((cat) => (
              <Link key={cat.id} href={`/${locale}/category/${cat.id}`} className="foot-link">
                {cat.label}
              </Link>
            ))}
          </nav>

          {/* ---------- 3. KOMPANIYA ---------- */}
          <nav aria-label={t('footer.colCompany')} className="flex flex-col gap-2.5 text-[15px]">
            <span className="label">{t('footer.colCompany')}</span>
            <Link href={`/${locale}/about`} className="foot-link">
              {t('nav.about')}
            </Link>
            <Link href={`/${locale}/industries`} className="foot-link">
              {t('nav.industries')}
            </Link>
            <Link href={`/${locale}/samples`} className="foot-link">
              {t('nav.samples')}
            </Link>
            <Link href={`/${locale}/contact`} className="foot-link">
              {t('nav.contact')}
            </Link>
            {/* elektron katalog (flipbook + PDF) — mijoz katalogi, 2026-10-17 */}
            <Link href={`/${locale}/brochure`} className="foot-link">
              {t('nav.brochure')}
            </Link>
          </nav>

          {/* ---------- 4. ALOQA ---------- */}
          <div className="flex max-w-[300px] flex-col gap-2.5 text-[15px]">
            <span className="label">{t('footer.colContact')}</span>

            <FooterAddress address={address} />

            <PeopleContacts
              variant="list"
              source="footer"
              people={[...(people.director ? [people.director] : []), ...people.managers]}
              labels={peopleLabels(t)}
            />

            <FooterEmail email={c.email} source="footer" />

            <FooterSocial telegram={s.telegram} instagram={s.instagram} source="footer" />

            <span className="text-muted">
              {t('contact.hoursWeek', { from: c.hoursWeekFrom, to: c.hoursWeekTo })}
              {' · '}
              {t('contact.hoursSat', { from: c.hoursSatFrom, to: c.hoursSatTo })}
            </span>
          </div>
        </div>

        {/* ---------- PASTKI QATOR ---------- */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-[13px] text-muted">
          <span>{t('footer.rightsLine', { year })}</span>
          <span className="flex-1 text-center max-lg:hidden">{t('footer.hqLine')}</span>
          <Link href={`/${locale}/privacy`} className="foot-link no-underline">
            {t('footer.privacy')}
          </Link>
        </div>
      </div>

      {/* Yuqoriga — kichik qulaylik, dizayn tokenlarida */}
      <Reveal className="mt-3 flex justify-end">
        <FooterTop label={t('footer.toTop')} />
      </Reveal>
    </footer>
  );
}

function FooterTop({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="btn-icon btn-icon--44 btn-icon--outline group"
      aria-label={label}
      title={label}
    >
      <ArrowUp size={18} strokeWidth={1.8} aria-hidden />
    </a>
  );
}
