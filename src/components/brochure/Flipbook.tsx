'use client';

/**
 * FLIPBOOK — elektron katalog (kutubxonasiz)
 * ----------------------------------------------------------------
 * Desktop (≥768px): ochiq kitob. Har PDF sahifasi — bitta "varaq":
 *   · yoyilma (landshaft) → chap va o'ng yarmi;
 *   · muqova (birinchi portret) → faqat o'ng tomonda (yopiq kitob);
 *   · orqa muqova (oxirgi portret) → faqat chap tomonda.
 * Varaqlash — o'ng (yoki chap) yarmi umurtqa chizig'i atrofida 3D
 * aylanadi (faqat transform — §8), orqa tomonida keyingi sahifa.
 *
 * Mobil (<768px): yoyilma ikki yarimga bo'linadi va bittadan ko'rsatiladi
 * (kichik ekranda o'qiladigan o'lcham), surish (swipe) bilan.
 *
 * Rasmlar CSS fon sifatida (`background-size: 200%`) — bitta fayldan ikki
 * yarim olinadi; qo'shni sahifalar oldindan yuklanadi.
 */

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Download, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import { fillVars } from '@/i18n/translator';
import { track } from '@/lib/analytics';
import { ease } from '@/lib/motion';
import type { BrochurePage } from '@/lib/brochure';
import { cn } from '@/lib/utils';

export interface FlipbookLabels {
  prev: string;
  next: string;
  zoom: string;
  zoomOut: string;
  fullscreen: string;
  exitFullscreen: string;
  /** `{n}` / `{total}` — xom shablon (§4.1) */
  pageOfTpl: string;
  /** `{n}` — xom shablon */
  pageAltTpl: string;
  thumbs: string;
  toc: string;
  hint: string;
  download: string;
}

type Half = { src: string; side: 'left' | 'right' | 'full' } | null;

/** Varaqning chap va o'ng tomoni (desktop) */
function sides(pages: BrochurePage[], i: number): { left: Half; right: Half } {
  const p = pages[i];
  if (!p) return { left: null, right: null };
  if (p.spread) return { left: { src: p.src, side: 'left' }, right: { src: p.src, side: 'right' } };
  // portret: birinchi — o'ngda (muqova), qolganlari — chapda (orqa muqova)
  return i === 0 ? { left: null, right: { src: p.src, side: 'full' } } : { left: { src: p.src, side: 'full' }, right: null };
}

function HalfView({ half, alt, className }: { half: Half; alt?: string; className?: string }) {
  if (!half) return <div className={cn('h-full w-full', className)} aria-hidden />;
  return (
    <div
      role={alt ? 'img' : undefined}
      aria-label={alt}
      className={cn('h-full w-full bg-white bg-no-repeat', className)}
      style={{
        backgroundImage: `url(${half.src})`,
        backgroundSize: half.side === 'full' ? 'cover' : '200% 100%',
        backgroundPosition: half.side === 'right' ? 'right center' : half.side === 'left' ? 'left center' : 'center',
      }}
    />
  );
}

