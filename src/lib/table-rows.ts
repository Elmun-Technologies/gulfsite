/**
 * Jadval qatorlari uchun YENGIL ma'lumot (server → klient chegarasi).
 * Klient jadvaliga to'liq `ProductCard` (tavsif, rang, qadoqlar…) yuborilsa, 400 qatorli
 * kategoriya sahifasi RSC payload'i keraksiz shishadi — jadval faqat shu maydonlarni ishlatadi.
 */
import type { ProductCard } from './types';

export type TableRow = Pick<ProductCard, 'sku' | 'slug' | 'name' | 'form' | 'dose'> & {
  features: string[];
};

export function toTableRows(cards: ProductCard[]): TableRow[] {
  return cards.map((c) => ({
    sku: c.sku,
    slug: c.slug,
    name: c.name,
    form: c.form,
    dose: c.dose,
    features: c.features.slice(0, 2),
  }));
}
