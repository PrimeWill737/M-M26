import { chromium, webkit, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
await mkdir("test-results", { recursive: true });
const url = process.env.TEST_BASE_URL || "http://localhost:3000";
for (const engine of [chromium, webkit]) {
  const browser = await engine.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  const errors: string[] = [];
  const audioRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (request.url().includes("/audio/")) audioRequests.push(request.url());
  });
  try {
    await page.goto(url, { waitUntil: "networkidle" });
    await expect(
      page.getByRole("dialog", { name: "A little music, a little magic." }),
    ).toBeVisible();
    expect(
      await page
        .locator("audio")
        .evaluate((el) => (el as HTMLAudioElement).paused),
    ).toBe(true);
    expect(audioRequests).toHaveLength(0);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `test-results/music-${engine.name()}.png` });
    if (engine === chromium) {
      for (const width of [320, 1280]) {
        await page.setViewportSize({ width, height: 844 });
        await page.screenshot({ path: `test-results/music-${width}.png` });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
        ).toBe(false);
      }
      await page.setViewportSize({ width: 390, height: 844 });
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.failureSummary),
        })),
      ).toEqual([]);
    }
    await page.getByRole("button", { name: "Continue quietly" }).tap();
    await expect(page.locator("dialog")).toHaveCount(0);
    expect(
      await page
        .locator("audio")
        .evaluate((el) => (el as HTMLAudioElement).paused),
    ).toBe(true);
    await page
      .getByRole("button", { name: "Open Invitation", exact: true })
      .first()
      .tap();
    await expect(page.locator(".intro")).toHaveCount(0);
    expect(
      await page
        .locator("audio")
        .evaluate((el) => (el as HTMLAudioElement).paused),
    ).toBe(true);
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Play music", exact: true }).tap();
    await expect(
      page.getByRole("button", { name: "Pause background music" }),
    ).toBeVisible();
    await page.waitForFunction(() => {
      const audio = document.querySelector("audio");
      return audio && !audio.paused && audio.currentTime > 0.1;
    });
    const before = await page
      .locator("audio")
      .evaluate((el) => (el as HTMLAudioElement).currentTime);
    await page
      .getByRole("button", { name: "Open Invitation", exact: true })
      .first()
      .tap();
    await expect(page.locator(".intro")).toHaveCount(0);
    expect(
      await page
        .locator("audio")
        .evaluate((el) => (el as HTMLAudioElement).currentTime),
    ).toBeGreaterThan(before);
    await page.getByRole("button", { name: "Pause background music" }).tap();
    await expect(
      page.getByRole("button", { name: "Play background music" }),
    ).toBeVisible();
    expect(
      await page
        .locator("audio")
        .evaluate((el) => (el as HTMLAudioElement).paused),
    ).toBe(true);
    await page.getByRole("button", { name: "Play background music" }).tap();
    await expect(
      page.getByRole("button", { name: "Pause background music" }),
    ).toBeVisible();
    await page.reload({ waitUntil: "networkidle" });
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog")).toHaveCount(0);
    expect(
      await page
        .locator("audio")
        .evaluate((el) => (el as HTMLAudioElement).paused),
    ).toBe(true);
    expect(errors).toEqual([]);
    console.log(
      `${engine.name()}: consent, silence, real playback, opening continuity, pause/resume and Escape passed.`,
    );
    await page.addInitScript(() => {
      HTMLMediaElement.prototype.play = () =>
        Promise.reject(new DOMException("Blocked", "NotAllowedError"));
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Play music", exact: true }).tap();
    await expect(
      page.locator(".music-prompt").getByRole("alert"),
    ).toContainText("couldn’t start");
    await page.getByRole("button", { name: "Continue quietly" }).tap();
    await expect(page.locator("dialog")).toHaveCount(0);
    console.log(`${engine.name()}: blocked playback remains dismissible.`);
  } finally {
    await browser.close();
  }
}
