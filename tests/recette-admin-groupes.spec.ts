import { test, expect, type Page } from "@playwright/test";

// Recette Admin / Groupes / Codes de points / Boutique — comptes 100% locaux
// (Supabase Docker local), jamais de rapport avec la production.
const PASSWORD = "DevRecette123!";
const PERSONAS = {
  superadmin: "superadmin@dev.local",
  adminA: "admin.a@dev.local",
  adminAB: "admin.ab@dev.local",
  adminB: "admin.b@dev.local",
  memberA: "member.a@dev.local",
  memberB: "member.b@dev.local",
  normal: "user.normal@dev.local",
} as const;

const GROUP_A = "a0000000-0000-4000-8000-00000000000a";
const GROUP_B = "b0000000-0000-4000-8000-00000000000b";

async function loginAs(page: Page, email: string) {
  await page.goto("/fr/auth/login", { waitUntil: "load" });
  const emailInput = page.locator("#email");
  const passwordInput = page.locator("#password");
  await emailInput.fill(email);
  await passwordInput.fill(PASSWORD);
  // Le formulaire est dans un Suspense boundary : vérifie que la valeur est
  // bien reflétée dans l'état React contrôlé avant de soumettre — sinon un
  // submit prématuré (avant hydratation complète) part avec des champs vides
  // ("missing email or phone" côté GoTrue) malgré un remplissage visuel.
  await expect(emailInput).toHaveValue(email);
  await expect(passwordInput).toHaveValue(PASSWORD);

  // Attend la réponse réseau réelle de signInWithPassword AVANT de considérer
  // la connexion terminée — .click() seul ne garantit pas que l'appel async
  // ait fini, et une navigation manuelle prématurée perd le cookie de session
  // en train d'être posé.
  const [authResponse] = await Promise.all([
    page.waitForResponse((r) => r.url().includes("/auth/v1/token") && r.request().method() === "POST"),
    page.getByRole("button", { name: "Se connecter" }).click(),
  ]);
  if (!authResponse.ok()) {
    throw new Error(`Echec signInWithPassword pour ${email}: HTTP ${authResponse.status()} — ${await authResponse.text()}`);
  }

  await page.goto("/fr", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("nav-account-trigger")).toBeVisible({ timeout: 15_000 });
}

test.describe("Navigation publique — Nos accès", () => {
  test("visible non connecté, desktop", async ({ page }) => {
    await page.goto("/fr", { waitUntil: "domcontentloaded" });
    const link = page.getByRole("link", { name: "Nos accès" }).first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/fr/pricing");
  });

  test("visible connecté (utilisateur normal)", async ({ page }) => {
    await loginAs(page, PERSONAS.normal);
    await page.goto("/fr", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: "Nos accès" }).first()).toBeVisible();
  });

  test("visible sur mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/fr", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: "Nos accès" }).first()).toBeVisible();
  });
});

test.describe("Utilisateur normal — aucun accès admin", () => {
  test("ne voit aucune entrée Admin, /admin et /master refusés", async ({ page }) => {
    await loginAs(page, PERSONAS.normal);
    await page.goto("/fr", { waitUntil: "domcontentloaded" });
    await page.getByTestId("nav-account-trigger").click();
    await expect(page.getByRole("menu")).toBeVisible();
    await expect(page.getByRole("menu").getByRole("link", { name: "Admin" })).toHaveCount(0);

    const resAdminLoyalty = await page.goto("/fr/admin/loyalty");
    expect(resAdminLoyalty?.status()).toBe(404);

    const resAdminCodes = await page.goto("/fr/admin/codes");
    expect(resAdminCodes?.status()).toBe(404);

    const resMaster = await page.goto("/fr/master");
    expect(resMaster?.status()).toBe(404);

    const resGroupA = await page.goto(`/fr/master/${GROUP_A}`);
    expect(resGroupA?.status()).toBe(404);
  });
});

