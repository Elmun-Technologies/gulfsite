/**
 * DIZAYN KONTENTI (§15)
 * ----------------------------------------------------------------
 * Dizayn fayllari (design/*.dc.html) qaysi rasmni qayerda ishlatishini
 * belgilaydi. Bu modul shu xaritani saqlaydi VA barcha sonlarni
 * ma'lumotdan hisoblaydi (§7.1 — hardcode taqiqlanadi).
 *
 * RASMLAR HAQIDA (§15):
 *   · mijozning haqiqiy fotolari: warehouse.jpg, pack-1kg/5kg/10kg.jpg
 *   · brend: monogram-*.png (vaqtincha PNG — ota kompaniyadan SVG keladi)
 *   · qolganlari: Unsplash (bepul litsenziya) — mijoz fotosi kelgach almashtiriladi
 *   · mahsulot fotosi YO'Q → har mahsulotga alohida rasm chaqirilganda
 *     "rasm yo'q" holati ko'rsatiladi (ProductGallery)
 */

import { allProducts } from './catalog';
import {
  APPLICATIONS,
  CATEGORIES,
  FLAVOUR_GROUPS,
  getGroup,
  sortTaxons,
  tr,
  type Locale,
} from './taxonomy';
import type { CatalogProduct } from './types';

/* ------------------------------------------------------------
   1. KATEGORIYA RASMLARI
   ------------------------------------------------------------ */

export const CATEGORY_IMAGE: Record<string, string> = {
  flavours: '/images/cat-flavours.jpg',
  fragrances: '/images/cat-fragrances.jpg',
  'food-ingredients': '/images/cat-ingredients.jpg',
  'essential-oils': '/images/cat-oils.jpg',
  'aroma-chemicals': '/images/cat-aroma.jpg',
  commodities: '/images/cat-commodities.jpg',
};

/* ------------------------------------------------------------
   2. MAHSULOT RASMI (guruh bo'yicha, deterministik)
   ------------------------------------------------------------
   Har bir mahsulotga alohida foto yo'q. Guruh → mavjud foto xaritasi
   orqali barqaror (bir xil mahsulot har doim bir xil rasm) tanlanadi.
   ------------------------------------------------------------ */

const GROUP_IMAGE: Record<string, string> = {
  fruit: '/images/berries.jpg',
  berry: '/images/blueberries.jpg',
  citrus: '/images/citrus-board.jpg',
  tropical: '/images/citrus-board.jpg',
  nut: '/images/spices.jpg',
  dairy: '/images/icecream.jpg',
  'dairy-base': '/images/icecream.jpg',
  sweet: '/images/stock/macarons.webp',
  chocolate: '/images/cake.jpg',
  'chocolate-base': '/images/cake.jpg',
  bakery: '/images/stock/dough.webp',
  savoury: '/images/spices.jpg',
  'savoury-base': '/images/spices.jpg',
  vegetable: '/images/spices.jpg',
  'herb-spice': '/images/spices.jpg',
  'mint-cool': '/images/sample-pod.jpg',
  floral: '/images/stock/perfume-pink.webp',
  beverage: '/images/stock/smoothie.webp',
  'tea-coffee': '/images/coffee.jpg',
  alcohol: '/images/coffee.jpg',
  snack: '/images/spices.jpg',
  tobacco: '/images/sample-pod.jpg',
  'fine-fragrance': '/images/stock/perfume-hands.webp',
  'personal-care': '/images/stock/hand-cream.webp',
  'home-care': '/images/stock/laundry.webp',
  'fabric-care': '/images/stock/laundry.webp',
  oriental: '/images/cat-fragrances.jpg',
  woody: '/images/cat-fragrances.jpg',
  'fresh-aquatic': '/images/cat-fragrances.jpg',
  'oil-base': '/images/stock/essential-oil.webp',
  solvent: '/images/cat-commodities.jpg',
  'sweetener-base': '/images/cat-commodities.jpg',
  'bulk-sugar': '/images/cat-commodities.jpg',
  'bulk-acid': '/images/cat-commodities.jpg',
  'bulk-phosphate': '/images/cat-commodities.jpg',
  'bulk-flour': '/images/cat-commodities.jpg',
  'bulk-fat': '/images/cat-commodities.jpg',
  'bulk-dairy': '/images/cat-commodities.jpg',
};

