'use client';

/**
 * XATO CHEGARASI (error boundary)
 * ----------------------------------------------------------------
 * Sahifada kutilmagan xato bo'lsa, foydalanuvchi oq ekranni ko'rmaydi:
 *   - xabar + "qayta urinish" tugmasi
 *   - muqobil aloqa kanallari (lead yo'qolmasligi uchun!)
 * Xato tafsilotlari faqat konsolga yoziladi (server log'lariga emas).
 */

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname() ?? '/uz';
  const locale = pathname.split('/')[1] ?? 'uz';

  useEffect(() => {
    // Server loglariga tushmaydi, lekin brauzer konsolida qoladi (tuzatish uchun)
    console.error('[page-error]', error?.message, error?.digest);
  }, [error]);

  const L = {
    uz: {
      title: 'Sahifa yuklanishida xatolik yuz berdi',
      text: 'Kutilmagan xato sababli bu bo‘lim ochilmadi. Iltimos, qayta urinib ko‘ring — yoki biz bilan bog‘laning, biz darhol yordam beramiz.',
      retry: 'Qayta urinish',
      call: 'Qo‘ng‘iroq qilish',
      home: 'Bosh sahifa',
      support: 'Texnik yordam',
    },
    ru: {
      title: 'Произошла ошибка при загрузке страницы',
      text: 'Этот раздел не открылся из-за непредвиденной ошибки. Пожалуйста, попробуйте ещё раз — или свяжитесь с нами, мы поможем немедленно.',
      retry: 'Повторить',
      call: 'Позвонить',
      home: 'Главная',
      support: 'Техподдержка',
    },
    en: {
      title: 'Something went wrong while loading this page',
      text: 'This section failed to render due to an unexpected error. Please try again — or contact us and we will help right away.',
      retry: 'Try again',
      call: 'Call us',
      home: 'Home',
      support: 'Support',
    },
  }[(locale === 'ru' || locale === 'en') ? locale : 'uz'];

  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-clay-300/50 bg-clay-100/40 p-7 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-clay-600 text-white">
          <Icon name="alert" size={26} />
        </span>
        <h1 className="mt-4 font-display text-[20px] font-extrabold tracking-tight text-pine-900">{L.title}</h1>
        <p className="mt-2.5 text-[14px] leading-relaxed text-slate-warm-700">{L.text}</p>

        {error?.digest ? (
          <p className="mt-3 font-mono text-[11px] text-slate-warm-500">
            {L.support}: {error.digest}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <Button variant="primary" size="md" icon="refresh" onClick={reset}>
            {L.retry}
          </Button>
          <Button variant="outline" size="md" icon="phone" onClick={() => (window.location.href = siteConfig.contact.phonePrimaryHref)}>
            {L.call}
          </Button>
          <Link
            href={`/${locale}`}
            className="inline-flex h-11 items-center gap-2 rounded-xl px-4 text-[13.5px] font-semibold text-slate-warm-700 transition hover:bg-cream-100 hover:text-pine-900"
          >
            <Icon name="house" size={16} />
            {L.home}
          </Link>
        </div>
      </div>
    </div>
  );
}
