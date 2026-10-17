'use client';

/**
 * ADMIN GRAFIKLARI — kutubxonasiz SVG/HTML (bundle'ga qo'shimcha og'irlik yo'q)
 * ----------------------------------------------------------------
 * Barchasi BITTA rang (teal) — har bir grafik bitta o'lchovni ko'rsatadi
 * (ikki o'qli grafik yo'q). Hover: chiziqda crosshair + tooltip, ustun va
 * qatorlarda — har bir element uchun tooltip. Har grafik yonida jadval
 * ko'rinishi (sr-only yoki ko'rinadigan qiymatlar) — rang yagona belgi emas.
 */

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const W = 720;
const H = 220;
const PAD = { l: 40, r: 12, t: 12, b: 26 };

function niceMax(v: number): number {
  if (v <= 4) return 4;
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

export function TrendChart({
  points,
  label,
}: {
  /** `x` — tayyor yorliq (server formatlaydi: funksiya RSC chegarasidan o'tmaydi, §4.1) */
  points: { x: string; y: number }[];
  label: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const ref = useRef<SVGSVGElement>(null);
  const fx = (x: string) => x;

  const { max, coords, ticks } = useMemo(() => {
    const m = niceMax(Math.max(0, ...points.map((p) => p.y)));
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const step = points.length > 1 ? iw / (points.length - 1) : 0;
    return {
      max: m,
      coords: points.map((p, i) => ({
        x: PAD.l + (points.length > 1 ? i * step : iw / 2),
        y: PAD.t + ih - (p.y / m) * ih,
      })),
      ticks: [0, m / 2, m],
    };
  }, [points]);

  if (!points.length) return null;
  const line = coords.map((c, i) => `${i ? 'L' : 'M'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const area = `${line} L${coords[coords.length - 1].x},${H - PAD.b} L${coords[0].x},${H - PAD.b} Z`;
  const labelEvery = Math.ceil(points.length / 8);

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const svg = ref.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0;
    for (let i = 1; i < coords.length; i++) {
      if (Math.abs(coords[i].x - x) < Math.abs(coords[best].x - x)) best = i;
    }
    setHover(best);
  }

  const h = hover != null ? coords[hover] : null;

  return (
    <div className="relative">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-none select-none"
        role="img"
        aria-label={label}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {ticks.map((t) => {
          const y = PAD.t + (H - PAD.t - PAD.b) * (1 - t / max);
          return (
            <g key={t}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} className="stroke-cream-200" strokeWidth={1} />
              <text x={PAD.l - 8} y={y + 4} textAnchor="end" className="fill-slate-warm-500 text-[11px] tabular-nums">
                {Math.round(t)}
              </text>
            </g>
          );
        })}
        {points.map((p, i) =>
          i % labelEvery === 0 || i === points.length - 1 ? (
            <text key={p.x} x={coords[i].x} y={H - 8} textAnchor="middle" className="fill-slate-warm-500 text-[11px]">
              {fx(p.x)}
            </text>
          ) : null,
        )}
        <path d={area} className="fill-teal-600/10" />
        <path d={line} fill="none" className="stroke-teal-600" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {h ? (
          <>
            <line x1={h.x} x2={h.x} y1={PAD.t} y2={H - PAD.b} className="stroke-pine-800/30" strokeWidth={1} />
            <circle cx={h.x} cy={h.y} r={5} className="fill-teal-600 stroke-white" strokeWidth={2} />
          </>
        ) : null}
      </svg>
      {h && hover != null ? (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg bg-pine-950 px-2.5 py-1.5 text-[12px] text-white shadow-soft"
          style={{ left: `${(h.x / W) * 100}%` }}
        >
          <span className="block text-white/60">{fx(points[hover].x)}</span>
          <span className="font-bold tabular-nums">
            {points[hover].y} · {label}
          </span>
        </div>
      ) : null}
      {/* jadval ko'rinishi — ekran o'quvchilar uchun */}
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>
          {points.map((p) => (
            <tr key={p.x}>
              <th>{p.x}</th>
              <td>{p.y}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Vertikal ustunlar (soatlar, hafta kunlari) — hover'da qiymat */
export function ColumnBars({ values, labels, unit }: { values: number[]; labels: string[]; unit: string }) {
  const max = Math.max(1, ...values);
  return (
    <div className="flex h-36 items-end gap-[2px]" role="list">
      {values.map((v, i) => (
        <div key={labels[i]} role="listitem" className="group relative flex h-full flex-1 flex-col justify-end">
          <div
            className="rounded-t-[4px] bg-teal-600 transition-colors group-hover:bg-pine-800"
            style={{ height: `${Math.max(v ? 3 : 0, (v / max) * 100)}%` }}
          />
          <span className="mt-1 text-center text-[10px] text-slate-warm-500">{labels[i]}</span>
          <span className="pointer-events-none absolute -top-7 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-pine-950 px-2 py-1 text-[11px] font-bold text-white group-hover:block">
            {labels[i]}: {v} {unit}
          </span>
          <span className="sr-only">
            {labels[i]}: {v} {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

export interface BarRow {
  key: string;
  label: string;
  value: number;
  href?: string;
  sub?: string;
}

/** Gorizontal qatorlar ro'yxati — sahifalar, manbalar, qurilmalar, hodisalar */
export function BarList({
  rows,
  empty,
  total,
  limit = 10,
  showShare = false,
}: {
  rows: BarRow[];
  empty: string;
  total?: number;
  limit?: number;
  showShare?: boolean;
}) {
  if (!rows.length) return <p className="py-6 text-center text-[13px] text-slate-warm-500">{empty}</p>;
  const max = Math.max(1, ...rows.map((r) => r.value));
  const sum = total ?? rows.reduce((n, r) => n + r.value, 0);
  return (
    <ul className="flex flex-col gap-1.5">
      {rows.slice(0, limit).map((r) => {
        const inner = (
          <>
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 rounded-md bg-teal-600/12"
              style={{ width: `${(r.value / max) * 100}%` }}
            />
            <span className="relative min-w-0 flex-1 truncate">
              {r.label}
              {r.sub ? <span className="ml-1.5 text-slate-warm-500">{r.sub}</span> : null}
            </span>
            <span className="relative shrink-0 font-bold tabular-nums text-pine-900">
              {r.value}
              {showShare && sum ? (
                <span className="ml-1.5 font-normal text-slate-warm-500">{Math.round((r.value / sum) * 100)}%</span>
              ) : null}
            </span>
          </>
        );
        const cls = cn(
          'relative flex items-center gap-3 overflow-hidden rounded-md px-2.5 py-1.5 text-[13px] text-pine-800',
          r.href && 'transition hover:bg-cream-100',
        );
        return (
          <li key={r.key}>
            {r.href ? (
              <Link href={r.href} className={cls} title={r.label}>
                {inner}
              </Link>
            ) : (
              <span className={cls} title={r.label}>
                {inner}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
