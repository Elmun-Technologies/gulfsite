/**
 * DIZAYN TIZIMI — /styleguide (§1, §10 · design/Styleguide.dc.html)
 * ----------------------------------------------------------------
 * DEV-ONLY: production build'da `notFound()` qaytaradi, shuning uchun
 * sahifa hech qachon publish bo'lmaydi va sitemap'ga kirmaydi.
 *
 * Nima uchun `[locale]` tashqarisida: bu texnik sahifa, til qobig'i va
 * marketing header/footer'i kerak emas. `app/layout.tsx` pass-through
 * bo'lgani uchun <html>/<body> shu faylning o'zida beriladi.
 *
 * Maqsad: tokenlar, tipografiya, komponentlar va animatsiya
 * parametrlarini dizayn fayli bilan YONMA-YON solishtirish (§16, 1-bosqich).
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  ArrowDown,
  ArrowUpRight,
  Box,
  Check,
  Factory,
  FileText,
  FlaskConical,
  Leaf,
  MessageCircle,
  Package,
  Phone,
  Play,
  RotateCw,
  Search,
  Send,
  Sparkles,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { Section } from '@/components/ui/SectionHeader';
import { MonogramCycle, MonogramStatic, Reveal, SplitLines } from '@/components/motion';
import { dur, ease, stagger } from '@/lib/motion';
import { LOGO_COPPER, MONOGRAM_SRC } from '@/lib/design-client';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Styleguide — GFF dizayn tizimi',
  robots: { index: false, follow: false },
};

/**
 * Production'da `notFound()` BUILD paytida ishlaganda Next o'zining ichki
 * `__next_error__` hujjatini beradi (ko'rinadigan matn faqat "404").
 * So'rov paytida ishlatish uchun sahifa dinamik qilinadi — natijada
 * production 404 ham brend ko'rinishi bilan (`app/not-found.tsx`) chiqadi.
 * Dev rejimida bu hech narsani o'zgartirmaydi.
 */
export const dynamic = 'force-dynamic';

/* ---------------------------------------------------------------- */

const COLORS = [
  { name: '--navy', hex: '#0B0A3A', use: 'Sarlavhalar, footer, asosiy tugma' },
  { name: '--ink', hex: '#14132E', use: 'Matn, kontur, fokus' },
  { name: '--copper', hex: '#D6A27C', use: 'YAGONA aksent (CTA)' },
  { name: '--copper-light', hex: '#E8C3A3', use: 'Slogan, navy ustidagi aksent' },
  { name: '--copper-dark', hex: '#94603E', use: 'Aksent matn, hover' },
  { name: '--panel', hex: '#F4EEE7', use: 'Panel/blok foni' },
  { name: '--slate', hex: '#26254A', use: 'Ikkilamchi panel' },
  { name: '--body', hex: '#4C4A5E', use: 'Asosiy matn' },
  { name: '--muted', hex: '#615E72', use: 'Ikkilamchi matn' },
  { name: '--line', hex: '#DCD2C7', use: 'Chegara, ajratgich' },
  { name: '--line-soft', hex: '#ECE4DA', use: 'Yumshoq chegara' },
  { name: '--ok', hex: '#2E8B57', use: '"Omborda" holati' },
  { name: '--error', hex: '#8E2B2B', use: 'Xato, forma xabari' },
];

const TYPE = [
  { label: 'Page title', cls: 'text-page-title', spec: 'clamp(40px, 6.4vw, 104px) · 400 · −0.035em' },
  { label: 'Section title', cls: 'text-section-title', spec: 'clamp(32px, 3.6vw, 56px) · 400 · −0.03em' },
  { label: 'H3', cls: 'text-h3', spec: 'clamp(24px, 2.4vw, 36px) · 500' },
  { label: 'H4', cls: 'text-h4', spec: 'clamp(20px, 1.8vw, 26px) · 600' },
  { label: 'Body L', cls: 'text-body-l', spec: 'clamp(16px, 1.15vw, 18px) · 400 · 1.55' },
  { label: 'Body', cls: 'text-body', spec: '15–16px · 400 · 1.55' },
  { label: 'Small', cls: 'text-small', spec: '14px · 400' },
];

