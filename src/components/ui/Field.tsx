'use client';

import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from './Icon';

/* ============================================================
   MAYDON O'RAMLARI — label, xato, izoh, ixtiyoriy belgisi
   ============================================================ */

export interface FieldShellProps {
  label?: ReactNode;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optionalLabel?: string;
  children: ReactNode;
  className?: string;
  counter?: string;
}

export function FieldShell({
  label,
  htmlFor,
  error,
  hint,
  required,
  optionalLabel,
  children,
  className,
  counter,
}: FieldShellProps) {
  const describedBy = error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label ? (
        <label htmlFor={htmlFor} className="flex items-baseline gap-1.5 text-[13px] font-semibold text-pine-800">
          <span>
            {label}
            {required ? <span className="ml-0.5 text-clay-600">*</span> : null}
          </span>
          {!required && optionalLabel ? (
            <span className="text-[11px] font-medium text-slate-warm-500">({optionalLabel})</span>
          ) : null}
          {counter ? <span className="ml-auto font-mono text-[11px] text-slate-warm-500">{counter}</span> : null}
        </label>
      ) : null}

      {children}

      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="flex items-start gap-1 text-[12px] font-medium text-clay-600">
          <Icon name="alert" size={13} className="mt-px shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-[12px] leading-snug text-slate-warm-500" aria-describedby={describedBy}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/* ============================================================
   INPUT
   ============================================================ */

const CONTROL_BASE =
  'w-full rounded-xl border bg-white px-3.5 text-[14.5px] text-ink placeholder:text-slate-warm-500/70 ' +
  'transition-[border-color,box-shadow,background-color] duration-150 ' +
  'focus:outline-none focus:ring-4 focus:ring-teal-500/15 focus:border-teal-500 ' +
  'disabled:cursor-not-allowed disabled:bg-cream-100 disabled:text-slate-warm-500 ' +
  'aria-[invalid=true]:border-clay-500 aria-[invalid=true]:focus:ring-clay-500/15';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
  hint?: string;
  optionalLabel?: string;
  iconLeft?: IconName;
  iconRight?: IconName;
  suffix?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, required, optionalLabel, iconLeft, iconRight, suffix, className, containerClassName, id, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <FieldShell
      label={label}
      htmlFor={fieldId}
      error={error}
      hint={hint}
      required={required}
      optionalLabel={optionalLabel}
      className={containerClassName}
    >
      <div className="relative">
        {iconLeft ? (
          <Icon
            name={iconLeft}
            size={17}
            className={cn('pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-warm-500')}
          />
        ) : null}
        <input
          ref={ref}
          id={fieldId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          className={cn(
            CONTROL_BASE,
            'h-11 border-cream-300',
            iconLeft && 'pl-10',
            (iconRight || suffix) && 'pr-10',
            className,
          )}
          {...rest}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-slate-warm-500">
            {suffix}
          </span>
        ) : iconRight ? (
          <Icon name={iconRight} size={17} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-warm-500" />
        ) : null}
      </div>
    </FieldShell>
  );
});

/* ============================================================
   TEXTAREA
   ============================================================ */

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  error?: string;
  hint?: string;
  optionalLabel?: string;
  showCounter?: boolean;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, required, optionalLabel, showCounter, maxLength, value, className, containerClassName, id, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const len = typeof value === 'string' ? value.length : 0;

  return (
    <FieldShell
      label={label}
      htmlFor={fieldId}
      error={error}
      hint={hint}
      required={required}
      optionalLabel={optionalLabel}
      counter={showCounter && maxLength ? `${len}/${maxLength}` : undefined}
      className={containerClassName}
    >
      <textarea
        ref={ref}
        id={fieldId}
        required={required}
        maxLength={maxLength}
        value={value}
        rows={4}
        aria-invalid={error ? true : undefined}
        className={cn(CONTROL_BASE, 'min-h-[104px] resize-y border-cream-300 py-3 leading-relaxed', className)}
        {...rest}
      />
    </FieldShell>
  );
});

/* ============================================================
   SELECT
   ============================================================ */

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  error?: string;
  hint?: string;
  optionalLabel?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, required, optionalLabel, options, placeholder, className, containerClassName, id, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <FieldShell
      label={label}
      htmlFor={fieldId}
      error={error}
      hint={hint}
      required={required}
      optionalLabel={optionalLabel}
      className={containerClassName}
    >
      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          required={required}
          aria-invalid={error ? true : undefined}
          className={cn(CONTROL_BASE, 'h-11 appearance-none border-cream-300 pr-10', className)}
          {...rest}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-warm-600"
        />
      </div>
    </FieldShell>
  );
});

