import { test, expect } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try { window.localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch {}
  });
});

test("mobile — /profil-trader (état vide)", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("pageerror", (err) => consoleErrors.push(String(err)));
  page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });

  await page.goto("/profil-trader", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  const { docW, viewW } = await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    viewW: window.innerWidth,
  }));
  console.log(`[/profil-trader] viewport=${viewW} doc=${docW} overflow=${docW - viewW}px`);
  expect(docW - viewW).toBeLessThanOrEqual(4);

  // État vide : message d'invitation à jouer
  await expect(page.getByText(/Ton profil se construit en jouant/i)).toBeVisible();
  expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);
});

// ⚠️ Comportement changé par le refactor nav "premium minimaliste" : "Mon
// profil" a été déplacé dans le menu compte (avatar/e-mail), lui-même réservé
// aux utilisateurs connectés. Pour un visiteur non connecté (le seul état
// exercé par cette suite E2E, faute de fixture de login), le lien n'apparaît
// donc plus du tout dans la nav — ce test vérifie ce nouvel état plutôt que
// l'ancien accès direct. La page /profil-trader reste atteignable par URL
// directe (state vide géré, cf. test ci-dessus) ; seul le raccourci de nav
// pour les invités a disparu, conformément à la demande explicite.
//
// Navigation explicite vers "/fr" (pas "/") : Playwright Test résout
// navigator.languages en "en-US" par défaut (comportement du test runner,
// indépendant de la locale OS — cf. playwright.config.ts qui ne fixe pas
// `locale: "fr-FR""), ce qui ferait atterrir un `goto("/")` sur /en et
// invaliderait tout matching de texte français. Ce n'est pas lié au refactor
// nav ; on le contourne ici en ciblant directement /fr.
test("navbar — 'Mon profil' n'apparaît plus dans la nav pour un visiteur non connecté", async ({ page }) => {
  await page.goto("/fr", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  // Ouvrir le menu mobile (burger) — via data-testid, indépendant de la locale.
  await page.getByTestId("nav-burger").click();
  await page.waitForTimeout(200);

  // Scopé à <nav> : le footer du site a son propre lien "Mon profil" (section
  // "Compte", hors périmètre de ce refactor) — non concerné par cette règle.
  await expect(page.locator("nav").getByRole("link", { name: /Mon profil/i })).toHaveCount(0);
  // Le visiteur voit en revanche Connexion / Créer un compte.
  await expect(page.locator("nav").getByRole("link", { name: /Connexion/i })).toBeVisible();
});

test("tracking — jouer un round BUY/SELL/NO TRADE alimente le profil", async ({ page }) => {
  // 1. Joue 1 round dans BSNT pour générer un event
  await page.goto("/jeux/buy-sell-no-trade", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.getByRole("button", { name: /Débutant/ }).click();
  await page.getByRole("button", { name: /^BUY$/ }).click();
  await expect(page.getByRole("button", { name: /Scénario suivant|Voir le bilan/i })).toBeVisible({ timeout: 8000 });

  // 2. Vérifier que localStorage contient bien un event
  const eventsCount = await page.evaluate(() => {
    const raw = window.localStorage.getItem("tradinglab.profile.v1");
    if (!raw) return 0;
    try {
      const parsed = JSON.parse(raw);
      return parsed.events?.length ?? 0;
    } catch {
      return 0;
    }
  });
  expect(eventsCount, "1 event au moins dans localStorage").toBeGreaterThanOrEqual(1);

  // 3. Visiter /profil-trader → ne doit plus être en état vide
  await page.goto("/profil-trader", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  // Le profil affiche maintenant un profil principal (pas "Ton profil se construit")
  await expect(page.getByText(/Profil principal/i)).toBeVisible({ timeout: 5000 });
  // Le compteur d'events trackés est >= 1
  await expect(page.getByText("Events trackés")).toBeVisible();
});

test("tracking — 5 rounds alimentent les compétences", async ({ page }) => {
  // Injecter directement des events dans localStorage pour simuler 12 rounds
  await page.goto("/profil-trader", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  await page.evaluate(() => {
    const events = [];
    const skills = ["discipline", "lecture_marche", "gestion_risque", "structure", "patience"];
    const games = ["buy-sell-no-trade", "place-stop", "find-the-mistake", "build-the-trade"];
    const difficulties = ["beginner", "intermediate", "advanced"];
    const now = Date.now();
    for (let i = 0; i < 15; i++) {
      events.push({
        game:       games[i % games.length],
        timestamp:  now - (15 - i) * 60000,
        difficulty: difficulties[i % difficulties.length],
        skill:      skills[i % skills.length],
        outcome:    i % 3 === 0 ? "loss" : "win",
      });
    }
    window.localStorage.setItem("tradinglab.profile.v1", JSON.stringify({ version: 1, events }));
  });

  // Reload pour que la page lit le nouveau state
  await page.reload();
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  // Compétences visibles
  await expect(page.getByText("Compétences").first()).toBeVisible();
  await expect(page.getByText("Discipline").first()).toBeVisible();

  // Le total events est affiché et non-nul (15 injectés)
  await expect(page.getByText("15")).toBeVisible({ timeout: 3000 });
});

test("screenshot — profil avec données", async ({ page }) => {
  await page.goto("/profil-trader", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  // Injecter ~30 events pour avoir un profil bien rempli
  await page.evaluate(() => {
    const events = [];
    const skills = ["discipline", "lecture_marche", "gestion_risque", "timing", "liquidite", "structure", "psychologie", "execution", "patience", "rr_management"];
    const games = ["buy-sell-no-trade", "place-stop", "find-the-mistake", "build-the-trade"];
    const difficulties = ["beginner", "intermediate", "advanced"];
    const now = Date.now();
    for (let i = 0; i < 35; i++) {
      // Pour avoir une vraie force et une vraie faiblesse :
      // discipline souvent loss, structure souvent win
      const skill = skills[i % skills.length];
      let outcome = "win";
      if (skill === "discipline" && i % 3 !== 0) outcome = "loss";
      if (skill === "structure")                outcome = "win";
      if (skill === "timing"     && i % 2 === 0) outcome = "loss";
      events.push({
        game:       games[i % games.length],
        timestamp:  now - (35 - i) * 30000,
        difficulty: difficulties[i % difficulties.length],
        skill,
        outcome,
      });
    }
    window.localStorage.setItem("tradinglab.profile.v1", JSON.stringify({ version: 1, events }));
  });

  await page.reload();
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.screenshot({ path: "test-results/profil-trader-mobile.png", fullPage: true });
});