const RADII = [
  { name: 'Blok / seksiya', v: '40px', cls: 'rounded-block' },
  { name: 'Kartochka', v: '36px', cls: 'rounded-card' },
  { name: 'Media, jadval', v: '28px', cls: 'rounded-media' },
  { name: 'Plitka, filter', v: '24px', cls: 'rounded-tile' },
  { name: 'Tugma, pill, input', v: '999px', cls: 'rounded-pill' },
];

const MOTION_ROWS = [
  { name: 'ease.out', value: 'cubic-bezier(0.16, 1, 0.3, 1)', use: 'Reveal, hover, tab o‘tishi' },
  { name: 'ease.inOut', value: 'cubic-bezier(0.65, 0, 0.35, 1)', use: 'Monogramma almashinuvi' },
  { name: 'dur.fast', value: '0.16s', use: 'Hover, bosish, toggle' },
  { name: 'dur.base', value: '0.32s', use: 'Panel, dropdown, tab' },
  { name: 'dur.slow', value: '0.6s', use: 'Katta blok o‘tishi' },
  { name: 'dur.reveal', value: '0.7s', use: 'Sarlavha satrlari, kartochkalar' },
  { name: 'stagger', value: '0.06s (maks. 8)', use: 'Ro‘yxat, grid, satrlar' },
  { name: 'reduced-motion', value: '200ms, faqat opacity', use: '§8.9 — barcha harakat o‘chadi' },
];

const ICONS = [
  { n: 'phone', I: Phone },
  { n: 'send', I: Send },
  { n: 'message', I: MessageCircle },
  { n: 'search', I: Search },
  { n: 'arrow-up-right', I: ArrowUpRight },
  { n: 'arrow-down', I: ArrowDown },
  { n: 'box', I: Box },
  { n: 'package', I: Package },
  { n: 'factory', I: Factory },
  { n: 'flask', I: FlaskConical },
  { n: 'leaf', I: Leaf },
  { n: 'file-text', I: FileText },
  { n: 'sparkles', I: Sparkles },
  { n: 'star', I: Star },
  { n: 'play', I: Play },
  { n: 'rotate-cw', I: RotateCw },
  { n: 'check', I: Check },
];

const RULES = [
  'Bitta ekranda bitta aksent rang — mis. Gradient, soya va emoji yo‘q.',
  'Kategoriya uchun alohida rang yo‘q — farq faqat matn va fotoda.',
  'Foto-monogramma faqat navy fonda, hero va katta bloklarda; ekranda bittadan ko‘p emas.',
  'Mis monogramma — logo, footer, tasdiq ekranlari; minimal balandlik 32px.',
  'Ota-brend slogani ingliz tilida qoladi: Joy · Bliss · Delight (italic, och mis).',
  'Monogramma cho‘zilmaydi va qayta bo‘yalmaydi.',
  'Barcha sonlar ma’lumotdan hisoblanadi — hech qanday qo‘lda yozilgan raqam yo‘q.',
  'Har bir teginish maydoni ≥ 44px; fokus 2px ink, offset 3px.',
];

/* ---------------------------------------------------------------- */

