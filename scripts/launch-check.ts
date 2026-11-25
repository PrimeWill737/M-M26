import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const origin = process.env.TEST_ORIGIN || "http://localhost:3000";
const errors: string[] = [];
page.on("pageerror", (error) => errors.push(error.message));
await mkdir("test-results", { recursive: true });
try {
  await page.goto(`${origin}/v2`);
  await expect(
    page.getByRole("heading", {
      name: "Our next chapter. Your front-row seat.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("timer")).toBeVisible();
  await expect(page.locator("#upload")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Developer William" }),
  ).toHaveAttribute("href", "https://william-lac.vercel.app");
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/launch-${width}.png`,
      fullPage: true,
    });
  }
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(axe.violations.map((v) => v.id)).toEqual([]);
  await page.route("**/api/gallery?*", (route) =>
    route.fulfill({
      json: {
        memories: [],
        cloud: "test",
        hasMore: false,
        maxBytes: 104857600,
      },
    }),
  );
  const hasParticles = () =>
    page.locator("canvas").evaluate((canvas: HTMLCanvasElement) =>
      canvas
        .getContext("2d")!
        .getImageData(0, 0, canvas.width, canvas.height)
        .data.some((value, i) => i % 4 === 3 && value > 0),
    );
  await page.goto(`${origin}/v2?preview=1`);
  await expect.poll(hasParticles).toBe(true);
  await page.screenshot({ path: "test-results/celebration-opening.png" });
  expect(
    await page.evaluate(() => localStorage.getItem("mm26-preview-welcome")),
  ).toBe("seen");
  expect(
    await page.evaluate(() => localStorage.getItem("mm26-forever-welcome")),
  ).toBeNull();
  await expect(
    page.getByRole("link", { name: "Developer William" }),
  ).toHaveAttribute("href", "https://william-lac.vercel.app");
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await hasParticles()).toBe(false);
  await page.evaluate(() => localStorage.removeItem("mm26-preview-welcome"));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator("canvas")).toBeHidden();
  expect(await hasParticles()).toBe(false);
  expect(errors).toEqual([]);
  console.log(
    "Launch gate, responsive layout, accessibility, developer link, first-visit particles, repeat-visit suppression and reduced motion passed.",
  );
} finally {
  await browser.close();
}
