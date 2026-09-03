/**
 * ADMIN — ARIZA USTIDA AMALLAR
 * ----------------------------------------------------------------
 * Holatni o'zgartirish, izoh qo'shish va spam belgisi. Hammasi bitta
 * `PATCH /api/admin/leads/[id]` orqali — server-side validatsiya va
 * yozuv mantiq'i store'da, klient faqat so'rov yuboradi.
 *
 * Muvaffaqiyatdan keyin `router.refresh()` chaqiriladi: server
 * komponent qayta render bo'ladi va tarix/izohlar darhol yangilanadi
 * (klientda ma'lumotni qo'lda yangilash shart emas).
 *
 * Optimistik holat: tugma bosilganda darhol `pending` ko'rinadi,
 * xato bo'lsa — toast va asl holatga qaytish.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useI18n } from '@/components/i18n/I18nProvider';
import type { DictKey } from '@/i18n';
import { useToast } from '@/components/ui/Overlay';
import { Icon } from '@/components/ui/Icon';
import { Spinner } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { LEAD_STATUSES, tr, type Locale } from '@/lib/taxonomy';
import type { LeadStatusId } from '@/lib/types';

interface Props {
  id: string;
  locale: Locale;
  status: LeadStatusId;
  spamScore: number;
}

const ORDER = Object.entries(LEAD_STATUSES).sort((a, b) => a[1].order - b[1].order) as [
  LeadStatusId,
  (typeof LEAD_STATUSES)[LeadStatusId],
][];

export function LeadActions({ id, locale, status, spamScore }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const toast = useToast();

  const [busy, setBusy] = useState<'status' | 'note' | 'spam' | null>(null);
  const [note, setNote] = useState('');

  async function patch(body: Record<string, unknown>, kind: 'status' | 'note' | 'spam', successMsg: string) {
    setBusy(kind);
    try {
      const res = await fetch(`/api/admin/leads/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: { message?: string } } | null;
      if (!res.ok || !json?.ok) {
        // Server xato xabarini I18N KALITI sifatida qaytaradi (login API kabi)
        const msgKey = json?.error?.message;
        toast.error(msgKey ? t(msgKey as DictKey) : t('common.error'));
        return false;
      }
      toast.success(successMsg);
      router.refresh();
      return true;
    } catch {
      toast.error(t('common.error'));
      return false;
    } finally {
      setBusy(null);
    }
  }

  async function changeStatus(next: LeadStatusId) {
    if (next === status) return;
    const ok = await patch({ status: next }, 'status', t('admin.lead.saved'));
    if (ok) {
      // Spam belgisi olib tashlansa — spam bahosini ham nolga tushiramiz
      if (status === 'spam' && next !== 'spam' && spamScore >= 80) {
        await patch({ spamScore: 0 }, 'spam', t('admin.lead.saved'));
      }
    }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    const text = note.trim();
    if (!text) return;
    const ok = await patch({ note: text }, 'note', t('admin.lead.saved'));
    if (ok) setNote('');
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ---------------- Holat ---------------- */}
      <section className="rounded-xl border border-cream-200 bg-white p-4 shadow-soft">
        <h2 className="flex items-center gap-2 font-display text-[13.5px] font-extrabold tracking-tight text-pine-900">
          <Icon name="sliders" size={16} className="text-teal-600" />
          {t('admin.leads.columns.status')}
        </h2>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {ORDER.map(([sid, meta]) => {
            const active = sid === status;
            const pending = busy === 'status';
            return (
              <button
                key={sid}
                type="button"
                disabled={pending || active}
                onClick={() => changeStatus(sid)}
                aria-pressed={active}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-bold transition',
                  active ? 'cursor-default text-white shadow-soft' : 'bg-white hover:-translate-y-px',
                  pending && !active && 'opacity-50',
                )}
                style={
                  active
                    ? { backgroundColor: meta.color, borderColor: meta.color }
                    : { borderColor: `${meta.color}55`, color: meta.color }
                }
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: active ? '#fff' : meta.color }}
                  aria-hidden
                />
                {tr(meta.name, locale, sid)}
              </button>
            );
          })}
        </div>

        {/* Spam boshqaruvi */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-cream-200 pt-3.5">
          <span className="font-mono text-[11.5px] text-slate-warm-500">
            {t('admin.lead.spamScore')}: <strong className={cn(spamScore >= 60 ? 'text-clay-600' : 'text-pine-800')}>{spamScore}</strong>
          </span>
          {status === 'spam' ? (
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => changeStatus('new')}
              className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg border border-teal-500/40 bg-mint-50 px-3 text-[12px] font-bold text-teal-700 transition hover:bg-teal-500 hover:text-white disabled:opacity-50"
            >
              {busy === 'spam' || busy === 'status' ? <Spinner size={14} /> : <Icon name="check" size={14} />}
              {t('admin.lead.unmarkSpam')}
            </button>
          ) : (
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => changeStatus('spam')}
              className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg border border-clay-500/35 bg-white px-3 text-[12px] font-bold text-clay-600 transition hover:bg-clay-500 hover:text-white disabled:opacity-50"
            >
              {busy === 'status' ? <Spinner size={14} /> : <Icon name="alert" size={14} />}
              {t('admin.lead.markSpam')}
            </button>
          )}
        </div>
      </section>

      {/* ---------------- Izoh ---------------- */}
      <section className="rounded-xl border border-cream-200 bg-white p-4 shadow-soft">
        <h2 className="flex items-center gap-2 font-display text-[13.5px] font-extrabold tracking-tight text-pine-900">
          <Icon name="edit" size={16} className="text-teal-600" />
          {t('admin.lead.addNote')}
        </h2>

        <form onSubmit={addNote} className="mt-3 flex flex-col gap-2.5">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder={t('admin.lead.notePlaceholder')}
            aria-label={t('admin.lead.notePlaceholder')}
            className="w-full resize-y rounded-lg border border-cream-300 bg-white px-3 py-2.5 text-[13px] leading-relaxed text-pine-900 shadow-soft transition placeholder:text-slate-warm-500 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/12"
          />
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] text-slate-warm-400 tabular-nums">{note.length}/2000</span>
            <button
              type="submit"
              disabled={busy !== null || !note.trim()}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-teal-600 px-4 text-[12.5px] font-bold text-white shadow-soft transition hover:bg-pine-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy === 'note' ? <Spinner size={14} /> : <Icon name="send" size={14} />}
              {t('admin.lead.save')}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
