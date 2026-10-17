/**
 * VIDEO BO'LIMI (server) — admin paneldagi videolar ro'yxatidan.
 * Video qo'shilmagan bo'lsa bo'lim chiqmaydi (bo'sh blok yo'q).
 */

import type { Translator } from '@/i18n';
import { visibleVideos } from '@/lib/content';
import { Section, SectionHeader, SectionInset } from '@/components/ui/SectionHeader';
import { VideoGallery } from '@/components/video/VideoGallery';

export async function VideoSection({ t, limit }: { t: Translator; limit?: number }) {
  const videos = (await visibleVideos()).slice(0, limit ?? 24);
  if (!videos.length) return null;

  return (
    <Section id="video">
      <SectionInset>
        <SectionHeader title={t('video.title')} />
        <div className="pt-8">
          <VideoGallery
            videos={videos.map((v) => ({
              id: v.id,
              title: v.title,
              source: v.parsed.source,
              embed: v.parsed.embed,
              href: v.parsed.href,
              thumb: v.parsed.thumb,
            }))}
            labels={{
              play: t('video.play'),
              openYoutube: t('video.openYoutube'),
              openInstagram: t('video.openInstagram'),
            }}
          />
        </div>
      </SectionInset>
    </Section>
  );
}
