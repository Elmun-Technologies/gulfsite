/**
 * ADMIN — TIZIM HOLATI: saqlash (fly.io volume), bildirishnoma kanallari,
 * xavfsizlik va launch tekshiruvlari, analitika hajmi, eksportlar.
 * Maxfiy qiymatlar (token, parol) KO'RSATILMAYDI — faqat "sozlangan/yo'q".
 */

import { accessSync, constants, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { redirect } from 'next/navigation';
import { normalizeLocale } from '@/i18n';
import { requireAdmin } from '@/lib/guard';
import { adminCopy } from '@/lib/admin-copy';
import { notificationChannels, serverConfig, siteConfig } from '@/lib/config';
import { ANALYTICS_DIR, DATA_DIR } from '@/lib/data-dir';
import { availableDays } from '@/lib/analytics-store';
import { getStats } from '@/lib/leads/store';
import { AdminCard, PageTitle } from '@/components/admin/AdminUi';
import { TelegramBotCard } from '@/components/admin/TelegramBotCard';
import { botStatus, miniAppUrl } from '@/lib/telegram';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function writable(dir: string): boolean {
  try {
    accessSync(dir, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function dirSizeKb(dir: string): number {
  try {
    return Math.round(readdirSync(dir).reduce((n, f) => n + statSync(join(dir, f)).size, 0) / 1024);
  } catch {
    return 0;
  }
}

function Check({ ok, label, hint }: { ok: boolean; label: string; hint?: string }) {
  return (
    <li className="flex items-start gap-2.5 py-1.5 text-[13px]">
      <span className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', ok ? 'bg-ok' : 'bg-error')} aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="text-ink">{label}</span>
        {hint ? <span className="block text-[12px] text-muted">{hint}</span> : null}
      </span>
      <span className={cn('shrink-0 text-[11.5px] font-semibold', ok ? 'text-copper-dark' : 'text-error')}>{ok ? 'OK' : '—'}</span>
    </li>
  );
}

export default async function AdminSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!(await requireAdmin())) redirect(`/${normalizeLocale(raw)}/admin/login`);
  const locale = normalizeLocale(raw);
  const c = adminCopy(locale);
  const stats = getStats();
  const ch = notificationChannels();
  const days = availableDays();
  const env = (k: string) => Boolean((process.env[k] ?? '').trim());
  const bot = await botStatus();

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title={c.settings.title} />

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard title={c.settings.storage}>
          <ul>
            <Check
              ok={writable(DATA_DIR)}
              label={`${c.settings.dataDir}: ${DATA_DIR}`}
              hint={writable(DATA_DIR) ? c.settings.writable : c.settings.notWritable}
            />
            <Check
              ok={stats.storage.writable}
              label={`Leads: ${stats.storage.driver} · ${stats.storage.months} · ${stats.storage.sizeKb} KB`}
              hint={stats.storage.writable ? c.settings.writable : c.settings.notWritable}
            />
          </ul>
        </AdminCard>

        <AdminCard title={c.settings.channels}>
          <ul>
            <Check ok={ch.telegram} label="Telegram bot (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID)" />
            <Check ok={ch.email} label="E-mail (SMTP_* / RESEND_API_KEY + LEAD_EMAIL_TO)" />
            <Check ok={ch.webhook} label="Webhook / CRM (LEAD_WEBHOOK_URL)" />
          </ul>
        </AdminCard>

        <TelegramBotCard initial={bot} shopUrl={miniAppUrl(locale)} locale={locale} />

        <AdminCard title={c.settings.security}>
          <ul>
            <Check ok={serverConfig.admin.isConfigured} label="ADMIN_PASSWORD + ADMIN_SECRET" />
            <Check ok={env('TRUSTED_IP_HEADER')} label="TRUSTED_IP_HEADER" hint="fly.io → fly-client-ip" />
            <Check ok={serverConfig.antispam.turnstileEnabled} label="Cloudflare Turnstile" />
          </ul>
        </AdminCard>

        <AdminCard title={c.settings.checks}>
          <ul>
            <Check ok={!/localhost|127\.0\.0\.1/.test(siteConfig.url)} label={`NEXT_PUBLIC_SITE_URL: ${siteConfig.url}`} />
            <Check ok={env('NEXT_PUBLIC_GTM_ID')} label="Google Tag Manager (ixtiyoriy)" />
            <Check ok={env('GOOGLE_SITE_VERIFICATION')} label="Google Search Console" />
            <Check ok={env('YANDEX_VERIFICATION')} label="Yandex Webmaster" />
          </ul>
        </AdminCard>

        <AdminCard title={c.settings.analytics} className="lg:col-span-2">
          <p className="text-[13px] text-slate">
            {c.settings.analyticsDays}: <b className="tabular-nums">{days.length}</b>
            {days.length ? ` (${days[0]} — ${days[days.length - 1]})` : ''} · {c.settings.analyticsSize}:{' '}
            <b className="tabular-nums">{dirSizeKb(ANALYTICS_DIR)} KB</b>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {/* fayl yuklash — API endpoint, sahifa emas */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/admin/leads/export?format=csv" className="inline-flex h-10 items-center rounded-[12px] border border-line bg-white px-4 text-[13px] font-semibold text-slate hover:border-copper hover:text-copper-dark">
              {c.settings.exportLeads}
            </a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/admin/analytics/export?days=30" className="inline-flex h-10 items-center rounded-[12px] border border-line bg-white px-4 text-[13px] font-semibold text-slate hover:border-copper hover:text-copper-dark">
              {c.settings.exportAnalytics}
            </a>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
