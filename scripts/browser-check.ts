import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { weddingConfig } from "../config/wedding";
import { mkdir, writeFile } from "node:fs/promises";
const browser = await chromium.launch({ headless: true });
await mkdir("test-results", { recursive: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
const errors: string[] = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
if (weddingConfig.music.src)
  await page.getByRole("button", { name: "Continue quietly" }).click();
await page.waitForTimeout(1800);
await page.screenshot({ path: "test-results/intro-desktop.png" });
for (const width of [320, 390, 768]) {
  await page.setViewportSize({ width, height: 844 });
  await page.screenshot({ path: `test-results/intro-${width}.png` });
}
const introAxe = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
  .analyze();
if (introAxe.violations.length)
  errors.push(
    `Intro accessibility: ${JSON.stringify(introAxe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })) })))}`,
  );
await page
  .getByRole("button", { name: "Open Invitation", exact: true })
  .first()
  .click();
await page.waitForTimeout(1200);
for (const width of [320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(1100);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  if (overflow) errors.push(`Horizontal overflow at ${width}px`);
  await page.screenshot({
    path: `test-results/page-${width}.png`,
    fullPage: true,
  });
}
const axe = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
  .analyze();
if (axe.violations.length)
  errors.push(
    `Page accessibility: ${JSON.stringify(axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })) })))}`,
  );
await page.getByRole("button", { name: "Reveal Details", exact: true }).click();
if (
  !(await page
    .locator(".scratch-card")
    .evaluate((el) => el.classList.contains("is-revealed")))
)
  errors.push("Accessible scratch reveal failed");
await page.getByRole("button", { name: "Replay" }).click();
const canvas = page.locator("canvas");
await canvas.scrollIntoViewIfNeeded();
const box = await canvas.boundingBox();
if (!box) throw new Error("Missing canvas");
await page.mouse.move(box.x + 15, box.y + 15);
await page.mouse.down();
for (let row = 15; row < box.height - 10; row += 24) {
  await page.mouse.move(box.x + 15, box.y + row);
  await page.mouse.move(box.x + box.width - 15, box.y + row, { steps: 14 });
}
await page.mouse.up();
if (
  !(await page
    .locator(".scratch-card")
    .evaluate((el) => el.classList.contains("is-revealed")))
)
  errors.push("Canvas threshold auto-reveal failed");
await page.getByRole("button", { name: "Leave the Couple a Wish" }).click();
await page
  .getByLabel(/Your message to/)
  .fill("Wishing you beautiful days together.");
const wishLink = await page
  .getByRole("link", { name: "Send with WhatsApp" })
  .getAttribute("href");
if (!wishLink?.includes("Wishing%20you"))
  errors.push("Wish WhatsApp encoding failed");
const modalAxe = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
  .analyze();
if (modalAxe.violations.length)
  errors.push(
    `Dialog accessibility: ${JSON.stringify(modalAxe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
  );
await page.keyboard.press("Escape");
if (await page.locator("dialog").count())
  errors.push("Escape did not close dialog");
await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole("button", { name: "Explore" }).click();
await page.locator('.mobile-nav a[href="#traditional"]').click();
if (await page.locator("dialog").count())
  errors.push("Mobile navigation did not close");
if (
  !(await page
    .locator("#traditional")
    .evaluate((el) => el === document.activeElement))
) {
  await page.waitForTimeout(100);
  if (
    !(await page
      .locator("#traditional")
      .evaluate((el) => el === document.activeElement))
  )
    errors.push("Mobile navigation focus not moved");
}
await page.getByRole("link", { name: "Joscity" }).click();
if (
  !(await page.getByRole("status").filter({ hasText: "Joscity" }).isVisible())
)
  errors.push("Joscity unconfigured fallback failed");
const touchContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 3,
  reducedMotion: "reduce",
});
const touchPage = await touchContext.newPage();
await touchPage.goto("http://localhost:3000");
if (weddingConfig.music.src)
  await touchPage.getByRole("button", { name: "Continue quietly" }).tap();
await touchPage
  .getByRole("button", { name: "Open Invitation", exact: true })
  .first()
  .tap();
await touchPage.locator("canvas").scrollIntoViewIfNeeded();
const touchBox = await touchPage.locator("canvas").boundingBox();
const cdp = await touchContext.newCDPSession(touchPage);
if (touchBox) {
  for (let y = 20; y < touchBox.height - 10; y += 32) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: touchBox.x + 15, y: touchBox.y + y }],
    });
    for (let x = 15; x < touchBox.width - 10; x += 15)
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: touchBox.x + x, y: touchBox.y + y }],
      });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  }
}
if (
  !(await touchPage
    .locator(".scratch-card")
    .evaluate((el) => el.classList.contains("is-revealed")))
)
  errors.push("Touch scratch auto-reveal failed");
await writeFile(
  "test-results/browser-report.json",
  JSON.stringify(
    {
      widths: [320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440],
      errors,
      checks: [
        "opening",
        "overflow",
        "screenshots",
        "WCAG axe",
        "keyboard dialog",
        "mouse scratching",
        "touch scratching",
        "mobile navigation",
        "wish encoding",
        "Joscity fallback",
      ],
    },
    null,
    2,
  ),
);
await browser.close();
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  "All browser checks passed: 10 widths, accessibility, pointer/touch scratch, dialogs, navigation and links.",
);