/** Guruh rasmi (landing sahifalar uchun) — yo'q bo'lsa null */
export function groupImage(groupId: string): string | null {
  return GROUP_IMAGE[groupId] ?? null;
}

/** Mahsulot rasmi — guruh, bo'lmasa kategoriya bo'yicha */
export function productImage(p: Pick<CatalogProduct, 'group' | 'category'>): string {
  return GROUP_IMAGE[p.group] ?? CATEGORY_IMAGE[p.category] ?? '/images/lab.jpg';
}

/** Qadoq rasmlari (mijozning haqiqiy fotolari, §15) */
export const PACK_IMAGES: { kg: number; src: string; labelKey: 'product.pack1' | 'product.pack5' | 'product.pack10' }[] = [
  { kg: 1, src: '/images/pack-1kg.jpg', labelKey: 'product.pack1' },
  { kg: 5, src: '/images/pack-5kg.jpg', labelKey: 'product.pack5' },
  { kg: 10, src: '/images/pack-10kg.jpg', labelKey: 'product.pack10' },
];

/** Mahsulot qadog'iga mos rasmlar (agar 1/5/10 kg bo'lmasa — bo'sh) */
export function packImagesFor(p: Pick<CatalogProduct, 'packaging'>) {
  return PACK_IMAGES.filter((pk) => p.packaging.includes(pk.kg));
}


/** Ilova (application) → rasm. Mijoz fotosi yo'q sohalar eng yaqin kadrni oladi. */
export const APPLICATION_IMAGE: Record<string, string> = {
  bakery: '/images/stock/dough.webp',
  confectionery: '/images/stock/macarons.webp',
  chocolate: '/images/cake.jpg',
  dairy: '/images/icecream.jpg',
  icecream: '/images/stock/popsicles.webp',
  beverages: '/images/stock/smoothie.webp',
  'tea-coffee': '/images/coffee.jpg',
  sauces: '/images/spices.jpg',
  snacks: '/images/spices.jpg',
  meat: '/images/spices.jpg',
  margarine: '/images/spices.jpg',
  canned: '/images/spices.jpg',
  horeca: '/images/coffee.jpg',
  supplements: '/images/stock/lab-pipette.webp',
  tobacco: '/images/spices.jpg',
  'personal-care': '/images/stock/hand-cream.webp',
  'home-care': '/images/stock/laundry.webp',
  'fabric-care': '/images/stock/laundry.webp',
  pharma: '/images/stock/lab-pipette.webp',
  'flavour-base': '/images/stock/vials.webp',
  'fragrance-base': '/images/stock/perfume-pink.webp',
};

/** Rasm hech qayerda topilmasa ishlatiladigan zaxira kadr */
export const FALLBACK_IMAGE = '/images/sample-pod.jpg';

/** Ilova rasmi — topilmasa kategoriya rasmi, u ham bo'lmasa zaxira */
export function applicationImage(applicationId: string, categoryId?: string): string {
  return APPLICATION_IMAGE[applicationId] ?? (categoryId ? CATEGORY_IMAGE[categoryId] : undefined) ?? FALLBACK_IMAGE;
}

/** Mahsulot galereyasi uchun asosiy rasm (ilova → guruh → kategoriya) */
export function productHeroImage(p: Pick<CatalogProduct, 'group' | 'category' | 'applications'>): string {
  const app = p.applications.find((a) => APPLICATION_IMAGE[a]);
  if (app) return APPLICATION_IMAGE[app] as string;
  return productImage(p);
}

/* ------------------------------------------------------------
   3. SOHALAR (industries)
   ------------------------------------------------------------
   Dizayn 14 ta sohani ko'rsatadi; biz MA'LUMOTDAN hisoblaymiz:
   kamida bitta mahsuloti bor yo'nalishlar, taxonomy `order` bo'yicha.
   ------------------------------------------------------------ */

