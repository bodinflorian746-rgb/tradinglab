import { test, expect } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

const ES_PAGES = [
  { url: "/es",                                    label: "home"               },
  { url: "/es/pricing",                            label: "pricing"            },
  { url: "/es/access",                             label: "access"             },
  { url: "/es/jeux",                               label: "jeux"               },
  { url: "/es/profil-trader",                      label: "profil-trader"      },
  { url: "/es/formations",                         label: "formations"         },
  { url: "/es/strategies",                         label: "strategies"         },
  { url: "/es/strategies/ict",                     label: "strategies-ict"     },
  { url: "/es/strategies/price-action",            label: "strategies-pa"      },
  { url: "/es/formations/macro",                   label: "formations-macro"   },
  { url: "/es/formations/debutant/lecon1",         label: "lecon-debutant1"    },
  { url: "/es/strategies/ict/lecon1",              label: "lecon-ict1"         },
];

for (const { url, label } of ES_PAGES) {
  test(`ES mobile — ${label} : zero overflow + zero erreur console`, async ({ page, context }) => {
    await context.addInitScript(() => {
      try { window.localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch {}
    });
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(String(err)));
    page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });

    const response = await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    expect(response?.status()).toBeLessThan(400);

    const { docW, viewW, lang } = await page.evaluate(() => ({
      docW: document.documentElement.scrollWidth,
      viewW: window.innerWidth,
      lang: document.documentElement.lang,
    }));
    const overflow = docW - viewW;
    console.log(`[${url}] lang=${lang} viewport=${viewW} doc=${docW} overflow=${overflow}px`);
    expect(lang).toBe("es");
    expect(overflow, "no overflow > 4px sur ES").toBeLessThanOrEqual(4);
    expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);

    await page.screenshot({ path: `test-results/es-${label}.png`, fullPage: true });
  });
}

test("ES — navbar mobile : libellés traduits", async ({ page, context }) => {
  await context.addInitScript(() => {
    try { window.localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch {}
  });
  // /es/access est une page minimale → pas de pollution de liens "Trading"
  // dans le body, donc la navbar reste seule cible des getByRole link.
  await page.goto("/es/access", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  // Ouvrir le menu burger
  await page.getByRole("button", { name: /Abrir menú/i }).click();
  await expect(page.getByRole("link", { name: "Trading", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Juegos", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Estrategias", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Mi perfil", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Precios", exact: true })).toBeVisible();
  await page.screenshot({ path: "test-results/es-navbar-mobile.png", fullPage: false });
});

test("ES — onboarding overlay : step 1 affiche les bons libellés", async ({ page, context }) => {
  // Ne PAS pré-marquer l'onboarding done — on veut qu'il s'affiche
  await context.addInitScript(() => {
    try { window.localStorage.removeItem("tradinglab_onboarding_v1"); } catch {}
  });
  await page.goto("/es", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.waitForTimeout(700); // attendre le délai d'affichage (350ms)

  await expect(page.getByRole("dialog", { name: /Bienvenido a TradeScaleX/i })).toBeVisible();
  await expect(page.getByText(/Una plataforma pensada para las verdaderas limitaciones/i)).toBeVisible();
  await page.screenshot({ path: "test-results/es-onboarding-step1.png", fullPage: false });

  // Aller à l'étape 2
  await page.getByRole("button", { name: /^Empezar$/ }).first().click();
  await page.waitForTimeout(200);
  await expect(page.getByText(/¿Por dónde quieres empezar\?/i)).toBeVisible();
  await expect(page.getByText(/Empezar por las bases/i)).toBeVisible();
  await page.screenshot({ path: "test-results/es-onboarding-step2.png", fullPage: false });
});

test("ES — pricing : prix + features traduits, 19€/mes visible", async ({ page, context }) => {
  await context.addInitScript(() => {
    try { window.localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch {}
  });
  await page.goto("/es/pricing", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  await expect(page.getByText("Una tarifa simple y transparente")).toBeVisible();
  await expect(page.getByText(/Acceso gratis vía un broker partner TradeScaleX/i)).toBeVisible();
  await expect(page.getByText("Recomendado")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Vía broker partner" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Acceso directo" })).toBeVisible();
  await expect(page.getByText("19€").first()).toBeVisible();
  await expect(page.getByText(/Ya tengo un código de acceso/i)).toBeVisible();
  await page.screenshot({ path: "test-results/es-pricing-mobile.png", fullPage: true });
});

test("ES — strategies index : modules traduits", async ({ page, context }) => {
  await context.addInitScript(() => {
    try { window.localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch {}
  });
  await page.goto("/es/strategies", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  await expect(page.getByText(/Aprende a tradear/i).first()).toBeVisible();
  await expect(page.getByText("Price Action")).toBeVisible();
  await expect(page.getByText(/ICT completo/i)).toBeVisible();
  await expect(page.getByText("Macro Trading").first()).toBeVisible();
  await expect(page.getByText(/SMC: Pensar como institucional/i)).toBeVisible();
  await page.screenshot({ path: "test-results/es-strategies.png", fullPage: true });
});

test("ES — module ICT : leçons traduites", async ({ page, context }) => {
  await context.addInitScript(() => {
    try { window.localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch {}
  });
  await page.goto("/es/strategies/ict", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  await expect(page.getByRole("heading", { name: "ICT completo" })).toBeVisible();
  await expect(page.getByText(/El arsenal institucional pro/i)).toBeVisible();
  await expect(page.getByText(/Entender el modelo ICT: liquidity y manipulación/i)).toBeVisible();
  await expect(page.getByText(/Killzones: cuándo se mueve de verdad el mercado/i)).toBeVisible();
  await page.screenshot({ path: "test-results/es-strategies-ict.png", fullPage: true });
});

test("ES — formations index : labels modules + leçons traduits", async ({ page, context }) => {
  await context.addInitScript(() => {
    try { window.localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch {}
  });
  await page.goto("/es/formations", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  // Module Principiante doit apparaître (au lieu de "Débutant")
  await expect(page.getByRole("heading", { name: "Principiante" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Intermedio" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Avanzado" })).toBeVisible();
  await page.screenshot({ path: "test-results/es-formations.png", fullPage: true });
});

test("ES — leçon débutant 1 : chrome LessonPage traduit (breadcrumb + bouton terminer)", async ({ page, context }) => {
  // Les pages /formations/{level}/leconN passent par LessonPage → chrome i18n.
  // Les pages /strategies/{module}/leconN sont en JSX custom → contenu FR (V1.1).
  await context.addInitScript(() => {
    try { window.localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch {}
  });
  // lecon2 utilise DebutantLessonView qui passe par LessonPage (le chrome i18n).
  // lecon1 est en JSX custom et n'utilise pas LessonPage.
  await page.goto("/es/formations/debutant/lecon2", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await expect(page.getByRole("link", { name: "Cursos" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Marcar lección como completada/i })).toBeVisible();
  await page.screenshot({ path: "test-results/es-lecon-debutant2.png", fullPage: true });
});

test("ES — jeux : index traduit", async ({ page, context }) => {
  await context.addInitScript(() => {
    try { window.localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch {}
  });
  await page.goto("/es/jeux", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  await expect(page.getByRole("heading", { name: "Entrénate" })).toBeVisible();
  await expect(page.getByText("Disponible ahora")).toBeVisible();
  await expect(page.getByText("Próximamente")).toBeVisible();
  await expect(page.getByText("Jugar ahora").first()).toBeVisible();
  await expect(page.getByText("Coloca tu Stop")).toBeVisible();
  await page.screenshot({ path: "test-results/es-jeux-mobile.png", fullPage: true });
});
