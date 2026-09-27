You are a senior frontend engineer, creative developer, UI/UX designer, and luxury digital wedding invitation designer.

Build a complete, production-ready, highly polished **interactive digital wedding invitation website** using:

- Next.js latest stable version with App Router
- TypeScript
- SCSS
- Responsive mobile-first design
- No Tailwind CSS
- No generic CSS framework
- Clean reusable React components
- Smooth premium animations
- Excellent performance
- SEO and social sharing metadata
- Accessible interactions

PROJECT NAME:
M&M26 Wedding Invitation

COUPLE:
Bride: Meda Bosworth
Groom: Marrion Agbakansi

Wedding monogram / abbreviation:
M&M26

==================================================
1. DESIGN DIRECTION
==================================================

Create a sophisticated digital wedding card experience inspired by modern luxury interactive wedding invitations.

The website should feel like opening a beautifully designed physical wedding invitation rather than visiting a normal website.

The experience must be:

- Romantic
- Luxurious
- Elegant
- Editorial
- Premium
- Cinematic
- Soft
- Modern
- Memorable
- Interactive
- Minimal without feeling empty

DO NOT make it look:

- Generic
- Like a normal corporate website
- Like a SaaS landing page
- Futuristic
- Neon
- 3D-heavy
- Overly flashy
- AI-generated
- Like a basic wedding template

Do not use photographs of people anywhere.

All imagery must be non-human imagery such as:

- Elegant floral arrangements
- Leaves
- Botanical drawings
- Fabric
- Wedding rings
- Paper textures
- Wax seal details
- Soft abstract flowers
- Wedding stationery
- Architectural/event ambience without people
- Table setting details
- Delicate line illustrations

Use imagery sparingly. The typography, composition, textures and animation should provide most of the visual character.

==================================================
2. COLOR SYSTEM
==================================================

The website has two ceremonies with different palettes.

MAIN / WHITE WEDDING PALETTE:

Use sophisticated combinations of:

- Forest green
- Sage green
- Olive green
- Emerald
- Lavender
- Plum
- Deep purple
- Muted lilac
- Ivory
- Warm white
- Subtle champagne accents

TRADITIONAL WEDDING PALETTE:

Use:

- Burnt orange
- Terracotta
- Beige
- Sand
- Cream
- Warm brown accents

The full website should still feel visually connected.

Do not make the transition between palettes harsh.

Use ivory / cream as a common neutral base.

Use green and purple primarily for the white wedding section.

Gradually introduce burnt orange and beige as the user moves into the traditional wedding section.

==================================================
3. TYPOGRAPHY
==================================================

Typography is extremely important.

Use a combination of:

1. Elegant high-contrast serif font for important headings
2. Sophisticated script/calligraphy font sparingly for the couple's names
3. Clean modern serif or sans serif for smaller information

Potential Google fonts can include something similar to:

- Cormorant Garamond
- Playfair Display
- Bodoni Moda
- DM Serif Display
- Montserrat
- Inter
- Great Vibes or another refined script font

Do not overuse script typography.

The names:

Meda
&
Marrion

should be among the strongest visual elements.

The monogram:

M&M26

should become a recognizable visual identity throughout the experience.

==================================================
4. OPENING EXPERIENCE
==================================================

Do NOT immediately show a normal webpage.

Create an immersive digital invitation opening sequence.

Initial screen:

Full viewport.

Soft cream or textured invitation-paper background.

Show a small elegant heading:

"Together with their families"

Then display the two families:

Family of
Pastor & Mrs Bosworth Onoja

and

Mr & Mrs Agbakansi Gabriel Chukwujekwu

Then elegant text:

"joyfully invite you to celebrate the union of"

Animate the couple names beautifully:

Meda Bosworth
&
Marrion Agbakansi

Include:

M&M26

and:

19 • 12 • 2026

Add a CTA such as:

"Open Invitation"

or

"Enter Our Celebration"

