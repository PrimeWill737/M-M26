import { webkit } from "@playwright/test";
import { weddingConfig } from "../config/wedding";
import { writeFile } from "node:fs/promises";
const browser = await webkit.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  reducedMotion: "reduce",
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1",
});
const page = await context.newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
if (weddingConfig.music.src)
  await page.getByRole("button", { name: "Continue quietly" }).tap();
await page
  .getByRole("button", { name: "Open Invitation", exact: true })
  .first()
  .tap();
await page.locator("canvas").scrollIntoViewIfNeeded();
const box = await page.locator("canvas").boundingBox();
if (!box) throw new Error("Missing scratch canvas");
for (let y = 24; y < box.height - 15; y += 35) {
  for (let x = 24; x < box.width - 15; x += 35) {
    if (
      await page
        .locator(".scratch-card")
        .evaluate((el) => el.classList.contains("is-revealed"))
    )
      break;
    await page.touchscreen.tap(box.x + x, box.y + y);
  }
}
if (
  !(await page
    .locator(".scratch-card")
    .evaluate((el) => el.classList.contains("is-revealed")))
)
  errors.push("WebKit touch scratching did not reveal at threshold");
await page.getByRole("button", { name: "Replay" }).tap();
await page.getByRole("button", { name: "Reveal Details", exact: true }).tap();
if (
  !(await page
    .locator(".scratch-card")
    .evaluate((el) => el.classList.contains("is-revealed")))
)
  errors.push("WebKit accessible reveal failed");
await page.getByRole("button", { name: "Explore" }).tap();
await page.locator('.mobile-nav a[href="#rsvp"]').tap();
await page.getByRole("button", { name: "Leave the Couple a Wish" }).tap();
await page.getByLabel(/Your message to/).fill("With love from Safari.");
if (!(await page.getByRole("link", { name: "Send with WhatsApp" }).isVisible()))
  errors.push("WebKit wish form failed");
await page.getByRole("button", { name: "Close dialog" }).tap();
if (
  await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
)
  errors.push("WebKit mobile overflow");
await page.screenshot({ path: "test-results/webkit-mobile.png" });
await writeFile(
  "test-results/webkit-report.json",
  JSON.stringify(
    {
      engine: "WebKit",
      viewport: "390×844",
      checks: [
        "touch scratch threshold",
        "replay",
        "accessible reveal",
        "navigation",
        "wish dialog",
        "overflow",
        "runtime errors",
      ],
      errors,
    },
    null,
    2,
  ),
);
await browser.close();
if (errors.length) {
  console.error(errors);
  process.exit(1);
}
console.log("WebKit mobile checks passed.");
