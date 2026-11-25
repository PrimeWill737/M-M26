import Image from "next/image";

export function CouplePortraits() {
  return (
    <section className="couple-story" aria-labelledby="couple-story-title">
      <div className="couple-story-heading">
        <span className="eyebrow">A glimpse of us</span>
        <h2 id="couple-story-title">
          In every season,
          <br />
          <em>always you.</em>
        </h2>
        <p>
          Two hearts, a shared faith, and a lifetime of little moments ahead.
        </p>
      </div>
      <div className="couple-portraits">
        {[4, 1, 2, 3].map((n, i) => (
          <figure key={n}>
            <Image
              src={`/images/couple/portrait-${n}.webp`}
              alt={
                i === 0 || i === 3
                  ? "Meda and Marrion together in traditional attire"
                  : "Meda and Marrion in elegant black outfits"
              }
              width={772}
              height={1080}
              sizes="(max-width: 600px) 80vw, 25vw"
            />
            <figcaption>
              {
                [
                  "Rooted in love",
                  "Side by side",
                  "My favourite person",
                  "Our beautiful beginning",
                ][i]
              }
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