const subscribeNarrow = (cb: () => void) => {
  const mq = window.matchMedia('(max-width: 767px)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

const subscribeFullscreen = (cb: () => void) => {
  document.addEventListener('fullscreenchange', cb);
  return () => document.removeEventListener('fullscreenchange', cb);
};

export function Flipbook({
  pages,
  labels,
  pdf,
  lang,
  toc,
}: {
  pages: BrochurePage[];
  labels: FlipbookLabels;
  pdf: string;
  lang: string;
  toc?: { sheet: number; label: string }[];
}) {
  const reduce = useReducedMotion();
  const narrow = useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia('(max-width: 767px)').matches,
    () => false,
  );
  const wrapRef = useRef<HTMLDivElement>(null);
  const isFull = useSyncExternalStore(
    subscribeFullscreen,
    () => Boolean(document.fullscreenElement) && document.fullscreenElement === wrapRef.current,
    () => false,
  );

  const [page, setPage] = useState(0);
  /** mobil: yoyilmaning qaysi yarmi (0 — chap, 1 — o'ng) */
  const [half, setHalf] = useState<0 | 1>(0);
  const [flip, setFlip] = useState<{ to: number; dir: 1 | -1 } | null>(null);
  const [zoom, setZoom] = useState(false);
  const [mobileDir, setMobileDir] = useState<1 | -1>(1);

  const total = pages.length;
  const atStart = page === 0 && (!narrow || half === 0);
  const atEnd = page === total - 1 && (!narrow || !pages[page]?.spread || half === 1);

  const go = useCallback(
    (to: number, dir: 1 | -1) => {
      if (to < 0 || to >= total || flip) return;
      track.brochurePage(lang, to + 1);
      if (reduce) {
        setPage(to);
        return;
      }
      setFlip({ to, dir });
    },
    [flip, lang, reduce, total],
  );

  const next = useCallback(() => {
    setZoom(false);
    if (narrow) {
      setMobileDir(1);
      if (pages[page]?.spread && half === 0) setHalf(1);
      else if (page < total - 1) {
        setPage(page + 1);
        setHalf(0);
        track.brochurePage(lang, page + 2);
      }
      return;
    }
    go(page + 1, 1);
  }, [go, half, lang, narrow, page, pages, total]);

  const prev = useCallback(() => {
    setZoom(false);
    if (narrow) {
      setMobileDir(-1);
      if (pages[page]?.spread && half === 1) setHalf(0);
      else if (page > 0) {
        setPage(page - 1);
        setHalf(pages[page - 1]?.spread ? 1 : 0);
      }
      return;
    }
    go(page - 1, -1);
  }, [go, half, narrow, page, pages]);

  const jump = useCallback(
    (to: number) => {
      setZoom(false);
      if (to === page) return;
      if (narrow) {
        setMobileDir(to > page ? 1 : -1);
        setPage(to);
        setHalf(0);
        track.brochurePage(lang, to + 1);
        return;
      }
      go(to, to > page ? 1 : -1);
    },
    [go, lang, narrow, page],
  );

  /* klaviatura: ← → (sahifa shu komponentga bag'ishlangan) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && /input|textarea|select/i.test(el.tagName)) return;
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  /* qo'shni sahifalarni oldindan yuklash */
  useEffect(() => {
    for (const i of [page - 1, page + 1, page + 2]) {
      const p = pages[i];
      if (p) new window.Image().src = p.src;
    }
  }, [page, pages]);

  /* surish (swipe) */
  const startX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (!zoom) startX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
  };

  const toggleFull = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  };

  const current = pages[page];
  const pageLabel = fillVars(labels.pageOfTpl, { n: page + 1, total });
  const alt = fillVars(labels.pageAltTpl, { n: page + 1 });

  /* ---- desktop: varaq aylanishi ---- */
  const cur = sides(pages, page);
  const target = flip ? sides(pages, flip.to) : null;

  const btn =
    'inline-flex h-11 w-11 items-center justify-center rounded-pill border border-line bg-white text-ink transition-colors hover:border-ink disabled:opacity-30';

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={wrapRef}
        className={cn('relative flex flex-col gap-3', isFull && 'justify-center bg-navy p-4')}
      >
        {/* ================= SAHIFA ================= */}
        <div
          className={cn(
            'relative mx-auto w-full select-none',
            zoom ? 'overflow-auto rounded-media border border-line-soft' : '',
          )}
          style={
            zoom
              ? { maxHeight: isFull ? '86vh' : '78vh' }
              : narrow
                ? { aspectRatio: current?.spread ? `${current.width / 2} / ${current.height}` : `${current?.width} / ${current?.height}`, maxWidth: 560 }
                : {
                    aspectRatio: '2200 / 1241',
                    // kitob balandligi ekranga sig'sin (boshqaruv paneli va header uchun joy)
                    maxWidth: isFull ? 'calc(86vh * 1.773)' : 'min(100%, calc((100svh - 340px) * 1.773))',
                    perspective: 2600,
                  }
          }
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          aria-roledescription="flipbook"
          aria-label={pageLabel}
        >
          {zoom && current ? (
            <Image
              src={current.src}
              alt={alt}
              width={current.width}
              height={current.height}
              unoptimized
              className="h-auto max-w-none"
              style={{ width: current.spread ? 2200 : 1100 }}
            />
          ) : narrow ? (
            <AnimatePresence initial={false} custom={mobileDir} mode="popLayout">
              <motion.div
                key={`${page}-${half}`}
                custom={mobileDir}
                initial={reduce ? { opacity: 0 } : { x: `${mobileDir * 100}%`, opacity: 0.4 }}
                animate={{ x: 0, opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { x: `${-mobileDir * 100}%`, opacity: 0.4 }}
                transition={{ duration: 0.35, ease: ease.out }}
                className="absolute inset-0 overflow-hidden rounded-media shadow-none"
              >
                <HalfView
                  half={current ? { src: current.src, side: current.spread ? (half ? 'right' : 'left') : 'full' } : null}
                  alt={alt}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="absolute inset-0 flex" style={{ transformStyle: 'preserve-3d' }}>
              {/* asos: chap va o'ng yarim */}
              <div className="relative h-full w-1/2 overflow-hidden rounded-l-media">
                <HalfView half={flip && flip.dir === -1 ? target!.left : cur.left} alt={cur.left ? alt : undefined} />
              </div>
              <div className="relative h-full w-1/2 overflow-hidden rounded-r-media">
                <HalfView half={flip && flip.dir === 1 ? target!.right : cur.right} alt={!cur.left && cur.right ? alt : undefined} />
              </div>
              {/* umurtqa soyasi o'rniga ingichka chiziq (§17: soya yo'q) */}
              {cur.left && cur.right ? <span aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-line/70" /> : null}

              {/* aylanayotgan varaq */}
              {flip && target ? (
                <motion.div
                  key={`${page}-${flip.to}`}
                  className={cn('absolute top-0 h-full w-1/2', flip.dir === 1 ? 'left-1/2' : 'left-0')}
                  style={{ transformStyle: 'preserve-3d', transformOrigin: flip.dir === 1 ? 'left center' : 'right center' }}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: flip.dir === 1 ? -180 : 180 }}
                  transition={{ duration: 0.75, ease: [0.45, 0.05, 0.25, 1] }}
                  onAnimationComplete={() => {
                    setPage(flip.to);
                    setFlip(null);
                  }}
                >
                  <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                    <HalfView half={flip.dir === 1 ? cur.right : cur.left} />
                  </div>
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <HalfView half={flip.dir === 1 ? target.left : target.right} />
                  </div>
                </motion.div>
              ) : null}

              {/* chekka bosish zonalari */}
              <button type="button" aria-label={labels.prev} onClick={prev} disabled={atStart} className="absolute inset-y-0 left-0 w-[18%] cursor-w-resize disabled:cursor-default" />
              <button type="button" aria-label={labels.next} onClick={next} disabled={atEnd} className="absolute inset-y-0 right-0 w-[18%] cursor-e-resize disabled:cursor-default" />
            </div>
          )}
        </div>

        {/* ================= BOSHQARUV ================= */}
        <div className={cn('flex flex-wrap items-center justify-center gap-2', isFull && 'text-white')}>
          <button type="button" className={btn} onClick={prev} disabled={atStart || Boolean(flip)} aria-label={labels.prev}>
            <ChevronLeft size={20} strokeWidth={2} aria-hidden />
          </button>
          <span className="min-w-[72px] text-center text-[15px] tabular-nums" aria-live="polite">
            {pageLabel}
          </span>
          <button type="button" className={btn} onClick={next} disabled={atEnd || Boolean(flip)} aria-label={labels.next}>
            <ChevronRight size={20} strokeWidth={2} aria-hidden />
          </button>
          <span className="mx-1 h-6 w-px bg-line" aria-hidden />
          <button type="button" className={btn} onClick={() => setZoom((z) => !z)} aria-pressed={zoom} aria-label={zoom ? labels.zoomOut : labels.zoom} title={zoom ? labels.zoomOut : labels.zoom}>
            {zoom ? <ZoomOut size={18} strokeWidth={1.8} aria-hidden /> : <ZoomIn size={18} strokeWidth={1.8} aria-hidden />}
          </button>
          <button type="button" className={cn(btn, 'max-tab:hidden')} onClick={toggleFull} aria-label={isFull ? labels.exitFullscreen : labels.fullscreen} title={isFull ? labels.exitFullscreen : labels.fullscreen}>
            {isFull ? <Minimize2 size={18} strokeWidth={1.8} aria-hidden /> : <Maximize2 size={18} strokeWidth={1.8} aria-hidden />}
          </button>
          <a
            href={pdf}
            download
            onClick={() => track.brochureDownload(lang, 'flipbook')}
            className="btn btn--accent btn--sm ml-1"
          >
            <Download size={16} strokeWidth={2} aria-hidden />
            {labels.download}
          </a>
        </div>
        {!isFull ? <p className="m-0 text-center text-[13px] text-muted">{labels.hint}</p> : null}
      </div>

      {/* ================= ESKIZLAR ================= */}
      <nav aria-label={labels.thumbs} className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {pages.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => jump(i)}
            aria-label={fillVars(labels.pageAltTpl, { n: i + 1 })}
            aria-current={i === page ? 'page' : undefined}
            className={cn(
              'relative shrink-0 overflow-hidden rounded-[10px] border-2 transition-colors',
              i === page ? 'border-copper' : 'border-transparent hover:border-line',
            )}
            style={{ width: p.spread ? 128 : 64, height: 72 }}
          >
            <Image src={p.thumb} alt="" fill sizes="128px" unoptimized className="object-cover" />
          </button>
        ))}
      </nav>

      {/* ================= MUNDARIJA ================= */}
      {toc?.length ? (
        <div className="flex flex-col gap-3">
          <span className="label">{labels.toc}</span>
          <ol className="m-0 grid list-none gap-1.5 p-0 [grid-template-columns:repeat(auto-fill,minmax(min(280px,100%),1fr))]">
            {toc.map((item) => (
              <li key={item.sheet}>
                <button
                  type="button"
                  onClick={() => {
                    jump(item.sheet);
                    wrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={cn(
                    'flex w-full items-baseline gap-3 rounded-tile px-4 py-2.5 text-left text-[15px] transition-colors',
                    item.sheet === page ? 'bg-navy text-white' : 'bg-panel text-ink hover:bg-line-soft',
                  )}
                >
                  <span className="tabular-nums text-[13px] opacity-60">{String(item.sheet + 1).padStart(2, '0')}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
