import Image from "next/image";
import { weddingConfig as c } from "@/config/wedding";
import { displayDate, displayTime } from "@/utils/calendar";
import { Gallery } from "./Gallery";
import { CouplePortraits } from "@/components/invitation/CouplePortraits";
import { PreweddingHighlights } from "@/components/invitation/PreweddingHighlights";
import { CelebrationEffects } from "./CelebrationEffects";

export function Celebration({ preview = false }: { preview?: boolean }) {
  return (
    <main className="celebration">
      <CelebrationEffects preview={preview} />
      {preview && (
        <aside className="album-preview">
          Version two preview · Goes live 18 December 2026, 1:30 pm WAT.{" "}
          <a href="/">Current invitation</a>
        </aside>
      )}
      <nav className="album-nav" aria-label="Celebration navigation">
        <a className="album-monogram" href="#home">
          {c.brand.monogram}
          <span>THE FOREVER ALBUM</span>
        </a>
        <div>
          <a href="#memories">The gallery</a>
          <a href="#celebrations">The celebrations</a>
          <a className="album-button" href="#upload">
            Add your moments
          </a>
        </div>
      </nav>
      <section className="album-hero" id="home">
        <div className="album-hero-copy">
          <span className="album-kicker">
            18 & 19 DECEMBER 2026 · JOS, NIGERIA
          </span>
          <h1>
            A beautiful day.
            <br />
            <em>A lifetime</em>
            <br />
            to remember.
          </h1>
          <p className="album-couple">
            {c.brand.brideFirst} <i>&</i> {c.brand.groomFirst}
          </p>
          <p>
            For every happy tear, every dance, every little moment. Our
            celebration, through the eyes of the people we love.
          </p>
          <a className="album-button" href="#memories">
            Step inside our album
          </a>
          <span className="album-hero-note">
            Made with love. Kept for always.
          </span>
        </div>
        <div className="album-hero-photo">
          <Image
            src="/images/couple/portrait-4.webp"
            alt="Meda and Marrion embracing in their traditional outfits"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 55vw"
          />
          <div className="album-photo-caption">
            <span>TOGETHER IS OUR FAVOURITE PLACE</span>
            <p>The beginning of our forever.</p>
          </div>
        </div>
      </section>
      <div className="album-ribbon">
        <span>Two families</span>
        <i>✦</i>
        <span>One beautiful beginning</span>
        <i>✦</i>
        <span>A whole lot of love</span>
      </div>
      <Gallery preview={preview} />
      <section className="album-events" id="celebrations">
        <div className="album-section-heading">
          <span className="album-kicker">
            THE DAYS THAT BROUGHT US TOGETHER
          </span>
          <h2>
            One love. <em>Two celebrations.</em>
          </h2>
          <p>
            With {c.families.bride} and {c.families.groom}.
          </p>
        </div>
        <div className="album-event-grid">
          {[c.traditional, c.wedding].map((event, i) => (
            <article
              key={event.id}
              className={
                i === 0 ? "album-event album-event--trad" : "album-event"
              }
            >
              <Image
                src={`/images/couple/portrait-${i === 0 ? 3 : 1}.webp`}
                alt={
                  i === 0
                    ? "Meda and Marrion in traditional attire"
                    : "Meda and Marrion dressed in black"
                }
                width={772}
                height={1080}
                sizes="(max-width: 760px) 100vw, 30vw"
              />
              <div>
                <span className="album-kicker">
                  {i === 0 ? "OUR ROOTS, OUR JOY" : "OUR VOWS, OUR FOREVER"}
                </span>
                <h3>{i === 0 ? "The traditional" : "The wedding"}</h3>
                <p>
                  {displayDate(event)}
                  <br />
                  {event.timeConfirmed
                    ? `${displayTime(event)} WAT`
                    : "Time to be confirmed with the family"}
                </p>
                <strong>{event.venue}</strong>
                <p>{event.address}</p>
                <a
                  href={
                    event.mapUrl ||
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapQuery)}`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Open directions
                </a>
                <div
                  className="album-swatches"
                  aria-label="Celebration colours"
                >
                  {c.colors[i === 0 ? "traditional" : "wedding"]
                    .filter((_, index) => index % 2 === 0)
                    .map((shade) => (
                      <span key={shade.name}>
                        <i style={{ backgroundColor: shade.hex }} />
                        {shade.name}
                      </span>
                    ))}
                </div>
                <p className="album-attire">{event.attire.join(" · ")}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="album-love-note">
        <Image
          src="/images/couple/portrait-2.webp"
          alt="Meda and Marrion sharing a portrait together"
          fill
          sizes="100vw"
        />
        <div>
          <span className="album-kicker">TO OUR FAVOURITE PEOPLE</span>
          <h2>
            You made it
            <br />
            <em>unforgettable.</em>
          </h2>
          <p>
            Thank you for showing up, praying with us, dancing with us, and
            filling these days with love. This little corner of the internet
            belongs to all of us.
          </p>
          <span className="album-signature">Meda & Marrion</span>
        </div>
      </section>
      <CouplePortraits />
      <PreweddingHighlights />
      <footer className="album-footer">
        <a className="album-monogram" href="#home">
          {c.brand.monogram}
        </a>
        <p>
          {c.brand.bride} & {c.brand.groom}
          <br />
          18 & 19 December 2026 · {c.brand.location}
        </p>
        <p>
          Come back for the memories.
          <br />
          <em>Stay for the love.</em>
        </p>
        <a href="#upload">Share a moment</a>
      </footer>
      <div className="album-developer">
        Made with love ·{" "}
        <a href={c.links.developer} target="_blank" rel="noopener noreferrer">
          Developer William
        </a>
      </div>
    </main>
  );
}
