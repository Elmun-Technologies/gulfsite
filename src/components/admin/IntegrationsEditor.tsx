'use client';

/**
 * ADMIN → INTEGRATSIYALAR: Search Console, Yandex Webmaster, Bing, Facebook
 * tasdig'i; GTM, GA4, Yandex Metrika, Meta Pixel, TikTok Pixel; qo'shimcha kod.
 * Butun <meta>/<script> parchasini joylashtirsa ham bo'ladi — server kerakli
 * identifikatorni o'zi ajratib oladi (`sanitizeIntegrations`).
 */

import { useState } from 'react';
import type { Integrations } from '@/lib/content';
import { cn } from '@/lib/utils';

type Key = keyof Integrations;

interface Field {
  key: Key;
  label: string;
  ph: string;
  where: string;
  href: string;
}

const COPY = {
  uz: {
    title: 'Integratsiyalar',
    sub: 'Analitika va SEO vositalari — kod yozmasdan. Identifikatorni yoki butun kod parchasini joylashtiring, sayt kerakli qismini o‘zi ajratib oladi.',
    verify: 'Saytni tasdiqlash (qidiruv tizimlari)',
    verifyHint: 'Egalikni tasdiqlash uchun <meta> teg — har bir sahifaning <head> qismiga qo‘yiladi.',
    analytics: 'Analitika va reklama piksellari',
    analyticsHint: 'Cookie roziligidan keyin ("Qabul qilish") yuklanadi. Admin panelda yuklanmaydi.',
    custom: 'Qo‘shimcha kod',
    customHint: 'Ro‘yxatda bo‘lmagan xizmat uchun HTML/skript (chat vidjeti va h.k.). Rozilikdan qat’i nazar barcha sahifalarga qo‘shiladi — faqat ishonchli manbadan.',
    where: 'Qayerdan olinadi',
    active: 'faol',
    envNote: 'env’dan',
    save: 'Saqlash',
    saving: 'Saqlanmoqda…',
    saved: 'Saqlandi — saytda 1–2 daqiqada ko‘rinadi',
    error: 'Saqlanmadi',
  },
  ru: {
    title: 'Интеграции',
    sub: 'Аналитика и SEO-инструменты без кода. Вставьте идентификатор или весь фрагмент кода — сайт сам извлечёт нужное.',
    verify: 'Подтверждение сайта (поисковые системы)',
    verifyHint: 'Мета-тег подтверждения прав — добавляется в <head> каждой страницы.',
    analytics: 'Аналитика и рекламные пиксели',
    analyticsHint: 'Загружаются только после согласия на cookie («Принять»). В админ-панели не загружаются.',
    custom: 'Дополнительный код',
    customHint: 'HTML/скрипт для сервиса, которого нет в списке (чат-виджет и т. п.). Добавляется на все страницы независимо от согласия — только из надёжных источников.',
    where: 'Где взять',
    active: 'активно',
    envNote: 'из env',
    save: 'Сохранить',
    saving: 'Сохранение…',
    saved: 'Сохранено — на сайте через 1–2 минуты',
    error: 'Не сохранено',
  },
  en: {
    title: 'Integrations',
    sub: 'Analytics and SEO tools without code. Paste the ID or the whole snippet — the site extracts what it needs.',
    verify: 'Site verification (search engines)',
    verifyHint: 'Ownership <meta> tag — added to the <head> of every page.',
    analytics: 'Analytics & ad pixels',
    analyticsHint: 'Loaded only after cookie consent ("Accept"). Not loaded in the admin panel.',
    custom: 'Custom code',
    customHint: 'HTML/script for a service not listed (chat widget, etc.). Added to all pages regardless of consent — trusted sources only.',
    where: 'Where to get it',
    active: 'active',
    envNote: 'from env',
    save: 'Save',
    saving: 'Saving…',
    saved: 'Saved — live within 1–2 minutes',
    error: 'Not saved',
  },
};

const VERIFY: Field[] = [
  { key: 'googleVerification', label: 'Google Search Console', ph: '<meta name="google-site-verification" content="…">', where: 'Search Console → Sozlamalar → Egalikni tasdiqlash → HTML teg', href: 'https://search.google.com/search-console' },
  { key: 'yandexVerification', label: 'Yandex Webmaster', ph: '<meta name="yandex-verification" content="…">', where: 'Yandex Webmaster → Sayt qo‘shish → Meta teg', href: 'https://webmaster.yandex.ru' },
  { key: 'bingVerification', label: 'Bing Webmaster Tools', ph: '<meta name="msvalidate.01" content="…">', where: 'Bing Webmaster → Add site → HTML Meta Tag', href: 'https://www.bing.com/webmasters' },
  { key: 'facebookVerification', label: 'Facebook (Meta) domain', ph: '<meta name="facebook-domain-verification" content="…">', where: 'Meta Business → Brand Safety → Domains', href: 'https://business.facebook.com/settings/owned-domains' },
];

