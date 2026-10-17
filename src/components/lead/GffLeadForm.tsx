'use client';

/**
 * LEAD FORMASI (§11)
 * ----------------------------------------------------------------
 * Bitta komponent, 3 ko'rinish:
 *   `home`    — Ism · Kompaniya · Telefon · Xabar        (callback)
 *   `contact` — So'rov turi pill'lari + Ism · Lavozim · Kompaniya ·
 *               Telefon · Email · Soha · Xabar           (contact)
 *   `samples` — namuna qutisi + Kompaniya · Ism · Telefon · Email ·
 *               Hudud · Manzil · Xabar                    (sample)
 *
 * Oqim: zod-validatsiya → POST /api/leads → Telegram bot → "Rahmat!".
 *
 * Antispam (§11): honeypot (`website_url`, CSS bilan yashirilgan),
 * `formStartedAt` (min. to'ldirish vaqti serverda tekshiriladi),
 * IP bo'yicha tezlik cheklovi server tomonda.
 *
 * UTM (§11): `utm_*`, `gclid`, `fbclid` birinchi tashrifda
 * sessionStorage'ga yoziladi va HAR BIR lead bilan birga yuboriladi.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, Send } from 'lucide-react';
import type { AppLocale } from '@/i18n';
import type { LeadType } from '@/lib/taxonomy';
import { dur, ease } from '@/lib/motion';
import { isValidUzPhone, maskUzPhone, parseUtm } from '@/lib/utils';
import { fillVars } from '@/i18n/translator';
import { track } from '@/lib/analytics';
import { fpIds } from '@/lib/fp-tracker';
import { useToast } from '@/components/ui/Overlay';
import { cn } from '@/lib/utils';

const UTM_KEY = 'gff_utm';

/** UTM ni birinchi tashrifda saqlaydi, keyin har doim qaytaradi */
export function readUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const fresh = parseUtm(window.location.search);
    const stored = window.sessionStorage.getItem(UTM_KEY);
    const prev: Record<string, string> = stored ? JSON.parse(stored) : {};
    const merged = { ...prev, ...fresh };
    if (Object.keys(merged).length) window.sessionStorage.setItem(UTM_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return {};
  }
}

export interface LeadLabels {
  title: string;
  text?: string;
  submit: string;
  name: string;
  namePh?: string;
  position?: string;
  positionPh?: string;
  company: string;
  companyPh?: string;
  phone: string;
  email?: string;
  message?: string;
  messagePh?: string;
  industry?: string;
  region?: string;
  address?: string;
  addressPh?: string;
  consent: string;
  privacy: string;
  thanks: string;
  thanksText: string;
  required?: string;
  errPhone?: string;
  errName?: string;
  errCompany?: string;
  errConsent?: string;
  errServer?: string;
  typeLabel?: string;
  types?: { id: string; label: string }[];
}

export interface LeadFormProps {
  type: LeadType;
  locale: AppLocale;
  variant?: 'home' | 'contact' | 'samples';
  labels: LeadLabels;
  className?: string;
  /**
   * Anker uchun `id` — masalan bosh sahifadagi `href="#forma"` tugmasi.
   * `scroll-padding-top` globals.css'da bor, shuning uchun sticky header
   * formani yopib qolmaydi.
   */
  id?: string;
  /** namunalar formasi — qutidagi mahsulotlar */
  products?: { sku: string; slug?: string; name?: Record<string, string>; qty?: number; unit?: 'g' | 'ml' | 'kg' }[];
  /** mahsulot sahifasidan */
  productSku?: string;
  productSlug?: string;
  /** hududlar ro'yxati (samples) */
  regions?: { id: string; label: string }[];
  /** sohalar ro'yxati (contact) */
  industries?: { id: string; label: string }[];
  /** muvaffaqiyatdan keyingi havolalar */
  successLinks?: { href: string; label: string }[];
  /** yuborilgandan keyin chaqiriladi (qutini tozalash va h.k.) */
  onSubmitted?: (ref: string) => void;
  /** URL'dan kelgan oldindan tanlangan so'rov turi (`?type=quote`) */
  defaultType?: string;
  /** URL'dan kelgan oldindan to'ldirilgan xabar (`?product=GFFD6832`) */
  defaultMessage?: string;
  /** tashqi sabab bilan yuborish bloklangan (masalan namuna qutisi bo'sh) */
  disabled?: boolean;
  /** tugma ostidagi izoh ("Texnolog 30 daqiqada qo'ng'iroq qiladi") */
  submitHint?: string;
  /**
   * `thanksText` shablonining serverda to'ldiriladigan qolgan
   * o'zgaruvchilari. `thanksText` `t.raw()` orqali shablon sifatida
   * uzatiladi (chegara qoidasi, §10.1), `{type}` esa shu yerda —
   * klientda tanlangan so'rov turidan to'ldiriladi.
   */
  thanksVars?: Record<string, string | number>;
}

