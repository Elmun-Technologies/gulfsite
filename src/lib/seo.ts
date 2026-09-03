/**
 * SEO — metadata va strukturali ma'lumotlar (JSON-LD)
 */

import type { Metadata } from 'next';
import { LOCALE_META, type AppLocale } from '@/i18n';
import { siteConfig, SITE_URL } from './config';
import type { CatalogProduct } from './types';
import { tr, CATEGORIES, ALL_GROUPS, APPLICATIONS, type Trilingual } from './taxonomy';
import { productDescription } from './catalog-copy';

const SITE = siteConfig;

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function localizedPath(locale: AppLocale, path = ''): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const suffix = clean === '/' ? '' : clean.replace(/\/$/, '');
  return `/${locale}${suffix}`;
}

interface BuildMetadataOptions {
  locale: AppLocale;
  title: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: 'website' | 'article' | 'product';
}

export function buildMetadata(opts: BuildMetadataOptions): Metadata {
  const { locale, title, description = SITE.seo.defaultDescription, path = '', image, keywords, noIndex, type = 'website' } = opts;
  const url = absoluteUrl(localizedPath(locale, path));
  const ogImage = absoluteUrl(image ?? SITE.seo.ogImage);
  const meta = LOCALE_META[locale];

  const alternates: Metadata['alternates'] = {
    canonical: url,
    languages: Object.fromEntries(
      (['uz', 'ru', 'en'] as AppLocale[]).map((l) => [l, absoluteUrl(localizedPath(l, path))]),
    ),
  };

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [...(keywords ?? SITE.seo.keywords)],
    alternates,
    openGraph: {
      // Next.js OpenGraph turi faqat 'website'|'article' ni qabul qiladi;
      // mahsulot sahifalari uchun schema.org Product JSON-LD ishlatiladi.
      type: type === 'article' ? 'article' : 'website',
      locale: meta.lang.replace('-', '_'),
      url,
      siteName: SITE.name,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      ...(SITE.seo.twitterHandle ? { site: SITE.seo.twitterHandle } : {}),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
        },
  };
}

/* ------------------------------------------------------------
   JSON-LD
   ------------------------------------------------------------ */

export function organizationLd(locale: AppLocale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE.brand.distributor,
    alternateName: [SITE.brand.full, 'GFF', 'GFF Uzbekistan'],
    url: SITE_URL,
    logo: absoluteUrl('/logo.svg'),
    image: absoluteUrl(SITE.seo.ogImage),
    description:
      locale === 'ru'
        ? 'Официальный и единственный дистрибьютор Gulf Flavours & Fragrances в Узбекистане.'
        : locale === 'en'
          ? 'The official and sole distributor of Gulf Flavours & Fragrances in Uzbekistan.'
          : 'Gulf Flavours & Fragrances kompaniyasining O‘zbekistondagi rasmiy va yagona distribyutori.',
    parentOrganization: {
      '@type': 'Organization',
      name: SITE.brand.legal,
      url: 'https://gulfflavours.ae',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jebel Ali Free Zone, P.O. Box 18129',
        addressLocality: 'Dubai',
        addressCountry: 'AE',
      },
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.contact.addressEn,
      addressLocality: 'Tashkent',
      addressCountry: 'UZ',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE.contact.phonePrimary,
        contactType: 'sales',
        areaServed: 'UZ',
        availableLanguage: ['uz', 'ru', 'en'],
      },
      {
        '@type': 'ContactPoint',
        email: SITE.contact.salesEmail,
        contactType: 'customer support',
        areaServed: 'UZ',
        availableLanguage: ['uz', 'ru', 'en'],
      },
    ],
    sameAs: [
      'https://gulfflavours.ae',
      'https://gulfflavours.ru',
      ...(SITE.social.telegram ? [SITE.social.telegram] : []),
      ...(SITE.social.instagram ? [SITE.social.instagram] : []),
      ...(SITE.social.linkedin ? [SITE.social.linkedin] : []),
      ...(SITE.social.facebook ? [SITE.social.facebook] : []),
    ].filter(Boolean),
    foundingDate: String(SITE.brand.since),
  };
}

export function localBusinessLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: SITE.brand.distributor,
    image: absoluteUrl(SITE.seo.ogImage),
    url: SITE_URL,
    telephone: SITE.contact.phonePrimary,
    email: SITE.contact.email,
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.contact.addressEn,
      addressLocality: 'Tashkent',
      addressCountry: 'UZ',
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.contact.lat, longitude: SITE.contact.lng },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '15:00' },
    ],
    areaServed: { '@type': 'Country', name: 'Uzbekistan' },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[], locale: AppLocale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(locale, item.path)),
    })),
  };
}

