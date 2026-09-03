'use client';

/**
 * LEAD FORMASI — saytning eng muhim komponenti
 * ----------------------------------------------------------------
 * Saytning asosiy maqsadi: mijoz ma'lumotini yig'ish. Shuning uchun
 * bu forma ataylab shunday qurilgan:
 *
 *   1. QADAMMA-QADAM (3 qadam) — uzun forma qo'rqitmaydi. Har qadamda
 *      3–5 ta maydon, progress ko'rsatkichi bor. Konversiya oshadi.
 *   2. KLIENT VALIDATSIYASI — xato darhol, maydon yonida ko'rinadi.
 *      Server ham xuddi shu qoidalarni tekshiradi (yagona sxema).
 *   3. XATO XABARLARI LUG'ATDAN — server "err.phone" kalitini qaytaradi,
 *      klient uni foydalanuvchi tiliga tarjima qiladi.
 *   4. ANTISPAM — honeypot (yashirin maydon) + forma ochilgan vaqt.
 *   5. MUVAFFAQIYAT EKRANI — ariza raqami, keyingi qadamlar, muqobil
 *      aloqa kanallari. Mijoz "nima bo'ldi?" deb qolmaydi.
 *   6. MUVAFFAQIYATSIZLIK — lead yo'qolmaydi: telefon/Telegram ko'rsatiladi.
 *
 * Turlari: sample (test box) | quote (narx) | product (mahsulot) |
 *          callback (qo'ng'iroq) | contact (umumiy) | catalog (katalog)
 */

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { isValidEmail, isValidInn, isValidInternationalPhone, isValidUzPhone, parseUtm } from '@/lib/utils';
import { BUSINESS_TYPES, UZ_REGIONS, tr, type Locale, type Trilingual } from '@/lib/taxonomy';
import type { DictKey } from '@/i18n';
import { siteConfig } from '@/lib/config';
import type { SampleItem } from '@/lib/types';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useToast } from '@/components/ui/Overlay';
import { track } from '@/lib/analytics';
import { Icon } from '@/components/ui/Icon';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Checkbox, Input, RadioChipGroup, Select, Textarea } from '@/components/ui/Field';
import { Badge } from '@/components/ui/Display';
import { PhoneInput } from './PhoneInput';
import { Turnstile } from './Turnstile';

/* ============================================================
   Turlar
   ============================================================ */

export type LeadFormType = 'sample' | 'quote' | 'product' | 'callback' | 'contact' | 'catalog';

interface FormState {
  fullName: string;
  position: string;
  phone: string;
  email: string;
  telegram: string;
  preferredContact: string;

  companyName: string;
  inn: string;
  businessType: string;
  website: string;

  region: string;
  city: string;
  address: string;

  interest: string[];
  volume: string;
  frequency: string;
  deadline: string;
  message: string;

  consent: boolean;
  /** Honeypot — CSS bilan yashirilgan, botlar to'ldiradi */
  website_url: string;
}

const EMPTY: FormState = {
  fullName: '',
  position: '',
  phone: '',
  email: '',
  telegram: '',
  preferredContact: 'phone',
  companyName: '',
  inn: '',
  businessType: '',
  website: '',
  region: '',
  city: '',
  address: '',
  interest: [],
  volume: '',
  frequency: '',
  deadline: '',
  message: '',
  consent: false,
  website_url: '',
};

export interface LeadFormProps {
  type: LeadFormType;
  locale: Locale;
  /** Test box elementlari (type='sample') */
  products?: SampleItem[];
  /** Mahsulot sahifasidan kelgan so'rov (type='product') */
  product?: { sku: string; slug: string; name: Trilingual };
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  /** Muvaffaqiyatdan keyin taklif qilinadigan havola */
  nextHref?: string;
  nextLabel?: string;
  onDone?: (ref: string, type: LeadFormType) => void;
  className?: string;
  /** Ixcham rejim — kamroq maydon (masalan mahsulot sahifasida) */
  compact?: boolean;
  /** Murojaat matnini oldindan to'ldirish (masalan tarmoq sahifasidan) */
  initialMessage?: string;
}

type StepId = 'contact' | 'company' | 'request';

const STEPS: Record<'full' | 'compact' | 'callback', StepId[]> = {
  full: ['contact', 'company', 'request'],
  compact: ['contact', 'company'],
  callback: ['contact'],
};

