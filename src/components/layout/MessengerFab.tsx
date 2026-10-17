'use client';

/**
 * SUZUVCHI MESSENJER TUGMALARI — WhatsApp + Telegram (mijoz talabi, 2026-10-17)
 * ----------------------------------------------------------------
 * O'ng pastki burchakda ikkita dumaloq tugma: birinchi sotuv menejeriga
 * to'g'ridan-to'g'ri yozish. Mobilda pastki sticky panel (56px, §9)
 * ustida turadi, cookie banneri ostida qoladi (z-index).
 * Ranglar — dizayn tokenlari (navy fon, oq belgi; §17: brend yashili yo'q).
 */

import { WhatsAppIcon, TelegramIcon } from '@/components/ui/BrandIcons';
import { track } from '@/lib/analytics';
import { telegramHref, whatsappHref } from '@/lib/contacts';

export function MessengerFab({
  phone,
  whatsapp,
  telegram,
  labels,
}: {
  phone: string;
  whatsapp: boolean;
  telegram: boolean;
  labels: { whatsapp: string; telegram: string; waGreeting: string; group: string };
}) {
  if (!whatsapp && !telegram) return null;
  const cls =
    'flex h-12 w-12 items-center justify-center rounded-pill bg-navy text-white no-underline ' +
    'transition-transform duration-200 hover:scale-105 hover:text-copper-light focus-visible:scale-105';

  return (
    <div
      role="group"
      aria-label={labels.group}
      className="fixed right-4 z-[90] flex flex-col gap-2.5 max-tab:bottom-[calc(76px+env(safe-area-inset-bottom,0px))] tab:bottom-6"
    >
      {whatsapp ? (
        <a
          href={whatsappHref(phone, labels.waGreeting)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={labels.whatsapp}
          title={labels.whatsapp}
          onClick={() => track.whatsappClick('fab', phone)}
          className={cls}
        >
          <WhatsAppIcon size={22} />
        </a>
      ) : null}
      {telegram ? (
        <a
          href={telegramHref(phone)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={labels.telegram}
          title={labels.telegram}
          onClick={() => track.telegramClick('fab')}
          className={cls}
        >
          <TelegramIcon size={22} />
        </a>
      ) : null}
    </div>
  );
}
