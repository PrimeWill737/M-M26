import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const browser = await chromium.launch({ headless: true, channel: "msedge" });
const context = await browser.newContext();
const page = await context.newPage();
const errors: string[] = [];
page.on("pageerror", (error) => errors.push(error.message));
await mkdir("test-results", { recursive: true });
const origin = process.env.TEST_ORIGIN || "http://localhost:3000";
try {
  const home = await page.goto(origin);
  expect(home?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: "A beautiful day." }),
  ).toHaveCount(0);
  // The unconfigured API must fail safely without leaking infrastructure details.
  const response = await page.request.get(
    `${origin}/api/gallery?album=invalid`,
  );
  expect(response.status()).toBe(400);
  const early = await page.request.post(`${origin}/api/gallery/sign`, {
    headers: { Origin: origin },
    data: { album: "wedding", size: 100, consent: true },
  });
  expect(early.status()).toBe(403);
  // Deterministic empty gallery to exercise the interface without cloud credentials.
  await page.route("**/api/gallery?*", (route) =>
    route.fulfill({
      json: {
        memories: [],
        cloud: "demo",
        hasMore: false,
        maxBytes: 104857600,
      },
    }),
  );
  await page.goto(`${origin}/v2?preview=1`, { waitUntil: "networkidle" });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 800) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForTimeout(500);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/album-${width}.png`,
      fullPage: true,
    });
  }
  await page.getByRole("button", { name: "Wedding 19 DEC" }).click();
  await expect(
    page.getByRole("button", { name: "Wedding 19 DEC" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("combobox", { name: "Add to" })).toHaveValue(
    "wedding",
  );
  await page.locator('input[type="file"]').setInputFiles({
    name: "memory.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.from("test"),
  });
  await expect(page.getByText("memory.jpg", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Share with love", exact: true }),
  ).toBeDisabled();
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Share with love", exact: true })
    .click();
  await expect(
    page.getByText("Guest uploads open on 18 December at 1:30 pm WAT."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Retry remaining files" }),
  ).toBeEnabled();
  await page.route("**/api/gallery/sign", (route) =>
    route.fulfill({
      json: {
        cloud: "test",
        apiKey: "test",
        params: {},
        signature: "test",
        ticket: "test",
      },
    }),
  );
  await page.route("https://api.cloudinary.com/**", (route) =>
    route.fulfill({ json: { resource_type: "image" } }),
  );
  await page.route("**/api/gallery/complete", (route) =>
    route.fulfill({ json: { saved: true } }),
  );
  const memory = {
    id: "test-photo",
    album: "wedding",
    guest_name: "A friend",
    caption: "A beautiful memory",
    public_id: "mm26/wedding/test",
    resource_type: "image",
    format: "jpg",
    version: 1,
    created_at: "2026-12-19T12:00:00Z",
  };
  await page.route("https://res.cloudinary.com/**", (route) =>
    route.fulfill({
      path: "public/images/couple/portrait-1.webp",
      contentType: "image/webp",
    }),
  );
  await page.route("**/api/gallery?*", (route) =>
    route.fulfill({
      json: {
        memories: [memory],
        cloud: "test",
        hasMore: false,
        maxBytes: 104857600,
      },
    }),
  );
  await page.getByRole("button", { name: "Retry remaining files" }).click();
  await expect(page.getByText("Shared with love ✓")).toBeVisible();
  await page.getByRole("button", { name: "Open image by A friend" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("dialog").getByRole("link", { name: "Download original" }),
  ).toHaveAttribute("href", /fl_attachment/);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  errors.push(
    ...axe.violations.map(
      (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(",")).join("; ")}`,
    ),
  );
  expect(errors).toEqual([]);
  console.log(
    "Album checks passed: mobile/desktop overflow, tabs, upload consent, launch gate, retry UI, accessibility and runtime errors.",
  );
} finally {
  await browser.close();
}
