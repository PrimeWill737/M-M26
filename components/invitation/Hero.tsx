import { weddingConfig as c } from "@/config/wedding";
import { displayDate, displayWeekday } from "@/utils/calendar";
import { Botanical } from "../ui/Botanical";
import { Icon } from "../ui/Icon";
export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-top">
        <span>{c.brand.monogram}</span>
        <span>THE WEDDING INVITATION</span>
        <span>EST. {c.wedding.date.slice(0, 4)}</span>
      </div>
      <Botanical className="hero-botanical hero-botanical--left" />
      <Botanical className="hero-botanical hero-botanical--right" />
      <div className="hero-center">
        <p className="eyebrow">With full hearts & a lot of praise to God</p>
        <p className="hero-prelude">We’re getting married</p>
        <h1 tabIndex={-1} id="hero-title">
          <span>{c.brand.brideFirst}</span>
          <em>&</em>
          <span>{c.brand.groomFirst}</span>
        </h1>
        <div className="hero-date">
          <span>{displayWeekday(c.wedding)}</span>
          <strong>{displayDate(c.wedding)}</strong>
          <span>{c.brand.location}</span>
        </div>
        <a href="#families" className="scroll-cue">
          <span>Our forever starts here</span>
          <span aria-hidden="true">
            <Icon name="arrowDown" />
          </span>
        </a>
      </div>
      <div className="hero-bottom">
        <span>TWO HEARTS. ONE BEAUTIFUL BEGINNING.</span>
        <span>09°55′ N · 08°53′ E</span>
      </div>
    </section>
  );
}
