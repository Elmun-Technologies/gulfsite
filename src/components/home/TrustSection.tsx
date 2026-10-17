/**
 * "BIZGA ISHONISHADI" — yirik mijozlar logotiplari (server komponent)
 * ----------------------------------------------------------------
 * Logotiplar admin paneldagi "Kontent" bo'limidan boshqariladi
 * (`lib/content.ts`). Ro'yxat bo'sh bo'lsa bo'lim umuman chiqmaydi.
 * Logotiplar o'z ranglarida, oq plitkada (brend qoidalari buzilmaydi).
 */

import Image from 'next/image';
import type { Translator } from '@/i18n';
import { visibleClients } from '@/lib/content';
import { Reveal, RevealGroup } from '@/components/motion';
import { Section, SectionHeader, SectionInset } from '@/components/ui/SectionHeader';

export async function TrustSection({ t }: { t: Translator }) {
  const clients = await visibleClients();
  if (!clients.length) return null;

  return (
    <Section id="mijozlar">
      <SectionInset>
        <SectionHeader title={t('trust.title')} />
        <p className="m-0 max-w-[560px] pb-8 text-body-l text-muted">{t('trust.text')}</p>

        <RevealGroup className="grid grid-cols-[repeat(auto-fill,minmax(min(160px,45%),1fr))] gap-3">
          {clients.map((c, i) => {
            const tile = (
              <span className="relative block h-[clamp(64px,6vw,84px)] w-full">
                <Image
                  src={c.logo}
                  alt={c.name}
                  fill
                  sizes="(max-width: 768px) 45vw, 200px"
                  className="object-contain"
                  // yuklangan logotiplar /api/media orqali — optimizatorsiz beriladi
                  unoptimized={c.logo.includes('/api/media/')}
                />
              </span>
            );
            return (
              <Reveal
                key={c.id}
                index={i}
                className="flex items-center justify-center rounded-tile border border-line-soft bg-white px-5 py-6"
              >
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="block w-full">
                    {tile}
                  </a>
                ) : (
                  tile
                )}
              </Reveal>
            );
          })}
        </RevealGroup>
      </SectionInset>
    </Section>
  );
}
