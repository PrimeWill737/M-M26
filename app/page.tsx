import { InvitationExperience } from "@/components/invitation/InvitationExperience";
import { Hero } from "@/components/invitation/Hero";
import { Countdown } from "@/components/invitation/Countdown";
import { ScratchReveal } from "@/components/invitation/ScratchReveal";
import { MemoryMatch } from "@/components/invitation/MemoryMatch";
import { EventCard } from "@/components/ui/EventCard";
import { DressCode } from "@/components/invitation/DressCode";
import { RSVP } from "@/components/invitation/RSVP";
import { InvitationFooter } from "@/components/invitation/InvitationFooter";
import { weddingConfig as c } from "@/config/wedding";
import { Icon } from "@/components/ui/Icon";
export default function Home() {
  return (
    <InvitationExperience>
      <main>
        <Hero />
        <Countdown />
        <ScratchReveal />
        <MemoryMatch />
        <EventCard event={c.wedding} />
        <EventCard event={c.traditional} warm />
        <DressCode />
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
