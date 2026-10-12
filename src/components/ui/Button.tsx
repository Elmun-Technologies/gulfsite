import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * TUGMA (§4.4)
 * ----------------------------------------------------------------
 * Variantlar: accent (mis) · primary (navy) · outline · ghost ·
 *             inverse (oq) · onNavy (navy fon ustida kontur)
 * Balandlik:  sm 44 · md 52 · lg 56 · xl 60
 * Holatlar:  hover — fon 8% to'qroq + strelka 45° buriladi
 *            active — scale(0.98)
 *            disabled — --line-soft fon, #8A8796 matn
 *            loading — matn o'rnida spinner, KENGLIK SAQLANADI
 *
 * Barcha vizual holatlar globals.css `@layer components` da —
 * bu fayl faqat klasslarni yig'adi.
 */

export type ButtonVariant = 'accent' | 'primary' | 'outline' | 'ghost' | 'inverse' | 'onNavy';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  accent: 'btn--accent',
  primary: 'btn--primary',
  outline: 'btn--outline',
  ghost: 'btn--ghost',
  inverse: 'btn--inverse',
  onNavy: 'btn--on-navy',
};

export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'lg',
  block = false,
  className?: string,
): string {
  return cn('btn', VARIANT_CLASS[variant], `btn--${size}`, block && 'btn--block', className);
}

/** Strelka — hover'da 45° burilib ArrowRight holatiga keladi */
export function ButtonArrow({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <span className={cn('btn__arrow', className)} aria-hidden>
      <ArrowUpRight size={size} strokeWidth={2} />
    </span>
  );
}

export function Spinner({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <span className={cn('btn__spinner', className)} role="status" aria-live="polite">
      <span className="sr-only">…</span>
      <span
        className="inline-block animate-spin-slow rounded-full border-2 border-current border-t-transparent"
        style={{ width: size, height: size }}
        aria-hidden
      />
    </span>
  );
}

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** o'ngda ArrowUpRight (hover'da 45° buriladi) */
  arrow?: boolean;
  /** chapda ixtiyoriy ikonka */
  icon?: ReactNode;
  /** yuborilmoqda — spinner ko'rinadi, kenglik saqlanadi */
  loading?: boolean;
  block?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'lg',
  arrow = false,
  icon,
  loading = false,
  block = false,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-loading={loading ? 'true' : undefined}
      className={buttonClass(variant, size, block, className)}
      {...rest}
    >
      {icon}
      {children}
      {arrow ? <ButtonArrow size={size === 'sm' ? 16 : 18} /> : null}
      {loading ? <Spinner /> : null}
    </button>
  );
}

export interface ButtonLinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  arrow?: boolean;
  icon?: ReactNode;
  block?: boolean;
  /** tashqi havola — yangi oynada, rel="noopener noreferrer" */
  external?: boolean;
}

const EXTERNAL_RE = /^(https?:|tel:|mailto:)/;

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'lg',
  arrow = false,
  icon,
  block = false,
  external,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const cls = buttonClass(variant, size, block, className);
  const inner = (
    <>
      {icon}
      {children}
      {arrow ? <ButtonArrow size={size === 'sm' ? 16 : 18} /> : null}
    </>
  );

  const isExternal = external || EXTERNAL_RE.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
}

/* ------------------------------------------------------------
   Doira ikonka-tugma — 44 / 48 / 80 / 120 (§4.4)
   ------------------------------------------------------------ */

export type IconTone = 'navy' | 'outline' | 'panel' | 'accent' | 'white' | 'ink';

const TONE_CLASS: Record<IconTone, string> = {
  navy: '',
  outline: 'btn-icon--outline',
  panel: 'btn-icon--panel',
  accent: 'btn-icon--accent',
  white: 'btn-icon--white',
  ink: 'btn-icon--panel',
};

export type IconSize = 44 | 48 | 80 | 120;

const ICON_PX: Record<IconSize, number> = { 44: 16, 48: 18, 80: 30, 120: 44 };
const ICON_STROKE: Record<IconSize, number> = { 44: 2, 48: 1.8, 80: 1.6, 120: 1.8 };

export interface IconButtonProps extends ComponentPropsWithoutRef<'button'> {
  label: string;
  size?: IconSize;
  tone?: IconTone;
  /** ArrowUpRight strelkasi (hover'da −45° → 0°) */
  arrow?: boolean;
  href?: string;
  external?: boolean;
}

export function IconButton({
  label,
  size = 48,
  tone = 'navy',
  arrow = false,
  href,
  external,
  className,
  children,
  ...rest
}: IconButtonProps) {
  const cls = cn('btn-icon', `btn-icon--${size}`, TONE_CLASS[tone], className);
  const inner = arrow ? (
    <span className="btn-icon__arrow" aria-hidden>
      <ArrowUpRight size={ICON_PX[size]} strokeWidth={ICON_STROKE[size]} />
    </span>
  ) : (
    children
  );

  if (href) {
    if (external || EXTERNAL_RE.test(href)) {
      return (
        <a
          href={href}
          aria-label={label}
          className={cls}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} aria-label={label} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} title={label} className={cls} {...rest}>
      {inner}
    </button>
  );
}
