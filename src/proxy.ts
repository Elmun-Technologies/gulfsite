/**
 * PROXY (Next.js 16 — eski middleware.ts o'rnini bosadi)
 * ----------------------------------------------------------------
 * Vazifalari:
 *   1. Tilsiz kelgan so'rovlarni /uz (yoki Accept-Language bo'yicha) ga yo'naltirish
 *   2. Noma'lum til prefiksini standart tilga tushirish
 *   3. Statik fayl va API yo'nalishlariga tegmaslik
 *   4. Admin panelga kirishni himoya qilish (cookie tekshiruvi)
 *
 *   5. Noma'lum mahsulot / guruh manzili → HAQIQIY 404 (brend ko'rinishi bilan)
 *
 * 5-band nega shu yerda: mahsulot sahifasi `dynamicParams = true` (admin
 * qo'shgan mahsulot build'siz ochilishi uchun). Sahifa ichidagi `notFound()`
 * bu loyihada brend 404 ni chizmaydi (javob 404, lekin `__next_error__`
 * qobig'i — sayt header/footer'isiz). Next hujjati haqiqiy 404 tekshiruvini
 * proxy'da qilishni tavsiya qiladi: noma'lum slug mavjud bo'lmagan yo'lga
 * rewrite qilinadi → router darajasidagi ildiz `not-found.tsx` (to'liq qobiq).
 * Katalog `ensureCatalogTtl()` bilan 60 soniyada bir yangilanadi.
 */

import { NextResponse, type NextRequest } from 'next/server';
// `@/i18n/meta` — lug'atsiz: `@/i18n` 3 tildagi lug'atni proxy'ning har
// sovuq ishga tushishiga yuklardi (proxy HAR sahifa so'rovida ishlaydi)
import { LOCALES, isLocale, localeFromAcceptLanguage } from '@/i18n/meta';
import { AUTH_COOKIE, isAdminConfigured, verifySessionToken } from '@/lib/auth';

const PRODUCT_RE = /^\/(uz|ru|en)\/(?:catalog|product|tg\/p)\/([^/]+)\/?$/;
const GROUP_RE = /^\/(uz|ru|en)\/category\/([^/]+)\/([^/]+)\/?$/;
const CATEGORY_RE = /^\/(uz|ru|en)\/category\/([^/]+)\/?$/;
const INDUSTRY_RE = /^\/(uz|ru|en)\/industries\/([^/]+)\/?$/;

/** Mahsulot/guruh manzili mavjudmi (null — bu tekshiruv tegishli emas) */
async function catalogPathMissing(pathname: string): Promise<string | null> {
  const p = PRODUCT_RE.exec(pathname);
  const g = GROUP_RE.exec(pathname);
  const c = CATEGORY_RE.exec(pathname);
  const ind = INDUSTRY_RE.exec(pathname);
  if (!p && !g && !c && !ind) return null;
  // Katalog modullari (617 mahsulot JSON + soha matnlari) faqat shu yo'llarda
  // yuklanadi — boshqa sahifalar uchun proxy yengil qoladi
  const [{ ensureCatalogTtl }, { getProductBySlug, applicationCounts }, { categoryIdsWithData, groupsFor }, { industryIds }] =
    await Promise.all([
      import('@/lib/catalog-live'),
      import('@/lib/catalog'),
      import('@/lib/category-pages'),
      import('@/lib/industry-copy'),
    ]);
  try {
    await ensureCatalogTtl();
  } catch {
    return null; // katalog o'qilmasa — sahifa o'zi hal qiladi
  }
  if (p) return getProductBySlug(decodeURIComponent(p[2])) ? null : p[1];
  if (g) {
    const [, locale, category, group] = g;
    const ok = categoryIdsWithData().includes(category) && groupsFor(category, 'uz').some((x) => x.id === group);
    return ok ? null : locale;
  }
  if (c) return categoryIdsWithData().includes(c[2]) ? null : c[1];
  // soha: matni bor VA kamida bitta mahsuloti bor
  const [, locale, slug] = ind!;
  return industryIds().includes(slug) && (applicationCounts()[slug] ?? 0) > 0 ? null : locale;
}

