/** GET|PATCH /api/admin/leads/[id] */

import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/guard';
import { getLead, updateLead, type LeadPatch } from '@/lib/leads/store';
import { LEAD_STATUSES } from '@/lib/taxonomy';
import type { LeadStatusId } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: { code: 'unauthorized', message: 'admin.errors.unauthorized' } }, { status: 401 });
  }
  const { id } = await ctx.params;
  const lead = getLead(id);
  if (!lead) return NextResponse.json({ ok: false, error: { code: 'not_found', message: 'admin.errors.notFound' } }, { status: 404 });
  return NextResponse.json({ ok: true, data: lead }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: { code: 'unauthorized', message: 'admin.errors.unauthorized' } }, { status: 401 });
  }
  const { id } = await ctx.params;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'bad_json', message: 'admin.errors.badJson' } }, { status: 400 });
  }

  const patch: LeadPatch = {};

  if (typeof body.status === 'string') {
    if (!(body.status in LEAD_STATUSES)) {
      return NextResponse.json({ ok: false, error: { code: 'invalid_status', message: 'admin.errors.invalidStatus' } }, { status: 400 });
    }
    patch.status = body.status as LeadStatusId;
  }
  if (typeof body.spamScore === 'number' && Number.isFinite(body.spamScore)) {
    patch.spamScore = Math.max(0, Math.min(100, Math.round(body.spamScore)));
  }
  if (typeof body.note === 'string' && body.note.trim()) {
    patch.note = { text: body.note.slice(0, 2000), author: typeof body.author === 'string' ? body.author.slice(0, 40) : 'admin' };
  }

  if (!Object.keys(patch).length) {
    return NextResponse.json({ ok: false, error: { code: 'empty_patch', message: 'admin.errors.emptyPatch' } }, { status: 400 });
  }

  const updated = await updateLead(id, patch);
  if (!updated) {
    return NextResponse.json({ ok: false, error: { code: 'not_found_or_write_failed', message: 'admin.errors.saveFailed' } }, { status: 404 });
  }
  return NextResponse.json({ ok: true, data: updated }, { headers: { 'Cache-Control': 'no-store' } });
}
