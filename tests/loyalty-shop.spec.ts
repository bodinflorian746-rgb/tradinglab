import { test, expect, type Page } from "@playwright/test";

// Parcours E2E du magasin de fidélité + Mon compte (rattachement de groupe,
// état d'abonnement) + codes d'accès Super Admin (durée).
//
// Deux familles de tests dans ce fichier, selon le mécanisme d'authentification :
//   • DEV_AUTH_BYPASS=true requis (voir lib/dev-auth.ts) : "Master — ...",
//     "Fidélité — magasin membre", "Responsive — mobile / magasin manager".
//     Non exécutable dans un environnement local configuré avec
//     DEV_AUTH_BYPASS=false (cf. .env.development.local — choix assumé de CE
//     dépôt pour tester de vraies sessions par persona) : limitation connue,
//     sans rapport avec le contenu de ce fichier.
//   • Vraie session (personas @dev.local, scripts/seed-smoke-test-personas.js) :
//     tout le reste — fonctionne indépendamment de DEV_AUTH_BYPASS.
//
// Groupe de test « legacy » (bypass) : a0000000-0000-4000-8000-000000000001.
const GROUP_ID = "a0000000-0000-4000-8000-000000000001";

const PASSWORD = "DevRecette123!";

// Modale d'onboarding globale ("Bienvenue sur TradeScaleX", app/components/
// OnboardingOverlay.tsx) affichée à toute session fraîche tant que
// localStorage["tradinglab_onboarding_v1"] n'est pas posé — intercepte les
// clics tant qu'elle n'est pas fermée. Sans rapport avec ce correctif : même
// pattern de pré-désactivation que le reste de la suite (cf.
// tests/profil-trader-mobile.spec.ts et al.).
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem("tradinglab_onboarding_v1", "done");
    } catch {}
  });
});

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
  // Le formulaire déclenche lui-même router.push() après signInWithPassword —
  // on attend CE redirect (garantit que le cookie de session est posé) avant
  // notre propre navigation, plutôt que de partir en course avec lui.
  await page.waitForURL((url) => !url.pathname.includes("/auth/login"), { timeout: 15_000 });
  await page.goto("/fr", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("nav-account-trigger")).toBeVisible({ timeout: 15_000 });
}

// ─── Helpers service_role (lecture/écriture des postconditions + fixtures
// jetables) — valeurs par défaut = projet Supabase LOCAL standard, publiques
// et documentées par la CLI, jamais un secret de production.
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

// Reproduit exactement le calcul de lib/auth/premium.ts#isPremium (non modifié
// par ce correctif) pour un persona donné, afin de vérifier que son état
// affiché reste correct — sans figer un texte en dur qui dépendrait de la
// fraîcheur de la fenêtre d'essai 48h du fixture au moment du test.
async function expectedSubscriptionText(userId: string): Promise<string> {
  const subs = await svcFetch(
    `/rest/v1/subscriptions?user_id=eq.${userId}&select=status,current_period_end,cancel_at_period_end`,
  );
  const sub = subs.body[0];
  const now = Date.now();
  if (sub && (sub.status === "active" || sub.status === "trialing")) {
    const periodEnd = sub.current_period_end ? new Date(sub.current_period_end).getTime() : null;
    if (periodEnd && periodEnd > now) {
      return sub.cancel_at_period_end
        ? "Il ne sera pas renouvelé."
        : "Ton abonnement est actif.";
    }
  }
  const userRes = await svcFetch(`/auth/v1/admin/users/${userId}`);
  const confirmedAt = userRes.body.email_confirmed_at as string | null;
  if (confirmedAt) {
    const trialEnd = new Date(confirmedAt).getTime() + 48 * 60 * 60 * 1000;
    if (trialEnd > now) return "Essai gratuit en cours.";
  }
  return "Tu n'as pas d'abonnement actif.";
}

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

    await row.getByRole("button", { name: "Modifier" }).click();
    const editedName = `${itemName} (modifié)`;
    const nameInput = page.getByLabel("Nom").first();
    await nameInput.fill(editedName);
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.locator("tr", { hasText: editedName })).toBeVisible({ timeout: 10_000 });

    const editedRow = page.locator("tr", { hasText: editedName });
    await editedRow.getByRole("button", { name: "Désactiver" }).click();
    await expect(editedRow.getByText("Inactif")).toBeVisible({ timeout: 10_000 });

    await editedRow.getByRole("button", { name: "Activer" }).click();
    await expect(editedRow.getByText("Actif")).toBeVisible({ timeout: 10_000 });
  });

  test("un formulaire vide ne peut pas être soumis (validation client)", async ({ page }) => {
    await page.goto(`/fr/master/${GROUP_ID}/magasin`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Nouvel article" }).click();
    await expect(page.getByRole("button", { name: "Créer" })).toBeDisabled();
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

test.describe("Responsive — mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("le magasin manager reste utilisable en mobile", async ({ page }) => {
    await page.goto(`/fr/master/${GROUP_ID}/magasin`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Magasin" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Nouvel article" })).toBeVisible();
  });
});

