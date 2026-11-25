import { InvitationExperience } from "@/components/invitation/InvitationExperience";
import { Hero } from "@/components/invitation/Hero";
import { Countdown } from "@/components/invitation/Countdown";
import { ScratchReveal } from "@/components/invitation/ScratchReveal";
import { MemoryMatch } from "@/components/invitation/MemoryMatch";
import { EventCard } from "@/components/ui/EventCard";
import { DressCode } from "@/components/invitation/DressCode";
import { PreweddingHighlights } from "@/components/invitation/PreweddingHighlights";
import { RSVP } from "@/components/invitation/RSVP";
import { InvitationFooter } from "@/components/invitation/InvitationFooter";
import { weddingConfig as c } from "@/config/wedding";
import { Icon } from "@/components/ui/Icon";
import { connection } from "next/server";
import { albumIsLive } from "@/config/experience";
import { Celebration } from "@/components/celebration/Celebration";
import { CouplePortraits } from "@/components/invitation/CouplePortraits";
import { ScheduledRefresh } from "@/components/invitation/ScheduledRefresh";
export default async function Home() {
  await connection();
  const now = Date.now();
  if (albumIsLive(now)) return <Celebration />;
  return (
    <InvitationExperience>
      <ScheduledRefresh serverNow={now} />
      <main>
        <Hero />
        <Countdown />
        <CouplePortraits />
        <ScratchReveal />
        <MemoryMatch />
        <EventCard event={c.wedding} />
        <EventCard event={c.traditional} warm />
        <DressCode />
        <PreweddingHighlights />
        <section className="quote section reveal">
          <span className="eyebrow">{c.brand.monogram}</span>
          <blockquote>
            Two stories. Two families.
            <br />
            <em>One forever.</em>
          </blockquote>
          <span className="little-flower" aria-hidden="true">
            <Icon name="flower" />
          </span>
        </section>
        <RSVP />
        <InvitationFooter />
      </main>
    </InvitationExperience>
  );
}
