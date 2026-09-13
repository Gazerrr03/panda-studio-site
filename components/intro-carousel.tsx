'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { IntroCard, IntroDimension } from '@/content/studio';
import type { Locale } from '@/content/i18n';
import styles from './club-intro.module.css';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function IntroCarousel({
  dimension,
  locale,
}: {
  dimension: IntroDimension;
  locale: Locale;
}) {
  const [viewport, api] = useEmblaCarousel({
    align: 'center',
    containScroll: false,
    duration: 22,
    loop: false,
  });
  const [selected, setSelected] = useState(0);
  const [detail, setDetail] = useState<IntroCard | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const pointer = useRef({ x: 0, y: 0, moved: false });

  useEffect(() => {
    if (!api) return;
    const sync = () => setSelected(api.selectedScrollSnap());
    sync();
    api.on('select', sync).on('reInit', sync);
    return () => {
      api.off('select', sync).off('reInit', sync);
    };
  }, [api]);

  useEffect(() => {
    if (!detail || !dialog.current) return;
    if (!dialog.current.open) dialog.current.showModal();
    const oldOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = oldOverflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [detail]);

  const close = useCallback(() => {
    dialog.current?.close();
    setDetail(null);
  }, []);

  const visual = (card: IntroCard, index: number) => (
    <span className={styles.media} data-tone={card.imageTone}>
      <span className={styles.visual}>
        {card.image ? (
          <Image
            src={card.image}
            alt={card.alt}
            fill
            sizes="(max-width: 767px) 86vw, (max-width: 1199px) 66vw, 820px"
          />
        ) : (
          <span className={styles.placeholder} aria-hidden="true">
            <span>
              {dimension.number}.{String(index + 1).padStart(2, '0')}
            </span>
            <i />
            <small>PANDA STUDIO</small>
          </span>
        )}
      </span>
    </span>
  );

  return (
    <section
      className={styles.carousel}
      data-dimension={dimension.id}
      aria-roledescription={locale === 'zh' ? '轮播' : 'carousel'}
      aria-label={dimension.label}
    >
      <fieldset
        ref={viewport}
        className={styles.viewport}
        aria-label={dimension.label}
        onPointerDownCapture={(event) => {
          pointer.current = {
            x: event.clientX,
            y: event.clientY,
            moved: false,
          };
        }}
        onPointerMoveCapture={(event) => {
          const { x, y } = pointer.current;
          if (Math.hypot(event.clientX - x, event.clientY - y) > 8) {
            pointer.current.moved = true;
          }
        }}
      >
        <ol className={styles.slides}>
          {dimension.cards.map((card, index) => (
            <li
              key={card.id}
              className={styles.slide}
              data-focused={selected === index}
            >
              <article className={styles.focusCard}>
                <button
                  type="button"
                  className={styles.cardOpen}
                  aria-haspopup="dialog"
                  aria-label={`${locale === 'zh' ? '查看详情：' : 'View details: '}${card.title}`}
                  onFocus={() => api?.scrollTo(index, prefersReducedMotion())}
                  onKeyDown={(event) => {
                    if (
                      event.key !== 'ArrowRight' &&
                      event.key !== 'ArrowLeft'
                    ) {
                      return;
                    }
                    event.preventDefault();
                    const next = Math.max(
                      0,
                      Math.min(
                        dimension.cards.length - 1,
                        index + (event.key === 'ArrowRight' ? 1 : -1),
                      ),
                    );
                    api
                      ?.slideNodes()
                      [next]?.querySelector<HTMLButtonElement>('button')
                      ?.focus({ preventScroll: true });
                  }}
                  onClick={(event) => {
                    if (pointer.current.moved) {
                      pointer.current.moved = false;
                      return;
                    }
                    opener.current = event.currentTarget;
                    setDetail(card);
                  }}
                >
                  <span className={styles.entryMeta}>
                    <span>{card.kicker}</span>
                    <span>
                      {locale === 'zh' ? '查看详情 ↗' : 'View details ↗'}
                    </span>
                  </span>
                  {visual(card, index)}
                  <span className={styles.cardTitle}>{card.title}</span>
                  <span className={styles.cardSummary}>{card.copy}</span>
                </button>
              </article>
            </li>
          ))}
        </ol>
      </fieldset>

      <div className={styles.controls}>
        <output aria-live="polite">
          {String(selected + 1).padStart(2, '0')} /{' '}
          {String(dimension.cards.length).padStart(2, '0')}
        </output>
        <button
          type="button"
          disabled={selected === 0}
          aria-label={locale === 'zh' ? '上一张卡片' : 'Previous card'}
          onClick={() => api?.scrollPrev(prefersReducedMotion())}
        >
          <ArrowLeft size={18} strokeWidth={1.6} aria-hidden="true" />
        </button>
        <button
          type="button"
          disabled={selected === dimension.cards.length - 1}
          aria-label={locale === 'zh' ? '下一张卡片' : 'Next card'}
          onClick={() => api?.scrollNext(prefersReducedMotion())}
        >
          <ArrowRight size={18} strokeWidth={1.6} aria-hidden="true" />
        </button>
      </div>

      <dialog
        ref={dialog}
        className={styles.detailDialog}
        aria-labelledby={`${dimension.id}-detail-title`}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={() => setDetail(null)}
      >
        {detail ? (
          <div className={styles.detailBody}>
            <div className={styles.detailTop}>
              <span>
                {dimension.label} / {detail.kicker}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label={locale === 'zh' ? '关闭详情' : 'Close details'}
              >
                <X size={18} strokeWidth={1.6} aria-hidden="true" />
              </button>
            </div>
            {visual(detail, dimension.cards.indexOf(detail))}
            <h2 id={`${dimension.id}-detail-title`}>{detail.title}</h2>
            <p className={styles.detailLead}>{detail.copy}</p>
            <p>{dimension.description}</p>
            {!detail.image ? (
              <p className={styles.assetNote}>{detail.imageLabel}</p>
            ) : null}
            {detail.status ? (
              <p className={styles.status}>{detail.status}</p>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
