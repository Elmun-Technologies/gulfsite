'use client';

/**
 * KONTENT MUHARRIRI — kontaktlar, mijoz logotiplari, videolar
 * ----------------------------------------------------------------
 * Bitta "Saqlash" tugmasi butun kontentni PUT /api/admin/content ga
 * yuboradi; server tozalaydi, saqlaydi va saytni qayta yaratadi.
 * Logotip fayli darhol POST /api/admin/media ga yuklanadi (WebP).
 */

import { useState } from 'react';
import Image from 'next/image';
import type { AdminCopy } from '@/lib/admin-copy';
import type { ContactPerson } from '@/lib/contacts';
import type { ClientLogo, SiteContent, VideoItem } from '@/lib/content';
import { cn } from '@/lib/utils';

const input =
  'h-10 w-full rounded-lg border border-cream-300 bg-white px-3 text-[13.5px] text-pine-900 focus:border-teal-500 focus:outline-none';
const smallBtn =
  'inline-flex h-9 items-center justify-center rounded-lg border border-cream-300 bg-white px-2.5 text-[12.5px] font-bold text-pine-800 transition hover:border-teal-500 hover:text-teal-600 disabled:opacity-40';

function move<T>(list: T[], i: number, d: -1 | 1): T[] {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/** YouTube / Instagram havolasini klientda tez tekshirish (server baribir qayta tekshiradi) */
function looksLikeVideo(url: string): boolean {
  return /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/|instagram\.com\/([\w.]+\/)?(p|reel|reels|tv)\/)/i.test(url.trim());
}

