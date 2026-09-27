"use client";
import { useState } from "react";
import { weddingConfig as c } from "@/config/wedding";
import { deviceUrl } from "@/utils/deviceRedirect";
import { dateStamp } from "@/utils/calendar";
import { Botanical } from "../ui/Botanical";
export function InvitationFooter() {
  const [notice, setNotice] = useState(false);
  function visit(e: React.MouseEvent<HTMLAnchorElement>) {
    const url = deviceUrl(
      c.links,
      navigator.userAgent,
      navigator.maxTouchPoints,
    );
    if (!url) {
      e.preventDefault();
      setNotice(true);
    } else e.currentTarget.href = url;
  }
  return (
    <>
      <section className="closing section">
        <Botanical />
        <span className="eyebrow">With love, always</span>
        <p className="closing-monogram">{c.brand.monogram}</p>
        <h2>
          {c.brand.brideFirst} & {c.brand.groomFirst}
        </h2>
        <p className="eyebrow">{dateStamp(c.wedding)}</p>
        <p className="closing-line">We can’t wait to celebrate with you.</p>
      </section>
      <footer className="footer">
        <span>Presented with love by</span>
        <div>
          <a
            href={c.links.website || "#joscity-notice"}
            onClick={visit}
            target="_blank"
            rel="noopener noreferrer"
          >
            Joscity ↗
          </a>
          <span aria-hidden="true">×</span>
          <a href={c.links.developer} target="_blank" rel="noopener noreferrer">
            Developer William ↗
          </a>
        </div>
        {notice && (
          <p id="joscity-notice" role="status">
            The Joscity link will be available soon.
          </p>
        )}
        <span className="footer-note">
          {c.brand.monogram} · A celebration to remember
        </span>
      </footer>
    </>
  );
}
