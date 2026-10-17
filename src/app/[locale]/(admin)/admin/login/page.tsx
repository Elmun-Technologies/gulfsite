/**
 * ADMIN — KIRISH SAHIFASI
 * ----------------------------------------------------------------
 * `/admin/login` proxy tomonidan HIMOYALANMAYDI (aks holda kirib
 * bo'lmaydi). Sahifa o'zi ikkita holatni boshqaradi:
 *   - sessiya allaqachon bor → panelga redirect;
 *   - ADMIN_PASSWORD/ADMIN_SECRET o'rnatilmagan → sozlash ko'rsatmasi
 *     (aks holda foydalanuvchi "parol ishlamayapti" deb o'ylaydi).
 */

import Image from 'next/image';
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
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-navy px-4 py-10">

      <div className="relative w-full max-w-sm">
        <div className="rounded-card border border-line-soft bg-white p-6">
          <div className="flex items-center gap-3">
            <Image src="/images/monogram-copper.png" alt="" width={498} height={523} className="h-12 w-auto" priority />
            <div className="min-w-0">
              <h1 className="font-display text-[16px] leading-tight font-semibold tracking-tight text-ink">
                {t('admin.loginTitle')}
              </h1>
              <p className="mt-0.5 truncate text-[11.5px] text-muted">{siteConfig.brand.full}</p>
            </div>
          </div>

          {configured ? (
            <div className="mt-6">
              <AdminLoginForm locale={locale} />
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex items-start gap-2.5 rounded-[20px] border border-copper/50 bg-panel p-4">
                <Icon name="alert" size={18} className="mt-px shrink-0 text-copper-dark" />
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-ink">{t('admin.setup')}</p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-body">{t('admin.setupHint')}</p>
                </div>
              </div>

              <pre className="mt-3.5 overflow-x-auto rounded-[20px] border border-white/10 bg-navy p-3.5 font-mono text-[11px] leading-relaxed text-copper-light">
{`# .env.local
ADMIN_PASSWORD=$(locale === 'ru' ? 'ваш-надёжный-пароль' : locale === 'en' ? 'your-strong-password' : 'kuchli-parolingiz')}
ADMIN_SECRET=$(locale === 'ru' ? '# openssl rand -hex 32' : '# openssl rand -hex 32')}

# keyin serverni qayta ishga tushiring
npm run dev`}
              </pre>

              <a
                href={`/${locale}`}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[20px] border border-line bg-white text-[13.5px] font-bold text-slate transition hover:border-copper hover:text-copper-dark"
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
