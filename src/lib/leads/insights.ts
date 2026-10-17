/**
 * ARIZALARDAN HISOBOTLAR (server-only): mijozlar bazasi va namunalar
 * ----------------------------------------------------------------
 * Mijoz = telefon raqamining oxirgi 9 raqami (bir odam +998 bilan ham,
 * usiz ham yozishi mumkin). Spam arizalar hisobga olinmaydi.
 */

import type { LeadRecord, LeadStatusId } from '../types';
import { exportLeads } from './store';
import { getProductBySku } from '../catalog';

export interface ClientRow {
  key: string;
  name: string;
  phone: string;
  email?: string;
  company: string;
  region?: string;
  requests: number;
  samples: number;
  types: string[];
  first: string;
  last: string;
  lastStatus: LeadStatusId;
  won: boolean;
  leadIds: string[];
}

function phoneKey(phone: string): string {
  return phone.replace(/\D/g, '').slice(-9);
}

function inRange(l: LeadRecord, from?: string, to?: string): boolean {
  const d = l.createdAt.slice(0, 10);
  return (!from || d >= from) && (!to || d <= to);
}

export function clientList(opts: { q?: string } = {}): ClientRow[] {
  const leads = exportLeads().filter((l) => l.status !== 'spam');
  const map = new Map<string, ClientRow>();
  // eskidan yangiga — oxirgi ism/kompaniya/holat ustun bo'lishi uchun
  for (const l of [...leads].sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
    const key = phoneKey(l.contact.phone) || l.id;
    const row = map.get(key) ?? {
      key,
      name: '',
      phone: l.contact.phone,
      company: '',
      requests: 0,
      samples: 0,
      types: [],
      first: l.createdAt,
      last: l.createdAt,
      lastStatus: l.status,
      won: false,
      leadIds: [],
    };
    row.name = l.contact.fullName || row.name;
    row.phone = l.contact.phone || row.phone;
    row.email = l.contact.email || row.email;
    row.company = l.company.name || row.company;
    row.region = l.location.region || row.region;
    row.requests += 1;
    if (l.type === 'sample') row.samples += l.request.products?.length ?? 0;
    if (!row.types.includes(l.type)) row.types.push(l.type);
    row.last = l.createdAt;
    row.lastStatus = l.status;
    row.won = row.won || l.status === 'won';
    row.leadIds.push(l.id);
    map.set(key, row);
  }
  let rows = [...map.values()].sort((a, b) => b.last.localeCompare(a.last));
  const q = (opts.q ?? '').trim().toLowerCase();
  if (q) {
    const digits = q.replace(/\D/g, '');
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        (r.email ?? '').toLowerCase().includes(q) ||
        (digits.length >= 4 && r.phone.replace(/\D/g, '').includes(digits)),
    );
  }
  return rows;
}

export interface SampleReport {
  requests: number;
  items: number;
  unique: number;
  avgBox: number;
  top: { sku: string; count: number; slug?: string; category?: string }[];
  byCategory: { key: string; value: number }[];
  bySize: { key: string; value: number }[];
  latest: LeadRecord[];
}

export function sampleReport(from?: string, to?: string): SampleReport {
  const leads = exportLeads().filter((l) => l.type === 'sample' && l.status !== 'spam' && inRange(l, from, to));
  const bySku = new Map<string, number>();
  const byCategory = new Map<string, number>();
  const bySize = new Map<string, number>();
  let items = 0;
  for (const l of leads) {
    for (const p of l.request.products ?? []) {
      items += 1;
      bySku.set(p.sku, (bySku.get(p.sku) ?? 0) + 1);
      const prod = getProductBySku(p.sku);
      const cat = prod?.category ?? '—';
      byCategory.set(cat, (byCategory.get(cat) ?? 0) + 1);
      const size = `${p.qty} ${p.unit}`;
      bySize.set(size, (bySize.get(size) ?? 0) + 1);
    }
  }
  const sorted = (m: Map<string, number>) =>
    [...m.entries()].sort((a, b) => b[1] - a[1]).map(([key, value]) => ({ key, value }));
  return {
    requests: leads.length,
    items,
    unique: bySku.size,
    avgBox: leads.length ? +(items / leads.length).toFixed(1) : 0,
    top: sorted(bySku)
      .slice(0, 30)
      .map(({ key, value }) => {
        const prod = getProductBySku(key);
        return { sku: key, count: value, slug: prod?.slug, category: prod?.category };
      }),
    byCategory: sorted(byCategory),
    bySize: sorted(bySize),
    latest: [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 30),
  };
}
