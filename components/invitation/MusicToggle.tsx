"use client";
import { useRef, useState } from "react";
import { weddingConfig } from "@/config/wedding";
import { Modal } from "../ui/Modal";
import { Icon } from "../ui/Icon";
export function MusicToggle() {
  const ref = useRef<HTMLAudioElement>(null);
  const attempt = useRef(0);
  const [promptOpen, setPromptOpen] = useState(true);
  const [pending, setPending] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  if (!weddingConfig.music.src) return null;
  function focusInvitation() {
    requestAnimationFrame(() =>
      document.querySelector<HTMLButtonElement>(".intro-open")?.focus(),
    );
  }
  function quietly() {
    attempt.current++;
    ref.current?.pause();
    setPending(false);
    setPromptOpen(false);
    setError(false);
    focusInvitation();
  }
  async function play() {
    const audio = ref.current;
    if (!audio) return;
    const currentAttempt = ++attempt.current;
    setPending(true);
    setError(false);
    audio.volume = 0.35;
    try {
      // Called directly from the user's gesture, including on iOS Safari.
      await audio.play();
      if (currentAttempt !== attempt.current) return;
      setPromptOpen(false);
      focusInvitation();
    } catch {
      if (currentAttempt === attempt.current) setError(true);
    } finally {
      if (currentAttempt === attempt.current) setPending(false);
    }
  }
  return (
    <>
      <audio
        ref={ref}
        src={weddingConfig.music.src}
        preload="none"
        loop
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setPending(false);
          setError(true);
        }}
      />
      {promptOpen ? (
        <Modal
          title="A little music, a little praise."
          eyebrow="Set the mood for forever"
          className="music-prompt"
          onClose={quietly}
        >
          <div className="music-prompt-seal" aria-hidden="true">
            <span>
              <Icon name="note" />
            </span>
            <span>
              <Icon name="note" />
            </span>
          </div>
          <p>Let a soft melody accompany you as you open our invitation.</p>
          <div className="music-prompt-actions">
            <button className="button" onClick={play} disabled={pending}>
              <Icon name="note" />
              {pending ? "Starting music…" : "Play music"}
            </button>
            <button className="text-link" onClick={quietly}>
              Continue quietly
            </button>
          </div>
          <p className="small-note">
            Your moment, your mood. You can pause anytime.
          </p>
          {error && (
            <p className="music-error" role="alert">
              The music couldn’t start. Try again, or continue quietly.
            </p>
          )}
        </Modal>
      ) : (
        <div className="music">
          <button
            onClick={playing ? () => ref.current?.pause() : play}
            disabled={pending}
            aria-pressed={playing}
            aria-label={
              playing ? "Pause background music" : "Play background music"
            }
          >
            <span
              className={`music-bars ${playing ? "is-playing" : ""}`}
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
            </span>
            <span>
              {pending ? "Starting…" : playing ? "Sound on" : "Sound off"}
            </span>
          </button>
          {error && (
            <span className="music-error" role="status">
              Music is unavailable. Tap to retry.
            </span>
          )}
        </div>
      )}
    </>
  );
}
