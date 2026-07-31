import { test, expect, type Page } from "@playwright/test";

// Parcours E2E du suivi minimal des commandes (espace Master / Group Admin) :
// liste, client/produit/date/prix, bouton "Marquer comme livrée", isolation
// multi-tenant. Fixtures 100% jetables (groupe + article + acheteur dédiés),
// créées/nettoyées via service_role — n'affecte aucune fixture partagée par
// les autres specs (Groupe A/B — Recette restent intacts).
//
// DEV_AUTH_BYPASS=false dans cet environnement (choix assumé de ce dépôt,
// cf. tests/loyalty-shop.spec.ts) : toutes les sessions ici sont de vraies
// connexions par persona @dev.local.

const PASSWORD = "DevRecette123!";

const REST_URL = process.env.NEW_SUPABASE_URL || "http://127.0.0.1:54321";
const SERVICE_KEY =
  process.env.NEW_SERVICE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

async function svcFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${REST_URL}${path}`, {
    ...init,
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function findUserIdByEmail(email: string): Promise<string> {
  const res = await svcFetch("/auth/v1/admin/users?per_page=200");
  const user = (res.body.users ?? []).find((u: { email?: string }) => u.email === email);
  if (!user) throw new Error(`Persona introuvable en base locale: ${email}`);
  return user.id as string;
}

async function loginAs(page: Page, email: string, password = PASSWORD) {
  await page.goto("/fr/auth/login", { waitUntil: "load" });
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  const [authResponse] = await Promise.all([
    page.waitForResponse((r) => r.url().includes("/auth/v1/token") && r.request().method() === "POST"),
    page.getByRole("button", { name: "Se connecter" }).click(),
  ]);
  if (!authResponse.ok()) throw new Error(`Echec signInWithPassword pour ${email}: HTTP ${authResponse.status()}`);
  await page.waitForURL((url) => !url.pathname.includes("/auth/login"), { timeout: 15_000 });
}

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem("tradinglab_onboarding_v1", "done");
    } catch {}
  });
});

test.describe("Master — Commandes", () => {
  let groupId: string;
  let freeItemId: string;
  let paidItemId: string;
  let buyerId: string;
  let paidOrderId: string;
  let adminAId: string;
  const stamp = Date.now();

  test.beforeAll(async () => {
    adminAId = await findUserIdByEmail("admin.a@dev.local");

    groupId = crypto.randomUUID();
    await svcFetch("/rest/v1/partner_groups", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify([{ id: groupId, name: `Groupe Commandes ${stamp}`, slug: `groupe-commandes-${stamp}` }]),
    });
    await svcFetch("/rest/v1/partner_group_settings", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify([{ group_id: groupId, reference_code: `GRP-ORD${stamp % 10000}-TEST` }]),
    });
    await svcFetch("/rest/v1/group_memberships", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify([{ group_id: groupId, user_id: adminAId, role: "admin", status: "active" }]),
    });

    const itemsRes = await svcFetch("/rest/v1/group_shop_items", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify([
        { group_id: groupId, name: "Article Gratuit Test", item_type: "product", price_points: 0, stock: null, status: "active" },
        { group_id: groupId, name: "Article Payant Test", item_type: "product", price_points: 150, stock: 10, status: "active" },
      ]),
    });
    freeItemId = itemsRes.body[0].id;
    paidItemId = itemsRes.body[1].id;

    const buyerRes = await svcFetch("/auth/v1/admin/users", {
      method: "POST",
      body: JSON.stringify({
        email: `orders-buyer-${stamp}@tradescalex-internal-test.invalid`,
        password: `Buyer!${stamp}`,
        email_confirm: true,
      }),
    });
    buyerId = buyerRes.body.id;
    await svcFetch("/rest/v1/group_memberships", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify([{ group_id: groupId, user_id: buyerId, role: "member", status: "active" }]),
    });

    const purchasesRes = await svcFetch("/rest/v1/group_shop_purchases", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify([
        { group_id: groupId, item_id: freeItemId, user_id: buyerId, price_paid: 0, idempotency_key: crypto.randomUUID() },
        { group_id: groupId, item_id: paidItemId, user_id: buyerId, price_paid: 150, idempotency_key: crypto.randomUUID() },
      ]),
    });
    paidOrderId = purchasesRes.body[1].id;
  });

  test.afterAll(async () => {
    await svcFetch(`/rest/v1/group_shop_purchases?group_id=eq.${groupId}`, { method: "DELETE" });
    await svcFetch(`/rest/v1/group_shop_items?group_id=eq.${groupId}`, { method: "DELETE" });
    await svcFetch(`/rest/v1/group_memberships?group_id=eq.${groupId}`, { method: "DELETE" });
    await svcFetch(`/rest/v1/partner_group_settings?group_id=eq.${groupId}`, { method: "DELETE" });
    await svcFetch(`/rest/v1/partner_groups?id=eq.${groupId}`, { method: "DELETE" });
    await svcFetch(`/auth/v1/admin/users/${buyerId}`, { method: "DELETE" });
  });

  test("achat gratuit et achat payant visibles, à traiter, avec client/produit/date/prix corrects", async ({ page }) => {
    await loginAs(page, "admin.a@dev.local");
    await page.goto(`/fr/master/${groupId}/commandes`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Commandes" })).toBeVisible();

    const freeRow = page.locator("tr", { hasText: "Article Gratuit Test" });
    await expect(freeRow).toBeVisible();
    await expect(freeRow).toContainText(`orders-buyer-${stamp}@tradescalex-internal-test.invalid`);
    await expect(freeRow).toContainText("Gratuit");
    await expect(freeRow).toContainText("À traiter");
    await expect(freeRow.getByRole("button", { name: "Marquer comme livrée" })).toBeVisible();

    const paidRow = page.locator("tr", { hasText: "Article Payant Test" });
    await expect(paidRow).toBeVisible();
    await expect(paidRow).toContainText(`orders-buyer-${stamp}@tradescalex-internal-test.invalid`);
    await expect(paidRow).toContainText("150");
    await expect(paidRow).toContainText("À traiter");
    await expect(paidRow.getByRole("button", { name: "Marquer comme livrée" })).toBeVisible();
  });

  test("Marquer comme livrée : la commande passe à Livrée, sans changement de points ni de stock", async ({ page }) => {
    const stockBefore = await svcFetch(`/rest/v1/group_shop_items?id=eq.${paidItemId}&select=stock`);
    const ledgerBefore = await svcFetch(`/rest/v1/points_ledger?group_id=eq.${groupId}&user_id=eq.${buyerId}&select=id`);

    await loginAs(page, "admin.a@dev.local");
    await page.goto(`/fr/master/${groupId}/commandes`, { waitUntil: "domcontentloaded" });

    const paidRow = page.locator("tr", { hasText: "Article Payant Test" });
    await paidRow.getByRole("button", { name: "Marquer comme livrée" }).click();

    await expect
      .poll(async () => {
        const r = await svcFetch(`/rest/v1/group_shop_purchases?id=eq.${paidOrderId}&select=status,delivered_at,price_paid`);
        return r.body[0]?.status;
      }, { timeout: 10_000 })
      .toBe("delivered");

    const order = await svcFetch(`/rest/v1/group_shop_purchases?id=eq.${paidOrderId}&select=status,delivered_at,price_paid`);
    expect(order.body[0].status).toBe("delivered");
    expect(order.body[0].delivered_at).not.toBeNull();
    expect(order.body[0].price_paid).toBe(150); // prix payé figé, jamais réécrit

    const stockAfter = await svcFetch(`/rest/v1/group_shop_items?id=eq.${paidItemId}&select=stock`);
    expect(stockAfter.body[0].stock).toBe(stockBefore.body[0].stock); // stock non touché

    const ledgerAfter = await svcFetch(`/rest/v1/points_ledger?group_id=eq.${groupId}&user_id=eq.${buyerId}&select=id`);
    expect(ledgerAfter.body.length).toBe(ledgerBefore.body.length); // aucun point recrédité/débité

    // Reste visible, maintenant marquée Livrée, plus de bouton.
    await page.reload({ waitUntil: "domcontentloaded" });
    const reloadedRow = page.locator("tr", { hasText: "Article Payant Test" });
    await expect(reloadedRow).toBeVisible();
    await expect(reloadedRow).toContainText("Livrée");
    await expect(reloadedRow.getByRole("button", { name: "Marquer comme livrée" })).toHaveCount(0);
  });

  test("isolation : un admin d'un AUTRE groupe est refusé (404)", async ({ page }) => {
    await loginAs(page, "admin.b@dev.local");
    const resp = await page.goto(`/fr/master/${groupId}/commandes`, { waitUntil: "domcontentloaded" });
    expect(resp?.status()).toBe(404);
  });

  test("un utilisateur normal (aucun groupe administré) est refusé (404)", async ({ page }) => {
    await loginAs(page, "user.normal@dev.local");
    const resp = await page.goto(`/fr/master/${groupId}/commandes`, { waitUntil: "domcontentloaded" });
    expect(resp?.status()).toBe(404);
  });

  test("le Super Admin est autorisé sur n'importe quel groupe", async ({ page }) => {
    await loginAs(page, "superadmin@dev.local");
    const resp = await page.goto(`/fr/master/${groupId}/commandes`, { waitUntil: "domcontentloaded" });
    expect(resp?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Commandes" })).toBeVisible();
  });

  test("affichage mobile", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript(() => {
      try {
        window.localStorage.setItem("tradinglab_onboarding_v1", "done");
      } catch {}
    });
    const page = await context.newPage();
    await loginAs(page, "admin.a@dev.local");
    await page.goto(`/fr/master/${groupId}/commandes`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Commandes" })).toBeVisible();
    await expect(page.locator("tr", { hasText: "Article Gratuit Test" }).first()).toBeVisible();
    await context.close();
  });
});
