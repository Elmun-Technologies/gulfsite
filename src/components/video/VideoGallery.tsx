'use client';

/**
 * VIDEO GALEREYA — YouTube / Instagram / VK / .mp4 (admin paneldan boshqariladi)
 * ----------------------------------------------------------------
 * "Facade" usuli: sahifada faqat muqova + play tugmasi. iframe FAQAT
 * bosilgandan keyin yuklanadi — YouTube/Instagram skriptlari birinchi
 * paint'ga va Lighthouse Perf'ga ta'sir qilmaydi (§14.5).
 *
 * YouTube: youtube-nocookie.com (cookie'siz rejim). Instagram'da muqova
 * yo'q (API kalitsiz olib bo'lmaydi) — navy plitka + belgi.
 */

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Play } from 'lucide-react';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export interface GalleryVideo {
  id: string;
  title: string;
  source: 'youtube' | 'instagram' | 'vk' | 'linkedin' | 'file';
  embed: string;
  href: string;
  thumb?: string;
  /** to'g'ridan-to'g'ri video fayl — iframe o'rniga <video> */
  file?: string;
}

export function VideoGallery({
  videos,
  labels,
}: {
  videos: GalleryVideo[];
  labels: { play: string; openYoutube: string; openInstagram: string; openVk: string; openLinkedin: string; openFile: string };
}) {
  const [playing, setPlaying] = useState<string | null>(null);

  // Keng (YouTube, VK, .mp4) va vertikal (Instagram reel, LinkedIn) videolar alohida
  // qatorlarda — aralash bo'lsa qatorlar notekis bo'lib, dizayn buziladi
  const isVertical = (v: GalleryVideo) => v.source === 'instagram' || v.source === 'linkedin';
  const wide = videos.filter((v) => !isVertical(v));
  const tall = videos.filter(isVertical);

  const renderCard = (v: GalleryVideo) => {
        const vertical = isVertical(v);
        const active = playing === v.id;
        return (
          <figure key={v.id} className="m-0 flex flex-col gap-3">
            <div
              className={cn(
                'relative w-full overflow-hidden rounded-media bg-navy',
                vertical ? 'aspect-[9/16]' : 'aspect-video',
              )}
            >
              {active && v.file ? (
                <video
                  src={v.file}
                  controls
                  autoPlay
                  playsInline
                  className="absolute inset-0 h-full w-full bg-navy object-contain"
                />
              ) : active ? (
                <iframe
                  src={v.embed}
                  title={v.title || labels.play}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setPlaying(v.id);
                    track.videoPlay(v.source, v.id);
                  }}
                  aria-label={v.title ? `${labels.play}: ${v.title}` : labels.play}
                  className="group absolute inset-0 flex h-full w-full items-center justify-center"
                >
                  {v.file ? (
                    // birinchi kadr muqova sifatida (faqat metadata yuklanadi)
                    <video
                      src={`${v.file}#t=0.001`}
                      preload="metadata"
                      muted
                      playsInline
                      aria-hidden
                      tabIndex={-1}
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-85 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  ) : v.thumb ? (
                    <Image
                      src={v.thumb}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover opacity-85 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  ) : (
                    <span className="absolute left-5 top-5 text-[13px] uppercase tracking-[0.12em] text-copper-light">
                      {v.source === 'vk' ? 'VK Video' : v.source === 'linkedin' ? 'LinkedIn' : 'Instagram'}
                    </span>
                  )}
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-pill bg-copper text-ink transition-transform duration-300 group-hover:scale-110">
                    <Play size={26} strokeWidth={2} fill="currentColor" aria-hidden />
                  </span>
                </button>
              )}
            </div>
            <figcaption className="flex items-start justify-between gap-3 px-1">
              <span className="text-[16px] font-medium leading-snug">{v.title}</span>
              <a
                href={v.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-[14px] text-muted no-underline hover:text-ink"
              >
                {v.source === 'youtube'
                  ? labels.openYoutube
                  : v.source === 'vk'
                    ? labels.openVk
                    : v.source === 'linkedin'
                      ? labels.openLinkedin
                    : v.source === 'file'
                      ? labels.openFile
                      : labels.openInstagram}
                <ArrowUpRight size={14} aria-hidden />
              </a>
            </figcaption>
          </figure>
        );
  };

  return (
    <div className="flex flex-col gap-3">
      {wide.length ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] gap-3">{wide.map(renderCard)}</div>
      ) : null}
      {tall.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{tall.map(renderCard)}</div>
      ) : null}
    </div>
  );
}
