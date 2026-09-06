'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Album } from '@/content/studio';
import type { SiteCopy } from '@/content/i18n';

export function AlbumArchive({ albums, copy }: { albums: Album[]; copy: SiteCopy['archive'] }) {
  const [selectedId, setSelectedId] = useState(albums[0]?.id ?? '');
  const selected = albums.find((album) => album.id === selectedId) ?? albums[0];
  const rowRef = useRef<HTMLUListElement>(null);
  const detailsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    let timer: ReturnType<typeof setTimeout>;
    const syncSelection = () => {
      if (!window.matchMedia('(max-width: 767px)').matches) return;
      const center = row.getBoundingClientRect().left + row.clientWidth / 2;
      const nearest = Array.from(row.children).reduce((best, child, index) => {
        const bounds = child.getBoundingClientRect();
        const distance = Math.abs(bounds.left + bounds.width / 2 - center);
        return distance < best.distance ? { index, distance } : best;
      }, { index: 0, distance: Infinity });
      if (albums[nearest.index]) setSelectedId(albums[nearest.index].id);
    };
    // Older mobile browsers do not emit scrollend; settle after native momentum stops.
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(syncSelection, 120);
    };
    row.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      row.removeEventListener('scroll', onScroll);
    };
  }, [albums]);

  const scrollBehavior = (keyboard: boolean): ScrollBehavior =>
    keyboard || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';

  const browse = (index: number, keyboard: boolean) => {
    const row = rowRef.current;
    const item = row?.children[index];
    if (!row || !item || !albums[index]) return;
    setSelectedId(albums[index].id);
    row.scrollTo({
      left: row.scrollLeft + item.getBoundingClientRect().left - row.getBoundingClientRect().left - 6,
      behavior: scrollBehavior(keyboard),
    });
  };

  if (!selected) return null;
  const selectedIndex = albums.indexOf(selected);

  return (
    <div className="archive-browser">
      <ul ref={rowRef} className="album-row" aria-label={copy.projects}>
        {albums.map((album, index) => {
          const isSelected = album.id === selected.id;
          return (
            <li key={album.id}>
              <button
                className="album-button"
                type="button"
                aria-label={copy.openRecord(album.title)}
                aria-pressed={isSelected}
                aria-controls="record-details"
                onClick={(event) => {
                  setSelectedId(album.id);
                  if (window.matchMedia('(max-width: 767px)').matches) {
                    detailsRef.current?.focus({ preventScroll: true });
                    detailsRef.current?.scrollIntoView({ block: 'start', behavior: scrollBehavior(event.detail === 0) });
                  }
                }}
              >
                <span className={`album-cover album-cover--${album.cover}`} aria-hidden="true">
                  <span className="album-cover-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="album-cover-label">PANDA<br />STUDIO</span>
                </span>
                <span className="album-meta">
                  <span>{album.label}</span>
                  <strong>{album.title}</strong>
                  <span>{album.year} · {album.format}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="archive-controls">
        <output className="archive-position" aria-atomic="true">
          <span className="sr-only">{copy.projects}: </span>
          {String(selectedIndex + 1).padStart(2, '0')} / {String(albums.length).padStart(2, '0')}
        </output>
        <button type="button" aria-label={copy.previous} title={copy.previous}
          disabled={selectedIndex === 0} onClick={(event) => browse(selectedIndex - 1, event.detail === 0)}>
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <button type="button" aria-label={copy.next} title={copy.next}
          disabled={selectedIndex === albums.length - 1} onClick={(event) => browse(selectedIndex + 1, event.detail === 0)}>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>

      <article ref={detailsRef} className="record-details" id="record-details" tabIndex={-1} aria-live="polite">
        <button className="archive-back" type="button" onClick={(event) => {
          browse(selectedIndex, true);
          const button = rowRef.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
          button?.focus({ preventScroll: true });
          rowRef.current?.scrollIntoView({ block: 'start', behavior: scrollBehavior(event.detail === 0) });
        }}><ArrowLeft size={16} aria-hidden="true" />{copy.backToProjects}</button>
        <div className="record-heading">
          <p className="eyebrow">{copy.nowPlaying} / {selected.label}</p>
          <h3>{selected.title}</h3>
        </div>
        <div className="liner-notes">
          {selected.placeholder && <p className="content-status">{copy.sampleContent}</p>}
          <p>{selected.note}</p>
        </div>
        <ol className="track-list">
          {selected.tracks.map((track) => <li key={track}>{track}</li>)}
        </ol>
      </article>
    </div>
  );
}