const PUBLIC_FILE_RE = /\.(?:ico|png|jpe?g|gif|webp|avif|svg|txt|xml|json|webmanifest|pdf|woff2?|ttf|otf|css|js|map|mp4|webp)$/i;

/** Bu yo'lni qayta ishlash kerakmi? */
function shouldHandle(pathname: string): boolean {
  if (pathname.startsWith('/api/')) return false;
  if (pathname.startsWith('/_next/')) return false;
  if (pathname.startsWith('/favicon')) return false;
  if (PUBLIC_FILE_RE.test(pathname)) return false;
  /* Dizayn tizimi sahifasi (§10, §16 1-bosqich) — TEXNIK, til qobig'i
     kerak emas, shuning uchun til prefiksiga yo'naltirilmaydi. Sahifaning
     o'zi production build'da `notFound()` qaytaradi va `noindex`,
     ya'ni bu imtiyoz tashqi foydalanuvchiga hech narsa ochmaydi. */
  if (pathname === '/styleguide' || pathname.startsWith('/styleguide/')) return false;
  return true;
}

function detectLocale(req: NextRequest): (typeof LOCALES)[number] {
  // 1) Cookie — foydalanuvchi avval tanlagan bo'lsa
  const cookieLocale = req.cookies.get('gff_locale')?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  // 2) Accept-Language
  return localeFromAcceptLanguage(req.headers.get('accept-language'));
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const { pathname, search } = req.nextUrl;

  /* ---------- Katta harfli prefiks/segment → kanonik kichik harf (301) ----------
     Next.js yo'nalishlari registrga sezgir: "/UZ/ADMIN" yoki "/uz/Admin" 404 beradi.
     E-mail/vizitka havolalari uchun kanonik shaklga DOIMIY redirect qilamiz.
     FAQAT til va `admin` segmenti kichik harfga o'tkaziladi — `admin`dan
     keyingi qism (masalan lead ID `ld_Xy9...`) TEGILMAYDI, chunki u
     registrga sezgir bo'lishi mumkin. */
  const caseMatch = pathname.match(/^\/([a-z]{2})(?:\/(admin)(\/.*)?)?$/i);
  if (caseMatch) {
    const loc = caseMatch[1];
    const admin = caseMatch[2]; // 'admin' | 'ADMIN' | undefined
    const sub = caseMatch[3] ?? ''; // admin'dan keyingi yo'l — ASL holatda qoladi
    const canonical = `/${loc.toLowerCase()}${admin ? `/${admin.toLowerCase()}${sub}` : ''}`;
    if (canonical !== pathname) {
      const url = req.nextUrl.clone();
      url.pathname = canonical;
      url.search = search;
      const res = NextResponse.redirect(url, 301);
      const locLower = loc.toLowerCase();
      if (isLocale(locLower)) {
        res.cookies.set('gff_locale', locLower, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
      }
      return res;
    }
  }

  /* ---------- Admin himoyasi ---------- */
  const adminPathMatch = pathname.match(/^\/([a-z]{2})\/admin(\/.*)?$/);

  /* Backend (fly) tomoni: FRONTEND_URL sozlangan bo'lsa, ommaviy sahifalar
     fly domenida takrorlanmasin (SEO dublikat) — saytga 308. Admin va API qoladi. */
  const frontend = (process.env.FRONTEND_URL ?? '').trim().replace(/\/+$/, '');
  if (frontend && !adminPathMatch && shouldHandle(pathname)) {
    try {
      if (new URL(frontend).host !== req.nextUrl.host) {
        return NextResponse.redirect(`${frontend}${pathname}${search}`, 308);
      }
    } catch {
      /* noto'g'ri FRONTEND_URL */
    }
  }

  /* Sayt Vercel'da, backend fly'da (BACKEND_URL): admin panel ma'lumotlar
     turgan serverda ishlaydi — u yerga yo'naltiramiz (Vercel diski o'qish uchun). */
  const backend = (process.env.BACKEND_URL ?? '').trim().replace(/\/+$/, '');
  if (adminPathMatch && backend) {
    try {
      if (new URL(backend).host !== req.nextUrl.host) {
        return NextResponse.redirect(`${backend}${pathname}${search}`, 307);
      }
    } catch {
      /* noto'g'ri BACKEND_URL — mahalliy panel */
    }
  }

  if (adminPathMatch) {
    const locale = adminPathMatch[1];
    const isLoginPage = pathname.endsWith('/admin/login');
    const token = req.cookies.get(AUTH_COOKIE.name)?.value;
    const authed = isAdminConfigured() && verifySessionToken(token);

    if (!authed && !isLoginPage) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/admin/login`;
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }
    if (authed && isLoginPage) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/admin`;
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  if (!shouldHandle(pathname)) return NextResponse.next();

  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  /* ---------- Katta harfli til prefiksi: /UZ → /uz (301) ----------
     E-mail/vizitkalardan keladigan "/UZ", "/Ru" kabi havolalar uchun.
     Kanonik holat — kichik harf, shuning uchun DOIMIY (301) redirect:
     qidiruv tizimlari ham bitta kanonik URL'ni indekslaydi. */
  if (first && !isLocale(first)) {
    const lower = first.toLowerCase();
    if (isLocale(lower)) {
      const url = req.nextUrl.clone();
      url.pathname = `/${lower}${pathname.slice(first.length + 1)}`;
      url.search = search;
      const res = NextResponse.redirect(url, 301);
      res.cookies.set('gff_locale', lower, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
      return res;
    }
  }

  /* ---------- Til prefiksi allaqachon bor ---------- */
  if (first && isLocale(first)) {
    const missingIn = await catalogPathMissing(pathname);
    if (missingIn) {
      // mavjud bo'lmagan yo'lga rewrite → router 404 + ildiz not-found (to'liq brend qobig'i)
      return NextResponse.rewrite(new URL(`/${missingIn}/__gff-not-found`, req.url));
    }
    const response = NextResponse.next();
    // Til cookie'sini yangilaymiz (keyingi tashrifda avtomatik tanlanadi)
    if (req.cookies.get('gff_locale')?.value !== first) {
      response.cookies.set('gff_locale', first, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
      });
    }
    return response;
  }

  /* ---------- Til yo'q → yo'naltiramiz ---------- */
  const locale = detectLocale(req);
  const url = req.nextUrl.clone();

  // Ildiz "/" → "/uz" (yoki aniqlangan til)
  if (pathname === '/' || pathname === '') {
    url.pathname = `/${locale}`;
    url.search = search;
    const res = NextResponse.redirect(url, 307);
    res.cookies.set('gff_locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
    return res;
  }

  // "/catalog" → "/uz/catalog" (qulay qisqa havolalar)
  url.pathname = `/${locale}${pathname}`;
  url.search = search;
  const res = NextResponse.redirect(url, 308);
  res.cookies.set('gff_locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
  return res;
}

export const config = {
  matcher: [
    /*
     * Barcha yo'llar, bundan mustasno:
     *  - _next statik va build artefaktlari
     *  - fayl kengaytmalari (rasm, shrift, hujjat)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf|txt|xml|json|woff2?|css|js|map)$).*)',
  ],
};

/* `export { … }` bu yerda ISHLATILMAYDI: Next.js proxy faylidagi
   qayta eksportlarni statik tahlil qila olmaydi va build
   "Invalid segment configuration export" bilan to'xtaydi.
   `DEFAULT_LOCALE` kerak bo'lsa — to'g'ridan-to'g'ri `@/i18n` dan olinadi. */