When clicked, smoothly transition into the main invitation.

Possible interaction:

Create two paper panels/envelope flaps that gently separate.

The effect should remain elegant and lightweight.

Do not make it gimmicky.

==================================================
5. HERO SECTION
==================================================

After opening the invitation, show a dramatic but minimalist hero.

Content:

M&M26

Meda
&
Marrion

"We're getting married"

19 December 2026

Jos, Plateau State

Use subtle decorative botanical details around the edges.

Avoid crowding the center.

Add slow movement such as:

- subtle flower drift
- paper texture movement
- soft parallax
- gentle reveal animations

No heavy motion.

==================================================
6. COUNTDOWN
==================================================

Create a live countdown to:

19 December 2026
10:00 AM
Africa/Lagos timezone

Display:

DAYS
HOURS
MINUTES
SECONDS

Example visual:

182
DAYS

07
HOURS

24
MINUTES

08
SECONDS

Make it elegant.

Do not make it look like an ecommerce countdown timer.

Heading:

"Until Forever Begins"

When the wedding date is reached, automatically change the countdown message to something celebratory such as:

"Today, Forever Begins."

Ensure the calculation is timezone safe.

==================================================
7. SCRATCH-TO-REVEAL INTERACTION
==================================================

This is one of the signature elements of the website.

Create a premium digital scratch-card interaction.

Heading:

"A Little Secret Awaits"

Subtext:

"Scratch gently to reveal where forever begins."

Create an elegant scratchable surface styled like textured paper, foil, champagne gold, sage or muted purple.

The user should be able to use:

- mouse on desktop
- finger/touch on mobile

Scratch away the surface.

When approximately 45–55% of the cover has been scratched, automatically complete the reveal with a smooth animation.

Reveal:

19 DECEMBER 2026

BASEL EVENT CENTER
Dong, Jos
Plateau State

10:00 AM

Add:

"Tap to view location"

The location button should open Google Maps using a search query for:

Basel Event Center, Dong, Jos, Plateau State, Nigeria

Implement the scratch interaction properly using HTML canvas if practical.

Avoid a fake CSS-only interaction.

It must work smoothly on iOS Safari and Android Chrome.

Provide a reset/replay button, but make it subtle.

==================================================
8. WHITE WEDDING SECTION
==================================================

Create a beautiful ceremony card.

Heading:

THE WEDDING

Content:

Saturday
19 December 2026

10:00 AM

Basel Event Center
Dong, Jos
Plateau State

Colors of the Day:

Any Shade of Green
&
Any Shade of Purple

Create beautiful color swatches representing multiple elegant shades of green and purple.

Include:

"View Location"

Use Google Maps.

Add Calendar functionality.

Create an:

"Add to Calendar"

button.

Generate either:

- Google Calendar URL
and/or
- downloadable .ics calendar event

Event title:

Meda & Marrion Wedding — M&M26

==================================================
9. TRADITIONAL WEDDING SECTION
==================================================

Transition into a warmer palette.

Heading:

THE TRADITIONAL CELEBRATION

Location:

Millennium Hotel
Close to Amusement Park
Jos, Plateau State

Time:

3:00 PM

IMPORTANT DEVELOPMENT NOTE:

Keep the traditional wedding time inside a central event-data configuration object because the exact time may be changed later.

Do NOT hardcode this text directly into multiple components.

Colors of the Day:

Burnt Orange
&
Beige

Show elegant color swatches.

Include:

View Location

Google Maps query:

Millennium Hotel near Amusement Park, Jos, Plateau State, Nigeria

Also provide Add to Calendar functionality.

==================================================
10. FAMILY INVITATION SECTION
==================================================

Create an elegant typography-focused section.

Heading:

"With Joy in Their Hearts"

Body:

The Family of
Pastor & Mrs Bosworth Onoja

and

Mr & Mrs Agbakansi Gabriel Chukwujekwu

joyfully invite you to celebrate the wedding of their children

