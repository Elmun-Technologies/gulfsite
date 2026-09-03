/**
 * PROXY (Next.js 16 — eski middleware.ts o'rnini bosadi)
 * ----------------------------------------------------------------
 * Vazifalari:
 *   1. Tilsiz kelgan so'rovlarni /uz (yoki Accept-Language bo'yicha) ga yo'naltirish
 *   2. Noma'lum til prefiksini standart tilga tushirish
 *   3. Statik fayl va API yo'nalishlariga tegmaslik
 *   4. Admin panelga kirishni himoya qilish (cookie tekshiruvi)
 *
 * BU FAQAT YO'NALTIRISH — biznes mantiqi emas. Shuning uchun
 * bu yerda hech qanday ma'lumotlar bazasi yoki katalog chaqirilmaydi.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { LOCALES, DEFAULT_LOCALE, isLocale, localeFromAcceptLanguage } from '@/i18n';
import { AUTH_COOKIE, isAdminConfigured, verifySessionToken } from '@/lib/auth';

const PUBLIC_FILE_RE = /\.(?:ico|png|jpe?g|gif|webp|avif|svg|txt|xml|json|webmanifest|pdf|woff2?|ttf|otf|css|js|map|mp4|webp)$/i;

/** Bu yo'lni qayta ishlash kerakmi? */
function shouldHandle(pathname: string): boolean {
  if (pathname.startsWith('/api/')) return false;
  if (pathname.startsWith('/_next/')) return false;
  if (pathname.startsWith('/favicon')) return false;
  if (PUBLIC_FILE_RE.test(pathname)) return false;
  return true;
}

function detectLocale(req: NextRequest): (typeof LOCALES)[number] {
  // 1) Cookie — foydalanuvchi avval tanlagan bo'lsa
  const cookieLocale = req.cookies.get('gff_locale')?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  // 2) Accept-Language
  return localeFromAcceptLanguage(req.headers.get('accept-language'));
}

export function proxy(req: NextRequest): NextResponse {
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

export { DEFAULT_LOCALE };
