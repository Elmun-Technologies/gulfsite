'use client';

/**
 * VIDEO GALEREYA — YouTube / Instagram (admin paneldan boshqariladi)
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
  source: 'youtube' | 'instagram';
  embed: string;
  href: string;
  thumb?: string;
}

export function VideoGallery({
  videos,
  labels,
}: {
  videos: GalleryVideo[];
  labels: { play: string; openYoutube: string; openInstagram: string };
}) {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-3">
      {videos.map((v) => {
        const vertical = v.source === 'instagram';
        const active = playing === v.id;
        return (
          <figure key={v.id} className="m-0 flex flex-col gap-3">
            <div
              className={cn(
                'relative w-full overflow-hidden rounded-media bg-navy',
                vertical ? 'aspect-[9/14]' : 'aspect-video',
              )}
            >
              {active ? (
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
                  {v.thumb ? (
                    <Image
                      src={v.thumb}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover opacity-85 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  ) : (
                    <span className="absolute left-5 top-5 text-[13px] uppercase tracking-[0.12em] text-copper-light">
                      Instagram
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
                {v.source === 'youtube' ? labels.openYoutube : labels.openInstagram}
                <ArrowUpRight size={14} aria-hidden />
              </a>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
