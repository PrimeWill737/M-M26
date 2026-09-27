"use client";
import { useState } from "react";
import { weddingConfig as c } from "@/config/wedding";
import { Modal } from "../ui/Modal";
import { Icon } from "../ui/Icon";
export function GuestWish() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const contact = c.rsvpContacts.find((contact) => contact.whatsappOnly);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!c.guestWish.submit || !message.trim()) return;
    setBusy(true);
    setStatus("");
    try {
      await c.guestWish.submit(message.trim());
      setStatus("Your wish has been sent. Thank you for your love.");
      setMessage("");
    } catch {
      setStatus("Your wish could not be sent. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button className="wish-trigger text-link" onClick={() => setOpen(true)}>
        Leave the Couple a Wish <Icon name="arrowUpRight" />
      </button>
      {open && (
        <Modal title="Words to treasure" onClose={() => setOpen(false)}>
          <p>A blessing, a memory, a little wish for our forever.</p>
          <form onSubmit={submit}>
            <label htmlFor="wish">
              Your message to {c.brand.brideFirst} & {c.brand.groomFirst}
            </label>
            <textarea
              id="wish"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={600}
              required
              rows={5}
              placeholder="Wishing you a lifetime of…"
            />
            <span className="small-note">{message.length}/600</span>
            {c.guestWish.submit ? (
              <button className="button" disabled={busy || !message.trim()}>
                {busy ? "Sending…" : "Send your wish"}
              </button>
            ) : (
              <>
                <p className="small-note">
                  Your wish will open in WhatsApp to William, who can share it
                  with the couple. Nothing is stored on this website.
                </p>
                {message.trim() && contact ? (
                  <a
                    className="button"
                    href={`https://wa.me/${contact.international}?text=${encodeURIComponent(`A wish for ${c.brand.brideFirst} & ${c.brand.groomFirst} — ${c.brand.monogram}:\n\n${message.trim()}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Send with WhatsApp <Icon name="arrowUpRight" />
                  </a>
                ) : (
                  <button className="button" disabled type="button">
                    Write a wish to continue
                  </button>
                )}
              </>
            )}
            <p role="status">{status}</p>
          </form>
        </Modal>
      )}
    </>
  );
}