export default function StyleguidePage() {
  if (process.env.NODE_ENV === 'production') notFound();

  return (
    <html lang="uz" dir="ltr" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute('data-motion-ready','')`,
          }}
        />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/urbanist-latin.woff2" crossOrigin="anonymous" />
      </head>

      <body className="bg-white text-ink antialiased">
        <main id="main" className="pb-24">
          {/* ============ 00 SARLAVHA ============ */}
          <Section gap={false} className="pt-2">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-8">
              <h1 className="m-0 text-page-title font-normal tracking-[-0.035em]">
                Dizayn tizimi
              </h1>
              <span className="flex flex-col gap-1 text-right text-[14px] text-muted">
                <span>GFF Uzbekistan · dev-only sahifa (§10)</span>
                <span>Manba: design/Styleguide.dc.html</span>
              </span>
            </div>
            <Note className="mt-4">
              Production build&apos;da bu sahifa 404 qaytaradi va indekslanmaydi. Maqsad — tokenlar,
              tipografiya, komponentlar va animatsiya parametrlarini dizayn fayli bilan yonma-yon
              solishtirish (§16, 1-bosqich).
            </Note>
          </Section>

          {/* ============ 01 RANGLAR ============ */}
          <Section gap={false} className="pt-2">
            <BlockHead n="01" title="Ranglar" />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
              {COLORS.map((c) => (
                <div key={c.name} className="card flex flex-col gap-3 p-0">
                  <span className="media-frame h-24 rounded-card" style={{ background: c.hex }} />
                  <span className="flex flex-col gap-1 px-5 pb-5">
                    <span className="text-[15px] font-semibold">{c.name}</span>
                    <span className="text-[13px] text-muted">{c.hex}</span>
                    <span className="text-[13px] leading-snug text-muted">{c.use}</span>
                  </span>
                </div>
              ))}
            </div>
            <Note>
              Kontrast: body (#4C4A5E) oq fonda 7.4:1 · muted (#615E72) oq fonda 5.6:1 · copper-dark (#94603E)
              panel fonda 4.8:1 — barchasi ≥ 4.5:1 (§14.4).
            </Note>
          </Section>

          {/* ============ 02 TIPOGRAFIYA ============ */}
          <Section gap={false}>
            <BlockHead n="02" title="Tipografiya — Urbanist" />
            <div className="card flex flex-col gap-6 p-[clamp(24px,3vw,40px)]">
              {TYPE.map((x) => (
                <div key={x.label} className="flex flex-wrap items-baseline gap-x-8 gap-y-2 border-b border-line-soft pb-5 last:border-0 last:pb-0">
                  <span className="flex-0 basis-[140px] text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
                    {x.label}
                  </span>
                  <span className={`${x.cls} min-w-0 flex-1 font-normal`}>Ta&apos;m va ifor — A sense of Joy</span>
                  <span className="basis-full text-[13px] text-muted md:basis-[240px]">{x.spec}</span>
                </div>
              ))}
            </div>
            <Note>
              Onest (kirill) faqat <span className="font-medium">/ru</span> da yuklanadi. Ikkala shrift ham
              self-hosted (<span className="font-medium">public/fonts</span>), <span className="font-medium">display: swap</span>.
              Raqamlar: Display 300, Section 400, H4 600, Body 400 (§6).
            </Note>
          </Section>

          {/* ============ 03 SHAKL / JOYLASHUV ============ */}
          <Section gap={false}>
            <BlockHead n="03" title="Shakl, joylashuv, breakpoint" />
            <div className="flex flex-wrap gap-3">
              <div className="card flex min-w-0 flex-1 basis-[320px] flex-col gap-3 p-[clamp(24px,3vw,32px)]">
                <span className="label">Radius</span>
                {RADII.map((r) => (
                  <span key={r.name} className="flex items-center justify-between gap-4 border-b border-line-soft pb-2.5 text-[15px] last:border-0">
                    <span className={`${r.cls} border border-line bg-panel px-4 py-2`}>{r.name}</span>
                    <span className="text-muted">{r.v}</span>
                  </span>
                ))}
              </div>

              <div className="card flex min-w-0 flex-1 basis-[320px] flex-col gap-3 p-[clamp(24px,3vw,32px)]">
                <span className="label">Konteyner va oraliq</span>
                <Row k="max-width" v="1408px" />
                <Row k="padding-inline" v="16px" />
                <Row k="blok orasi (gap)" v="12–16px" />
                <Row k="seksiya orasi" v="clamp(80px, 9vw, 128px)" />
                <Row k="breakpoint" v="390 · 768 · 1080 · 1440" />
                <Row k="header → burger" v="1080px" />
                <Row k="filter → bottom sheet" v="900px" />
                <Row k="sticky CTA" v="< 768px, 56px, safe-area" />
              </div>
            </div>
            <Note>
              Qatorlar <span className="font-medium">flex-wrap</span>, ustunlar
              <span className="font-medium"> flex: 1 1 &lt;basis&gt;px; min-width: 0</span> — hech qachon qattiq grid
              ustunlari emas (§9.1). Jadval o‘z konteynerida gorizontal scroll (<span className="font-medium">min-width: 820px</span>).
            </Note>
          </Section>

          {/* ============ 04 KOMPONENTLAR ============ */}
          <Section gap={false}>
            <BlockHead n="04" title="Komponentlar" />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] gap-3">
              {/* --- tugmalar --- */}
              <div className="card flex flex-col gap-5 p-[clamp(24px,3vw,32px)]">
                <span className="label">Tugmalar</span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button variant="accent" size="md">
                    Aksent (CTA)
                    <ArrowUpRight size={18} aria-hidden />
                  </Button>
                  <Button variant="primary" size="md">
                    Asosiy
                  </Button>
                  <Button variant="outline" size="md">
                    Kontur
                  </Button>
                  <Button variant="ghost" size="md">
                    Ghost
                  </Button>
                  <Button variant="accent" size="md" disabled>
                    O‘chirilgan
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button variant="accent" size="sm">
                    sm · 44
                  </Button>
                  <Button variant="accent" size="md">
                    md · 52
                  </Button>
                  <Button variant="accent" size="lg">
                    lg · 56
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="btn-icon btn-icon--navy btn-icon--44">
                    <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
                  </span>
                  <span className="btn-icon btn-icon--outline btn-icon--48">
                    <ArrowDown size={18} strokeWidth={1.8} aria-hidden />
                  </span>
                  <span className="btn-icon btn-icon--panel btn-icon--80">
                    <ArrowUpRight size={30} strokeWidth={1.6} aria-hidden />
                  </span>
                  <span className="btn-icon btn-icon--accent btn-icon--120">
                    <ArrowUpRight size={44} strokeWidth={1.8} aria-hidden />
                  </span>
                </div>
                <Note>
                  Balandlik 44 (header, jadval) · 52 · 56 (asosiy CTA) · 60 (mahsulot CTA). Hover: fon 8%
                  to‘qroq, strelka 45° buriladi. Bosilganda scale 0.98 (§4.9).
                </Note>
              </div>

              {/* --- pill / tab --- */}
              <div className="card flex flex-col gap-5 p-[clamp(24px,3vw,32px)]">
                <span className="label">Pill, teg, tab</span>
                <div className="flex flex-wrap gap-2">
                  <span className="pill pill--active">
                    Tab faol <span className="text-[13px] font-semibold text-copper-light">354</span>
                  </span>
                  <span className="pill">
                    Tab <span className="text-[13px] font-semibold text-muted">64</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill tone="outline">617 pozitsiya</Pill>
                  <Pill tone="white">Halal</Pill>
                  <Pill tone="soft">Issiqqa chidamli</Pill>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 text-[14px] text-body">
                    <span aria-hidden className="h-2 w-2 rounded-pill bg-ok" />
                    Omborda
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 text-[14px] text-body">
                    <span aria-hidden className="h-2 w-2 rounded-pill bg-copper-dark" />
                    Buyurtma bilan
                  </span>
                  <Pill tone="navy">1–3 kun</Pill>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <span className="rounded-pill border-[1.5px] border-ink px-7 py-4 text-[22px] [transform:rotate(-4deg)]">
                    Soha pill
                  </span>
                  <span className="rounded-pill bg-navy px-7 py-4 text-[22px] text-white">Faol soha</span>
                </div>
                <Note>
                  Soha pill&apos;lari −4°…+4° burilishi mumkin (faqat bosh sahifa va dizayn tizimida).
                  Kartochkalar ichida burilish yo‘q.
                </Note>
              </div>

              {/* --- forma --- */}
              <div className="flex flex-col gap-4 rounded-card bg-copper p-[clamp(24px,3vw,32px)]">
                <span className="label text-slate">Forma (mis fon)</span>
                <label className="flex flex-col gap-2 text-[14px] font-medium text-slate">
                  Input
                  <input type="text" placeholder="Placeholder" className="field-input" />
                </label>
                <label className="flex flex-col gap-2 text-[14px] font-medium text-slate">
                  Select
                  <select className="field-select">
                    <option>Toshkent</option>
                    <option>Samarqand</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-[14px] font-medium text-slate">
                  Xato holati
                  <input type="tel" defaultValue="+998 90" className="field-input field-input--error" />
                  <span className="text-[13px] text-[#6E1F1F]">Telefon raqamini to‘liq kiriting</span>
                </label>
                <label className="flex items-center gap-3 text-[14px] text-slate">
                  <input type="checkbox" defaultChecked className="field-check" />
                  Checkbox
                </label>
                <button type="button" className="btn btn--primary btn--lg w-full">
                  Yuborish
                </button>
              </div>

              {/* --- ikonkalar --- */}
              <div className="card flex flex-col gap-5 p-[clamp(24px,3vw,32px)]">
                <span className="label">Ikonkalar · 24px, stroke 1.8–2, round</span>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2.5">
                  {ICONS.map(({ n, I }) => (
                    <div key={n} className="flex flex-col items-center gap-2.5 rounded-tile border border-line-soft px-2 py-4">
                      <I size={24} strokeWidth={1.8} aria-hidden />
                      <span className="text-[12px] text-muted">{n}</span>
                    </div>
                  ))}
                </div>
                <Note>
                  Kodda: <span className="font-medium">lucide-react</span> (shu shakllarga mos). Emoji yo‘q (§3.5).
                </Note>
              </div>

              {/* --- monogramma --- */}
              <div className="card flex flex-col gap-5 p-[clamp(24px,3vw,32px)]">
                <span className="label">Monogramma</span>
                <div className="flex flex-wrap gap-3">
                  <div className="flex min-h-[200px] min-w-0 flex-1 basis-[200px] items-center justify-center rounded-media bg-navy p-6">
                    <MonogramCycle
                      variant="joy"
                      width={180}
                      copy={{
                        slogan: {
                          joy: 'A sense of Joy',
                          bliss: 'A sense of Bliss',
                          delight: 'A sense of Delight',
                        },
                        alt: {
                          joy: 'Mevali monogramma',
                          bliss: 'Sitrus monogrammasi',
                          delight: 'Qahva monogrammasi',
                        },
                      }}
                      className="w-full max-w-[180px]"
                    />
                  </div>
                  <div className="flex min-h-[200px] min-w-0 flex-1 basis-[200px] items-center justify-center rounded-media bg-panel p-6">
                    <MonogramStatic variant="bliss" alt="Sitrus monogrammasi" className="max-h-[120px] w-auto" />
                  </div>
                </div>
                <Note>
                  Foto-monogrammalar hozircha PNG (§15) — ota kompaniyadan SVG kelgach almashtiriladi.
                  Cho‘zish va qayta bo‘yash taqiqlangan (§17).
                </Note>
              </div>

              {/* --- fayl manbalari --- */}
              <div className="card flex flex-col gap-3 p-[clamp(24px,3vw,32px)]">
                <span className="label">Media manbalari</span>
                {Object.entries(MONOGRAM_SRC).map(([k, v]) => (
                  <Row key={k} k={k} v={v} />
                ))}
                <Row k="hero" v="/images/hero-vanilla.png" />
                <Row k="kategoriya" v="/images/cat-*.jpg" />
                <Row k="qadoq" v="/images/pack-1kg|5kg|10kg.jpg" />
              </div>
            </div>
          </Section>

          {/* ============ 05 ANIMATSIYA ============ */}
          <Section gap={false}>
            <BlockHead n="05" title="Animatsiya" />
            <div className="flex flex-wrap gap-3">
              <div className="card min-w-0 flex-1 basis-[420px] overflow-hidden p-0">
                {MOTION_ROWS.map((m) => (
                  <div
                    key={m.name}
                    className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-line-soft px-7 py-5 last:border-0"
                  >
                    <span className="flex-0 basis-[130px] text-[15px] font-semibold">{m.name}</span>
                    <span className="flex-0 basis-[200px] text-[15px] font-medium text-copper-dark">{m.value}</span>
                    <span className="min-w-0 flex-1 basis-[200px] text-[15px] leading-snug text-body">{m.use}</span>
                  </div>
                ))}
                <div className="flex flex-wrap gap-x-6 gap-y-1 bg-panel px-7 py-5">
                  <span className="flex-0 basis-[130px] text-[15px] font-semibold">ease.out (kod)</span>
                  <span className="flex-0 basis-[200px] text-[15px] font-medium text-copper-dark">
                    {ease.out.join(', ')}
                  </span>
                  <span className="min-w-0 flex-1 basis-[200px] text-[15px] text-body">
                    {dur.reveal}s · {dur.base}s · {dur.fast}s · stagger {stagger}
                  </span>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 basis-[420px] flex-col gap-6 rounded-card bg-navy p-[clamp(24px,3vw,32px)] text-white">
                <span className="label text-copper-light">Demo · reveal + stagger</span>

                <SplitLines
                  as="h3"
                  text={'Ta’m va ifor —\nbitta manba'}
                  className="m-0 text-[clamp(28px,3vw,44px)] font-normal leading-[1.02] tracking-[-0.03em]"
                />

                <div className="grid grid-cols-3 gap-2.5">
                  {['Reveal', 'Stagger 60ms', 'Faqat transform'].map((label, i) => (
                    <Reveal
                      key={label}
                      delay={i * stagger}
                      className="flex min-h-[92px] items-center justify-center rounded-media bg-[#171547] px-3 text-center text-[14px] text-copper-light"
                    >
                      {label}
                    </Reveal>
                  ))}
                </div>

                <Note className="text-[#CAC8DA]">
                  Sarlavha: satr maskadan pastdan chiqadi (700ms). Kartochkalar: 24px pastdan, 60ms oraliq
                  bilan. Faqat transform + opacity. Reveallar bir marta ishga tushadi; JS bo‘lmasa kontent
                  ko‘rinadigan qoladi (§8.7).
                </Note>
              </div>
            </div>
          </Section>

          {/* ============ 06 BREND QOIDALARI ============ */}
          <Section gap={false} className="pb-6">
            <BlockHead n="06" title="Brend qoidalari" />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-3">
              <div className="flex min-h-[280px] flex-col justify-between gap-5 rounded-card bg-navy p-8">
                {/* eslint-disable-next-line @next/next/no-img-element -- dizayn tizimi sahifasi */}
                <img src={MONOGRAM_SRC.joy} alt="Mevali monogramma" className="h-[150px] w-auto" />
                <span className="text-[16px] leading-relaxed text-white">
                  Foto-monogramma — faqat navy fonda, hero va katta bloklarda. Bitta ekranda bittadan ko‘p emas.
                </span>
              </div>

              <div className="flex min-h-[280px] flex-col justify-between gap-5 rounded-card bg-panel p-8">
                {/* eslint-disable-next-line @next/next/no-img-element -- dizayn tizimi sahifasi */}
                <img src={LOGO_COPPER} alt="GFF mis monogramma" className="h-[120px] w-auto" />
                <span className="text-[16px] leading-relaxed">
                  Mis monogramma — logo, footer, tasdiq ekranlari. Minimal balandlik 32px.
                </span>
              </div>

              <div className="flex min-h-[280px] flex-col justify-between gap-5 rounded-card bg-navy p-8">
                <span className="font-display text-[36px] italic text-copper-light">A sense of Joy</span>
                <span className="text-[16px] leading-relaxed text-white">
                  Ota-brend slogani ingliz tilida qoladi: Joy · Bliss · Delight. Italic, och mis, monogramma yonida.
                </span>
              </div>

              <div className="card flex min-h-[280px] flex-col gap-3 p-8">
                <span className="label">Taqiqlar (§17)</span>
                <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] leading-snug text-body">
                  {[
                    'Yangi rang, gradient, soya, emoji',
                    'Kategoriya uchun alohida rang',
                    'Har joyda "Best-seller"',
                    'Qo‘lda yozilgan matn yoki raqam',
                    'Klient tarafida sir (API kalit)',
                    'Lenis / GSAP',
                    'Monogrammani cho‘zish yoki bo‘yash',
                  ].map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-error" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card mt-3 flex flex-col gap-2 p-8">
              <span className="label">Umumiy qoidalar</span>
              <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] leading-snug text-body">
                {RULES.map((r) => (
                  <li key={r} className="flex gap-2.5">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ok" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        </main>
      </body>
    </html>
  );
}

/* ---------------- kichik yordamchilar ---------------- */

function BlockHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-line py-6 pb-8">
      <h2 className="m-0 text-section-title font-normal">{title}</h2>
      <span className="font-display text-[clamp(36px,4vw,64px)] font-light tracking-[-0.04em] text-muted/60">
        {n}.
      </span>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <span className="flex items-baseline justify-between gap-4 border-b border-line-soft pb-2.5 text-[15px] last:border-0">
      <span className="text-muted">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </span>
  );
}

function Note({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`mt-4 block text-[14px] leading-relaxed text-muted ${className ?? ''}`}>{children}</span>
  );
}