const ANALYTICS: Field[] = [
  { key: 'yandexMetrikaId', label: 'Yandex Metrika', ph: '12345678', where: 'metrika.yandex.ru → Hisoblagich raqami (Webvisor yoqiladi)', href: 'https://metrika.yandex.ru' },
  { key: 'ga4Id', label: 'Google Analytics 4', ph: 'G-XXXXXXXXXX', where: 'Analytics → Admin → Data streams → Measurement ID', href: 'https://analytics.google.com' },
  { key: 'gtmId', label: 'Google Tag Manager', ph: 'GTM-XXXXXXX', where: 'tagmanager.google.com → konteyner ID', href: 'https://tagmanager.google.com' },
  { key: 'metaPixelId', label: 'Meta (Facebook) Pixel', ph: '123456789012345', where: 'Events Manager → Data sources → Pixel ID', href: 'https://business.facebook.com/events_manager' },
  { key: 'tiktokPixelId', label: 'TikTok Pixel', ph: 'CXXXXXXXXXXXXXXXXXXX', where: 'TikTok Ads → Assets → Events → Web events', href: 'https://ads.tiktok.com' },
];

const input =
  'h-10 w-full rounded-[10px] border border-line bg-white px-3 font-mono text-[13px] text-ink placeholder:text-muted/60 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15';

export function IntegrationsEditor({
  initial,
  effective,
  locale,
}: {
  initial: Integrations;
  /** saytda hozir ishlatilayotgan qiymat (env zaxirasi bilan) */
  effective: Integrations;
  locale: string;
}) {
  const c = COPY[(locale as keyof typeof COPY) in COPY ? (locale as keyof typeof COPY) : 'uz'];
  const [v, setV] = useState<Integrations>(initial);
  const [live, setLive] = useState<Integrations>(effective);
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  async function save() {
    setState('saving');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ integrations: v }),
      });
      const json = (await res.json()) as { ok: boolean; data?: { integrations: Integrations }; effective?: Integrations };
      if (!json.ok || !json.data) throw new Error('fail');
      setV(json.data.integrations);
      if (json.effective) setLive(json.effective);
      setState('saved');
    } catch {
      setState('error');
    }
  }

  const row = (f: Field) => {
    const own = v[f.key];
    const on = Boolean(live[f.key]);
    return (
      <li key={f.key} className="grid gap-2 border-b border-line py-4 last:border-0 md:grid-cols-[220px_minmax(0,1fr)] md:gap-6">
        <div>
          <span className="flex items-center gap-2 text-[14px] font-medium text-ink">
            {f.label}
            {on ? (
              <span className="rounded-full bg-ok/10 px-1.5 py-0.5 text-[11px] font-medium text-ok">
                {c.active}
                {!own ? ` · ${c.envNote}` : ''}
              </span>
            ) : null}
          </span>
          <a href={f.href} target="_blank" rel="noreferrer" className="mt-1 block text-[12px] text-copper-dark hover:underline">
            {c.where}: {f.where} ↗
          </a>
        </div>
        <input
          className={input}
          value={own}
          placeholder={f.ph}
          spellCheck={false}
          onChange={(e) => {
            setV({ ...v, [f.key]: e.target.value });
            setState('idle');
          }}
        />
      </li>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-[-0.02em] text-ink">{c.title}</h1>
        <p className="mt-1 max-w-[760px] text-[13.5px] text-muted">{c.sub}</p>
      </header>

      <section className="admin-card p-5">
        <h2 className="text-[15px] font-semibold text-ink">{c.verify}</h2>
        <p className="mt-1 text-[12.5px] text-muted">{c.verifyHint}</p>
        <ul className="m-0 mt-2 list-none p-0">{VERIFY.map(row)}</ul>
      </section>

      <section className="admin-card p-5">
        <h2 className="text-[15px] font-semibold text-ink">{c.analytics}</h2>
        <p className="mt-1 text-[12.5px] text-muted">{c.analyticsHint}</p>
        <ul className="m-0 mt-2 list-none p-0">{ANALYTICS.map(row)}</ul>
      </section>

      <section className="admin-card p-5">
        <h2 className="text-[15px] font-semibold text-ink">{c.custom}</h2>
        <p className="mt-1 text-[12.5px] text-muted">{c.customHint}</p>
        <textarea
          rows={6}
          spellCheck={false}
          value={v.customCode}
          onChange={(e) => {
            setV({ ...v, customCode: e.target.value });
            setState('idle');
          }}
          placeholder="<script>…</script>"
          className={cn(input, 'mt-3 h-auto py-2 leading-relaxed')}
        />
      </section>

      <div className="sticky bottom-0 -mx-4 flex items-center gap-3 border-t border-line bg-white/95 px-4 py-3 backdrop-blur lg:-mx-8 lg:px-8">
        <button
          type="button"
          onClick={save}
          disabled={state === 'saving'}
          className="inline-flex h-10 items-center rounded-[10px] bg-navy px-5 text-[14px] font-medium text-white disabled:opacity-50"
        >
          {state === 'saving' ? c.saving : c.save}
        </button>
        <span className={cn('text-[13px]', state === 'error' ? 'text-error' : 'text-ok')}>
          {state === 'saved' ? c.saved : state === 'error' ? c.error : ''}
        </span>
      </div>
    </div>
  );
}