Meda
&
Marrion

Saturday, 19 December 2026

Make sure BOTH families are visually equal.

Neither family should appear more important than the other.

Use balanced typography and spacing.

==================================================
11. LOVE / CELEBRATION QUOTE
==================================================

Add one elegant short wedding quote.

Do not use anything extremely cliché.

Something along the feeling of:

"Two stories. Two families. One forever."

This can accompany the M&M26 monogram.

==================================================
12. DRESS CODE / COLORS SECTION
==================================================

Create a visually attractive section called:

"Colors of Our Celebration"

Split into two cards.

WHITE WEDDING

Any shade of Green
Any shade of Purple

TRADITIONAL

Burnt Orange
Beige

Create interactive color swatches.

On hover/tap, show the shade name.

Example green palette:

Forest
Emerald
Olive
Sage

Purple:

Plum
Lavender
Violet
Mauve

Traditional:

Burnt Orange
Terracotta
Beige
Sand

Keep this tasteful.

==================================================
13. RSVP
==================================================

Create an elegant RSVP/contact section.

Heading:

"Celebrate With Us"

Subheading:

"For enquiries and RSVP, kindly contact:"

Contact 1:

William
WhatsApp Only
08166072005

The William phone CTA should directly open WhatsApp using:

https://wa.me/2348166072005

Suggested prefilled WhatsApp message:

"Hello William, I'm reaching out regarding Meda & Marrion's wedding — M&M26."

Contact 2:

Sis. Grace Agbakansi
08038801128

Make phone numbers tappable.

Leave the RSVP data architecture capable of adding at least two additional contacts later.

Do NOT hardcode contacts directly into JSX.

Use an RSVP contacts array inside the event configuration.

Example:

rsvpContacts: [
  {
    name: "William",
    phone: "...",
    whatsappOnly: true
  }
]

The design should automatically support additional entries.

==================================================
14. OPTIONAL GUEST MESSAGE INTERACTION
==================================================

Add a small interactive element:

"Leave the Couple a Wish"

The initial version does NOT need a backend.

Opening it can display a beautiful modal where users can type a short message.

For now provide a configurable submission handler.

If no backend is configured, allow users to send their message through WhatsApp instead.

Keep this feature subtle.

==================================================
15. FLOATING NAVIGATION
==================================================

Because most visitors will be on mobile, avoid a traditional desktop navbar.

Use a small elegant navigation trigger.

Navigation links:

Home
Wedding
Traditional
Colors
RSVP

On desktop it may become a subtle horizontal navigation.

On mobile use a tasteful fullscreen or bottom-sheet menu.

==================================================
16. MUSIC
==================================================

Prepare OPTIONAL ambient background music support.

Do not autoplay audio immediately because browsers may block it.

After the user presses "Open Invitation", the application may display a small:

♫

music toggle.

Audio should start only after valid user interaction.

Place music file configuration in the central config.

If no music file exists, the page must work perfectly without one.

==================================================
17. SCROLL EXPERIENCE
==================================================

Use smooth, elegant reveal effects.

Animations should include combinations of:

- opacity
- translateY
- scale
- clip path
- text reveal
- subtle parallax

Use Framer Motion if necessary.

Do not animate everything.

Animations should reinforce hierarchy.

Respect:

prefers-reduced-motion

for accessibility.

==================================================
18. RESPONSIVE EXPERIENCE
==================================================

The website must be fully responsive.

Design mobile first.

Test visually for approximately:

320px
360px
375px
390px
414px
430px
768px
1024px
1280px
1440px+

Ensure:

- no horizontal overflow
- comfortable touch targets
- beautiful mobile typography
- cards do not become overcrowded
- scratch functionality works by touch
- countdown remains readable
- names do not overflow
- long family names wrap properly

This must feel intentionally designed for iPhone and Android devices rather than like a compressed desktop site.

==================================================
19. SCSS ARCHITECTURE
==================================================