export function productLd(product: CatalogProduct, locale: AppLocale, categoryName?: string) {
  const cat = CATEGORIES.find((c) => c.id === product.category);
  const group = ALL_GROUPS.find((g) => g.id === product.group);
  const description = productDescription(product.category, tr(product.name, locale), product.applications, product.copyVariant, locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/${locale}/product/${product.slug}#product`,
    name: tr(product.name, locale),
    description,
    sku: product.sku,
    mpn: product.sku,
    productID: product.sku,
    brand: { '@type': 'Brand', name: SITE.brand.full },
    manufacturer: {
      '@type': 'Organization',
      name: SITE.brand.legal,
      address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
    },
    category: categoryName ?? tr(cat?.name, locale),
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Group', value: tr(group?.name, locale) },
      { '@type': 'PropertyValue', name: 'Form', value: product.form },
      {
        '@type': 'PropertyValue',
        name: 'Recommended dosage',
        value: `${product.dosage.min}-${product.dosage.max}%`,
      },
      { '@type': 'PropertyValue', name: 'Shelf life', value: `${product.shelfLifeMonths} months` },
      ...product.features.map((f) => ({ '@type': 'PropertyValue' as const, name: 'Feature', value: f })),
    ],
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(localizedPath(locale, `/product/${product.slug}`)),
      priceCurrency: 'UZS',
      availability: product.availability === 'in-stock' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      priceSpecification: {
        '@type': 'PriceSpecification',
        description:
          locale === 'ru'
            ? 'Цена по запросу — зависит от объёма и фасовки'
            : locale === 'en'
              ? 'Price on request — depends on volume and pack size'
              : 'Narx so‘rov bo‘yicha — hajm va qadoqga bog‘liq',
      },
      seller: { '@id': `${SITE_URL}/#organization` },
      eligibleQuantity: {
        '@type': 'QuantitativeValue',
        minValue: SITE.business.minOrderKg,
        unitCode: 'KGM',
      },
    },
  };
}

/** ItemList uchun yetarli bo'lgan minimal ma'lumot */
export interface LdItem {
  slug: string;
  name: Trilingual;
}

export function itemListLd(products: LdItem[], locale: AppLocale, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 100).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(localizedPath(locale, `/product/${p.slug}`)),
      name: tr(p.name, locale),
    })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

/** AboutPage — "kompaniya haqida" sahifasi uchun */
export function aboutLd(locale: AppLocale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `${SITE.name} — ${locale === 'ru' ? 'о компании' : locale === 'en' ? 'about us' : 'kompaniya haqida'}`,
    url: absoluteUrl(localizedPath(locale, '/about')),
    inLanguage: LOCALE_META[locale].htmlLang,
    about: { '@id': `${SITE_URL}/#organization` },
    mainEntity: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE.brand.full,
      alternateName: SITE.brand.distributor,
      url: 'https://gulfflavours.ae',
      email: SITE.contact.email,
      telephone: SITE.contact.phonePrimary,
      foundingDate: String(SITE.brand.since),
      areaServed: { '@type': 'Country', name: 'Uzbekistan' },
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.contact.address,
        addressLocality: 'Tashkent',
        addressCountry: 'UZ',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: SITE.contact.phonePrimary,
          contactType: 'sales',
          email: SITE.contact.salesEmail,
          areaServed: 'UZ',
          availableLanguage: ['uz', 'ru', 'en'],
        },
      ],
    },
  };
}

export function websiteLd(locale: AppLocale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE.name,
    inLanguage: LOCALE_META[locale].htmlLang,
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/${locale}/catalog?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Ixtiyoriy havolalar ro'yxati uchun ItemList (tarmoqlar, kategoriyalar).
 * `itemListLd` faqat mahsulotlar uchun — bu umumiy variant.
 */
export function linkListLd(items: { path: string; name: string }[], locale: AppLocale, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 100).map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(localizedPath(locale, it.path)),
      name: it.name,
    })),
  };
}

export function collectionPageLd(locale: AppLocale, title: string, description: string, path: string, products: LdItem[]) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url: absoluteUrl(localizedPath(locale, path)),
      isPartOf: { '@id': `${SITE_URL}/#website` },
    },
    itemListLd(products, locale, title),
  ];
}

/** Bosh sahifa uchun barcha JSON-LD bloklari */
export function homeLd(locale: AppLocale) {
  return [organizationLd(locale), localBusinessLd(), websiteLd(locale)];
}

export { APPLICATIONS };
