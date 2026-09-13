'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import type { IntroCard, IntroDimension } from '@/content/studio';
import type { Locale } from '@/content/i18n';
import styles from './club-intro.module.css';

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
  const reduced = useRef(false);

  useEffect(() => {
    if (!api) return;
    const node = api.rootNode();
    let origin = { x: 0, y: 0 };
    let dragged = false;
    let horizontal = 0;
    let wheelConsumed = false;
    let wheelReset: number | undefined;
    const down = (event: PointerEvent) => {
      origin = { x: event.clientX, y: event.clientY };
      dragged = false;
    };
    const move = (event: PointerEvent) => {
      if (event.buttons || event.pointerType === 'touch')
        dragged ||=
          Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 8;
    };
    const click = (event: globalThis.MouseEvent) => {
      if (dragged && event.detail > 0) {
        event.preventDefault();
        event.stopPropagation();
      }
      dragged = false;
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.shiftKey
            ? event.deltaY
            : 0;
      if (!delta) return;
      event.preventDefault();
      window.clearTimeout(wheelReset);
      wheelReset = window.setTimeout(() => {
        horizontal = 0;
        wheelConsumed = false;
      }, 110);
      if (wheelConsumed) return;
      horizontal += delta * (event.deltaMode === 1 ? 16 : 1);
      if (Math.abs(horizontal) < 28) return;
      if (horizontal > 0) api.scrollNext(reduced.current);
      else api.scrollPrev(reduced.current);
      horizontal = 0;
      wheelConsumed = true;
    };
    node.addEventListener('pointerdown', down, true);
    node.addEventListener('pointermove', move, true);
    node.addEventListener('click', click, true);
    node.addEventListener('wheel', wheel, { passive: false });
    return () => {
      node.removeEventListener('pointerdown', down, true);
      node.removeEventListener('pointermove', move, true);
      node.removeEventListener('click', click, true);
      node.removeEventListener('wheel', wheel);
      window.clearTimeout(wheelReset);
    };
  }, [api]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => {
      reduced.current = query.matches;
    };
    change();
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);

  useEffect(() => {
    if (!api) return;
    const sync = () => setSelected(api.selectedScrollSnap());
    const paint = () => {
      const progress = api.scrollProgress();
      const snaps = api.scrollSnapList();
      api.slideNodes().forEach((slide, index) => {
        const distance = Math.min(
          1,
          Math.abs(snaps[index] - progress) *
            Math.max(1, dimension.cards.length - 1),
        );
        slide.style.setProperty('--focus-scale', String(1 - distance * 0.08));
        slide.style.setProperty('--focus-opacity', String(1 - distance * 0.45));
      });
    };
    sync();
    paint();
    api
      .on('select', sync)
      .on('scroll', paint)
      .on('reInit', sync)
      .on('reInit', paint);
    return () => {
      api
        .off('select', sync)
        .off('scroll', paint)
        .off('reInit', sync)
        .off('reInit', paint);
    };
  }, [api, dimension.cards.length]);

  useEffect(() => {
    if (!detail || !dialog.current) return;
    dialog.current.showModal();
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
            sizes="(max-width: 767px) 85vw, 55vw"
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
      <div ref={viewport} className={styles.viewport}>
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
                  onFocus={() => api?.scrollTo(index, reduced.current)}
                  onKeyDown={(event) => {
                    if (
                      event.key === 'ArrowRight' ||
                      event.key === 'ArrowLeft'
                    ) {
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
                        [next]?.querySelector('button')
                        ?.focus({ preventScroll: true });
                    }
                  }}
                  onClick={(event) => {
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
      </div>
      <div className={styles.controls}>
        <output aria-live="polite">
          {String(selected + 1).padStart(2, '0')} /{' '}
          {String(dimension.cards.length).padStart(2, '0')}
        </output>
        <button
          type="button"
          disabled={selected === 0}
          aria-label={locale === 'zh' ? '上一张卡片' : 'Previous card'}
          onClick={() => api?.scrollPrev(reduced.current)}
        >
          ←
        </button>
        <button
          type="button"
          disabled={selected === dimension.cards.length - 1}
          aria-label={locale === 'zh' ? '下一张卡片' : 'Next card'}
          onClick={() => api?.scrollNext(reduced.current)}
        >
          →
        </button>
      </div>
      <dialog
        ref={dialog}
        className={styles.detailDialog}
        data-lenis-prevent
        aria-labelledby={`${dimension.id}-detail-title`}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={() => setDetail(null)}
      >
        {detail && (
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
                ×
              </button>
            </div>
            {visual(detail, dimension.cards.indexOf(detail))}
            <h2 id={`${dimension.id}-detail-title`}>{detail.title}</h2>
            <p className={styles.detailLead}>{detail.copy}</p>
            <p>{dimension.description}</p>
            {!detail.image && (
              <p className={styles.assetNote}>{detail.imageLabel}</p>
            )}
            {detail.status && <p className={styles.status}>{detail.status}</p>}
          </div>
        )}
      </dialog>
    </section>
  );
}
