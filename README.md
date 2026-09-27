# M&M26 — Meda & Marrion

A complete Next.js App Router wedding invitation built with TypeScript, SCSS, and Bun. Original SVG botanicals, textured ivory stationery, green and plum wedding details, and a warm terracotta traditional celebration. No people imagery, CSS framework, animation library, backend, or runtime third-party image requests.

## Run

```sh
bun install --frozen-lockfile
bun run dev
```

Open http://localhost:3000. A local Bun executable is also available in this workspace when Bun is not on PATH:

```powershell
& '.\.tools\bun-windows-x64\bun.exe' run dev
```

## Configure

All event details live in `config/wedding.ts`: names, families, ceremonies, dates, times, maps queries, palettes, RSVP contacts, guest-wish handler, music, and credit links.

- Traditional celebration is assumed to be on the wedding date. Its `time: "15:00"` and `timeConfirmed: false` are centrally editable; the invitation and calendar explicitly mark this time as provisional.
- Calendar events default to three hours. Change each ceremony's `durationHours` when its end time is known.
- Add RSVP entries to `rsvpContacts`; the layout supports two additional contacts and more.
- `guestWish.submit` accepts an async message handler. With no handler, guests compose a WhatsApp message to William and choose whether to send it. No messages are stored or sent automatically.
- The opening page offers “Play music” and “Continue quietly.” A bundled original ambient loop plays only after consent and continues through opening the invitation. The floating control pauses/resumes it. Set `NEXT_PUBLIC_MUSIC_SRC` to a licensed replacement, or `off` to disable the popup and music. Leaving it empty uses `public/audio/forever-in-bloom.wav`. No microphone or device access is requested.

Copy `.env.example` to `.env.local` and set the public deployment URL and real Joscity website, Android and iOS URLs. These destinations were not supplied in the brief and have deliberately not been invented. Until configured, Joscity displays a polite unavailable message. Missing store destinations fall back to the configured website. Desktop-mode iPads are detected using touch capability.

Set `NEXT_PUBLIC_SITE_URL` to the deployed HTTPS origin before the production build. On Vercel, the production domain environment variable is also supported. Local development uses localhost. Public environment changes require a rebuild.

## Checks

```sh
bun run typecheck
bun run lint
bun run test
bun run build
bun run start
```

With the site running on port 3000, browser checks use Playwright and axe:

```sh
bun x playwright install chromium
bun run test:browser
```

Safari-engine mobile checks are also available with `bun x playwright install webkit` followed by `bun run test:webkit`.

Use `bun run test:music` for the first-page opt-in, silent decline, actual playback across opening, pause/resume, Escape, accessibility and blocked-playback recovery in Chromium and WebKit. It uses port 3000 by default; set `TEST_BASE_URL` to test a different running server.

For the browser already downloaded into this Windows workspace:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = "$PWD\.tools\browsers"
& '.\.tools\bun-windows-x64\bun.exe' run test:browser
```

The browser suite covers widths 320, 360, 375, 390, 414, 430, 768, 1024, 1280 and 1440; records screenshots; checks JavaScript errors, horizontal overflow and accessibility; and exercises opening, pointer/touch scratch completion, replay, accessible reveal, dialog Escape, mobile navigation, WhatsApp message encoding and unconfigured credit links. Generated reports and screenshots are in ignored `test-results/`. Real-device testing remains useful before sharing publicly; emulation is not physical iPhone/Android hardware.

## Architecture and behavior

- `app/`: server-rendered page composition, self-hosted Next fonts, metadata and viewport.
- `components/invitation/`: opening panels, hero, family invitation, countdown, canvas secret, dress code, RSVP, wish dialog, optional music and closing credits.
- `components/ui/`: reusable ceremony cards, botanical illustrations, color swatches, headings and native accessible modal.
- `components/navigation/`: floating desktop navigation and mobile dialog menu.
- `hooks/`: timezone-safe countdown and real high-DPI canvas scratch handling.
- `utils/`: Google Calendar, Maps and device-aware credit routing.
- `styles/main.scss`: the only global stylesheet import, composed from organized SCSS partials.
- `public/images/mm26-social-card.jpg`: actual 1200×630 locally generated social sharing image. Regenerate after changing the couple/date with `bun run social-card`.

The wedding instant is explicitly `2026-12-19T10:00:00+01:00`, independent of visitor timezone. The countdown has a stable initial render, updates once per second and cleans up its timers. The canvas uses pointer capture, DPR-aware sizing, a sampled erased-area threshold of 50%, resize preservation and a keyboard-accessible reveal/replay alternative. Touch scrolling is suppressed only on the scratch surface during a touch gesture; the surrounding page remains scrollable. Revealed canvases stop intercepting touches.

Animations respect reduced-motion preferences. Intro content isolates background focus; native dialogs trap focus, close on Escape and restore the trigger. Guests can navigate and reveal the secret entirely by keyboard. Interactive features require JavaScript, with a noscript notice supplied.

## Deploy

Deploy as a standard Next.js app on Vercel or a Node.js host using `bun run build` and `bun run start`. Install dependencies with Bun and retain `bun.lock`. Fonts are bundled in `app/fonts/` with their licenses and loaded through `next/font/local`; development and builds do not need Google's font servers. The page is statically generated, and no database or API credentials are required.
