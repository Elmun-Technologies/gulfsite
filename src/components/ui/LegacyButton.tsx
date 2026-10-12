'use client';

import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from './Icon';

/* ============================================================
   TUGMA — bitta komponent, 4 variant, 3 o'lcham
   ============================================================ */

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-pine-800 text-cream-50 hover:bg-teal-600 active:bg-pine-900 shadow-soft hover:shadow-lift border border-transparent',
  secondary:
    'bg-teal-500 text-white hover:bg-teal-600 active:bg-pine-700 border border-transparent shadow-soft hover:shadow-lift',
  gold: 'bg-gold-500 text-pine-950 hover:bg-gold-400 active:bg-gold-600 border border-transparent shadow-soft hover:shadow-lift font-extrabold',
  outline:
    'bg-transparent text-pine-800 border border-pine-800/25 hover:border-teal-500 hover:bg-mint-100/60 active:bg-mint-100',
  ghost: 'bg-transparent text-pine-700 hover:bg-cream-100 active:bg-cream-200 border border-transparent',
  danger: 'bg-clay-600 text-white hover:bg-clay-500 border border-transparent',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px] gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-13 px-7 text-[15px] gap-2.5 rounded-xl py-3.5',
};

const BASE =
  'relative inline-flex items-center justify-center font-semibold tracking-tight whitespace-nowrap select-none ' +
  'transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out ' +
  'focus-visible:outline-2 focus-visible:outline-teal-500 focus-visible:outline-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-45 active:scale-[0.985]';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconRight?: IconName;
  iconEnd?: ReactNode;
  loading?: boolean;
  full?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  iconEnd,
  loading,
  full,
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
      className={cn(BASE, VARIANTS[variant], SIZES[size], full && 'w-full', className)}
      {...rest}
    >
      {loading ? <Spinner /> : icon ? <Icon name={icon} size={size === 'sm' ? 15 : 17} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={size === 'sm' ? 15 : 17} /> : null}
      {iconEnd}
    </button>
  );
}

export interface ButtonLinkProps extends Omit<ComponentPropsWithoutRef<typeof Link>, 'href'> {
  href: string;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconRight?: IconName;
  full?: boolean;
  external?: boolean;
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  full,
  external,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const cls = cn(BASE, VARIANTS[variant], SIZES[size], full && 'w-full', className);

  if (external || /^https?:|^tel:|^mailto:/.test(href)) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...(rest as ComponentPropsWithoutRef<'a'>)}
      >
        {icon ? <Icon name={icon} size={size === 'sm' ? 15 : 17} /> : null}
        {children}
        {iconRight ? <Icon name={iconRight} size={size === 'sm' ? 15 : 17} /> : null}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...rest}>
      {icon ? <Icon name={icon} size={size === 'sm' ? 15 : 17} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={size === 'sm' ? 15 : 17} /> : null}
    </Link>
  );
}

/* ============================================================
   SPINNER
   ============================================================ */

export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn('inline-block animate-spin-slow rounded-full border-2 border-current border-t-transparent', className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label="loading"
    />
  );
}

/* ============================================================
   KICHIK TUGMALAR — ikonka tugmalari
   ============================================================ */

export interface IconButtonProps extends ComponentPropsWithoutRef<'button'> {
  icon: IconName;
  label: string;
  size?: 'sm' | 'md';
  tone?: 'default' | 'danger';
}

export function IconButton({ icon, label, size = 'md', tone = 'default', className, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center rounded-lg border border-cream-200 bg-white text-pine-700 transition',
        'hover:border-teal-500/50 hover:bg-mint-100 hover:text-teal-600 active:scale-95',
        'focus-visible:outline-2 focus-visible:outline-teal-500 focus-visible:outline-offset-2',
        'disabled:pointer-events-none disabled:opacity-40',
        size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
        tone === 'danger' && 'hover:border-clay-500/50 hover:bg-clay-300/15 hover:text-clay-600',
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={size === 'sm' ? 15 : 18} />
    </button>
  );
}