// ─── Mes points — plus aucun rattachement de groupe ici ──────────────────────
test.describe("Fidélité — Mes points (vraie session)", () => {
  test("aucun code GRP, aucune mention Master/Telegram, code PTS + soldes visibles", async ({ page }) => {
    await loginAs(page, "admin.a@dev.local");
    await page.goto("/fr/fidelite", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("tab", { name: "Rejoindre un groupe" })).toHaveCount(0);
    await expect(page.getByPlaceholder("GRP-XXXX-XXXX")).toHaveCount(0);
    await expect(page.getByText("Master")).toHaveCount(0);
    await expect(page.getByText("Telegram")).toHaveCount(0);

    await expect(page.getByPlaceholder("PTS-XXXX-XXXX")).toBeVisible();
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

  test("utilisateur sans groupe : état vide, plus de mention d'onglet", async ({ page }) => {
    await loginAs(page, "user.normal@dev.local");
    await page.goto("/fr/fidelite", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Tu n'as rejoint aucun groupe.")).toBeVisible();
    await expect(page.getByText("Rejoins un groupe depuis la page Mon compte.")).toBeVisible();
  });
});

// ─── Mon compte — abonnement + groupe de fidélité ─────────────────────────────
test.describe("Mon compte — abonnement", () => {
  test("Super Admin : accès Super Admin actif", async ({ page }) => {
    await loginAs(page, "superadmin@dev.local");
    await page.goto("/fr/compte", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Accès Super Admin actif")).toBeVisible();
  });

  test("utilisateur normal : état d'abonnement inchangé par le correctif admin", async ({ page }) => {
    const userId = await findUserIdByEmail("user.normal@dev.local");
    const expectedText = await expectedSubscriptionText(userId);
    await loginAs(page, "user.normal@dev.local");
    await page.goto("/fr/compte", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(expectedText)).toBeVisible();
    await expect(page.getByText("Accès Super Admin actif")).toHaveCount(0);
  });
});

test.describe("Mon compte — groupe de fidélité", () => {
  test("utilisateur sans groupe : formulaire GRP visible", async ({ page }) => {
    await loginAs(page, "user.normal@dev.local");
    await page.goto("/fr/compte", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Groupe de fidélité")).toBeVisible();
    await expect(page.getByPlaceholder("GRP-XXXX-XXXX")).toBeVisible();
    await expect(page.getByRole("button", { name: "Rejoindre le groupe" })).toBeVisible();
  });

  test("utilisateur admin d'un groupe : groupe affiché, aucun bouton Quitter (rôle admin)", async ({
    page,
  }) => {
    await loginAs(page, "admin.a@dev.local");
    await page.goto("/fr/compte", { waitUntil: "domcontentloaded" });
    const row = page.locator("div", { hasText: "Groupe A — Recette" }).last();
    await expect(row).toBeVisible();
    await expect(page.getByText("Administrateur", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Quitter ce groupe" })).toHaveCount(0);
  });

  test("utilisateur admin de plusieurs groupes : tous affichés", async ({ page }) => {
    await loginAs(page, "admin.ab@dev.local");
    await page.goto("/fr/compte", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Groupe A — Recette")).toBeVisible();
    await expect(page.getByText("Groupe B — Recette")).toBeVisible();
  });

  test("quitter une adhésion member, puis rejoindre un autre groupe", async ({ page }) => {
    const stamp = Date.now();
    // Fixtures jetables : groupe + compte de test, role='member' — jamais les
    // personas partagées (member.a/b sont réutilisées par d'autres specs).
    const groupId = crypto.randomUUID();
    await svcFetch("/rest/v1/partner_groups", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify([{ id: groupId, name: `Groupe Départ ${stamp}`, slug: `groupe-depart-${stamp}` }]),
    });
    await svcFetch(`/rest/v1/partner_group_settings`, {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify([{ group_id: groupId, reference_code: `GRP-DPRT-${stamp % 10000}` }]),
    });
    const userRes = await svcFetch("/auth/v1/admin/users", {
      method: "POST",
      body: JSON.stringify({
        email: `leave-test-${stamp}@tradescalex-internal-test.invalid`,
        password: `LeaveTest!${stamp}`,
        email_confirm: true,
      }),
    });
    const userId = userRes.body.id as string;
    await svcFetch("/rest/v1/group_memberships", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify([{ group_id: groupId, user_id: userId, role: "member", status: "active" }]),
    });

    try {
      // Session réelle via mot de passe direct (pas loginAs : compte jetable,
      // pas une persona @dev.local avec le mot de passe partagé standard).
      await page.goto("/fr/auth/login", { waitUntil: "load" });
      await page.locator("#email").fill(`leave-test-${stamp}@tradescalex-internal-test.invalid`);
      await page.locator("#password").fill(`LeaveTest!${stamp}`);
      const [authResponse] = await Promise.all([
        page.waitForResponse((r) => r.url().includes("/auth/v1/token") && r.request().method() === "POST"),
        page.getByRole("button", { name: "Se connecter" }).click(),
      ]);
      expect(authResponse.ok()).toBe(true);

      await page.goto("/fr/compte", { waitUntil: "domcontentloaded" });
      await expect(page.getByText(`Groupe Départ ${stamp}`)).toBeVisible();

      await page.getByRole("button", { name: "Quitter ce groupe" }).click();
      await expect(page.getByText("Confirmer ?")).toBeVisible();
      await page.getByRole("button", { name: "Oui, quitter" }).click();

      // Après départ : plus dans la liste, formulaire de rattachement toujours utilisable.
      await expect(page.getByText(`Groupe Départ ${stamp}`)).toHaveCount(0, { timeout: 10_000 });
      await expect(page.getByPlaceholder("GRP-XXXX-XXXX")).toBeEditable();

      const check = await svcFetch(
        `/rest/v1/group_memberships?group_id=eq.${groupId}&user_id=eq.${userId}&select=id`,
      );
      expect(check.body.length).toBe(0);
    } finally {
      await svcFetch(`/rest/v1/group_memberships?group_id=eq.${groupId}`, { method: "DELETE" });
      await svcFetch(`/rest/v1/partner_group_settings?group_id=eq.${groupId}`, { method: "DELETE" });
      await svcFetch(`/rest/v1/partner_groups?id=eq.${groupId}`, { method: "DELETE" });
      await svcFetch(`/auth/v1/admin/users/${userId}`, { method: "DELETE" });
    }
  });
});

// ─── Codes d'accès Super Admin — durée ────────────────────────────────────────
test.describe("Codes d'accès Super Admin — durée", () => {
  test("génère lifetime, 7j, 14j, 30j et une durée personnalisée ; duration_days correct", async ({
    page,
  }) => {
    await loginAs(page, "superadmin@dev.local");
    await page.goto("/fr/admin/codes", { waitUntil: "domcontentloaded" });

    async function generate(type: string, opts?: { preset?: string; custom?: string }) {
      await page.locator("#type").selectOption(type);
      if (opts?.preset) await page.getByRole("button", { name: opts.preset }).click();
      if (opts?.custom) {
        await page.getByRole("button", { name: "Durée personnalisée" }).click();
        await page.getByLabel("Durée personnalisée (jours)").fill(opts.custom);
      }
      await page.getByRole("button", { name: "Générer" }).click();
      await expect(page.getByText(/\d+ codes? générés?\./)).toBeVisible({ timeout: 10_000 });
    }

    await generate("lifetime");
    await expect(page.locator("tr", { hasText: "À vie" }).first()).toBeVisible();

    await generate("duration", { preset: "7 jours" });
    await expect(page.locator("tr", { hasText: "7 jours" }).first()).toBeVisible({ timeout: 10_000 });

    await generate("duration", { preset: "14 jours" });
    await expect(page.locator("tr", { hasText: "14 jours" }).first()).toBeVisible({ timeout: 10_000 });

    await generate("duration", { preset: "30 jours" });
    await expect(page.locator("tr", { hasText: "30 jours" }).first()).toBeVisible({ timeout: 10_000 });

    await generate("duration", { custom: "45" });
    await expect(page.locator("tr", { hasText: "45 jours" }).first()).toBeVisible({ timeout: 10_000 });
  });

  test("génération en lot (plusieurs codes en un seul appel)", async ({ page }) => {
    await loginAs(page, "superadmin@dev.local");
    await page.goto("/fr/admin/codes", { waitUntil: "domcontentloaded" });

    await page.locator("#count").fill("5");
    await page.locator("#type").selectOption("lifetime");
    await page.getByRole("button", { name: "Générer" }).click();
    await expect(page.getByText("5 codes générés.")).toBeVisible({ timeout: 10_000 });
  });
});
