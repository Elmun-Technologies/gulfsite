/**
 * ADMIN — KIRISH SAHIFASI
 * ----------------------------------------------------------------
 * `/admin/login` proxy tomonidan HIMOYALANMAYDI (aks holda kirib
 * bo'lmaydi). Sahifa o'zi ikkita holatni boshqaradi:
 *   - sessiya allaqachon bor → panelga redirect;
 *   - ADMIN_PASSWORD/ADMIN_SECRET o'rnatilmagan → sozlash ko'rsatmasi
 *     (aks holda foydalanuvchi "parol ishlamayapti" deb o'ylaydi).
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { makeT, normalizeLocale } from '@/i18n';
import { AUTH_COOKIE, isAdminConfigured, verifySessionToken } from '@/lib/auth';
import { siteConfig } from '@/lib/config';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { Icon } from '@/components/ui/Icon';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const t = makeT(normalizeLocale(raw));
  return { title: t('admin.loginTitle'), robots: { index: false, follow: false } };
}

export default async function AdminLoginPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const t = makeT(locale);

  // Allaqachon kirilgan bo'lsa — panelga o'tkazamiz
  const store = await cookies();
  if (verifySessionToken(store.get(AUTH_COOKIE.name)?.value)) {
    redirect(`/${locale}/admin`);
  }

  const configured = isAdminConfigured();

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-pine-950 px-4 py-10">
      <div className="pattern-uzbek pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" aria-hidden />

      <div className="relative w-full max-w-sm">
        <div className="rounded-2xl border border-cream-200 bg-white p-6 shadow-float">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pine-900 font-display text-[14px] font-extrabold text-white">
              {siteConfig.brand.short}
            </span>
            <div className="min-w-0">
              <h1 className="font-display text-[16px] leading-tight font-extrabold tracking-tight text-pine-900">
                {t('admin.loginTitle')}
              </h1>
              <p className="mt-0.5 truncate text-[11.5px] text-slate-warm-500">{siteConfig.brand.full}</p>
            </div>
          </div>

          {configured ? (
            <div className="mt-6">
              <AdminLoginForm locale={locale} />
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex items-start gap-2.5 rounded-xl border border-gold-500/35 bg-gold-50 p-4">
                <Icon name="alert" size={18} className="mt-px shrink-0 text-gold-600" />
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-pine-900">{t('admin.setup')}</p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-warm-700">{t('admin.setupHint')}</p>
                </div>
              </div>

              <pre className="mt-3.5 overflow-x-auto rounded-xl border border-pine-900/15 bg-pine-950 p-3.5 font-mono text-[11px] leading-relaxed text-mint-200">
{`# .env.local
ADMIN_PASSWORD=$(locale === 'ru' ? 'ваш-надёжный-пароль' : locale === 'en' ? 'your-strong-password' : 'kuchli-parolingiz')}
ADMIN_SECRET=$(locale === 'ru' ? '# openssl rand -hex 32' : '# openssl rand -hex 32')}

# keyin serverni qayta ishga tushiring
npm run dev`}
              </pre>

              <a
                href={`/${locale}`}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-cream-300 bg-white text-[13.5px] font-bold text-pine-800 transition hover:border-teal-500 hover:text-teal-600"
              >
                <Icon name="arrow-left" size={16} />
                {t('legal.backToSite')}
              </a>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-white/45">
          {t('admin.title')} · {siteConfig.name}
        </p>
      </div>
    </div>
  );
}
