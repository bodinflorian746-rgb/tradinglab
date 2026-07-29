import { test, expect, type Page } from "@playwright/test";

// Parcours E2E complet (formulaires réels, pas seulement navigation).
// Compatible LOCAL (Supabase Docker, valeurs par défaut ci-dessous) ET
// DISTANT (nouveau projet Plan B, via NEW_SUPABASE_URL/NEW_SERVICE_KEY
// positionnées par scripts/smoke-test-new-project.ps1).
//
// Audit Plan B : la vérification base ne passe plus par
// "docker exec supabase_db_tradinglab psql" (queryDb, local uniquement) mais
// par PostgREST en service_role (queryTable) — fonctionne contre n'importe
// quel projet Supabase, local ou distant.
//
// Enchaîne : Super Admin crée un groupe et y affecte adminA → Group Admin
// génère un code de points, crée un produit payant/gratuit/à stock limité,
// l'édite puis le désactive → Membre active le code, achète, épuise le stock
// → Group Admin génère des codes de déblocage (lifetime/durée/lot) → Membre
// active un code durée=7j (preuve : la période démarre à l'ACTIVATION, pas à
// la création) → Group Admin génère un code de points >100 000 et un lot de
// 150 (aucune limite technique atteinte) → Membre refusé pour solde
// insuffisant. Isolation vérifiée à chaque étape contre les groupes fixtures
// (GROUP_A/GROUP_B, cf. scripts/seed-smoke-test-personas.js).
//
// Écritures métier RÉELLES : toujours via une vraie session authenticated
// (login UI + Server Action de l'app) — purchase_shop_item,
// join_group_by_reference_code, generate_group_reference_code sont
// "service_role" only (revoke all from public, anon, authenticated dans les
// migrations) : impossible et volontairement impossible de les appeler
// directement avec le JWT d'un utilisateur. service_role n'est utilisé ICI
// QUE pour lire les postconditions (queryTable) et pour le nettoyage final.
//
// Nettoyage : test.afterAll supprime toutes les lignes créées par ce fichier
// (groupe de test + dépendances, dans l'ordre respectant les FK "restrict").
// Ne touche jamais aux groupes fixtures ni aux autres données.

const PASSWORD = "DevRecette123!";
const SUPERADMIN = "superadmin@dev.local";
const ADMIN_A = "admin.a@dev.local";
const MEMBER_A = "member.a@dev.local";

// Mêmes UUID que scripts/seed-smoke-test-personas.js — groupes fixtures
// jamais touchés par ce fichier, utilisés uniquement pour prouver l'absence
// de fuite entre groupes.
const FIXTURE_GROUP_A = "a0000000-0000-4000-8000-00000000000a";
const FIXTURE_GROUP_B = "b0000000-0000-4000-8000-00000000000b";

// Valeurs par défaut = projet Supabase LOCAL standard (supabase start), donc
// publiques et documentées par la CLI — jamais un secret de production. En
// contexte Plan B, smoke-test-new-project.ps1 positionne les vraies
// variables NEW_SUPABASE_URL / NEW_SERVICE_KEY du nouveau projet AVANT de
// lancer Playwright ; ce fichier ne lit jamais .env.local.
const REST_URL = process.env.NEW_SUPABASE_URL || "http://127.0.0.1:54321";
const SERVICE_KEY =
  process.env.NEW_SERVICE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