function rid(prefix: string) {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

export function ContentEditor({ initial, copy: c, locale }: { initial: SiteContent; copy: AdminCopy; locale: string }) {
  const [people, setPeople] = useState<ContactPerson[]>(initial.people);
  const [clients, setClients] = useState<ClientLogo[]>(initial.clients);
  const [videos, setVideos] = useState<VideoItem[]>(initial.videos);
  const [updatedAt, setUpdatedAt] = useState(initial.updatedAt);
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [uploading, setUploading] = useState<string | null>(null);
  const [newVideo, setNewVideo] = useState({ url: '', title: '' });
  const [videoError, setVideoError] = useState(false);

  const dirty = () => setState('idle');

  async function save() {
    setState('saving');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ people, clients, videos }),
      });
      const json = (await res.json()) as { ok: boolean; data?: SiteContent };
      if (!res.ok || !json.ok || !json.data) throw new Error('save');
      setPeople(json.data.people);
      setClients(json.data.clients);
      setVideos(json.data.videos);
      setUpdatedAt(json.data.updatedAt);
      setState('saved');
    } catch {
      setState('error');
    }
  }

  async function upload(file: File, id: string | null) {
    setUploading(id ?? 'new');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd });
      const json = (await res.json()) as { ok: boolean; data?: { url: string } };
      if (!res.ok || !json.ok || !json.data) throw new Error('upload');
      const url = json.data.url;
      if (id) setClients((list) => list.map((x) => (x.id === id ? { ...x, logo: url } : x)));
      else
        setClients((list) => [
          ...list,
          { id: rid('c'), name: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').slice(0, 60), logo: url, visible: true },
        ]);
      dirty();
    } catch {
      setState('error');
    } finally {
      setUploading(null);
    }
  }

  function addVideo() {
    if (!looksLikeVideo(newVideo.url)) {
      setVideoError(true);
      return;
    }
    const url = /^https?:\/\//.test(newVideo.url.trim()) ? newVideo.url.trim() : `https://${newVideo.url.trim()}`;
    setVideos((list) => [...list, { id: rid('v'), url, title: newVideo.title.trim(), visible: true }]);
    setNewVideo({ url: '', title: '' });
    setVideoError(false);
    dirty();
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ============ KONTAKTLAR ============ */}
      <section className="rounded-xl border border-cream-200 bg-white p-4 shadow-soft">
        <h2 className="mb-3 font-display text-[14px] font-extrabold text-pine-900">{c.content.people}</h2>
        <div className="flex flex-col gap-2.5">
          {people.map((p, i) => (
            <div key={i} className="grid gap-2 rounded-lg bg-cream-50 p-2.5 md:grid-cols-[150px_1fr_1fr_auto]">
              <select
                value={p.role}
                aria-label={c.content.role}
                onChange={(e) => {
                  setPeople((l) => l.map((x, j) => (j === i ? { ...x, role: e.target.value as ContactPerson['role'] } : x)));
                  dirty();
                }}
                className={input}
              >
                <option value="director">{c.content.director}</option>
                <option value="sales">{c.content.sales}</option>
              </select>
              <input
                value={p.phone}
                placeholder="+998 90 123 45 67"
                aria-label={c.content.phone}
                inputMode="tel"
                onChange={(e) => {
                  setPeople((l) => l.map((x, j) => (j === i ? { ...x, phone: e.target.value } : x)));
                  dirty();
                }}
                className={input}
              />
              <input
                value={p.name}
                placeholder={c.content.name}
                aria-label={c.content.name}
                onChange={(e) => {
                  setPeople((l) => l.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)));
                  dirty();
                }}
                className={input}
              />
              <div className="flex flex-wrap items-center gap-1.5">
                {(['whatsapp', 'telegram'] as const).map((k) => (
                  <label key={k} className="flex items-center gap-1 text-[12px] text-pine-800">
                    <input
                      type="checkbox"
                      checked={p[k]}
                      onChange={(e) => {
                        setPeople((l) => l.map((x, j) => (j === i ? { ...x, [k]: e.target.checked } : x)));
                        dirty();
                      }}
                    />
                    {k === 'whatsapp' ? 'WhatsApp' : 'Telegram'}
                  </label>
                ))}
                <button type="button" className={smallBtn} onClick={() => (setPeople((l) => move(l, i, -1)), dirty())} aria-label={c.content.up} disabled={!i}>
                  ↑
                </button>
                <button type="button" className={smallBtn} onClick={() => (setPeople((l) => move(l, i, 1)), dirty())} aria-label={c.content.down} disabled={i === people.length - 1}>
                  ↓
                </button>
                <button type="button" className={cn(smallBtn, 'hover:border-clay-500 hover:text-clay-600')} onClick={() => (setPeople((l) => l.filter((_, j) => j !== i)), dirty())}>
                  {c.content.remove}
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className={cn(smallBtn, 'self-start')}
            onClick={() => {
              setPeople((l) => [...l, { role: 'sales', name: '', phone: '+998 ', whatsapp: true, telegram: true }]);
              dirty();
            }}
          >
            + {c.content.addPerson}
          </button>
        </div>
      </section>

      {/* ============ LOGOTIPLAR ============ */}
      <section className="rounded-xl border border-cream-200 bg-white p-4 shadow-soft">
        <h2 className="mb-3 font-display text-[14px] font-extrabold text-pine-900">{c.content.clients}</h2>
        <div className="grid gap-2.5 md:grid-cols-2">
          {clients.map((cl, i) => (
            <div key={cl.id} className={cn('flex gap-3 rounded-lg border p-2.5', cl.visible ? 'border-cream-200 bg-cream-50' : 'border-dashed border-cream-300 opacity-60')}>
              <label className="relative flex h-20 w-28 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-cream-200 bg-white" title={c.content.upload}>
                {cl.logo ? (
                  <Image src={cl.logo} alt={cl.name} fill sizes="112px" className="object-contain p-1.5" unoptimized={cl.logo.startsWith('/api/')} />
                ) : null}
                {uploading === cl.id ? <span className="absolute inset-0 flex items-center justify-center bg-white/80 text-[11px]">{c.content.uploading}</span> : null}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void upload(f, cl.id);
                    e.target.value = '';
                  }}
                />
              </label>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <input
                  value={cl.name}
                  aria-label={c.content.logoName}
                  placeholder={c.content.logoName}
                  onChange={(e) => (setClients((l) => l.map((x) => (x.id === cl.id ? { ...x, name: e.target.value } : x))), dirty())}
                  className={input}
                />
                <input
                  value={cl.url ?? ''}
                  aria-label={c.content.logoUrl}
                  placeholder={c.content.logoUrl}
                  onChange={(e) => (setClients((l) => l.map((x) => (x.id === cl.id ? { ...x, url: e.target.value } : x))), dirty())}
                  className={input}
                />
                <div className="flex flex-wrap items-center gap-1.5">
                  <label className="flex items-center gap-1 text-[12px] text-pine-800">
                    <input
                      type="checkbox"
                      checked={cl.visible}
                      onChange={(e) => (setClients((l) => l.map((x) => (x.id === cl.id ? { ...x, visible: e.target.checked } : x))), dirty())}
                    />
                    {c.content.visible}
                  </label>
                  <button type="button" className={smallBtn} onClick={() => (setClients((l) => move(l, i, -1)), dirty())} aria-label={c.content.up} disabled={!i}>
                    ↑
                  </button>
                  <button type="button" className={smallBtn} onClick={() => (setClients((l) => move(l, i, 1)), dirty())} aria-label={c.content.down} disabled={i === clients.length - 1}>
                    ↓
                  </button>
                  <button type="button" className={cn(smallBtn, 'ml-auto hover:border-clay-500 hover:text-clay-600')} onClick={() => (setClients((l) => l.filter((x) => x.id !== cl.id)), dirty())}>
                    {c.content.remove}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <label className={cn(smallBtn, 'mt-3 cursor-pointer')}>
          {uploading === 'new' ? c.content.uploading : `+ ${c.content.upload}`}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f, null);
              e.target.value = '';
            }}
          />
        </label>
      </section>

      {/* ============ VIDEOLAR ============ */}
      <section className="rounded-xl border border-cream-200 bg-white p-4 shadow-soft">
        <h2 className="mb-3 font-display text-[14px] font-extrabold text-pine-900">{c.content.videos}</h2>
        <div className="flex flex-col gap-2">
          {videos.map((v, i) => (
            <div key={v.id} className={cn('grid gap-2 rounded-lg border p-2.5 md:grid-cols-[1fr_1fr_auto]', v.visible ? 'border-cream-200 bg-cream-50' : 'border-dashed border-cream-300 opacity-60')}>
              <a href={v.url} target="_blank" rel="noopener noreferrer" className="truncate self-center text-[13px] text-teal-600 hover:underline" title={v.url}>
                {v.url}
              </a>
              <input
                value={v.title}
                aria-label={c.content.videoTitle}
                placeholder={c.content.videoTitle}
                onChange={(e) => (setVideos((l) => l.map((x) => (x.id === v.id ? { ...x, title: e.target.value } : x))), dirty())}
                className={input}
              />
              <div className="flex flex-wrap items-center gap-1.5">
                <label className="flex items-center gap-1 text-[12px] text-pine-800">
                  <input
                    type="checkbox"
                    checked={v.visible}
                    onChange={(e) => (setVideos((l) => l.map((x) => (x.id === v.id ? { ...x, visible: e.target.checked } : x))), dirty())}
                  />
                  {c.content.visible}
                </label>
                <button type="button" className={smallBtn} onClick={() => (setVideos((l) => move(l, i, -1)), dirty())} aria-label={c.content.up} disabled={!i}>
                  ↑
                </button>
                <button type="button" className={smallBtn} onClick={() => (setVideos((l) => move(l, i, 1)), dirty())} aria-label={c.content.down} disabled={i === videos.length - 1}>
                  ↓
                </button>
                <button type="button" className={cn(smallBtn, 'hover:border-clay-500 hover:text-clay-600')} onClick={() => (setVideos((l) => l.filter((x) => x.id !== v.id)), dirty())}>
                  {c.content.remove}
                </button>
              </div>
            </div>
          ))}
          <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
            <input
              value={newVideo.url}
              placeholder={c.content.videoUrl}
              aria-label={c.content.videoUrl}
              onChange={(e) => {
                setNewVideo((s) => ({ ...s, url: e.target.value }));
                setVideoError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addVideo();
                }
              }}
              className={cn(input, videoError && 'border-clay-500')}
            />
            <input
              value={newVideo.title}
              placeholder={c.content.videoTitle}
              aria-label={c.content.videoTitle}
              onChange={(e) => setNewVideo((s) => ({ ...s, title: e.target.value }))}
              className={input}
            />
            <button type="button" className={smallBtn} onClick={addVideo}>
              + {c.content.addVideo}
            </button>
          </div>
          {videoError ? <p className="text-[12px] text-clay-600">{c.content.badVideo}</p> : null}
        </div>
      </section>

      {/* ============ SAQLASH (pastda yopishgan) ============ */}
      <div className="sticky bottom-3 z-20 flex flex-wrap items-center gap-3 rounded-xl border border-cream-200 bg-white/95 p-3 shadow-lift backdrop-blur">
        <button
          type="button"
          onClick={save}
          disabled={state === 'saving'}
          className="inline-flex h-10 items-center rounded-xl bg-teal-600 px-5 text-[13.5px] font-bold text-white transition hover:bg-pine-800 disabled:opacity-60"
        >
          {state === 'saving' ? c.content.saving : c.content.save}
        </button>
        <span role="status" className={cn('text-[13px]', state === 'error' ? 'text-clay-600' : 'text-teal-600')}>
          {state === 'saved' ? c.content.saved : state === 'error' ? c.content.error : ''}
        </span>
        {updatedAt ? (
          <span className="ml-auto text-[12px] text-slate-warm-500">
            {c.content.updated}: {new Date(updatedAt).toLocaleString(locale === 'en' ? 'en-GB' : locale === 'ru' ? 'ru-RU' : 'uz-UZ')}
          </span>
        ) : null}
      </div>
    </div>
  );
}
