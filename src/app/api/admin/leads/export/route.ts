/**
 * GET /api/admin/leads/export?format=csv — barcha leadlarni eksport qilish
 * CSV: Excel uchun UTF-8 BOM va ";" ajratgichi (rus/o'zbek lokalizatsiyasida to'g'ri ochiladi)
 */

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/guard';
import { exportLeads } from '@/lib/leads/store';
import { BUSINESS_TYPES, LEAD_STATUSES, LEAD_TYPES, UZ_REGIONS, tr } from '@/lib/taxonomy';
import { toCsv } from '@/lib/utils';
import { scoreLead } from '@/lib/leads/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: { code: 'unauthorized', message: 'admin.errors.unauthorized' } }, { status: 401 });
  }

  const leads = exportLeads();

  const header = [
    'Raqam', 'Sana (UTC)', 'Turi', 'Holat', 'Sifat', 'Spam',
    'Ism', 'Lavozim', 'Telefon', 'E-mail', 'Telegram',
    'Kompaniya', 'STIR', 'Biznes turi', 'Hudud', 'Shahar', 'Manzil',
    'Mahsulotlar SKU', 'Mahsulotlar nomi', 'Mahsulotlar soni',
    'Hajm', 'Chastota', 'Qiziqish', 'Xabar',
    'Til', 'Sahifa', 'Referrer', 'UTM', 'Davlat', 'IP',
    'Bildirishnomalar', 'Izohlar soni',
  ];

  const rows = leads.map((l) => {
    const products = l.request.products ?? [];
    const quality = scoreLead({
      type: l.type,
      contact: l.contact,
      company: l.company,
      location: l.location,
      request: l.request,
      consent: l.consent,
    } as Parameters<typeof scoreLead>[0]);

    return [
      l.ref,
      l.createdAt,
      tr(LEAD_TYPES[l.type as keyof typeof LEAD_TYPES]?.name, 'uz', l.type),
      tr(LEAD_STATUSES[l.status]?.name, 'uz', l.status),
      String(quality),
      String(l.spamScore),
      l.contact.fullName,
      l.contact.position ?? '',
      l.contact.phone,
      l.contact.email ?? '',
      l.contact.telegram ?? '',
      l.company.name,
      l.company.inn ?? '',
      tr(BUSINESS_TYPES.find((b) => b.id === l.company.type)?.name, 'uz', l.company.type ?? ''),
      tr(UZ_REGIONS.find((r) => r.id === l.location.region)?.name, 'uz', l.location.region ?? ''),
      l.location.city ?? '',
      l.location.address ?? '',
      products.map((p) => p.sku).join(' | '),
      products.map((p) => p.name.uz || p.name.en || p.sku).join(' | '),
      String(products.length),
      l.request.volume ?? '',
      l.request.frequency ?? '',
      (l.request.interest ?? []).join(','),
      l.request.message ?? '',
      l.source.locale,
      l.source.page,
      l.source.referrer ?? '',
      Object.entries(l.source.utm ?? {}).map(([k, v]) => `${k}=${v}`).join('&'),
      l.source.country ?? '',
      l.source.ip ?? '',
      Object.entries(l.notifications ?? {}).map(([k, v]) => `${k}:${v}`).join(' '),
      String((l.notes ?? []).length),
    ];
  });

  const csv = toCsv([header, ...rows]);
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="gff-leads-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
