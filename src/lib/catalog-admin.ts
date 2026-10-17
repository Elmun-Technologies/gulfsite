/**
 * Admin → Mahsulotlar ekrani uchun to'liq holat (server-only).
 */

import { allProductsWithHidden, BASE_PRODUCTS } from './catalog';
import { applyOverrides, currentOverrides } from './catalog-live';
import { LANDING_CATEGORIES } from './category-pages';
import { productImage } from './design';
import {
  ALL_GROUPS,
  APPLICATIONS,
  CATEGORIES,
  COMMODITY_GROUPS,
  FEATURES,
  FLAVOUR_GROUPS,
  FORMS,
  FRAGRANCE_GROUPS,
  INGREDIENT_GROUPS,
} from './taxonomy';

/** Admin ekrani uchun to'liq holat */
export function adminCatalogSnapshot() {
  const ov = currentOverrides();
  applyOverrides(ov);
  const products = allProductsWithHidden();
  const baseSkus = new Set(BASE_PRODUCTS.map((p) => p.sku));
  const groupCategory = new Map<string, string>();
  const groupCount = new Map<string, number>();
  const catCount = new Map<string, number>();
  for (const p of products) {
    if (!groupCategory.has(p.group)) groupCategory.set(p.group, p.category);
    groupCount.set(p.group, (groupCount.get(p.group) ?? 0) + 1);
    catCount.set(p.category, (catCount.get(p.category) ?? 0) + 1);
  }
  for (const g of ov.groups) groupCategory.set(g.id, g.category);
  const hiddenCats = new Set(ov.categories.filter((c) => c.hidden).map((c) => c.id));
  const hiddenGroups = new Set(ov.groups.filter((g) => g.hidden).map((g) => g.id));
  const baseGroups = new Set([...FLAVOUR_GROUPS, ...FRAGRANCE_GROUPS, ...INGREDIENT_GROUPS, ...COMMODITY_GROUPS].map((g) => g.id));

  return {
    updatedAt: ov.updatedAt,
    products: products.map((p) => ({
      ...p,
      thumb: p.image ?? productImage(p),
      custom: !baseSkus.has(p.sku),
      edited: !!ov.products[p.sku],
    })),
    categories: CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      hint: c.hint,
      count: catCount.get(c.id) ?? 0,
      hidden: hiddenCats.has(c.id),
      custom: !(LANDING_CATEGORIES as readonly string[]).includes(c.id),
    })),
    groups: ALL_GROUPS.filter((g) => groupCategory.has(g.id)).map((g) => ({
      id: g.id,
      name: g.name,
      category: groupCategory.get(g.id) ?? '',
      count: groupCount.get(g.id) ?? 0,
      hidden: hiddenGroups.has(g.id),
      custom: !baseGroups.has(g.id),
    })),
    forms: FORMS.map((f) => ({ id: f.id, name: f.name })),
    applications: APPLICATIONS.map((a) => ({ id: a.id, name: a.name })),
    features: FEATURES.map((f) => ({ id: f.id, name: f.name })),
  };
}


export type AdminCatalogSnapshot = ReturnType<typeof adminCatalogSnapshot>;
