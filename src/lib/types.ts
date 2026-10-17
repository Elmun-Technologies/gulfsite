import type { Locale, Trilingual } from './taxonomy';

/* ============================================================
   KATALOG TIPLARI
   ============================================================ */

export type BuiltinCategoryId =
  | 'flavours'
  | 'fragrances'
  | 'food-ingredients'
  | 'essential-oils'
  | 'aroma-chemicals'
  | 'commodities';

/** Asosiy 6 ta + admin qo'shgan kategoriyalar (`string & {}` — avtoto'ldirish saqlanadi) */
export type CategoryId = BuiltinCategoryId | (string & {});

export type FormId =
  | 'liquid'
  | 'powder'
  | 'paste'
  | 'emulsion'
  | 'oil'
  | 'granular'
  | 'encapsulated';

export type AvailabilityId = 'in-stock' | 'on-order' | 'new';

/** catalog.json dagi bitta mahsulot yozuvi */
export interface CatalogProduct {
  id: string;
  sku: string;
  slug: string;
  category: CategoryId;
  group: string;
  form: FormId;
  applications: string[];
  dosage: { min: number; max: number; unit: string };
  packaging: number[];
  features: string[];
  availability: AvailabilityId;
  popularity: number;
  isNew: boolean;
  isTop: boolean;
  shelfLifeMonths: number;
  name: Trilingual;
  /** Tavsif shablonining indeksi — matn catalog-copy.ts da */
  copyVariant: number;
  tags: string[];
  order: number;
  /** Admin paneldan yozilgan tavsif (bo'lsa shablon o'rniga ishlatiladi) */
  description?: Trilingual;
  /** Admin yuklagan rasm (`/api/media/<xesh>.webp`) */
  image?: string;
  /** Saytda ko'rsatilmaydi (admin panelda ko'rinadi) */
  hidden?: boolean;
}

export interface CatalogFile {
  version: number;
  generatedAt: string;
  count: number;
  products: CatalogProduct[];
}

/** Brauzerga uzatiladigan yengillashtirilgan kartochka */
export interface ProductCard {
  id: string;
  sku: string;
  slug: string;
  name: Trilingual;
  category: CategoryId;
  group: string;
  form: FormId;
  applications: string[];
  dosageMin: number;
  dosageMax: number;
  packaging: number[];
  features: string[];
  availability: AvailabilityId;
  isNew: boolean;
  isTop: boolean;
  popularity: number;
  color: string;
  /** Tayyor, tilga moslashtirilgan qisqa tavsif (toCard locale ni oladi) */
  blurb: string;
  /** Admin yuklagan mahsulot rasmi (bo'lmasa guruh/kategoriya rasmi) */
  image?: string;
}

/* ============================================================
   FILTR HOLATI
   ============================================================ */

export type SortKey =
  | 'popular'
  | 'name-asc'
  | 'name-desc'
  | 'dosage-asc'
  | 'dosage-desc'
  | 'new'
  | 'sku';

export interface CatalogFilters {
  q: string;
  categories: string[];
  groups: string[];
  applications: string[];
  forms: string[];
  features: string[];
  packaging: number[];
  availability: string[];
  dosageMax: number | null;
  /** faqat yangi / faqat top */
  onlyNew: boolean;
  onlyTop: boolean;
  sort: SortKey;
  page: number;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  q: '',
  categories: [],
  groups: [],
  applications: [],
  forms: [],
  features: [],
  packaging: [],
  availability: [],
  dosageMax: null,
  onlyNew: false,
  onlyTop: false,
  sort: 'popular',
  page: 1,
};

export const PAGE_SIZE = 24;

/** Facet — bitta filtr o'lchovi va uning qiymatlari (hisoblagich bilan) */
export interface FacetOption {
  id: string;
  label: string;
  count: number;
  color?: string;
  /** qiymat tanlanganmi */
  active: boolean;
}

export interface Facet {
  key: keyof CatalogFilters;
  label: string;
  options: FacetOption[];
  /** kamida bitta qiymat tanlanganmi */
  hasSelection: boolean;
}

/* ============================================================
   LEAD TIPLARI
   ============================================================ */

export interface SampleItem {
  sku: string;
  name: Trilingual;
  slug: string;
  qty: number;
  unit: 'g' | 'ml' | 'kg';
  note?: string;
}

export type LeadStatusId =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'sample_sent'
  | 'proposal'
  | 'won'
  | 'lost'
  | 'spam';

export interface LeadRecord {
  id: string;
  ref: string;
  type: string;
  status: LeadStatusId;
  createdAt: string;
  updatedAt: string;

  contact: {
    fullName: string;
    position?: string;
    phone: string;
    phoneRaw?: string;
    email?: string;
    telegram?: string;
  };

  company: {
    name: string;
    inn?: string;
    type?: string;
    website?: string;
    employees?: string;
  };

  location: {
    region?: string;
    city?: string;
    address?: string;
  };

  request: {
    products?: SampleItem[];
    volume?: string;
    frequency?: string;
    budget?: string;
    message?: string;
    interest?: string[];
    preferredContact?: string;
    deadline?: string;
  };

  source: {
    locale: Locale;
    page: string;
    referrer?: string;
    utm?: Record<string, string>;
    userAgent?: string;
    ip?: string;
    country?: string;
    /** o'z analitikamiz: admin panelda arizaning tashrif yo'li */
    visitorId?: string;
    sessionId?: string;
  };

  consent: boolean;
  spamScore: number;
  notes: { at: string; text: string; author: string }[];
  history: { at: string; from: string; to: string }[];
  notifications: {
    telegram?: boolean | string;
    email?: boolean | string;
    webhook?: boolean | string;
  };
}

export interface ApiResult<T = unknown> {
  ok: boolean;
  data?: T;
  error?: { code: string; message: string; fields?: Record<string, string> };
}
