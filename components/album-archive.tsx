'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { Album } from '@/content/studio';
import type { SiteCopy } from '@/content/i18n';
import styles from './album-archive.module.css';

export function AlbumArchive({
  albums,
  copy,
}: {
  albums: Album[];
  copy: SiteCopy['archive'];
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const cards = useRef<Array<HTMLButtonElement | null>>([]);
  const details = useRef<HTMLElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const pointer = useRef({ x: 0, moved: false });
  const selected = albums[selectedIndex];

  const browse = useCallback(
    (index: number, moveFocus = false) => {
      const next = Math.max(0, Math.min(albums.length - 1, index));
      if (!albums[next]) return;
      setSelectedIndex(next);
      if (moveFocus) {
        requestAnimationFrame(() => cards.current[next]?.focus());
      }
    },
    [albums],
  );

  const open = useCallback((index: number, button: HTMLButtonElement) => {
    setSelectedIndex(index);
    opener.current = button;
    setIsOpen(true);
    requestAnimationFrame(() =>
      details.current?.focus({ preventScroll: true }),
    );
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [close, isOpen]);

  const handleCardKeys = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    browse(selectedIndex + (event.key === 'ArrowRight' ? 1 : -1), true);
  };

  if (!selected) return null;

  return (
    <div className={styles.browser}>
      <section className={styles.deck} aria-label={copy.projects}>
        <fieldset
          className={styles.viewport}
          aria-label={copy.browseHint}
          onPointerDown={(event) => {
            pointer.current = {
              x: event.clientX,
              moved: false,
            };
          }}
          onPointerUp={(event) => {
            const delta = event.clientX - pointer.current.x;
            pointer.current.moved = Math.abs(delta) > 12;
            if (Math.abs(delta) > 42) {
              browse(selectedIndex + (delta < 0 ? 1 : -1));
            }
          }}
          onPointerCancel={() => {
            pointer.current = { x: 0, moved: false };
          }}
        >
          <div className={styles.rail}>
            {albums.map((album, index) => {
              const offset = index - selectedIndex;
              return (
                <button
                  ref={(node) => {
                    cards.current[index] = node;
                  }}
                  key={album.id}
                  className={styles.card}
                  data-offset={offset}
                  type="button"
                  aria-label={copy.openRecord(album.title)}
                  aria-current={index === selectedIndex ? 'true' : undefined}
                  tabIndex={index === selectedIndex ? 0 : -1}
                  onKeyDown={handleCardKeys}
                  onClick={(event) => {
                    if (pointer.current.moved) {
                      pointer.current.moved = false;
                      return;
                    }
                    open(index, event.currentTarget);
                  }}
                >
                  <span className={styles.cardFace}>
                    {album.image ? (
                      <Image
                        className={styles.cardImage}
                        src={album.image}
                        alt=""
                        draggable={false}
                        fill
                        sizes="(max-width: 767px) 82vw, min(55vw, 680px)"
                      />
                    ) : null}
                    <span className={styles.cardNumber}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.cardCaption}>
                      <strong>{album.title}</strong>
                      <small>
                        {album.year} / {album.format}
                      </small>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <footer className={styles.deckFooter}>
          <output className={styles.count} aria-live="polite">
            <b>{String(selectedIndex + 1).padStart(2, '0')}</b> /{' '}
            {String(albums.length).padStart(2, '0')}
          </output>
          <span className={styles.hint}>{copy.browseHint}</span>
          <span className={styles.arrows}>
            <button
              type="button"
              aria-label={copy.previous}
              disabled={selectedIndex === 0}
              onClick={() => browse(selectedIndex - 1)}
            >
              <ArrowLeft size={17} strokeWidth={1.6} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={copy.next}
              disabled={selectedIndex === albums.length - 1}
              onClick={() => browse(selectedIndex + 1)}
            >
              <ArrowRight size={17} strokeWidth={1.6} aria-hidden="true" />
            </button>
          </span>
        </footer>
      </section>

      <section
        ref={details}
        className={styles.details}
        id="record-details"
        aria-label={selected.title}
        tabIndex={-1}
        aria-live="polite"
        hidden={!isOpen}
      >
        <button className={styles.back} type="button" onClick={close}>
          <ArrowLeft size={16} strokeWidth={1.6} aria-hidden="true" />
          {copy.backToProjects}
        </button>
        <button
          className={styles.close}
          type="button"
          aria-label={copy.closeProject}
          onClick={close}
        >
          <X size={18} strokeWidth={1.6} aria-hidden="true" />
        </button>
        <div className={styles.recordHeading}>
          <p className="eyebrow">
            {copy.nowPlaying} / {selected.label}
          </p>
          <h3>{selected.title}</h3>
        </div>
        <div className={styles.notes}>
          <p>{selected.note}</p>
        </div>
        <ol className={styles.trackList}>
          {selected.tracks.map((track) => (
            <li key={track}>{track}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
