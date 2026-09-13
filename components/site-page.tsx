'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AlbumArchive } from '@/components/album-archive';
import { ClubIntro } from '@/components/club-intro';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { PandaPet } from '@/components/panda-pet';
import { SignalFieldLoader } from '@/components/signal-field-loader';
import { TitleLines } from '@/components/title-lines';
import { useI18n } from '@/components/i18n-provider';

export function SitePage() {
  const { copy, locale, studio } = useI18n();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [petDocked, setPetDocked] = useState(false);
  const homeRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down' | null>(null);
  const directionDistance = useRef(0);

  useEffect(() => {
    const handlePetScroll = () => {
      const nextDocked = window.scrollY > 48;
      setPetDocked((current) =>
        current === nextDocked ? current : nextDocked,
      );
    };

    handlePetScroll();
    window.addEventListener('scroll', handlePetScroll, { passive: true });
    return () => window.removeEventListener('scroll', handlePetScroll);
  }, []);

  useEffect(() => {
    const pointerQuery = window.matchMedia(
      '(min-width: 768px) and (hover: hover) and (pointer: fine)',
    );

    lastScrollY.current = window.scrollY;

    const isHomeVisible = () =>
      (homeRef.current?.getBoundingClientRect().bottom ?? 0) > 88;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      // Touch screens and narrow layouts keep navigation directly accessible.
      if (!pointerQuery.matches || isHomeVisible()) {
        lastScrollY.current = currentScrollY;
        scrollDirection.current = null;
        directionDistance.current = 0;
        setHeaderVisible(true);
        return;
      }

      if (Math.abs(delta) < 1) return;

      const nextDirection = delta > 0 ? 'down' : 'up';
      if (nextDirection !== scrollDirection.current) {
        directionDistance.current = 0;
        scrollDirection.current = nextDirection;
      }
      directionDistance.current += Math.abs(delta);
      lastScrollY.current = currentScrollY;

      if (currentScrollY <= 8) {
        directionDistance.current = 0;
        setHeaderVisible(true);
      } else if (directionDistance.current >= 12 && nextDirection === 'down') {
        directionDistance.current = 0;
        setHeaderVisible(false);
      }
    };

    // The header is off-screen when hidden, so listen on the window instead of
    // the header itself. The top 88px act as its reveal/hover area.
    const handleMouseMove = (event: MouseEvent) => {
      if (!pointerQuery.matches || isHomeVisible() || event.clientY <= 88) {
        setHeaderVisible(true);
      } else {
        setHeaderVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    pointerQuery.addEventListener('change', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      pointerQuery.removeEventListener('change', handleScroll);
    };
  }, []);

  return (
    <main data-locale={locale}>
      <div className="global-signal" aria-hidden="true">
        <SignalFieldLoader />
      </div>
      <header
        className={`site-header page-shell${headerVisible ? '' : ' site-header--hidden'}`}
      >
        <a className="wordmark" href="#top" aria-label={copy.brandHome}>
          <span className="wordmark-type">
            <Image
              src="/brand/typo.png"
              alt="Panda Studio"
              width={1577}
              height={492}
              priority
            />
          </span>
          <span className="wordmark-mark" aria-hidden="true" />
        </a>
        <div className="header-tools">
          <nav aria-label={copy.navigation.primary}>
            <a href="#records">{copy.navigation.records}</a>
          </nav>
          <div className="appearance-tools">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <PandaPet key={locale} docked={petDocked} />

      <section ref={homeRef} className="hero" id="top" data-locale={locale}>
        <div className="hero-copy page-shell">
          <p className="eyebrow">{copy.hero.eyebrow}</p>
          <h1>
            <TitleLines lines={copy.hero.title} />
          </h1>
          <div className="hero-notes">
            <p>{copy.hero.description}</p>
            <a className="text-link" href="#records">
              {copy.hero.cta} <span aria-hidden="true">↘</span>
            </a>
          </div>
        </div>

        <div className="hero-index page-shell" aria-hidden="true">
          <span>NO. 000</span>
          <span>32°N / 118°E</span>
          <span>{copy.hero.indexSignal}</span>
        </div>
      </section>

      <ClubIntro
        dimensions={studio.introDimensions}
        sharedCapabilities={studio.sharedCapabilities}
        copy={copy.intro}
        locale={locale}
      />

      <section className="records-section page-shell" id="records">
        <div className="section-heading">
          <p className="eyebrow">{copy.records.eyebrow}</p>
          <h2>
            <TitleLines lines={copy.records.title} />
          </h2>
          <p>{copy.records.description}</p>
        </div>
        <AlbumArchive albums={studio.albums} copy={copy.archive} />
      </section>

      <footer className="site-footer page-shell">
        <Image src="/brand/icon.png" alt="" width={1154} height={1029} />
        <p>{copy.footer.tagline}</p>
        <a href="#top">{copy.footer.backToTop}</a>
      </footer>
    </main>
  );
}