async function queryTable<T = Record<string, unknown>>(table: string, query: string): Promise<T[]> {
  const res = await fetch(`${REST_URL}/rest/v1/${table}?${query}`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  if (!res.ok) {
    throw new Error(`queryTable(${table}?${query}) → HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function deleteRows(table: string, query: string): Promise<void> {
  const res = await fetch(`${REST_URL}/rest/v1/${table}?${query}`, {
    method: "DELETE",
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  if (!res.ok && res.status !== 404) {
    console.error(`[cleanup] DELETE ${table}?${query} → HTTP ${res.status}: ${await res.text()}`);
  }
}

async function getUserIdByEmail(email: string): Promise<string> {
  const res = await fetch(`${REST_URL}/auth/v1/admin/users?page=1&per_page=1000`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  if (!res.ok) throw new Error(`getUserIdByEmail(${email}) → HTTP ${res.status}`);
  const body = (await res.json()) as { users: { id: string; email: string }[] };
  const found = body.users.find((u) => u.email === email);
  if (!found) throw new Error(`getUserIdByEmail : ${email} introuvable`);
  return found.id;
}

async function dismissOnboardingIfPresent(page: Page) {
  const skip = page.getByRole("button", { name: "Passer" });
  if (await skip.isVisible({ timeout: 1000 }).catch(() => false)) {
    await skip.click();
  }
}

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

test.describe.serial("Parcours E2E complet — création groupe → codes/boutique → achats → déblocage/isolation", () => {
  const groupName = `Groupe E2E ${Date.now()}`;
  let groupId = "";
  let pointsCode = "";
  let duration7Code = "";
  let memberAId = "";
  const POINTS_VALUE = 12345; // valeur libre, non ronde, prouve l'absence de plafond bas

  test("1. Super Admin crée un groupe et affecte adminA", async ({ page }) => {
    await loginAs(page, SUPERADMIN);
    await page.goto("/fr/admin/loyalty", { waitUntil: "domcontentloaded" });

    await page.locator("#new-group-name").fill(groupName);
    await page.getByPlaceholder("admin@email.com").first().fill(ADMIN_A);
    await page.getByRole("button", { name: "Créer le groupe" }).click();

    const link = page.getByRole("link", { name: "Voir le groupe →" });
    await expect(link).toBeVisible({ timeout: 10_000 });
    const href = await link.getAttribute("href");
    groupId = href!.split("/").pop()!;
    expect(groupId).toMatch(/^[0-9a-f-]{36}$/);
  });

  test("2. Super Admin ouvre l'administration complète du groupe (codes, points, boutique)", async ({ page }) => {
    await loginAs(page, SUPERADMIN);
    await page.goto(`/fr/admin/loyalty/groups/${groupId}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: groupName })).toBeVisible();

    const resCodes = await page.goto(`/fr/master/${groupId}/codes`);
    expect(resCodes?.status()).toBe(200);
    const resDeblocage = await page.goto(`/fr/master/${groupId}/deblocage`);
    expect(resDeblocage?.status()).toBe(200);
    const resMagasin = await page.goto(`/fr/master/${groupId}/magasin`);
    expect(resMagasin?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Magasin" })).toBeVisible();
  });

  test("3. Group Admin (adminA) génère un code de points à valeur libre (12345)", async ({ page }) => {
    await loginAs(page, ADMIN_A);
    await page.goto(`/fr/master/${groupId}/codes`, { waitUntil: "domcontentloaded" });

    const countInput = page.locator("#gen-count");
    const valueInput = page.locator("#gen-value");
    await countInput.fill("1");
    await expect(countInput).toHaveValue("1");
    await valueInput.fill(String(POINTS_VALUE));
    await expect(valueInput).toHaveValue(String(POINTS_VALUE));
    await page.getByRole("button", { name: "Générer" }).click();
    await expect(page.getByText(/1 code\(s\) généré/)).toBeVisible({ timeout: 10_000 });

    const codeCell = page.locator("td.font-mono", { hasText: /^PTS-/ }).first();
    await expect(codeCell).toBeVisible();
    pointsCode = (await codeCell.textContent())!.trim();
    expect(pointsCode).toMatch(/^PTS-[A-Z0-9]{4}-[A-Z0-9]{4}$/);

    // Vérification base (service_role/PostgREST) : la valeur réellement
    // stockée est bien 12345, pas la valeur par défaut du formulaire (10).
    const rows = await queryTable<{ points_value: number }>("points_codes", `code=eq.${pointsCode}&select=points_value`);
    expect(rows[0]?.points_value).toBe(POINTS_VALUE);
  });

  test("4. Group Admin crée un produit payant, un gratuit, un à stock limité", async ({ page }) => {
    await loginAs(page, ADMIN_A);
    await page.goto(`/fr/master/${groupId}/magasin`, { waitUntil: "domcontentloaded" });
    await dismissOnboardingIfPresent(page);

    // Produit payant
    await page.getByRole("button", { name: "Nouvel article" }).click();
    await page.getByLabel("Nom").first().fill("Produit Payant E2E");
    await page.getByLabel(/Prix/).fill("100");
    await page.getByRole("button", { name: "Créer" }).click();
    await expect(page.locator("tr", { hasText: "Produit Payant E2E" })).toBeVisible({ timeout: 10_000 });

    // Produit gratuit (0 point) — doit être acceptable via l'UI
    await dismissOnboardingIfPresent(page);
    await page.getByRole("button", { name: "Nouvel article" }).click();
    await page.getByLabel("Nom").first().fill("Produit Gratuit E2E");
    await page.getByLabel(/Prix/).fill("0");
    await page.getByRole("button", { name: "Créer" }).click();
    const freeRow = page.locator("tr", { hasText: "Produit Gratuit E2E" });
    await expect(freeRow).toBeVisible({ timeout: 10_000 });
    await expect(freeRow.getByRole("cell", { name: "0", exact: true })).toBeVisible();

    // Produit à stock limité (1 unité)
    await dismissOnboardingIfPresent(page);
    await page.getByRole("button", { name: "Nouvel article" }).click();
    await page.getByLabel("Nom").first().fill("Produit Stock E2E");
    await page.getByLabel(/Prix/).fill("0");
    await page.getByLabel(/Stock/).fill("1");
    await page.getByRole("button", { name: "Créer" }).click();
    const stockRow = page.locator("tr", { hasText: "Produit Stock E2E" });
    await expect(stockRow).toBeVisible({ timeout: 10_000 });
  });

  test("5. Group Admin modifie puis désactive le produit payant", async ({ page }) => {
    await loginAs(page, ADMIN_A);
    await page.goto(`/fr/master/${groupId}/magasin`, { waitUntil: "domcontentloaded" });
    await dismissOnboardingIfPresent(page);

    const row = page.locator("tr", { hasText: "Produit Payant E2E" });
    await row.getByRole("button", { name: "Modifier" }).click();
    await page.getByLabel(/Prix/).fill("150");
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await expect(row.getByText("150")).toBeVisible({ timeout: 10_000 });

    await dismissOnboardingIfPresent(page);
    await row.getByRole("button", { name: "Désactiver" }).click();
    await expect(row.getByText("Inactif")).toBeVisible({ timeout: 10_000 });
  });

  test("6. Membre active le code, constate le crédit exact", async ({ page }) => {
    await loginAs(page, MEMBER_A);
    await page.goto("/fr/fidelite", { waitUntil: "domcontentloaded" });
    await dismissOnboardingIfPresent(page);
    const codeInput = page.getByPlaceholder(/PTS-/);
    await codeInput.fill(pointsCode);
    await expect(codeInput).toHaveValue(pointsCode);
    await page.getByRole("button", { name: "Activer" }).click();
    await expect(page.getByText(new RegExp(`${POINTS_VALUE}`)).first()).toBeVisible({ timeout: 10_000 });

    await page.goto("/fr/fidelite", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(groupName)).toBeVisible();

    // Vérification base : crédit exact, kind correct, lié au bon code.
    const rows = await queryTable<{ amount: number }>(
      "points_ledger",
      `group_id=eq.${groupId}&kind=eq.code_reward&points_code=eq.${pointsCode}&select=amount`,
    );
    expect(rows[0]?.amount).toBe(POINTS_VALUE);
  });

  test("7. Membre achète le produit gratuit, aucun débit", async ({ page }) => {
    await loginAs(page, MEMBER_A);
    await page.goto(`/fr/fidelite/${groupId}`, { waitUntil: "domcontentloaded" });
    await dismissOnboardingIfPresent(page);

    const card = page.locator(".rounded-2xl.border", { hasText: "Produit Gratuit E2E" });
    await card.getByRole("button", { name: /Acheter/ }).click();
    await expect(page.getByText("Achat confirmé : Produit Gratuit E2E !")).toBeVisible({ timeout: 10_000 });

    // Vérification base : achat enregistré à price_paid=0, AUCUNE ligne
    // points_ledger de type 'purchase' créée (contrainte amount<>0 l'interdirait).
    const items = await queryTable<{ id: string }>(
      "group_shop_items",
      `group_id=eq.${groupId}&name=eq.${encodeURIComponent("Produit Gratuit E2E")}&select=id`,
    );
    const purchases = await queryTable<{ price_paid: number }>(
      "group_shop_purchases",
      `group_id=eq.${groupId}&item_id=eq.${items[0].id}&select=price_paid`,
    );
    expect(purchases[0]?.price_paid).toBe(0);
    const purchaseLedger = await queryTable("points_ledger", `group_id=eq.${groupId}&kind=eq.purchase&select=id`);
    expect(purchaseLedger.length).toBe(0);
  });

  test("8. Membre achète le produit stock=1, puis ne peut plus (rupture)", async ({ page }) => {
    await loginAs(page, MEMBER_A);
    await page.goto(`/fr/fidelite/${groupId}`, { waitUntil: "domcontentloaded" });
    await dismissOnboardingIfPresent(page);

    const card = page.locator(".rounded-2xl.border", { hasText: "Produit Stock E2E" });
    await card.getByRole("button", { name: /Acheter/ }).click();
    await expect(page.getByText("Achat confirmé : Produit Stock E2E !")).toBeVisible({ timeout: 10_000 });

    // Après refresh, stock épuisé → bouton désactivé et libellé "Rupture de stock".
    await page.goto(`/fr/fidelite/${groupId}`, { waitUntil: "domcontentloaded" });
    await dismissOnboardingIfPresent(page);
    const card2 = page.locator(".rounded-2xl.border", { hasText: "Produit Stock E2E" });
    const buyButton = card2.getByRole("button");
    await expect(buyButton).toBeDisabled();
    await expect(buyButton).toHaveText("Rupture de stock");

    // Vérification base : stock à 0 (jamais négatif), un seul achat enregistré.
    const items = await queryTable<{ id: string; stock: number | null }>(
      "group_shop_items",
      `group_id=eq.${groupId}&name=eq.${encodeURIComponent("Produit Stock E2E")}&select=id,stock`,
    );
    expect(items[0]?.stock).toBe(0);
    const purchases = await queryTable(
      "group_shop_purchases",
      `group_id=eq.${groupId}&item_id=eq.${items[0].id}&select=id`,
    );
    expect(purchases.length).toBe(1);
  });

  test("9. Group Admin génère des codes de déblocage (lifetime, durée 7j, durée 14j, lot de 5) — rattachés uniquement au bon groupe", async ({
    page,
  }) => {
    await loginAs(page, ADMIN_A);
    await page.goto(`/fr/master/${groupId}/deblocage`, { waitUntil: "domcontentloaded" });
    await dismissOnboardingIfPresent(page);

    async function generate(count: string, kind: "lifetime" | "duration", durationDays?: string) {
      // L'overlay d'onboarding global (app/components/OnboardingOverlay.tsx)
      // s'affiche après un délai de 350ms côté client : un seul dismiss juste
      // après le goto peut le manquer si l'hydratation est lente (charge
      // système). Revérifié avant CHAQUE clic critique, comme ailleurs dans
      // ce fichier (cf. test 4).
      await dismissOnboardingIfPresent(page);
      await page.locator("#unlock-count").fill(count);
      await page.locator("#unlock-kind").selectOption(kind);
      if (kind === "duration") {
        await page.locator("#unlock-duration").fill(durationDays!);
      }
      await dismissOnboardingIfPresent(page);
      await page.getByRole("button", { name: "Générer" }).click();
      await expect(page.getByText(new RegExp(`${count} code\\(s\\) généré`))).toBeVisible({ timeout: 10_000 });
    }

    await generate("1", "lifetime");
    await generate("1", "duration", "7");
    await generate("1", "duration", "14");
    await generate("5", "lifetime");

    const lifetimeCodes = await queryTable<{ code: string; group_id: string }>(
      "access_codes",
      `group_id=eq.${groupId}&type=eq.lifetime&select=code,group_id`,
    );
    expect(lifetimeCodes.length).toBe(1 + 5); // 1 seul + le lot de 5
    expect(lifetimeCodes.every((c) => c.group_id === groupId)).toBe(true);

    const duration7 = await queryTable<{ code: string; duration_days: number; group_id: string }>(
      "access_codes",
      `group_id=eq.${groupId}&type=eq.duration&duration_days=eq.7&select=code,duration_days,group_id`,
    );
    expect(duration7.length).toBe(1);
    expect(duration7[0].group_id).toBe(groupId);
    duration7Code = duration7[0].code;

    const duration14 = await queryTable<{ duration_days: number; group_id: string }>(
      "access_codes",
      `group_id=eq.${groupId}&type=eq.duration&duration_days=eq.14&select=duration_days,group_id`,
    );
    expect(duration14.length).toBe(1);
    expect(duration14[0].duration_days).toBe(14);
    expect(duration14[0].group_id).toBe(groupId);

    // Isolation : ces codes n'existent nulle part dans les groupes fixtures
    // (jamais écrits là — aucun scénario de ce fichier ne les touche).
    const fixtureALeak = await queryTable("access_codes", `group_id=eq.${FIXTURE_GROUP_A}&select=code`);
    expect(fixtureALeak.length).toBe(0);
    const fixtureBLeak = await queryTable("access_codes", `group_id=eq.${FIXTURE_GROUP_B}&select=code`);
    expect(fixtureBLeak.length).toBe(0);
  });

  test("10. Membre active le code durée=7j : la période démarre à l'ACTIVATION (pas à la création), dure exactement 7 jours", async ({
    page,
  }) => {
    const codeRow = await queryTable<{ created_at: string }>("access_codes", `code=eq.${duration7Code}&select=created_at`);
    const codeCreatedAt = new Date(codeRow[0].created_at).getTime();

    await loginAs(page, MEMBER_A);
    const beforeActivation = Date.now();
    await page.goto("/fr/activer-code", { waitUntil: "domcontentloaded" });
    await page.locator("#code").fill(duration7Code);
    await page.getByRole("button", { name: "Activer" }).click();
    await page.waitForURL(/\/fr\/?(\?.*)?$/, { timeout: 10_000 });
    const afterActivation = Date.now();

    memberAId = await getUserIdByEmail(MEMBER_A);
    const subs = await queryTable<{ current_period_end: string }>(
      "subscriptions",
      `user_id=eq.${memberAId}&select=current_period_end`,
    );
    expect(subs.length).toBe(1);
    const periodEnd = new Date(subs[0].current_period_end).getTime();

    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const toleranceMs = 60 * 1000; // ±1 minute autour du moment mesuré de l'activation

    // Preuve positive : fin de période = activation + 7 jours (tolérance serrée).
    expect(periodEnd).toBeGreaterThanOrEqual(beforeActivation + sevenDaysMs - toleranceMs);
    expect(periodEnd).toBeLessThanOrEqual(afterActivation + sevenDaysMs + toleranceMs);

    // Preuve négative : si la durée démarrait (à tort) à la CRÉATION du code,
    // periodEnd vaudrait codeCreatedAt + 7 jours — cette valeur doit être
    // nettement différente. Comparaison seulement si le délai
    // création→activation dépasse la tolérance (sinon la distinction n'a pas
    // de sens : les deux hypothèses seraient numériquement trop proches).
    if (Math.abs(beforeActivation - codeCreatedAt) > toleranceMs * 2) {
      const wouldBeIfFromCreation = codeCreatedAt + sevenDaysMs;
      expect(Math.abs(periodEnd - wouldBeIfFromCreation)).toBeGreaterThan(toleranceMs);
    }
  });

  test("11. Group Admin génère un code de points à valeur >100 000 et un lot de 150 codes — isolation confirmée", async ({
    page,
  }) => {
    await loginAs(page, ADMIN_A);
    await page.goto(`/fr/master/${groupId}/codes`, { waitUntil: "domcontentloaded" });
    await dismissOnboardingIfPresent(page);

    const HIGH_VALUE = 500_000;
    await page.locator("#gen-count").fill("1");
    await page.locator("#gen-value").fill(String(HIGH_VALUE));
    await dismissOnboardingIfPresent(page);
    await page.getByRole("button", { name: "Générer" }).click();
    await expect(page.getByText(/1 code\(s\) généré/)).toBeVisible({ timeout: 10_000 });

    const highValueCodes = await queryTable<{ points_value: number; group_id: string }>(
      "points_codes",
      `group_id=eq.${groupId}&points_value=eq.${HIGH_VALUE}&select=points_value,group_id`,
    );
    expect(highValueCodes.length).toBe(1);
    expect(highValueCodes[0].group_id).toBe(groupId);

    const BATCH_VALUE = 77; // valeur distincte pour isoler précisément ce lot
    const BATCH_COUNT = 150;
    await page.locator("#gen-count").fill(String(BATCH_COUNT));
    await page.locator("#gen-value").fill(String(BATCH_VALUE));
    await dismissOnboardingIfPresent(page);
    await page.getByRole("button", { name: "Générer" }).click();
    await expect(page.getByText(new RegExp(`${BATCH_COUNT} code\\(s\\) généré`))).toBeVisible({ timeout: 20_000 });

    const batchCodes = await queryTable<{ group_id: string }>(
      "points_codes",
      `group_id=eq.${groupId}&points_value=eq.${BATCH_VALUE}&select=group_id`,
    );
    expect(batchCodes.length).toBe(BATCH_COUNT);
    expect(batchCodes.every((c) => c.group_id === groupId)).toBe(true);

    const fixtureALeak = await queryTable("points_codes", `group_id=eq.${FIXTURE_GROUP_A}&select=code`);
    expect(fixtureALeak.length).toBe(0);
    const fixtureBLeak = await queryTable("points_codes", `group_id=eq.${FIXTURE_GROUP_B}&select=code`);
    expect(fixtureBLeak.length).toBe(0);
  });

  test("12. Membre refusé : solde insuffisant pour un article plus cher que son solde", async ({ page }) => {
    await loginAs(page, ADMIN_A);
    await page.goto(`/fr/master/${groupId}/magasin`, { waitUntil: "domcontentloaded" });
    await dismissOnboardingIfPresent(page);
    await page.getByRole("button", { name: "Nouvel article" }).click();
    await page.getByLabel("Nom").first().fill("Produit Trop Cher E2E");
    await page.getByLabel(/Prix/).fill("999999");
    await page.getByRole("button", { name: "Créer" }).click();
    await expect(page.locator("tr", { hasText: "Produit Trop Cher E2E" })).toBeVisible({ timeout: 10_000 });

    await loginAs(page, MEMBER_A);
    await page.goto(`/fr/fidelite/${groupId}`, { waitUntil: "domcontentloaded" });
    await dismissOnboardingIfPresent(page);
    const card = page.locator(".rounded-2xl.border", { hasText: "Produit Trop Cher E2E" });
    // Le solde est déjà connu côté client (balance passée en props) : le
    // bouton est désactivé et relabellisé "Solde insuffisant" AVANT toute
    // tentative d'achat (app/[locale]/fidelite/_components/MemberShop.tsx,
    // affordable = balance >= item.price_points) — il n'y a donc jamais de
    // clic possible ni de message d'erreur serveur à attendre ici, seule la
    // garde CLIENT est observable dans ce scénario.
    const buyButton = card.getByRole("button", { name: "Solde insuffisant" });
    await expect(buyButton).toBeVisible({ timeout: 10_000 });
    await expect(buyButton).toBeDisabled();

    const items = await queryTable<{ id: string }>(
      "group_shop_items",
      `group_id=eq.${groupId}&name=eq.${encodeURIComponent("Produit Trop Cher E2E")}&select=id`,
    );
    const purchases = await queryTable("group_shop_purchases", `item_id=eq.${items[0].id}&select=id`);
    expect(purchases.length).toBe(0);
  });

  test.afterAll(async () => {
    if (!groupId) return; // le groupe n'a jamais été créé — rien à nettoyer
    try {
      await deleteRows("group_shop_purchases", `group_id=eq.${groupId}`);
      await deleteRows("group_shop_items", `group_id=eq.${groupId}`);
      await deleteRows("points_ledger", `group_id=eq.${groupId}`);
      await deleteRows("points_codes", `group_id=eq.${groupId}`);
      await deleteRows("access_codes", `group_id=eq.${groupId}`);
      await deleteRows("group_memberships", `group_id=eq.${groupId}`);
      await deleteRows("partner_groups", `id=eq.${groupId}`);
      if (memberAId) {
        await deleteRows("subscriptions", `user_id=eq.${memberAId}`);
      }
    } catch (e) {
      console.error(`[cleanup] échec du nettoyage du groupe de test ${groupId} : ${(e as Error).message}`);
    }
  });
});