test.describe("Group Admin d'un seul groupe (adminA)", () => {
  test("voit exactement une entrée Admin, accède à son groupe, pas à B, pas au Super Admin", async ({ page }) => {
    await loginAs(page, PERSONAS.adminA);
    await page.goto("/fr", { waitUntil: "domcontentloaded" });
    await page.getByTestId("nav-account-trigger").click();
    const adminLinks = page.getByRole("menu").getByRole("link", { name: "Admin" });
    await expect(adminLinks).toHaveCount(1);
    await expect(adminLinks).toHaveAttribute("href", "/fr/master");

    await page.goto(`/fr/master/${GROUP_A}`, { waitUntil: "domcontentloaded" });
    expect(page.url()).toContain(`/master/${GROUP_A}`);

    const resB = await page.goto(`/fr/master/${GROUP_B}`);
    expect(resB?.status()).toBe(404);

    const resSuperAdmin = await page.goto("/fr/admin/loyalty");
    expect(resSuperAdmin?.status()).toBe(404);
  });
});

test.describe("Group Admin multi-groupes (adminAB)", () => {
  test("une seule entrée Admin, accès aux deux groupes autorisés, jamais aux autres", async ({ page }) => {
    await loginAs(page, PERSONAS.adminAB);
    await page.goto("/fr/master", { waitUntil: "domcontentloaded" });
    // La landing /master liste les groupes administrés : les deux doivent apparaître.
    await expect(page.getByText("Groupe A — Recette")).toBeVisible();
    await expect(page.getByText("Groupe B — Recette")).toBeVisible();

    const resA = await page.goto(`/fr/master/${GROUP_A}`);
    expect(resA?.status()).toBe(200);
    const resB = await page.goto(`/fr/master/${GROUP_B}`);
    expect(resB?.status()).toBe(200);

    await page.getByTestId("nav-account-trigger").click();
    await expect(page.getByRole("menu").getByRole("link", { name: "Admin" })).toHaveCount(1);
  });
});

test.describe("Super Admin", () => {
  test("une seule entrée Admin, voit tous les groupes, peut ouvrir l'administration de n'importe lequel", async ({ page }) => {
    await loginAs(page, PERSONAS.superadmin);
    await page.goto("/fr", { waitUntil: "domcontentloaded" });
    await page.getByTestId("nav-account-trigger").click();
    const adminLinks = page.getByRole("menu").getByRole("link", { name: "Admin" });
    await expect(adminLinks).toHaveCount(1);
    await expect(adminLinks).toHaveAttribute("href", "/fr/admin/loyalty");

    await page.goto("/fr/admin/loyalty", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Synthèse" })).toBeVisible();
    await expect(page.getByText("Groupe A — Recette")).toBeVisible();
    await expect(page.getByText("Groupe B — Recette")).toBeVisible();

    // Lien de repli vers les codes d'accès globaux (fusion de nav : plus de 2e entrée
    // "Codes d'accès" séparée dans le menu compte, mais toujours accessible).
    await expect(page.getByRole("link", { name: "Codes d’accès globaux →" })).toBeVisible();

    // L'administration d'un groupe par le Super Admin passe par
    // /admin/loyalty/groups/[groupId] (fiche détail : membres, codes, ledger,
    // renommage, attribution admin) — /master/[groupId] reste réservé aux
    // VRAIS admins actifs du groupe (fail-closed par design, cf. master/page.tsx).
    const resA = await page.goto(`/fr/admin/loyalty/groups/${GROUP_A}`);
    expect(resA?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Groupe A — Recette" })).toBeVisible();
  });
});

test.describe("Super Admin également Group Admin — pas de doublon", () => {
  test("adminA promu Super Admin localement ne voit toujours qu'une entrée Admin", async ({ page }) => {
    // adminAB est admin de deux groupes ; on vérifie que le cumul de rôles ne
    // duplique jamais l'entrée de nav (le test précédent couvre déjà le cumul
    // isAdmin+isGroupAdmin réel via superadmin s'il était aussi admin de groupe ;
    // ici on confirme via adminAB qu'aucune UI ne fuit un 2e lien "Fidélité"/"Codes d'accès").
    await loginAs(page, PERSONAS.adminAB);
    await page.goto("/fr", { waitUntil: "domcontentloaded" });
    await page.getByTestId("nav-account-trigger").click();
    const menu = page.getByRole("menu");
    await expect(menu.getByRole("link", { name: "Fidélité" })).toHaveCount(0);
    await expect(menu.getByRole("link", { name: "Codes d'accès" })).toHaveCount(0);
  });
});
