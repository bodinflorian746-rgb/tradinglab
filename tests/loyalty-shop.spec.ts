import { test, expect } from "@playwright/test";

// Parcours E2E du magasin de fidélité (code de référence, rattachement,
// gestion des articles, achat). Nécessite DEV_AUTH_BYPASS=true (voir
// lib/dev-auth.ts) ET la migration 20260724120000_group_reference_code_and_shop
// appliquée sur la base Supabase ciblée — sans elle, les pages affichent un
// bandeau d'erreur au lieu du contenu attendu et la plupart des assertions
// ci-dessous échouent (comportement attendu, pas une régression : cf. le
// bandeau "Erreur de chargement" vérifié séparément avant l'application de
// la migration).
//
// Groupe de test utilisé : a0000000-0000-4000-8000-000000000001 (groupe réel
// existant côté Supabase, déjà utilisé par la validation E2E des phases
// précédentes du programme de fidélité). Adapter si ce groupe n'existe pas
// dans l'environnement cible.
const GROUP_ID = "a0000000-0000-4000-8000-000000000001";

test.describe("Master — code de référence du groupe", () => {
  test("le code de référence est affiché et copiable depuis le tableau de bord", async ({ page }) => {
    await page.goto(`/fr/master/${GROUP_ID}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Code de référence du groupe")).toBeVisible();

    const code = page.locator("span.font-mono", { hasText: /^GRP-/ });
    await expect(code).toBeVisible();
    const codeText = (await code.textContent())?.trim() ?? "";
    expect(codeText).toMatch(/^GRP-[A-Z0-9]{4}-[A-Z0-9]{4}$/);

    await page.getByRole("button", { name: "Copier" }).click();
    await expect(page.getByRole("button", { name: "Copié !" })).toBeVisible();
  });
});

test.describe("Master — magasin du groupe", () => {
  test("le gestionnaire peut créer, modifier et désactiver un article", async ({ page }) => {
    await page.goto(`/fr/master/${GROUP_ID}/magasin`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Magasin" })).toBeVisible();

    // Création
    await page.getByRole("button", { name: "Nouvel article" }).click();
    const itemName = `Article Playwright ${Date.now()}`;
    await page.getByLabel("Nom").first().fill(itemName);
    await page.getByLabel("Description (optionnel)").fill("Créé par le test E2E loyalty-shop.spec.ts");
    await page.getByLabel("Prix (points)").fill("42");
    await page.getByRole("button", { name: "Créer" }).click();

    const row = page.locator("tr", { hasText: itemName });
    await expect(row).toBeVisible({ timeout: 10_000 });
    await expect(row.getByText("42")).toBeVisible();
    await expect(row.getByText("Actif")).toBeVisible();

    // Édition
    await row.getByRole("button", { name: "Modifier" }).click();
    const editedName = `${itemName} (modifié)`;
    const nameInput = page.getByLabel("Nom").first();
    await nameInput.fill(editedName);
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.locator("tr", { hasText: editedName })).toBeVisible({ timeout: 10_000 });

    // Désactivation
    const editedRow = page.locator("tr", { hasText: editedName });
    await editedRow.getByRole("button", { name: "Désactiver" }).click();
    await expect(editedRow.getByText("Inactif")).toBeVisible({ timeout: 10_000 });

    // Réactivation (nettoyage — ne laisse pas d'article inactif orphelin)
    await editedRow.getByRole("button", { name: "Activer" }).click();
    await expect(editedRow.getByText("Actif")).toBeVisible({ timeout: 10_000 });
  });

  test("un formulaire vide ne peut pas être soumis (validation client)", async ({ page }) => {
    await page.goto(`/fr/master/${GROUP_ID}/magasin`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Nouvel article" }).click();
    await expect(page.getByRole("button", { name: "Créer" })).toBeDisabled();
  });
});

test.describe("Fidélité — rattachement par code de référence", () => {
  test("un code de référence inconnu affiche une erreur claire", async ({ page }) => {
    await page.goto("/fr/fidelite", { waitUntil: "domcontentloaded" });
    // Le formulaire GRP vit désormais dans l'onglet dédié, plus visible par défaut.
    await page.getByRole("tab", { name: "Rejoindre un groupe" }).click();
    await expect(page.getByRole("heading", { name: "Rejoindre un groupe" })).toBeVisible();

    await page.getByPlaceholder("GRP-XXXX-XXXX").fill("GRP-0000-0000");
    await page.getByRole("button", { name: "Rejoindre" }).click();

    await expect(page.getByText("Ce code de référence n'existe pas.")).toBeVisible({ timeout: 10_000 });
  });

  test("un code vide ne peut pas être soumis", async ({ page }) => {
    await page.goto("/fr/fidelite", { waitUntil: "domcontentloaded" });
    await page.getByRole("tab", { name: "Rejoindre un groupe" }).click();
    await expect(page.getByRole("button", { name: "Rejoindre" })).toBeDisabled();
  });
});

test.describe("Fidélité — magasin membre", () => {
  test("la section magasin est visible sur la page d'un groupe où l'utilisateur est membre", async ({
    page,
  }) => {
    await page.goto(`/fr/fidelite/${GROUP_ID}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Magasin" })).toBeVisible();
  });
});

// ─── Onglets « Mes points » / « Rejoindre un groupe » ────────────────────────
// Nécessite une vraie session (pas DEV_AUTH_BYPASS, qui mocke un seul
// utilisateur fixe) : réutilise les personas @dev.local déjà seedées pour la
// recette (scripts/seed-smoke-test-personas.js) — user.normal (aucun
// groupe), admin.a (un seul groupe : Groupe A — Recette, où il est admin
// donc aussi titulaire d'un portefeuille), admin.ab (deux groupes : A et B).
const PASSWORD = "DevRecette123!";

async function loginAs(page: import("@playwright/test").Page, email: string) {
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

test.describe("Fidélité — onglets", () => {
  test("« Mes points » est actif par défaut, aucun code GRP visible avant clic sur l'autre onglet", async ({
    page,
  }) => {
    await loginAs(page, "admin.a@dev.local");
    await page.goto("/fr/fidelite", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("tab", { name: "Mes points" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tab", { name: "Rejoindre un groupe" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    await expect(page.getByPlaceholder("PTS-XXXX-XXXX")).toBeVisible();
    await expect(page.getByPlaceholder("GRP-XXXX-XXXX")).toBeHidden();
    await expect(page.getByText("Master")).toHaveCount(0);
    await expect(page.getByText("Telegram")).toHaveCount(0);

    await page.getByRole("tab", { name: "Rejoindre un groupe" }).click();
    await expect(page.getByPlaceholder("GRP-XXXX-XXXX")).toBeVisible();
    await expect(page.getByPlaceholder("PTS-XXXX-XXXX")).toBeHidden();
  });

  test("utilisateur sans groupe : message d'état vide, pas d'ancien texte « portefeuille »", async ({
    page,
  }) => {
    await loginAs(page, "user.normal@dev.local");
    await page.goto("/fr/fidelite", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Tu n'as rejoint aucun groupe.")).toBeVisible();
    await expect(
      page.getByText("Utilise l'onglet « Rejoindre un groupe » pour saisir ton code de référence."),
    ).toBeVisible();
    await expect(page.getByText("Tu n'as pas encore de portefeuille")).toHaveCount(0);
  });

  test("utilisateur avec un groupe : solde et boutique affichés dans l'onglet Mes points", async ({
    page,
  }) => {
    await loginAs(page, "admin.a@dev.local");
    await page.goto("/fr/fidelite", { waitUntil: "domcontentloaded" });

    const card = page.locator("section", { hasText: "Groupe A — Recette" });
    await expect(card).toBeVisible();
    await expect(card.getByText("Solde")).toBeVisible();
    await expect(card.getByText("Magasin")).toBeVisible();
  });

  test("utilisateur avec plusieurs groupes : une carte solde+boutique par groupe", async ({ page }) => {
    await loginAs(page, "admin.ab@dev.local");
    await page.goto("/fr/fidelite", { waitUntil: "domcontentloaded" });

    await expect(page.locator("section", { hasText: "Groupe A — Recette" })).toBeVisible();
    await expect(page.locator("section", { hasText: "Groupe B — Recette" })).toBeVisible();
  });
});

test.describe("Responsive — mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("le magasin manager reste utilisable en mobile", async ({ page }) => {
    await page.goto(`/fr/master/${GROUP_ID}/magasin`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Magasin" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Nouvel article" })).toBeVisible();
  });

  test("le formulaire de rattachement reste utilisable en mobile", async ({ page }) => {
    await page.goto("/fr/fidelite", { waitUntil: "domcontentloaded" });
    await page.getByRole("tab", { name: "Rejoindre un groupe" }).click();
    await expect(page.getByPlaceholder("GRP-XXXX-XXXX")).toBeVisible();
  });
});
