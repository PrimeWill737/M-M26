import { weddingConfig as c } from "@/config/wedding";
import { displayDate, displayWeekday } from "@/utils/calendar";
import { SectionHeading } from "../ui/SectionHeading";
export function FamilyInvitation() {
  return (
    <section className="families section reveal" id="families">
      <SectionHeading eyebrow="A union of hearts & homes">
        With Joy in Their Hearts
      </SectionHeading>
      <div className="family-pair">
        <div>
          <span className="eyebrow">The family of</span>
          <h3>{c.families.bride}</h3>
        </div>
        <em>&</em>
        <div>
          <span className="eyebrow">The family of</span>
          <h3>{c.families.groom}</h3>
        </div>
      </div>
      <p>joyfully invite you to celebrate the wedding of their children</p>
      <p className="family-names">
        {c.brand.brideFirst} <em>&</em> {c.brand.groomFirst}
      </p>
      <p className="eyebrow">
        {displayWeekday(c.wedding)}, {displayDate(c.wedding)}
      </p>
    </section>
  );
}
