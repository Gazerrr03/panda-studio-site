import Image from 'next/image';
import { SignalFieldLoader } from '@/components/signal-field-loader';
import { AlbumArchive } from '@/components/album-archive';
import { albums, roles } from '@/content/studio';

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <SignalFieldLoader />

        <header className="site-header page-shell">
          <a className="wordmark" href="#top" aria-label="Panda Studio home">
            <Image
              src="/brand/typo.png"
              alt="Panda Studio"
              width={1577}
              height={492}
              priority
            />
          </a>
          <nav aria-label="Primary navigation">
            <a href="#records">Records</a>
            <a href="#auditions">Auditions</a>
          </nav>
        </header>

        <div className="hero-copy page-shell">
          <p className="eyebrow">Independent creative studio · Est. somewhere underground</p>
          <h1>
            Different noise.
            <br />
            One loud room.
          </h1>
          <div className="hero-notes">
            <p>
              We gather people who do not fit neatly into the usual rankings—then make
              strange, useful things together.
            </p>
            <a className="text-link" href="#records">
              Play the records <span aria-hidden="true">↘</span>
            </a>
          </div>
        </div>

        <div className="hero-index page-shell" aria-hidden="true">
          <span>NO. 000</span>
          <span>32°N / 118°E</span>
          <span>SILENT SIGNAL</span>
        </div>
      </section>

      <section className="records-section page-shell" id="records">
        <div className="section-heading">
          <p className="eyebrow">Archive / Records</p>
          <h2>Things we made,<br />pressed as albums.</h2>
          <p>Open a sleeve to read the project like liner notes—not as a wall of case-study cards.</p>
        </div>
        <AlbumArchive albums={albums} />
      </section>

      <section className="auditions-section" id="auditions">
        <div className="page-shell">
          <div className="section-heading auditions-heading">
            <p className="eyebrow">Open call / Auditions</p>
            <h2>We are not hiring.<br />We are forming a band.</h2>
            <p>Titles are aliases, not boxes. Bring another instrument if these two do not sound like you.</p>
          </div>

          <div className="role-list">
            {roles.map((role, index) => (
              <article className="role" key={role.instrument}>
                <span className="role-number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p className="eyebrow">{role.alias}</p>
                  <h3>{role.instrument}</h3>
                </div>
                <div className="role-copy">
                  <strong>{role.call}</strong>
                  <p>{role.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="audition-callout">
            <p className="eyebrow">Rehearsal room</p>
            <p>Show us the one thing you made that still feels a little too strange for the usual portfolio.</p>
            <span>CONTACT CHANNEL / TO BE ADDED</span>
          </div>
        </div>
      </section>

      <footer className="site-footer page-shell">
        <Image src="/brand/icon.png" alt="" width={1154} height={1029} />
        <p>Different noise. One loud room.</p>
        <a href="#top">Back to top</a>
      </footer>
    </main>
  );
}
