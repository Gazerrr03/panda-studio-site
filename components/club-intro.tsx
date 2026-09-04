'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import type { IntroAct, IntroScene } from '@/content/studio';

type ClubIntroProps = {
  acts: IntroAct[];
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothStep = (value: number) => value * value * (3 - 2 * value);

function SceneCard({
  scene,
  register,
}: {
  scene: IntroScene;
  register: (node: HTMLElement | null) => void;
}) {
  const style = {
    '--scene-x': scene.desktop.x,
    '--scene-y': scene.desktop.y,
    '--scene-width': scene.desktop.width,
    '--scene-rotate': scene.desktop.rotate,
    '--scene-mobile-x': scene.mobile.x,
    '--scene-mobile-y': scene.mobile.y,
    '--scene-mobile-width': scene.mobile.width,
    '--scene-mobile-rotate': scene.mobile.rotate,
    '--scene-progress': 1,
    '--scene-alpha': 1,
    '--copy-progress': 1,
    '--scene-lift': '0vh',
    '--scene-scale': 1,
    '--copy-lift': '0px',
  } as CSSProperties;

  return (
    <article
      ref={register}
      className="club-intro__scene"
      data-act={scene.act}
      data-reveal-start={scene.reveal[0]}
      data-reveal-end={scene.reveal[1]}
      style={style}
    >
      <div className={`club-intro__media club-intro__media--${scene.imageTone}`}>
        {scene.image ? (
          <Image
            className="club-intro__image"
            src={scene.image}
            alt={scene.alt}
            fill
            sizes="(max-width: 767px) 84vw, 38vw"
          />
        ) : (
          <span className="club-intro__placeholder">{scene.imageLabel}</span>
        )}
        <span className="club-intro__media-index">{scene.kicker}</span>
      </div>
      <div className="club-intro__caption">
        <p className="eyebrow">{scene.kicker}</p>
        <h3>{scene.title}</h3>
        <p>{scene.copy}</p>
      </div>
    </article>
  );
}

export function ClubIntro({ acts }: ClubIntroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneElements = useRef(new Map<string, HTMLElement>());
  const scenes = useMemo(() => acts.flatMap((act) => act.scenes), [acts]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    let inRange = false;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 767px)');

    const update = () => {
      if (frame || (!inRange && !reduceMotion)) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
        const progress = reduceMotion
          ? 1
          : clamp(-section.getBoundingClientRect().top / distance);

        section.style.setProperty('--club-progress', String(progress));
        const mastheadProgress = reduceMotion ? 0 : smoothStep(clamp((progress - 0.02) / 0.18));
        section.style.setProperty('--masthead-alpha', String(1 - mastheadProgress));
        section.style.setProperty('--masthead-lift', `${-mastheadProgress * 3}vh`);
        section.dataset.act = progress < 0.3 ? 'room' : progress < 0.68 ? 'gear' : 'signal';

        scenes.forEach((scene) => {
          const element = sceneElements.current.get(scene.id);
          if (!element) return;

          const [start, end] = scene.reveal;
          const local = reduceMotion ? 1 : clamp((progress - start) / Math.max(end - start, 0.001));
          const eased = smoothStep(local);
          let exitAlpha = 1;

          if (!reduceMotion && progress > end) {
            const exitProgress = mobile.matches
              ? clamp((progress - end) / 0.16)
              : clamp((progress - end) / 0.22);
            exitAlpha = mobile.matches ? 1 - exitProgress : 1 - exitProgress * 0.92;
          }

          const copyStart = start + Math.min(0.07, (end - start) * 0.3);
          const copyProgress = reduceMotion
            ? 1
            : smoothStep(clamp((progress - copyStart) / Math.max(end - copyStart, 0.001)));

          const alpha = eased * exitAlpha;
          element.style.setProperty('--scene-progress', String(eased));
          element.style.setProperty('--scene-lift', `${(1 - eased) * 18}vh`);
          element.style.setProperty('--scene-scale', String(0.96 + eased * 0.04));
          element.style.setProperty('--scene-alpha', String(alpha));
          element.style.setProperty('--copy-lift', `${(1 - copyProgress) * 18}px`);
          element.style.setProperty('--copy-progress', String(copyProgress * exitAlpha));
        });
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inRange = entry.isIntersecting;
        if (inRange || reduceMotion) update();
      },
      { rootMargin: '100% 0px' },
    );

    observer.observe(section);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [scenes]);

  return (
    <section ref={sectionRef} className="club-intro" id="room" data-act="room">
      <div className="club-intro__track">
        <div className="club-intro__stage">
          <div className="club-intro__grid" aria-hidden="true" />

          <header className="club-intro__masthead">
            <p className="eyebrow">Club intro / Three acts</p>
            <h2>Come inside.<br />Find your instrument.</h2>
          </header>

          <ol className="club-intro__act-list" aria-label="Club introduction chapters">
            {acts.map((act) => (
              <li key={act.id} data-act-item={act.id}>
                <span>{act.number}</span>
                <strong>{act.label}</strong>
              </li>
            ))}
          </ol>

          <div className="club-intro__scenes">
            {scenes.map((scene) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                register={(node) => {
                  if (node) sceneElements.current.set(scene.id, node);
                  else sceneElements.current.delete(scene.id);
                }}
              />
            ))}
          </div>

          <p className="club-intro__footer-note eyebrow">Scroll the room / replace the placeholders</p>
        </div>
      </div>
    </section>
  );
}
