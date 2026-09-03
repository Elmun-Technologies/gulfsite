'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useHydrated } from '@/lib/hooks';
import { Icon, type IconName } from './Icon';
import { Button, IconButton } from './Button';

/* ============================================================
   TOAST — bildirishnomalar tizimi
   ------------------------------------------------------------
   Butun ilova bo'ylab bitta provider. Form muvaffaqiyati/xatosi,
   nusxa olish, savat amallari — hammasi shu yerda.
   ============================================================ */

export type ToastTone = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastCtx {
  push: (t: Omit<ToastItem, 'id'>) => string;
  dismiss: (id: string) => void;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
}

const ToastContext = createContext<ToastCtx | null>(null);

const TONE_STYLES: Record<ToastTone, { bar: string; icon: IconName; iconCls: string }> = {
  success: { bar: 'bg-teal-500', icon: 'check', iconCls: 'bg-mint-100 text-teal-600' },
  error: { bar: 'bg-clay-600', icon: 'alert', iconCls: 'bg-clay-300/25 text-clay-600' },
  warning: { bar: 'bg-gold-500', icon: 'alert', iconCls: 'bg-gold-400/25 text-gold-600' },
  info: { bar: 'bg-pine-700', icon: 'info', iconCls: 'bg-cream-100 text-pine-700' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (t: Omit<ToastItem, 'id'>) => {
      const id = `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { ...t, id }]);
      const ms = t.duration ?? (t.tone === 'error' ? 7000 : 4500);
      timers.current.set(id, setTimeout(() => dismiss(id), ms));
      return id;
    },
    [dismiss],
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach(clearTimeout);
      map.clear();
    };
  }, []);

  const value = useMemo<ToastCtx>(
    () => ({
      push,
      dismiss,
      success: (title, description) => push({ tone: 'success', title, description }),
      error: (title, description) => push({ tone: 'error', title, description }),
      info: (title, description) => push({ tone: 'info', title, description }),
    }),
    [push, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastCtx {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Provider bo'lmasa ham ishlashi uchun xavfsiz fallback
    return {
      push: () => '',
      dismiss: () => {},
      success: () => '',
      error: () => '',
      info: () => '',
    };
  }
  return ctx;
}

function ToastViewport({ toasts, dismiss }: { toasts: ToastItem[]; dismiss: (id: string) => void }) {
  const mounted = useHydrated();
  if (!mounted || toasts.length === 0) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex flex-col items-center gap-2 p-3 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:items-end sm:p-0"
      role="region"
      aria-live="polite"
      aria-label="notifications"
    >
      {toasts.map((t) => {
        const style = TONE_STYLES[t.tone];
        return (
          <div
            key={t.id}
            className="animate-in-up pointer-events-auto flex w-full max-w-[24rem] items-start gap-3 overflow-hidden rounded-xl border border-cream-200 bg-white/97 shadow-float backdrop-blur-sm"
          >
            <span className={cn('w-1 self-stretch', style.bar)} aria-hidden />
            <span className={cn('mt-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', style.iconCls)}>
              <Icon name={style.icon} size={15} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1 py-3">
              <p className="text-[13.5px] font-bold text-pine-900">{t.title}</p>
              {t.description ? <p className="mt-0.5 text-[12.5px] leading-snug text-slate-warm-600">{t.description}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Yopish"
              className="mt-2.5 mr-2 rounded p-1 text-slate-warm-500 transition hover:bg-cream-100 hover:text-pine-800"
            >
              <Icon name="close" size={14} strokeWidth={2.2} />
            </button>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}

/* ============================================================
   MODAL — dialog oynasi
   ============================================================ */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const mounted = useHydrated();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
      if (e.key === 'Tab' && panelRef.current) {
        // Fokusni dialog ichida ushlab turish (a11y)
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('input,textarea,select,button')?.focus();
    }, 60);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-pine-950/55 backdrop-blur-[3px]"
        onClick={onClose}
        aria-hidden
        style={{ animation: 'fade-in .2s ease-out' }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'animate-in-up relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-float sm:rounded-2xl',
          size === 'sm' && 'sm:max-w-sm',
          size === 'md' && 'sm:max-w-lg',
          size === 'lg' && 'sm:max-w-2xl',
          size === 'xl' && 'sm:max-w-4xl',
        )}
      >
        <div className="flex items-start gap-3 border-b border-cream-200 px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="font-display text-[17px] leading-tight font-bold text-pine-900">
              {title}
            </h2>
            {description ? <p className="mt-1 text-[13px] text-slate-warm-600">{description}</p> : null}
          </div>
          <IconButton icon="close" label="Yopish" size="sm" onClick={onClose} className="shrink-0" />
        </div>
        {children ? <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div> : null}
        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-cream-200 bg-cream-50/60 px-5 py-3.5">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

/* ============================================================
   DRAWER — yon panel (mobil filtrlar, savat)
   ============================================================ */

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  side = 'left',
  width = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  side?: 'left' | 'right';
  width?: 'sm' | 'md' | 'lg';
}) {
  const mounted = useHydrated();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[95]" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}>
      <div className="absolute inset-0 bg-pine-950/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        className={cn(
          'absolute inset-y-0 flex flex-col bg-white shadow-float',
          side === 'left' ? 'left-0 animate-slide-in-left' : 'right-0 animate-slide-in-right',
          width === 'sm' && 'w-[min(20rem,88vw)]',
          width === 'md' && 'w-[min(24rem,92vw)]',
          width === 'lg' && 'w-[min(30rem,96vw)]',
        )}
      >
        <div className="flex items-center gap-3 border-b border-cream-200 px-4 py-3.5">
          <h2 className="flex-1 font-display text-[16px] font-bold text-pine-900">{title}</h2>
          <IconButton icon="close" label="Yopish" size="sm" onClick={onClose} />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">{children}</div>
        {footer ? (
          <div className="border-t border-cream-200 bg-cream-50/70 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

/* ============================================================
   CONFIRM — tasdiqlash oynasi
   ============================================================ */

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  tone = 'danger',
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  tone?: 'danger' | 'primary';
  loading?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} size="sm" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-[14px] leading-relaxed text-slate-warm-700">{message}</p>
    </Modal>
  );
}

/* ============================================================
   SCROLL PROGRESS — sahifa yuqorisidagi ingichka chiziq
   ============================================================ */

export function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        setPct(max > 0 ? (h.scrollTop / max) * 100 : 0);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (pct <= 0.5) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5" aria-hidden>
      <div className="h-full bg-teal-500 transition-[width] duration-100" style={{ width: `${pct}%` }} />
    </div>
  );
}
