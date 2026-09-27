import { InvitationExperience } from "@/components/invitation/InvitationExperience";
import { Hero } from "@/components/invitation/Hero";
import { FamilyInvitation } from "@/components/invitation/FamilyInvitation";
import { Countdown } from "@/components/invitation/Countdown";
import { ScratchReveal } from "@/components/invitation/ScratchReveal";
import { EventCard } from "@/components/ui/EventCard";
import { DressCode } from "@/components/invitation/DressCode";
import { RSVP } from "@/components/invitation/RSVP";
import { InvitationFooter } from "@/components/invitation/InvitationFooter";
import { weddingConfig as c } from "@/config/wedding";
export default function Home() {
  return (
    <InvitationExperience>
      <main>
        <Hero />
        <FamilyInvitation />
        <Countdown />
        <ScratchReveal />
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
          <span aria-hidden="true">✳</span>
        </section>
        <RSVP />
        <InvitationFooter />
      </main>
    </InvitationExperience>
  );
}