SCSS must have its own organized folder.

The ONLY SCSS file allowed at the root/global import level should be:

styles/main.scss

Create something similar to:

styles/
│
├── main.scss
│
├── abstracts/
│   ├── _variables.scss
│   ├── _mixins.scss
│   ├── _functions.scss
│   └── _breakpoints.scss
│
├── base/
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _globals.scss
│
├── components/
│   ├── _buttons.scss
│   ├── _countdown.scss
│   ├── _scratch-card.scss
│   ├── _event-card.scss
│   ├── _navigation.scss
│   ├── _modal.scss
│   └── _color-swatches.scss
│
├── sections/
│   ├── _intro.scss
│   ├── _hero.scss
│   ├── _families.scss
│   ├── _wedding.scss
│   ├── _traditional.scss
│   ├── _dress-code.scss
│   ├── _rsvp.scss
│   └── _footer.scss
│
└── utilities/
    └── _helpers.scss

main.scss should import/use the required partials.

Do not put the entire website's styles inside main.scss.

==================================================
20. NEXT.JS FILE ARCHITECTURE
==================================================

Use a professional architecture similar to:

app/
├── layout.tsx
├── page.tsx
├── globals.ts
└── metadata.ts if required

components/
├── invitation/
│   ├── InvitationIntro.tsx
│   ├── Hero.tsx
│   ├── FamilyInvitation.tsx
│   ├── Countdown.tsx
│   ├── ScratchReveal.tsx
│   ├── WeddingDetails.tsx
│   ├── TraditionalDetails.tsx
│   ├── DressCode.tsx
│   ├── RSVP.tsx
│   ├── GuestWish.tsx
│   ├── MusicToggle.tsx
│   └── InvitationFooter.tsx
│
├── ui/
│   ├── Button.tsx
│   ├── EventCard.tsx
│   ├── ColorSwatch.tsx
│   ├── SectionHeading.tsx
│   └── Modal.tsx
│
└── navigation/
    └── Navigation.tsx

config/
└── wedding.ts

hooks/
├── useCountdown.ts
├── useDevice.ts
└── useScratchProgress.ts

utils/
├── calendar.ts
├── deviceRedirect.ts
└── maps.ts

public/
├── images/
│   ├── botanicals/
│   ├── textures/
│   └── decor/
│
├── icons/
└── audio/

styles/
...

==================================================
21. CENTRAL WEDDING CONFIGURATION
==================================================

VERY IMPORTANT:

All event-specific information must live in:

config/wedding.ts

Create typed interfaces.

Example structure:

export const weddingConfig = {
  brand: {
    monogram: "M&M26",
    bride: "Meda Bosworth",
    groom: "Marrion Agbakansi",
  },

  families: {
    bride: "Pastor & Mrs Bosworth Onoja",
    groom: "Mr & Mrs Agbakansi Gabriel Chukwujekwu",
  },

  wedding: {
    date: "2026-12-19",
    time: "10:00",
    timezone: "Africa/Lagos",
    venue: "Basel Event Center",
    area: "Dong",
    city: "Jos",
    state: "Plateau State",
  },

  traditional: {
    venue: "Millennium Hotel",
    addressDescription: "Close to Amusement Park, Jos, Plateau State",
    time: "15:00",
    timeConfirmed: false,
  },

  rsvp: [
    ...
  ]
};

The site should get event content from this config.

This allows event information to be edited once without searching through components.

==================================================
22. IMAGES
==================================================

NO images containing people.

Use either:

- locally provided copyright-safe decorative assets
- generated abstract botanical assets
- CSS decorative elements
- SVG botanical illustrations
- paper texture assets

Do NOT hotlink random third-party images.

Use Next/Image for raster images.

Decorative images should have appropriate empty alt text where applicable.

Meaningful images need proper alt descriptions.

==================================================
23. SCRATCH CARD TECHNICAL REQUIREMENTS
==================================================

