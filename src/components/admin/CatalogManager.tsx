'use client';

/**
 * ADMIN → MAHSULOTLAR: ro'yxat, qidiruv, tahrirlash, yangi mahsulot,
 * kategoriya va guruhlar. Ma'lumot — /api/admin/catalog (fly'dagi
 * tuzatmalar fayli); saqlashdan keyin sayt 1 daqiqa ichida yangilanadi.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { fillVars } from '@/i18n/translator';
import type { AdminCatalogCopy } from '@/lib/admin-catalog-copy';
import type { CatalogProduct } from '@/lib/types';
import type { Trilingual } from '@/lib/taxonomy';
import { cn } from '@/lib/utils';

type L = 'uz' | 'ru' | 'en';
const LANGS: L[] = ['uz', 'ru', 'en'];

interface AdminProduct extends CatalogProduct {
  custom: boolean;
  edited: boolean;
  /** ro'yxat uchun: yuklangan rasm yoki guruh/kategoriya rasmi */
  thumb: string;
}
interface Opt {
  id: string;
  name: Trilingual;
}
interface CatRow extends Opt {
  hint?: Trilingual;
  count: number;
  hidden: boolean;
  custom: boolean;
}
interface GroupRow extends Opt {
  category: string;
  count: number;
  hidden: boolean;
  custom: boolean;
}
interface Snapshot {
  updatedAt: string | null;
  products: AdminProduct[];
  categories: CatRow[];
  groups: GroupRow[];
  forms: Opt[];
  applications: Opt[];
  features: Opt[];
}

type Filter = 'all' | 'visible' | 'hidden' | 'edited' | 'custom';
const PAGE = 40;

const input =
  'h-10 w-full rounded-[10px] border border-line bg-white px-3 text-[14px] text-ink placeholder:text-muted/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15';
const label = 'mb-1.5 block text-[12.5px] font-medium text-body';
const btn =
  'inline-flex h-10 items-center justify-center gap-2 rounded-[10px] px-4 text-[14px] font-medium transition disabled:opacity-50';
const btnPrimary = `${btn} bg-navy text-white hover:bg-navy/90`;
const btnGhost = `${btn} border border-line bg-white text-ink hover:bg-panel`;
const btnDanger = `${btn} border border-error/30 bg-white text-error hover:bg-error/5`;

