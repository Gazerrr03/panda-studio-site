'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import type { IntroAct, IntroScene } from '@/content/studio';
import type { Locale } from '@/content/i18n';
import type { SiteCopy } from '@/content/i18n';
import { TitleLines } from '@/components/title-lines';

type ClubIntroProps = {
  acts: IntroAct[];
  copy: SiteCopy['intro'];
  locale: Locale;
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothStep = (value: number) => value * value * (3 - 2 * value);

// Keep scroll input native, but let the visual playhead catch up at a controlled rate.
// This filters trackpad/touch momentum without making the page feel like it is hijacking scroll.
const PLAYHEAD_RESPONSE_MS = 180;
const PLAYHEAD_MAX_PROGRESS_PER_SECOND = 1.8;
const PLAYHEAD_EPSILON = 0.0005;

function advancePlayhead(current: number, target: number, elapsedMs: number) {
  const delta = target - current;
  if (Math.abs(delta) <= PLAYHEAD_EPSILON) return target;

  const response = 1 - Math.exp(-elapsedMs / PLAYHEAD_RESPONSE_MS);
  const easedStep = Math.abs(delta) * response;
  const maxStep = PLAYHEAD_MAX_PROGRESS_PER_SECOND * elapsedMs / 1000;
  const step = Math.min(easedStep, maxStep);

  return current + Math.sign(delta) * step;
}

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
    '--scene-alpha': 0,
    '--copy-progress': 0,
    '--scene-lift': '22vh',
    '--scene-copy-lift': '32vh',
    '--scene-scale': 0.97,
  } as CSSProperties;

  return (
    <article
      ref={register}
      className="club-intro__scene"
      data-act={scene.act}
      data-side={scene.side}
      data-reveal-start={scene.reveal[0]}
      data-reveal-end={scene.reveal[1]}
      style={style}
    >
      <div className="club-intro__visual">
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
        </div>
      </div>
      <div className="club-intro__body">
        <p>{scene.copy}</p>
      </div>
    </article>
  );
}

export function ClubIntro({ acts, copy, locale }: ClubIntroProps) {
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
    let visualProgress = 0;
    let lastFrameTime: number | null = null;

    const getTargetProgress = () => {
      if (reduceMotion) return 1;

      const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
      return clamp(-section.getBoundingClientRect().top / distance);
    };

    const render = (timestamp: number) => {
      frame = 0;
      if (mobile.matches) return;
      if (!inRange && !reduceMotion) return;

      const targetProgress = getTargetProgress();
      if (lastFrameTime === null || reduceMotion) {
        visualProgress = targetProgress;
      } else {
        const elapsedMs = Math.min(Math.max(timestamp - lastFrameTime, 1), 100);
        visualProgress = advancePlayhead(visualProgress, targetProgress, elapsedMs);
      }
      lastFrameTime = timestamp;

      const progress = visualProgress;
      section.style.setProperty('--club-progress', String(progress));
      const mastheadProgress = reduceMotion ? 0 : smoothStep(clamp((progress - 0.94) / 0.06));
      section.style.setProperty('--masthead-alpha', String(1 - mastheadProgress));
      section.style.setProperty('--masthead-lift', '0vh');
      section.dataset.act = progress < 0.28 ? 'room' : progress < 0.67 ? 'gear' : 'signal';

      scenes.forEach((scene) => {
        const element = sceneElements.current.get(scene.id);
        if (!element) return;

        const [start, end] = scene.reveal;
        const windowLength = Math.max(end - start, 0.001);
        const enterDuration = Math.min(0.028, windowLength * 0.3);
        const enterProgress = reduceMotion
          ? 1
          : smoothStep(clamp((progress - start) / enterDuration));
        const exitDuration = mobile.matches ? 0.028 : 0.03;
        const exitProgress = reduceMotion || progress <= end
          ? 0
          : smoothStep(clamp((progress - end) / exitDuration));
        const copyStart = start + Math.min(0.026, windowLength * 0.28);
        const copyDuration = Math.min(0.032, windowLength * 0.34);
        const copyProgress = reduceMotion
          ? 1
          : smoothStep(clamp((progress - copyStart) / copyDuration));
        const exitAlpha = 1 - exitProgress;
        const alpha = enterProgress * exitAlpha;
        const imageLift = (1 - enterProgress) * 22 - exitProgress * 28;
        const bodyLift = (1 - copyProgress) * 32 - exitProgress * 28;

        element.style.setProperty('--scene-alpha', String(alpha));
        element.style.setProperty('--scene-lift', `${imageLift}vh`);
        element.style.setProperty('--scene-copy-lift', `${bodyLift}vh`);
        element.style.setProperty('--scene-scale', String(0.97 + enterProgress * 0.03));
        element.style.setProperty('--copy-progress', String(copyProgress * exitAlpha));
      });

      if (!reduceMotion && Math.abs(targetProgress - visualProgress) > PLAYHEAD_EPSILON) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const update = () => {
      if (mobile.matches || frame || (!inRange && !reduceMotion)) return;
      frame = window.requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inRange = entry.isIntersecting;

        if (!inRange && !reduceMotion) {
          visualProgress = getTargetProgress();
          lastFrameTime = null;
        }
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
    <section
      ref={sectionRef}
      className="club-intro"
      id="room"
      data-act="room"
      data-locale={locale}
    >
      <div className="club-intro__track">
        <div className="club-intro__stage">
          <div className="club-intro__grid" aria-hidden="true" />

          <header className="club-intro__masthead">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2>
              <TitleLines lines={copy.title} />
            </h2>
          </header>

          <ol className="club-intro__act-list" aria-label={copy.chapters}>
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

        </div>
      </div>
    </section>
  );
}
