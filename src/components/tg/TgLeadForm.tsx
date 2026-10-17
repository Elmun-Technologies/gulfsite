'use client';

/**
 * MINI APP — ARIZA FORMASI (namuna qutisi / narx so'rash / qayta qo'ng'iroq)
 * ----------------------------------------------------------------
 * Saytdagi bilan bir xil `/api/leads` (fly) ga yuboriladi + Telegram
 * `initData`: server imzoni tekshiradi, arizaga Telegram foydalanuvchisini
 * bog'laydi va mijozga botda tasdiq yuboradi. Ism Telegram profilidan,
 * telefon — "Raqamni ulashish" tugmasi bilan (yoki qo'lda).
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Phone } from 'lucide-react';
import { useI18n } from '@/components/i18n/I18nProvider';
import { apiUrl } from '@/lib/api-base';
import type { SampleItem } from '@/lib/types';
import { cn, isValidUzPhone } from '@/lib/utils';
import { useTg } from './TgProvider';

type Mode = 'sample' | 'quote' | 'callback';

const field =
  'h-12 w-full rounded-[14px] border border-line bg-white px-4 text-[15px] text-ink placeholder:text-muted focus:border-ink focus:outline-none';

export function TgLeadForm({
  locale,
  mode,
  products,
  productSku,
  regions,
  onSent,
}: {
  locale: string;
  mode: Mode;
  products?: SampleItem[];
  productSku?: string;
  regions: { id: string; label: string }[];
  onSent?: (ref: string) => void;
}) {
  const { t } = useI18n();
  const tg = useTg();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [company, setCompany] = useState('');
  const [region, setRegion] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  const [honeypot, setHoneypot] = useState('');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<string | null>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Telegram profilidan ism (bir marta, foydalanuvchi hali yozmagan bo'lsa)
  const tgName = tg.user ? `${tg.user.firstName} ${tg.user.lastName}`.trim() : '';
  const [prevTgName, setPrevTgName] = useState('');
  if (tgName && tgName !== prevTgName) {
    setPrevTgName(tgName);
    if (!name) setName(tgName);
  }

  const needCompany = mode !== 'callback';
  const needRegion = mode !== 'callback';

  async function sharePhone() {
    const p = await tg.requestPhone();
    if (p) {
      setPhone(p.startsWith('+') ? p : `+${p}`);
      tg.haptic('success');
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = t('form.errName');
    if (!isValidUzPhone(phone)) errs.phone = t('form.errPhone');
    if (needCompany && company.trim().length < 2) errs.company = t('form.errCompany');
    if (needRegion && !region) errs.region = t('err.region');
    if (!consent) errs.consent = t('form.errConsent');
    if (mode === 'sample' && !products?.length) errs.form = t('err.products');
    setErrors(errs);
    if (Object.keys(errs).length) {
      tg.haptic('error');
      return;
    }

    setBusy(true);
    const payload = {
      type: mode,
      locale,
      contact: { fullName: name.trim(), phone: phone.replace(/[^\d+]/g, ''), email: '' },
      company: { name: company.trim() },
      location: { region, address: address.trim(), city: '' },
      request: {
        message: message.trim(),
        products: products?.map((p) => ({ sku: p.sku, slug: p.slug, name: p.name, qty: p.qty, unit: p.unit, note: p.note })),
        productSku: productSku ?? '',
      },
      consent,
      source: { locale, page: window.location.pathname, utm: { utm_source: 'telegram', utm_medium: 'mini_app' } },
      website_url: honeypot,
      formStartedAt: startedAt.current || Date.now(),
      tgInitData: tg.initData,
    };
    try {
      const res = await fetch(apiUrl('/api/leads'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        ok: boolean;
        data?: { ref?: string };
        error?: { message?: string; fields?: Record<string, string> };
      };
      if (!res.ok || !json.ok) {
        const fields = json.error?.fields ?? {};
        const mapped: Record<string, string> = {};
        for (const [k, v] of Object.entries(fields)) mapped[k.split('.').pop() ?? k] = t(v as never);
        setErrors({ ...mapped, form: json.error?.message ?? t('form.errServer') });
        tg.haptic('error');
        return;
      }
      const ref = json.data?.ref ?? '';
      setSent(ref);
      tg.haptic('success');
      onSent?.(ref);
    } catch {
      setErrors({ form: t('form.errServer') });
      tg.haptic('error');
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-card bg-panel px-6 py-10 text-center">
        <CheckCircle2 size={48} strokeWidth={1.6} className="text-ok" aria-hidden />
        <h2 className="m-0 text-h4">{t('tg.successTitle')}</h2>
        <p className="m-0 text-[15px] text-body">{t('tg.successText', { ref: sent })}</p>
        <Link href={`/${locale}/tg`} className="btn btn--primary btn--md">
          {t('tg.backToShop')}
        </Link>
      </div>
    );
  }

  const err = (k: string) => (errors[k] ? <span className="mt-1 block text-[13px] text-error">{errors[k]}</span> : null);

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <label className="block">
        <span className="mb-1.5 block text-[14px] font-medium">{t('form.fullName')}</span>
        <input className={cn(field, errors.name && 'border-error')} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        {err('name')}
      </label>

      <div>
        <label className="block">
          <span className="mb-1.5 block text-[14px] font-medium">{t('form.phone')}</span>
          <input
            className={cn(field, errors.phone && 'border-error')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            autoComplete="tel"
          />
        </label>
        {tg.inTelegram ? (
          <button type="button" onClick={sharePhone} className="mt-2 inline-flex items-center gap-2 text-[14px] font-medium text-copper-dark">
            <Phone size={16} aria-hidden />
            {t('tg.sharePhone')}
          </button>
        ) : null}
        {err('phone')}
      </div>

      {needCompany ? (
        <label className="block">
          <span className="mb-1.5 block text-[14px] font-medium">{t('form.company')}</span>
          <input
            className={cn(field, errors.company && 'border-error')}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={t('form.companyPh')}
            autoComplete="organization"
          />
          {err('company')}
        </label>
      ) : null}

      {needRegion ? (
        <label className="block">
          <span className="mb-1.5 block text-[14px] font-medium">{t('form.region')}</span>
          <select className={cn(field, errors.region && 'border-error')} value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">{t('form.regionPh')}</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          {err('region')}
        </label>
      ) : null}

      {mode === 'sample' ? (
        <label className="block">
          <span className="mb-1.5 block text-[14px] font-medium">{t('form.address')}</span>
          <input className={field} value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t('form.addressPh')} />
        </label>
      ) : null}

      {mode !== 'callback' ? (
        <label className="block">
          <span className="mb-1.5 block text-[14px] font-medium">{mode === 'quote' ? t('tg.volume') : t('tg.comment')}</span>
          <textarea
            className={cn(field, 'h-auto min-h-[88px] py-3 leading-relaxed')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={mode === 'quote' ? t('tg.volumePh') : t('tg.commentPh')}
          />
        </label>
      ) : null}

      {/* honeypot — odam ko'rmaydi */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <label className="flex items-start gap-3 text-[14px] leading-snug text-body">
        <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--navy)]" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>
          {t('form.consentShort')}{' '}
          <a href={`/${locale}/privacy`} className="underline" target="_blank" rel="noreferrer">
            {t('form.consentLink')}
          </a>
        </span>
      </label>
      {err('consent')}

      {errors.form ? <p className="m-0 rounded-[14px] bg-error/10 px-4 py-3 text-[14px] text-error">{errors.form}</p> : null}

      <button type="submit" disabled={busy} className="btn btn--primary btn--lg w-full">
        {busy
          ? t('tg.sending')
          : mode === 'sample'
            ? t('tg.submitSample')
            : mode === 'quote'
              ? t('tg.submitQuote')
              : t('tg.submitCallback')}
      </button>
    </form>
  );
}