export const INDUSTRY_IMAGE: Record<string, string> = {
  bakery: '/images/stock/dough.webp',
  confectionery: '/images/stock/macarons.webp',
  dairy: '/images/stock/milk-cake.webp',
  icecream: '/images/stock/popsicles.webp',
  beverages: '/images/stock/smoothie.webp',
  sauces: '/images/spices.jpg',
  meat: '/images/spices.jpg',
  'personal-care': '/images/stock/hand-cream.webp',
  horeca: '/images/citrus-board.jpg',
  supplements: '/images/stock/lab-pipette.webp',
  'home-care': '/images/stock/laundry.webp',
  'fabric-care': '/images/stock/laundry.webp',
  pharma: '/images/stock/lab-pipette.webp',
  'flavour-base': '/images/stock/vials.webp',
  'fragrance-base': '/images/stock/perfume-pink.webp',
};

/** Kartochka ohangi — dizayn: aksari panel, bittadan navy va mis */
export type IndustryTone = 'panel' | 'navy' | 'copper';

export function industryTone(index: number): IndustryTone {
  if (index === 1) return 'navy';
  if (index === 7) return 'copper';
  if (index === 9) return 'navy';
  return 'panel';
}

export interface IndustrySummary {
  id: string;
  label: string;
  /** soha uchun tavsiya etiladigan guruh nomlari (pill'lar) */
  chips: string[];
  image: string | null;
  tone: IndustryTone;
  num: string;
}

/** Kamida `min` ta mahsuloti bor sohalar (order bo'yicha) */
export function industriesWithData(locale: Locale, min = 1): (IndustrySummary & { count: number })[] {
  const products = allProducts();
  const counts = new Map<string, number>();
  for (const p of products) {
    for (const a of p.applications) counts.set(a, (counts.get(a) ?? 0) + 1);
  }

  return sortTaxons([...APPLICATIONS])
    .filter((a) => (counts.get(a.id) ?? 0) >= min)
    .map((a, i) => ({
      id: a.id,
      label: tr(a.name, locale),
      chips: industryChips(a.id, products, locale),
      image: INDUSTRY_IMAGE[a.id] ?? null,
      tone: industryTone(i),
      num: String(i + 1).padStart(2, '0'),
      count: counts.get(a.id) ?? 0,
    }));
}

