"use client";
import { useState } from "react";
import { weddingConfig as c } from "@/config/wedding";
import { SectionHeading } from "../ui/SectionHeading";

const blessings = [
  "May your table be full, your home be gentle, and your love keep choosing tomorrow.",
  "May laughter find you in the kitchen, and peace find you at the end of every day.",
  "May the years ahead be kind, and the ordinary days be the ones you treasure most.",
  "May your home stay warm to friends, and quieter still when it is only the two of you.",
  "May you never run out of reasons to reach for each other’s hand.",
  "May joy be your weekday, and gratitude your Sunday.",
  "May every season of this marriage teach you something tender about the other.",
  "May your children, when they come, know they were prayed for.",
  "May disagreements end in understanding, and celebrations last longer than planned.",
  "May you grow old still curious about one another.",
  "May your love be a shelter, and your home a place people remember kindly.",
  "May patience arrive before pride, and forgiveness before the sun goes down.",
  "May you dance in the sitting room when no one else is watching.",
  "May the God who brought you together keep you gentle with each other.",
  "May your names sound sweet in each other’s mouth for all the years to come.",
  "May Marrion & Meda find rest in one another after every long day.",
  "May your marriage be a garden: watered, weeded, and still full of surprise.",
  "May friends become family, and family remain a joy to welcome.",
  "May you keep a little mischief, and a great deal of mercy.",
  "May the story you begin today still make you smile when you tell it years from now.",
  "May your prayers be answered in ways more beautiful than you asked.",
  "May you be brave together, and soft when the world has been hard.",
  "May every anniversary feel like a small wedding of its own.",
  "May your love outlast every worry you carried to the altar.",
  "May you cook, travel, argue, and forgive, and still choose the same side.",
  "May the music of this day follow you into an ordinary lifetime.",
  "May your union be a light for the families who stood behind you today.",
  "May you wake grateful, and sleep knowing you are loved.",
  "May nothing you build together be too heavy for two willing hearts.",
  "May forever, for Marrion & Meda, be a daily kindness.",
];

function anotherBlessing(previous: number | null) {
  let next = Math.floor(Math.random() * blessings.length);
  if (previous !== null && next === previous) {
    next = (next + 1) % blessings.length;
  }
  return next;
}

export function BlessingDraw() {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  function draw() {
    setIndex((previous) => anotherBlessing(previous));
  }

  return (
    <section className="blessing-draw section reveal" id="blessing">
      <SectionHeading eyebrow="A little game for our guests">
        Draw a blessing
      </SectionHeading>
      <p>
        Turn the card for a blessing for {c.brand.brideFirst} and{" "}
        {c.brand.groomFirst}. Draw again for another.
      </p>
      <button
        type="button"
        className={`blessing-card ${open ? "is-open" : ""}`}
        onClick={() => {
          if (!open) draw();
        }}
        aria-pressed={open}
      >
        <span className="blessing-card-inner">
          <span className="blessing-face blessing-face--back">
            <span className="eyebrow">{c.brand.monogram}</span>
            <span>Tap to draw</span>
          </span>
          <span className="blessing-face blessing-face--front">
            {open ? blessings[index] : ""}
          </span>
        </span>
      </button>
      {open && (
        <button className="text-link" type="button" onClick={draw}>
          Draw another
        </button>
      )}
    </section>
  );
}
