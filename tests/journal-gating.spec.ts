import { test, expect, type Page } from "@playwright/test";

const PASSWORD = "DevRecette123!";
const MEMBER_A = "member.a@dev.local";

async function loginAs(page: Page, email: string) {
  await page.goto("/fr/auth/login", { waitUntil: "load" });
  const emailInput = page.locator("#email");
  const passwordInput = page.locator("#password");
  await emailInput.fill(email);
  await passwordInput.fill(PASSWORD);
  await expect(emailInput).toHaveValue(email);
  await expect(passwordInput).toHaveValue(PASSWORD);
  const [authResponse] = await Promise.all([
    page.waitForResponse((r) => r.url().includes("/auth/v1/token") && r.request().method() === "POST"),
    page.getByRole("button", { name: "Se connecter" }).click(),
  ]);
  if (!authResponse.ok()) {
    throw new Error(`Echec signInWithPassword pour ${email}: HTTP ${authResponse.status()}`);
  }
  await page.goto("/fr", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("nav-account-trigger")).toBeVisible({ timeout: 15_000 });
}

// Journal IA : chantier séparé, pas encore livré. Vérifie qu'aucun lien
// visible n'y mène et que la route est bloquée tant que
// NEXT_PUBLIC_JOURNAL_ENABLED n'est pas explicitement "true" (cf.
// lib/journal/feature-flag.ts). 100% local, sans rapport avec la production.

test.describe("Journal — absent de la navigation (visiteur non connecté)", () => {
  test("aucun lien Journal, desktop", async ({ page }) => {
    await page.goto("/fr", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: "Journal", exact: true })).toHaveCount(0);
    await expect(page.locator('a[href*="/journal"]')).toHaveCount(0);
  });

  test("aucun lien Journal, panneau mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/fr", { waitUntil: "domcontentloaded" });
    await page.getByTestId("nav-burger").click();
    await expect(page.getByRole("link", { name: "Journal", exact: true })).toHaveCount(0);
    await expect(page.locator('a[href*="/journal"]')).toHaveCount(0);
  });
});

async function dismissOnboardingIfPresent(page: Page) {
  const skip = page.getByRole("button", { name: "Passer" });
  if (await skip.isVisible({ timeout: 1000 }).catch(() => false)) {
    await skip.click();
  }
}

test.describe("Journal — absent de la navigation (utilisateur connecté)", () => {
  test("aucun lien Journal, desktop ni mobile, une fois connecté", async ({ page }) => {
    await loginAs(page, MEMBER_A);
    await page.goto("/fr", { waitUntil: "domcontentloaded" });
    await dismissOnboardingIfPresent(page);
    await expect(page.getByRole("link", { name: "Journal", exact: true })).toHaveCount(0);
    await expect(page.locator('a[href*="/journal"]')).toHaveCount(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await dismissOnboardingIfPresent(page);
    await page.getByTestId("nav-burger").click();
    await expect(page.getByRole("link", { name: "Journal", exact: true })).toHaveCount(0);
    await expect(page.locator('a[href*="/journal"]')).toHaveCount(0);
  });
});

test.describe("Journal — route bloquée (flag désactivé)", () => {
  test("accès direct à /fr/journal → 404", async ({ page }) => {
    const res = await page.goto("/fr/journal");
    expect(res?.status()).toBe(404);
  });

  test("accès direct à /fr/journal/analyse → 404", async ({ page }) => {
    const res = await page.goto("/fr/journal/analyse");
    expect(res?.status()).toBe(404);
  });
});
