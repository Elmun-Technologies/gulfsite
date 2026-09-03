'use client';

/**
 * TELEFON MAYDONI — O'zbekiston formati bilan
 * ----------------------------------------------------------------
 * - "+998" prefiksi oldindan qo'yiladi, foydalanuvchi faqat 9 ta raqam yozadi
 * - Real vaqtda maskalash: +998 90 123 45 67
 * - Xalqaro raqamlar ham qabul qilinadi (agar +998 dan boshqa kod yozilsa)
 * - `inputMode="tel"` → mobilda raqamli klaviatura ochiladi
 * - Avtomatik to'ldirish (autocomplete="tel") brauzerdan ma'lumotni oladi
 */

import { forwardRef, useEffect, useState } from 'react';
import { maskUzPhone, normalizeUzPhone } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { FieldShell } from '@/components/ui/Field';

interface Props {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  optionalLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  onBlur?: () => void;
  className?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, Props>(function PhoneInput(
  {
    id,
    label,
    value,
    onChange,
    error,
    hint,
    required,
    optionalLabel,
    placeholder = '+998 __ ___ __ __',
    disabled,
    autoComplete = 'tel',
    onBlur,
    className,
  },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState(value);

  // Tashqi qiymat o'zgarsa (masalan forma tozalandi) — sinxronlaymiz
  useEffect(() => {
    setRaw(value);
  }, [value]);

  const handle = (input: string) => {
    // Faqat raqamlar, "+", bo'shliq va defis
    const cleaned = input.replace(/[^\d+\-\s()]/g, '');
    const digits = cleaned.replace(/\D/g, '');

    let next: string;
    if (digits.startsWith('998')) {
      next = maskUzPhone(digits);
    } else if (digits.startsWith('8') && digits.length <= 10) {
      // Eski format "8 90 123 45 67" → +998 ga o'giramiz
      next = maskUzPhone(digits);
    } else if (cleaned.startsWith('+') && !digits.startsWith('998')) {
      // Xalqaro raqam — foydalanuvchi yozganini saqlaymiz
      next = cleaned.slice(0, 20);
    } else {
      next = maskUzPhone(digits);
    }

    setRaw(next);
    onChange(next);
  };

  const fieldId = id ?? 'phone';

  return (
    <FieldShell
      label={label}
      htmlFor={fieldId}
      error={error}
      hint={hint}
      required={required}
      optionalLabel={optionalLabel}
      className={className}
    >
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-[14px] text-slate-warm-600">
          <Icon name="phone" size={16} className="text-teal-600" />
        </span>
        <input
          ref={ref}
          id={fieldId}
          type="tel"
          inputMode="tel"
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          value={raw}
          aria-invalid={error ? true : undefined}
          onFocus={() => {
            setFocused(true);
            if (!raw) handle('+998');
          }}
          onBlur={() => {
            setFocused(false);
            // Bo'sh yoki yarim to'ldirilgan bo'lsa — tozalaymiz
            const n = normalizeUzPhone(raw);
            if (raw && !n && raw.replace(/\D/g, '').length < 4) {
              setRaw('');
              onChange('');
            }
            onBlur?.();
          }}
          onChange={(e) => handle(e.target.value)}
          className={cn(
            'h-11 w-full rounded-xl border bg-white pr-3.5 pl-10 font-mono text-[15px] tracking-wide text-ink transition',
            'placeholder:font-sans placeholder:text-[14px] placeholder:tracking-normal placeholder:text-slate-warm-500/70',
            'focus:outline-none focus:ring-4 focus:ring-teal-500/15',
            error ? 'border-clay-500 focus:border-clay-500 focus:ring-clay-500/15' : 'border-cream-300 focus:border-teal-500',
            focused && !error && 'shadow-[0_0_0_1px_rgba(20,160,140,0.25)]',
            disabled && 'cursor-not-allowed bg-cream-100 text-slate-warm-500',
          )}
        />
        {raw && !error ? (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
            <Icon name="check" size={14} strokeWidth={2.6} className="text-teal-500" />
          </span>
        ) : null}
      </div>
    </FieldShell>
  );
});

export default PhoneInput;