Implement a real canvas-based ScratchReveal component.

Requirements:

- Pointer Events API
- mouse support
- touch support
- high-DPI canvas handling
- prevent page scroll only while actively scratching
- calculate scratched percentage
- auto reveal around 50%
- smooth completed-state animation
- resize responsibly
- avoid memory leaks
- clean listeners on unmount

The scratch texture may say:

"Scratch to Reveal"

with the M&M26 monogram embossed subtly behind it.

Underneath display:

SAVE THE DATE

19
DECEMBER
2026

10:00 AM

Basel Event Center
Dong, Jos

==================================================
24. COUNTDOWN TECHNICAL REQUIREMENTS
==================================================

Target:

December 19, 2026 at 10:00 AM
Africa/Lagos

Do not assume browser local timezone.

Use correct timezone handling.

Update every second.

Clear the interval properly when component unmounts.

Avoid hydration errors.

Countdown should only calculate on the client where appropriate.

==================================================
25. FOOTER / WATERMARK
==================================================

The footer must clearly show:

Presented by
Joscity • Developer William

But style it professionally.

Possible structure:

Presented by

Joscity × Developer William

Both MUST look obviously clickable.

JOSCITY LINK:

The "Joscity" link needs smart device detection.

Behaviour:

If visitor uses Android:
redirect to the Joscity Google Play Store listing.

If visitor uses iPhone/iPad:
redirect to the Joscity Apple App Store listing.

If visitor uses desktop:
redirect to the Joscity official website.

IMPORTANT:

Create constants/placeholders inside config or environment variables for:

JOSCITY_WEBSITE_URL
JOSCITY_ANDROID_URL
JOSCITY_IOS_URL

Do NOT invent URLs.

Clearly mark where these three real URLs need to be inserted.

Use robust device detection.

The Joscity link should look like a link/button and not hidden fine print.

WILLIAM LINK:

"Developer William"

must link to:

https://william-lac.vercel.app

Open it safely in a new tab:

target="_blank"
rel="noopener noreferrer"

The footer may display:

Presented with love by
Joscity × Developer William

Keep it tasteful without making the advertisement overpower the wedding invitation.

==================================================
26. SEO + SOCIAL SHARING
==================================================

Add good Next.js metadata.

Title:

Meda & Marrion | M&M26 Wedding Invitation

Description:

Together with their families, Meda Bosworth and Marrion Agbakansi invite you to celebrate their wedding on 19 December 2026 in Jos, Plateau State.

OpenGraph title:

Meda & Marrion — M&M26

Create metadata suitable for sharing the link on:

- WhatsApp
- Facebook
- X
- iMessage
- Telegram

Provide a placeholder for:

/images/mm26-social-card.jpg

The social card must contain no photographs of people.

Design it with typography and botanical decoration.

==================================================
27. ACCESSIBILITY
==================================================

Follow accessibility best practices.

Ensure:

- semantic HTML
- keyboard navigation
- adequate color contrast
- visible focus states
- buttons are actual buttons
- links are actual anchors
- aria labels where needed
- scratch reveal has an accessible fallback button

For someone unable to scratch the canvas, provide:

"Reveal Details"

as an accessible alternative.

==================================================
28. PERFORMANCE
==================================================

Aim for excellent Lighthouse scores.

Avoid huge JavaScript dependencies.

Only add a library where there is a real reason.

Prefer CSS/SVG effects over giant image assets.

Optimize fonts.

Use next/font where appropriate.

Use Next/Image.

Lazy-load lower content when reasonable.

Do not cause layout shift.

==================================================
29. EXTRA PREMIUM DETAILS
==================================================

Add subtle details that make the site feel custom-made:

- animated monogram
- fine divider lines
- botanical corner decorations
- grain/paper texture
- small date stamp
- elegant circular seals
- scroll-progress indicator
- discreet M&M26 watermark patterns
- location cards
- calendar icon
- subtle section transitions
- custom cursor only on desktop if tasteful
- beautifully styled selection color

