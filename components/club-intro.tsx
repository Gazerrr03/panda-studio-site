'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import type { Locale, SiteCopy } from '@/content/i18n';
import type { IntroDimension } from '@/content/studio';
import { IntroCarousel } from './intro-carousel';
import styles from './club-intro.module.css';

type ClubIntroProps = {
  dimensions: IntroDimension[];
  sharedCapabilities: string[];
  copy: SiteCopy['intro'];
  locale: Locale;
};

export function ClubIntro({
  dimensions,
  sharedCapabilities,
  copy,
  locale,
}: ClubIntroProps) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [railMode, setRailMode] = useState<'expanded' | 'compact'>('expanded');
  const count = dimensions.reduce(
    (total, dimension) => total + dimension.cards.length,
    0,
  );

  useEffect(() => {
    const section = root.current;
    const release = section?.querySelector<HTMLElement>('[data-rail-release]');
    if (!section || !release) return;

    const desktop = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    let animationFrame = 0;
    let disposed = false;

    const update = () => {
      animationFrame = 0;
      const headerHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--header-height',
        ),
      );
      const headerOffset = Number.isFinite(headerHeight)
        ? headerHeight + 16
        : 104;
      const nextMode =
        desktop.matches && release.getBoundingClientRect().top <= headerOffset
          ? 'compact'
          : 'expanded';
      setRailMode((current) => (current === nextMode ? current : nextMode));

      const threshold =
        headerOffset +
        (nextMode === 'compact' ? 150 : desktop.matches ? 28 : 74);
      const chapters = Array.from(
        section.querySelectorAll<HTMLElement>('[data-chapter]'),
      );
      let nextActive = 0;
      chapters.forEach((chapter, index) => {
        if (chapter.getBoundingClientRect().top <= threshold) {
          nextActive = index;
        }
      });
      setActive((current) => (current === nextActive ? current : nextActive));
    };

    const scheduleUpdate = () => {
      if (!animationFrame)
        animationFrame = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    desktop.addEventListener('change', scheduleUpdate);
    scheduleUpdate();
    void document.fonts.ready.then(() => {
      if (!disposed) scheduleUpdate();
    });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      desktop.removeEventListener('change', scheduleUpdate);
    };
  }, [dimensions, locale]);

  const navigate = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    const chapter = document.getElementById(`${dimensions[index].id}-panel`);
    if (!chapter) return;

    event.preventDefault();
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    chapter.scrollIntoView({
      block: 'start',
      behavior: reduced ? 'auto' : 'smooth',
    });
    chapter.focus({ preventScroll: true });
    setActive(index);
  };

  return (
    <section
      ref={root}
      className={styles.archive}
      id="room"
      data-locale={locale}
      aria-labelledby="studio-index-title"
    >
      <div className="page-shell">
        <header className={styles.masthead}>
          <p className={styles.overline}>
            {locale === 'zh' ? '工作室索引' : 'Studio index'}
          </p>
          <h2 id="studio-index-title">
            <span aria-hidden="true">(</span>
            {locale === 'zh' ? '认识 Panda' : 'Meet Panda'}
            <span aria-hidden="true">)</span>
          </h2>
          <p className={styles.total}>
            {String(count).padStart(2, '0')}{' '}
            <span>
              {locale === 'zh'
                ? '条目 / 三个维度'
                : 'entries / three dimensions'}
            </span>
          </p>
        </header>

        <div className={styles.layout} data-rail-mode={railMode}>
          <div className={styles.railSlot}>
            <aside className={styles.rail} data-state={railMode}>
              <nav className={styles.railNav} aria-label={copy.dimensions}>
                {dimensions.map((dimension, index) => (
                  <a
                    key={dimension.id}
                    href={`#${dimension.id}-panel`}
                    aria-current={active === index ? 'location' : undefined}
                    onClick={(event) => navigate(event, index)}
                  >
                    <span>{dimension.number}</span>
                    <span>{dimension.label}</span>
                  </a>
                ))}
              </nav>
            </aside>
          </div>
          <div
            className={styles.railRelease}
            data-rail-release
            aria-hidden="true"
          />

          <div className={styles.chapters}>
            {dimensions.map((dimension, index) => (
              <section
                key={dimension.id}
                id={`${dimension.id}-panel`}
                data-chapter
                className={styles.chapter}
                tabIndex={-1}
                aria-labelledby={`${dimension.id}-title`}
              >
                {index === 0 ? (
                  <div className={styles.capabilities}>
                    <p>{copy.sharedCapabilities}</p>
                    <ul>
                      {sharedCapabilities.map((capability) => (
                        <li key={capability}>{capability}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <header className={styles.chapterHeading}>
                  <span className={styles.chapterNumber}>
                    {dimension.number}
                  </span>
                  <div>
                    <h3 id={`${dimension.id}-title`}>{dimension.title}</h3>
                    <p>{dimension.description}</p>
                  </div>
                </header>
                <IntroCarousel dimension={dimension} locale={locale} />
              </section>
            ))}
          </div>
        </div>

        <div className={styles.endnote}>
          <span>
            {locale === 'zh'
              ? '从认识，到一起创造。'
              : 'From meeting to making.'}
          </span>
          <a href="#records">
            {locale === 'zh' ? '查看作品' : 'Explore the records'}
          </a>
        </div>
      </div>
    </section>
  );
}
