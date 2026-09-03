/**
 * ADMIN KIRISH FORMASI
 * ----------------------------------------------------------------
 * POST /api/admin/login → muvaffaqiyatda cookie o'rnatiladi va
 * `next` parametri (yoki javobdagi redirect) bo'yicha o'tiladi.
 *
 * Xatolar lug'at kalitlari bilan qaytadi (admin.loginFailed,
 * admin.loginRateLimit) — shuning uchun xabar `t()` orqali ko'rsatiladi.
 * 429 holatida qayta urinishgacha qolgan vaqt hisoblab boriladi.
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useI18n } from '@/components/i18n/I18nProvider';
import { Icon } from '@/components/ui/Icon';
import { Spinner } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/config';

function LoginFormInner({ locale }: { locale: string }) {
  const { t } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [retryIn, setRetryIn] = useState(0);

  // Bloklanganda teskari sanoat
  useEffect(() => {
    if (retryIn <= 0) return;
    const id = setInterval(() => setRetryIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [retryIn]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || retryIn > 0) return;
    setBusy(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json().catch(() => null)) as
        | { ok?: boolean; data?: { redirect?: string }; error?: { code?: string; message?: string; retryAfterSec?: number } }
        | null;

      if (res.ok && json?.ok) {
        const next = params.get('next');
        const target =
          next && next.startsWith('/') && !next.startsWith('//')
            ? next
            : (json.data?.redirect ?? `/${locale}/admin`);
        router.replace(target);
        router.refresh();
        return;
      }

      const code = json?.error?.code ?? 'invalid_credentials';
      const msgKey = json?.error?.message ?? '';
      setError(
        code === 'rate_limit'
          ? t('admin.loginRateLimit')
          : code === 'not_configured'
            ? t('admin.setupHint')
            : msgKey && msgKey.startsWith('admin.')
              ? t(msgKey as 'admin.loginFailed')
              : t('admin.loginFailed'),
      );
      if (code === 'rate_limit' && json?.error?.retryAfterSec) {
        setRetryIn(Math.min(900, Math.max(1, Math.round(json.error.retryAfterSec))));
      }
      setPassword('');
      inputRef.current?.focus();
    } catch {
      setError(t('common.error'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3.5" noValidate>
      <label className="flex flex-col gap-1.5" htmlFor="admin-password">
        <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-slate-warm-500">
          {t('admin.password')}
        </span>
        <span className="relative flex items-center">
          <Icon
            name="lock"
            size={17}
            className="pointer-events-none absolute left-3.5 text-slate-warm-500"
          />
          <input
            id="admin-password"
            ref={inputRef}
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            maxLength={120}
            placeholder={t('admin.passwordPh')}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'admin-login-error' : undefined}
            className={cn(
              'h-12 w-full rounded-xl border bg-white pr-12 pl-10 font-mono text-[14px] text-pine-900 shadow-soft transition',
              'placeholder:font-sans placeholder:text-slate-warm-500',
              'focus:outline-none focus:ring-4',
              error
                ? 'border-clay-500 focus:border-clay-500 focus:ring-clay-500/15'
                : 'border-cream-300 focus:border-teal-500 focus:ring-teal-500/15',
            )}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? t('common.close') : t('common.more')}
            className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-lg text-slate-warm-500 transition hover:bg-cream-100 hover:text-pine-800"
          >
            <Icon name={show ? 'eye' : 'lock'} size={16} />
          </button>
        </span>
      </label>

      {error ? (
        <p
          id="admin-login-error"
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-clay-500/30 bg-clay-50 px-3.5 py-2.5 text-[12.5px] leading-snug font-semibold text-clay-700"
        >
          <Icon name="alert" size={15} className="mt-px shrink-0" />
          <span>
            {error}
            {retryIn > 0 ? (
              <span className="mt-1 block font-mono text-[12px] text-clay-600">
                {Math.floor(retryIn / 60)}:{String(retryIn % 60).padStart(2, '0')}
              </span>
            ) : null}
          </span>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy || retryIn > 0 || !password}
        className={cn(
          'inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-[14.5px] font-bold text-white transition',
          'bg-teal-600 hover:bg-pine-800 active:scale-[0.99]',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        {busy ? <Spinner size={17} /> : <Icon name="unlock" size={17} />}
        {busy ? t('common.loading') : t('admin.login')}
      </button>

      <p className="flex items-start gap-2 text-[11.5px] leading-snug text-slate-warm-500">
        <Icon name="shield" size={14} className="mt-px shrink-0 text-teal-600" />
        {t('admin.loginHint')}
      </p>

      <a
        href={`/${locale}`}
        className="mt-1 inline-flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-slate-warm-600 transition hover:text-teal-600"
      >
        <Icon name="arrow-left" size={14} />
        {t('legal.backToSite')}
      </a>

      <p className="text-center font-mono text-[10.5px] text-slate-warm-400">
        {siteConfig.brand.full} · {new Date().getFullYear()}
      </p>
    </form>
  );
}

export function AdminLoginForm({ locale }: { locale: string }) {
  return (
    <Suspense fallback={null}>
      <LoginFormInner locale={locale} />
    </Suspense>
  );
}
