import type { CSSProperties, ReactNode } from 'react';
import {
  MonogramCycle,
  MonogramStatic,
  type MonogramCopy,
  type MonogramVariant,
} from '@/components/motion';
import { IconButton } from '@/components/ui/Button';
import { CertPill } from '@/components/ui/Pill';
import { Reveal } from '@/components/motion';
import { cn } from '@/lib/utils';

/**
 * MONOGRAM PANEL (§5)
 * ----------------------------------------------------------------
 * Navy blok · markazda foto-monogramma · burchakda slogan ·
 * ixtiyoriy sertifikat pill'lari va doira strelka.
 *
 * Qoidalar (§17): monogrammani cho'zish, rangini o'zgartirish yoki
 * OQ FONDA foto-monogramma ishlatish TAQIQLANADI. Slogan barcha
 * tillarda inglizcha qoladi (§10).
 */

export interface MonogramPanelProps {
  variant?: MonogramVariant;
  /** 3 monogramma + slogan almashinadi (default: true) */
  cycle?: boolean;
  /** slogan + alt matnlar — `monogramCopy(t)` orqali lug'atdan (§10.4, §14) */
  copy: MonogramCopy;
  /** yuqori-o'ngdagi sertifikat pill'lari */
  certs?: string[];
  /** chap-pastdagi doira strelka */
  arrow?: { href: string; label: string; size?: 44 | 48 | 80 | 120 };
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  /** qo'shimcha kontent (slogan yonida) */
  children?: ReactNode;
  minHeight?: string;
}

export function MonogramPanel({
  variant = 'joy',
  cycle = true,
  copy,
  certs,
  arrow,
  className,
  style,
  priority = false,
  children,
  minHeight = 'clamp(408px, 47.2vw, 680px)',
}: MonogramPanelProps) {
  return (
    <div
      data-surface="navy"
      className={cn(
        'media-frame relative flex items-center justify-center overflow-hidden rounded-block bg-navy',
        'px-10 pb-32 pt-24',
        className,
      )}
      style={{ minHeight, ...style }}
    >
      {cycle ? (
        <MonogramCycle
          variant={variant}
          copy={copy}
          priority={priority}
          className="flex w-full flex-col items-center gap-6"
          imageClassName="w-full max-w-[min(78%,440px)]"
          sloganClassName="absolute bottom-10 right-8 text-[clamp(18px,1.7vw,24px)] font-normal italic text-copper-light"
        />
      ) : (
        <>
          <MonogramStatic
            variant={variant}
            alt={copy.alt[variant]}
            priority={priority}
            className="w-full max-w-[min(78%,440px)]"
          />
          <span className="absolute bottom-10 right-8 text-[clamp(18px,1.7vw,24px)] font-normal italic text-copper-light">
            {copy.slogan[variant]}
          </span>
        </>
      )}

      {certs?.length ? (
        <div className="absolute right-5 top-5 flex flex-wrap justify-end gap-2">
          {certs.map((c, i) => (
            <Reveal key={c} as="span" x={12} y={0} delay={0.1 + i * 0.06}>
              <CertPill label={c} className="border-transparent bg-white" />
            </Reveal>
          ))}
        </div>
      ) : null}

      {arrow ? (
        <IconButton
          href={arrow.href}
          label={arrow.label}
          size={arrow.size ?? 80}
          tone="white"
          arrow
          className="group absolute bottom-6 left-6"
        />
      ) : null}

      {children}
    </div>
  );
}
