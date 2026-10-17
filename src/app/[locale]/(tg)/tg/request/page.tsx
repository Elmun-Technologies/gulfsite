/** MINI APP — NARX SO'RASH (?type=quote&product=SKU) yoki QAYTA QO'NG'IROQ (?type=callback) */

import { makeT, normalizeLocale } from '@/i18n';
import { getProductBySku } from '@/lib/catalog';
import { ensureCatalog } from '@/lib/catalog-live';
import { UZ_REGIONS, tr, type Locale } from '@/lib/taxonomy';
import { TgLeadForm } from '@/components/tg/TgLeadForm';

export default async function TgRequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await ensureCatalog();
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const L = locale as Locale;
  const t = makeT(locale);
  const sp = await searchParams;
  const mode = sp.type === 'callback' ? 'callback' : 'quote';
  const product = typeof sp.product === 'string' ? getProductBySku(sp.product) : undefined;

  return (
    <div className="flex flex-col gap-5 px-4 pb-8 pt-5">
      <header>
        <h1 className="m-0 text-[26px] font-normal tracking-[-0.02em]">
          {mode === 'quote' ? t('tg.quoteTitle') : t('tg.callbackTitle')}
        </h1>
        <p className="m-0 mt-1 text-[15px] text-body">{mode === 'quote' ? t('tg.quoteText') : t('tg.callbackText')}</p>
      </header>
      {product ? (
        <div className="rounded-[20px] bg-panel px-4 py-3">
          <span className="block text-[12.5px] text-muted">{product.sku}</span>
          <span className="text-[15px] font-medium">{tr(product.name, L)}</span>
        </div>
      ) : null}
      <TgLeadForm
        locale={locale}
        mode={mode}
        productSku={product?.sku}
        products={product ? [{ sku: product.sku, slug: product.slug, name: product.name, qty: 1, unit: 'kg' }] : undefined}
        regions={UZ_REGIONS.map((r) => ({ id: r.id, label: tr(r.name, L) }))}
      />
    </div>
  );
}