interface Errors {
  fullName?: string;
  company?: string;
  phone?: string;
  consent?: string;
  message?: string;
  form?: string;
}

export function GffLeadForm({
  type,
  locale,
  variant = 'home',
  labels,
  id,
  className,
  products,
  productSku,
  productSlug,
  regions,
  industries,
  successLinks,
  onSubmitted,
  defaultType,
  defaultMessage,
  disabled = false,
  submitHint,
  thanksVars,
}: LeadFormProps) {
  const toast = useToast();
  /**
   * Forma ochilgan vaqt — min fill 3s nazorati uchun (§11.2).
   * `useRef(Date.now())` render paytida impure funksiya chaqirardi
   * (react-hooks/purity): har re-render'da yangi qiymat olishi mumkin.
   * Shuning uchun 0 bilan boshlanadi va mount effect'ida o'rnatiladi.
   */
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(defaultMessage ?? '');
  const [region, setRegion] = useState('');
  const [address, setAddress] = useState('');
  const [industry, setIndustry] = useState('');
  const [leadType, setLeadType] = useState(
    defaultType && labels.types?.some((x) => x.id === defaultType)
      ? defaultType
      : (labels.types?.[0]?.id ?? type),
  );
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<{ ref: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // xato maydoniga fokus — re-render'dan KEYIN va faqat shu forma ichida
  // (sahifada ikkita forma bo'lishi mumkin: bosh sahifa + #forma)
  const [focusTick, setFocusTick] = useState(0);
  useEffect(() => {
    if (!focusTick) return;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [focusTick]);

  const showCompany = variant !== 'home' || true;

  const validate = useCallback((): Errors => {
    const e: Errors = {};
    if (fullName.trim().length < 2) e.fullName = labels.errName ?? '—';
    if (showCompany && company.trim().length < 2 && leadType !== 'callback') e.company = labels.errCompany ?? '—';
    if (!isValidUzPhone(phone)) e.phone = labels.errPhone ?? '—';
    if (!consent) e.consent = labels.errConsent ?? '—';
    if ((leadType === 'contact' || leadType === 'catalog') && message.trim().length < 1) e.message = '—';
    return e;
  }, [fullName, company, phone, consent, message, leadType, labels, showCompany]);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (busy || sent) return;

    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      setFocusTick((n) => n + 1);
      track.formError(variant, Object.keys(e)[0]);
      return;
    }

    setBusy(true);

    const payload = {
      type: (leadType as LeadType) || type,
      locale,
      contact: {
        fullName: fullName.trim(),
        position: position.trim(),
        phone: phone.replace(/[^\d+]/g, ''),
        email: email.trim(),
      },
      company: { name: company.trim() },
      location: { region, address: address.trim(), city: '' },
      request: {
        message: message.trim(),
        products: products?.length
          ? products.map((p) => ({
              sku: p.sku,
              slug: p.slug ?? '',
              name: p.name ?? { uz: p.sku, ru: p.sku, en: p.sku },
              qty: p.qty ?? 50,
              unit: p.unit ?? 'g',
            }))
          : undefined,
        productSlug,
        productSku,
        interest: industry ? [industry] : undefined,
      },
      consent,
      source: {
        locale,
        page: typeof window === 'undefined' ? '/' : window.location.pathname + window.location.search,
        referrer: typeof document === 'undefined' ? '' : document.referrer,
        utm: readUtm(),
        visitorId: fpIds()?.vid,
        sessionId: fpIds()?.sid,
      },
      website_url: honeypot,
      formStartedAt: startedAt.current || Date.now(),
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        ok: boolean;
        data?: { ref?: string; message?: string };
        error?: { code?: string; message?: string; fields?: Record<string, string> };
      };

      if (!res.ok || !json.ok) {
        const fields = json.error?.fields ?? {};
        setErrors({ ...fields, form: json.error?.message ?? labels.errServer ?? '—' });
        track.formError(variant, undefined, json.error?.code);
        return;
      }

      const ref = json.data?.ref ?? '';
      setSent({ ref });

      if (payload.type === 'sample') track.sampleSubmit(products?.length ?? 0, ref);
      else track.leadSubmitEvent(payload.type, ref);

      toast.success(labels.thanks, json.data?.message);
      onSubmitted?.(ref);
    } catch {
      setErrors({ form: labels.errServer ?? '—' });
      track.formError(variant, undefined, 'network');
    } finally {
      setBusy(false);
    }
  };

  const typePills = useMemo(() => labels.types ?? [], [labels.types]);

  /* ------------------------------------------------------------ */

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: dur.slow, ease: ease.out }}
        className={cn(
          'flex flex-col gap-5 rounded-block bg-copper p-[clamp(28px,3vw,44px)] text-ink',
          className,
        )}
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-pill bg-navy text-white">
          <Check size={28} strokeWidth={2} aria-hidden />
        </span>
        <span className="text-[clamp(28px,3vw,40px)] font-normal leading-[1.05] tracking-[-0.02em]">
          {labels.thanks}
        </span>
        <p className="m-0 max-w-[420px] text-[16px] leading-[1.55] text-on-copper">
          {/* `{type}` — tanlangan so'rov turi (qolgan joy tutgichlar serverda
              to'ldirilgan holda keladi, §10.1 — `.replace()` ishlatilmaydi) */}
          {fillVars(labels.thanksText, {
            ...thanksVars,
            type: typePills.find((p) => p.id === leadType)?.label ?? labels.title,
          })}
        </p>
        {sent.ref ? (
          <span className="font-mono text-[13px] text-on-copper-soft">№ {sent.ref}</span>
        ) : null}
        {successLinks?.length ? (
          <div className="flex flex-wrap gap-3">
            {successLinks.map((l) => (
              <a key={l.href} href={l.href} className="btn btn--primary btn--md">
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
      </motion.div>
    );
  }

  return (
    <form
      id={id}
      ref={formRef}
      onSubmit={submit}
      noValidate
      className={cn(
        'flex flex-col gap-[18px] rounded-block bg-copper p-[clamp(28px,3vw,44px)] text-ink',
        className,
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        {errors.form ? (
          <motion.p
            key="form-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="m-0 overflow-hidden rounded-tile bg-white px-4 py-3 text-[14px] font-medium text-error"
            role="alert"
          >
            {errors.form}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <span className="text-[clamp(26px,2.4vw,32px)] font-normal leading-[1.1] tracking-[-0.02em]">
        {labels.title}
      </span>
      {labels.text ? (
        <span className="text-[15px] leading-[1.5] text-on-copper-soft">{labels.text}</span>
      ) : null}

      {/* So'rov turi — contact variantida */}
      {typePills.length > 1 ? (
        <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
          <legend className="label label--on-copper mb-1 p-0">{labels.typeLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {typePills.map((tp) => {
              const on = tp.id === leadType;
              return (
                <button
                  key={tp.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setLeadType(tp.id)}
                  className={cn(
                    'relative h-11 rounded-pill px-[18px] text-[15px] font-medium transition-colors',
                    on ? 'bg-navy text-white' : 'border border-ink bg-transparent text-ink hover:bg-white/40',
                  )}
                >
                  {tp.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <div className="flex flex-wrap gap-[18px]">
        <label className="field-label min-w-[200px] flex-1">
          {labels.name}
          <input
            className="field-input"
            name="fullName"
            autoComplete="name"
            placeholder={labels.namePh}
            value={fullName}
            aria-invalid={!!errors.fullName}
            onChange={(ev) => setFullName(ev.target.value)}
          />
          {errors.fullName ? <span className="field-error">{labels.errName}</span> : null}
        </label>

        {variant === 'contact' && labels.position ? (
          <label className="field-label min-w-[200px] flex-1">
            {labels.position}
            <input
              className="field-input"
              name="position"
              autoComplete="organization-title"
              placeholder={labels.positionPh}
              value={position}
              onChange={(ev) => setPosition(ev.target.value)}
            />
          </label>
        ) : null}

        {showCompany ? (
          <label className="field-label min-w-[200px] flex-1">
            {labels.company}
            <input
              className="field-input"
              name="company"
              autoComplete="organization"
              placeholder={labels.companyPh}
              value={company}
              aria-invalid={!!errors.company}
              onChange={(ev) => setCompany(ev.target.value)}
            />
            {errors.company ? <span className="field-error">{labels.errCompany}</span> : null}
          </label>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-[18px]">
        <label className="field-label min-w-[200px] flex-1">
          {labels.phone}
          <input
            className="field-input"
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+998"
            value={phone}
            aria-invalid={!!errors.phone}
            onChange={(ev) => setPhone(maskUzPhone(ev.target.value))}
          />
          {errors.phone ? <span className="field-error">{labels.errPhone}</span> : null}
        </label>

        {labels.email ? (
          <label className="field-label min-w-[200px] flex-1">
            {labels.email}
            <input
              className="field-input"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </label>
        ) : null}
      </div>

      {variant === 'samples' && regions?.length ? (
        <div className="flex flex-wrap gap-[18px]">
          <label className="field-label min-w-[200px] flex-1">
            {labels.region}
            <span className="relative">
              <select className="field-input" name="region" value={region} onChange={(ev) => setRegion(ev.target.value)}>
                <option value="">—</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                strokeWidth={1.8}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink"
                aria-hidden
              />
            </span>
          </label>

          {labels.address ? (
            <label className="field-label min-w-[240px] flex-[2]">
              {labels.address}
              <input
                className="field-input"
                name="address"
                autoComplete="street-address"
                placeholder={labels.addressPh}
                value={address}
                onChange={(ev) => setAddress(ev.target.value)}
              />
            </label>
          ) : null}
        </div>
      ) : null}

      {variant === 'contact' && industries?.length ? (
        <label className="field-label">
          {labels.industry}
          <span className="relative">
            <select
              className="field-input"
              name="industry"
              value={industry}
              onChange={(ev) => setIndustry(ev.target.value)}
            >
              <option value="">—</option>
              {industries.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              strokeWidth={1.8}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink"
              aria-hidden
            />
          </span>
        </label>
      ) : null}

      {labels.message ? (
        <label className="field-label">
          {labels.message}
          <textarea
            className="field-input"
            name="message"
            rows={3}
            placeholder={labels.messagePh}
            value={message}
            aria-invalid={!!errors.message}
            onChange={(ev) => setMessage(ev.target.value)}
          />
        </label>
      ) : null}

      {/* Honeypot — odam ko'rmaydi (§11) */}
      <div aria-hidden className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
        <label>
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            name="website_url"
            value={honeypot}
            onChange={(ev) => setHoneypot(ev.target.value)}
          />
        </label>
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-[1.45] text-on-copper">
        <input
          type="checkbox"
          name="consent"
          checked={consent}
          aria-invalid={!!errors.consent}
          onChange={(ev) => setConsent(ev.target.checked)}
          className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-navy"
        />
        <span>
          {labels.consent}{' '}
          <a href={`/${locale}/privacy`} className="font-semibold underline underline-offset-2">
            {labels.privacy}
          </a>
          {errors.consent ? <span className="field-error block">{labels.errConsent}</span> : null}
        </span>
      </label>

      <button
        type="submit"
        disabled={busy || disabled}
        data-loading={busy ? 'true' : undefined}
        className={cn(
          'btn btn--lg mt-1.5 w-full',
          variant === 'samples' ? 'btn--accent' : 'btn--primary',
        )}
      >
        <Send size={18} strokeWidth={1.8} aria-hidden />
        {labels.submit}
        {busy ? (
          <span className="btn__spinner" role="status" aria-live="polite">
            <span className="inline-block h-[18px] w-[18px] animate-spin-slow rounded-full border-2 border-current border-t-transparent" />
          </span>
        ) : null}
      </button>

      {submitHint ? (
        <span className="mt-2.5 block text-[14px] leading-snug text-muted">{submitHint}</span>
      ) : null}
    </form>
  );
}