Do NOT add all of these if the design becomes crowded.

Quality is more important than quantity.

==================================================
30. FINAL PAGE FLOW
==================================================

Recommended sequence:

1. Invitation Opening Screen
2. Hero — Meda & Marrion
3. Family Invitation
4. Countdown
5. Scratch-to-Reveal
6. White Wedding Details
7. Traditional Wedding Details
8. Colors of Our Celebration
9. Couple / Celebration Quote
10. RSVP
11. Guest Wish
12. Final M&M26 Closing
13. Joscity × Developer William Footer

==================================================
31. FINAL CLOSING SCREEN
==================================================

Before the developer footer, add a beautiful final invitation section.

Large:

M&M26

Then:

Meda & Marrion

19 • 12 • 2026

And a closing line:

"We can't wait to celebrate with you."

Use botanical illustration or paper texture but no human imagery.

==================================================
32. IMPORTANT CONTENT ACCURACY
==================================================

Use these spellings exactly:

Meda Bosworth
Marrion Agbakansi

Pastor & Mrs Bosworth Onoja

Mr & Mrs Agbakansi Gabriel Chukwujekwu

Basel Event Center

Dong, Jos, Plateau State

Millennium Hotel

Close to Amusement Park, Jos, Plateau State

Wedding Date:
19 December 2026

Wedding Time:
10:00 AM

Traditional Time:
3:00 PM

Wedding Colors:
Any shade of green
Any shade of purple

Traditional Colors:
Burnt orange
Beige

RSVP:

William
WhatsApp only
08166072005

Sis. Grace Agbakansi
08038801128

Keep room for two additional RSVP contacts.

==================================================
33. IMPORTANT DEVELOPMENT RULES
==================================================

Do not:

- leave fake placeholder components
- use lorem ipsum
- make unfinished sections
- put all code in page.tsx
- put all SCSS in one file
- hardcode repeated event data
- use inline styles everywhere
- duplicate logic
- use `any` unnecessarily
- produce TypeScript errors
- leave console errors
- create hydration errors
- use photos containing people
- create neon effects
- create glowing effects
- use cheesy heart animations
- add fake 3D wedding rings floating across the screen
- make the invitation look like a generic wedding-template marketplace theme

==================================================
34. IMPLEMENTATION PROCESS
==================================================

Do not merely explain how to build the website.

Actually build it.

Work through the existing project files and implement everything.

First inspect the current repository.

Then:

1. Install only necessary dependencies.
2. Set up the folder architecture.
3. Create the wedding configuration.
4. Build reusable components.
5. Build SCSS architecture.
6. Implement opening interaction.
7. Implement countdown.
8. Implement scratch-to-reveal canvas.
9. Implement event details.
10. Implement maps.
11. Implement calendar functionality.
12. Implement RSVP/WhatsApp links.
13. Implement device-aware Joscity redirect.
14. Implement footer.
15. Implement responsive states.
16. Implement animations.
17. Implement SEO metadata.
18. Run TypeScript/lint/build checks.
19. Fix all errors you discover.
20. Review mobile responsiveness before completion.

If an existing file conflicts with this architecture, modify it intelligently instead of duplicating functionality.

==================================================
35. BEFORE COMPLETING
==================================================

Run:

npm run build

and any available:

npm run lint

or TypeScript checks.

Resolve errors.

Review for:

- TypeScript errors
- Next.js errors
- missing assets
- missing SCSS imports
- browser console warnings
- hydration errors
- broken links
- scratch card touch support
- incorrect date handling
- mobile overflow
- accessibility
- incorrect spellings
- duplicated content

Make the final result polished enough to be deployed publicly as the official digital wedding invitation for Meda Bosworth and Marrion Agbakansi.

The finished experience should feel like a custom luxury interactive invitation designed specifically for:

M&M26
Meda & Marrion
19 December 2026
Jos, Plateau State.