/* ============================================================
   CHECKBOX
   ============================================================ */

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  error?: string;
  description?: ReactNode;
  containerClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, error, description, className, containerClassName, id, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      <label htmlFor={fieldId} className="group flex cursor-pointer items-start gap-2.5 select-none">
        <span className="relative mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={fieldId}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            className={cn(
              `peer h-[18px] w-[18px] cursor-pointer appearance-none rounded-[5px] border border-cream-300 bg-white transition
               checked:border-teal-600 checked:bg-teal-600
               focus-visible:outline-2 focus-visible:outline-teal-500 focus-visible:outline-offset-2
               disabled:cursor-not-allowed disabled:opacity-40`,
              className,
            )}
            {...rest}
          />
          <Icon
            name="check"
            size={12}
            strokeWidth={3}
            className="pointer-events-none absolute text-white opacity-0 transition peer-checked:opacity-100"
          />
        </span>
        <span className="min-w-0 flex-1 text-[13.5px] leading-snug text-slate-warm-700 group-hover:text-pine-800">
          <span className={cn('block', error && 'text-clay-600')}>{label}</span>
          {description ? <span className="mt-0.5 block text-[12px] text-slate-warm-500">{description}</span> : null}
        </span>
      </label>
      {error ? (
        <p role="alert" className="flex items-center gap-1 pl-7 text-[12px] font-medium text-clay-600">
          <Icon name="alert" size={12} /> {error}
        </p>
      ) : null}
    </div>
  );
});

/* ============================================================
   RADIO GURUHI (chiplar ko'rinishida — mobil uchun qulay)
   ============================================================ */

export interface RadioChipGroupProps {
  name: string;
  legend?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string; hint?: string }[];
  columns?: 1 | 2 | 3;
  error?: string;
  required?: boolean;
}

export function RadioChipGroup({
  name,
  legend,
  value,
  onChange,
  options,
  columns = 2,
  error,
  required,
}: RadioChipGroupProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      {legend ? (
        <legend className="mb-1 text-[13px] font-semibold text-pine-800">
          {legend}
          {required ? <span className="ml-0.5 text-clay-600">*</span> : null}
        </legend>
      ) : null}
      <div
        className={cn(
          'grid gap-2',
          columns === 1 && 'grid-cols-1',
          columns === 2 && 'grid-cols-1 sm:grid-cols-2',
          columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label
              key={o.value}
              className={cn(
                'flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 transition select-none',
                checked
                  ? 'border-teal-500 bg-mint-100 shadow-[0_0_0_3px_rgba(20,160,140,0.12)]'
                  : 'border-cream-300 bg-white hover:border-teal-500/40 hover:bg-cream-50',
              )}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange?.(o.value)}
                className="sr-only"
              />
              <span
                className={cn(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition',
                  checked ? 'border-teal-600' : 'border-cream-300',
                )}
              >
                {checked ? <span className="h-2 w-2 rounded-full bg-teal-600" /> : null}
              </span>
              <span className="min-w-0">
                <span className="block text-[13.5px] font-medium text-pine-800">{o.label}</span>
                {o.hint ? <span className="block text-[11.5px] text-slate-warm-500">{o.hint}</span> : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p role="alert" className="flex items-center gap-1 text-[12px] font-medium text-clay-600">
          <Icon name="alert" size={12} /> {error}
        </p>
      ) : null}
    </fieldset>
  );
}

/* ============================================================
   SEGMENTED CONTROL
   ============================================================ */

export interface SegmentedProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; icon?: IconName }[];
  size?: 'sm' | 'md';
  ariaLabel: string;
  className?: string;
}

export function Segmented<T extends string>({ value, onChange, options, size = 'md', ariaLabel, className }: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('inline-flex items-center gap-1 rounded-xl border border-cream-200 bg-cream-100/70 p-1', className)}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg font-semibold transition',
              size === 'sm' ? 'h-7 px-2.5 text-[12px]' : 'h-9 px-3.5 text-[13px]',
              active
                ? 'bg-white text-pine-900 shadow-soft'
                : 'text-slate-warm-600 hover:text-pine-800',
            )}
          >
            {o.icon ? <Icon name={o.icon} size={size === 'sm' ? 13 : 15} /> : null}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export type { ComponentPropsWithoutRef };
