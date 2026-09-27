import { weddingConfig as c } from "@/config/wedding";
import { SectionHeading } from "../ui/SectionHeading";
import { ColorSwatches } from "../ui/ColorSwatch";
export function DressCode() {
  return (
    <section id="colors" className="dress-code section reveal">
      <SectionHeading eyebrow="Come beautifully as you are">
        Colors of Our Celebration
      </SectionHeading>
      <p>A little inspiration for what to wear. Make these shades your own.</p>
      <div className="dress-cards">
        <article>
          <span className="eyebrow">The white wedding</span>
          <h3>Greens & Purples</h3>
          <p>{c.wedding.attire.join(" · ")}</p>
          <ColorSwatches shades={c.colors.wedding} />
        </article>
        <article>
          <span className="eyebrow">The traditional celebration</span>
          <h3>Earth & Warmth</h3>
          <p>{c.traditional.attire.join(" · ")}</p>
          <ColorSwatches shades={c.colors.traditional} />
        </article>
      </div>
      <span className="small-note">Touch a shade to discover its name.</span>
    </section>
  );
}