/** Soha uchun eng ko'p uchraydigan guruh nomlari (dizayn: 3–4 chip) */
export function industryChips(id: string, products: CatalogProduct[], locale: Locale, limit = 4): string[] {
  const inInd = products.filter((p) => p.applications.includes(id));
  const counts = new Map<string, number>();
  for (const p of inInd) counts.set(p.group, (counts.get(p.group) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([gid]) => {
      const g = getGroup(gid);
      return g ? tr(g.name, locale) : gid;
    });
}

/* ------------------------------------------------------------
   4. KATEGORIYALAR (hisob bilan)
   ------------------------------------------------------------ */

export interface CategorySummary {
  id: string;
  label: string;
  hint: string;
  image: string;
  count: number;
}

/** Kategoriyalar + har biridagi pozitsiyalar soni (MA'LUMOTDAN) */
export function categoriesWithData(locale: Locale): CategorySummary[] {
  const products = allProducts();
  return sortTaxons([...CATEGORIES]).map((c) => ({
    id: c.id,
    label: tr(c.name, locale, c.id),
    hint: c.hint ? tr(c.hint, locale) : '',
    image: CATEGORY_IMAGE[c.id] ?? '/images/lab.jpg',
    count: products.filter((p) => p.category === c.id).length,
  }));
}

/* ------------------------------------------------------------
   5. TAYYOR TO'PLAMLAR (§7.2 — ma'lumotdan, hardcode emas)
   ------------------------------------------------------------ */

export interface SampleSet {
  id: string;
  /** dictionary kaliti — `t(titleKey)` orqali tarjima qilinadi */
  title: string;
  image: string;
  dark: boolean;
  /** to'plamdagi mahsulotlar (5 ta) */
  products: CatalogProduct[];
}

const SET_DEFS: { id: string; titleKey: 'sampleSet.bakery' | 'sampleSet.fragrance' | 'sampleSet.oils'; image: string; dark: boolean; match: (p: CatalogProduct) => boolean }[] = [
  {
    id: 'bakery',
    titleKey: 'sampleSet.bakery',
    image: '/images/monogram-berries.png',
    dark: true,
    match: (p) => p.category === 'flavours' && ['bakery', 'confectionery'].some((a) => p.applications.includes(a)),
  },
  {
    id: 'fragrance',
    titleKey: 'sampleSet.fragrance',
    image: '/images/monogram-copper.png',
    dark: false,
    match: (p) => p.category === 'fragrances',
  },
  {
    id: 'oils',
    titleKey: 'sampleSet.oils',
    image: '/images/monogram-citrus.png',
    dark: false,
    match: (p) => p.category === 'essential-oils',
  },
];

/** 3 ta tayyor to'plam — har birida eng ommabop 5 ta SKU */
export function readySets(size = 5): (Omit<SampleSet, 'title'> & { titleKey: string })[] {
  const products = allProducts();
  return SET_DEFS.map((def) => ({
    id: def.id,
    titleKey: def.titleKey,
    image: def.image,
    dark: def.dark,
    products: products
      .filter(def.match)
      .sort((a, b) => b.popularity - a.popularity || a.order - b.order)
      .slice(0, size),
  }));
}

/** Bitta soha uchun tayyor to'plam (Industry sahifasi, 5 SKU) */
export function industrySet(applicationId: string, size = 5): CatalogProduct[] {
  return allProducts()
    .filter((p) => p.applications.includes(applicationId))
    .sort((a, b) => b.popularity - a.popularity || a.order - b.order)
    .slice(0, size);
}

/* ------------------------------------------------------------
   6. SOHA UCHUN VAZIFA → YECHIM (Industry sahifasi)
   ------------------------------------------------------------
   Vazifa  = INDUSTRY_COPY[id].challenges (tayyor 3 tilli matn)
   Yechim  = MA'LUMOTDAN: tavsiya etilgan guruhlar + forma + dozirovka
             (texnik da'vo to'qilmaymiz — faqat katalogdagi haqiqat)
   ------------------------------------------------------------ */

export interface TaskSolution {
  task: string;
  solution: string;
}

export function taskSolutions(
  copy: { challenges: Record<Locale, string>[]; picks: string[]; forms: Record<Locale, string>; dosage: Record<Locale, string> },
  locale: Locale,
  limit = 3,
): TaskSolution[] {
  const picks = copy.picks
    .map((gid) => getGroup(gid))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))
    .map((g) => tr(g.name, locale));

  const baseSolution = picks.length
    ? `${picks.slice(0, 4).join(', ')} — ${tr(copy.forms, locale)}`
    : tr(copy.forms, locale);

  return copy.challenges.slice(0, limit).map((c, i) => ({
    task: tr(c, locale),
    solution:
      i === 0
        ? baseSolution
        : i === 1
          ? tr(copy.dosage, locale)
          : picks.length > 4
            ? picks.slice(4).join(', ')
            : baseSolution,
  }));
}

/** Barcha sohalar bo'yicha guruhlar (chips) — faqat ma'lumotdan */
export function flavourGroupLabels(locale: Locale): string[] {
  return sortTaxons([...FLAVOUR_GROUPS]).map((g) => tr(g.name, locale));
}

/* ------------------------------------------------------------
   7. FAYL MAVJUDLIGI (PDF katalog, video — §15 TODO)
   ------------------------------------------------------------
   Hujjat/video yo'q bo'lsa tugma UMUMAN ko'rsatilmaydi — o'lik
   havola foydalanuvchini aldamaydi.
   ------------------------------------------------------------ */

import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** `/files/x.pdf` → public papkasida bormi? */
export function publicAssetExists(publicPath: string): boolean {
  try {
    if (!publicPath.startsWith('/')) return false;
    return existsSync(join(process.cwd(), 'public', publicPath));
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------
   8. MONOGRAMMA MATNLARI (§10.4 — sloganlar tarjima qilinmaydi,
      §14 — alt-matn lug'atdan)
   ------------------------------------------------------------ */

import type { Translator } from '@/i18n';
import type { MonogramCopy } from '@/components/motion';

export function monogramCopy(t: Translator): MonogramCopy {
  return {
    slogan: {
      joy: t('slogan.joy'),
      bliss: t('slogan.bliss'),
      delight: t('slogan.delight'),
    },
    alt: {
      joy: t('monogram.alt.joy'),
      bliss: t('monogram.alt.bliss'),
      delight: t('monogram.alt.delight'),
    },
  };
}