function slugify(s: string): string {
  const map: Record<string, string> = { 'ʻ': '', '‘': '', '’': '', "'": '', ' ': '-' };
  return s
    .toLowerCase()
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function name(t: Trilingual | undefined, l: L): string {
  if (!t) return '';
  return t[l] || t.uz || t.ru || t.en || '';
}

async function call(body: unknown): Promise<{ ok: boolean; data?: Snapshot; error?: { code: string } }> {
  const res = await fetch('/api/admin/catalog', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export function CatalogManager({
  initial,
  copy: c,
  locale,
  siteUrl,
}: {
  initial: Snapshot;
  copy: AdminCatalogCopy;
  locale: string;
  siteUrl: string;
}) {
  const lang = (LANGS.includes(locale as L) ? locale : 'uz') as L;
  const [data, setData] = useState<Snapshot>(initial);
  const [tab, setTab] = useState<'products' | 'taxonomy'>('products');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AdminProduct | 'new' | null>(null);
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  const errorText = useCallback(
    (code?: string) => (c.errors as Record<string, string>)[code ?? ''] ?? c.errors.default,
    [c],
  );

  const run = useCallback(
    async (body: unknown): Promise<boolean> => {
      try {
        const json = await call(body);
        if (json.ok && json.data) {
          setData(json.data);
          setToast({ kind: 'ok', text: c.saved });
          return true;
        }
        setToast({ kind: 'err', text: errorText(json.error?.code) });
      } catch {
        setToast({ kind: 'err', text: c.errors.default });
      }
      return false;
    },
    [c, errorText],
  );

  const catName = useMemo(() => new Map(data.categories.map((x) => [x.id, name(x.name, lang)])), [data, lang]);
  const groupName = useMemo(() => new Map(data.groups.map((x) => [x.id, name(x.name, lang)])), [data, lang]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return data.products
      .filter((p) => !cat || p.category === cat)
      .filter((p) =>
        filter === 'visible'
          ? !p.hidden
          : filter === 'hidden'
            ? p.hidden
            : filter === 'edited'
              ? p.edited
              : filter === 'custom'
                ? p.custom
                : true,
      )
      .filter(
        (p) =>
          !needle ||
          p.sku.toLowerCase().includes(needle) ||
          LANGS.some((l) => p.name[l]?.toLowerCase().includes(needle)),
      )
      .sort((a, b) => Number(b.custom) - Number(a.custom) || a.order - b.order);
  }, [data, q, cat, filter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE, current * PAGE);

  const counts: Record<Filter, number> = {
    all: data.products.length,
    visible: data.products.filter((p) => !p.hidden).length,
    hidden: data.products.filter((p) => p.hidden).length,
    edited: data.products.filter((p) => p.edited).length,
    custom: data.products.filter((p) => p.custom).length,
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-[-0.02em] text-ink">{c.title}</h1>
          <p className="mt-1 text-[13.5px] text-muted">{fillVars(c.sub, { count: counts.visible })}</p>
        </div>
        <button type="button" className={btnPrimary} onClick={() => setEditing('new')}>
          <span aria-hidden className="text-[18px] leading-none">+</span>
          {c.add}
        </button>
      </header>

      <div className="flex gap-1 border-b border-line-soft" role="tablist">
        {(['products', 'taxonomy'] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={cn(
              '-mb-px border-b-2 px-3 pb-2.5 pt-1 text-[14px] font-medium transition',
              tab === k ? 'border-navy text-ink' : 'border-transparent text-muted hover:text-ink',
            )}
          >
            {k === 'products' ? c.tabProducts : c.tabTaxonomy}
          </button>
        ))}
      </div>

      {tab === 'products' ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <input
              className={cn(input, 'max-w-[340px] flex-1')}
              placeholder={c.search}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
            <select
              className="h-10 min-w-[200px] max-w-[300px] rounded-[10px] border border-line bg-white px-3 text-[14px] text-ink focus:border-navy focus:outline-none"
              value={cat}
              onChange={(e) => {
                setCat(e.target.value);
                setPage(1);
              }}
            >
              <option value="">{c.allCategories}</option>
              {data.categories.map((x) => (
                <option key={x.id} value={x.id}>
                  {name(x.name, lang)} ({x.count})
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-1">
              {(['all', 'visible', 'hidden', 'edited', 'custom'] as Filter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setFilter(f);
                    setPage(1);
                  }}
                  className={cn(
                    'h-9 rounded-full border px-3 text-[13px] font-medium transition',
                    filter === f ? 'border-navy bg-navy text-white' : 'border-line bg-white text-body hover:bg-panel',
                  )}
                >
                  {
                    {
                      all: c.filterAll,
                      visible: c.filterVisible,
                      hidden: c.filterHidden,
                      edited: c.filterEdited,
                      custom: c.filterCustom,
                    }[f]
                  }{' '}
                  <span className="opacity-60">{counts[f]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[16px] border border-line-soft bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-[14px]">
                <thead>
                  <tr className="border-b border-line-soft bg-panel/60 text-[12px] uppercase tracking-[0.04em] text-muted">
                    <th className="px-4 py-3 font-medium">{c.colProduct}</th>
                    <th className="px-4 py-3 font-medium">{c.colCategory}</th>
                    <th className="px-4 py-3 font-medium">{c.colStatus}</th>
                    <th className="px-4 py-3 text-center font-medium">{c.colSite}</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={p.sku} className="border-b border-line-soft last:border-0 hover:bg-panel/40">
                      <td className="px-4 py-2.5">
                        <button type="button" onClick={() => setEditing(p)} className="flex items-center gap-3 text-left">
                          <Thumb src={p.thumb} />
                          <span className="flex flex-col">
                            <span className="font-medium text-ink">{name(p.name, lang)}</span>
                            <span className="text-[12.5px] text-muted">{p.sku}</span>
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-2.5 text-body">
                        <span className="block">{catName.get(p.category) ?? p.category}</span>
                        <span className="text-[12.5px] text-muted">{groupName.get(p.group) ?? p.group}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          <Badge tone={p.availability === 'in-stock' ? 'ok' : 'neutral'}>
                            {p.availability === 'in-stock' ? c.inStock : p.availability === 'on-order' ? c.onOrder : c.isNewLabel}
                          </Badge>
                          {p.custom ? <Badge tone="accent">{c.badgeCustom}</Badge> : null}
                          {p.edited && !p.custom ? <Badge tone="accent">{c.badgeEdited}</Badge> : null}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <Toggle
                          checked={!p.hidden}
                          label={p.hidden ? c.show : c.hide}
                          onChange={(v) => run({ action: 'saveProduct', sku: p.sku, patch: { hidden: !v } })}
                        />
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex justify-end gap-1.5">
                          {!p.hidden ? (
                            <a
                              href={`${siteUrl}/${locale}/catalog/${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-8 items-center rounded-[8px] px-2.5 text-[13px] text-muted hover:bg-panel hover:text-ink"
                            >
                              {c.open} ↗
                            </a>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => setEditing(p)}
                            className="inline-flex h-8 items-center rounded-[8px] border border-line px-3 text-[13px] font-medium text-ink hover:bg-panel"
                          >
                            {c.edit}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!rows.length ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-muted">
                        {c.empty}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
            <footer className="flex items-center justify-between gap-3 border-t border-line-soft px-4 py-3 text-[13px] text-muted">
              <span>
                {fillVars(c.shown, {
                  from: filtered.length ? (current - 1) * PAGE + 1 : 0,
                  to: Math.min(current * PAGE, filtered.length),
                  total: filtered.length,
                })}
              </span>
              <span className="flex gap-1.5">
                <button type="button" className={cn(btnGhost, 'h-8 px-3 text-[13px]')} disabled={current <= 1} onClick={() => setPage(current - 1)}>
                  {c.prev}
                </button>
                <button type="button" className={cn(btnGhost, 'h-8 px-3 text-[13px]')} disabled={current >= pages} onClick={() => setPage(current + 1)}>
                  {c.next}
                </button>
              </span>
            </footer>
          </div>
        </>
      ) : (
        <TaxonomyEditor data={data} copy={c} lang={lang} run={run} />
      )}

      {editing ? (
        <ProductEditor
          key={editing === 'new' ? 'new' : editing.sku}
          product={editing === 'new' ? null : editing}
          data={data}
          copy={c}
          lang={lang}
          onClose={() => setEditing(null)}
          run={run}
          onError={(text) => setToast({ kind: 'err', text })}
        />
      ) : null}

      {toast ? (
        <div
          role="status"
          className={cn(
            'fixed bottom-5 left-1/2 z-[120] -translate-x-1/2 rounded-[12px] px-4 py-3 text-[14px] font-medium text-white',
            toast.kind === 'ok' ? 'bg-ink' : 'bg-error',
          )}
        >
          {toast.text}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------ */

function Thumb({ src }: { src?: string }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-line-soft bg-panel">
      {src ? (
        <Image src={src} alt="" width={44} height={44} unoptimized className="h-full w-full object-cover" />
      ) : (
        <span className="h-4 w-4 rounded-full bg-line" aria-hidden />
      )}
    </span>
  );
}

function Badge({ tone, children }: { tone: 'ok' | 'neutral' | 'accent' | 'warn'; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-full px-2 text-[12px] font-medium',
        tone === 'ok' && 'bg-ok/10 text-ok',
        tone === 'neutral' && 'bg-panel text-body',
        tone === 'accent' && 'bg-copper/15 text-copper-dark',
        tone === 'warn' && 'bg-error/10 text-error',
      )}
    >
      {children}
    </span>
  );
}

function Toggle({ checked, onChange, label: aria }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={aria}
      onClick={() => onChange(!checked)}
      className={cn('relative inline-flex h-6 w-11 shrink-0 rounded-full transition', checked ? 'bg-ok' : 'bg-line')}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5',
        )}
      />
    </button>
  );
}

function Chips({
  options,
  value,
  onChange,
  lang,
}: {
  options: Opt[];
  value: string[];
  onChange: (v: string[]) => void;
  lang: L;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const on = value.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(on ? value.filter((v) => v !== o.id) : [...value, o.id])}
            className={cn(
              'h-8 rounded-full border px-3 text-[13px] transition',
              on ? 'border-navy bg-navy text-white' : 'border-line bg-white text-body hover:bg-panel',
            )}
          >
            {name(o.name, lang)}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------
   Mahsulot muharriri (o'ng panel)
   ------------------------------------------------------------ */

interface Draft {
  sku: string;
  slug: string;
  name: Trilingual;
  description: Trilingual;
  category: string;
  group: string;
  form: string;
  applications: string[];
  features: string[];
  dosageMin: string;
  dosageMax: string;
  packaging: string;
  availability: string;
  isNew: boolean;
  isTop: boolean;
  hidden: boolean;
  image: string;
}

function toDraft(p: AdminProduct | null, data: Snapshot): Draft {
  const firstCat = data.categories[0]?.id ?? 'flavours';
  return {
    sku: p?.sku ?? '',
    slug: p?.slug ?? '',
    name: p?.name ?? { uz: '', ru: '', en: '' },
    description: p?.description ?? { uz: '', ru: '', en: '' },
    category: p?.category ?? firstCat,
    group: p?.group ?? data.groups.find((g) => g.category === firstCat)?.id ?? '',
    form: p?.form ?? 'liquid',
    applications: p?.applications ?? [],
    features: p?.features ?? [],
    dosageMin: String(p?.dosage.min ?? 0.1),
    dosageMax: String(p?.dosage.max ?? 0.5),
    packaging: (p?.packaging ?? [1, 5]).join(', '),
    availability: p?.availability ?? 'on-order',
    isNew: p?.isNew ?? true,
    isTop: p?.isTop ?? false,
    hidden: p?.hidden ?? false,
    image: (p?.image ?? '').replace(/^https?:\/\/[^/]+(?=\/api\/media\/)/, ''),
  };
}

function ProductEditor({
  product,
  data,
  copy: c,
  lang,
  onClose,
  run,
  onError,
}: {
  product: AdminProduct | null;
  data: Snapshot;
  copy: AdminCatalogCopy;
  lang: L;
  onClose: () => void;
  run: (body: unknown) => Promise<boolean>;
  onError: (text: string) => void;
}) {
  const isNew = !product;
  const [d, setD] = useState<Draft>(() => toDraft(product, data));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [newGroup, setNewGroup] = useState<{ open: boolean; name: string }>({ open: false, name: '' });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((prev) => ({ ...prev, [k]: v }));
  const groups = data.groups.filter((g) => g.category === d.category);

  function setName(l: L, v: string) {
    setD((prev) => {
      const next = { ...prev, name: { ...prev.name, [l]: v } };
      if (!slugTouched && (l === 'en' || (l === 'uz' && !prev.name.en))) next.slug = slugify(v);
      return next;
    });
  }

  async function upload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('kind', 'product');
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd });
      const json = (await res.json()) as { ok: boolean; data?: { url: string } };
      if (json.ok && json.data) set('image', json.data.url);
      else onError(c.errors.upload);
    } catch {
      onError(c.errors.upload);
    } finally {
      setUploading(false);
    }
  }

  async function addGroup() {
    const nm = newGroup.name.trim();
    if (!nm) return;
    const id = slugify(nm) || `group-${Date.now().toString(36)}`;
    const ok = await run({
      action: 'saveGroup',
      group: { id, category: d.category, name: { uz: nm, ru: nm, en: nm } },
    });
    if (ok) {
      set('group', id);
      setNewGroup({ open: false, name: '' });
    }
  }

  async function save() {
    setBusy(true);
    const patch = {
      slug: d.slug,
      name: d.name,
      description: d.description,
      category: d.category,
      group: d.group,
      form: d.form,
      applications: d.applications,
      features: d.features,
      dosage: { min: Number(d.dosageMin.replace(',', '.')), max: Number(d.dosageMax.replace(',', '.')), unit: '%' },
      packaging: d.packaging
        .split(/[,;\s]+/)
        .map((x) => Number(x.replace(',', '.')))
        .filter((x) => x > 0),
      availability: d.availability,
      isNew: d.isNew,
      isTop: d.isTop,
      hidden: d.hidden,
      image: d.image || null,
    };
    const ok = isNew
      ? await run({ action: 'addProduct', product: { ...patch, sku: d.sku } })
      : await run({ action: 'saveProduct', sku: product.sku, patch });
    setBusy(false);
    if (ok) onClose();
  }

  async function reset() {
    if (!product || !window.confirm(c.confirmReset)) return;
    if (await run({ action: 'resetProduct', sku: product.sku })) onClose();
  }

  async function remove() {
    if (!product || !window.confirm(c.confirmDelete)) return;
    if (await run({ action: 'deleteProduct', sku: product.sku })) onClose();
  }

  return (
    <div className="fixed inset-0 z-[110]" role="dialog" aria-modal="true" aria-label={isNew ? c.newTitle : c.editTitle}>
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden />
      <div className="absolute inset-y-0 right-0 flex w-[min(760px,100vw)] flex-col bg-white">
        <header className="flex items-center gap-3 border-b border-line-soft px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[18px] font-semibold text-ink">{isNew ? c.newTitle : name(product.name, lang)}</h2>
            {!isNew ? <p className="text-[13px] text-muted">{product.sku}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={c.cancel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[20px] text-muted hover:bg-panel hover:text-ink"
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          <div className="grid gap-5">
            {/* rasm */}
            <section className="flex flex-wrap items-center gap-4 rounded-[14px] border border-line-soft p-4">
              <span className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[12px] border border-line-soft bg-panel">
                {d.image ? (
                  <Image src={d.image} alt="" width={112} height={112} unoptimized className="h-full w-full object-cover" />
                ) : (
                  <span className="px-2 text-center text-[12px] text-muted">{c.image}</span>
                )}
              </span>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <label className={cn(btnGhost, 'cursor-pointer')}>
                    {uploading ? c.uploading : d.image ? c.replace : c.upload}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      disabled={uploading}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) upload(f);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {d.image ? (
                    <button type="button" className={btnGhost} onClick={() => set('image', '')}>
                      {c.remove}
                    </button>
                  ) : null}
                </div>
                <p className="text-[12.5px] text-muted">{c.imageHint}</p>
              </div>
            </section>

            {/* nomlar */}
            <section className="grid gap-3">
              <span className="text-[13px] font-semibold text-ink">{c.name}</span>
              {LANGS.map((l) => (
                <label key={l} className="flex items-center gap-2">
                  <span className="w-8 text-[12px] font-semibold uppercase text-muted">{l}</span>
                  <input className={input} value={d.name[l]} onChange={(e) => setName(l, e.target.value)} />
                </label>
              ))}
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
              <label>
                <span className={label}>{c.sku}</span>
                <input
                  className={cn(input, !isNew && 'bg-panel text-muted')}
                  value={d.sku}
                  readOnly={!isNew}
                  onChange={(e) => set('sku', e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))}
                />
              </label>
              <label>
                <span className={label}>{c.slug}</span>
                <input
                  className={input}
                  value={d.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set('slug', slugify(e.target.value));
                  }}
                />
                <span className="mt-1 block text-[12px] text-muted">{c.slugHint}</span>
              </label>
              <label>
                <span className={label}>{c.category}</span>
                <select
                  className={input}
                  value={d.category}
                  onChange={(e) => {
                    const next = e.target.value;
                    setD((prev) => ({
                      ...prev,
                      category: next,
                      group: data.groups.find((g) => g.category === next)?.id ?? '',
                    }));
                  }}
                >
                  {data.categories.map((x) => (
                    <option key={x.id} value={x.id}>
                      {name(x.name, lang)}
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <span className={label}>{c.group}</span>
                {newGroup.open ? (
                  <div className="flex gap-2">
                    <input
                      className={input}
                      autoFocus
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({ open: true, name: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGroup())}
                    />
                    <button type="button" className={btnPrimary} onClick={addGroup}>
                      OK
                    </button>
                  </div>
                ) : (
                  <select
                    className={input}
                    value={d.group}
                    onChange={(e) =>
                      e.target.value === '__new' ? setNewGroup({ open: true, name: '' }) : set('group', e.target.value)
                    }
                  >
                    {!groups.length ? <option value="">—</option> : null}
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {name(g.name, lang)}
                      </option>
                    ))}
                    <option value="__new">{c.newGroup}</option>
                  </select>
                )}
              </div>
              <label>
                <span className={label}>{c.form}</span>
                <select className={input} value={d.form} onChange={(e) => set('form', e.target.value)}>
                  {data.forms.map((x) => (
                    <option key={x.id} value={x.id}>
                      {name(x.name, lang)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className={label}>{c.availability}</span>
                <select className={input} value={d.availability} onChange={(e) => set('availability', e.target.value)}>
                  <option value="in-stock">{c.inStock}</option>
                  <option value="on-order">{c.onOrder}</option>
                  <option value="new">{c.isNewLabel}</option>
                </select>
              </label>
              <div>
                <span className={label}>{c.dosage}</span>
                <div className="flex items-center gap-2">
                  <input className={input} inputMode="decimal" aria-label={c.min} value={d.dosageMin} onChange={(e) => set('dosageMin', e.target.value)} />
                  <span className="text-muted">–</span>
                  <input className={input} inputMode="decimal" aria-label={c.max} value={d.dosageMax} onChange={(e) => set('dosageMax', e.target.value)} />
                </div>
              </div>
              <label>
                <span className={label}>{c.packaging}</span>
                <input className={input} value={d.packaging} onChange={(e) => set('packaging', e.target.value)} />
              </label>
            </section>

            <section>
              <span className={label}>{c.flags}</span>
              <div className="flex flex-wrap gap-4">
                {(
                  [
                    ['isNew', c.flagNew],
                    ['isTop', c.flagTop],
                    ['hidden', c.flagHidden],
                  ] as const
                ).map(([k, text]) => (
                  <label key={k} className="flex cursor-pointer items-center gap-2 text-[14px] text-ink">
                    <input type="checkbox" className="h-4 w-4 accent-navy" checked={d[k]} onChange={(e) => set(k, e.target.checked)} />
                    {text}
                  </label>
                ))}
              </div>
            </section>

            <section>
              <span className={label}>{c.applications}</span>
              <Chips options={data.applications} value={d.applications} onChange={(v) => set('applications', v)} lang={lang} />
            </section>
            <section>
              <span className={label}>{c.features}</span>
              <Chips options={data.features} value={d.features} onChange={(v) => set('features', v)} lang={lang} />
            </section>

            <section className="grid gap-3">
              <span className="text-[13px] font-semibold text-ink">{c.description}</span>
              <span className="-mt-2 text-[12px] text-muted">{c.descriptionHint}</span>
              {LANGS.map((l) => (
                <label key={l} className="flex gap-2">
                  <span className="w-8 pt-2.5 text-[12px] font-semibold uppercase text-muted">{l}</span>
                  <textarea
                    rows={3}
                    className={cn(input, 'h-auto py-2 leading-relaxed')}
                    value={d.description[l]}
                    onChange={(e) => set('description', { ...d.description, [l]: e.target.value })}
                  />
                </label>
              ))}
            </section>
          </div>
        </div>

        <footer className="flex flex-wrap items-center gap-2 border-t border-line-soft px-5 py-3.5">
          <button type="button" className={btnPrimary} disabled={busy || uploading} onClick={save}>
            {busy ? c.saving : c.save}
          </button>
          <button type="button" className={btnGhost} onClick={onClose}>
            {c.cancel}
          </button>
          <span className="flex-1" />
          {product?.edited && !product.custom ? (
            <button type="button" className={btnGhost} onClick={reset}>
              {c.reset}
            </button>
          ) : null}
          {product?.custom ? (
            <button type="button" className={btnDanger} onClick={remove}>
              {c.delete}
            </button>
          ) : null}
        </footer>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   Kategoriyalar va guruhlar
   ------------------------------------------------------------ */

function TaxonomyEditor({
  data,
  copy: c,
  lang,
  run,
}: {
  data: Snapshot;
  copy: AdminCatalogCopy;
  lang: L;
  run: (body: unknown) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState<{ kind: 'category' | 'group'; id: string; category?: string; isNew: boolean; name: Trilingual; hint: Trilingual; hidden: boolean } | null>(null);

  function open(kind: 'category' | 'group', row: CatRow | GroupRow | null, category?: string) {
    setEditing({
      kind,
      id: row?.id ?? '',
      category: category ?? (row && 'category' in row ? row.category : undefined),
      isNew: !row,
      name: row?.name ?? { uz: '', ru: '', en: '' },
      hint: (row && 'hint' in row ? row.hint : undefined) ?? { uz: '', ru: '', en: '' },
      hidden: row?.hidden ?? false,
    });
  }

  async function save() {
    if (!editing) return;
    const id = editing.id || slugify(editing.name.en || editing.name.uz || editing.name.ru);
    const ok =
      editing.kind === 'category'
        ? await run({ action: 'saveCategory', category: { id, name: editing.name, hint: editing.hint, hidden: editing.hidden } })
        : await run({ action: 'saveGroup', group: { id, category: editing.category, name: editing.name, hidden: editing.hidden } });
    if (ok) setEditing(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <button type="button" className={btnGhost} onClick={() => open('category', null)}>
          + {c.addCategory}
        </button>
      </div>

      {data.categories.map((cat) => {
        const groups = data.groups.filter((g) => g.category === cat.id);
        return (
          <section key={cat.id} className="rounded-[16px] border border-line-soft bg-white">
            <header className="flex flex-wrap items-center gap-3 border-b border-line-soft px-4 py-3">
              <div className="min-w-0 flex-1">
                <h3 className={cn('text-[15px] font-semibold', cat.hidden ? 'text-muted line-through' : 'text-ink')}>
                  {name(cat.name, lang)}
                </h3>
                <p className="text-[12.5px] text-muted">
                  {cat.id} · {cat.count} {c.products}
                  {cat.hidden ? ` · ${c.hiddenNote}` : ''}
                </p>
              </div>
              <button type="button" className={cn(btnGhost, 'h-8 px-3 text-[13px]')} onClick={() => open('category', cat)}>
                {c.edit}
              </button>
              <button
                type="button"
                className={cn(btnGhost, 'h-8 px-3 text-[13px]')}
                onClick={() => run({ action: 'saveCategory', category: { id: cat.id, name: cat.name, hint: cat.hint, hidden: !cat.hidden } })}
              >
                {cat.hidden ? c.show : c.hide}
              </button>
            </header>
            <div className="flex flex-wrap gap-2 p-4">
              {groups.map((g) => (
                <span
                  key={g.id}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border py-1 pl-3 pr-1 text-[13px]',
                    g.hidden ? 'border-dashed border-line text-muted' : 'border-line text-ink',
                  )}
                >
                  <button type="button" onClick={() => open('group', g)} className="hover:underline">
                    {name(g.name, lang)}
                  </button>
                  <span className="rounded-full bg-panel px-2 text-[12px] text-muted">{g.count}</span>
                  {g.custom && !g.count ? (
                    <button
                      type="button"
                      aria-label={c.deleteGroup}
                      onClick={() => run({ action: 'deleteGroup', id: g.id })}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted hover:bg-error/10 hover:text-error"
                    >
                      ×
                    </button>
                  ) : null}
                </span>
              ))}
              <button
                type="button"
                onClick={() => open('group', null, cat.id)}
                className="inline-flex h-8 items-center rounded-full border border-dashed border-line px-3 text-[13px] text-muted hover:border-navy hover:text-ink"
              >
                + {c.addGroup}
              </button>
            </div>
          </section>
        );
      })}

      {editing ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setEditing(null)} aria-hidden />
          <div className="relative w-[min(520px,100%)] rounded-[16px] bg-white p-5">
            <h3 className="mb-4 text-[17px] font-semibold text-ink">
              {editing.kind === 'category' ? (editing.isNew ? c.addCategory : c.categories) : editing.isNew ? c.addGroup : c.groups}
            </h3>
            <div className="grid gap-3">
              {editing.isNew ? (
                <label>
                  <span className={label}>{c.id}</span>
                  <input
                    className={input}
                    value={editing.id}
                    placeholder={slugify(editing.name.en || editing.name.uz || '')}
                    onChange={(e) => setEditing({ ...editing, id: slugify(e.target.value) })}
                  />
                  <span className="mt-1 block text-[12px] text-muted">{c.slugHint}</span>
                </label>
              ) : null}
              {LANGS.map((l) => (
                <label key={l} className="flex items-center gap-2">
                  <span className="w-8 text-[12px] font-semibold uppercase text-muted">{l}</span>
                  <input
                    className={input}
                    placeholder={c.name}
                    value={editing.name[l]}
                    onChange={(e) => setEditing({ ...editing, name: { ...editing.name, [l]: e.target.value } })}
                  />
                </label>
              ))}
              {editing.kind === 'category'
                ? LANGS.map((l) => (
                    <label key={`h-${l}`} className="flex items-center gap-2">
                      <span className="w-8 text-[12px] font-semibold uppercase text-muted">{l}</span>
                      <input
                        className={input}
                        placeholder={c.hint}
                        value={editing.hint[l]}
                        onChange={(e) => setEditing({ ...editing, hint: { ...editing.hint, [l]: e.target.value } })}
                      />
                    </label>
                  ))
                : null}
              <label className="flex items-center gap-2 text-[14px] text-ink">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-navy"
                  checked={editing.hidden}
                  onChange={(e) => setEditing({ ...editing, hidden: e.target.checked })}
                />
                {c.flagHidden}
              </label>
            </div>
            <div className="mt-5 flex gap-2">
              <button type="button" className={btnPrimary} onClick={save}>
                {c.save}
              </button>
              <button type="button" className={btnGhost} onClick={() => setEditing(null)}>
                {c.cancel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
