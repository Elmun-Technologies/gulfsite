/**
 * Kontakt shaxslar komponenti uchun matnlar (server → klient: faqat stringlar, §4.1)
 */
import type { Translator } from '@/i18n';
import type { PeopleLabels } from '@/components/layout/PeopleContacts';

export function peopleLabels(t: Translator): PeopleLabels {
  return {
    director: t('contact.roleDirector'),
    sales: t('contact.roleSales'),
    call: t('contact.callUs'),
    whatsapp: t('contact.writeWhatsapp'),
    telegram: t('contact.writeTelegram'),
    waGreeting: t('contact.waGreeting'),
  };
}
