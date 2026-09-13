'use client';

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react';
import { IntroCarousel } from './intro-carousel';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { IntroDimension } from '@/content/studio';
import type { Locale, SiteCopy } from '@/content/i18n';
import styles from './club-intro.module.css';

type ClubIntroProps = {
  dimensions: IntroDimension[];
  sharedCapabilities: string[];
  copy: SiteCopy['intro'];
  locale: Locale;
};
gsap.registerPlugin(ScrollTrigger);

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
    if (!section) return;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      const rail = section.querySelector<HTMLElement>('[data-rail]');
      const railRelease = section.querySelector<HTMLElement>(
        '[data-rail-release]',
      );

      media.add(
        '(min-width: 768px) and (pointer: fine)',
        () => {
          if (!rail || !railRelease) return;
          const setRailState = (state: 'expanded' | 'compact') => {
            rail.dataset.state = state;
            setRailMode(state);
          };
          const headerOffset = () => {
            const value = Number.parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue(
                '--header-height',
              ),
            );
            return Number.isFinite(value) ? value + 16 : 104;
          };

          setRailState('expanded');
          const trigger = ScrollTrigger.create({
            trigger: railRelease,
            start: () => `top top+=${headerOffset()}px`,
            onEnter: () => setRailState('compact'),
            onLeave: () => setRailState('compact'),
            onEnterBack: () => setRailState('compact'),
            onLeaveBack: () => setRailState('expanded'),
            onRefresh: (self) =>
              setRailState(
                window.scrollY >= self.start ? 'compact' : 'expanded',
              ),
          });

          return () => {
            trigger.kill();
            setRailState('expanded');
          };
        },
        section,
      );
      const chapterAnchors = Array.from(
        section.querySelectorAll<HTMLElement>('[data-chapter-anchor]'),
      );
      let chapterPositions: number[] = [];
      const measureChapters = () => {
        chapterPositions = chapterAnchors.map(
          (anchor) => anchor.getBoundingClientRect().top + window.scrollY,
        );
      };
      const updateActiveChapter = () => {
        const threshold =
          window.scrollY + (window.innerWidth < 768 ? 220 : 136) + 2;
        let nextIndex = 0;
        chapterPositions.forEach((documentTop, index) => {
          if (documentTop <= threshold) nextIndex = index;
        });
        setActive((current) => (current === nextIndex ? current : nextIndex));
      };
      measureChapters();
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: updateActiveChapter,
        onEnterBack: updateActiveChapter,
        onUpdate: updateActiveChapter,
        onRefresh: () => {
          measureChapters();
          updateActiveChapter();
        },
      });
      media.add(
        '(prefers-reduced-motion: no-preference)',
        () => {
          section
            .querySelectorAll<HTMLElement>('[data-reveal]')
            .forEach((entry) => {
              gsap.fromTo(
                entry,
                { y: 48, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 1.1,
                  ease: 'power3.out',
                  scrollTrigger: {
                    trigger: entry,
                    start: 'top 94%',
                    once: true,
                  },
                },
              );
            });
          section
            .querySelectorAll<HTMLElement>('[data-visual]')
            .forEach((visual) => {
              gsap.fromTo(
                visual,
                { yPercent: -4 },
                {
                  yPercent: 4,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: visual.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.8,
                  },
                },
              );
            });
        },
        section,
      );
    }, section);
    let alive = true;
    void document.fonts.ready.then(() => {
      if (alive) ScrollTrigger.refresh();
    });
    return () => {
      alive = false;
      media.revert();
      context.revert();
    };
  }, [locale, dimensions]);

  const navigate = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    const chapter = document.getElementById(`${dimensions[index].id}-panel`);
    if (!chapter) return;
    const anchor = root.current?.querySelector<HTMLElement>(
      `[data-chapter-anchor="${dimensions[index].id}"]`,
    );
    event.preventDefault();
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    // Sticky panels report their current painted position, not their natural
    // position in the document. Use the flow anchor so reverse navigation can
    // return to an earlier panel after the folder stack has engaged.
    const target = anchor ?? chapter;
    const top =
      target.getBoundingClientRect().top +
      window.scrollY -
      (window.innerWidth < 768 ? 220 : 136);
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    chapter.focus({ preventScroll: true });
    setActive(index);
  };

  const renderRailNav = (mode: 'expanded' | 'compact') => (
    <nav
      className={
        mode === 'expanded' ? styles.railWide : styles.railCompact
      }
      aria-label={copy.dimensions}
      aria-hidden={railMode !== mode}
    >
      {dimensions.map((dimension, index) => (
        <a
          key={`${mode}-${dimension.id}`}
          href={`#${dimension.id}-panel`}
          aria-current={
            railMode === mode && active === index ? 'location' : undefined
          }
          tabIndex={railMode === mode ? 0 : -1}
          onClick={(event) => navigate(event, index)}
        >
          <span>{dimension.number}</span>
          <span>{dimension.label}</span>
        </a>
      ))}
    </nav>
  );

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
          <h2 id="studio-index-title" data-reveal>
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
            <aside
              className={styles.rail}
              data-rail
              data-state="expanded"
            >
              <div className={styles.railStage}>
                {renderRailNav('expanded')}
                {renderRailNav('compact')}
              </div>
            </aside>
          </div>
          <div
            className={styles.railRelease}
            data-rail-release
            aria-hidden="true"
          />
          <div className={styles.chapters} data-active-index={active}>
            {dimensions.map((dimension, index) => (
              <Fragment key={dimension.id}>
                <span
                  className={styles.chapterAnchor}
                  data-chapter-anchor={dimension.id}
                  aria-hidden="true"
                />
                <section
                  id={`${dimension.id}-panel`}
                  data-chapter
                  data-chapter-index={index}
                  className={styles.chapter}
                  tabIndex={-1}
                  aria-labelledby={`${dimension.id}-title`}
                >
                  <div className={styles.chapterTab} aria-hidden="true">
                    <span>{dimension.number}</span>
                    <span>{dimension.label}</span>
                  </div>
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
                  <header className={styles.chapterHeading} data-reveal>
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
              </Fragment>
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