const INTEREST_IDS = ['flavours', 'fragrances', 'ingredients', 'oils', 'chemicals', 'commodities', 'custom'] as const;
const VOLUME_IDS = ['1', '2', '3', '4', '5'] as const;
const FREQUENCY_IDS = ['once', 'monthly', 'quarterly', 'regular'] as const;

/* ============================================================
   Komponent
   ============================================================ */

export function LeadForm({
  type,
  locale,
  products = [],
  product,
  title,
  subtitle,
  submitLabel,
  nextHref,
  nextLabel,
  onDone,
  className,
  compact,
  initialMessage,
}: LeadFormProps) {
  const { t } = useI18n();
  const toast = useToast();

  const mode: 'full' | 'compact' | 'callback' = type === 'callback' ? 'callback' : compact ? 'compact' : 'full';
  const steps = STEPS[mode];

  const [values, setValues] = useState<FormState>(() =>
    initialMessage ? { ...EMPTY, message: initialMessage } : EMPTY,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle');
  const [result, setResult] = useState<{ ref: string; duplicate?: boolean; quality?: number } | null>(null);
  const [formError, setFormError] = useState<string>('');
  const [turnstileToken, setTurnstileToken] = useState('');

  // Forma qancha vaqt to'ldirilganini o'lchash uchun bir martalik boshlang'ich
  // vaqt (render paytida faqat ref ishga tushiriladi — ekranga chiqmaydi).
  // eslint-disable-next-line react-hooks/purity
  const startedAt = useRef<number>(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  // Tashqi mahsulot ro'yxati o'zgarsa (masalan test box yangilansa)
  useEffect(() => {
    startedAt.current = Date.now();
  }, [type]);

  /** Xato kalitini (server ham, klient ham lug'at kalitini qaytaradi) tarjima qilish */
  const te = (key?: string): string | undefined => (key ? t(key as DictKey) : undefined);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      if (!Object.keys(e).some((k) => k.endsWith(String(key)))) return e;
      const next = { ...e };
      for (const k of Object.keys(next)) {
        const field = k.split('.').pop();
        if (field === String(key)) delete next[k];
      }
      return next;
    });
  };

  const toggleInterest = (id: string) =>
    setValues((v) => ({
      ...v,
      interest: v.interest.includes(id) ? v.interest.filter((x) => x !== id) : [...v.interest, id].slice(0, 7),
    }));

  /* ------------------------------------------------------------
     Validatsiya — server qoidalari bilan bir xil
     ------------------------------------------------------------ */

  const validateStep = (idx: number): Record<string, string> => {
    const e: Record<string, string> = {};
    const id = steps[idx];
    const v = values;

    if (id === 'contact') {
      const name = v.fullName.trim();
      if (name.length < 2) e['contact.fullName'] = 'err.nameShort';
      else if (name.length > 80) e['contact.fullName'] = 'err.nameLong';

      const phone = v.phone.trim();
      if (!phone) e['contact.phone'] = 'err.required';
      else if (!isValidUzPhone(phone) && !isValidInternationalPhone(phone)) e['contact.phone'] = 'err.phone';

      if (v.email.trim() && !isValidEmail(v.email.trim())) e['contact.email'] = 'err.email';
      if (v.telegram.trim() && !/^@?[A-Za-z0-9_]{3,32}$/.test(v.telegram.trim())) e['contact.telegram'] = 'err.required';
      if (v.position.trim().length > 80) e['contact.position'] = 'err.nameLong';
    }

    if (id === 'company') {
      if (type !== 'callback') {
        const cn = v.companyName.trim();
        if (cn.length < 2) e['company.name'] = 'err.companyShort';
        else if (cn.length > 120) e['company.name'] = 'err.companyLong';
      }
      if (v.inn.trim() && !isValidInn(v.inn.trim())) e['company.inn'] = 'err.inn';

      if ((type === 'sample' || type === 'quote') && !v.region) e['location.region'] = 'err.region';

      if (v.website.trim() && !/^[^\s]+\.[^\s]{2,}$/i.test(v.website.trim().replace(/^https?:\/\//, ''))) {
        e['company.website'] = 'err.required';
      }
    }

    if (id === 'request') {
      if (type === 'sample' && products.length === 0) e['request.products'] = 'err.products';
      if ((type === 'contact' || type === 'catalog') && !v.message.trim() && v.interest.length === 0) {
        e['request.message'] = 'err.message';
      }
      if (v.message.length > 2000) e['request.message'] = 'err.messageLong';
      if (v.deadline && !/^\d{4}-\d{2}-\d{2}$/.test(v.deadline)) e['request.deadline'] = 'err.required';
      if (!v.consent) e['consent'] = 'err.consent';
    }

    return e;
  };

  const validateAll = (): Record<string, string> => {
    const all: Record<string, string> = {};
    for (let i = 0; i < steps.length; i++) Object.assign(all, validateStep(i));
    // Rozilik oxirgi qadamda, lekin compact/callback rejimda ham tekshiramiz
    if (!values.consent) all.consent = 'err.consent';
    return all;
  };

  /* ------------------------------------------------------------
     Qadamlar orasida harakat
     ------------------------------------------------------------ */

  const goNext = () => {
    const e = validateStep(step);
    setErrors(e);
    if (Object.keys(e).length) {
      focusFirstError();
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  const focusFirstError = () => {
    setTimeout(() => {
      const el = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [data-error="true"]');
      el?.focus({ preventScroll: false });
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  };

  /* ------------------------------------------------------------
     Yuborish
     ------------------------------------------------------------ */

  const submitLabelFor = submitLabel
    ?? (type === 'sample'
      ? t('form.submitSample')
      : type === 'quote'
        ? t('form.submitQuote')
        : type === 'callback'
          ? t('form.submitCallback')
          : type === 'catalog'
            ? t('form.submitCatalog')
            : t('form.submit'));

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (status === 'sending') return;

    const allErrors = validateAll();
    setErrors(allErrors);
    if (Object.keys(allErrors).length) {
      // Xato qadamga qaytamiz
      const badStep = steps.findIndex((_, i) => Object.keys(validateStep(i)).length > 0);
      if (badStep >= 0) setStep(badStep);
      focusFirstError();
      track.formError(type, Object.keys(allErrors)[0], 'client_validation');
      return;
    }

    setStatus('sending');
    setFormError('');

    const v = values;
    const page = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
    const utm = typeof window !== 'undefined' ? parseUtm(window.location.search) : {};

    const payload = {
      type,
      contact: {
        fullName: v.fullName.trim(),
        position: v.position.trim() || undefined,
        phone: v.phone.trim(),
        email: v.email.trim() || undefined,
        telegram: v.telegram.trim() || undefined,
      },
      company: {
        name: v.companyName.trim() || undefined,
        inn: v.inn.trim() || undefined,
        type: v.businessType || undefined,
        website: v.website.trim() || undefined,
      },
      location: {
        region: v.region || undefined,
        city: v.city.trim() || undefined,
        address: v.address.trim() || undefined,
      },
      request: {
        products:
          type === 'sample'
            ? products.map((p) => ({
                sku: p.sku,
                slug: p.slug,
                name: p.name,
                qty: p.qty,
                unit: p.unit,
                note: p.note,
              }))
            : product
              ? [{ sku: product.sku, slug: product.slug, name: product.name, qty: 50, unit: 'g' }]
              : undefined,
        volume: v.volume || undefined,
        frequency: v.frequency || undefined,
        message: v.message.trim() || undefined,
        interest: v.interest.length ? v.interest : undefined,
        preferredContact: v.preferredContact || undefined,
        deadline: v.deadline || undefined,
        productSku: product?.sku,
        productSlug: product?.slug,
      },
      source: { locale, page, utm },
      consent: v.consent,
      website_url: v.website_url,
      formStartedAt: startedAt.current,
      turnstileToken: turnstileToken || undefined,
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = (await res.json().catch(() => null)) as
        | {
            ok?: boolean;
            data?: { ref?: string; duplicate?: boolean; suppressed?: boolean; quality?: number };
            error?: { code?: string; message?: string; fields?: Record<string, string> };
          }
        | null;

      // Honeypot: server 200 qaytaradi, lekin lead yo'q. Foydalanuvchiga muvaffaqiyat ko'rsatamiz.
      if (json?.data?.suppressed) {
        setStatus('done');
        setResult({ ref: '—' });
        return;
      }

      if (res.status === 201 || (res.ok && json?.ok)) {
        const ref = json?.data?.ref ?? '—';
        setResult({ ref, duplicate: json?.data?.duplicate, quality: json?.data?.quality });
        setStatus('done');
        if (type === 'sample') track.sampleRequest(products.length, ref);
        else if (type === 'quote') track.quoteRequest(ref);
        else track.leadSubmit(type, ref, { products: products.length || (product ? 1 : 0) });
        onDone?.(ref, type);
        if (json?.data?.duplicate) toast.info(t('form.duplicate'), ref);
        return;
      }

      // Validatsiya xatosi — maydonlarga qaytaramiz
      if (res.status === 400 && json?.error?.fields) {
        setErrors(json.error.fields);
        setStatus('idle');
        const badStep = steps.findIndex((_, i) => Object.keys(validateStep(i)).length > 0);
        setStep(badStep >= 0 ? badStep : steps.length - 1);
        setFormError(json.error.message ?? t('err.required'));
        focusFirstError();
        track.formError(type, Object.keys(json.error.fields)[0], 'server_validation');
        return;
      }

      if (res.status === 429) {
        setStatus('failed');
        setFormError(json?.error?.message ?? t('err.rateLimit', { minutes: 5 }));
        track.formError(type, undefined, 'rate_limit');
        return;
      }

      setStatus('failed');
      setFormError(
        res.status === 400 && json?.error?.code === 'captcha'
          ? t('err.spam')
          : res.status >= 500
            ? t('err.server')
            : (json?.error?.message ?? t('err.unknown')),
      );
      track.formError(type, undefined, `http_${res.status}`);
    } catch {
      setStatus('failed');
      setFormError(t('err.network'));
      track.formError(type, undefined, 'network');
    }
  }

  /* ------------------------------------------------------------
     Variantlar (select uchun)
     ------------------------------------------------------------ */

  const regionOptions = useMemo(
    () => UZ_REGIONS.map((r) => ({ value: r.id, label: tr(r.name, locale, r.id) })),
    [locale],
  );
  const businessOptions = useMemo(
    () => BUSINESS_TYPES.map((b) => ({ value: b.id, label: tr(b.name, locale, b.id) })),
    [locale],
  );

  /* ============================================================
     MUVAFFAQIYAT EKRANI
     ============================================================ */

  if (status === 'done' && result) {
    const isCallback = type === 'callback';
    const minutes = siteConfig.business.responseMinutes;
    const days = siteConfig.business.sampleDeliveryDays;

    return (
      <div className={cn('overflow-hidden rounded-2xl border border-teal-500/30 bg-white shadow-lift', className)}>
        <div className="flex flex-col items-center gap-3 bg-mint-50 px-6 py-8 text-center">
          <span className="animate-scale-in flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-white shadow-glow">
            <Icon name="check" size={32} strokeWidth={2.6} />
          </span>
          <h3 className="font-display text-[20px] font-extrabold tracking-tight text-pine-900">
            {t('form.successTitle')}
          </h3>
          <p className="max-w-md text-[14px] leading-relaxed text-slate-warm-600">
            {isCallback
              ? t('form.successTextCallback')
              : t('form.successText', { ref: result.ref }).replace('30', String(minutes))}
          </p>
          {!result.duplicate && result.ref !== '—' ? (
            <span className="mt-1 inline-flex items-center gap-2 rounded-lg border border-teal-500/25 bg-white px-3 py-1.5 font-mono text-[13px] font-bold text-teal-600">
              <Icon name="tag" size={14} />
              {result.ref}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(result.ref).then(
                    () => toast.success(t('common.copied')),
                    () => undefined,
                  );
                }}
                className="rounded p-0.5 text-slate-warm-500 transition hover:bg-cream-100 hover:text-pine-800"
                aria-label={t('common.copy')}
                title={t('common.copy')}
              >
                <Icon name="copy" size={13} />
              </button>
            </span>
          ) : null}
        </div>

        <div className="px-6 py-6">
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-warm-500">
            {locale === 'ru' ? 'Что дальше' : locale === 'en' ? 'What happens next' : 'Keyingi qadamlar'}
          </p>
          <ol className="mt-3 flex flex-col gap-2.5">
            {(isCallback
              ? [t('samples.successStep1'), t('samples.successStep3')]
              : type === 'sample'
                ? [t('samples.successStep1'), t('samples.successStep2'), t('samples.successStep3'), t('samples.successStep4')]
                : [t('samples.successStep1'), t('samples.successStep2'), t('samples.successStep3')]
            ).map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream-100 font-mono text-[12px] font-bold text-pine-800">
                  {i + 1}
                </span>
                <span className="text-[13.5px] leading-snug text-slate-warm-700">
                  {s.replace(/\{days\}/g, String(days))}
                </span>
              </li>
            ))}
          </ol>

          {/* Zaxira aloqa — mijoz javob kutmasligi kerak */}
          <div className="mt-6 rounded-xl border border-cream-200 bg-cream-50 p-4">
            <p className="text-[13px] font-semibold text-pine-900">{t('cta.orCall')}</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <ButtonLink href={siteConfig.contact.phonePrimaryHref} variant="primary" size="sm" icon="phone">
                {siteConfig.contact.phonePrimary}
              </ButtonLink>
              {siteConfig.social.telegram ? (
                <ButtonLink href={siteConfig.social.telegram} variant="outline" size="sm" icon="telegram" external>
                  Telegram
                </ButtonLink>
              ) : null}
              <ButtonLink href={`mailto:${siteConfig.contact.salesEmail}`} variant="outline" size="sm" icon="mail">
                {siteConfig.contact.salesEmail}
              </ButtonLink>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon="refresh"
              onClick={() => {
                setValues(EMPTY);
                setErrors({});
                setStep(0);
                setStatus('idle');
                setResult(null);
                startedAt.current = Date.now();
              }}
            >
              {t('form.another')}
            </Button>
            {nextHref ? (
              <ButtonLink href={nextHref} variant="secondary" size="sm" iconRight="arrow-right">
                {nextLabel ?? t('common.next')}
              </ButtonLink>
            ) : null}
            <ButtonLink href={`/${locale}/catalog`} variant="outline" size="sm" icon="grid">
              {t('nav.catalog')}
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     FORMA
     ============================================================ */

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;
  const progress = ((step + (isLast ? 0.5 : 0)) / steps.length) * 100;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className={cn('overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-soft', className)}
      aria-labelledby="lead-form-title"
    >
      {/* ---- Sarlavha ---- */}
      <div className="border-b border-cream-200 bg-gradient-to-br from-pine-900 to-pine-800 px-5 py-4 text-white">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-mint-200" aria-hidden>
            <Icon name={type === 'sample' ? 'box' : type === 'quote' ? 'invoice' : type === 'callback' ? 'phone' : 'send'} size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 id="lead-form-title" className="font-display text-[17px] leading-tight font-extrabold text-white">
              {title ?? (type === 'sample' ? t('samples.title') : type === 'quote' ? t('quote.title') : t('contact.writeUs'))}
            </h3>
            <p className="mt-1 text-[12.5px] leading-snug text-white/65">
              {subtitle ?? (type === 'callback' ? t('contact.callBackHint') : t('form.secureNote'))}
            </p>
          </div>
          <span className="hidden shrink-0 items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[11px] font-semibold text-mint-200 sm:inline-flex">
            <Icon name="clock" size={12} />
            {siteConfig.business.responseMinutes} min
          </span>
        </div>

        {steps.length > 1 ? (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[11.5px] font-semibold text-white/60">
              <span>{t('form.step', { current: step + 1, total: steps.length })}</span>
              <span>
                {currentStep === 'contact'
                  ? t('admin.lead.contact')
                  : currentStep === 'company'
                    ? t('admin.lead.company')
                    : t('admin.lead.request')}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-mint-300 transition-[width] duration-500 ease-out"
                style={{ width: `${Math.max(8, progress)}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* ---- Honeypot: odam ko'rmaydi, bot to'ldiradi ---- */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0" tabIndex={-1}>
        <label htmlFor="lf-website">Website</label>
        <input
          id="lf-website"
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website_url}
          onChange={(e) => set('website_url', e.target.value)}
        />
      </div>

      <div className="px-5 py-5">
        {/* ============ 1-QADAM: ALOQA ============ */}
        {currentStep === 'contact' ? (
          <div className="flex flex-col gap-4">
            <Input
              label={t('form.fullName')}
              placeholder={t('form.fullNamePh')}
              value={values.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              error={errors['contact.fullName'] ? te(errors['contact.fullName']) : undefined}
              required
              autoComplete="name"
              maxLength={80}
              iconLeft="user"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t('form.position')}
                placeholder={t('form.positionPh')}
                value={values.position}
                onChange={(e) => set('position', e.target.value)}
                error={errors['contact.position'] ? te(errors['contact.position']) : undefined}
                optionalLabel={t('form.optional')}
                autoComplete="organization-title"
                maxLength={80}
                iconLeft="badge"
              />
              <PhoneInput
                label={t('form.phone')}
                value={values.phone}
                onChange={(v) => set('phone', v)}
                error={errors['contact.phone'] ? te(errors['contact.phone']) : undefined}
                required
                autoComplete="tel"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t('form.email')}
                type="email"
                placeholder={t('form.emailPh')}
                value={values.email}
                onChange={(e) => set('email', e.target.value)}
                error={errors['contact.email'] ? te(errors['contact.email']) : undefined}
                optionalLabel={t('form.optional')}
                hint={t('form.secureNote')}
                autoComplete="email"
                maxLength={254}
                iconLeft="mail"
              />
              <Input
                label="Telegram"
                placeholder={t('form.telegramPh')}
                value={values.telegram}
                onChange={(e) => set('telegram', e.target.value)}
                error={errors['contact.telegram'] ? te(errors['contact.telegram']) : undefined}
                optionalLabel={t('form.optional')}
                autoComplete="off"
                maxLength={64}
                iconLeft="telegram"
              />
            </div>

            {mode !== 'callback' ? (
              <RadioChipGroup
                name="preferredContact"
                legend={t('form.preferredContact')}
                value={values.preferredContact}
                onChange={(v) => set('preferredContact', v)}
                columns={3}
                options={[
                  { value: 'phone', label: t('form.preferredContact.phone') },
                  { value: 'telegram', label: 'Telegram' },
                  { value: 'email', label: 'E-mail' },
                ]}
              />
            ) : (
              <Textarea
                label={t('form.message')}
                placeholder={t('form.messagePh')}
                value={values.message}
                onChange={(e) => set('message', e.target.value)}
                optionalLabel={t('form.optional')}
                showCounter
                maxLength={2000}
                error={errors['request.message'] ? te(errors['request.message']) : undefined}
              />
            )}
          </div>
        ) : null}

        {/* ============ 2-QADAM: KOMPANIYA ============ */}
        {currentStep === 'company' ? (
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t('form.company')}
                placeholder={t('form.companyPh')}
                value={values.companyName}
                onChange={(e) => set('companyName', e.target.value)}
                error={errors['company.name'] ? te(errors['company.name']) : undefined}
                required={type !== 'callback'}
                autoComplete="organization"
                maxLength={120}
                iconLeft="building"
                hint={type !== 'callback' ? undefined : t('form.optional')}
              />
              <Input
                label={`${t('form.inn')} (STIR)`}
                placeholder={t('form.innPh')}
                value={values.inn}
                onChange={(e) => set('inn', e.target.value.replace(/\D/g, '').slice(0, 9))}
                error={errors['company.inn'] ? te(errors['company.inn']) : undefined}
                optionalLabel={t('form.optional')}
                inputMode="numeric"
                autoComplete="off"
                maxLength={9}
                iconLeft="invoice"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label={t('form.businessType')}
                placeholder={t('form.businessTypePh')}
                value={values.businessType}
                onChange={(e) => set('businessType', e.target.value)}
                options={businessOptions}
                optionalLabel={t('form.optional')}
              />
              <Select
                label={t('form.region')}
                placeholder={t('form.regionPh')}
                value={values.region}
                onChange={(e) => set('region', e.target.value)}
                options={regionOptions}
                required={type === 'sample' || type === 'quote'}
                error={errors['location.region'] ? te(errors['location.region']) : undefined}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t('form.city')}
                placeholder={t('form.cityPh')}
                value={values.city}
                onChange={(e) => set('city', e.target.value)}
                optionalLabel={t('form.optional')}
                autoComplete="address-level2"
                maxLength={120}
                iconLeft="map-pin"
              />
              <Input
                label={locale === 'ru' ? 'Сайт компании' : locale === 'en' ? 'Company website' : 'Kompaniya sayti'}
                placeholder="example.uz"
                value={values.website}
                onChange={(e) => set('website', e.target.value)}
                error={errors['company.website'] ? te(errors['company.website']) : undefined}
                optionalLabel={t('form.optional')}
                autoComplete="url"
                maxLength={200}
                iconLeft="globe"
              />
            </div>

            <Input
              label={t('form.address')}
              placeholder={t('form.addressPh')}
              value={values.address}
              onChange={(e) => set('address', e.target.value)}
              optionalLabel={type === 'sample' ? undefined : t('form.optional')}
              hint={type === 'sample' ? t('samples.deliveryInfo') : undefined}
              autoComplete="street-address"
              maxLength={400}
              iconLeft="truck"
            />
          </div>
        ) : null}

        {/* ============ 3-QADAM: SO'ROV ============ */}
        {currentStep === 'request' ? (
          <div className="flex flex-col gap-4">
            {/* Tanlangan mahsulotlar */}
            {type === 'sample' ? (
              <div
                className={cn(
                  'rounded-xl border p-3',
                  products.length ? 'border-teal-500/25 bg-mint-50' : 'border-clay-300/50 bg-clay-100/40',
                )}
                data-error={products.length ? undefined : 'true'}
              >
                <div className="flex items-center gap-2">
                  <Icon name="box" size={16} className="text-teal-600" />
                  <span className="flex-1 text-[13px] font-bold text-pine-900">{t('samples.yourBox')}</span>
                  <Badge tone={products.length ? 'mint' : 'clay'} size="xs">
                    {t('samples.itemsCount', { count: products.length })}
                  </Badge>
                </div>
                {products.length ? (
                  <ul className="mt-2.5 flex flex-col gap-1">
                    {products.map((p) => (
                      <li key={p.sku} className="flex items-baseline gap-2 text-[12.5px]">
                        <span className="font-mono text-[11px] text-slate-warm-500">{p.sku}</span>
                        <span className="min-w-0 flex-1 truncate font-medium text-pine-800">
                          {(p.name[locale] || p.name.en || p.sku) as string}
                        </span>
                        <span className="shrink-0 font-mono text-[11.5px] text-slate-warm-600">
                          {p.qty} {p.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                    <p className="mt-2 text-[12.5px] font-medium text-clay-600">
                      {errors['request.products'] ? te(errors['request.products']) : t('samples.boxEmpty')}
                    </p>
                    <Link
                      href={`/${locale}/catalog`}
                      className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-teal-600 underline decoration-teal-500/40 underline-offset-2"
                    >
                      <Icon name="grid" size={13} />
                      {t('samples.goToCatalog')}
                    </Link>
                  </>
                )}
              </div>
            ) : null}

            {/* Bitta mahsulot (mahsulot sahifasidan) */}
            {product ? (
              <div className="flex items-center gap-3 rounded-xl border border-teal-500/25 bg-mint-50 p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-teal-600 shadow-soft">
                  <Icon name="flavour" size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-bold text-pine-900">
                    {(product.name[locale] || product.name.en || product.sku) as string}
                  </span>
                  <span className="block font-mono text-[11.5px] text-slate-warm-500">{product.sku}</span>
                </span>
                <Link
                  href={`/${locale}/product/${product.slug}`}
                  className="shrink-0 rounded-lg border border-cream-300 bg-white px-2.5 py-1 text-[12px] font-semibold text-slate-warm-700 transition hover:border-teal-500/50 hover:text-teal-600"
                >
                  {t('card.details')}
                </Link>
              </div>
            ) : null}

            {/* Qiziqish yo'nalishlari */}
            <fieldset className="flex flex-col gap-2">
              <legend className="text-[13px] font-semibold text-pine-800">
                {t('form.interest')}
                <span className="ml-1.5 text-[11px] font-medium text-slate-warm-500">({t('form.optional')})</span>
              </legend>
              <div className="flex flex-wrap gap-1.5">
                {INTEREST_IDS.map((id) => {
                  const active = values.interest.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleInterest(id)}
                      aria-pressed={active}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition active:scale-[0.97]',
                        active
                          ? 'border-teal-600 bg-teal-600 text-white'
                          : 'border-cream-300 bg-white text-slate-warm-700 hover:border-teal-500/50 hover:bg-mint-50 hover:text-teal-600',
                      )}
                    >
                      {t(`form.interest.${id}` as DictKey)}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label={t('form.volume')}
                placeholder={t('form.volumePh')}
                value={values.volume}
                onChange={(e) => set('volume', e.target.value)}
                options={VOLUME_IDS.map((id) => ({ value: id, label: t(`form.volumeOptions.${id}` as DictKey) }))}
                optionalLabel={t('form.optional')}
              />
              <Select
                label={t('form.frequency')}
                placeholder={t('form.optional')}
                value={values.frequency}
                onChange={(e) => set('frequency', e.target.value)}
                options={FREQUENCY_IDS.map((id) => ({ value: id, label: t(`form.frequency.${id}` as DictKey) }))}
                optionalLabel={t('form.optional')}
              />
            </div>

            <Input
              label={t('form.deadline')}
              type="date"
              value={values.deadline}
              onChange={(e) => set('deadline', e.target.value)}
              error={errors['request.deadline'] ? te(errors['request.deadline']) : undefined}
              optionalLabel={t('form.optional')}
              iconLeft="calendar"
            />

            <Textarea
              label={t('form.message')}
              placeholder={t('form.messagePh')}
              value={values.message}
              onChange={(e) => set('message', e.target.value)}
              error={errors['request.message'] ? te(errors['request.message']) : undefined}
              required={type === 'contact' || type === 'catalog'}
              optionalLabel={type === 'contact' || type === 'catalog' ? undefined : t('form.optional')}
              showCounter
              maxLength={2000}
            />

            {/* Turnstile (agar sozlangan bo'lsa) */}
            {siteConfig.analytics.turnstileSiteKey ? (
              <Turnstile
                siteKey={siteConfig.analytics.turnstileSiteKey}
                onToken={setTurnstileToken}
                action={`lead_${type}`}
                lang={locale === 'ru' ? 'ru' : locale === 'en' ? 'en' : 'uz'}
              />
            ) : null}
          </div>
        ) : null}

        {/* ---- Rozilik — faqat oxirgi qadamda ---- */}
        {isLast ? (
        <div className="mt-5 border-t border-cream-200 pt-4">
          <Checkbox
            checked={values.consent}
            onChange={(e) => set('consent', e.target.checked)}
            error={errors.consent ? te(errors.consent) : undefined}
            label={t('form.consent')}
            description={
              <>
                {t('form.consentText', { link: '' }).trim()}{' '}
                <Link
                  href={`/${locale}/privacy`}
                  target="_blank"
                  className="font-semibold text-teal-600 underline decoration-teal-500/40 underline-offset-2 hover:decoration-teal-600"
                >
                  {t('form.consentLink')}
                </Link>
              </>
            }
          />
        </div>
        ) : null}

        {/* ---- Umumiy xato ---- */}
        {formError ? (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2.5 rounded-xl border border-clay-300/60 bg-clay-100/60 px-3.5 py-3"
          >
            <Icon name="alert" size={16} className="mt-0.5 shrink-0 text-clay-600" />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-clay-600">{formError}</p>
              <p className="mt-1 text-[12px] text-slate-warm-600">
                {t('cta.orCall')}{' '}
                <a href={siteConfig.contact.phonePrimaryHref} className="font-mono font-bold text-pine-900 underline underline-offset-2">
                  {siteConfig.contact.phonePrimary}
                </a>
              </p>
            </div>
          </div>
        ) : null}

        {/* ---- Tugmalar ---- */}
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          {steps.length > 1 && step > 0 ? (
            <Button type="button" variant="ghost" size="lg" icon="arrow-left" onClick={goPrev}>
              {t('common.back')}
            </Button>
          ) : null}

          {isLast ? (
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={status === 'sending'}
              icon={status === 'sending' ? undefined : 'send'}
              className="flex-1"
            >
              {status === 'sending' ? t('common.sending') : submitLabelFor}
            </Button>
          ) : (
            <Button type="button" variant="primary" size="lg" iconRight="arrow-right" onClick={goNext} className="flex-1">
              {t('common.next')}
            </Button>
          )}

          <a
            href={siteConfig.contact.phonePrimaryHref}
            onClick={() => track.callClick(`lead_form_${type}`)}
            className="inline-flex h-13 items-center gap-2 rounded-xl border border-cream-300 px-4 text-[13.5px] font-semibold text-pine-800 transition hover:border-teal-500/50 hover:bg-mint-50 hover:text-teal-600"
          >
            <Icon name="phone" size={16} />
            <span className="hidden sm:inline">{t('nav.call')}</span>
          </a>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-slate-warm-500">
          <Icon name="lock" size={12} className="text-teal-600" />
          {t('form.secureNote')}
        </p>
      </div>

    </form>
  );
}

export default LeadForm;
