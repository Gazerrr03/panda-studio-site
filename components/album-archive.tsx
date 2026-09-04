'use client';

import { useState } from 'react';
import type { Album } from '@/content/studio';

export function AlbumArchive({ albums }: { albums: Album[] }) {
  const [selectedId, setSelectedId] = useState(albums[0]?.id ?? '');
  const selected = albums.find((album) => album.id === selectedId) ?? albums[0];

  if (!selected) return null;

  return (
    <div className="archive-browser">
      <ul className="album-row" aria-label="Project records">
        {albums.map((album, index) => {
          const isSelected = album.id === selected.id;
          return (
            <li key={album.id}>
              <button
                className="album-button"
                type="button"
                aria-label={`Open ${album.title}`}
                aria-pressed={isSelected}
                aria-controls="record-details"
                onClick={() => setSelectedId(album.id)}
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

      <article className="record-details" id="record-details" key={selected.id} aria-live="polite">
        <div className="record-heading">
          <p className="eyebrow">Now playing / {selected.label}</p>
          <h3>{selected.title}</h3>
        </div>
        <div className="liner-notes">
          {selected.placeholder && <p className="content-status">Sample content · replace with verified work</p>}
          <p>{selected.note}</p>
        </div>
        <ol className="track-list">
          {selected.tracks.map((track) => <li key={track}>{track}</li>)}
        </ol>
      </article>
    </div>
  );
}
