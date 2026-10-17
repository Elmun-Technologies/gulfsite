/**
 * /api/admin/catalog — mahsulot va kategoriyalarni boshqarish (admin)
 * ----------------------------------------------------------------
 * GET  — barcha mahsulotlar (yashirinlari bilan), kategoriyalar, guruhlar
 * POST — { action, ... }:
 *   saveProduct   { sku, patch }       mavjud mahsulotni o'zgartirish
 *   addProduct    { product }          yangi mahsulot
 *   resetProduct  { sku }              asl holiga qaytarish (asos mahsulot)
 *   deleteProduct { sku }              admin qo'shgan mahsulotni o'chirish
 *   saveCategory  { category }         nom/izoh/yashirish yoki yangi kategoriya
 *   saveGroup     { group }            nom/yashirish yoki yangi guruh
 *   deleteGroup   { id }               bo'sh, admin qo'shgan guruhni o'chirish
 * Har saqlashdan keyin sayt yangilanadi (revalidate + Vercel'ga xabar).
 */

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminGuard } from '@/lib/admin-api';
import { allProductsWithHidden } from '@/lib/catalog';
import { adminCatalogSnapshot as snapshot } from '@/lib/catalog-admin';
import { currentOverrides, writeOverridesFile } from '@/lib/catalog-live';
import {
  buildProduct,
  isSlug,
  sanitizePatch,
  tri,
  type CatalogOverrides,
} from '@/lib/catalog-overrides';
import { notifyFrontend } from '@/lib/frontend-sync';
import { CATEGORIES } from '@/lib/taxonomy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fail(code: string, status = 400) {
  return NextResponse.json({ ok: false, error: { code } }, { status });
}

export async function GET(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  return NextResponse.json({ ok: true, data: snapshot() }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: Request) {
  const denied = await adminGuard(req, { mutating: true });
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return fail('bad_json');
  }

  const ov: CatalogOverrides = structuredClone(currentOverrides());
  const products = allProductsWithHidden();
  const action = String(body.action ?? '');

  switch (action) {
    case 'saveProduct': {
      const sku = String(body.sku ?? '');
      const existing = products.find((p) => p.sku === sku);
      if (!existing) return fail('not_found', 404);
      const patch = sanitizePatch(body.patch);
      if (patch.slug && products.some((p) => p.slug === patch.slug && p.sku !== sku)) return fail('slug_taken');
      const added = ov.added.find((a) => a.sku === sku);
      if (added) Object.assign(added, patch);
      else ov.products[sku] = { ...(ov.products[sku] ?? {}), ...patch };
      break;
    }
    case 'addProduct': {
      const raw = (body.product ?? {}) as Record<string, unknown>;
      const p = buildProduct(raw);
      if (!p) return fail('invalid_product');
      if (products.some((x) => x.sku === p.sku)) return fail('sku_taken');
      if (products.some((x) => x.slug === p.slug)) return fail('slug_taken');
      ov.added.push(p);
      break;
    }
    case 'resetProduct': {
      delete ov.products[String(body.sku ?? '')];
      break;
    }
    case 'deleteProduct': {
      const sku = String(body.sku ?? '');
      if (!ov.added.some((a) => a.sku === sku)) return fail('only_custom');
      ov.added = ov.added.filter((a) => a.sku !== sku);
      delete ov.products[sku];
      break;
    }
    case 'saveCategory': {
      const c = (body.category ?? {}) as Record<string, unknown>;
      const id = String(c.id ?? '').trim().toLowerCase();
      if (!isSlug(id)) return fail('bad_id');
      const entry = { id, name: tri(c.name, 120), hint: tri(c.hint, 240), hidden: c.hidden === true };
      if (!entry.name.uz && !entry.name.ru && !entry.name.en) return fail('name_required');
      ov.categories = [...ov.categories.filter((x) => x.id !== id), entry];
      break;
    }
    case 'saveGroup': {
      const g = (body.group ?? {}) as Record<string, unknown>;
      const id = String(g.id ?? '').trim().toLowerCase();
      const category = String(g.category ?? '').trim().toLowerCase();
      if (!isSlug(id) || !CATEGORIES.some((c) => c.id === category)) return fail('bad_id');
      const entry = { id, category, name: tri(g.name, 120), hidden: g.hidden === true };
      if (!entry.name.uz && !entry.name.ru && !entry.name.en) return fail('name_required');
      ov.groups = [...ov.groups.filter((x) => x.id !== id), entry];
      break;
    }
    case 'deleteGroup': {
      const id = String(body.id ?? '');
      if (products.some((p) => p.group === id)) return fail('group_not_empty');
      ov.groups = ov.groups.filter((x) => x.id !== id);
      break;
    }
    default:
      return fail('bad_action');
  }

  try {
    writeOverridesFile(ov);
  } catch (err) {
    console.error('[admin/catalog] saqlanmadi:', String(err).slice(0, 200));
    return fail('save_failed', 500);
  }
  revalidatePath('/', 'layout');
  await notifyFrontend();
  return NextResponse.json({ ok: true, data: snapshot() });
}
