import { weddingConfig as c } from "@/config/wedding";
import { SectionHeading } from "../ui/SectionHeading";
import { Icon } from "../ui/Icon";
import { GuestWish } from "./GuestWish";
export function RSVP() {
  return (
    <section id="rsvp" className="rsvp section reveal">
      <SectionHeading eyebrow="Your presence is our favourite gift">
        Celebrate With Us
      </SectionHeading>
      <p>For enquiries and RSVP, kindly contact:</p>
      <div className="contacts">
        {c.rsvpContacts.map((contact) => (
          <a
            key={contact.international}
            className="contact"
            href={
              contact.whatsappOnly
                ? `https://wa.me/${contact.international}?text=${encodeURIComponent(`Hello ${contact.name}, I'm reaching out regarding ${c.brand.brideFirst} & ${c.brand.groomFirst}'s wedding — ${c.brand.monogram}.`)}`
                : `tel:+${contact.international}`
            }
            target={contact.whatsappOnly ? "_blank" : undefined}
            rel={contact.whatsappOnly ? "noopener noreferrer" : undefined}
          >
            <span className="eyebrow">
              {contact.whatsappOnly ? "WhatsApp only" : "Call to RSVP"}
            </span>
            <h3>{contact.name}</h3>
            <span className="contact-number">
              {contact.phone} <Icon name="arrowUpRight" />
            </span>
          </a>
        ))}
      </div>
      <GuestWish />
    </section>
  );
}
