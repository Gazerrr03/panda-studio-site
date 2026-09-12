'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import Image from 'next/image';
import type { IntroCard, IntroDimension } from '@/content/studio';
import type { Locale, SiteCopy } from '@/content/i18n';
import { TitleLines } from '@/components/title-lines';

type ClubIntroProps = {
  dimensions: IntroDimension[];
  sharedCapabilities: string[];
  copy: SiteCopy['intro'];
  locale: Locale;
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function MatrixCard({ card, index, active }: { card: IntroCard; index: number; active: boolean }) {
  return (
    <li className="club-intro__card-item" data-active={active} data-card-index={index}>
      <article className="club-intro__card">
        <div className={`club-intro__media club-intro__media--${card.imageTone}`}>
          {card.image ? (
            <Image
              className="club-intro__image"
              src={card.image}
              alt={card.alt}
              fill
              sizes="(max-width: 767px) 84vw, 54vw"
            />
          ) : (
            <span className="club-intro__placeholder">{card.imageLabel}</span>
          )}
          <span className="club-intro__media-index">{card.kicker}</span>
        </div>

        <div className="club-intro__card-copy">
          <h4>{card.title}</h4>
          <p>{card.copy}</p>
          {card.status ? <span className="club-intro__status">{card.status}</span> : null}
        </div>
      </article>
    </li>
  );
}

export function ClubIntro({ dimensions, sharedCapabilities, copy, locale }: ClubIntroProps) {
  const carouselRefs = useRef(new Map<string, HTMLOListElement>());
  const carouselFrames = useRef(new Map<string, number>());
  const [activeDimension, setActiveDimension] = useState(0);
  const [activeCards, setActiveCards] = useState<Record<string, number>>({});
  const [cardProgress, setCardProgress] = useState<Record<string, number>>({});

  useEffect(() => () => {
    carouselFrames.current.forEach((frame) => window.cancelAnimationFrame(frame));
  }, []);

  const goToDimension = (index: number) => {
    setActiveDimension(index);
  };

  const handleDimensionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keyByDirection: Record<string, number> = {
      ArrowRight: (index + 1) % dimensions.length,
      ArrowDown: (index + 1) % dimensions.length,
      ArrowLeft: (index - 1 + dimensions.length) % dimensions.length,
      ArrowUp: (index - 1 + dimensions.length) % dimensions.length,
      Home: 0,
      End: dimensions.length - 1,
    };
    const nextIndex = keyByDirection[event.key];
    if (nextIndex === undefined) return;
    event.preventDefault();
    goToDimension(nextIndex);
    requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(`[aria-controls="${dimensions[nextIndex].id}-panel"]`)?.focus();
    });
  };

  const updateActiveCard = (dimension: IntroDimension, carousel: HTMLOListElement) => {
    const previousFrame = carouselFrames.current.get(dimension.id);
    if (previousFrame) window.cancelAnimationFrame(previousFrame);

    const frame = window.requestAnimationFrame(() => {
      const cards = Array.from(carousel.children) as HTMLElement[];
      const maxScroll = Math.max(carousel.scrollWidth - carousel.clientWidth, 1);
      const progress = clamp(carousel.scrollLeft / maxScroll);
      const nearest = cards.reduce((bestIndex, card, index) => {
        const bestDistance = Math.abs(cards[bestIndex].offsetLeft - carousel.scrollLeft);
        const distance = Math.abs(card.offsetLeft - carousel.scrollLeft);
        return distance < bestDistance ? index : bestIndex;
      }, 0);

      setActiveCards((current) => current[dimension.id] === nearest
        ? current
        : { ...current, [dimension.id]: nearest });
      setCardProgress((current) => current[dimension.id] === progress
        ? current
        : { ...current, [dimension.id]: progress });
      carouselFrames.current.delete(dimension.id);
    });

    carouselFrames.current.set(dimension.id, frame);
  };

  const goToCard = (dimension: IntroDimension, index: number, behavior: ScrollBehavior) => {
    const carousel = carouselRefs.current.get(dimension.id);
    const card = carousel?.children[index] as HTMLElement | undefined;
    if (!carousel || !card) return;

    carousel.scrollTo({ left: card.offsetLeft, behavior });
    setActiveCards((current) => ({ ...current, [dimension.id]: index }));
  };

  return (
    <section
      className="club-intro"
      id="room"
      data-dimension={dimensions[activeDimension]?.id}
      data-locale={locale}
    >
      <div className="club-intro__track">
        <div className="club-intro__stage">
          <div className="club-intro__grid" aria-hidden="true" />

          <header className="club-intro__masthead">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2><TitleLines lines={copy.title} /></h2>
          </header>

          <ol className="club-intro__dimension-list" aria-label={copy.dimensions} role="tablist">
            {dimensions.map((dimension, index) => (
              <li key={dimension.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeDimension === index}
                  aria-controls={`${dimension.id}-panel`}
                  tabIndex={activeDimension === index ? 0 : -1}
                  onClick={() => goToDimension(index)}
                  onKeyDown={(event) => handleDimensionKeyDown(event, index)}
                >
                  <span>{dimension.number}</span>
                  <strong>{dimension.label}</strong>
                </button>
              </li>
            ))}
          </ol>

          <div className="club-intro__matrix">
            {dimensions.map((dimension, dimensionIndex) => {
              const isActive = activeDimension === dimensionIndex;
              const activeCard = activeCards[dimension.id] ?? 0;

              return (
                <section
                  key={dimension.id}
                  className="club-intro__dimension"
                  id={`${dimension.id}-panel`}
                  role="tabpanel"
                  tabIndex={isActive ? 0 : -1}
                  aria-hidden={!isActive}
                  aria-labelledby={`${dimension.id}-title`}
                  hidden={!isActive}
                >
                  <header className="club-intro__dimension-heading">
                    <p className="eyebrow">{dimension.number} / {dimension.label}</p>
                    <h3 id={`${dimension.id}-title`}>{dimension.title}</h3>
                    <p className="club-intro__dimension-description">{dimension.description}</p>
                  </header>

                  <section
                    className="club-intro__carousel-shell"
                    style={{
                      '--card-progress': cardProgress[dimension.id] ?? 0,
                    } as CSSProperties}
                  >
                    <ol
                      ref={(node) => {
                        if (node) carouselRefs.current.set(dimension.id, node);
                        else carouselRefs.current.delete(dimension.id);
                      }}
                      className="club-intro__carousel"
                      aria-label={dimension.label}
                      onScroll={(event) => updateActiveCard(dimension, event.currentTarget)}
                    >
                      {dimension.cards.map((card, index) => (
                        <MatrixCard
                          key={card.id}
                          card={card}
                          index={index}
                          active={activeCard === index}
                        />
                      ))}
                    </ol>

                    <div className="club-intro__carousel-controls">
                      <span className="club-intro__card-meter" aria-hidden="true"><i /></span>
                      <div>
                        <span className="club-intro__position" aria-live="polite">
                          {String(activeCard + 1).padStart(2, '0')} / {String(dimension.cards.length).padStart(2, '0')}
                        </span>
                        <button
                          type="button"
                          aria-label={copy.previousCard}
                          disabled={activeCard === 0}
                          tabIndex={isActive ? 0 : -1}
                          onClick={(event) => goToCard(
                            dimension,
                            activeCard - 1,
                            event.detail === 0 ? 'auto' : 'smooth',
                          )}
                        >
                          <span aria-hidden="true">←</span>
                        </button>
                        <button
                          type="button"
                          aria-label={copy.nextCard}
                          disabled={activeCard === dimension.cards.length - 1}
                          tabIndex={isActive ? 0 : -1}
                          onClick={(event) => goToCard(
                            dimension,
                            activeCard + 1,
                            event.detail === 0 ? 'auto' : 'smooth',
                          )}
                        >
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </div>
                  </section>

                </section>
              );
            })}

            <aside className="club-intro__capabilities" aria-label={copy.sharedCapabilities}>
              <span>{copy.sharedCapabilities}</span>
              <ul>
                {sharedCapabilities.map((capability) => <li key={capability}>{capability}</li>)}
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
