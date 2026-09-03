/**
 * GET /api/catalog — katalog sahifasining JSON ko'rinishi
 * ----------------------------------------------------------------
 * Nima uchun kerak:
 *   Katalog "Yana ko'rsatish" (load more) tugmasi sahifani to'liq
 *   qayta yuklamasdan keyingi 24 ta mahsulotni olib keladi.
 *   Filtr mantig'i serverdagi yagona `queryCatalog` — shuning uchun
 *   API va sahifa natijalari DOIM bir xil.
 *
 * Parametrlar URL'dagi bilan bir xil:
 *   q, categories, groups, applications, forms, features, packaging,
 *   availability, dose, new, top, sort, page, lang
 */

import { NextResponse, type NextRequest } from 'next/server';
import { queryCatalog } from '@/lib/catalog';
import { paramsToFilters } from '@/lib/filters-url';
import { normalizeLocale } from '@/i18n';
import { PAGE_SIZE } from '@/lib/types';

export const runtime = 'nodejs';
/** Filtr natijalari 60 soniya keshlanadi — bir xil so'rovlar tez qaytadi */
export const revalidate = 60;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const locale = normalizeLocale(sp.get('lang'));
  const size = Math.min(48, Math.max(6, Number(sp.get('size') ?? PAGE_SIZE) || PAGE_SIZE));

  try {
    const filters = paramsToFilters(sp);
    const result = queryCatalog(filters, locale, size);

    return NextResponse.json(
      {
        ok: true,
        data: {
          cards: result.cards,
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          totalPages: result.totalPages,
          suggestion: result.suggestion,
          activeCount: result.activeCount,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      },
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: { code: 'query_error', message: String(err).slice(0, 200) } },
      { status: 500 },
    );
  }
}
