"use client";

import { useEffect, useRef, useState } from "react";
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
  "May the music of this day follow you into an ordinary Tuesday.",
  "May your union be a light for the families who stood behind you today.",
  "May you wake grateful, and sleep knowing you are loved.",
  "May nothing you build together be too heavy for two willing hearts.",
  "May forever, for Marrion & Meda, be a daily kindness.",
];

const kinds = [
  { pair: "rose", label: "Rose", tone: "rose" },
  { pair: "leaf", label: "Leaf", tone: "leaf" },
  { pair: "bell", label: "Bell", tone: "bell" },
  { pair: "ring", label: "Ring", tone: "ring" },
  { pair: "dove", label: "Dove", tone: "dove" },
  { pair: "bow", label: "Bow", tone: "bow" },
] as const;

type Card = {
  key: string;
  pair: (typeof kinds)[number]["pair"];
  label: string;
  tone: string;
};

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function deal(): Card[] {
  return shuffle(
    kinds.flatMap((kind) => [
      { ...kind, key: `${kind.pair}-a-${Math.random()}` },
      { ...kind, key: `${kind.pair}-b-${Math.random()}` },
    ]),
  );
}

function anotherBlessing(previous: number | null) {
  let next = Math.floor(Math.random() * blessings.length);
  if (previous !== null && next === previous) {
    next = (next + 1) % blessings.length;
  }
  return next;
}

export function MemoryMatch() {
  const [cards, setCards] = useState<Card[] | null>(null);
  const [up, setUp] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [turns, setTurns] = useState(0);
  const [locked, setLocked] = useState(false);
  const [blessing, setBlessing] = useState<number | null>(null);
  const timer = useRef<number | null>(null);
  const lastBlessing = useRef<number | null>(null);
  const upRef = useRef<number[]>([]);
  const lockedRef = useRef(false);
  const matchedRef = useRef<string[]>([]);

  useEffect(() => {
    setCards(deal());
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const done = matched.length === kinds.length;

  function flip(index: number) {
    if (!cards || lockedRef.current || matchedRef.current.length === kinds.length) return;
    const card = cards[index];
    if (matchedRef.current.includes(card.pair) || upRef.current.includes(index)) return;

    const next = [...upRef.current, index];
    upRef.current = next;
    setUp(next);
    setWrong([]);
    if (next.length < 2) return;

    setTurns((count) => count + 1);
    const [first, second] = next;
    if (cards[first].pair === cards[second].pair) {
      const pairs = [...matchedRef.current, cards[first].pair];
      matchedRef.current = pairs;
      upRef.current = [];
      setMatched(pairs);
      setUp([]);
      if (pairs.length === kinds.length) {
        setBlessing((previous) => {
          const nextBlessing = anotherBlessing(previous ?? lastBlessing.current);
          lastBlessing.current = nextBlessing;
          return nextBlessing;
        });
      }
      return;
    }

    lockedRef.current = true;
    setLocked(true);
    setWrong(next);
    timer.current = window.setTimeout(() => {
      upRef.current = [];
      setUp([]);
      setWrong([]);
      lockedRef.current = false;
      setLocked(false);
      timer.current = null;
    }, 700);
  }

  function playAgain() {
    if (timer.current !== null) window.clearTimeout(timer.current);
    upRef.current = [];
    lockedRef.current = false;
    matchedRef.current = [];
    setCards(deal());
    setUp([]);
    setWrong([]);
    setMatched([]);
    setTurns(0);
    setLocked(false);
    setBlessing(null);
  }

  const board = cards ?? Array.from({ length: kinds.length * 2 }, () => null);

  return (
    <section className="memory-match section reveal" id="blessing">
      <SectionHeading eyebrow="A little game for our guests">
        Match the blooms
      </SectionHeading>
      <p>
        Flip two cards at a time. Find every pair to unlock a blessing for{" "}
        {c.brand.brideFirst} and {c.brand.groomFirst}.
      </p>
      <p className="memory-status" aria-live="polite">
        {done
          ? `All ${kinds.length} pairs in ${turns} ${turns === 1 ? "turn" : "turns"}`
          : `${matched.length} of ${kinds.length} pairs · ${turns} ${turns === 1 ? "turn" : "turns"}`}
      </p>
      <div className="memory-board" role="group" aria-label="Memory cards">
        {board.map((card, index) => {
          const faceUp =
            card !== null &&
            (up.includes(index) || matched.includes(card.pair) || done);
          return (
            <button
              key={card?.key ?? index}
              type="button"
              className={`memory-card${faceUp ? " is-up" : ""}${
                card && wrong.includes(index) ? " is-wrong" : ""
              }${card && matched.includes(card.pair) ? " is-matched" : ""} tone-${
                card?.tone ?? "back"
              }`}
              onClick={() => flip(index)}
              aria-disabled={!card || faceUp || locked}
              aria-label={
                !card
                  ? "Shuffling"
                  : faceUp
                    ? card.label
                    : `Hidden card ${index + 1}`
              }
            >
              <span className="memory-card-inner">
                <span className="memory-face memory-face--back">
                  {c.brand.monogram}
                </span>
                <span className="memory-face memory-face--front">
                  <span className="memory-mark" aria-hidden="true" />
                  <span>{card?.label}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {done && blessing !== null && (
        <blockquote className="memory-blessing">{blessings[blessing]}</blockquote>
      )}
      {done && (
        <button className="button" type="button" onClick={playAgain}>
          Play again
        </button>
      )}
    </section>
  );
}
